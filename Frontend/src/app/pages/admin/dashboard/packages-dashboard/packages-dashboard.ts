import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tour, TravelApiService, TravelPackage } from '../../../../services/travel-api.service';
import { Skeleton } from '../../../../components/skeleton/skeleton';
import { ConfirmDialog } from '../../../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-packages-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Skeleton, ConfirmDialog],
  templateUrl: './packages-dashboard.html',
})
export class PackagesDashboard implements OnInit {
  packages: TravelPackage[] = [];
  tours: Tour[] = [];
  isLoading = false;
  isModalOpen = false;
  selectedPackageId: string | null = null;
  pkgForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  selectedTourIds: Set<string> = new Set();

  constructor(
    private readonly api: TravelApiService,
    private readonly fb: FormBuilder,
  ) {
    this.pkgForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      durationDays: [null],
      discount: [null],
      featured: [false],
      imageUrl: [''],
      included: [''],
      excluded: [''],
    });
  }

  get isEditMode(): boolean {
    return this.selectedPackageId !== null;
  }

  ngOnInit(): void {
    this.load();
    this.api.getTours().subscribe({
      next: (res) => { this.tours = res.items; },
    });
  }

  load(): void {
    this.isLoading = true;
    this.api.getPackages().subscribe({
      next: (res) => { this.packages = res; this.isLoading = false; },
      error: () => { this.errorMessage = 'Error al cargar paquetes.'; this.isLoading = false; },
    });
  }

  openModal(pkg?: TravelPackage): void {
    this.selectedPackageId = pkg?.id ?? null;
    this.errorMessage = '';
    this.selectedTourIds = new Set(pkg?.tours?.map((t) => t.id) ?? []);
    this.pkgForm.reset({
      name: pkg?.name ?? '',
      description: pkg?.description ?? '',
      price: pkg?.price ?? 0,
      durationDays: pkg?.durationDays ?? null,
      discount: pkg?.discount ?? null,
      featured: pkg?.featured ?? false,
      imageUrl: pkg?.imageUrl ?? '',
      included: pkg?.included ?? '',
      excluded: pkg?.excluded ?? '',
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedPackageId = null;
    this.selectedTourIds = new Set();
    this.pkgForm.reset();
  }

  toggleTour(tourId: string): void {
    if (this.selectedTourIds.has(tourId)) {
      this.selectedTourIds.delete(tourId);
    } else {
      this.selectedTourIds.add(tourId);
    }
  }

  save(): void {
    if (this.pkgForm.invalid || this.selectedTourIds.size === 0) {
      this.pkgForm.markAllAsTouched();
      if (this.selectedTourIds.size === 0) this.errorMessage = 'Selecciona al menos un tour.';
      return;
    }

    this.isLoading = true;
    const payload = {
      ...this.pkgForm.getRawValue(),
      tours: Array.from(this.selectedTourIds),
    };
    const request = this.selectedPackageId
      ? this.api.updatePackage(this.selectedPackageId, payload)
      : this.api.createPackage(payload);

    request.subscribe({
      next: () => {
        this.successMessage = this.isEditMode ? 'Paquete actualizado.' : 'Paquete creado.';
        this.closeModal();
        this.load();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al guardar.';
        this.isLoading = false;
      },
    });
  }

  showConfirm = false;
  pendingDeleteId = '';

  confirmDelete(id: string): void {
    this.pendingDeleteId = id;
    this.showConfirm = true;
  }

  deletePackage(): void {
    this.api.deletePackage(this.pendingDeleteId).subscribe({
      next: () => { this.successMessage = 'Paquete eliminado.'; this.load(); },
      error: (err) => { this.errorMessage = err.error?.message || 'Error al eliminar.'; },
    });
  }

  trackByFn(index: number, item: any): any {
    return item.id ?? index;
  }
}
