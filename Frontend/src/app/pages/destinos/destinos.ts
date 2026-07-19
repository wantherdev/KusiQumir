import { Component, OnInit, inject } from '@angular/core';
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
  tours: Tour[] = [];
  isLoading = false;
  searchTerm = '';
  selectedRegion = 'all';
  selectedTourId: string | null = null;

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
      this.tours = data;
      this.selectedTourId = this.tours[0]?.id ?? null;
    }

    this.route.queryParams.subscribe((params) => {
      if (params['search']) this.searchTerm = params['search'];
      if (params['region']) this.selectedRegion = params['region'];
    });
  }

  onFilterChange(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.searchTerm || null,
        region: this.selectedRegion !== 'all' ? this.selectedRegion : null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  getVisibleTours(): Tour[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.tours.filter((tour) => {
      const matchesSearch =
        !term ||
        `${tour.name} ${tour.description} ${tour.location}`
          .toLowerCase()
          .includes(term);
      const matchesRegion =
        this.selectedRegion === 'all' || tour.location === this.selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }

  getAvailableRegions(): string[] {
    return Array.from(
      new Set(this.tours.map((tour) => tour.location).filter((l): l is string => !!l)),
    );
  }

  selectTour(tourId: string): void {
    this.selectedTourId = tourId;
  }

  trackByFn(index: number, item: any): any {
    return item.id ?? index;
  }

  getSelectedTour(): Tour | null {
    return this.tours.find((tour) => tour.id === this.selectedTourId) ?? null;
  }
}
