import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';


@Component({
  selector: 'app-nosotros',
  imports: [],
  templateUrl: './nosotros.html',
  styleUrl: '../page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Nosotros implements OnInit, OnDestroy {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  readonly visibleSections = signal<Set<string>>(new Set());
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.setupScrollObserver();
    this.title.setTitle('Nosotros | Kusi Q\'umir');
    this.meta.updateTag({ name: 'description', content: 'Kusi Q\'umir es una agencia de viajes peruana comprometida con el turismo cultural, responsable y experiencial.' });
    this.meta.updateTag({ property: 'og:title', content: 'Nosotros | Kusi Q\'umir' });
    this.meta.updateTag({ property: 'og:description', content: 'Agencia de viajes peruana comprometida con el turismo cultural, responsable y experiencial.' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Nosotros | Kusi Q\'umir' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Agencia de viajes peruana comprometida con el turismo cultural, responsable y experiencial.' });
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
