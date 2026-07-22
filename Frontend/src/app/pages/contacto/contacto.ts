import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { TravelApiService } from '../../services/travel-api.service';
import { PageHero } from '../../components/page-hero/page-hero';
import { NotificationService } from '../../services/notification.service';
import { environment } from '../../../environments/environment';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

@Component({
  selector: 'app-contacto',
  imports: [CommonModule, FormsModule, PageHero],
  template: `
    <section class="page-shell px-4 py-20 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-4xl">
        <app-page-hero
          variant="light"
          [centered]="true"
          eyebrow="Contacto"
          title="¿Listo para tu próxima aventura?"
          description="Cuéntanos qué buscas y te responderemos a la brevedad para diseñar juntos la experiencia perfecta en Perú."
        />

        <div class="mt-10 grid gap-10 lg:grid-cols-[1fr_0.7fr]">
          <form #contactForm="ngForm" (ngSubmit)="onSubmit(contactForm)" class="panel p-8">
            <div class="mb-5">
              <label for="name" class="mb-1 block text-sm font-semibold text-slate-700">Nombre completo <span class="text-red-500">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                [(ngModel)]="form.name"
                required
                minlength="3"
                #nameCtrl="ngModel"
                class="input"
                placeholder="Tu nombre"
              />
              <p *ngIf="nameCtrl.invalid && (nameCtrl.dirty || nameCtrl.touched)" class="mt-1 text-xs text-red-500">Mínimo 3 caracteres</p>
            </div>

            <div class="mb-5">
              <label for="email" class="mb-1 block text-sm font-semibold text-slate-700">Correo electrónico <span class="text-red-500">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="form.email"
                required
                email
                #emailCtrl="ngModel"
                class="input"
                placeholder="tucorreo@ejemplo.com"
              />
              <p *ngIf="emailCtrl.invalid && (emailCtrl.dirty || emailCtrl.touched)" class="mt-1 text-xs text-red-500">Ingresa un correo válido</p>
            </div>

            <div class="mb-5">
              <label for="phone" class="mb-1 block text-sm font-semibold text-slate-700">Teléfono (opcional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                [(ngModel)]="form.phone"
                #phoneCtrl="ngModel"
                class="input"
                placeholder="+51 999 888 777"
              />
            </div>

            <div class="mb-6">
              <label for="message" class="mb-1 block text-sm font-semibold text-slate-700">Mensaje <span class="text-red-500">*</span></label>
              <textarea
                id="message"
                name="message"
                rows="5"
                [(ngModel)]="form.message"
                required
                minlength="10"
                #msgCtrl="ngModel"
                class="input"
                placeholder="Cuéntanos sobre tu viaje ideal..."
              ></textarea>
              <p *ngIf="msgCtrl.invalid && (msgCtrl.dirty || msgCtrl.touched)" class="mt-1 text-xs text-red-500">Mínimo 10 caracteres</p>
            </div>

            <button
              type="submit"
              [disabled]="contactForm.invalid || submitting"
              class="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ submitting ? 'Enviando…' : 'Enviar mensaje' }}
            </button>
          </form>

          <aside class="flex flex-col gap-6">
            <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 class="text-lg font-bold text-tertiary">Información de contacto</h3>
              <ul class="mt-4 space-y-4 text-sm text-slate-600">
                <li class="flex items-start gap-3">
                  <i aria-hidden="true" class="ri-map-pin-line mt-0.5 text-primary"></i>
                  <span>Cusco, Perú</span>
                </li>
                <li class="flex items-start gap-3">
                  <i aria-hidden="true" class="ri-whatsapp-line mt-0.5 text-primary"></i>
                  <a href="https://wa.me/{{ whatsappNumber }}" class="hover:text-primary">+51 999 999 999</a>
                </li>
                <li class="flex items-start gap-3">
                  <i aria-hidden="true" class="ri-mail-line mt-0.5 text-primary"></i>
                  <a href="mailto:hola@kusiqumir.com" class="hover:text-primary">hola&#64;kusiqumir.com</a>
                </li>
              </ul>
            </div>

            <div class="rounded-2xl bg-primary/5 p-6">
              <h3 class="text-lg font-bold text-tertiary">Horarios de atención</h3>
              <ul class="mt-4 space-y-2 text-sm text-slate-600">
                <li><span class="font-semibold">Lun – Vie:</span> 9:00 – 18:00</li>
                <li><span class="font-semibold">Sáb:</span> 9:00 – 13:00</li>
                <li><span class="font-semibold">Dom:</span> Cerrado</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  `,
  styleUrl: '../page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contacto implements OnInit {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly api = inject(TravelApiService);
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  form: ContactForm = { name: '', email: '', phone: '', message: '' };
  submitting = false;
  readonly whatsappNumber = environment.whatsappNumber;

  ngOnInit(): void {
    this.title.setTitle('Contacto | Kusi Q\'umir');
    this.meta.updateTag({ name: 'description', content: 'Contáctanos para planificar tu viaje a Perú. Estamos en Cusco y listos para ayudarte.' });
    this.meta.updateTag({ property: 'og:title', content: 'Contacto | Kusi Q\'umir' });
    this.meta.updateTag({ property: 'og:description', content: 'Contáctanos para planificar tu viaje a Perú.' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Contacto | Kusi Q\'umir' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Contáctanos para planificar tu viaje a Perú.' });
  }

  async onSubmit(form: NgForm): Promise<void> {
    if (form.invalid) return;
    this.submitting = true;
    try {
      await firstValueFrom(this.api.sendContact({ ...this.form }));
      this.notify.show('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
      this.form = { name: '', email: '', phone: '', message: '' };
      form.resetForm();
    } catch {
      this.notify.show('Error al enviar el mensaje. Escríbenos por WhatsApp.', 'error');
    } finally {
      this.submitting = false;
      this.cdr.markForCheck();
    }
  }
}
