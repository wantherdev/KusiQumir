import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { fallbackPackages } from '../../data/travel-content';
import { TravelApiService } from '../../services/travel-api.service';

import { Paquetes } from './paquetes';

describe('Paquetes', () => {
  let component: Paquetes;
  let fixture: ComponentFixture<Paquetes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paquetes],
      providers: [
        {
          provide: TravelApiService,
          useValue: {
            getPackages: () => of(fallbackPackages),
            createReservation: () => of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Paquetes);
    component = fixture.componentInstance;
    component.packages.set(fallbackPackages);
    fixture.detectChanges();
  });

  it('filters packages by search and featured status', () => {
    component.searchTerm.set('Salkantay');
    component.selectedMode.set('featured');

    const visiblePackages = component.visiblePackages();

    expect(visiblePackages).toEqual([fallbackPackages[2]]);
  });
});
