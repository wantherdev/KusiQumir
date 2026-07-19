import { Component, OnInit } from '@angular/core';
import { Title, Meta, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { renderMarkdown } from '../../../shared/markdown';

@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.html',
  styleUrl: './terminos.css',
})
export class Terminos implements OnInit {
  readonly markdown = `
## Términos y Condiciones

> Estos términos regulan la contratación de nuestros servicios turísticos y establecen las obligaciones de Kusi Q'umir y del cliente de forma clara, profesional y alineada con la regulación peruana aplicable.

## Resumen ejecutivo
- Condiciones de pago y reservas.
- Responsabilidad de servicios propios y de terceros.
- Supervisión por MINCETUR y GERCETUR.

Al contratar cualquiera de nuestros servicios, usted acepta estas condiciones en su totalidad. Este documento incorpora reglas para servicios prestados directamente por Kusi Q'umir y para aquellos ofrecidos a través de terceros con los que operamos.

## 1. Definiciones
**Proveedor:** Kusi Q'umir, empresa responsable de la comercialización y/o prestación de servicios turísticos. **Prestador tercero:** empresa o persona distinta contratada para ejecutar servicios específicos (transporte, alojamiento, guía). **Cliente:** persona natural o jurídica que contrata el servicio.

## 2. Ámbito y naturaleza del servicio
Los servicios incluyen paquetes turísticos, excursiones, traslados y otros productos turísticos detallados en la página del producto o en la cotización. Algunos componentes pueden ser operados por terceros; siempre se indicará cuándo un servicio es prestado por un tercero.

## 3. Registro y cumplimiento normativo
Kusi Q'umir declara estar inscrita y operando conforme a la normativa de turismo aplicable. Asimismo, se compromete a mantener la documentación y registros exigidos por MINCETUR y se somete a la supervisión de la Gerencia Regional de Turismo (GERCETUR) de Cusco cuando así corresponda.

## 4. Reserva, confirmación y pago
a) Las reservas requieren la entrega de un depósito o el pago total según la política del producto. b) La confirmación se emite por correo electrónico cuando se acredita el pago o cuando se acepta la solicitud de reserva. c) Los precios pueden variar según temporada, disponibilidad y cambio de impuestos o tasas oficiales.

## 5. Precios, impuestos y cargos
Los precios publicados incluyen los impuestos indicados y no incluyen gastos personales ni servicios no especificados. Kusi Q'umir informará sobre tasas gubernamentales aplicables (por ejemplo, entradas, tasas municipales) que deban ser pagadas por el cliente.

## 6. Servicios propios y servicios de terceros
a) Cuando el servicio es prestado por Kusi Q'umir directamente, la responsabilidad civil y contractual corresponde al proveedor en los términos aquí previstos. b) Cuando un servicio es prestado por un tercero, Kusi Q'umir actuará como intermediario y facilitará la contratación entre el Cliente y el Prestador tercero; la responsabilidad directa por la ejecución del componente corresponderá al Prestador tercero, sin perjuicio de la responsabilidad de Kusi Q'umir en cuanto a selección, vigilancia y coordinación razonable de dichos terceros.

## 7. Obligaciones del cliente
El Cliente debe proporcionar información veraz, portar la documentación requerida (pasaporte, visados, certificados de salud), presentarse en los horarios indicados y cumplir las instrucciones de seguridad y conducta. El incumplimiento puede dar lugar a la rescisión del servicio sin derecho a reembolso.

## 8. Modificaciones y cancelaciones
Las condiciones específicas de modificación y cancelación constan en la política del producto. En términos generales, las solicitudes anticipadas podrán ser atendidas con menor penalidad; las cancelaciones de último minuto pueden no ser reembolsables. En casos donde el Cliente contrate servicios de terceros sujetos a políticas propias (por ejemplo, trenes o permisos), se aplicarán las reglas del operador correspondiente.

## 9. Reembolsos
Los reembolsos, cuando procedan, se procesarán a través del mismo medio de pago utilizado por el cliente y en los plazos que indique la pasarela o la entidad bancaria; los plazos pueden variar entre 7 y 30 días hábiles.

## 10. Seguro y asistencia
Recomendamos contratar un seguro de viaje que cubra asistencia médica, evacuación y responsabilidad civil. En algunos paquetes, la cobertura mínima puede estar incluida y se informará en la ficha del servicio.

## 11. Limitación de responsabilidad
Kusi Q'umir no será responsable por pérdidas indirectas, lucro cesante o daños que no sean previsibles al momento de la contratación. La responsabilidad total por daños directos se limitará, en todo caso, al monto pagado por el Cliente por el servicio afectado, salvo disposición legal en contrario.

## 12. Fuerza mayor
Ninguna de las partes será responsable por el incumplimiento derivado de causas de fuerza mayor (desastres naturales, pandemias, actos de autoridad, conflictos, etc.). Se buscará la reprogramación o soluciones alternativas razonables.

## 13. Protección al consumidor e INDECOPI
El Cliente cuenta con los derechos reconocidos por la legislación de protección al consumidor. Para reclamos, puede acudir a INDECOPI o usar el Libro de Reclamaciones que pone a disposición Kusi Q'umir. Se respetarán los procedimientos de la normativa aplicable.

## 14. Supervisión GERCETUR Cusco y MINCETUR
Kusi Q'umir declara contar con las habilitaciones y registros requeridos por MINCETUR para la actividad turística que realiza y acepta la supervisión y fiscalización de GERCETUR Cusco en las materias de su competencia.

## 15. Protección de datos
El tratamiento de datos personales se realiza conforme a la Política de Privacidad publicada en este sitio y en cumplimiento de la normativa peruana aplicable sobre protección de datos.

## 16. Resolución de controversias
Las partes intentarán resolver amistosamente cualquier diferencia. En caso de litigio, las partes se someten a la jurisdicción de los tribunales competentes de la ciudad de Cusco, Perú, salvo acuerdo contrario.

## 17. Información y contacto
Para consultas, quejas o reclamos: **info@kusiqumir.com** o el Libro de Reclamaciones disponible en la web y en nuestras oficinas en Av. El Sol 814, Cusco.

> Nota: Este texto es un modelo informativo adaptado a la normativa turística peruana. Se recomienda su revisión y validación final por un abogado local colegiado antes de su uso definitivo, especialmente para contratos y condiciones específicas de paquetes institucionales.
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
    // TOC removed
  }
}
