import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Operation, Guide, Booking, TravelApiService } from '../../../services/travel-api.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-operations-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
                  <i class="ri-settings-3-line"></i> Operaciones
                </h1>
                <p class="mt-1 text-sm text-white/85">{{ operations.length }} operación(es) registradas</p>
              </div>
              <div class="flex items-center gap-2">
                <button *ngIf="activeView === 'list'" (click)="openForm()" class="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]">
                  <i class="ri-add-line text-lg"></i>
                  Nueva operación
                </button>
              </div>
            </div>
          </header>

          <!-- Loading / Table -->
          <ng-container *ngIf="isLoading; else loaded">
            <div class="space-y-2">
              <div *ngFor="let _ of [].constructor(5)" class="h-14 animate-pulse rounded-2xl bg-white shadow-sm"></div>
            </div>
          </ng-container>

          <ng-template #loaded>
            <div *ngIf="operations.length === 0" class="animate-slide-up flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white py-16 shadow-sm">
              <div class="flex h-20 w-20 items-center justify-center rounded-full bg-secondary-soft text-primary">
                <i class="ri-settings-3-line text-4xl"></i>
              </div>
              <p class="text-lg font-semibold text-slate-700">No hay operaciones registradas</p>
              <p class="text-sm text-slate-400">Crea una nueva operación para comenzar.</p>
              <button (click)="openForm()" class="mt-1 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]">
                <i class="ri-add-line"></i> Crear operación
              </button>
            </div>

            <div *ngIf="operations.length > 0" class="animate-slide-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                  <thead>
                    <tr class="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th class="px-5 py-4">Reserva</th>
                      <th class="px-5 py-4">Guía</th>
                      <th class="px-5 py-4">Transporte</th>
                      <th class="px-5 py-4">Hora recogida</th>
                      <th class="px-5 py-4">Estado</th>
                      <th class="px-5 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr *ngFor="let op of operations; trackBy: trackByFn" class="transition hover:bg-secondary-soft">
                      <td class="px-5 py-4 font-medium text-tertiary">
                        {{ op.booking?.customerName || op.booking?.customer?.name || op.bookingId?.slice(0, 8) || '-' }}
                      </td>
                      <td class="px-5 py-4 text-slate-700">{{ op.guide?.name || op.guideId?.slice(0, 8) || '-' }}</td>
                      <td class="px-5 py-4 text-slate-700">{{ op.transport }}</td>
                      <td class="px-5 py-4 text-slate-700">{{ op.pickupTime }}</td>
                      <td class="px-5 py-4">
                        <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          [class.bg-green-50]="op.status === 'Confirmado'" [class.text-green-700]="op.status === 'Confirmado'"
                          [class.bg-yellow-50]="op.status === 'Pendiente'" [class.text-yellow-700]="op.status === 'Pendiente'"
                          [class.bg-red-50]="op.status === 'Cancelado'" [class.text-red-700]="op.status === 'Cancelado'"
                          [class.bg-slate-50]="!['Confirmado','Pendiente','Cancelado'].includes(op.status)"
                          [class.text-slate-600]="!['Confirmado','Pendiente','Cancelado'].includes(op.status)"
                        >
                          <span class="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
                            [class.bg-green-500]="op.status === 'Confirmado'"
                            [class.bg-yellow-500]="op.status === 'Pendiente'"
                            [class.bg-red-500]="op.status === 'Cancelado'"
                            [class.bg-slate-400]="!['Confirmado','Pendiente','Cancelado'].includes(op.status)"
                          ></span>
                          {{ op.status }}
                        </span>
                      </td>
                      <td class="px-5 py-4 text-right">
                        <button (click)="openForm(op)" class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary">
                          <i class="ri-edit-line"></i> Editar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </ng-template>
        </div>

        <!-- ====== FORM VIEW ====== -->
        <div *ngIf="activeView === 'form'">
          <div class="animate-slide-up overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-w-lg mx-auto">
            <div class="mb-6 flex items-center justify-between">
              <div>
                <h2 class="text-lg font-bold text-tertiary">
                  <i class="ri-settings-3-line mr-2 text-primary"></i>
                  {{ editingOp ? 'Editar operación' : 'Nueva operación' }}
                </h2>
                <p class="mt-1 text-sm text-slate-500">Completa los datos de la operación.</p>
              </div>
              <button (click)="closeForm()" aria-label="Cerrar" class="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
                <i class="ri-close-line"></i> Cerrar
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-slate-700">Reserva <span class="text-red-500">*</span></label>
                <select [(ngModel)]="form.bookingId" class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5">
                  <option value="">Seleccionar reserva</option>
                  <option *ngFor="let b of bookings" [value]="b.id">{{ b.customerName || b.customer?.name || b.id.slice(0, 8) }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-slate-700">Guía</label>
                <select [(ngModel)]="form.guideId" class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5">
                  <option value="">Sin guía</option>
                  <option *ngFor="let g of guides" [value]="g.id">{{ g.name }} ({{ g.languages }})</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-slate-700">Transporte <span class="text-red-500">*</span></label>
                <input [(ngModel)]="form.transport" placeholder="Ej. Minivan, Bus, 4x4" class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5" />
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-slate-700">Hora de recogida <span class="text-red-500">*</span></label>
                <input type="time" [(ngModel)]="form.pickupTime" class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5" />
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-slate-700">Estado</label>
                <select [(ngModel)]="form.status" class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5">
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmado">Confirmado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div class="flex items-center justify-between border-t border-slate-100 pt-4">
                <p class="text-xs text-slate-400">Campos con <span class="text-red-500">*</span> son obligatorios.</p>
                <div class="flex gap-3">
                  <button type="button" (click)="closeForm()" class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary">Cancelar</button>
                  <button (click)="save()" [disabled]="saving" class="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-primary to-primary-dark px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                    <i *ngIf="saving" class="ri-loader-4-line animate-spin"></i>
                    {{ saving ? 'Guardando...' : 'Guardar' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationsDashboard implements OnInit {
  private readonly api = inject(TravelApiService);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  operations: Operation[] = [];
  guides: Guide[] = [];
  bookings: Booking[] = [];
  isLoading = false;
  saving = false;
  activeView: 'list' | 'form' = 'list';
  editingOp: Operation | null = null;

  form: { bookingId: string; guideId: string; transport: string; pickupTime: string; status: string } = {
    bookingId: '',
    guideId: '',
    transport: '',
    pickupTime: '',
    status: 'Pendiente',
  };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.api.getOperations().subscribe({
      next: (items) => {
        this.operations = items;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.show('Error al cargar operaciones.', 'error');
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  openForm(op?: Operation): void {
    this.editingOp = op ?? null;
    this.form = {
      bookingId: op?.bookingId ?? '',
      guideId: op?.guideId ?? '',
      transport: op?.transport ?? '',
      pickupTime: op?.pickupTime ?? '',
      status: op?.status ?? 'Pendiente',
    };
    this.activeView = 'form';

    this.api.getGuides().subscribe({
      next: (items) => {
        this.guides = items;
        this.cdr.markForCheck();
      },
    });

    this.api.getBookings({ take: '50' }).subscribe({
      next: (res) => {
        this.bookings = res.items;
        this.cdr.markForCheck();
      },
    });
  }

  closeForm(): void {
    this.activeView = 'list';
    this.editingOp = null;
    this.form = { bookingId: '', guideId: '', transport: '', pickupTime: '', status: 'Pendiente' };
  }

  save(): void {
    if (!this.form.bookingId || !this.form.transport || !this.form.pickupTime) {
      this.notification.show('Completa los campos obligatorios.', 'error');
      return;
    }

    this.saving = true;
    this.api.createOperation({
      bookingId: this.form.bookingId,
      guideId: this.form.guideId || undefined,
      transport: this.form.transport,
      pickupTime: this.form.pickupTime,
      status: this.form.status,
    }).subscribe({
      next: () => {
        this.notification.show('Operación creada correctamente.', 'success');
        this.closeForm();
        this.load();
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.notification.show(err.error?.message || 'Error al crear operación.', 'error');
        this.saving = false;
        this.cdr.markForCheck();
      },
    });
  }

  trackByFn(index: number, item: Operation): string {
    return item.id;
  }
}
