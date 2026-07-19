import { Component, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { NgClass, NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { Tour } from '../../services/travel-api.service';
import { TourStateService } from '../../services/tour-state.service';

@Component({
  selector: 'app-navbar',
  imports: [NgClass, NgFor, NgIf, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isScrolled = false;
  isMobileMenuOpen = false;
  tours: Tour[] = [];
  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    public auth: AuthService,
    private readonly router: Router,
    private readonly tourState: TourStateService,
  ) {
    this.tours = this.tourState.getTours();
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
