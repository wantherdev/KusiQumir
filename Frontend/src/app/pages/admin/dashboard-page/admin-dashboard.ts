import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TravelApiService } from '../../../services/travel-api.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-tertiary">Dashboard</h1>
        <p class="mt-1 text-sm text-slate-500">Resumen general del sistema</p>
      </div>

      <div *ngIf="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div *ngFor="let _ of [].constructor(12)" class="h-28 animate-pulse rounded-2xl bg-slate-200"></div>
      </div>

      <div *ngIf="!loading">
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <a *ngFor="let card of statCards" [routerLink]="card.link"
            class="group rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl" [class]="card.bgClass">
                <i aria-hidden="true" class="{{ card.icon }} text-xl" [class]="card.iconClass"></i>
              </div>
              <div>
                <p class="text-3xl font-bold text-tertiary">{{ card.count }}</p>
                <p class="text-sm text-slate-500">{{ card.label }}</p>
              </div>
            </div>
          </a>
        </div>

        <div class="mt-8 grid gap-6 lg:grid-cols-2">
          <div class="rounded-2xl bg-white p-6 shadow-sm">
            <h3 class="mb-4 text-lg font-semibold text-tertiary">Reservas por Estado</h3>
            <div *ngIf="analytics?.bookingsByStatus" class="space-y-3">
              <div *ngFor="let b of analytics.bookingsByStatus" class="flex items-center justify-between">
                <span class="text-sm text-slate-600">{{ b.status }}</span>
                <div class="flex items-center gap-3">
                  <div class="h-2 w-48 overflow-hidden rounded-full bg-slate-200">
                    <div class="h-full rounded-full transition-all" [style.width.%]="maxCount ? (b.count / maxCount * 100) : 0"
                      [class.bg-yellow-400]="b.status === 'PENDIENTE'"
                      [class.bg-green-500]="b.status === 'CONFIRMADA'"
                      [class.bg-secondary-soft0]="b.status === 'COMPLETADA'"
                      [class.bg-red-500]="b.status === 'CANCELADA'"></div>
                  </div>
                  <span class="w-8 text-right text-sm font-semibold text-slate-700">{{ b.count }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl bg-white p-6 shadow-sm">
            <h3 class="mb-4 text-lg font-semibold text-tertiary">Reservas Recientes</h3>
            <div *ngIf="analytics?.recentBookings?.length">
              <div *ngFor="let b of analytics.recentBookings.slice(0, 6)" class="flex items-center justify-between border-b border-slate-100 py-2 last:border-0">
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-tertiary">{{ b.customerName || 'An\u00F3nimo' }}</p>
                  <p class="text-xs text-slate-500">{{ b.tour?.name || b.package?.name || '-' }}</p>
                </div>
                <span class="ml-3 rounded-full px-2.5 py-0.5 text-xs font-medium"
                  [class.bg-yellow-100]="b.status === 'PENDIENTE'" [class.text-yellow-800]="b.status === 'PENDIENTE'"
                  [class.bg-green-100]="b.status === 'CONFIRMADA'" [class.text-green-800]="b.status === 'CONFIRMADA'"
                  [class.bg-blue-100]="b.status === 'COMPLETADA'" [class.text-blue-800]="b.status === 'COMPLETADA'"
                  [class.bg-red-100]="b.status === 'CANCELADA'" [class.text-red-800]="b.status === 'CANCELADA'">
                  {{ b.status }}
                </span>
              </div>
            </div>
            <p *ngIf="!analytics?.recentBookings?.length" class="text-sm text-slate-400">No hay reservas recientes</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboard implements OnInit {
  private readonly api = inject(TravelApiService);
  loading = true;
  analytics: any = null;
  statCards: any[] = [];
  maxCount = 0;

  ngOnInit(): void {
    this.api.getAnalytics().subscribe({
      next: (data) => {
        this.analytics = data;
        this.statCards = [
          { link: '/admin/tours', label: 'Tours', count: data.toursCount ?? '...', icon: 'ri-map-pin-line', bgClass: 'bg-primary/10', iconClass: 'text-primary' },
          { link: '/admin/paquetes', label: 'Paquetes', count: data.packagesCount ?? '...', icon: 'ri-gift-line', bgClass: 'bg-purple-50', iconClass: 'text-purple-600' },
          { link: '/admin/blog', label: 'Art\u00EDculos', count: data.articlesCount ?? '...', icon: 'ri-article-line', bgClass: 'bg-amber-50', iconClass: 'text-amber-600' },
          { link: '/admin/experiencias', label: 'Experiencias', count: data.experiencesCount ?? '...', icon: 'ri-star-line', bgClass: 'bg-green-50', iconClass: 'text-green-600' },
          { link: '/admin/reservas', label: 'Reservas', count: data.totalBookings ?? '...', icon: 'ri-calendar-check-line', bgClass: 'bg-secondary-soft', iconClass: 'text-primary' },
          { link: '/admin/reservas', label: 'Pendientes', count: data.pendingBookings ?? '...', icon: 'ri-time-line', bgClass: 'bg-rose-50', iconClass: 'text-rose-600' },
          { link: '/admin/clientes', label: 'Clientes', count: data.customersCount ?? '...', icon: 'ri-user-line', bgClass: 'bg-indigo-50', iconClass: 'text-indigo-600' },
          { link: '/admin/proveedores', label: 'Proveedores', count: data.providersCount ?? '...', icon: 'ri-truck-line', bgClass: 'bg-cyan-50', iconClass: 'text-cyan-600' },
          { link: '/admin/guias', label: 'Gu\u00EDas', count: data.guidesCount ?? '...', icon: 'ri-user-star-line', bgClass: 'bg-teal-50', iconClass: 'text-teal-600' },
          { link: '/admin/operaciones', label: 'Operaciones', count: data.operationsCount ?? '...', icon: 'ri-settings-3-line', bgClass: 'bg-orange-50', iconClass: 'text-orange-600' },
          { link: '/admin/pagos', label: 'Pagos', count: data.paymentsCount ?? '...', icon: 'ri-bank-card-line', bgClass: 'bg-emerald-50', iconClass: 'text-emerald-600' },
          { link: '/admin/facturacion', label: 'Facturas', count: data.invoicesCount ?? '...', icon: 'ri-file-list-3-line', bgClass: 'bg-violet-50', iconClass: 'text-violet-600' },
        ];
        if (data.bookingsByStatus) {
          this.maxCount = Math.max(...data.bookingsByStatus.map((b: any) => b.count), 1);
        }
        this.loading = false;
      },
      error: () => {
        this.statCards = this.getFallbackCards();
        this.loading = false;
      },
    });
  }

  private getFallbackCards(): any[] {
    return [
      { link: '/admin/tours', label: 'Tours', count: '...', icon: 'ri-map-pin-line', bgClass: 'bg-primary/10', iconClass: 'text-primary' },
      { link: '/admin/paquetes', label: 'Paquetes', count: '...', icon: 'ri-gift-line', bgClass: 'bg-purple-50', iconClass: 'text-purple-600' },
      { link: '/admin/blog', label: 'Art\u00EDculos', count: '...', icon: 'ri-article-line', bgClass: 'bg-amber-50', iconClass: 'text-amber-600' },
      { link: '/admin/experiencias', label: 'Experiencias', count: '...', icon: 'ri-star-line', bgClass: 'bg-green-50', iconClass: 'text-green-600' },
      { link: '/admin/reservas', label: 'Reservas', count: '...', icon: 'ri-calendar-check-line', bgClass: 'bg-secondary-soft', iconClass: 'text-primary' },
      { link: '/admin/reservas', label: 'Pendientes', count: '...', icon: 'ri-time-line', bgClass: 'bg-rose-50', iconClass: 'text-rose-600' },
      { link: '/admin/clientes', label: 'Clientes', count: '...', icon: 'ri-user-line', bgClass: 'bg-indigo-50', iconClass: 'text-indigo-600' },
      { link: '/admin/proveedores', label: 'Proveedores', count: '...', icon: 'ri-truck-line', bgClass: 'bg-cyan-50', iconClass: 'text-cyan-600' },
      { link: '/admin/guias', label: 'Gu\u00EDas', count: '...', icon: 'ri-user-star-line', bgClass: 'bg-teal-50', iconClass: 'text-teal-600' },
      { link: '/admin/operaciones', label: 'Operaciones', count: '...', icon: 'ri-settings-3-line', bgClass: 'bg-orange-50', iconClass: 'text-orange-600' },
      { link: '/admin/pagos', label: 'Pagos', count: '...', icon: 'ri-bank-card-line', bgClass: 'bg-emerald-50', iconClass: 'text-emerald-600' },
      { link: '/admin/facturacion', label: 'Facturas', count: '...', icon: 'ri-file-list-3-line', bgClass: 'bg-violet-50', iconClass: 'text-violet-600' },
    ];
  }
}
