import { Component, OnInit } from '@angular/core';
import { Title, Meta, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { renderMarkdown } from '../../../shared/markdown';

@Component({
  selector: 'app-cancelaciones',
  templateUrl: './cancelaciones.html',
  styleUrl: './cancelaciones.css',
})
export class Cancelaciones implements OnInit {
  readonly markdown = `
## Política de Cancelaciones y Reembolsos

> Conoce los plazos, penalidades y excepciones aplicables en caso de cambios o cancelaciones de tus reservas.

## Lo esencial
- Plazos de cancelación transparentes.
- Reembolsos procesados al método original.
- Excepciones por fuerza mayor.

Las condiciones concretas aplican según el paquete y la fecha de contratación; sin embargo, estas reglas generales ofrecen un marco claro para tramitar solicitudes.

## 1. Solicitudes de cambio y cancelación
Todas las solicitudes deben remitirse por escrito a **info@kusiqumir.com** indicando número de reserva, nombre del titular y motivo de la solicitud.

## 2. Plazos y penalidades
- Cancelación > 30 días antes: reembolso completo menos costos administrativos.
- Cancelación entre 15 y 30 días: 50% de reembolso.
- Cancelación < 15 días: no hay reembolso (salvo causas de fuerza mayor).

## 3. Reembolsos
Los reembolsos se procesarán según la forma de pago original y suelen tardar entre 7 y 30 días hábiles, dependiendo del banco o la pasarela de pago.

## 4. Excepciones
En casos de fuerza mayor o medidas gubernamentales que impidan el viaje, se buscarán soluciones alternativas como reprogramaciones o créditos para futuras reservas.

## 5. Contacto
Para iniciar una solicitud, envíe la información a **info@kusiqumir.com** con su número de reserva.
  `;

  readonly content: SafeHtml;

  constructor(
    private readonly titleService: Title,
    private readonly metaService: Meta,
    private readonly sanitizer: DomSanitizer,
  ) {
    this.content = this.sanitizer.bypassSecurityTrustHtml(renderMarkdown(this.markdown));
  }

  ngOnInit(): void {
    this.titleService.setTitle("Política de Cancelaciones y Reembolsos — Kusi Q'umir");
    this.metaService.updateTag({
      name: 'description',
      content:
        "Política de cancelaciones y reembolsos de Kusi Q'umir, con plazos claros, condiciones de devolución y excepciones para servicios turísticos.",
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: "Política de Cancelaciones y Reembolsos — Kusi Q'umir",
    });
    this.metaService.updateTag({
      property: 'og:description',
      content:
        "Política de cancelaciones y reembolsos de Kusi Q'umir, con plazos claros, condiciones de devolución y excepciones para servicios turísticos.",
    });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    // TOC removed
  }
}
