import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Experience, ExperiencePayload, Tour, TravelApiService } from '../../../services/travel-api.service';
import { Skeleton } from '../../../components/skeleton/skeleton';
import { ConfirmDialog } from '../../../components/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-experiences-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Skeleton, ConfirmDialog],
  templateUrl: './experiences-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperiencesDashboard implements OnInit {
  items: Experience[] = [];
  tours: Tour[] = [];
  pageSize = 10;
  currentPage = 1;

  get filteredItems(): Experience[] {
    const q = this.searchQuery?.toLowerCase().trim() ?? '';
    if (!q) return this.items;
    return this.items.filter(e =>
      e.title.toLowerCase().includes(q) ||
      (e.location?.toLowerCase() ?? '').includes(q)
    );
  }

  get pagedItems() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredItems.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.items.length / this.pageSize));
  }

  prevPage() { this.currentPage = Math.max(1, this.currentPage - 1); }
  nextPage() { this.currentPage = Math.min(this.totalPages, this.currentPage + 1); }

  isLoading = false;
  activeView: 'list' | 'form' = 'list';
  selectedId: string | null = null;
  searchQuery = '';
  form: FormGroup;
  private readonly notification = inject(NotificationService);

  constructor(
    private readonly api: TravelApiService,
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
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
    this.loadItems();
    this.api.getToursAdmin().subscribe({
      next: (items) => { this.tours = items; this.cdr.markForCheck(); },
    });
  }

  loadItems(): void {
    this.currentPage = 1;
    this.isLoading = true;
    this.api.getExperiencesAdmin().subscribe({
      next: (items) => { this.items = items; this.isLoading = false; this.cdr.markForCheck(); },
      error: () => { this.notification.show('Error al cargar experiencias.', 'error'); this.isLoading = false; this.cdr.markForCheck(); },
    });
  }

  onSearch(): void {
    this.currentPage = 1;
  }

  openForm(item?: Experience): void {
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
    this.activeView = 'form';
  }

  closeForm(): void {
    this.activeView = 'list';
    this.selectedId = null;
    this.form.reset();
  }

  saveItem(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.show('Completa los campos obligatorios marcados en rojo.', 'error');
      return;
    }
    this.isLoading = true;
    const payload = this.form.getRawValue() as ExperiencePayload;
    const req = this.selectedId
      ? this.api.updateExperience(this.selectedId, payload)
      : this.api.createExperience(payload);
    req.subscribe({
      next: () => { this.notification.show('Experiencia guardada.', 'success'); this.closeForm(); this.loadItems(); this.cdr.markForCheck(); },
      error: (err: any) => { this.notification.show(err.error?.message || 'Error al guardar.', 'error'); this.isLoading = false; this.cdr.markForCheck(); },
    });
  }

  generateSlug(): void {
    const title = this.form.get('title')?.value;
    if (title) {
      const slug = title.toLowerCase().replace(/[^a-z0-9áéíóúñü\s-]/g, '').replace(/[\s]+/g, '-').replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '');
      this.form.patchValue({ slug });
    }
  }

  trackByFn(index: number, item: Experience): string | number {
    return item.id ?? index;
  }

  showConfirm = false;
  pendingDeleteId = "";

  confirmDelete(id: string): void {
    this.pendingDeleteId = id;
    this.showConfirm = true;
  }

  deleteItem(): void {
    this.isLoading = true;
    this.api.deleteExperience(this.pendingDeleteId).subscribe({
      next: () => {
        this.notification.show('Experiencia eliminada.', 'success');
        this.showConfirm = false;
        this.pendingDeleteId = "";
        this.loadItems();
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.show('Error al eliminar.', 'error');
        this.showConfirm = false;
        this.pendingDeleteId = "";
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
