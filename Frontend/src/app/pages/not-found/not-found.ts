import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-shell flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div class="mx-auto max-w-lg text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Error 404</p>
        <h1 class="mt-4 text-7xl font-bold text-tertiary">404</h1>
        <p class="mt-4 text-xl text-slate-600">Página no encontrada</p>
        <p class="mt-2 text-slate-500">La página que buscas no existe o ha sido movida.</p>
        <div class="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <a routerLink="/" class="rounded-full bg-primary px-8 py-3 font-semibold text-white transition hover:bg-primary-dark">
            Volver al inicio
          </a>
          <a routerLink="/destinos" class="rounded-full border border-primary px-8 py-3 font-semibold text-primary transition hover:bg-primary hover:text-white">
            Explorar destinos
          </a>
        </div>
      </div>
    </section>
  `,
})
export class NotFound {}
