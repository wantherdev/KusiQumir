import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Skeleton } from '../../components/skeleton/skeleton';
import { TourCard } from '../../components/tour-card/tour-card';
import { Tour } from '../../services/travel-api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-destinos',
  imports: [CommonModule, FormsModule, RouterLink, Skeleton, TourCard],
  templateUrl: './destinos.html',
  styleUrls: ['../page.css', './destinos.css'],
})
export class Destinos implements OnInit, OnDestroy {
  readonly tours = signal<Tour[]>([]);
  readonly isLoading = signal(true);
  readonly searchTerm = signal('');
  readonly selectedCategory = signal('all');
  readonly visibleSections = signal<Set<string>>(new Set());
  readonly whatsappNumber = environment.whatsappNumber;

  readonly visibleTours = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.tours().filter((tour) => {
      const matchesSearch =
        !term ||
        `${tour.title} ${tour.shortDescription} ${tour.durationDays} ${tour.category?.name ?? ''}`
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

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private observer?: IntersectionObserver;

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
    }
    this.isLoading.set(false);

    this.route.queryParams.subscribe((params) => {
      if (params['search']) this.searchTerm.set(params['search']);
      if (params['category']) this.selectedCategory.set(params['category']);
    });

    this.setupScrollObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private setupScrollObserver(): void {
    if (typeof IntersectionObserver === 'undefined') return;
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section');
            if (id) this.visibleSections.update((s) => new Set(s).add(id));
          }
        });
      },
      { threshold: 0.15 },
    );
    setTimeout(() => {
      document.querySelectorAll('[data-section]').forEach((el) => this.observer?.observe(el));
    });
  }

  isVisible(section: string): boolean {
    return this.visibleSections().has(section);
  }

  navigateToTour(tour: Tour): void {
    this.router.navigate(['/destinos/tour', tour.slug]);
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

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('all');
    this.router.navigate([], { queryParams: {}, replaceUrl: true });
  }
}
