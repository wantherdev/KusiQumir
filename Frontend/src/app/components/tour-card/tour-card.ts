import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tour } from '../../services/travel-api.service';
import { difficultyColor } from '../../shared/tour-ui';

@Component({
  selector: 'app-tour-card',
  imports: [RouterLink],
  template: `
    <article
      (click)="cardClick.emit()"
      class="group flex cursor-pointer flex-col overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-2xl"
    >
      <div class="relative h-52 overflow-hidden">
        <div class="absolute inset-0 bg-linear-to-br from-primary/25 to-tertiary/25"></div>
        <img
          [src]="imageUrl"
          [alt]="tour.title"
          (error)="onImgError($event)"
          class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute left-4 top-4 flex flex-wrap gap-2">
          <span class="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur">{{ location }}</span>
        </div>
        <div class="absolute right-4 top-4">
          <span class="rounded-full bg-slate-900/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {{ tour.durationDays }}d {{ tour.durationHours }}h
          </span>
        </div>
      </div>

      <div class="flex flex-1 flex-col p-6">
        <div class="flex items-center justify-between gap-2">
          <span [class]="'rounded-full px-2.5 py-0.5 text-xs font-medium ' + difficultyClass">{{ tour.difficulty }}</span>
          @if (tour.featured) {
            <span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              <i class="ri-star-fill text-[10px]"></i> Destacado
            </span>
          }
        </div>

        <h2 class="mt-3 text-xl font-bold text-tertiary">{{ tour.title }}</h2>
        <p class="mt-2 line-clamp-3 flex-1 text-sm text-slate-600">{{ tour.description }}</p>

        <div class="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p class="text-xs text-slate-400">Desde</p>
            <p class="text-lg font-bold text-primary">{{ priceLabel }}</p>
          </div>
          <a
            [routerLink]="['/destinos/tour', tour.slug]"
            (click)="$event.stopPropagation()"
            class="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Ver tour <i class="ri-arrow-right-line"></i>
          </a>
        </div>
      </div>
    </article>
  `,
})
export class TourCard {
  @Input({ required: true }) tour!: Tour;
  @Output() cardClick = new EventEmitter<void>();

  get imageUrl(): string {
    return this.tour.images?.[0]?.url || '/images/dest1.webp?v=2';
  }

  get location(): string {
    return this.tour.destinations?.[0]?.destination?.name || this.tour.category?.name || 'Perú';
  }

  get difficultyClass(): string {
    return difficultyColor(this.tour.difficulty);
  }

  get priceLabel(): string {
    const adult = this.tour.prices?.[0]?.adult;
    return adult != null ? `$${adult.toLocaleString('en-US')}` : 'Consultar';
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.opacity = '0';
  }
}
