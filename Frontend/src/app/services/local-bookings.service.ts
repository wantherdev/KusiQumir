import { Injectable, signal } from '@angular/core';
import { Booking } from './travel-api.service';

const STORAGE_KEY = 'kusiqumir_bookings';

@Injectable({ providedIn: 'root' })
export class LocalBookingsService {
  readonly bookings = signal<Booking[]>(this.read());

  private read(): Booking[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Booking[]) : [];
    } catch {
      return [];
    }
  }

  private persist(items: Booking[]): void {
    this.bookings.set(items);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }

  add(booking: Booking): void {
    this.persist([booking, ...this.bookings()]);
  }

  cancel(id: string): void {
    this.persist(
      this.bookings().map((b) =>
        b.id === id ? { ...b, status: 'CANCELADA', canceledAt: new Date().toISOString() } : b,
      ),
    );
  }
}
