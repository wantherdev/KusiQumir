import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription, firstValueFrom } from 'rxjs';
import { Tour, TravelApiService } from '../../../services/travel-api.service';
import { TourStateService } from '../../../services/tour-state.service';
import { environment } from '../../../../environments/environment';

interface PriceLike {
  adult?: number | null;
  child?: number | null;
  private?: number | null;
  currency?: string;
}

@Component({
  selector: 'app-tour-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './tour-detail.html',
  styleUrls: ['../../page.css', './tour-detail.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourDetail implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly tourState = inject(TourStateService);
  private readonly travelApi = inject(TravelApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  tour: Tour | null = null;
  tours: Tour[] = [];
  isLoading = true;
  error = '';
  whatsappNumber = environment.whatsappNumber;

  readonly selectedImage = signal(0);
  readonly openFaqIndex = signal<number | null>(null);
  readonly lightboxOpen = signal(false);
  readonly lightboxIndex = signal(0);
  readonly transitioning = signal(false);

  private dataSub?: Subscription;

  ngOnInit(): void {
    this.dataSub = this.route.data.subscribe(async data => {
      const tour = data['tour'] as Tour | null;
      if (tour) {
        this.transitioning.set(true);
        this.tour = tour;
        this.setSeo(tour);
        this.selectedImage.set(0);
        this.openFaqIndex.set(null);
        this.lightboxOpen.set(false);
        this.error = '';

        const cached = this.tourState.getTours();
        if (cached.length) {
          this.tours = cached.filter(t => t.slug !== tour.slug).slice(0, 6);
        } else {
          try {
            const res = await firstValueFrom(this.travelApi.getTours());
            this.tours = res.items.filter(t => t.slug !== tour.slug).slice(0, 6);
          } catch {
            this.tours = [];
          }
        }

        setTimeout(() => this.transitioning.set(false), 300);
      } else {
        this.error = 'No se pudo cargar la información del tour.';
      }
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.dataSub?.unsubscribe();
  }

  get categoryName(): string {
    return this.tour?.category?.name ?? '';
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackById(index: number, item: { id?: string | number }): string | number | undefined {
    return item?.id ?? index;
  }

  onTourSelect(event: Event): void {
    const slug = (event.target as HTMLSelectElement).value;
    if (slug) {
      this.router.navigate(['/destinos/tour', slug]);
    }
  }

  openLightbox(i: number): void {
    this.lightboxIndex.set(i);
    this.lightboxOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxOpen.set(false);
    document.body.style.overflow = '';
  }

  prevImage(): void {
    if (!this.tour?.images?.length) return;
    const len = this.tour.images.length;
    this.lightboxIndex.set((this.lightboxIndex() - 1 + len) % len);
  }

  nextImage(): void {
    if (!this.tour?.images?.length) return;
    this.lightboxIndex.set((this.lightboxIndex() + 1) % this.tour.images.length);
  }

  selectImage(i: number): void {
    this.selectedImage.set(i);
  }

  toggleFaq(i: number): void {
    this.openFaqIndex.set(this.openFaqIndex() === i ? null : i);
  }

  currencySymbol(cur?: string): string {
    switch (cur) {
      case 'PEN': return 'S/';
      case 'EUR': return '€';
      default: return '$';
    }
  }

  priceText(p: PriceLike): string {
    const sym = this.currencySymbol(p.currency);
    const parts: string[] = [];
    if (p.adult != null) parts.push(`Adulto ${sym}${p.adult}`);
    if (p.child != null) parts.push(`Niño ${sym}${p.child}`);
    if (p.private != null) parts.push(`Privado ${sym}${p.private}`);
    return parts.join('  ·  ');
  }

  mainPrice(): PriceLike | null {
    return this.tour?.prices?.[0] ?? null;
  }

  difficultyColor(d?: string): string {
    const map: Record<string, string> = {
      Easy: 'bg-green-100 text-green-700',
      Moderate: 'bg-amber-100 text-amber-700',
      Challenging: 'bg-red-100 text-red-700',
    };
    return (d && map[d]) ?? 'bg-slate-100 text-slate-700';
  }

  avgRating(): number {
    const reviews = this.tour?.reviews;
    if (!reviews || !reviews.length) return 0;
    return Math.round((reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length) * 10) / 10;
  }

  reviewCount(): number {
    return this.tour?.reviews?.length ?? 0;
  }

  initials(name?: string | null): string {
    if (!name) return '?';
    return name.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  avgRatingFor(t: Tour): string {
    const reviews = t.reviews;
    if (!reviews?.length) return '—';
    const avg = reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length;
    return avg.toFixed(1);
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.opacity = '0';
  }

  tourImageUrl(t: Tour, index: number = 0): string {
    const url = t.images?.[index]?.url;
    if (url) return `${url}?v=${t.updatedAt}`;
    return '/images/dest1.webp?v=2';
  }

  private setSeo(tour: Tour): void {
    const name = tour.title;
    const desc = tour.shortDescription?.slice(0, 160) ?? tour.description?.slice(0, 160) ?? `Conoce el tour ${name} con Kusi Q'umir.`;
    this.title.setTitle(`${name} | Kusi Q'umir`);
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: `${name} | Kusi Q'umir` });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:type', content: 'product' });
    this.meta.updateTag({ name: 'twitter:title', content: `${name} | Kusi Q'umir` });
    this.meta.updateTag({ name: 'twitter:description', content: desc });
    const firstImage = tour.images?.[0]?.url || '/images/og-default.jpg';
    this.meta.updateTag({ property: 'og:image', content: firstImage });
    this.meta.updateTag({ name: 'twitter:image', content: firstImage });
  }
}
