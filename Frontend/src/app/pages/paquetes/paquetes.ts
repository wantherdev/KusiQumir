import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
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
export class Paquetes implements OnInit, OnDestroy {
  readonly packages = signal<TravelPackage[]>([]);
  readonly selectedPackageId = signal<string | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly isSubmitting = signal(false);
  readonly message = signal('');
  readonly searchTerm = signal('');
  readonly selectedMode = signal<'all' | 'featured' | 'standard'>('all');
  readonly visibleSections = signal<Set<string>>(new Set());
  reservationForm = {
    fullName: '',
    email: '',
    phone: '',
    travelers: 2,
    startDate: '',
    notes: '',
  };

  readonly visiblePackages = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.packages().filter((pkg) => {
      const toursText = (pkg.tours ?? [])
        .map((t) => t.title ?? '')
        .join(' ');
      const searchableText = `${pkg.name} ${toursText}`.toLowerCase();
      const matchesSearch = !term || searchableText.includes(term);
      const matchesMode =
        this.selectedMode() === 'all' ||
        (this.selectedMode() === 'featured' ? Boolean(pkg.featured) : !pkg.featured);
      return matchesSearch && matchesMode;
    });
  });

  readonly selectedPackage = computed(() =>
    this.packages().find((pkg) => pkg.id === this.selectedPackageId()) ?? null,
  );

  readonly includedItems = computed(() =>
    this.selectedPackage()?.included
      ? this.selectedPackage()!.included!.split(',').map((s) => s.trim())
      : [],
  );

  readonly excludedItems = computed(() =>
    this.selectedPackage()?.excluded
      ? this.selectedPackage()!.excluded!.split(',').map((s) => s.trim())
      : [],
  );

  private observer?: IntersectionObserver;

  constructor(
    private readonly travelApiService: TravelApiService,
    private readonly notification: NotificationService,
    private readonly meta: Meta,
    private readonly title: Title,
  ) {}

  ngOnInit(): void {
    this.setupScrollObserver();
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
        this.packages.set(packages);
        this.selectedPackageId.set(this.packages()[0]?.id ?? null);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('No se pudieron cargar los paquetes. Intenta de nuevo más tarde.');
      },
    });
  }

  selectPackage(packageId: string): void {
    this.selectedPackageId.set(packageId);
    this.message.set('');
  }

  submitReservation(): void {
    if (!this.selectedPackageId()) {
      this.message.set('Selecciona un paquete antes de reservar.');
      return;
    }

    this.isSubmitting.set(true);
    this.message.set('');

    this.travelApiService
      .createBooking({
        packageId: this.selectedPackageId()!,
        travelers: this.reservationForm.travelers,
        customerName: this.reservationForm.fullName,
        customerEmail: this.reservationForm.email,
        customerPhone: this.reservationForm.phone,
        startDate: this.reservationForm.startDate,
        notes: this.reservationForm.notes,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notification.show('Reserva enviada con éxito. Nos pondremos en contacto pronto.', 'success');
          this.reservationForm = {
            fullName: '',
            email: '',
            phone: '',
            travelers: 2,
            startDate: '',
            notes: '',
          };
          this.selectedPackageId.set(null);
        },
        error: () => {
          this.isSubmitting.set(false);
          this.notification.show('No se pudo enviar la reserva. Intenta nuevamente.', 'error');
        },
      });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  isVisible(section: string): boolean {
    return this.visibleSections().has(section);
  }

  private setupScrollObserver(): void {
    if (typeof IntersectionObserver === 'undefined') return;
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section');
            if (id) this.visibleSections.update((s) => new Set(s).add(id));
          }
        });
      },
      { threshold: 0.15 },
    );
    setTimeout(() => {
      document.querySelectorAll('[data-section]').forEach((el) => this.observer?.observe(el));
    });
  }
}
