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
    <div *ngIf="activeView === 'list'" class="rounded-2xl bg-white p-6 shadow-sm">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-tertiary">Clientes</h2>
          <p class="mt-1 text-sm text-slate-500">{{ customers.length }} registrados</p>
        </div>
        <button (click)="openForm()" class="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark">
          <i class="ri-user-add-line text-lg"></i>
          Nuevo Cliente
        </button>
      </div>

      <div class="mb-4">
        <div class="relative">
          <i class="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input [(ngModel)]="searchQuery" (ngModelChange)="onSearch()" placeholder="Buscar por nombre o email…"
            class="w-full rounded-full border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        </div>
      </div>

      <ng-container *ngIf="isLoading; else loaded">
        <app-skeleton variant="table-row" [rows]="5" [cols]="5"></app-skeleton>
      </ng-container>

      <ng-template #loaded>
        <div *ngIf="error" class="flex flex-col items-center gap-3 py-12 text-center">
          <i class="ri-error-warning-line text-4xl text-red-400"></i>
          <p class="text-sm text-slate-600">{{ error }}</p>
          <button (click)="load()" class="rounded-full bg-slate-100 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
            Reintentar
          </button>
        </div>

        <div *ngIf="!error && filtered.length === 0" class="py-12 text-center text-sm text-slate-400">
          <i class="ri-user-search-line mb-2 block text-3xl"></i>
          No se encontraron clientes.
        </div>

        <div *ngIf="filtered.length > 0" class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 text-xs font-semibold uppercase text-slate-500">
                <th class="py-3 pr-4">Nombre</th>
                <th class="py-3 pr-4">Email</th>
                <th class="py-3 pr-4">Teléfono</th>
                <th class="py-3 pr-4">Nacionalidad</th>
                <th class="py-3 pr-4">Registrado</th>
                <th class="py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of pagedItems; trackBy: trackByFn" class="border-b border-slate-50 transition hover:bg-slate-50/50">
                <td class="py-3 pr-4 font-medium text-tertiary">{{ c.name }}</td>
                <td class="py-3 pr-4 text-slate-600">{{ c.email }}</td>
                <td class="py-3 pr-4 text-slate-600">{{ c.phone || '—' }}</td>
                <td class="py-3 pr-4 text-slate-600">{{ c.nationality || '—' }}</td>
                <td class="py-3 pr-4 text-slate-500">{{ c.createdAt | date:'shortDate' }}</td>
                <td class="py-3 text-right">
                  <button (click)="view(c)" class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200">
                    <i class="ri-eye-line"></i>
                    Ver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="totalPages > 1" class="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <button (click)="prevPage()" [class.invisible]="currentPage === 1" class="flex items-center gap-1 text-sm text-slate-600 hover:text-tertiary">
              <i class="ri-arrow-left-s-line"></i> Anterior
            </button>
            <span class="text-xs text-slate-500">Pág. {{ currentPage }} de {{ totalPages }}</span>
            <button (click)="nextPage()" [class.invisible]="currentPage === totalPages" class="flex items-center gap-1 text-sm text-slate-600 hover:text-tertiary">
              Siguiente <i class="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </div>
      </ng-template>
    </div>

    <div *ngIf="activeView === 'form'" class="rounded-2xl bg-white p-6 shadow-sm border">
      <div class="mb-6 flex items-center justify-between">
        <h3 class="text-lg font-bold text-tertiary">Nuevo Cliente</h3>
        <button (click)="closeForm()" class="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          <i class="ri-arrow-left-line"></i>
          Volver
        </button>
      </div>
      <div class="space-y-4">
        <div>
          <label class="mb-1.5 block text-xs font-semibold text-slate-700">Nombre <span class="text-red-500">*</span></label>
          <input [(ngModel)]="form.name" placeholder="Nombre completo"
            class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-semibold text-slate-700">Email <span class="text-red-500">*</span></label>
          <input [(ngModel)]="form.email" type="email" placeholder="correo@ejemplo.com"
            class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-semibold text-slate-700">Teléfono</label>
          <input [(ngModel)]="form.phone" placeholder="+51 999 888 777"
            class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        </div>
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="mb-1.5 block text-xs font-semibold text-slate-700">Nacionalidad</label>
            <input [(ngModel)]="form.nationality" placeholder="Peruana"
              class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div class="flex-1">
            <label class="mb-1.5 block text-xs font-semibold text-slate-700">Pasaporte</label>
            <input [(ngModel)]="form.passport" placeholder="N° pasaporte"
              class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
        </div>
      </div>
      <div class="mt-6 flex justify-end gap-3">
        <button (click)="closeForm()" class="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          Cancelar
        </button>
        <button (click)="save()" [disabled]="saving"
          class="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50">
          <i *ngIf="saving" class="ri-loader-4-line animate-spin"></i>
          {{ saving ? 'Guardando…' : 'Guardar' }}
        </button>
      </div>
    </div>

    <!-- Customer detail modal -->
    @if (selected) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" (click)="closeDetail()">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" (click)="$event.stopPropagation()">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-bold text-tertiary">{{ selected.name }}</h3>
            <button (click)="closeDetail()" aria-label="Cerrar" class="text-slate-400 transition hover:text-slate-700">
              <i class="ri-close-line text-xl"></i>
            </button>
          </div>
          <dl class="space-y-3 text-sm">
            <div><dt class="text-slate-500">Email</dt><dd class="font-medium text-slate-800">{{ selected.email }}</dd></div>
            <div><dt class="text-slate-500">Teléfono</dt><dd class="font-medium text-slate-800">{{ selected.phone || '—' }}</dd></div>
            <div><dt class="text-slate-500">Nacionalidad</dt><dd class="font-medium text-slate-800">{{ selected.nationality || '—' }}</dd></div>
            <div><dt class="text-slate-500">Pasaporte</dt><dd class="font-medium text-slate-800">{{ selected.passport || '—' }}</dd></div>
            <div><dt class="text-slate-500">Registrado</dt><dd class="font-medium text-slate-800">{{ selected.createdAt | date:'mediumDate' }}</dd></div>
          </dl>
        </div>
      </div>
    }

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
