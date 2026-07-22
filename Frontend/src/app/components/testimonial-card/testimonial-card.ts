import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Testimonial } from '../../services/travel-api.service';

@Component({
  selector: 'app-testimonial-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100 flex flex-col h-full">
      <div class="flex items-center gap-4 mb-4">
        <div class="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary shrink-0 overflow-hidden">
          <img *ngIf="testimonial.avatar" [src]="testimonial.avatar" [alt]="testimonial.name" class="h-full w-full object-cover" />
          <span *ngIf="!testimonial.avatar">{{ initials }}</span>
        </div>
        <div>
          <p class="font-semibold text-slate-800">{{ testimonial.name }}</p>
          <p *ngIf="testimonial.role" class="text-xs text-slate-500">{{ testimonial.role }}</p>
        </div>
      </div>
      <div class="flex items-center gap-0.5 mb-3">
        <i *ngFor="let s of [1,2,3,4,5]" class="ri-star-fill text-sm"
          [class.text-amber-400]="s <= testimonial.rating"
          [class.text-slate-300]="s > testimonial.rating"></i>
      </div>
      <p class="text-sm leading-relaxed text-slate-600 flex-1">"{{ testimonial.content }}"</p>
      <div *ngIf="testimonial.tags?.length" class="flex flex-wrap gap-1.5 mt-4">
        <span *ngFor="let tag of testimonial.tags" class="rounded-full bg-secondary-soft px-3 py-0.5 text-[11px] font-medium text-secondary">
          {{ tag }}
        </span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialCard {
  @Input({ required: true }) testimonial!: Testimonial;

  get initials(): string {
    return this.testimonial.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
