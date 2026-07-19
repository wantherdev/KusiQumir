import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Experience } from '../../services/travel-api.service';

const fallbackExperiences: Experience[] = [
  {
    id: 'fallback-1',
    slug: 'talleres-de-cocina-andina',
    title: 'Talleres de cocina andina',
    summary: 'Aprende a preparar platos tradicionales con ingredientes locales y recetas transmitidas por familias cusqueñas.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Taller de cocina andina',
    location: 'Cusco',
    duration: '4 horas',
    status: 'published',
    featured:false,
    sortOrder: 1,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'fallback-2',
    slug: 'caminatas-con-guia-local',
    title: 'Caminatas con guía local',
    summary: 'Recorre senderos, miradores y comunidades con narradores expertos que comparten la historia de cada lugar.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Caminata con guía local',
    location: 'Valle Sagrado',
    duration: '3 horas',
    status: 'published',
    featured:false,
    sortOrder: 2,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'fallback-3',
    slug: 'observacion-de-estrellas',
    title: 'Observación de estrellas',
    summary: 'Una noche mágica en miradores altos con astronomía, relatos y vistas impresionantes del cielo andino.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Observación de estrellas en el Perú',
    location: 'Cusco',
    duration: '2 horas',
    status: 'published',
    featured:false,
    sortOrder: 3,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'fallback-4',
    slug: 'visitas-a-comunidades',
    title: 'Visitas a comunidades',
    summary: 'Conocemos la vida local a través de mercados, artesanías y encuentros con productores y guías comunitarios.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Visita a comunidades locales',
    location: 'Puno',
    duration: '1 día',
    status: 'published',
    featured:false,
    sortOrder: 4,
    createdAt: '',
    updatedAt: '',
  },
];

@Component({
  selector: 'app-experiencias',
  imports: [CommonModule, RouterLink],
  templateUrl: './experiencias.html',
  styleUrl: '../page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experiencias implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  experiencias: Experience[] = fallbackExperiences;
  isLoading = false;

  ngOnInit(): void {
    this.title.setTitle('Experiencias | Kusi Q\'umir');
    this.meta.updateTag({ name: 'description', content: 'Vivencias auténticas que unen cultura, paisaje y comunidad en Perú. Talleres, caminatas y más.' });
    this.meta.updateTag({ property: 'og:title', content: 'Experiencias | Kusi Q\'umir' });
    this.meta.updateTag({ property: 'og:description', content: 'Vivencias auténticas que unen cultura, paisaje y comunidad en Perú.' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Experiencias | Kusi Q\'umir' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Vivencias auténticas que unen cultura, paisaje y comunidad en Perú.' });

    const data = this.route.snapshot.data['experiences'] as Experience[] | undefined;
    if (data?.length) {
      this.experiencias = data;
    }
  }

  trackByFn(_index: number, item: Experience): string {
    return item.id;
  }
}
