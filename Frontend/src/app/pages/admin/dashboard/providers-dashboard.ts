import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Provider, TravelApiService } from '../../../services/travel-api.service';
import { Skeleton } from '../../../components/skeleton/skeleton';
import { ConfirmDialog } from '../../../components/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-providers-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Skeleton, ConfirmDialog],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-linear-to-br from-slate-50 to-secondary-soft px-4 py-8 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">

        <!-- ====== LIST VIEW ====== -->
        <div *ngIf="activeView === 'list'">

          <!-- Hero header -->
          <header class="animate-slide-up relative mb-6 overflow-hidden rounded-2xl bg-linear-to-r from-primary to-primary-dark p-6 text-white shadow-lg shadow-primary/20 sm:p-8">
            <div class="pointer-events-none absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 18% 22%, rgba(255,255,255,0.9) 1px, transparent 1px); background-size: 26px 26px;"></div>
            <div class="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Panel de administración</p>
                <h1 class="mt-1 flex items-center gap-2 text-2xl font-bold sm:text-3xl">
                  <i class="ri-truck-line"></i> Proveedores
                </h1>
                <p class="mt-1 text-sm text-white/85">{{ providers.length }} registrados</p>
              </div>
              <div class="flex items-center gap-2">
                <button (click)="openForm()" class="admin-btn-hero">
                  <i class="ri-building-2-add-line text-lg"></i>
                  Nuevo Proveedor
                </button>
              </div>
            </div>
          </header>

          <div class="mb-5">
            <div class="relative w-full max-w-md">
              <i class="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input [(ngModel)]="searchQuery" (ngModelChange)="onSearch()" placeholder="Buscar por nombre, tipo o contacto…"
                class="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/5 placeholder:text-slate-400" />
              <button *ngIf="searchQuery" (click)="searchQuery=''; onSearch()" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700">
                <i class="ri-close-line text-lg"></i>
              </button>
            </div>
          </div>

          <ng-container *ngIf="isLoading; else loaded">
            <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <app-skeleton variant="table-row" [rows]="5" [cols]="6"></app-skeleton>
            </div>
          </ng-container>

          <ng-template #loaded>
            <div *ngIf="error" class="flex flex-col items-center gap-3 py-12 text-center">
              <i class="ri-error-warning-line text-4xl text-red-400"></i>
              <p class="text-sm text-slate-600">{{ error }}</p>
              <button (click)="load()" class="admin-btn-ghost">
                Reintentar
              </button>
            </div>

            <div *ngIf="!error && filtered.length === 0" class="py-16 text-center text-sm text-slate-400">
              <i class="ri-building-2-line mb-2 block text-4xl text-slate-300"></i>
              No se encontraron proveedores.
            </div>

            <div *ngIf="filtered.length > 0" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                  <thead>
                    <tr class="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th class="px-5 py-4">Nombre</th>
                      <th class="px-5 py-4">Tipo</th>
                      <th class="px-5 py-4">Contacto</th>
                      <th class="px-5 py-4">Contrato</th>
                      <th class="px-5 py-4">Servicios</th>
                      <th class="px-5 py-4">Registrado</th>
                      <th class="px-5 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr *ngFor="let p of pagedItems; trackBy: trackByFn" class="transition hover:bg-secondary-soft">
                      <td class="px-5 py-4 font-medium text-tertiary">{{ p.name }}</td>
                      <td class="px-5 py-4">
                        <span class="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{{ p.type }}</span>
                      </td>
                      <td class="px-5 py-4 text-slate-600">{{ p.contact }}</td>
                      <td class="px-5 py-4 text-slate-600">{{ p.contract || '—' }}</td>
                      <td class="px-5 py-4 text-slate-600 max-w-[160px] truncate" [title]="p.services || ''">{{ p.services || '—' }}</td>
                      <td class="px-5 py-4 text-slate-500">{{ p.createdAt | date:'shortDate' }}</td>
                      <td class="px-5 py-4 text-right">
                        <button (click)="confirmDelete(p)" class="admin-btn-danger">
                          <i class="ri-delete-bin-6-line"></i> Eliminar
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
                  <i class="ri-building-2-add-line mr-2 text-primary"></i>
                  Nuevo Proveedor
                </h3>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div>
                  <label class="mb-1.5 block text-xs font-semibold text-slate-700">Nombre <span class="text-red-500">*</span></label>
                  <input [(ngModel)]="form.name" placeholder="Nombre del proveedor"
                    class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5" />
                </div>
                <div class="flex gap-4">
                  <div class="flex-1">
                    <label class="mb-1.5 block text-xs font-semibold text-slate-700">Tipo <span class="text-red-500">*</span></label>
                    <input [(ngModel)]="form.type" placeholder="Hotel, DMC, Transporte…"
                      class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5" />
                  </div>
                  <div class="flex-1">
                    <label class="mb-1.5 block text-xs font-semibold text-slate-700">Contacto <span class="text-red-500">*</span></label>
                    <input [(ngModel)]="form.contact" placeholder="Email o teléfono"
                      class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5" />
                  </div>
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-semibold text-slate-700">Contrato</label>
                  <input [(ngModel)]="form.contract" placeholder="Detalles del contrato"
                    class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5" />
                </div>
                <div class="flex gap-4">
                  <div class="flex-1">
                    <label class="mb-1.5 block text-xs font-semibold text-slate-700">Comisión</label>
                    <input [(ngModel)]="form.commission" placeholder="10%"
                      class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5" />
                  </div>
                  <div class="flex-1">
                    <label class="mb-1.5 block text-xs font-semibold text-slate-700">Servicios</label>
                    <input [(ngModel)]="form.services" placeholder="Alojamiento, Tours…"
                      class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5" />
                  </div>
                </div>
              </div>
              <div class="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button (click)="closeForm()" class="admin-btn-ghost">
                  Cancelar
                </button>
                <button (click)="save()" [disabled]="saving" class="admin-btn-submit">
                  <i *ngIf="saving" class="ri-loader-4-line animate-spin"></i>
                  {{ saving ? 'Guardando…' : 'Guardar' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <app-confirm-dialog
          [visible]="showConfirm"
          title="Eliminar Proveedor"
          [message]="'¿Eliminar a «' + pendingDelete?.name + '»? Esta acción no se puede deshacer.'"
          (confirmed)="deleteItem()"
          (cancelled)="showConfirm = false"
        ></app-confirm-dialog>

      </div>
    </div>
  `,
})
export class ProvidersDashboard implements OnInit {
  private readonly api = inject(TravelApiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notification = inject(NotificationService);

  providers: Provider[] = [];
  isLoading = false;
  error = '';
  searchQuery = '';
  pageSize = 10;
  currentPage = 1;

  activeView: 'list' | 'form' = 'list';
  saving = false;
  form: { name: string; type: string; contact: string; contract: string; commission: string; services: string } = {
    name: '', type: '', contact: '', contract: '', commission: '', services: '',
  };

  showConfirm = false;
  pendingDelete: Provider | null = null;

  get filtered(): Provider[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.providers;
    return this.providers.filter(
      p => p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q) || p.contact.toLowerCase().includes(q),
    );
  }

  get pagedItems(): Provider[] {
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
      this.providers = await firstValueFrom(this.api.getProviders());
    } catch {
      this.error = 'No se pudieron cargar los proveedores.';
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
    this.form = { name: '', type: '', contact: '', contract: '', commission: '', services: '' };
    this.activeView = 'form';
  }

  closeForm(): void {
    this.activeView = 'list';
  }

  async save(): Promise<void> {
    if (!this.form.name.trim() || !this.form.type.trim() || !this.form.contact.trim()) {
      this.notification.show('Nombre, tipo y contacto son obligatorios.', 'error');
      return;
    }
    this.saving = true;
    try {
      await firstValueFrom(this.api.createProvider({
        name: this.form.name.trim(),
        type: this.form.type.trim(),
        contact: this.form.contact.trim(),
        contract: this.form.contract.trim() || undefined,
        commission: this.form.commission.trim() || undefined,
        services: this.form.services.trim() || undefined,
      }));
      this.notification.show('Proveedor creado correctamente.', 'success');
      this.closeForm();
      await this.load();
    } catch {
      this.notification.show('No se pudo crear el proveedor.', 'error');
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }

  confirmDelete(p: Provider): void {
    this.pendingDelete = p;
    this.showConfirm = true;
  }

  async deleteItem(): Promise<void> {
    if (!this.pendingDelete) return;
    this.showConfirm = false;
    this.isLoading = true;
    try {
      await firstValueFrom(this.api.deleteProvider(this.pendingDelete.id));
      this.notification.show('Proveedor eliminado.', 'success');
      this.pendingDelete = null;
      await this.load();
    } catch {
      this.notification.show('No se pudo eliminar el proveedor.', 'error');
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  trackByFn(index: number, item: Provider): string {
    return item.id;
  }
}
