import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tour, TourPayload, TravelApiService } from '../../../services/travel-api.service';
import { Skeleton } from '../../../components/skeleton/skeleton';
import { ConfirmDialog } from '../../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-tours-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Skeleton, ConfirmDialog],
  templateUrl: './tours-dashboard.html',
  styleUrls: ['./tours-dashboard.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToursDashboard implements OnInit {
  tours: Tour[] = [];
  isLoading = false;
  isModalOpen = false;
  selectedTourId: string | null = null;
  tourForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly travelApi: TravelApiService,
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.tourForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      duration: ['', Validators.required],
      location: [''],
      difficulty: [''],
      images: [''],
      availability: [true],
    });
  }

  get isEditMode(): boolean {
    return this.selectedTourId !== null;
  }

  ngOnInit(): void {
    this.loadTours();
  }

  loadTours(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.travelApi.getTours().subscribe({
      next: (response) => {
        this.tours = response.items;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los tours.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  openModal(tour?: Tour): void {
    this.selectedTourId = tour?.id ?? null;
    this.errorMessage = '';
    this.tourForm.reset({
      name: tour?.name ?? '',
      description: tour?.description ?? '',
      price: tour?.price ?? 0,
      duration: tour?.duration ?? '',
      location: tour?.location ?? '',
      difficulty: tour?.difficulty ?? '',
      images: tour?.images ?? '',
      availability: tour?.availability ?? true,
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedTourId = null;
    this.tourForm.reset();
  }

  saveTour(): void {
    if (this.tourForm.invalid) {
      this.tourForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const payload = this.tourForm.getRawValue() as TourPayload;
    const request = this.selectedTourId
      ? this.travelApi.updateTour(this.selectedTourId, payload)
      : this.travelApi.createTour(payload);

    request.subscribe({
      next: () => {
        this.successMessage = this.isEditMode ? 'Tour actualizado.' : 'Tour creado.';
        this.closeModal();
        this.loadTours();
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'No se pudo guardar el tour.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  trackByFn(index: number, item: Tour): string | number {
    return item.id ?? index;
  }

  showConfirm = false;
  pendingDeleteId = "";

  confirmDelete(id: string): void {
    this.pendingDeleteId = id;
    this.showConfirm = true;
  }

  deleteTour(): void {
    this.isLoading = true;
    this.travelApi.deleteTour(this.pendingDeleteId).subscribe({
      next: () => {
        this.successMessage = 'Tour eliminado.';
        this.loadTours();
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'No se pudo eliminar el tour.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
