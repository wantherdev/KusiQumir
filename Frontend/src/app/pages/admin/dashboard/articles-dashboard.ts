import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Article, ArticlePayload, TravelApiService } from '../../../services/travel-api.service';
import { Skeleton } from '../../../components/skeleton/skeleton';
import { ConfirmDialog } from '../../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-articles-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Skeleton, ConfirmDialog],
  templateUrl: './articles-dashboard.html',
})
export class ArticlesDashboard implements OnInit {
  articles: Article[] = [];
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
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.api.getArticlesAdmin().subscribe({
      next: (items) => { this.articles = items; this.isLoading = false; },
      error: () => { this.errorMessage = 'Error al cargar artículos.'; this.isLoading = false; },
    });
  }

  open(item?: Article): void {
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
    const payload = this.form.getRawValue() as ArticlePayload;
    const req = this.selectedId
      ? this.api.updateArticle(this.selectedId, payload)
      : this.api.createArticle(payload);
    req.subscribe({
      next: () => { this.successMessage = 'Artículo guardado.'; this.close(); this.load(); },
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
    this.api.deleteArticle(this.pendingDeleteId).subscribe({
      next: () => { this.successMessage = 'Artículo eliminado.'; this.load(); },
      error: () => { this.errorMessage = 'Error al eliminar.'; },
    });
  }
}
