import { Component, OnInit } from '@angular/core';
import { Title, Meta, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { renderMarkdown } from '../../../shared/markdown';

@Component({
  selector: 'app-politica-privacidad',
  templateUrl: './politica-privacidad.html',
  styleUrl: './politica-privacidad.css',
})
export class Politica implements OnInit {
  readonly markdown = `
## Política de Privacidad

> Explicamos con total transparencia cómo recopilamos, usamos y protegemos sus datos personales, y sus derechos como titular.

## Privacidad respetada
- Recolección responsable de información.
- Uso limitado a fines legítimos y contractuales.
- Derechos ARCO fáciles de ejercer.

En Kusi Q'umir trabajamos para que su información esté segura y para que usted mantenga el control sobre sus datos personales durante todo el proceso de reserva y experiencia turística.

## 1. Datos que recopilamos
Podemos recopilar datos de contacto, información de reserva, documentos de viaje, datos de pago y datos técnicos como dirección IP o comportamiento de uso para mejorar la experiencia.

## 2. Finalidades
Utilizamos los datos para gestionar reservas, emitir comprobantes, coordinar servicios, comunicarnos sobre su viaje, enviar información de interés si nos autoriza y cumplir obligaciones legales.

## 3. Base legal
El tratamiento se funda en la ejecución del contrato de servicios turísticos, en el cumplimiento de obligaciones legales, en el consentimiento cuando corresponda y en el interés legítimo para administrar la operación segura del servicio.

## 4. Derechos ARCO
Usted puede solicitar acceso, rectificación, cancelación u oposición escribiendo a **info@kusiqumir.com**. Responderemos conforme a los plazos previstos en la normativa vigente.

## 5. Seguridad
Mantenemos medidas técnicas y organizativas para proteger sus datos contra accesos no autorizados, pérdida o divulgación indebida. No compartimos datos para fines distintos a la prestación del servicio sin su consentimiento.

## 6. Transferencias
Podemos compartir datos con proveedores necesarios para el viaje (alojamiento, transporte, guías). Esto ocurre bajo acuerdos que garantizan confidencialidad y uso adecuado.

## 7. Conservación
Los datos se conservan mientras sean necesarios para la prestación del servicio, el cumplimiento legal y la resolución de consultas o reclamos.

## 8. Contacto
Para consultas o solicitudes relacionadas con privacidad, escriba a **info@kusiqumir.com** o contáctenos en nuestras oficinas en Cusco.
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
    // TOC removed
  }
}
