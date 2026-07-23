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
      class="group flex cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-2xl"
    >
      <!-- ===== Image ===== -->
      <div class="relative h-52 overflow-hidden">
        <img
          [src]="imageUrl"
          [alt]="tour.title"
          (error)="onImgError($event)"
          class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>

        <span class="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur-sm">{{ location }}</span>
        <span class="absolute right-3 top-3 z-10 rounded-full bg-slate-900/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {{ tour.durationDays }}d {{ tour.durationHours }}h
        </span>
        @if ((tour.images?.length ?? 0) > 1) {
          <span class="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <i class="ri-image-line text-xs"></i> {{ tour.images?.length }}
          </span>
        }
      </div>

      <!-- ===== Content ===== -->
      <div class="flex flex-1 flex-col p-5">
        <!-- Badges row -->
        <div class="flex items-center gap-2">
          <span [class]="'rounded-full px-2.5 py-0.5 text-xs font-medium ' + difficultyClass">{{ tour.difficulty }}</span>
          <span class="rounded-full bg-secondary-soft px-2.5 py-0.5 text-xs font-medium text-primary">{{ groupLabel }}</span>
          @if (tour.featured) {
            <span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              <i class="ri-star-fill text-[10px]"></i> Destacado
            </span>
          }
        </div>

        <!-- Rating -->
        @if (avgRating > 0) {
          <div class="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <i class="ri-star-fill text-amber-400"></i>
            <span class="font-semibold text-slate-700">{{ avgRating }}</span>
            <span>({{ tour.reviews?.length }})</span>
          </div>
        }

        <!-- Title -->
        <h2 class="mt-2 text-xl font-bold text-tertiary">{{ tour.title }}</h2>
        @if (tour.subtitle) {
          <p class="mt-0.5 text-sm text-slate-400">{{ tour.subtitle }}</p>
        }

        <!-- Destinations -->
        @if (destinationNames.length) {
          <div class="mt-2 flex flex-wrap gap-1.5">
            @for (name of destinationNames; track name) {
              <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                <i class="ri-map-pin-2-line text-[10px]"></i> {{ name }}
              </span>
            }
          </div>
        }

        <!-- Description -->
        <p class="mt-2 line-clamp-2 flex-1 text-sm text-slate-600">{{ tour.shortDescription }}</p>

        <!-- Footer -->
        <div class="mt-4 flex items-center justify-between rounded-xl bg-slate-50/80 px-4 py-3">
          <div>
            <p class="text-[11px] text-slate-400">Desde</p>
            <p [class.text-primary]="hasPrice" [class.text-slate-400]="!hasPrice" class="text-lg font-bold">{{ priceLabel }} @if (hasPrice) {<span class="text-xs font-normal text-slate-400"> / persona</span>}</p>
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
    const url = this.tour.images?.[0]?.url;
    if (url) return `${url}?v=${this.tour.updatedAt}`;
    return '/images/dest1.webp?v=2';
  }

  get location(): string {
    return this.tour.destinations?.[0]?.destination?.name || this.tour.category?.name || 'Perú';
  }

  get groupLabel(): string {
    return this.tour.groupType === 'Shared' ? 'Compartido' : 'Privado';
  }

  get difficultyClass(): string {
    return difficultyColor(this.tour.difficulty);
  }

  get priceLabel(): string {
    const adult = this.tour.prices?.[0]?.adult;
    return adult != null ? `$${adult.toLocaleString('en-US')}` : 'Consultar';
  }

  get hasPrice(): boolean {
    return (this.tour.prices?.[0]?.adult) != null;
  }

  get destinationNames(): string[] {
    return (this.tour.destinations ?? []).slice(0, 2).map((d) => d.destination?.name).filter((n): n is string => !!n);
  }

  get avgRating(): number {
    const reviews = this.tour.reviews;
    if (!reviews?.length) return 0;
    return Math.round((reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length) * 10) / 10;
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.opacity = '0';
  }
}
