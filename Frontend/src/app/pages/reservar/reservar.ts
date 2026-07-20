import { isDevMode, Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  TravelApiService,
  Tour,
  TravelPackage,
  Booking,
} from '../../services/travel-api.service';
import { LocalBookingsService } from '../../services/local-bookings.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

type BookingType = 'tour' | 'package';

interface PriceTier {
  label: string;
  amount: number;
  currency?: string;
}

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

  selectedPriceIndex = 0;

  travelers = 1;
  customerName = '';
  customerEmail = '';
  customerPhone = '';
  startDate = '';
  notes = '';

  @ViewChild('reservaForm') reservaForm?: NgForm;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly travelApi: TravelApiService,
    private readonly local: LocalBookingsService,
    private readonly auth: AuthService,
    private readonly router: Router,
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

    const user = this.auth.user();
    if (user) {
      this.customerEmail = user.email ?? this.customerEmail;
    }
  }

  get today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  get isTour(): boolean {
    return this.type === 'tour';
  }

  get itemImage(): string | null {
    if (this.isTour) return (this.item as Tour).images?.[0]?.url ?? null;
    return (this.item as TravelPackage).imageUrl ?? null;
  }

  get itemTitle(): string {
    return this.isTour ? (this.item as Tour).title : (this.item as TravelPackage).name;
  }

  get itemSubtitle(): string {
    return this.isTour ? (this.item as Tour).subtitle ?? '' : '';
  }

  get itemDescription(): string {
    return this.isTour ? (this.item as Tour).description : (this.item as TravelPackage).description ?? '';
  }

  get itemDuration(): string {
    if (this.isTour) {
      const t = this.item as Tour;
      return `${t.durationDays}${t.durationDays ? 'd' : ''} ${t.durationHours}h`;
    }
    const p = this.item as TravelPackage;
    return p.durationDays ? `${p.durationDays} días` : '—';
  }

  get itemCategory(): string {
    return this.isTour ? (this.item as Tour).category?.name ?? '' : '';
  }

  get itemDestinations(): string[] {
    if (!this.isTour) return [];
    return ((this.item as Tour).destinations?.map((d) => d.destination?.name).filter(Boolean) as string[]) ?? [];
  }

  get itemDifficulty(): string {
    return this.isTour ? (this.item as Tour).difficulty ?? '' : '';
  }

  get itemGroup(): string {
    return this.isTour ? ((this.item as Tour).groupType === 'Shared' ? 'Grupo compartido' : 'Privado') : '';
  }

  get itemService(): string {
    if (!this.isTour) return '';
    const st = (this.item as Tour).serviceType;
    return st === 'HalfDay' ? 'Medio día' : st === 'FullDay' ? 'Día completo' : 'Multi días';
  }

  get itemIncludes() {
    return this.isTour ? (this.item as Tour).includes : null;
  }

  get itemExcludes() {
    return this.isTour ? (this.item as Tour).excludes : null;
  }

  get itemSchedules() {
    return this.isTour ? (this.item as Tour).schedules : null;
  }

  get itemItinerary() {
    return this.isTour ? (this.item as Tour).itineraryDays : null;
  }

  get priceTiers(): PriceTier[] {
    if (this.isTour) {
      const prices = (this.item as Tour).prices ?? [];
      return prices.map((p) => ({
        label: p.name || 'Tarifa',
        amount: p.adult ?? p.child ?? p.private ?? 0,
        currency: p.currency,
      }));
    }
    const p = this.item as TravelPackage;
    return [{ label: 'Por persona', amount: p.price ?? 0, currency: 'USD' }];
  }

  get selectedTier(): PriceTier {
    const tiers = this.priceTiers;
    return tiers[this.selectedPriceIndex] ?? tiers[0] ?? { label: '', amount: 0 };
  }

  currencySymbol(cur?: string): string {
    switch (cur) {
      case 'PEN':
        return 'S/';
      case 'EUR':
        return '€';
      default:
        return '$';
    }
  }

  get title(): string {
    return this.itemTitle;
  }

  get price(): number {
    return this.selectedTier.amount;
  }

  get total(): number {
    return this.price * this.travelers;
  }

  incTravelers(): void {
    if (this.travelers < 20) {
      this.travelers++;
      this.cdr.markForCheck();
    }
  }

  decTravelers(): void {
    if (this.travelers > 1) {
      this.travelers--;
      this.cdr.markForCheck();
    }
  }

  selectTier(i: number): void {
    this.selectedPriceIndex = i;
    this.cdr.markForCheck();
  }

  async submit(): Promise<void> {
    if (!this.itemId) return;

    if (this.reservaForm?.invalid) {
      this.reservaForm.control.markAllAsTouched();
      this.error = 'Revisa los campos marcados en rojo antes de enviar.';
      this.cdr.markForCheck();
      return;
    }

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
      customerId: this.auth.user()?.email ?? 'guest',
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

    const finishLocal = (message: string, type: 'success' | 'info' = 'success') => {
      this.local.add(localBooking);
      this.success = true;
      this.notification.show(message, type);
      this.submitting = false;
      this.cdr.markForCheck();
    };

    if (this.auth.user()) {
      this.travelApi.createBooking(payload).subscribe({
        next: (booking) => {
          this.local.add(booking);
          this.submitting = false;
          this.cdr.markForCheck();
          this.notification.show('¡Reserva enviada! Te contactaremos para confirmar.', 'success');
          this.router.navigateByUrl('/mis-reservas');
        },
        error: () => {
          if (isDevMode()) console.warn('[Reserva] Backend no disponible, guardando localmente.');
          finishLocal('Reserva guardada. Te contactaremos para confirmar.', 'info');
        },
      });
      return;
    }

    try {
      finishLocal('¡Reserva enviada! Te contactaremos para confirmar.', 'success');
    } catch (e) {
      if (isDevMode()) console.error(e);
      this.error = 'No se pudo guardar la reserva. Inténtalo nuevamente.';
      this.notification.show('Error al guardar la reserva.', 'error');
      this.submitting = false;
      this.cdr.markForCheck();
    }
  }
}
