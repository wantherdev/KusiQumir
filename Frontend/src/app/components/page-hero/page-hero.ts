import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-hero',
  imports: [],
  template: `
    @if (variant === 'image') {
      <header
        class="relative overflow-hidden rounded-[2rem] bg-primary p-8 text-white shadow-lg shadow-primary/20 sm:p-12"
        [style.background-image]="
          imageUrl
            ? 'linear-gradient(rgba(15,23,42,0.55), rgba(15,23,42,0.55)), url(' + imageUrl + ')'
            : 'linear-gradient(rgba(15,23,42,0.55), rgba(15,23,42,0.55))'
        "
        style="background-size: cover; background-position: center;"
      >
        <div class="relative" [class.text-center]="centered">
          @if (eyebrow) {
            <p class="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">{{ eyebrow }}</p>
          }
          <h1 class="mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl" [class.mx-auto]="centered">{{ title }}</h1>
          @if (description) {
            <p class="mt-4 max-w-3xl text-lg text-white/85" [class.mx-auto]="centered">{{ description }}</p>
          }
          <div class="mt-7"><ng-content></ng-content></div>
        </div>
      </header>
    } @else if (variant === 'light') {
      <header class="relative overflow-hidden rounded-[2rem] bg-secondary-soft p-8 text-tertiary shadow-sm sm:p-12">
        <div [class.text-center]="centered">
          @if (eyebrow) {
            <p class="text-sm font-semibold uppercase tracking-[0.35em] text-primary">{{ eyebrow }}</p>
          }
          <h1 class="mt-3 max-w-3xl text-4xl font-bold leading-tight text-tertiary sm:text-5xl" [class.mx-auto]="centered">{{ title }}</h1>
          @if (description) {
            <p class="mt-4 max-w-3xl text-lg text-slate-600" [class.mx-auto]="centered">{{ description }}</p>
          }
          <div class="mt-7"><ng-content></ng-content></div>
        </div>
      </header>
    } @else {
      <header class="relative overflow-hidden rounded-[2rem] bg-linear-to-r from-primary to-primary-dark p-8 text-white shadow-lg shadow-primary/20 sm:p-12">
        <div class="pointer-events-none absolute inset-0 hero-dots opacity-20"></div>
        <div class="relative" [class.text-center]="centered">
          @if (eyebrow) {
            <p class="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">{{ eyebrow }}</p>
          }
          <h1 class="mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl" [class.mx-auto]="centered">{{ title }}</h1>
          @if (description) {
            <p class="mt-4 max-w-3xl text-lg text-white/85" [class.mx-auto]="centered">{{ description }}</p>
          }
          <div class="mt-7"><ng-content></ng-content></div>
        </div>
      </header>
    }
  `,
})
export class PageHero {
  @Input() variant: 'gradient' | 'light' | 'image' = 'gradient';
  @Input() eyebrow = '';
  @Input() title = '';
  @Input() description = '';
  @Input() imageUrl = '';
  @Input() centered = false;
}
