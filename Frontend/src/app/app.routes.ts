import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { homeResolver, toursResolver, articlesResolver, experiencesResolver, tourDetailResolver, articleResolver, experienceResolver } from './resolvers/data.resolvers';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home), resolve: { home: homeResolver } },
  { path: 'destinos', loadComponent: () => import('./pages/destinos/destinos').then((m) => m.Destinos), resolve: { tours: toursResolver } },
  { path: 'destinos/:slug', loadComponent: () => import('./pages/destinos/destino-redirect/destino-redirect').then((m) => m.DestinoRedirect) },
  { path: 'destinos/tour/:id', loadComponent: () => import('./pages/destinos/tour-detail/tour-detail').then((m) => m.TourDetail), resolve: { tour: tourDetailResolver } },
  { path: 'reservar', loadComponent: () => import('./pages/reservar/reservar').then((m) => m.Reservar) },
  { path: 'paquetes', loadComponent: () => import('./pages/paquetes/paquetes').then((m) => m.Paquetes) },
  { path: 'experiencias', loadComponent: () => import('./pages/experiencias/experiencias').then((m) => m.Experiencias), resolve: { experiences: experiencesResolver } },
  { path: 'experiencias/:slug', loadComponent: () => import('./pages/experiencias/experience-detail/experience-detail').then((m) => m.ExperienceDetail), resolve: { experience: experienceResolver } },
  { path: 'nosotros', loadComponent: () => import('./pages/nosotros/nosotros').then((m) => m.Nosotros) },
  { path: 'contacto', loadComponent: () => import('./pages/contacto/contacto').then((m) => m.Contacto) },
  { path: 'blog', loadComponent: () => import('./pages/blog/blog').then((m) => m.Blog), resolve: { articles: articlesResolver } },
  { path: 'blog/:slug', loadComponent: () => import('./pages/blog/article/article').then((m) => m.BlogArticle), resolve: { article: articleResolver } },
  { path: 'login', loadComponent: () => import('./pages/auth/login').then((m) => m.Login) },
  { path: 'registro', loadComponent: () => import('./pages/auth/registro/registro').then((m) => m.Registro) },
  { path: 'mis-reservas', loadComponent: () => import('./pages/cliente/mis-reservas/mis-reservas').then((m) => m.MisReservas) },
  { path: 'admin/tours', loadComponent: () => import('./pages/admin/dashboard/tours-dashboard').then((m) => m.ToursDashboard), canActivate: [adminGuard] },
  { path: 'admin/blog', loadComponent: () => import('./pages/admin/dashboard/articles-dashboard').then((m) => m.ArticlesDashboard), canActivate: [adminGuard] },
  { path: 'admin/experiencias', loadComponent: () => import('./pages/admin/dashboard/experiences-dashboard').then((m) => m.ExperiencesDashboard), canActivate: [adminGuard] },
  { path: 'admin/paquetes', loadComponent: () => import('./pages/admin/dashboard/packages-dashboard/packages-dashboard').then((m) => m.PackagesDashboard), canActivate: [adminGuard] },
  { path: 'admin/reservas', loadComponent: () => import('./pages/admin/dashboard/bookings-dashboard').then((m) => m.BookingsDashboard), canActivate: [adminGuard] },
  { path: 'terminos-y-condiciones', loadComponent: () => import('./pages/legal/terminos/terminos').then((m) => m.Terminos) },
  { path: 'politica-de-privacidad', loadComponent: () => import('./pages/legal/politica-privacidad/politica-privacidad').then((m) => m.Politica) },
  { path: 'cancelaciones-y-reembolsos', loadComponent: () => import('./pages/legal/cancelaciones/cancelaciones').then((m) => m.Cancelaciones) },
  { path: 'libro-de-reclamaciones', loadComponent: () => import('./pages/legal/libro-reclamaciones/libro-reclamaciones').then((m) => m.LibroReclamaciones) },
  { path: 'contrato-prestacion-servicios', loadComponent: () => import('./pages/legal/contrato/contrato').then((m) => m.Contrato) },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound) },
];
