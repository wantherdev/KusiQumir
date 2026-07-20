import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Booking, TravelApiService } from '../../../services/travel-api.service';
import { LocalBookingsService } from '../../../services/local-bookings.service';
import { AuthService } from '../../../services/auth.service';
import { Skeleton } from '../../../components/skeleton/skeleton';
import { ConfirmDialog } from '../../../components/confirm-dialog/confirm-dialog';

const STATUS_COLORS: Record<string, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  CONFIRMADA: 'bg-green-100 text-green-800',
  COMPLETADA: 'bg-blue-100 text-blue-800',
  CANCELADA: 'bg-red-100 text-red-800',
};

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, RouterLink, Skeleton, ConfirmDialog],
  templateUrl: './mis-reservas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisReservas implements OnInit {
  items: Booking[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showConfirm = false;
  pendingCancelId = '';

  constructor(
    private readonly local: LocalBookingsService,
    private readonly api: TravelApiService,
    private readonly auth: AuthService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.showConfirm = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.isLoading = true;
    this.cdr.markForCheck();

    const localItems = this.local.bookings();

    if (this.auth.user()) {
      this.api.getMyBookings().subscribe({
        next: (server) => {
          const localOnly = localItems.filter((b) => b.id.startsWith('local-'));
          this.items = this.sort([...localOnly, ...server]);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.items = localItems;
          this.isLoading = false;
          this.errorMessage = 'No se pudieron cargar tus reservas del servidor.';
          this.cdr.markForCheck();
        },
      });
    } else {
      this.items = localItems;
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  confirmCancel(id: string): void {
    this.pendingCancelId = id;
    this.showConfirm = true;
  }

  cancelBooking(): void {
    const id = this.pendingCancelId;
    if (id.startsWith('local-')) {
      this.local.cancel(id);
      this.successMessage = 'Reserva cancelada correctamente.';
      this.load();
      return;
    }
    this.api.cancelBooking(id).subscribe({
      next: (booking) => {
        this.items = this.items.map((b) => (b.id === id ? { ...b, status: booking.status } : b));
        this.successMessage = 'Reserva cancelada correctamente.';
        this.showConfirm = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.successMessage = '';
        this.errorMessage = 'No se pudo cancelar la reserva. Inténtalo nuevamente.';
        this.showConfirm = false;
        this.cdr.markForCheck();
      },
    });
  }

  private sort(bookings: Booking[]): Booking[] {
    return [...bookings].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
  }

  trackByFn(index: number, item: Booking): any {
    return item.id ?? index;
  }

  getStatusColor(status: string): string {
    return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
  }
}
