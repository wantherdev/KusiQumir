import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Booking, TravelApiService } from '../../../services/travel-api.service';
import { Skeleton } from '../../../components/skeleton/skeleton';
import { ConfirmDialog } from '../../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, RouterLink, Skeleton, ConfirmDialog],
  templateUrl: './mis-reservas.html',
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

  trackByFn(index: number, item: any): any {
    return item.id ?? index;
  }

  statusColor(status: string): string {
    switch (status) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMADA': return 'bg-green-100 text-green-800';
      case 'COMPLETADA': return 'bg-blue-100 text-blue-800';
      case 'CANCELADA': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
