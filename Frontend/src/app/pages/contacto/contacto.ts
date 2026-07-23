import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { TravelApiService } from '../../services/travel-api.service';
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
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.html',
  styleUrl: '../page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contacto implements OnInit, OnDestroy {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly api = inject(TravelApiService);
  private readonly notify = inject(NotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  form: ContactForm = { name: '', email: '', phone: '', message: '' };
  submitting = false;
  readonly whatsappNumber = environment.whatsappNumber;
  readonly visibleSections = signal<Set<string>>(new Set());
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.setupScrollObserver();
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
