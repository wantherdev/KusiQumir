import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Invoice, Booking, Customer, TravelApiService } from '../../../services/travel-api.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-billing-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-tertiary">Facturación</h1>
            <p class="mt-2 text-sm text-slate-600">Administra las facturas emitidas a clientes.</p>
          </div>
          <button *ngIf="activeView === 'list'" (click)="openForm()" class="inline-flex items-center gap-2 btn-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark">
            <i aria-hidden="true" class="ri-add-line"></i>
            Nueva factura
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
          <p *ngIf="invoices.length === 0" class="flex flex-col items-center gap-3 p-16 text-center">
            <i aria-hidden="true" class="ri-file-list-3-line text-5xl text-slate-300"></i>
            <span class="text-lg font-medium text-slate-500">No hay facturas registradas</span>
            <span class="text-sm text-slate-400">Crea una nueva factura para comenzar.</span>
            <button (click)="openForm()" class="mt-2 inline-flex items-center gap-2 btn-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark">
              <i aria-hidden="true" class="ri-add-line"></i>
              Crear factura
            </button>
          </p>
          <table *ngIf="invoices.length" class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Factura</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Reserva</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Cliente</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Monto</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Moneda</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Fecha</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr *ngFor="let inv of invoices; trackBy: trackByFn" class="transition hover:bg-slate-50">
                <td class="px-6 py-4 text-sm font-mono font-medium text-tertiary">{{ inv.id.slice(0, 8) }}...</td>
                <td class="px-6 py-4 text-sm text-slate-700">
                  {{ inv.booking?.customerName || inv.booking?.customer?.name || inv.bookingId?.slice(0, 8) || '-' }}
                </td>
                <td class="px-6 py-4 text-sm text-slate-700">{{ inv.customer?.name || inv.customerId?.slice(0, 8) || '-' }}</td>
                <td class="px-6 py-4 text-sm font-semibold text-tertiary">{{ '$' + inv.amount }}</td>
                <td class="px-6 py-4 text-sm text-slate-700">{{ inv.currency }}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    [class.bg-yellow-100]="inv.status === 'GENERADA'"
                    [class.text-yellow-800]="inv.status === 'GENERADA'"
                    [class.bg-blue-100]="inv.status === 'ENVIADA'"
                    [class.text-blue-800]="inv.status === 'ENVIADA'"
                    [class.bg-green-100]="inv.status === 'PAGADA'"
                    [class.text-green-800]="inv.status === 'PAGADA'"
                    [class.bg-red-100]="inv.status === 'CANCELADA'"
                    [class.text-red-800]="inv.status === 'CANCELADA'"
                    [class.bg-slate-100]="inv.status === 'ANULADA'"
                    [class.text-slate-600]="inv.status === 'ANULADA'"
                    [class.bg-slate-100]="!['GENERADA','ENVIADA','PAGADA','CANCELADA','ANULADA'].includes(inv.status)"
                    [class.text-slate-800]="!['GENERADA','ENVIADA','PAGADA','CANCELADA','ANULADA'].includes(inv.status)"
                  >
                    <span class="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
                      [class.bg-yellow-500]="inv.status === 'GENERADA'"
                      [class.bg-blue-500]="inv.status === 'ENVIADA'"
                      [class.bg-green-500]="inv.status === 'PAGADA'"
                      [class.bg-red-500]="inv.status === 'CANCELADA'"
                      [class.bg-slate-400]="inv.status === 'ANULADA'"
                      [class.bg-slate-400]="!['GENERADA','ENVIADA','PAGADA','CANCELADA','ANULADA'].includes(inv.status)"
                    ></span>
                    {{ inv.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-slate-700">{{ inv.createdAt | date:'shortDate' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="activeView === 'form'" class="rounded-2xl bg-white p-6 shadow max-w-lg mx-auto">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-tertiary">Nueva factura</h2>
            <p class="mt-1 text-sm text-slate-500">Emite una factura asociada a una reserva.</p>
          </div>
          <button (click)="closeForm()" aria-label="Cerrar" class="rounded-xl p-2 text-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">&times;</button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700">Reserva <span class="text-red-500">*</span></label>
            <select [(ngModel)]="form.bookingId" (ngModelChange)="onBookingChange()" class="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10">
              <option value="">Seleccionar reserva</option>
              <option *ngFor="let b of bookings" [value]="b.id">{{ b.customerName || b.customer?.name || b.id.slice(0, 8) }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">Cliente <span class="text-red-500">*</span></label>
            <select [(ngModel)]="form.customerId" class="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10">
              <option value="">Seleccionar cliente</option>
              <option *ngFor="let c of customers" [value]="c.id">{{ c.name }} ({{ c.email }})</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">Monto <span class="text-red-500">*</span></label>
            <input type="number" min="0" step="0.01" [(ngModel)]="form.amount" placeholder="0.00" class="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">Moneda</label>
            <select [(ngModel)]="form.currency" class="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10">
              <option value="PEN">PEN</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          <div class="flex items-center justify-between border-t border-slate-200 pt-4">
            <p class="text-xs text-slate-400">Campos con <span class="text-red-500">*</span> son obligatorios.</p>
            <div class="flex gap-3">
              <button type="button" (click)="closeForm()" class="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Cancelar</button>
              <button (click)="save()" [disabled]="saving" class="inline-flex items-center gap-2 btn-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed">
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
export class BillingDashboard implements OnInit {
  private readonly api = inject(TravelApiService);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  invoices: Invoice[] = [];
  bookings: Booking[] = [];
  customers: Customer[] = [];
  isLoading = false;
  saving = false;
  activeView: 'list' | 'form' = 'list';

  form: { bookingId: string; customerId: string; amount: number | null; currency: string } = {
    bookingId: '',
    customerId: '',
    amount: null,
    currency: 'PEN',
  };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.api.getInvoices().subscribe({
      next: (items) => {
        this.invoices = items;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.show('Error al cargar facturas.', 'error');
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  openForm(): void {
    this.form = { bookingId: '', customerId: '', amount: null, currency: 'PEN' };
    this.activeView = 'form';

    this.api.getBookings({ take: '50' }).subscribe({
      next: (res) => {
        this.bookings = res.items;
        this.cdr.markForCheck();
      },
    });

    this.api.getCustomers().subscribe({
      next: (items) => {
        this.customers = items;
        this.cdr.markForCheck();
      },
    });
  }

  closeForm(): void {
    this.activeView = 'list';
    this.form = { bookingId: '', customerId: '', amount: null, currency: 'PEN' };
  }

  onBookingChange(): void {
    const booking = this.bookings.find((b) => b.id === this.form.bookingId);
    if (booking?.customerId) {
      this.form.customerId = booking.customerId;
    }
  }

  save(): void {
    if (!this.form.bookingId || !this.form.customerId || this.form.amount === null || this.form.amount <= 0) {
      this.notification.show('Completa los campos obligatorios.', 'error');
      return;
    }

    this.saving = true;
    this.api.createInvoice({
      bookingId: this.form.bookingId,
      customerId: this.form.customerId,
      amount: this.form.amount,
      currency: this.form.currency,
    }).subscribe({
      next: () => {
        this.notification.show('Factura creada correctamente.', 'success');
        this.closeForm();
        this.load();
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.notification.show(err.error?.message || 'Error al crear factura.', 'error');
        this.saving = false;
        this.cdr.markForCheck();
      },
    });
  }

  trackByFn(index: number, item: Invoice): string {
    return item.id;
  }
}