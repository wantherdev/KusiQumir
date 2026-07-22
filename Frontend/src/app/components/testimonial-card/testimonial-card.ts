import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Testimonial } from '../../services/travel-api.service';

@Component({
  selector: 'app-testimonial-card',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
    .tcard {
      border: 1px solid #e2e8f0;
      background: white;
      transition: all 0.3s ease;
    }
    .tcard:hover {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      transform: translateY(-4px);
    }
    .tcard-teal {
      border-color: #e2e8f0;
    }
    .tcard-teal:hover {
      border-color: #00abaa;
      background: rgba(0, 171, 170, 0.03);
      box-shadow: 0 10px 30px rgba(0, 171, 170, 0.12);
    }
    .tcard-teal .tcard-avatar {
      background: linear-gradient(135deg, #00abaa, #00908f);
    }
    .tcard-teal .tcard-star {
      color: #00abaa;
    }
    .tcard-teal .tcard-star-off {
      color: #e2e8f0;
    }
    .tcard-teal .tcard-quote {
      color: #e2e8f0;
    }
    .tcard-teal:hover .tcard-quote {
      color: #00abaa;
      opacity: 0.15;
    }
    .tcard-teal .tcard-tag {
      background: rgba(0, 171, 170, 0.08);
      color: #00908f;
    }
    .tcard-secondary {
      border-color: #e2e8f0;
    }
    .tcard-secondary:hover {
      border-color: #647bab;
      background: rgba(100, 123, 171, 0.03);
      box-shadow: 0 10px 30px rgba(100, 123, 171, 0.12);
    }
    .tcard-secondary .tcard-avatar {
      background: linear-gradient(135deg, #647bab, #4a5e8c);
    }
    .tcard-secondary .tcard-star {
      color: #647bab;
    }
    .tcard-secondary .tcard-star-off {
      color: #e2e8f0;
    }
    .tcard-secondary .tcard-quote {
      color: #e2e8f0;
    }
    .tcard-secondary:hover .tcard-quote {
      color: #647bab;
      opacity: 0.15;
    }
    .tcard-secondary .tcard-tag {
      background: rgba(100, 123, 171, 0.08);
      color: #4a5e8c;
    }
    `,
  ],
  template: `
    <div class="tcard rounded-2xl p-6 shadow-sm flex flex-col h-full cursor-default"
      [class.tcard-teal]="isTeal"
      [class.tcard-secondary]="!isTeal">

      <div class="tcard-quote absolute top-3 right-3 transition-colors duration-300">
        <i class="ri-double-quotes-r text-3xl"></i>
      </div>

      <div class="flex items-center gap-3 mb-4">
        <div class="tcard-avatar relative h-12 w-12 shrink-0 overflow-hidden rounded-full flex items-center justify-center text-base font-bold text-white shadow-sm">
          <img *ngIf="testimonial.avatar" [src]="testimonial.avatar" [alt]="testimonial.name" class="h-full w-full object-cover" />
          <span *ngIf="!testimonial.avatar">{{ initials }}</span>
        </div>
        <div class="min-w-0">
          <p class="font-semibold text-slate-800 truncate">{{ testimonial.name }}</p>
          <p *ngIf="testimonial.role" class="text-xs text-slate-400 truncate">{{ testimonial.role }}</p>
        </div>
      </div>

      <div class="flex items-center gap-0.5 mb-3">
        <i *ngFor="let s of [1,2,3,4,5]" class="ri-star-fill text-sm"
          [class.tcard-star]="s <= testimonial.rating"
          [class.tcard-star-off]="s > testimonial.rating"></i>
      </div>

      <p class="text-sm leading-relaxed text-slate-600 flex-1 relative z-10">
        "{{ testimonial.content }}"
      </p>

      <div *ngIf="testimonial.tags?.length" class="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-100">
        <span *ngFor="let tag of testimonial.tags" class="tcard-tag rounded-full px-2.5 py-0.5 text-[11px] font-medium">
          {{ tag }}
        </span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialCard {
  @Input({ required: true }) testimonial!: Testimonial;
  @Input() variantIndex = 0;

  get isTeal(): boolean {
    return this.variantIndex % 2 === 0;
  }

  get initials(): string {
    return this.testimonial.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
