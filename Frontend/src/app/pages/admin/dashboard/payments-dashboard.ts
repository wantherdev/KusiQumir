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
    <div class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-tertiary">Pagos</h1>
            <p class="mt-2 text-sm text-slate-600">Registra y consulta los pagos de las reservas.</p>
          </div>
          <button *ngIf="activeView === 'list'" (click)="openForm()" class="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark">
            <i aria-hidden="true" class="ri-add-line"></i>
            Nuevo pago
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
          <p *ngIf="payments.length === 0" class="flex flex-col items-center gap-3 p-16 text-center">
            <i aria-hidden="true" class="ri-bank-card-line text-5xl text-slate-300"></i>
            <span class="text-lg font-medium text-slate-500">No hay pagos registrados</span>
            <span class="text-sm text-slate-400">Registra el primer pago para comenzar.</span>
            <button (click)="openForm()" class="mt-2 inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark">
              <i aria-hidden="true" class="ri-add-line"></i>
              Registrar pago
            </button>
          </p>
          <table *ngIf="payments.length" class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Reserva</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Monto</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Moneda</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Método</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Fecha</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr *ngFor="let p of payments; trackBy: trackByFn" class="transition hover:bg-slate-50">
                <td class="px-6 py-4 text-sm font-medium text-tertiary">
                  {{ p.booking?.customerName || p.booking?.customer?.name || p.bookingId?.slice(0, 8) || '-' }}
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-tertiary">{{ '$' + p.amount }}</td>
                <td class="px-6 py-4 text-sm text-slate-700">{{ p.currency }}</td>
                <td class="px-6 py-4 text-sm text-slate-700">{{ p.method || '-' }}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    [class.bg-yellow-100]="p.status === 'PENDIENTE'"
                    [class.text-yellow-800]="p.status === 'PENDIENTE'"
                    [class.bg-green-100]="p.status === 'COMPLETADO'"
                    [class.text-green-800]="p.status === 'COMPLETADO'"
                    [class.bg-red-100]="p.status === 'RECHAZADO'"
                    [class.text-red-800]="p.status === 'RECHAZADO'"
                    [class.bg-blue-100]="p.status === 'REEMBOLSADO'"
                    [class.text-blue-800]="p.status === 'REEMBOLSADO'"
                    [class.bg-slate-100]="!['PENDIENTE','COMPLETADO','RECHAZADO','REEMBOLSADO'].includes(p.status)"
                    [class.text-slate-800]="!['PENDIENTE','COMPLETADO','RECHAZADO','REEMBOLSADO'].includes(p.status)"
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
                <td class="px-6 py-4 text-sm text-slate-700">{{ p.createdAt | date:'shortDate' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="activeView === 'form'" class="rounded-2xl bg-white p-6 shadow max-w-lg mx-auto">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-tertiary">Nuevo pago</h2>
            <p class="mt-1 text-sm text-slate-500">Registra un pago asociado a una reserva.</p>
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
            <label class="block text-sm font-medium text-slate-700">Monto <span class="text-red-500">*</span></label>
            <input type="number" min="0" step="0.01" [(ngModel)]="form.amount" placeholder="0.00" class="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">Moneda</label>
            <select [(ngModel)]="form.currency" class="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10">
              <option value="USD">USD</option>
              <option value="PEN">PEN</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">Método</label>
            <select [(ngModel)]="form.method" class="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10">
              <option value="">Seleccionar método</option>
              <option value="credit_card">Tarjeta crédito</option>
              <option value="cash">Efectivo</option>
              <option value="transfer">Transferencia</option>
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