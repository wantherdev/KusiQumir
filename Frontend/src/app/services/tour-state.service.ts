import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tour } from './travel-api.service';

@Injectable({ providedIn: 'root' })
export class TourStateService {
  private readonly toursSubject = new BehaviorSubject<Tour[]>([]);
  tours$: Observable<Tour[]> = this.toursSubject.asObservable();

  setTours(tours: Tour[]): void {
    this.toursSubject.next(tours);
  }

  getTours(): Tour[] {
    return this.toursSubject.getValue();
  }
}
