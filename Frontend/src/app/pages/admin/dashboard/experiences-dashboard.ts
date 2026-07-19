import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Experience, ExperiencePayload, TravelApiService } from '../../../services/travel-api.service';
import { Skeleton } from '../../../components/skeleton/skeleton';
import { ConfirmDialog } from '../../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-experiences-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Skeleton, ConfirmDialog],
  templateUrl: './experiences-dashboard.html',
})
export class ExperiencesDashboard implements OnInit {
  items: Experience[] = [];
  isLoading = false;
  isModalOpen = false;
  selectedId: string | null = null;
  form: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly api: TravelApiService,
    private readonly fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      summary: ['', Validators.required],
      content: ['', Validators.required],
      coverImage: [''],
      imageAlt: [''],
      location: [''],
      duration: [''],
      tourId: [''],
      status: ['DRAFT'],
      featured: [false],
      sortOrder: [0],
      publishedAt: [''],
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.api.getExperiencesAdmin().subscribe({
      next: (items) => { this.items = items; this.isLoading = false; },
      error: () => { this.errorMessage = 'Error al cargar experiencias.'; this.isLoading = false; },
    });
  }

  open(item?: Experience): void {
    this.selectedId = item?.id ?? null;
    this.form.reset({
      title: item?.title ?? '',
      slug: item?.slug ?? '',
      summary: item?.summary ?? '',
      content: item?.content ?? '',
      coverImage: item?.coverImage ?? '',
      imageAlt: item?.imageAlt ?? '',
      location: item?.location ?? '',
      duration: item?.duration ?? '',
      tourId: item?.tourId ?? '',
      status: item?.status ?? 'DRAFT',
      featured: item?.featured ?? false,
      sortOrder: item?.sortOrder ?? 0,
      publishedAt: item?.publishedAt ?? '',
    });
    this.isModalOpen = true;
  }

  close(): void {
    this.isModalOpen = false;
    this.selectedId = null;
    this.form.reset();
  }

  save(): void {
    if (this.form.invalid) return;
    this.isLoading = true;
    const payload = this.form.getRawValue() as ExperiencePayload;
    const req = this.selectedId
      ? this.api.updateExperience(this.selectedId, payload)
      : this.api.createExperience(payload);
    req.subscribe({
      next: () => { this.successMessage = 'Experiencia guardada.'; this.close(); this.load(); },
      error: (err) => { this.errorMessage = err.error?.message || 'Error al guardar.'; this.isLoading = false; },
    });
  }

  trackByFn(index: number, item: any): any {
    return item.id ?? index;
  }

  showConfirm = false;
  pendingDeleteId = "";

  confirmDelete(id: string): void {
    this.pendingDeleteId = id;
    this.showConfirm = true;
  }

  delete(): void {
    this.api.deleteExperience(this.pendingDeleteId).subscribe({
      next: () => { this.successMessage = 'Experiencia eliminada.'; this.load(); },
      error: () => { this.errorMessage = 'Error al eliminar.'; },
    });
  }
}
