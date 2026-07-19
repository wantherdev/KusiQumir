import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { Title, Meta, DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { renderMarkdown } from '../../../shared/markdown';

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.html',
  styleUrl: './contrato.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contrato implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cdr = inject(ChangeDetectorRef);

  content: string | null = null;

  async ngOnInit(): Promise<void> {
    try {
      const md = await firstValueFrom(
        this.http.get('/legal/contrato.md', { responseType: 'text' })
      );
      this.content = this.sanitizer.sanitize(SecurityContext.HTML, renderMarkdown(md));
    } catch {
      this.content = '<p>Error al cargar el contenido legal.</p>';
    }
    this.titleService.setTitle("Contrato de Servicios Turísticos — Kusi Q'umir");
    this.metaService.updateTag({
      name: 'description',
      content:
        "Contrato de prestación de servicios turísticos de Kusi Q'umir, con cláusulas sobre objeto, pago, responsabilidad y condiciones de cancelación.",
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: "Contrato de Servicios Turísticos — Kusi Q'umir",
    });
    this.metaService.updateTag({
      property: 'og:description',
      content:
        "Contrato de prestación de servicios turísticos de Kusi Q'umir, con cláusulas sobre objeto, pago, responsabilidad y condiciones de cancelación.",
    });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.cdr.markForCheck();
  }
}
