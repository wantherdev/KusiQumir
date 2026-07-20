import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Guide, TravelApiService } from '../../../services/travel-api.service';
import { Skeleton } from '../../../components/skeleton/skeleton';
import { ConfirmDialog } from '../../../components/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../../services/notification.service';
import { API_URL } from '../../../tokens/api-url';

@Component({
  selector: 'app-guides-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Skeleton, ConfirmDialog],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="activeView === 'list'" class="rounded-2xl bg-white p-6 shadow-sm">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-tertiary">Guías</h2>
          <p class="mt-1 text-sm text-slate-500">{{ guides.length }} registrados</p>
        </div>
        <button (click)="openForm()" class="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark">
          <i class="ri-user-star-line text-lg"></i>
          Nuevo Guía
        </button>
      </div>

      <div class="mb-4">
        <div class="relative">
          <i class="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input [(ngModel)]="searchQuery" (ngModelChange)="onSearch()" placeholder="Buscar por nombre, idiomas o credencial…"
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
          <i class="ri-user-search-line mb-2 block text-3xl"></i>
          No se encontraron guías.
        </div>

        <div *ngIf="filtered.length > 0" class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 text-xs font-semibold uppercase text-slate-500">
                <th class="py-3 pr-4">Nombre</th>
                <th class="py-3 pr-4">Idiomas</th>
                <th class="py-3 pr-4">Credencial</th>
                <th class="py-3 pr-4">Disponible</th>
                <th class="py-3 pr-4">Valoración</th>
                <th class="py-3 pr-4">Registrado</th>
                <th class="py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let g of pagedItems; trackBy: trackByFn" class="border-b border-slate-50 transition hover:bg-slate-50/50">
                <td class="py-3 pr-4 font-medium text-tertiary">{{ g.name }}</td>
                <td class="py-3 pr-4 text-slate-600">{{ g.languages }}</td>
                <td class="py-3 pr-4 text-slate-600">{{ g.credential }}</td>
                <td class="py-3 pr-4">
                  <span (click)="toggleAvailability(g)" class="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition"
                    [class.bg-green-50]="g.availability"
                    [class.text-green-700]="g.availability"
                    [class.bg-red-50]="!g.availability"
                    [class.text-red-600]="!g.availability">
                    <i class="text-base" [class.ri-checkbox-circle-fill]="g.availability" [class.ri-close-circle-fill]="!g.availability"></i>
                    {{ g.availability ? 'Disponible' : 'No disponible' }}
                  </span>
                </td>
                <td class="py-3 pr-4">
                  <div class="flex items-center gap-1">
                    <i class="ri-star-fill text-amber-400"></i>
                    <span class="font-medium text-slate-700">{{ g.rating }}</span>
                    <span class="text-xs text-slate-400">/ 5</span>
                  </div>
                </td>
                <td class="py-3 pr-4 text-slate-500">{{ g.createdAt | date:'shortDate' }}</td>
                <td class="py-3 text-right">
                  <button (click)="confirmDelete(g)" class="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100">
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
        <h3 class="text-lg font-bold text-tertiary">Nuevo Guía</h3>
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
          <label class="mb-1.5 block text-xs font-semibold text-slate-700">Idiomas <span class="text-red-500">*</span></label>
          <input [(ngModel)]="form.languages" placeholder="Español, Inglés, Portugués…"
            class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-semibold text-slate-700">Credencial <span class="text-red-500">*</span></label>
          <input [(ngModel)]="form.credential" placeholder="N° licencia o certificación"
            class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
        </div>
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="mb-1.5 block text-xs font-semibold text-slate-700">Valoración</label>
            <input [(ngModel)]="form.rating" type="number" min="0" max="5" step="0.1" placeholder="0-5"
              class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div class="flex items-end pb-2.5">
            <label class="flex cursor-pointer items-center gap-2">
              <input type="checkbox" [(ngModel)]="form.availability" class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-200" />
              <span class="text-sm font-medium text-slate-700">Disponible</span>
            </label>
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
      title="Eliminar Guía"
      [message]="'¿Eliminar a «' + pendingDelete?.name + '»? Esta acción no se puede deshacer.'"
      (confirmed)="deleteItem()"
      (cancelled)="showConfirm = false"
    ></app-confirm-dialog>

  `,
})
export class GuidesDashboard implements OnInit {
  private readonly api = inject(TravelApiService);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notification = inject(NotificationService);

  guides: Guide[] = [];
  isLoading = false;
  error = '';
  searchQuery = '';
  pageSize = 10;
  currentPage = 1;

  activeView: 'list' | 'form' = 'list';
  saving = false;
  form: { name: string; languages: string; credential: string; availability: boolean; rating: number } = {
    name: '', languages: '', credential: '', availability: true, rating: 0,
  };

  showConfirm = false;
  pendingDelete: Guide | null = null;

  get filtered(): Guide[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.guides;
    return this.guides.filter(
      g => g.name.toLowerCase().includes(q) || g.languages.toLowerCase().includes(q) || g.credential.toLowerCase().includes(q),
    );
  }

  get pagedItems(): Guide[] {
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
      this.guides = await firstValueFrom(this.api.getGuides());
    } catch {
      this.error = 'No se pudieron cargar los guías.';
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
    this.form = { name: '', languages: '', credential: '', availability: true, rating: 0 };
    this.activeView = 'form';
  }

  closeForm(): void {
    this.activeView = 'list';
  }

  async toggleAvailability(g: Guide): Promise<void> {
    try {
      const updated = await firstValueFrom(
        this.http.patch<Guide>(`${this.apiUrl}/guides/${g.id}`, { availability: !g.availability }),
      );
      Object.assign(g, updated);
      this.cdr.markForCheck();
    } catch {
      this.notification.show('No se pudo actualizar la disponibilidad.', 'error');
    }
  }

  async save(): Promise<void> {
    if (!this.form.name.trim() || !this.form.languages.trim() || !this.form.credential.trim()) {
      this.notification.show('Nombre, idiomas y credencial son obligatorios.', 'error');
      return;
    }
    this.saving = true;
    try {
      await firstValueFrom(this.api.createGuide({
        name: this.form.name.trim(),
        languages: this.form.languages.trim(),
        credential: this.form.credential.trim(),
        availability: this.form.availability,
        rating: this.form.rating,
      }));
      this.notification.show('Guía creado correctamente.', 'success');
      this.closeForm();
      await this.load();
    } catch {
      this.notification.show('No se pudo crear el guía.', 'error');
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }

  confirmDelete(g: Guide): void {
    this.pendingDelete = g;
    this.showConfirm = true;
  }

  async deleteItem(): Promise<void> {
    if (!this.pendingDelete) return;
    this.showConfirm = false;
    this.isLoading = true;
    try {
      await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/guides/${this.pendingDelete.id}`));
      this.notification.show('Guía eliminado.', 'success');
      this.pendingDelete = null;
      await this.load();
    } catch {
      this.notification.show('No se pudo eliminar el guía.', 'error');
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  trackByFn(index: number, item: Guide): string {
    return item.id;
  }
}
