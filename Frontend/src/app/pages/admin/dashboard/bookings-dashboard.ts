import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking, TravelApiService } from '../../../services/travel-api.service';
import { Skeleton } from '../../../components/skeleton/skeleton';
import { ConfirmDialog } from '../../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-bookings-dashboard',
  standalone: true,
  imports: [CommonModule, Skeleton, ConfirmDialog],
  templateUrl: './bookings-dashboard.html',
})
export class BookingsDashboard implements OnInit {
  items: Booking[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  statusFilter = '';

  constructor(private readonly api: TravelApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    const params: Record<string, string> = {};
    if (this.statusFilter) params['status'] = this.statusFilter;
    this.api.getBookings(params).subscribe({
      next: (res) => { this.items = res.items; this.isLoading = false; },
      error: () => { this.errorMessage = 'Error al cargar reservas.'; this.isLoading = false; },
    });
  }

  updateStatus(id: string, status: string): void {
    this.api.updateBookingStatus(id, status).subscribe({
      next: () => { this.successMessage = 'Estado actualizado.'; this.load(); },
      error: (err) => { this.errorMessage = err.error?.message || 'Error al actualizar.'; },
    });
  }

  showConfirm = false;
  pendingCancelId = "";

  confirmCancel(id: string): void {
    this.pendingCancelId = id;
    this.showConfirm = true;
  }

  cancelBooking(): void {
    this.api.cancelBooking(this.pendingCancelId).subscribe({
      next: () => { this.successMessage = 'Reserva cancelada.'; this.load(); },
      error: (err) => { this.errorMessage = err.error?.message || 'Error al cancelar.'; },
    });
  }

  trackByFn(index: number, item: any): any {
    return item.id ?? index;
  }

  setFilter(status: string): void {
    this.statusFilter = status;
    this.load();
  }
}
