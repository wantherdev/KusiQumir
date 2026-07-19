import { Component, OnInit, inject, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta, DomSanitizer } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { renderMarkdown } from '../../../shared/markdown';
import { TravelApiService } from '../../../services/travel-api.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-libro-reclamaciones',
  imports: [CommonModule, FormsModule],
  templateUrl: './libro-reclamaciones.html',
  styleUrl: './libro-reclamaciones.css',
})
export class LibroReclamaciones implements OnInit {
  private readonly api = inject(TravelApiService);
  private readonly notify = inject(NotificationService);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly sanitizer = inject(DomSanitizer);

  readonly markdown = `
## Información útil para su reclamo

> Su queja o reclamo será atendido con respeto, claridad y dentro de los plazos establecidos por la normativa peruana vigente.

## Qué puede reclamar
- Servicios turísticos no prestados o incompletos.
- Cambios de itinerario, retrasos o cancelaciones.
- Problemas con transporte, alojamiento o atención al cliente.
- Inconformidades con la información o calidad del servicio ofrecido.

## Normativa aplicable
- Ley N° 29571, Ley del Sistema de Protección al Consumidor.
- Reglamento de la Ley N° 29571 y disposiciones de INDECOPI.
- Decreto Legislativo N° 1317, que regula el acceso al Libro de Reclamaciones en comercios y servicios.

## Derechos del usuario
1. Recibir atención gratuita y eficaz para su reclamo.
2. Obtener un número de caso o constancia de recepción.
3. Ser informado del resultado en un plazo máximo de 30 días calendario.
4. Que su reclamo sea atendido con trato respetuoso y sin discriminación.

## Información requerida
Para presentar su reclamo, indique con claridad:
- Nombre completo y documento de identidad.
- Correo electrónico y teléfono de contacto.
- Nombre del servicio contratado o tour adquirido.
- Fecha del servicio o reserva, y código de la operación si lo tiene.
- Descripción clara de los hechos, la inconformidad y el resultado esperado.
- Documentos adjuntos de respaldo como boleta, factura, voucher, comprobante o comunicaciones.

## Procedimiento
1. Envíe su reclamo a nuestro correo electrónico: **info@kusiqumir.com**.
2. También puede comunicarse por WhatsApp o teléfono al número disponible en nuestra sección de contacto.
3. Recibirá un número de caso dentro de las primeras 24 horas hábiles.
4. Nuestro equipo investigará su situación y le enviará una respuesta motivada en un plazo máximo de 30 días calendario.

## Atención en Cusco
Kusi Q'umir Agencia de Viajes atiende en Cusco con especialidad en turismo cultural, excursiones al Valle Sagrado y tours por la región. Si su reclamo está relacionado con:
- servicios turísticos no prestados,
- cambios de itinerario,
- cancelaciones,
- condiciones de transporte o alojamiento,
- atención al cliente,
incluya todos los datos del paquete y la fecha del viaje.

## Siguientes pasos
- Conservaremos su reclamo en nuestro libro electrónico de reclamaciones.
- Si no está conforme con nuestra respuesta, puede elevar su reclamo ante INDECOPI o entidades competentes en defensa del consumidor en Perú.
- Nuestro compromiso es resolver su caso con transparencia y justicia.

> Nota: Las reclamaciones por servicios turísticos en Cusco se atienden según los plazos y procedimientos establecidos por la normativa peruana vigente.
  `;

  readonly content: string | null;

  form = {
    nombre: '',
    documento: '',
    correo: '',
    telefono: '',
    servicio: '',
    reserva: '',
    fechaServicio: '',
    motivo: '',
    descripcion: '',
    documentos: '',
    permitirContacto: true,
  };

  submitting = false;
  success = false;
  error = '';

  constructor() {
    this.content = this.sanitizer.sanitize(SecurityContext.HTML, renderMarkdown(this.markdown));
  }

  ngOnInit(): void {
    this.titleService.setTitle("Libro de Reclamaciones — Kusi Q'umir");
    this.metaService.updateTag({
      name: 'description',
      content:
        "Guía y procedimiento del Libro de Reclamaciones de Kusi Q'umir, con pasos claros para presentar tu queja o reclamo.",
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: "Libro de Reclamaciones — Kusi Q'umir",
    });
    this.metaService.updateTag({
      property: 'og:description',
      content:
        "Guía y procedimiento del Libro de Reclamaciones de Kusi Q'umir, con pasos claros para presentar tu queja o reclamo.",
    });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  }

  async submit(claimForm: any): Promise<void> {
    if (claimForm.invalid) return;
    this.submitting = true;
    this.error = '';
    try {
      await firstValueFrom(this.api.sendClaim({ ...this.form }));
      this.success = true;
      this.notify.show('Reclamo enviado correctamente. Recibirás un número de caso.', 'success');
      this.form = { nombre: '', documento: '', correo: '', telefono: '', servicio: '', reserva: '', fechaServicio: '', motivo: '', descripcion: '', documentos: '', permitirContacto: true };
      claimForm.resetForm();
    } catch {
      this.error = 'Error al enviar el reclamo. Intenta de nuevo o escríbenos a info@kusiqumir.com.';
    } finally {
      this.submitting = false;
    }
  }
}
