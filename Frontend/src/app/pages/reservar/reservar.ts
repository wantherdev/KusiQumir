import { isDevMode, Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  TravelApiService,
  Tour,
  TravelPackage,
  Booking,
} from '../../services/travel-api.service';
import { LocalBookingsService } from '../../services/local-bookings.service';
import { NotificationService } from '../../services/notification.service';

type BookingType = 'tour' | 'package';

@Component({
  selector: 'app-reservar',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reservar.html',
  styleUrl: '../page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Reservar implements OnInit {
  type: BookingType = 'tour';
  itemId = '';
  item: Tour | TravelPackage | null = null;
  isLoading = true;
  submitting = false;
  success = false;
  error = '';

  travelers = 1;
  customerName = '';
  customerEmail = '';
  customerPhone = '';
  startDate = '';
  notes = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly travelApi: TravelApiService,
    private readonly local: LocalBookingsService,
    private readonly notification: NotificationService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    const type = this.route.snapshot.queryParamMap.get('tipo');
    const id = this.route.snapshot.queryParamMap.get('id');
    this.type = type === 'package' ? 'package' : 'tour';
    this.itemId = id ?? '';

    if (!this.itemId) {
      this.isLoading = false;
      this.cdr.markForCheck();
      return;
    }

    try {
      if (this.type === 'package') {
        this.item = await firstValueFrom(this.travelApi.getPackage(this.itemId));
      } else {
        this.item = await firstValueFrom(this.travelApi.getTourById(this.itemId));
      }
    } catch (e) {
      if (isDevMode()) console.error(e);
      this.error = 'No se pudo cargar la información del producto.';
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  get title(): string {
    return this.item ? (this.item as Tour).name ?? (this.item as TravelPackage).name : '';
  }

  get price(): number {
    return this.item ? (this.item as Tour).adultPrice ?? (this.item as TravelPackage).price : 0;
  }

  get total(): number {
    return this.price * this.travelers;
  }

  async submit(): Promise<void> {
    if (!this.itemId) return;
    this.submitting = true;
    this.error = '';
    const payload = {
      ...(this.type === 'package'
        ? { packageId: this.itemId }
        : { tourId: this.itemId }),
      travelers: this.travelers,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone,
      startDate: this.startDate || undefined,
      notes: this.notes,
    };
    const localBooking: Booking = {
      id: `local-${Date.now()}`,
      customerId: 'guest',
      tourId: this.type === 'tour' ? this.itemId : null,
      packageId: this.type === 'package' ? this.itemId : null,
      travelers: this.travelers,
      status: 'PENDIENTE',
      date: this.startDate || new Date().toISOString().slice(0, 10),
      total: this.total,
      unitPrice: this.price,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone,
      startDate: this.startDate || null,
      notes: this.notes,
      createdAt: new Date().toISOString(),
      tour: this.type === 'tour' ? (this.item as Tour) : null,
      package: this.type === 'package' ? (this.item as TravelPackage) : null,
    };
    try {
      this.local.add(localBooking);
      this.success = true;
      this.notification.show('¡Reserva enviada! Te contactaremos para confirmar.', 'success');
    } catch (e) {
      if (isDevMode()) console.error(e);
      this.error = 'No se pudo guardar la reserva. Inténtalo nuevamente.';
      this.notification.show('Error al guardar la reserva.', 'error');
    } finally {
      this.submitting = false;
      this.cdr.markForCheck();
    }
  }
}
