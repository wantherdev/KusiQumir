import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TravelApiService } from '../../../services/travel-api.service';

const SLUG_KEYWORDS: Record<string, string[]> = {
  'cusco-machu-picchu': ['cusco', 'machu'],
  'valle-sagrado': ['valle sagrado', 'sagrado'],
  arequipa: ['arequipa'],
  'lago-titicaca': ['titicaca', 'uros'],
  'selva-amazonica': ['selva', 'amazon'],
};

@Component({
  selector: 'app-destino-redirect',
  template: `
    <section class="page-shell flex min-h-[60vh] items-center justify-center px-4">
      <div class="text-center">
        <i class="ri-loader-4-line animate-spin text-4xl text-primary"></i>
        <p class="mt-4 text-slate-500">Cargando destino…</p>
      </div>
    </section>
  `,
  styleUrl: '../../page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DestinoRedirect implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly travelApi = inject(TravelApiService);

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const keywords = SLUG_KEYWORDS[slug];
    if (keywords?.length) {
      try {
        const res = await firstValueFrom(this.travelApi.getTours());
        const match = res.items.find((t) => {
          const haystack = `${t.name} ${t.location ?? ''}`.toLowerCase();
          return keywords.some((kw) => haystack.includes(kw));
        });
        if (match) {
          await this.router.navigate(['/destinos/tour', match.id], {
            replaceUrl: true,
          });
          return;
        }
      } catch {
        /* fall through to listing */
      }
    }
    await this.router.navigate(['/destinos'], { replaceUrl: true });
  }
}
