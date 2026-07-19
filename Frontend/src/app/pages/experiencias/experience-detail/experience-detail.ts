import { Component, OnInit, inject, SecurityContext, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title, DomSanitizer } from '@angular/platform-browser';
import { Experience } from '../../../services/travel-api.service';

@Component({
  selector: 'app-experience-detail',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-shell px-4 py-20 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl">
        <a routerLink="/experiencias" class="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary">
          ← Volver a experiencias
        </a>

        <nav *ngIf="exp" aria-label="Breadcrumb" class="mb-4 text-sm text-slate-500">
          <ol class="flex items-center gap-2">
            <li><a routerLink="/" class="hover:text-primary">Inicio</a></li>
            <li>/</li>
            <li><a routerLink="/experiencias" class="hover:text-primary">Experiencias</a></li>
            <li>/</li>
            <li class="truncate max-w-[250px] font-semibold text-slate-800">{{ exp.title }}</li>
          </ol>
        </nav>

        <ng-container *ngIf="error">
          <div class="rounded-2xl bg-red-50 p-8 text-center">
            <p class="text-red-600">{{ error }}</p>
            <a routerLink="/experiencias" class="mt-4 inline-block text-primary hover:underline">Ir a experiencias</a>
          </div>
        </ng-container>

        <ng-container *ngIf="exp">
          <img
            [src]="exp.coverImage || '/images/placeholder.svg'"
            [alt]="exp.imageAlt || exp.title"
            class="h-72 w-full rounded-[2rem] object-cover sm:h-96"
          />
          <div class="mt-8">
            <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span *ngIf="exp.location" class="rounded-full bg-amber-50 px-3 py-1 font-medium text-primary">{{ exp.location }}</span>
              <span *ngIf="exp.duration">{{ exp.duration }}</span>
            </div>
            <h1 class="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{{ exp.title }}</h1>
          </div>
          <div class="mt-8 prose prose-slate max-w-none" [innerHTML]="safeContent"></div>
        </ng-container>
      </div>
    </section>
  `,
  styleUrl: '../../page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly sanitizer = inject(DomSanitizer);

  exp: Experience | null = null;
  error = '';
  safeContent: string | null = null;

  ngOnInit(): void {
    this.exp = this.route.snapshot.data['experience'] as Experience | null;
    if (this.exp) {
      this.safeContent = this.sanitizer.sanitize(SecurityContext.HTML, this.exp.content || this.exp.summary) || '';
      this.setSeo(this.exp);
    } else {
      this.error = 'No se pudo cargar la experiencia.';
    }
  }

  private setSeo(exp: Experience): void {
    const t = `${exp.title} | Kusi Q'umir`;
    const d = exp.summary || 'Experiencia auténtica en Perú con Kusi Q\'umir.';
    this.title.setTitle(t);
    this.meta.updateTag({ name: 'description', content: d });
    this.meta.updateTag({ property: 'og:title', content: t });
    this.meta.updateTag({ property: 'og:description', content: d });
    this.meta.updateTag({ property: 'og:type', content: 'product' });
    this.meta.updateTag({ name: 'twitter:title', content: t });
    this.meta.updateTag({ name: 'twitter:description', content: d });
  }
}
