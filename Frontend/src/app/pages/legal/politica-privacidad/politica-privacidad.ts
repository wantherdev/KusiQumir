import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { Title, Meta, DomSanitizer, SecurityContext } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { renderMarkdown } from '../../../shared/markdown';

@Component({
  selector: 'app-politica-privacidad',
  templateUrl: './politica-privacidad.html',
  styleUrl: './politica-privacidad.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Politica implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cdr = inject(ChangeDetectorRef);

  content: string | null = null;

  async ngOnInit(): Promise<void> {
    try {
      const md = await firstValueFrom(
        this.http.get('/legal/politica-privacidad.md', { responseType: 'text' })
      );
      this.content = this.sanitizer.sanitize(SecurityContext.HTML, renderMarkdown(md));
    } catch {
      this.content = '<p>Error al cargar el contenido legal.</p>';
    }
    this.titleService.setTitle("Política de Privacidad — Kusi Q'umir");
    this.metaService.updateTag({
      name: 'description',
      content:
        "Política de privacidad de Kusi Q'umir: reglas de tratamiento de datos, derechos ARCO y cómo protegemos su información personal.",
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: "Política de Privacidad — Kusi Q'umir",
    });
    this.metaService.updateTag({
      property: 'og:description',
      content:
        "Política de privacidad de Kusi Q'umir: reglas de tratamiento de datos, derechos ARCO y cómo protegemos su información personal.",
    });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.cdr.markForCheck();
  }
}
