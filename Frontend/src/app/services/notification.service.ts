import { Injectable, NgZone } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private counter = 0;
  toasts: Toast[] = [];

  constructor(private readonly ngZone: NgZone) {}

  show(message: string, type: Toast['type'] = 'info', duration = 4000): void {
    this.ngZone.run(() => {
      const id = ++this.counter;
      this.toasts.push({ id, message, type });
      setTimeout(() => this.remove(id), duration);
    });
  }

  remove(id: number): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
}
