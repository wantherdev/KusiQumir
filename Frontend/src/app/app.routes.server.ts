import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'destinos/tour/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'destinos/:slug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'experiencias/:slug',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
