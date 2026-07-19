import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { Title, Meta, DomSanitizer, SecurityContext } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { renderMarkdown } from '../../../shared/markdown';

@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.html',
  styleUrl: './terminos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Terminos implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cdr = inject(ChangeDetectorRef);

  content: string | null = null;

  async ngOnInit(): Promise<void> {
    try {
      const md = await firstValueFrom(
        this.http.get('/legal/terminos.md', { responseType: 'text' })
      );
      this.content = this.sanitizer.sanitize(SecurityContext.HTML, renderMarkdown(md));
    } catch {
      this.content = '<p>Error al cargar el contenido legal.</p>';
    }
    this.titleService.setTitle("Términos y Condiciones — Kusi Q'umir");
    this.metaService.updateTag({
      name: 'description',
      content:
        "Términos y condiciones del operador turístico Kusi Q'umir en Cusco, incluyendo reservas, pagos, responsabilidades y fuerza mayor.",
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: "Términos y Condiciones — Kusi Q'umir",
    });
    this.metaService.updateTag({
      property: 'og:description',
      content:
        "Términos y condiciones del operador turístico Kusi Q'umir en Cusco, incluyendo reservas, pagos, responsabilidades y fuerza mayor.",
    });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.cdr.markForCheck();
  }
}
