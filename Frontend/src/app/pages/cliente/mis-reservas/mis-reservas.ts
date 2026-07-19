import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Booking, TravelApiService } from '../../../services/travel-api.service';
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

  constructor(private readonly api: TravelApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.showConfirm = false;
    this.isLoading = true;
    this.api.getMyBookings().subscribe({
      next: (res) => { this.items = res; this.isLoading = false; },
      error: () => { this.errorMessage = 'Error al cargar tus reservas.'; this.isLoading = false; },
    });
  }

  confirmCancel(id: string): void {
    this.pendingCancelId = id;
    this.showConfirm = true;
  }

  cancelBooking(): void {
    this.api.cancelBooking(this.pendingCancelId).subscribe({
      next: () => { this.successMessage = 'Reserva cancelada correctamente.'; this.load(); },
      error: (err) => { this.errorMessage = err.error?.message || 'Error al cancelar.'; },
    });
  }

  trackByFn(index: number, item: Booking): any {
    return item.id ?? index;
  }

  getStatusColor(status: string): string {
    return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
  }
}
