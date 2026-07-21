import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Booking, TravelApiService } from '../../../services/travel-api.service';
import { Skeleton } from '../../../components/skeleton/skeleton';
import { ConfirmDialog } from '../../../components/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-bookings-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Skeleton, ConfirmDialog],
  templateUrl: './bookings-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingsDashboard implements OnInit {
  items: Booking[] = [];
  pageSize = 10;
  currentPage = 1;

  get pagedItems() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredBookings.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.filteredBookings.length / this.pageSize));
  }

  prevPage() { this.currentPage = Math.max(1, this.currentPage - 1); }
  nextPage() { this.currentPage = Math.min(this.totalPages, this.currentPage + 1); }

  onSearch(): void {
    this.currentPage = 1;
  }

  isLoading = false;
  private readonly notification = inject(NotificationService);
  statusFilter = '';
  searchQuery = '';
  selectedBooking: Booking | null = null;

  constructor(
    private readonly api: TravelApiService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  get filteredBookings(): Booking[] {
    const base = this.statusFilter
      ? this.items.filter(b => b.status === this.statusFilter)
      : this.items;
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return base;
    return base.filter(
      (b) =>
        b.customerName?.toLowerCase().includes(q) ||
        b.customerEmail?.toLowerCase().includes(q) ||
        b.customer?.name?.toLowerCase().includes(q) ||
        b.customer?.email?.toLowerCase().includes(q),
    );
  }

  getStatusCount(status: string): number {
    return this.items.filter(b => b.status === status).length;
  }

  load(): void {
    this.currentPage = 1;
    this.isLoading = true;
    this.selectedBooking = null;
    const params: Record<string, string> = {};
    if (this.statusFilter) params['status'] = this.statusFilter;
    this.api.getBookings(params).subscribe({
      next: (res) => { this.items = res.items; this.isLoading = false; this.cdr.markForCheck(); },
      error: () => { this.notification.show('Error al cargar reservas.', 'error'); this.isLoading = false; this.cdr.markForCheck(); },
    });
  }

  updateStatus(id: string, status: string): void {
    this.api.updateBookingStatus(id, status).subscribe({
      next: () => { this.notification.show('Estado actualizado.', 'success'); this.load(); this.cdr.markForCheck(); },
      error: (err: any) => { this.notification.show(err.error?.message || 'Error al actualizar.', 'error'); this.cdr.markForCheck(); },
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
      next: () => { this.notification.show('Reserva cancelada.', 'success'); this.load(); this.cdr.markForCheck(); },
      error: (err: any) => { this.notification.show(err.error?.message || 'Error al cancelar.', 'error'); this.cdr.markForCheck(); },
    });
  }

  trackByFn(index: number, item: Booking): string | number {
    return item.id ?? index;
  }

  setFilter(status: string): void {
    this.statusFilter = this.statusFilter === status ? '' : status;
    this.currentPage = 1;
    this.cdr.markForCheck();
  }

  openDetail(booking: Booking): void {
    this.selectedBooking = booking;
  }

  closeDetail(): void {
    this.selectedBooking = null;
  }
}
