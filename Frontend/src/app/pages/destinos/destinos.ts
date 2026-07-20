import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Skeleton } from '../../components/skeleton/skeleton';
import { Tour } from '../../services/travel-api.service';

@Component({
  selector: 'app-destinos',
  imports: [CommonModule, FormsModule, RouterLink, Skeleton],
  templateUrl: './destinos.html',
  styleUrl: '../page.css',
})
export class Destinos implements OnInit {
  readonly tours = signal<Tour[]>([]);
  readonly isLoading = signal(false);
  readonly searchTerm = signal('');
  readonly selectedRegion = signal('all');
  readonly selectedTourId = signal<string | null>(null);

  readonly visibleTours = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.tours().filter((tour) => {
      const matchesSearch =
        !term ||
        `${tour.name} ${tour.description} ${tour.city} ${tour.region}`
          .toLowerCase()
          .includes(term);
      const matchesRegion =
        this.selectedRegion() === 'all' || tour.region === this.selectedRegion();
      return matchesSearch && matchesRegion;
    });
  });

  readonly availableRegions = computed(() =>
    Array.from(
      new Set(this.tours().map((tour) => tour.region).filter((l): l is string => !!l)),
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
      if (params['region']) this.selectedRegion.set(params['region']);
    });
  }

  onFilterChange(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.searchTerm() || null,
        region: this.selectedRegion() !== 'all' ? this.selectedRegion() : null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  selectTour(tourId: string): void {
    this.selectedTourId.set(tourId);
  }

  trackByFn(index: number, item: Tour): any {
    return item.id ?? index;
  }
}
