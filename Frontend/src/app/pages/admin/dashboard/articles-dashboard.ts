import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Article, ArticlePayload, TravelApiService } from '../../../services/travel-api.service';
import { Skeleton } from '../../../components/skeleton/skeleton';
import { ConfirmDialog } from '../../../components/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-articles-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Skeleton, ConfirmDialog],
  templateUrl: './articles-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesDashboard implements OnInit {
  articles: Article[] = [];
  pageSize = 10;
  currentPage = 1;

  get pagedItems() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.articles.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.articles.length / this.pageSize));
  }

  prevPage() { this.currentPage = Math.max(1, this.currentPage - 1); }
  nextPage() { this.currentPage = Math.min(this.totalPages, this.currentPage + 1); }

  isLoading = false;
  activeView: 'list' | 'form' = 'list';
  selectedId: string | null = null;
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
      excerpt: ['', Validators.required],
      content: ['', Validators.required],
      coverImage: [''],
      imageAlt: [''],
      category: [''],
      tags: [''],
      status: ['DRAFT'],
      publishedAt: [''],
    });
  }

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.currentPage = 1;
    this.isLoading = true;
    this.api.getArticlesAdmin().subscribe({
      next: (items) => { this.articles = items; this.isLoading = false; this.cdr.markForCheck(); },
      error: () => { this.notification.show('Error al cargar artículos.', 'error'); this.isLoading = false; this.cdr.markForCheck(); },
    });
  }

  openForm(item?: Article): void {
    this.selectedId = item?.id ?? null;
    this.form.reset({
      title: item?.title ?? '',
      slug: item?.slug ?? '',
      excerpt: item?.excerpt ?? '',
      content: item?.content ?? '',
      coverImage: item?.coverImage ?? '',
      imageAlt: item?.imageAlt ?? '',
      category: item?.category ?? '',
      tags: item?.tags ?? '',
      status: item?.status ?? 'DRAFT',
      publishedAt: item?.publishedAt ?? '',
    });
    this.activeView = 'form';
  }

  closeForm(): void {
    this.activeView = 'list';
    this.selectedId = null;
    this.form.reset();
  }

  saveArticle(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.show('Completa los campos obligatorios marcados en rojo.', 'error');
      return;
    }
    this.isLoading = true;
    const payload = this.form.getRawValue() as ArticlePayload;
    const req = this.selectedId
      ? this.api.updateArticle(this.selectedId, payload)
      : this.api.createArticle(payload);
    req.subscribe({
      next: () => { this.notification.show('Artículo guardado.', 'success'); this.closeForm(); this.loadArticles(); this.cdr.markForCheck(); },
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

  trackByFn(index: number, item: Article): string | number {
    return item.id ?? index;
  }

  showConfirm = false;
  pendingDeleteId = "";

  confirmDelete(id: string): void {
    this.pendingDeleteId = id;
    this.showConfirm = true;
  }

  deleteArticle(): void {
    this.isLoading = true;
    this.api.deleteArticle(this.pendingDeleteId).subscribe({
      next: () => {
        this.notification.show('Artículo eliminado.', 'success');
        this.showConfirm = false;
        this.pendingDeleteId = "";
        this.loadArticles();
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
