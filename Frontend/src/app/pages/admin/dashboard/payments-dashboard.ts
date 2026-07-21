import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Payment, Booking, TravelApiService } from '../../../services/travel-api.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-payments-dashboard',
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
                  <i class="ri-bank-card-line"></i> Pagos
                </h1>
                <p class="mt-1 text-sm text-white/85">{{ payments.length }} pago(s) registrados</p>
              </div>
              <div class="flex items-center gap-2">
                <button (click)="openForm()" class="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]">
                  <i class="ri-add-line text-lg"></i>
                  Nuevo pago
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
            <div *ngIf="payments.length === 0" class="animate-slide-up flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white py-16 shadow-sm">
              <div class="flex h-20 w-20 items-center justify-center rounded-full bg-secondary-soft text-primary">
                <i class="ri-bank-card-line text-4xl"></i>
              </div>
              <p class="text-lg font-semibold text-slate-700">No hay pagos registrados</p>
              <p class="text-sm text-slate-400">Registra el primer pago para comenzar.</p>
              <button (click)="openForm()" class="mt-1 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]">
                <i class="ri-add-line"></i> Registrar pago
              </button>
            </div>

            <div *ngIf="payments.length > 0" class="animate-slide-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                  <thead>
                    <tr class="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th class="px-5 py-4">Reserva</th>
                      <th class="px-5 py-4">Monto</th>
                      <th class="px-5 py-4">Moneda</th>
                      <th class="px-5 py-4">Método</th>
                      <th class="px-5 py-4">Estado</th>
                      <th class="px-5 py-4">Fecha</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr *ngFor="let p of payments; trackBy: trackByFn" class="transition hover:bg-secondary-soft">
                      <td class="px-5 py-4 font-medium text-tertiary">
                        {{ p.booking?.customerName || p.booking?.customer?.name || p.bookingId?.slice(0, 8) || '-' }}
                      </td>
                      <td class="px-5 py-4 font-semibold text-tertiary">{{ '$' + p.amount }}</td>
                      <td class="px-5 py-4 text-slate-700">{{ p.currency }}</td>
                      <td class="px-5 py-4 text-slate-700">{{ p.method || '-' }}</td>
                      <td class="px-5 py-4">
                        <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          [class.bg-yellow-50]="p.status === 'PENDIENTE'" [class.text-yellow-700]="p.status === 'PENDIENTE'"
                          [class.bg-green-50]="p.status === 'COMPLETADO'" [class.text-green-700]="p.status === 'COMPLETADO'"
                          [class.bg-red-50]="p.status === 'RECHAZADO'" [class.text-red-700]="p.status === 'RECHAZADO'"
                          [class.bg-blue-50]="p.status === 'REEMBOLSADO'" [class.text-blue-700]="p.status === 'REEMBOLSADO'"
                          [class.bg-slate-50]="!['PENDIENTE','COMPLETADO','RECHAZADO','REEMBOLSADO'].includes(p.status)"
                          [class.text-slate-600]="!['PENDIENTE','COMPLETADO','RECHAZADO','REEMBOLSADO'].includes(p.status)"
                        >
                          <span class="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
                            [class.bg-yellow-500]="p.status === 'PENDIENTE'"
                            [class.bg-green-500]="p.status === 'COMPLETADO'"
                            [class.bg-red-500]="p.status === 'RECHAZADO'"
                            [class.bg-blue-500]="p.status === 'REEMBOLSADO'"
                            [class.bg-slate-400]="!['PENDIENTE','COMPLETADO','RECHAZADO','REEMBOLSADO'].includes(p.status)"
                          ></span>
                          {{ p.status }}
                        </span>
                      </td>
                      <td class="px-5 py-4 text-slate-700">{{ p.createdAt | date:'shortDate' }}</td>
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
                  <i class="ri-bank-card-line mr-2 text-primary"></i>
                  Nuevo pago
                </h2>
                <p class="mt-1 text-sm text-slate-500">Registra un pago asociado a una reserva.</p>
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
                <label class="mb-1.5 block text-xs font-semibold text-slate-700">Monto <span class="text-red-500">*</span></label>
                <input type="number" min="0" step="0.01" [(ngModel)]="form.amount" placeholder="0.00" class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5" />
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-slate-700">Moneda</label>
                <select [(ngModel)]="form.currency" class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5">
                  <option value="USD">USD</option>
                  <option value="PEN">PEN</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-slate-700">Método</label>
                <select [(ngModel)]="form.method" class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5">
                  <option value="">Seleccionar método</option>
                  <option value="credit_card">Tarjeta crédito</option>
                  <option value="cash">Efectivo</option>
                  <option value="transfer">Transferencia</option>
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
export class PaymentsDashboard implements OnInit {
  private readonly api = inject(TravelApiService);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  payments: Payment[] = [];
  bookings: Booking[] = [];
  isLoading = false;
  saving = false;
  activeView: 'list' | 'form' = 'list';

  form: { bookingId: string; amount: number | null; currency: string; method: string } = {
    bookingId: '',
    amount: null,
    currency: 'USD',
    method: '',
  };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.api.getPayments().subscribe({
      next: (items) => {
        this.payments = items;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.show('Error al cargar pagos.', 'error');
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  openForm(): void {
    this.form = { bookingId: '', amount: null, currency: 'USD', method: '' };
    this.activeView = 'form';

    this.api.getBookings({ take: '50' }).subscribe({
      next: (res) => {
        this.bookings = res.items;
        this.cdr.markForCheck();
      },
    });
  }

  closeForm(): void {
    this.activeView = 'list';
    this.form = { bookingId: '', amount: null, currency: 'USD', method: '' };
  }

  save(): void {
    if (!this.form.bookingId || this.form.amount === null || this.form.amount <= 0) {
      this.notification.show('Completa los campos obligatorios.', 'error');
      return;
    }

    this.saving = true;
    this.api.createPayment({
      bookingId: this.form.bookingId,
      amount: this.form.amount as number,
      currency: this.form.currency,
      method: this.form.method || undefined,
    }).subscribe({
      next: () => {
        this.notification.show('Pago registrado correctamente.', 'success');
        this.closeForm();
        this.load();
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.notification.show(err.error?.message || 'Error al registrar pago.', 'error');
        this.saving = false;
        this.cdr.markForCheck();
      },
    });
  }

  trackByFn(index: number, item: Payment): string {
    return item.id;
  }
}
