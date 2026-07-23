import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Skeleton } from '../../components/skeleton/skeleton';
import { TourCard } from '../../components/tour-card/tour-card';
import { TestimonialCard } from '../../components/testimonial-card/testimonial-card';
import { Tour, TravelPackage, Testimonial } from '../../services/travel-api.service';
import type { HomeData } from '../../resolvers/data.resolvers';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, Skeleton, TourCard, TestimonialCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit, OnDestroy {
  tours: Tour[] = [];
  featuredPackages: TravelPackage[] = [];
  testimonials: Testimonial[] = [];
  isLoading = true;
  whatsappNumber = environment.whatsappNumber;

  readonly visibleSections = signal<Set<string>>(new Set());

  readonly stats = [
    { icon: 'ri-award-line', value: '10+', label: 'Años de experiencia' },
    { icon: 'ri-user-heart-line', value: '5000+', label: 'Viajeros satisfechos' },
    { icon: 'ri-map-2-line', value: '50+', label: 'Destinos únicos' },
    { icon: 'ri-shield-check-line', value: '100%', label: 'Viajes seguros' },
  ];

  private readonly route = inject(ActivatedRoute);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private observer?: IntersectionObserver;

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
      this.testimonials = data.testimonials ?? [];
    }
    this.isLoading = false;

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
            if (id) {
              this.visibleSections.update((s) => new Set(s).add(id));
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    setTimeout(() => {
      document.querySelectorAll('[data-section]').forEach((el) => this.observer?.observe(el));
    });
  }

  isVisible(section: string): boolean {
    return this.visibleSections().has(section);
  }

  scrollTo(section: string): void {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }

  trackByFn(index: number, item: { id: string }): string {
    return item.id;
  }
}
