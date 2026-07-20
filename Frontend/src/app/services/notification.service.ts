import { Injectable, NgZone, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private counter = 0;
  readonly toasts = signal<Toast[]>([]);

  constructor(private readonly ngZone: NgZone) {}

  show(message: string, type: Toast['type'] = 'info', duration = 4000): void {
    this.ngZone.run(() => {
      const id = ++this.counter;
      this.toasts.update((current) => [...current, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => this.remove(id), duration);
      }
    });
  }

  remove(id: number): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
