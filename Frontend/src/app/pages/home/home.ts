import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Skeleton } from '../../components/skeleton/skeleton';
import { Tour, TravelPackage } from '../../services/travel-api.service';
import type { HomeData } from '../../resolvers/data.resolvers';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, Skeleton],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  tours: Tour[] = [];
  featuredPackages: TravelPackage[] = [];
  isLoading = true;
  whatsappNumber = '51987654321';

  private readonly route = inject(ActivatedRoute);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  ngOnInit(): void {
    this.title.setTitle("Kusi Q'umir | Agencia de viajes en Cusco, Perú");
    this.meta.updateTag({
      name: 'description',
      content:
        'Viajes seguros, auténticos y hechos a medida en Perú: Machu Picchu, Valle Sagrado, Arequipa, Titicaca y la selva amazónica.',
    });
    this.meta.updateTag({
      property: 'og:title',
      content: "Kusi Q'umir | Agencia de viajes en Cusco, Perú",
    });
    this.meta.updateTag({
      property: 'og:description',
      content:
        'Creamos viajes auténticos con guías locales, logística confiable y acompañamiento personalizado.',
    });

    const data = this.route.snapshot.data['home'] as HomeData | undefined;
    if (data) {
      this.tours = data.tours?.slice(0, 4) ?? [];
      this.featuredPackages = data.packages?.filter((p) => p.featured).slice(0, 3) ?? [];
    }
    this.isLoading = false;
  }

  trackByFn(index: number, item: Tour | TravelPackage): string | number {
    return item.id ?? index;
  }
}
