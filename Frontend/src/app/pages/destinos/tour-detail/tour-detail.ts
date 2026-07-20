import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Tour } from '../../../services/travel-api.service';

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
  whatsappNumber = '51987654321';

  ngOnInit(): void {
    this.tour = this.route.snapshot.data['tour'] as Tour | null;
    if (this.tour) {
      this.setSeo(this.tour);
    } else {
      this.error = 'No se pudo cargar la información del tour.';
    }
  }

  private setSeo(tour: Tour): void {
    const name = tour.name;
    const desc =
      tour.description?.slice(0, 160) ??
      `Conoce el tour ${name} con Kusi Q'umir.`;
    this.title.setTitle(`${name} | Kusi Q'umir`);
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: `${name} | Kusi Q'umir` });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:type', content: 'product' });
    this.meta.updateTag({
      name: 'twitter:title',
      content: `${name} | Kusi Q'umir`,
    });
    this.meta.updateTag({ name: 'twitter:description', content: desc });
    const firstImage = tour.images?.[0]?.url || '/images/og-default.jpg';
    this.meta.updateTag({ property: 'og:image', content: firstImage });
    this.meta.updateTag({ name: 'twitter:image', content: firstImage });
  }
}

