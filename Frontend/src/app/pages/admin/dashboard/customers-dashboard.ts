import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Customer, TravelApiService } from '../../../services/travel-api.service';
import { Skeleton } from '../../../components/skeleton/skeleton';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-customers-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Skeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-linear-to-br from-slate-50 to-secondary-soft px-4 py-8 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">

        <!-- ====== LIST VIEW ====== -->
        <div *ngIf="activeView === 'list'">

          <!-- Hero header -->
          <header class="animate-slide-up relative mb-6 overflow-hidden rounded-2xl bg-linear-to-r from-primary to-primary-dark p-6 text-white shadow-lg shadow-primary/20 sm:p-8">
            <div class="pointer-events-none absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 18% 22%, rgba(255,255,255,0.9) 1px, transparent 1px); background-size: 24px 24px;"></div>
            <div class="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Panel de administración</p>
                <h1 class="mt-1 flex items-center gap-2 text-2xl font-bold sm:text-3xl">
                  <i class="ri-user-line"></i> Clientes
                </h1>
                <p class="mt-1 text-sm text-white/85">{{ customers.length }} registrados</p>
              </div>
              <div class="flex items-center gap-2">
                <button (click)="openForm()" class="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]">
                  <i class="ri-user-add-line text-lg"></i>
                  Nuevo Cliente
                </button>
              </div>
            </div>
          </header>

          <div class="mb-5">
            <div class="relative w-full max-w-md">
              <i class="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input [(ngModel)]="searchQuery" (ngModelChange)="onSearch()" placeholder="Buscar por nombre o email…"
                class="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/5 placeholder:text-slate-400" />
              <button *ngIf="searchQuery" (click)="searchQuery=''; onSearch()" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700">
                <i class="ri-close-line text-lg"></i>
              </button>
            </div>
          </div>

          <ng-container *ngIf="isLoading; else loaded">
            <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <app-skeleton variant="table-row" [rows]="5" [cols]="5"></app-skeleton>
            </div>
          </ng-container>

          <ng-template #loaded>
            <div *ngIf="error" class="flex flex-col items-center gap-3 py-12 text-center">
              <i class="ri-error-warning-line text-4xl text-red-400"></i>
              <p class="text-sm text-slate-600">{{ error }}</p>
              <button (click)="load()" class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary">
                Reintentar
              </button>
            </div>

            <div *ngIf="!error && filtered.length === 0" class="py-16 text-center text-sm text-slate-400">
              <i class="ri-user-search-line mb-2 block text-4xl text-slate-300"></i>
              No se encontraron clientes.
            </div>

            <div *ngIf="filtered.length > 0" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                  <thead>
                    <tr class="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th class="px-5 py-4">Nombre</th>
                      <th class="px-5 py-4">Email</th>
                      <th class="px-5 py-4">Teléfono</th>
                      <th class="px-5 py-4">Nacionalidad</th>
                      <th class="px-5 py-4">Registrado</th>
                      <th class="px-5 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr *ngFor="let c of pagedItems; trackBy: trackByFn" class="transition hover:bg-secondary-soft">
                      <td class="px-5 py-4 font-medium text-tertiary">{{ c.name }}</td>
                      <td class="px-5 py-4 text-slate-600">{{ c.email }}</td>
                      <td class="px-5 py-4 text-slate-600">{{ c.phone || '—' }}</td>
                      <td class="px-5 py-4 text-slate-600">{{ c.nationality || '—' }}</td>
                      <td class="px-5 py-4 text-slate-500">{{ c.createdAt | date:'shortDate' }}</td>
                      <td class="px-5 py-4 text-right">
                        <button (click)="view(c)" class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary">
                          <i class="ri-eye-line"></i> Ver
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div *ngIf="totalPages > 1" class="flex items-center justify-between border-t border-slate-100 px-5 py-3">
                <button (click)="prevPage()" [class.invisible]="currentPage === 1" class="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-600 transition hover:border-primary/30 hover:text-primary">
                  <i class="ri-arrow-left-s-line"></i> Anterior
                </button>
                <span class="text-xs text-slate-500">Pág. {{ currentPage }} de {{ totalPages }}</span>
                <button (click)="nextPage()" [class.invisible]="currentPage === totalPages" class="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-600 transition hover:border-primary/30 hover:text-primary">
                  Siguiente <i class="ri-arrow-right-s-line"></i>
                </button>
              </div>
            </div>
          </ng-template>
        </div>

        <!-- ====== FORM VIEW ====== -->
        <div *ngIf="activeView === 'form'">
          <div class="animate-slide-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div class="flex items-center gap-4">
                <button (click)="closeForm()" class="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
                  <i class="ri-arrow-left-line"></i> Volver
                </button>
                <div class="h-6 w-px bg-slate-200"></div>
                <h3 class="text-lg font-bold text-tertiary">
                  <i class="ri-user-add-line mr-2 text-primary"></i>
                  Nuevo Cliente
                </h3>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div>
                  <label class="mb-1.5 block text-xs font-semibold text-slate-700">Nombre <span class="text-red-500">*</span></label>
                  <input [(ngModel)]="form.name" placeholder="Nombre completo"
                    class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5" />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-semibold text-slate-700">Email <span class="text-red-500">*</span></label>
                  <input [(ngModel)]="form.email" type="email" placeholder="correo@ejemplo.com"
                    class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5" />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-semibold text-slate-700">Teléfono</label>
                  <input [(ngModel)]="form.phone" placeholder="+51 999 888 777"
                    class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5" />
                </div>
                <div class="flex gap-4">
                  <div class="flex-1">
                    <label class="mb-1.5 block text-xs font-semibold text-slate-700">Nacionalidad</label>
                    <input [(ngModel)]="form.nationality" placeholder="Peruana"
                      class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5" />
                  </div>
                  <div class="flex-1">
                    <label class="mb-1.5 block text-xs font-semibold text-slate-700">Pasaporte</label>
                    <input [(ngModel)]="form.passport" placeholder="N° pasaporte"
                      class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5" />
                  </div>
                </div>
              </div>
              <div class="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button (click)="closeForm()" class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary">
                  Cancelar
                </button>
                <button (click)="save()" [disabled]="saving" class="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-primary to-primary-dark px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                  <i *ngIf="saving" class="ri-loader-4-line animate-spin"></i>
                  {{ saving ? 'Guardando…' : 'Guardar' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer detail modal -->
        @if (selected) {
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" (click)="closeDetail()">
            <div class="w-full max-w-md animate-slide-up rounded-2xl border border-slate-200 bg-white shadow-xl" (click)="$event.stopPropagation()">
              <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><i class="ri-user-line text-lg"></i></div>
                  <h3 class="text-lg font-bold text-tertiary">{{ selected.name }}</h3>
                </div>
                <button (click)="closeDetail()" aria-label="Cerrar" class="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
                  <i class="ri-close-line text-xl"></i>
                </button>
              </div>
              <div class="p-6">
                <dl class="space-y-3 text-sm">
                  <div class="rounded-lg bg-slate-50 px-4 py-3"><dt class="text-xs font-semibold text-slate-500">Email</dt><dd class="font-medium text-tertiary">{{ selected.email }}</dd></div>
                  <div class="rounded-lg bg-slate-50 px-4 py-3"><dt class="text-xs font-semibold text-slate-500">Teléfono</dt><dd class="font-medium text-tertiary">{{ selected.phone || '—' }}</dd></div>
                  <div class="rounded-lg bg-slate-50 px-4 py-3"><dt class="text-xs font-semibold text-slate-500">Nacionalidad</dt><dd class="font-medium text-tertiary">{{ selected.nationality || '—' }}</dd></div>
                  <div class="rounded-lg bg-slate-50 px-4 py-3"><dt class="text-xs font-semibold text-slate-500">Pasaporte</dt><dd class="font-medium text-tertiary">{{ selected.passport || '—' }}</dd></div>
                  <div class="rounded-lg bg-slate-50 px-4 py-3"><dt class="text-xs font-semibold text-slate-500">Registrado</dt><dd class="font-medium text-tertiary">{{ selected.createdAt | date:'mediumDate' }}</dd></div>
                </dl>
              </div>
            </div>
          </div>
        }

      </div>
    </div>
  `,
})
export class CustomersDashboard implements OnInit {
  private readonly api = inject(TravelApiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notification = inject(NotificationService);

  customers: Customer[] = [];
  isLoading = false;
  error = '';
  searchQuery = '';
  pageSize = 10;
  currentPage = 1;

  activeView: 'list' | 'form' = 'list';
  saving = false;
  selected: Customer | null = null;
  form: { name: string; email: string; phone: string; nationality: string; passport: string } = {
    name: '', email: '', phone: '', nationality: '', passport: '',
  };

  get filtered(): Customer[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.customers;
    return this.customers.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }

  get pagedItems(): Customer[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }

  ngOnInit(): void {
    this.load();
  }

  async load(): Promise<void> {
    this.isLoading = true;
    this.error = '';
    this.currentPage = 1;
    try {
      this.customers = await firstValueFrom(this.api.getCustomers());
    } catch {
      this.error = 'No se pudieron cargar los clientes.';
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  onSearch(): void {
    this.currentPage = 1;
  }

  prevPage(): void {
    this.currentPage = Math.max(1, this.currentPage - 1);
  }

  nextPage(): void {
    this.currentPage = Math.min(this.totalPages, this.currentPage + 1);
  }

  openForm(): void {
    this.form = { name: '', email: '', phone: '', nationality: '', passport: '' };
    this.activeView = 'form';
  }

  closeForm(): void {
    this.activeView = 'list';
  }

  view(c: Customer): void {
    this.selected = c;
  }

  closeDetail(): void {
    this.selected = null;
  }

  async save(): Promise<void> {
    if (!this.form.name.trim() || !this.form.email.trim()) {
      this.notification.show('Nombre y email son obligatorios.', 'error');
      return;
    }
    this.saving = true;
    try {
      await firstValueFrom(this.api.createCustomer({
        name: this.form.name.trim(),
        email: this.form.email.trim(),
        phone: this.form.phone.trim() || undefined,
        nationality: this.form.nationality.trim() || undefined,
        passport: this.form.passport.trim() || undefined,
      }));
      this.notification.show('Cliente creado correctamente.', 'success');
      this.closeForm();
      await this.load();
    } catch {
      this.notification.show('No se pudo crear el cliente.', 'error');
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }

  trackByFn(index: number, item: Customer): string {
    return item.id;
  }
}
