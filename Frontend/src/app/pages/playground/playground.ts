import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-playground',
  imports: [CommonModule, RouterLink],
  templateUrl: './playground.html',
  styleUrl: './playground.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Playground implements OnInit, OnDestroy {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  readonly activeCategory = signal<string>('todas');
  readonly selectedStat = signal<number | null>(null);
  readonly visibleSections = signal<Set<string>>(new Set());

  categories = ['Todas', 'Aventura', 'Cultural', 'Natural', 'Gastronomía'];

  featuredTours = [
    { slug: 'city-tour-cusco', title: 'City Tour Cusco', difficulty: 'Easy', duration: '5h', image: '/images/dest1.webp?v=2', price: 45, category: 'Cultural' },
    { slug: 'valle-sagrado', title: 'Valle Sagrado de los Incas', difficulty: 'Easy', duration: '10h', image: '/images/dest2.webp?v=2', price: 89, category: 'Cultural' },
    { slug: 'machu-picchu-full-day', title: 'Machu Picchu Full Day', difficulty: 'Moderate', duration: '16h', image: '/images/dest3.webp?v=2', price: 290, category: 'Aventura' },
    { slug: 'montana-colores', title: 'Montaña de 7 Colores', difficulty: 'Challenging', duration: '14h', image: '/images/dest4.webp?v=2', price: 79, category: 'Natural' },
  ];

  filteredTours = [...this.featuredTours];

  packages = [
    { name: 'Cusco Esencial', days: 4, price: 590, discount: 15, tours: 3, image: '/images/pack1.webp?v=2', description: 'City Tour + Valle Sagrado + Machu Picchu en 4 días con guía bilingüe.' },
    { name: 'Aventura Andina', days: 6, price: 890, discount: 20, tours: 5, image: '/images/pack2.webp?v=2', description: 'Valle Sur + Humantay + Machu Picchu + Montaña de Colores + Maras Moray.' },
    { name: 'Cusco Premium', days: 8, price: 1490, discount: 10, tours: 7, image: '/images/pack3.webp?v=2', description: 'Cusco completo con vuelo panorámico, experiencia gastronómica y spa.' },
  ];

  experiences = [
    { title: 'Mejor época para viajar a Cusco', tag: 'Guía de viaje', image: '/images/exp1.webp?v=2' },
    { title: 'Qué llevar a Machu Picchu', tag: 'Consejos prácticos', image: '/images/exp2.webp?v=2' },
    { title: 'Costo real de viajar a Perú', tag: 'Presupuesto', image: '/images/exp3.webp?v=2' },
  ];

  testimonials = [
    { name: 'María García', role: 'Viajera frecuente', rating: 5, content: 'Una experiencia inolvidable. Kusi Q\'umir hizo que mi viaje a Machu Picchu fuera perfecto. La guía fue excepcional.', country: 'México' },
    { name: 'Carlos López', role: 'Mochilero', rating: 5, content: 'El Valle Sagrado con ellos fue brutal. Súper organizados, el guía sabía cada detalle. Recomendadísimos.', country: 'Chile' },
    { name: 'Ana Torres', role: 'Pareja viajera', rating: 4, content: 'Atención personalizada increíble. Nos ayudaron a personalizar el paquete y todo salió según lo planeado.', country: 'Argentina' },
  ];

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.title.setTitle('🧪 Playground — Mejoras Home | Kusi Q\'umir');
    this.meta.updateTag({ name: 'description', content: 'Página de pruebas para mejoras UX/UI de la home.' });

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

  filterByCategory(cat: string): void {
    this.activeCategory.set(cat);
    if (cat === 'Todas') {
      this.filteredTours = [...this.featuredTours];
    } else {
      this.filteredTours = this.featuredTours.filter(t => t.category === cat);
    }
  }

  isVisible(section: string): boolean {
    return this.visibleSections().has(section);
  }

  stats = [
    { icon: 'ri-award-line', value: '10+', label: 'Años de experiencia' },
    { icon: 'ri-user-heart-line', value: '5000+', label: 'Viajeros satisfechos' },
    { icon: 'ri-map-2-line', value: '50+', label: 'Destinos únicos' },
    { icon: 'ri-shield-check-line', value: '100%', label: 'Viajes seguros' },
  ];

  scrollTo(section: string): void {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }
}
