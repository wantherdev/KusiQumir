import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface NavGroup {
  label: string;
  items: { path: string; label: string; icon: string }[];
}

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen bg-slate-50">
      <aside class="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <div class="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
          <a routerLink="/" class="flex items-center gap-3">
            <img src="/logo1.svg" alt="Kusi Q'umir" class="h-8 w-8" />
            <span class="text-lg font-bold">Admin</span>
          </a>
        </div>
        <nav class="flex-1 space-y-4 overflow-y-auto px-3 py-4">
          <div *ngFor="let group of navGroups">
            <p class="mb-1 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{{ group.label }}</p>
            <a
              *ngFor="let item of group.items"
              [routerLink]="item.path"
              routerLinkActive="bg-primary/10 text-primary font-semibold"
              [routerLinkActiveOptions]="{ exact: item.path === '/admin' }"
              class="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100"
            >
              <i [attr.aria-hidden]="true" class="{{ item.icon }} text-lg"></i>
              <span>{{ item.label }}</span>
            </a>
          </div>
        </nav>
        <div class="border-t border-slate-200 px-3 py-4">
          <a routerLink="/" class="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100">
            <i aria-hidden="true" class="ri-arrow-left-line text-lg"></i>
            <span>Volver al sitio</span>
          </a>
          <button (click)="logout()" class="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50">
            <i aria-hidden="true" class="ri-logout-box-line text-lg"></i>
            <span>Cerrar sesi\u00F3n</span>
          </button>
        </div>
      </aside>

      <div class="flex flex-1 flex-col">
        <header class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 lg:hidden">
          <a routerLink="/" class="flex items-center gap-3">
            <img src="/logo1.svg" alt="Kusi Q'umir" class="h-8 w-8" />
            <span class="text-lg font-bold">Admin</span>
          </a>
          <button (click)="mobileOpen = !mobileOpen" aria-label="Men\u00FA" class="rounded-lg p-2 hover:bg-slate-100">
            <i aria-hidden="true" class="ri-menu-line text-2xl"></i>
          </button>
        </header>

        <div *ngIf="mobileOpen" class="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <nav class="space-y-4">
            <div *ngFor="let group of navGroups">
              <p class="mb-1 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{{ group.label }}</p>
              <a
                *ngFor="let item of group.items"
                [routerLink]="item.path"
                (click)="mobileOpen = false"
                class="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100"
              >
                <i [attr.aria-hidden]="true" class="{{ item.icon }} text-lg"></i>
                <span>{{ item.label }}</span>
              </a>
            </div>
            <hr class="my-2 border-slate-200" />
            <a routerLink="/" (click)="mobileOpen = false" class="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100">
              <i aria-hidden="true" class="ri-arrow-left-line text-lg"></i>
              <span>Volver al sitio</span>
            </a>
            <button (click)="logout()" class="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50">
              <i aria-hidden="true" class="ri-logout-box-line text-lg"></i>
              <span>Cerrar sesi\u00F3n</span>
            </button>
          </nav>
        </div>

        <main class="flex-1">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AdminLayout {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  mobileOpen = false;

  readonly navGroups: NavGroup[] = [
    {
      label: 'General',
      items: [
        { path: '/admin', label: 'Dashboard', icon: 'ri-dashboard-line' },
      ],
    },
    {
      label: 'Contenido',
      items: [
        { path: '/admin/paquetes', label: 'Paquetes', icon: 'ri-gift-line' },
        { path: '/admin/tours', label: 'Tours', icon: 'ri-map-pin-line' },
        { path: '/admin/blog', label: 'Blog', icon: 'ri-article-line' },
        { path: '/admin/experiencias', label: 'Experiencias', icon: 'ri-star-line' },
      ],
    },
    {
      label: 'Operaciones',
      items: [
        { path: '/admin/reservas', label: 'Reservas', icon: 'ri-calendar-check-line' },
        { path: '/admin/clientes', label: 'Clientes', icon: 'ri-user-line' },
        { path: '/admin/proveedores', label: 'Proveedores', icon: 'ri-truck-line' },
        { path: '/admin/guias', label: 'Gu\u00EDas', icon: 'ri-user-star-line' },
        { path: '/admin/operaciones', label: 'Operaciones', icon: 'ri-settings-3-line' },
      ],
    },
    {
      label: 'Finanzas',
      items: [
        { path: '/admin/pagos', label: 'Pagos', icon: 'ri-bank-card-line' },
        { path: '/admin/facturacion', label: 'Facturaci\u00F3n', icon: 'ri-file-list-3-line' },
      ],
    },
  ];

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
