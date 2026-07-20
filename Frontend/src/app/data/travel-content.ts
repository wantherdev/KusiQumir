import type { TravelPackage } from '../services/travel-api.service';

export interface FallbackDestination {
  id: number;
  name: string;
  slug: string;
  description: string;
  region: string;
  price: string;
  duration: string;
  highlights: string[];
  imageUrl?: string | null;
}

export const fallbackDestinations: FallbackDestination[] = [
  {
    id: 101,
    name: 'Cusco',
    slug: 'cusco',
    description:
      'La capital histórica del Imperio Inca.',
    region: 'Cusco',
    price: '980',
    duration: '3',
    highlights: ['Plaza de Armas', 'Sacsayhuamán', 'Qorikancha'],
    imageUrl: '/images/dest1.webp?v=2',
  },
  {
    id: 102,
    name: 'Valle Sagrado',
    slug: 'valle-sagrado',
    description:
      'Territorio agrícola andino.',
    region: 'Cusco',
    price: '760',
    duration: '2',
    highlights: ['Pisac', 'Ollantaytambo', 'Maras'],
    imageUrl: '/images/dest2.webp?v=2',
  },
  {
    id: 103,
    name: 'Machu Picchu',
    slug: 'machu-picchu',
    description:
      'Una maravilla del mundo.',
    region: 'Cusco',
    price: '1200',
    duration: '2',
    highlights: ['Santuario Histórico', 'Tren Vistadome', 'Aguas Calientes'],
    imageUrl: '/images/dest3.webp?v=2',
  },
  {
    id: 104,
    name: 'Lago Titicaca',
    slug: 'lago-titicaca',
    description:
      'El lago navegable más alto del mundo.',
    region: 'Puno',
    price: '890',
    duration: '3',
    highlights: ['Amantaní', 'Taquile', 'Uros'],
    imageUrl: '/images/dest4.webp?v=2',
  },
];

export const fallbackPackages: TravelPackage[] = [
  {
    id: '201',
    name: 'Ruta Inca Clásica',
    description: 'Cusco, Valle Sagrado y Machu Picchu en un solo viaje.',
    durationDays: 5,
    price: 1890,
    discount: 180,
    imageUrl: '/images/pack1.webp?v=2',
    featured: true,
    included: 'Hospedaje 4 estrellas, Transporte, Guía local',
    excluded: 'Vuelos internacionales',
  },
  {
    id: '202',
    name: 'Valle Sagrado y Maras Moray',
    description: 'Explora aldeas, terrazas y mercados locales.',
    durationDays: 4,
    price: 1450,
    discount: 90,
    imageUrl: '/images/pack2.webp?v=2',
    featured: true,
    included: 'Traslado privado, Guía especializado, Almuerzos',
    excluded: 'Entradas adicionales',
  },
  {
    id: '203',
    name: 'Salkantay a Machu Picchu',
    description: 'Una ruta de aventura hacia Machu Picchu.',
    durationDays: 6,
    price: 2200,
    discount: 240,
    imageUrl: '/images/pack3.webp?v=2',
    featured: true,
    included: 'Guía de trekking, Campamento, Transporte',
    excluded: 'Equipo personal',
  },
  {
    id: '204',
    name: 'Titicaca y comunidades de Amantaní',
    description: 'Islas flotantes, pueblos andinos y paisajes de altura.',
    durationDays: 4,
    price: 1680,
    discount: 120,
    imageUrl: '/images/pack4.webp?v=2',
    featured: false,
    included: 'Hospedaje local, Navegación, Guía bilingüe',
    excluded: 'Vuelos',
  },
];

export interface BlogArticle {
  id: number;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  image: string;
  alt: string;
}

export const fallbackBlogArticles: BlogArticle[] = [
  {
    id: 1,
    title: 'Qué esperar de un viaje a Cusco y Machu Picchu',
    summary:
      'Una guía práctica para preparar la altura, la logística y el mejor ritmo para disfrutar cada día.',
    category: 'Guía',
    readTime: '5 min',
    image:
      'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=80',
    alt: 'Paisaje andino con viajeros en Cusco',
  },
  {
    id: 2,
    title: 'Cómo elegir entre trekking y viaje tranquilo',
    summary:
      'Comparamos experiencias de alta montaña, cultura y descanso para encontrar la opción correcta.',
    category: 'Consejos',
    readTime: '4 min',
    image:
      'https://images.unsplash.com/photo-1500522144261-ea64433bbe27?auto=format&fit=crop&w=900&q=80',
    alt: 'Ruta de trekking en Perú',
  },
  {
    id: 3,
    title: 'Mejores meses para recorrer el Perú',
    summary:
      'Una mirada clara sobre la temporada seca, las fiestas y el clima para planificar con anticipación.',
    category: 'Temporada',
    readTime: '6 min',
    image:
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=80',
    alt: 'Paisaje del Perú en temporada seca',
  },
];