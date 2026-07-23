import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Guide, TravelApiService } from '../../../services/travel-api.service';
import { Skeleton } from '../../../components/skeleton/skeleton';
import { ConfirmDialog } from '../../../components/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-guides-dashboard',
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
                  <i class="ri-user-star-line"></i> Guías
                </h1>
                <p class="mt-1 text-sm text-white/85">{{ guides.length }} registrados</p>
              </div>
              <div class="flex items-center gap-2">
                <button (click)="openForm()" class="admin-btn-hero">
                  <i class="ri-user-star-line text-lg"></i>
                  Nuevo Guía
                </button>
              </div>
            </div>
          </header>

          <div class="mb-5">
            <div class="relative w-full max-w-md">
              <i class="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input [(ngModel)]="searchQuery" (ngModelChange)="onSearch()" placeholder="Buscar por nombre, idiomas o credencial…"
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
              <i class="ri-user-search-line mb-2 block text-4xl text-slate-300"></i>
              No se encontraron guías.
            </div>

            <div *ngIf="filtered.length > 0" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                  <thead>
                    <tr class="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th class="px-5 py-4">Nombre</th>
                      <th class="px-5 py-4">Idiomas</th>
                      <th class="px-5 py-4">Credencial</th>
                      <th class="px-5 py-4">Disponible</th>
                      <th class="px-5 py-4">Valoración</th>
                      <th class="px-5 py-4">Registrado</th>
                      <th class="px-5 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr *ngFor="let g of pagedItems; trackBy: trackByFn" class="transition hover:bg-secondary-soft">
                      <td class="px-5 py-4 font-medium text-tertiary">{{ g.name }}</td>
                      <td class="px-5 py-4 text-slate-600">{{ g.languages }}</td>
                      <td class="px-5 py-4 text-slate-600">{{ g.credential }}</td>
                      <td class="px-5 py-4">
                        <span (click)="toggleAvailability(g)" class="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition"
                          [class.bg-green-50]="g.availability"
                          [class.text-green-700]="g.availability"
                          [class.bg-red-50]="!g.availability"
                          [class.text-red-600]="!g.availability">
                          <i class="text-base" [class.ri-checkbox-circle-fill]="g.availability" [class.ri-close-circle-fill]="!g.availability"></i>
                          {{ g.availability ? 'Disponible' : 'No disponible' }}
                        </span>
                      </td>
                      <td class="px-5 py-4">
                        <div class="flex items-center gap-1">
                          <i class="ri-star-fill text-amber-400"></i>
                          <span class="font-medium text-slate-700">{{ g.rating }}</span>
                          <span class="text-xs text-slate-400">/ 5</span>
                        </div>
                      </td>
                      <td class="px-5 py-4 text-slate-500">{{ g.createdAt | date:'shortDate' }}</td>
                      <td class="px-5 py-4 text-right">
                        <button (click)="confirmDelete(g)" class="admin-btn-danger">
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
                  <i class="ri-user-star-line mr-2 text-primary"></i>
                  Nuevo Guía
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
                  <label class="mb-1.5 block text-xs font-semibold text-slate-700">Idiomas <span class="text-red-500">*</span></label>
                  <input [(ngModel)]="form.languages" placeholder="Español, Inglés, Portugués…"
                    class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5" />
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-semibold text-slate-700">Credencial <span class="text-red-500">*</span></label>
                  <input [(ngModel)]="form.credential" placeholder="N° licencia o certificación"
                    class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5" />
                </div>
                <div class="flex gap-4">
                  <div class="flex-1">
                    <label class="mb-1.5 block text-xs font-semibold text-slate-700">Valoración</label>
                    <input [(ngModel)]="form.rating" type="number" min="0" max="5" step="0.1" placeholder="0-5"
                      class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5" />
                  </div>
                  <div class="flex items-end pb-2.5">
                    <label class="flex cursor-pointer items-center gap-2">
                      <input type="checkbox" [(ngModel)]="form.availability" class="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/30" />
                      <span class="text-sm font-medium text-slate-700">Disponible</span>
                    </label>
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
          title="Eliminar Guía"
          [message]="'¿Eliminar a «' + pendingDelete?.name + '»? Esta acción no se puede deshacer.'"
          (confirmed)="deleteItem()"
          (cancelled)="showConfirm = false"
        ></app-confirm-dialog>

      </div>
    </div>
  `,
})
export class GuidesDashboard implements OnInit {
  private readonly api = inject(TravelApiService);
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
        this.api.updateGuide(g.id, { availability: !g.availability }),
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
      await firstValueFrom(this.api.deleteGuide(this.pendingDelete.id));
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
