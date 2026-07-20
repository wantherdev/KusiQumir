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
    <div class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-tertiary">Operaciones</h1>
            <p class="mt-2 text-sm text-slate-600">Gestiona las operaciones, guías y transporte de las reservas.</p>
          </div>
          <button *ngIf="activeView === 'list'" (click)="openForm()" class="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark">
            <i aria-hidden="true" class="ri-add-line"></i>
            Nueva operación
          </button>
          <button *ngIf="activeView === 'form'" (click)="closeForm()" class="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            <i aria-hidden="true" class="ri-arrow-left-line"></i>
            Volver
          </button>
        </div>

        <div *ngIf="activeView === 'list' && isLoading" class="space-y-2">
          <div *ngFor="let _ of [].constructor(5)" class="h-14 animate-pulse rounded-2xl bg-white shadow"></div>
        </div>

        <div *ngIf="activeView === 'list' && !isLoading" class="overflow-x-auto overflow-hidden rounded-2xl bg-white shadow">
          <p *ngIf="operations.length === 0" class="flex flex-col items-center gap-3 p-16 text-center">
            <i aria-hidden="true" class="ri-settings-3-line text-5xl text-slate-300"></i>
            <span class="text-lg font-medium text-slate-500">No hay operaciones registradas</span>
            <span class="text-sm text-slate-400">Crea una nueva operación para comenzar.</span>
            <button (click)="openForm()" class="mt-2 inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark">
              <i aria-hidden="true" class="ri-add-line"></i>
              Crear operación
            </button>
          </p>
          <table *ngIf="operations.length" class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Reserva</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Guía</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Transporte</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Hora recogida</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Estado</th>
                <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr *ngFor="let op of operations; trackBy: trackByFn" class="transition hover:bg-slate-50">
                <td class="px-6 py-4 text-sm font-medium text-tertiary">
                  {{ op.booking?.customerName || op.booking?.customer?.name || op.bookingId?.slice(0, 8) || '-' }}
                </td>
                <td class="px-6 py-4 text-sm text-slate-700">{{ op.guide?.name || op.guideId?.slice(0, 8) || '-' }}</td>
                <td class="px-6 py-4 text-sm text-slate-700">{{ op.transport }}</td>
                <td class="px-6 py-4 text-sm text-slate-700">{{ op.pickupTime }}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    [class.bg-green-100]="op.status === 'Confirmado'"
                    [class.text-green-800]="op.status === 'Confirmado'"
                    [class.bg-yellow-100]="op.status === 'Pendiente'"
                    [class.text-yellow-800]="op.status === 'Pendiente'"
                    [class.bg-red-100]="op.status === 'Cancelado'"
                    [class.text-red-800]="op.status === 'Cancelado'"
                    [class.bg-slate-100]="!['Confirmado','Pendiente','Cancelado'].includes(op.status)"
                    [class.text-slate-800]="!['Confirmado','Pendiente','Cancelado'].includes(op.status)"
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
                <td class="px-6 py-4 text-right text-sm">
                  <button (click)="openForm(op)" class="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-primary transition hover:bg-primary/5">
                    <i aria-hidden="true" class="ri-edit-line"></i>
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="activeView === 'form'" class="rounded-2xl bg-white p-6 shadow max-w-lg mx-auto">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-tertiary">{{ editingOp ? 'Editar operación' : 'Nueva operación' }}</h2>
            <p class="mt-1 text-sm text-slate-500">Completa los datos de la operación.</p>
          </div>
          <button (click)="closeForm()" aria-label="Cerrar" class="rounded-xl p-2 text-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">&times;</button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700">Reserva <span class="text-red-500">*</span></label>
            <select [(ngModel)]="form.bookingId" class="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10">
              <option value="">Seleccionar reserva</option>
              <option *ngFor="let b of bookings" [value]="b.id">{{ b.customerName || b.customer?.name || b.id.slice(0, 8) }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">Guía</label>
            <select [(ngModel)]="form.guideId" class="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10">
              <option value="">Sin guía</option>
              <option *ngFor="let g of guides" [value]="g.id">{{ g.name }} ({{ g.languages }})</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">Transporte <span class="text-red-500">*</span></label>
            <input [(ngModel)]="form.transport" placeholder="Ej. Minivan, Bus, 4x4" class="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">Hora de recogida <span class="text-red-500">*</span></label>
            <input type="time" [(ngModel)]="form.pickupTime" class="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">Estado</label>
            <select [(ngModel)]="form.status" class="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10">
              <option value="Pendiente">Pendiente</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <div class="flex items-center justify-between border-t border-slate-200 pt-4">
            <p class="text-xs text-slate-400">Campos con <span class="text-red-500">*</span> son obligatorios.</p>
            <div class="flex gap-3">
              <button type="button" (click)="closeForm()" class="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Cancelar</button>
              <button (click)="save()" [disabled]="saving" class="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed">
                <i *ngIf="saving" aria-hidden="true" class="ri-loader-4-line animate-spin"></i>
                {{ saving ? 'Guardando...' : 'Guardar' }}
              </button>
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