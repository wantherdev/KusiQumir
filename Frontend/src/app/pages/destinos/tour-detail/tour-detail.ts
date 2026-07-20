import { Component, OnInit, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Tour } from '../../../services/travel-api.service';
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
  styleUrl: '../../page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  tour: Tour | null = null;
  isLoading = false;
  error = '';
  whatsappNumber = environment.whatsappNumber;

  readonly selectedImage = signal(0);
  readonly openFaqIndex = signal<number | null>(null);

  ngOnInit(): void {
    this.tour = this.route.snapshot.data['tour'] as Tour | null;
    if (this.tour) {
      this.setSeo(this.tour);
    } else {
      this.error = 'No se pudo cargar la información del tour.';
    }
  }

  selectImage(i: number): void {
    this.selectedImage.set(i);
  }

  toggleFaq(i: number): void {
    this.openFaqIndex.set(this.openFaqIndex() === i ? null : i);
  }

  currencySymbol(cur?: string): string {
    switch (cur) {
      case 'PEN':
        return 'S/';
      case 'EUR':
        return '€';
      default:
        return '$';
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

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.opacity = '0';
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
