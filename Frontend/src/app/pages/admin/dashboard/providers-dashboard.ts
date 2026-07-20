import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Provider, TravelApiService } from '../../../services/travel-api.service';
import { Skeleton } from '../../../components/skeleton/skeleton';
import { ConfirmDialog } from '../../../components/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../../services/notification.service';
import { API_URL } from '../../../tokens/api-url';

@Component({
  selector: 'app-providers-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Skeleton, ConfirmDialog],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="activeView === 'list'" class="rounded-2xl bg-white p-6 shadow-sm">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-tertiary">Proveedores</h2>
          <p class="mt-1 text-sm text-slate-500">{{ providers.length }} registrados</p>
        </div>
        <button (click)="openForm()" class="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark">
          <i class="ri-building-2-add-line text-lg"></i>
          Nuevo Proveedor
        </button>
      </div>

      <div class="mb-4">
        <div class="relative">
          <i class="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input [(ngModel)]="searchQuery" (ngModelChange)="onSearch()" placeholder="Buscar por nombre, tipo o contacto…"
            class="w-full rounded-full border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        </div>
      </div>

      <ng-container *ngIf="isLoading; else loaded">
        <app-skeleton variant="table-row" [rows]="5" [cols]="6"></app-skeleton>
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
          <i class="ri-building-2-line mb-2 block text-3xl"></i>
          No se encontraron proveedores.
        </div>

        <div *ngIf="filtered.length > 0" class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 text-xs font-semibold uppercase text-slate-500">
                <th class="py-3 pr-4">Nombre</th>
                <th class="py-3 pr-4">Tipo</th>
                <th class="py-3 pr-4">Contacto</th>
                <th class="py-3 pr-4">Contrato</th>
                <th class="py-3 pr-4">Servicios</th>
                <th class="py-3 pr-4">Registrado</th>
                <th class="py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of pagedItems; trackBy: trackByFn" class="border-b border-slate-50 transition hover:bg-slate-50/50">
                <td class="py-3 pr-4 font-medium text-tertiary">{{ p.name }}</td>
                <td class="py-3 pr-4">
                  <span class="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">{{ p.type }}</span>
                </td>
                <td class="py-3 pr-4 text-slate-600">{{ p.contact }}</td>
                <td class="py-3 pr-4 text-slate-600">{{ p.contract || '—' }}</td>
                <td class="py-3 pr-4 text-slate-600 max-w-[160px] truncate" [title]="p.services || ''">{{ p.services || '—' }}</td>
                <td class="py-3 pr-4 text-slate-500">{{ p.createdAt | date:'shortDate' }}</td>
                <td class="py-3 text-right">
                  <button (click)="confirmDelete(p)" class="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100">
                    <i class="ri-delete-bin-6-line"></i>
                    Eliminar
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
        <h3 class="text-lg font-bold text-tertiary">Nuevo Proveedor</h3>
        <button (click)="closeForm()" class="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          <i class="ri-arrow-left-line"></i>
          Volver
        </button>
      </div>
      <div class="space-y-4">
        <div>
          <label class="mb-1.5 block text-xs font-semibold text-slate-700">Nombre <span class="text-red-500">*</span></label>
          <input [(ngModel)]="form.name" placeholder="Nombre del proveedor"
            class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        </div>
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="mb-1.5 block text-xs font-semibold text-slate-700">Tipo <span class="text-red-500">*</span></label>
            <input [(ngModel)]="form.type" placeholder="Hotel, DMC, Transporte…"
              class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div class="flex-1">
            <label class="mb-1.5 block text-xs font-semibold text-slate-700">Contacto <span class="text-red-500">*</span></label>
            <input [(ngModel)]="form.contact" placeholder="Email o teléfono"
              class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-semibold text-slate-700">Contrato</label>
          <input [(ngModel)]="form.contract" placeholder="Detalles del contrato"
            class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        </div>
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="mb-1.5 block text-xs font-semibold text-slate-700">Comisión</label>
            <input [(ngModel)]="form.commission" placeholder="10%"
              class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div class="flex-1">
            <label class="mb-1.5 block text-xs font-semibold text-slate-700">Servicios</label>
            <input [(ngModel)]="form.services" placeholder="Alojamiento, Tours…"
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

    <app-confirm-dialog
      [visible]="showConfirm"
      title="Eliminar Proveedor"
      [message]="'¿Eliminar a «' + pendingDelete?.name + '»? Esta acción no se puede deshacer.'"
      (confirmed)="deleteItem()"
      (cancelled)="showConfirm = false"
    ></app-confirm-dialog>

  `,
})
export class ProvidersDashboard implements OnInit {
  private readonly api = inject(TravelApiService);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
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
      await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/providers/${this.pendingDelete.id}`));
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
