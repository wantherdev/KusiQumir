import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TravelApiService } from '../../services/travel-api.service';
import { NotificationService } from '../../services/notification.service';
import { Category, TestimonialCategorySelectorComponent } from '../../components/testimonial-category-selector';

@Component({
  selector: 'app-resenar-testimonio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TestimonialCategorySelectorComponent],
  templateUrl: './resenar-testimonio.html',
  styleUrl: './resenar-testimonio.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResenarTestimonio {
  private readonly api = inject(TravelApiService);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notification = inject(NotificationService);

  step: 'form' | 'success' = 'form';

  form = {
    name: '',
    email: '',
    content: '',
    rating: 5,
    privacyAccepted: false,
    displayConsent: false,
  };

  availableCategories: Category[] = [
    { id: 'agencia', name: 'Agencia' },
    { id: 'city-tour', name: 'City Tour' },
    { id: 'guia', name: 'Guía' },
    { id: 'transporte', name: 'Transporte' },
    { id: 'hotel', name: 'Hotel' },
    { id: 'restaurante', name: 'Restaurante' },
    { id: 'atencion', name: 'Atención' },
    { id: 'organizacion', name: 'Organización' },
  ];

  categories: string[] = [];
  saving = false;

  ngOnInit(): void {
    this.title.setTitle('Deja tu testimonio | Kusi Q\'umir');
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }

  get isValid(): boolean {
    return (
      this.form.name.trim().length >= 2 &&
      this.form.content.trim().length >= 10 &&
      this.form.rating >= 1 &&
      this.form.rating <= 5 &&
      this.form.privacyAccepted &&
      this.form.displayConsent
    );
  }

  async submit(): Promise<void> {
    if (!this.isValid || this.saving) return;
    this.saving = true;
    const tagNames = this.categories
      .map((id) => this.availableCategories.find((c) => c.id === id)?.name)
      .filter((n): n is string => n !== undefined);
    try {
      await firstValueFrom(this.api.createPublicTestimonial({
        name: this.form.name.trim(),
        email: this.form.email.trim() || undefined,
        content: this.form.content.trim(),
        rating: this.form.rating,
        tags: tagNames,
        active: false,
        featured: false,
        consent: {
          privacyAccepted: this.form.privacyAccepted,
          displayConsent: this.form.displayConsent,
          acceptedAt: new Date().toISOString(),
        },
      }));
      this.step = 'success';
    } catch {
      this.notification.show('No se pudo enviar tu testimonio. Intenta de nuevo.', 'error');
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }
}
