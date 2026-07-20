import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div
      class="pointer-events-none fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-start sm:justify-end"
      aria-live="polite"
      aria-atomic="false"
    >
      <div class="pointer-events-auto flex w-full max-w-sm flex-col gap-2">
        @for (toast of notification.toasts(); track toast.id) {
          <div
            role="status"
            class="animate-slide-up flex items-start gap-3 rounded-2xl px-5 py-3 text-sm font-medium text-white shadow-lg ring-1 ring-black/5"
            [class.bg-primary]="toast.type === 'success'"
            [class.bg-red-600]="toast.type === 'error'"
            [class.bg-slate-800]="toast.type === 'info'"
          >
            <i
              aria-hidden="true"
              class="mt-0.5 text-base"
              [class.ri-check-line]="toast.type === 'success'"
              [class.ri-error-warning-line]="toast.type === 'error'"
              [class.ri-information-line]="toast.type === 'info'"
            ></i>
            <span class="flex-1">{{ toast.message }}</span>
            <button
              type="button"
              class="ml-2 text-white/70 transition hover:text-white"
              aria-label="Cerrar notificación"
              (click)="notification.remove(toast.id)"
            >
              <i aria-hidden="true" class="ri-close-line text-base"></i>
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
export class Toast {
  protected readonly notification = inject(NotificationService);
}
