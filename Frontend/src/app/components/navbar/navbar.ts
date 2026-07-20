import { Component, HostListener, inject, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { NgClass, NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { Tour } from '../../services/travel-api.service';
import { TourStateService } from '../../services/tour-state.service';

@Component({
  selector: 'app-navbar',
  imports: [NgClass, NgFor, NgIf, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  isScrolled = false;
  isMobileMenuOpen = false;
  tours: Tour[] = [];
  whatsappNumber = '51987654321';
  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    public auth: AuthService,
    private readonly router: Router,
    private readonly tourState: TourStateService,
  ) {
    this.tours = this.tourState.getTours();
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.isMobileMenuOpen = false;
      });
  }

  tourSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-záéíóúñü\s-]/g, '')
      .replace(/\s*-\s*/g, '-')
      .replace(/\s+/g, '-')
      .replace(/clásico$/, '')
      .replace(/de los incas$/, '')
      .replace(/-+$/, '')
      .replace(/-{2,}/g, '-')
      .trim();
  }

  private daysOf(tour: Tour): number {
    return tour.durationDays;
  }

  get tourGroups(): { label: string; icon: string; tours: Tour[] }[] {
    const order: { label: string; icon: string; max: number }[] = [
      { label: 'Medio día', icon: 'ri-sun-line', max: 0.5 },
      { label: '1 día', icon: 'ri-sun-foggy-line', max: 1 },
      { label: '2 días', icon: 'ri-calendar-2-line', max: 2 },
      { label: '3+ días', icon: 'ri-calendar-line', max: 99 },
    ];
    const buckets: Tour[][] = order.map(() => []);
    for (const t of this.tours) {
      const d = this.daysOf(t);
      const idx = order.findIndex((o) => d <= o.max);
      buckets[idx === -1 ? buckets.length - 1 : idx].push(t);
    }
    return order
      .map((o, i) => ({ label: o.label, icon: o.icon, tours: buckets[i] }))
      .filter((g) => g.tours.length > 0);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 0;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
