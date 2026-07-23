import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { Article } from '../../services/travel-api.service';
import { fallbackBlogArticles, type BlogArticle } from '../../data/travel-content';

const toArticle = (fb: BlogArticle): Article => ({
  id: String(fb.id),
  slug: fb.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
  title: fb.title,
  excerpt: fb.summary,
  content: fb.summary,
  coverImage: fb.image,
  imageAlt: fb.alt,
  category: fb.category,
  tags: null,
  status: 'published',
  publishedAt: null,
  createdAt: '',
  updatedAt: '',
});

@Component({
  selector: 'app-blog',
  imports: [CommonModule, RouterLink],
  templateUrl: './blog.html',
  styleUrl: '../page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Blog implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  articles: Article[] = fallbackBlogArticles.map(toArticle);
  isLoading = false;
  readonly visibleSections = signal<Set<string>>(new Set());
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.setupScrollObserver();
    this.title.setTitle('Blog | Kusi Q\'umir');
    this.meta.updateTag({ name: 'description', content: 'Consejos, guías y relatos para preparar tu próximo viaje a Cusco, Machu Picchu y Perú.' });
    this.meta.updateTag({ property: 'og:title', content: 'Blog | Kusi Q\'umir' });
    this.meta.updateTag({ property: 'og:description', content: 'Consejos, guías y relatos para preparar tu próximo viaje a Perú.' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Blog | Kusi Q\'umir' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Consejos, guías y relatos para preparar tu próximo viaje a Perú.' });

    const data = this.route.snapshot.data['articles'] as Article[] | undefined;
    if (data?.length) {
      this.articles = data;
    }
    this.isLoading = false;
  }

  trackByFn(_index: number, item: Article): string {
    return item.id;
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
