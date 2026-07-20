import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Skeleton } from '../../components/skeleton/skeleton';
import { TourCard } from '../../components/tour-card/tour-card';
import { Tour } from '../../services/travel-api.service';

@Component({
  selector: 'app-destinos',
  imports: [CommonModule, FormsModule, RouterLink, Skeleton, TourCard],
  templateUrl: './destinos.html',
  styleUrl: '../page.css',
})
export class Destinos implements OnInit {
  readonly tours = signal<Tour[]>([]);
  readonly isLoading = signal(false);
  readonly searchTerm = signal('');
  readonly selectedCategory = signal('all');
  readonly selectedTourId = signal<string | null>(null);

  readonly visibleTours = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.tours().filter((tour) => {
      const matchesSearch =
        !term ||
        `${tour.title} ${tour.description} ${tour.durationDays} ${tour.category?.name ?? ''}`
          .toLowerCase()
          .includes(term);
      const matchesCategory =
        this.selectedCategory() === 'all' || tour.category?.name === this.selectedCategory();
      return matchesSearch && matchesCategory;
    });
  });

  readonly availableCategories = computed(() =>
    Array.from(
      new Set(this.tours().map((t) => t.category?.name).filter((c): c is string => !!c)),
    ),
  );

  readonly selectedTour = computed(() =>
    this.tours().find((tour) => tour.id === this.selectedTourId()) ?? null,
  );

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  ngOnInit(): void {
    this.title.setTitle('Destinos | Kusi Q\'umir');
    this.meta.updateTag({
      name: 'description',
      content:
        'Explora los destinos más emblemáticos del Perú: Cusco, Machu Picchu, Valle Sagrado, Arequipa, Titicaca y la selva amazónica.',
    });
    this.meta.updateTag({
      property: 'og:title',
      content: 'Destinos | Kusi Q\'umir',
    });
    this.meta.updateTag({
      property: 'og:description',
      content:
        'Desde la majestuosidad de Cusco hasta la selva amazónica, cada ruta diseñada para una experiencia auténtica.',
    });

    const data = this.route.snapshot.data['tours'] as Tour[] | undefined;
    if (data?.length) {
      this.tours.set(data);
      this.selectedTourId.set(this.tours()[0]?.id ?? null);
    }

    this.route.queryParams.subscribe((params) => {
      if (params['search']) this.searchTerm.set(params['search']);
      if (params['category']) this.selectedCategory.set(params['category']);
    });
  }

  onFilterChange(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.searchTerm() || null,
        category: this.selectedCategory() !== 'all' ? this.selectedCategory() : null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  selectTour(tourId: string): void {
    this.selectedTourId.set(tourId);
  }

  priceLabel(tour: Tour): string {
    const adult = tour.prices?.[0]?.adult;
    return adult != null ? `$${adult.toLocaleString('en-US')}` : 'Consultar';
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.opacity = '0';
  }
}
