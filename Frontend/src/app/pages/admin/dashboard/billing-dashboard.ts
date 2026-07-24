import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Invoice, Booking, Customer, TravelApiService } from '../../../services/travel-api.service';
import { NotificationService } from '../../../services/notification.service';
import { Skeleton } from '../../../components/skeleton/skeleton';

@Component({
  selector: 'app-billing-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Skeleton],
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
                  <i class="ri-file-list-3-line"></i> Facturación
                </h1>
                <p class="mt-1 text-sm text-white/85">{{ filtered.length }} de {{ invoices.length }} factura(s) registradas</p>
              </div>
              <div class="flex items-center gap-2">
                <button (click)="openForm()" class="admin-btn-hero">
                  <i class="ri-add-line text-lg"></i>
                  Nueva factura
                </button>
              </div>
            </div>
          </header>

          <!-- Search -->
          <div class="mb-5">
            <div class="relative w-full max-w-md">
              <i class="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input [(ngModel)]="searchQuery" (ngModelChange)="onSearch()" placeholder="Buscar por cliente, reserva o estado…"
                class="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/5 placeholder:text-slate-400" />
              <button *ngIf="searchQuery" (click)="searchQuery=''; onSearch()" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700">
                <i class="ri-close-line text-lg"></i>
              </button>
            </div>
          </div>

          <!-- Loading / Table -->
          <ng-container *ngIf="isLoading; else loaded">
            <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <app-skeleton variant="table-row" [rows]="5" [cols]="7"></app-skeleton>
            </div>
          </ng-container>

          <ng-template #loaded>
            <div *ngIf="error" class="flex flex-col items-center gap-3 py-12 text-center">
              <i class="ri-error-warning-line text-4xl text-red-400"></i>
              <p class="text-sm text-slate-600">{{ error }}</p>
              <button (click)="load()" class="admin-btn-ghost">Reintentar</button>
            </div>

            <div *ngIf="!error && filtered.length === 0" class="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white py-16 shadow-sm">
              <div class="flex h-20 w-20 items-center justify-center rounded-full bg-secondary-soft text-primary">
                <i class="ri-file-list-3-line text-4xl"></i>
              </div>
              <p class="text-lg font-semibold text-slate-700">No hay facturas registradas</p>
              <p class="text-sm text-slate-400">Crea una nueva factura para comenzar.</p>
              <button (click)="openForm()" class="mt-1 admin-btn-hero">
                <i class="ri-add-line"></i> Crear factura
              </button>
            </div>

            <div *ngIf="filtered.length > 0" class="animate-slide-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                  <thead>
                    <tr class="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th class="px-5 py-4">Factura</th>
                      <th class="px-5 py-4">Reserva</th>
                      <th class="px-5 py-4">Cliente</th>
                      <th class="px-5 py-4">Monto</th>
                      <th class="px-5 py-4">Moneda</th>
                      <th class="px-5 py-4">Estado</th>
                      <th class="px-5 py-4">Fecha</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr *ngFor="let inv of pagedItems; trackBy: trackByFn" class="transition hover:bg-secondary-soft">
                      <td class="px-5 py-4 font-mono text-sm font-medium text-tertiary">{{ inv.id.slice(0, 8) }}...</td>
                      <td class="px-5 py-4 text-slate-700">
                        {{ inv.booking?.customerName || inv.booking?.customer?.name || inv.bookingId?.slice(0, 8) || '-' }}
                      </td>
                      <td class="px-5 py-4 text-slate-700">{{ inv.customer?.name || inv.customerId?.slice(0, 8) || '-' }}</td>
                      <td class="px-5 py-4 font-semibold text-tertiary">{{ '$' + inv.amount }}</td>
                      <td class="px-5 py-4 text-slate-700">{{ inv.currency }}</td>
                      <td class="px-5 py-4">
                        <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          [class.bg-yellow-50]="inv.status === 'GENERADA'" [class.text-yellow-700]="inv.status === 'GENERADA'"
                          [class.bg-blue-50]="inv.status === 'ENVIADA'" [class.text-blue-700]="inv.status === 'ENVIADA'"
                          [class.bg-green-50]="inv.status === 'PAGADA'" [class.text-green-700]="inv.status === 'PAGADA'"
                          [class.bg-red-50]="inv.status === 'CANCELADA'" [class.text-red-700]="inv.status === 'CANCELADA'"
                          [class.bg-slate-50]="inv.status === 'ANULADA'" [class.text-slate-600]="inv.status === 'ANULADA'"
                          [class.bg-slate-50]="!['GENERADA','ENVIADA','PAGADA','CANCELADA','ANULADA'].includes(inv.status)"
                          [class.text-slate-600]="!['GENERADA','ENVIADA','PAGADA','CANCELADA','ANULADA'].includes(inv.status)"
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
                      <td class="px-5 py-4 text-slate-700">{{ inv.createdAt | date:'shortDate' }}</td>
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
          <div class="animate-slide-up overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-w-lg mx-auto">
            <div class="mb-6 flex items-center justify-between">
              <div>
                <h2 class="text-lg font-bold text-tertiary">
                  <i class="ri-file-list-3-line mr-2 text-primary"></i>
                  Nueva factura
                </h2>
                <p class="mt-1 text-sm text-slate-500">Emite una factura asociada a una reserva.</p>
              </div>
              <button (click)="closeForm()" aria-label="Cerrar" class="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
                <i class="ri-close-line"></i> Cerrar
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-slate-700">Reserva <span class="text-red-500">*</span></label>
                <select [(ngModel)]="form.bookingId" (ngModelChange)="onBookingChange()" class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5">
                  <option value="">Seleccionar reserva</option>
                  <option *ngFor="let b of bookings" [value]="b.id">{{ b.customerName || b.customer?.name || b.id.slice(0, 8) }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-slate-700">Cliente <span class="text-red-500">*</span></label>
                <select [(ngModel)]="form.customerId" class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5">
                  <option value="">Seleccionar cliente</option>
                  <option *ngFor="let c of customers" [value]="c.id">{{ c.name }} ({{ c.email }})</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-slate-700">Monto <span class="text-red-500">*</span></label>
                <input type="number" min="0" step="0.01" [(ngModel)]="form.amount" placeholder="0.00" class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5" />
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-semibold text-slate-700">Moneda</label>
                <select [(ngModel)]="form.currency" class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/5">
                  <option value="PEN">PEN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div class="flex items-center justify-between border-t border-slate-100 pt-4">
                <p class="text-xs text-slate-400">Campos con <span class="text-red-500">*</span> son obligatorios.</p>
                <div class="flex gap-3">
                  <button type="button" (click)="closeForm()" class="admin-btn-ghost">Cancelar</button>
                  <button (click)="save()" [disabled]="saving" class="admin-btn-submit">
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
export class BillingDashboard implements OnInit {
  private readonly api = inject(TravelApiService);
  private readonly notification = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  invoices: Invoice[] = [];
  bookings: Booking[] = [];
  customers: Customer[] = [];
  isLoading = false;
  error = '';
  searchQuery = '';
  pageSize = 10;
  currentPage = 1;
  saving = false;
  activeView: 'list' | 'form' = 'list';

  form: { bookingId: string; customerId: string; amount: number | null; currency: string } = {
    bookingId: '',
    customerId: '',
    amount: null,
    currency: 'PEN',
  };

  get filtered(): Invoice[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.invoices;
    return this.invoices.filter(
      inv =>
        (inv.customer?.name?.toLowerCase().includes(q) ?? false) ||
        (inv.booking?.customerName?.toLowerCase().includes(q) ?? false) ||
        inv.status.toLowerCase().includes(q),
    );
  }

  get pagedItems(): Invoice[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.error = '';
    this.currentPage = 1;
    this.api.getInvoices().subscribe({
      next: (items) => {
        this.invoices = items;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudieron cargar las facturas.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
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
