import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Skeleton } from '../../components/skeleton/skeleton';
import { NotificationService } from '../../services/notification.service';
import { TravelApiService, TravelPackage } from '../../services/travel-api.service';

@Component({
  selector: 'app-paquetes',
  imports: [CommonModule, FormsModule, RouterLink, Skeleton],
  templateUrl: './paquetes.html',
  styleUrl: '../page.css',
})
export class Paquetes implements OnInit {
  packages: TravelPackage[] = [];
  selectedPackageId: string | null = null;
  isLoading = true;
  errorMessage = '';
  isSubmitting = false;
  message = '';
  searchTerm = '';
  selectedMode: 'all' | 'featured' | 'standard' = 'all';
  reservationForm = {
    fullName: '',
    email: '',
    phone: '',
    travelers: 2,
    startDate: '',
    notes: '',
  };

  constructor(
    private readonly travelApiService: TravelApiService,
    private readonly notification: NotificationService,
    private readonly meta: Meta,
    private readonly title: Title,
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Paquetes | Kusi Q\'umir');
    this.meta.updateTag({
      name: 'description',
      content:
        'Itinerarios hechos para viajeros exigentes: transporte confiable, alojamiento cuidadosamente elegido y apoyo local experto.',
    });
    this.meta.updateTag({
      property: 'og:title',
      content: 'Paquetes | Kusi Q\'umir',
    });
    this.meta.updateTag({
      property: 'og:description',
      content:
        'Cada propuesta incluye transporte confiable, alojamiento cuidadosamente elegido y apoyo local experto.',
    });
    this.travelApiService.getPackages().subscribe({
      next: (packages) => {
        this.packages = packages;
        this.selectedPackageId = this.packages[0]?.id ?? null;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'No se pudieron cargar los paquetes. Intenta de nuevo más tarde.';
      },
    });
  }

  getVisiblePackages(): TravelPackage[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.packages.filter((pkg) => {
      const toursText = (pkg.tours ?? [])
        .map((t) => t.name ?? '')
        .join(' ');
      const searchableText = `${pkg.name} ${toursText}`.toLowerCase();
      const matchesSearch = !term || searchableText.includes(term);
      const matchesMode =
        this.selectedMode === 'all' ||
        (this.selectedMode === 'featured' ? Boolean(pkg.featured) : !pkg.featured);
      return matchesSearch && matchesMode;
    });
  }

  getSelectedPackage(): TravelPackage | null {
    return this.packages.find((pkg) => pkg.id === this.selectedPackageId) ?? null;
  }

  splitList(value: string | null | undefined): string[] {
    return value ? value.split(',').map((s) => s.trim()) : [];
  }

  trackByFn(index: number, item: any): any {
    return item.id ?? index;
  }

  selectPackage(packageId: string): void {
    this.selectedPackageId = packageId;
    this.message = '';
  }

  submitReservation(): void {
    if (!this.selectedPackageId) {
      this.message = 'Selecciona un paquete antes de reservar.';
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    this.travelApiService
      .createBooking({
        packageId: this.selectedPackageId!,
        travelers: this.reservationForm.travelers,
        customerName: this.reservationForm.fullName,
        customerEmail: this.reservationForm.email,
        customerPhone: this.reservationForm.phone,
        startDate: this.reservationForm.startDate,
        notes: this.reservationForm.notes,
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.notification.show('Reserva enviada con éxito. Nos pondremos en contacto pronto.', 'success');
          this.reservationForm = {
            fullName: '',
            email: '',
            phone: '',
            travelers: 2,
            startDate: '',
            notes: '',
          };
          this.selectedPackageId = null;
        },
        error: () => {
          this.isSubmitting = false;
          this.notification.show('No se pudo enviar la reserva. Intenta nuevamente.', 'error');
        },
      });
  }
}
