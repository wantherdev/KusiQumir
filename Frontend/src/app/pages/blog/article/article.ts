import { Component, OnInit, inject, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title, DomSanitizer } from '@angular/platform-browser';
import { Article } from '../../../services/travel-api.service';

@Component({
  selector: 'app-blog-article',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-shell px-4 py-20 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl">
        <a routerLink="/blog" class="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary">
          ← Volver al blog
        </a>

        <nav *ngIf="article" aria-label="Breadcrumb" class="mb-4 text-sm text-slate-500">
          <ol class="flex items-center gap-2">
            <li><a routerLink="/" class="hover:text-primary">Inicio</a></li>
            <li>/</li>
            <li><a routerLink="/blog" class="hover:text-primary">Blog</a></li>
            <li>/</li>
            <li class="truncate max-w-[250px] font-semibold text-slate-800">{{ article.title }}</li>
          </ol>
        </nav>

        <ng-container *ngIf="error">
          <div class="rounded-2xl bg-red-50 p-8 text-center">
            <p class="text-red-600">{{ error }}</p>
            <a routerLink="/blog" class="mt-4 inline-block text-primary hover:underline">Ir al blog</a>
          </div>
        </ng-container>

        <ng-container *ngIf="article">
          <img
            [src]="article.coverImage || '/images/placeholder.svg'"
            [alt]="article.imageAlt || article.title"
            class="h-72 w-full rounded-[2rem] object-cover sm:h-96"
          />
          <div class="mt-8">
            <span *ngIf="article.category" class="inline-block rounded-full bg-amber-50 px-4 py-1 text-sm font-medium text-primary">
              {{ article.category }}
            </span>
            <h1 class="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{{ article.title }}</h1>
            <p class="mt-2 text-sm text-slate-400">{{ article.publishedAt ? (article.publishedAt | date:'longDate') : '' }}</p>
          </div>
          <div class="mt-8 prose prose-slate max-w-none" [innerHTML]="safeContent"></div>
        </ng-container>
      </div>
    </section>
  `,
  styleUrl: '../../page.css',
})
export class BlogArticle implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly sanitizer = inject(DomSanitizer);

  article: Article | null = null;
  error = '';
  safeContent: string | null = null;

  ngOnInit(): void {
    this.article = this.route.snapshot.data['article'] as Article | null;
    if (this.article) {
      this.safeContent = this.sanitizer.sanitize(SecurityContext.HTML, this.article.content) || '';
      this.setSeo(this.article);
    } else {
      this.error = 'No se pudo cargar el artículo.';
    }
  }

  private setSeo(article: Article): void {
    const t = `${article.title} | Kusi Q'umir`;
    const d = article.excerpt || 'Artículo en el blog de Kusi Q\'umir.';
    this.title.setTitle(t);
    this.meta.updateTag({ name: 'description', content: d });
    this.meta.updateTag({ property: 'og:title', content: t });
    this.meta.updateTag({ property: 'og:description', content: d });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ name: 'twitter:title', content: t });
    this.meta.updateTag({ name: 'twitter:description', content: d });
  }
}
