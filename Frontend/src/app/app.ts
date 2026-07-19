import { Component, HostListener, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { Toast } from './components/toast/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Footer, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('KusiQumir');
  showBackToTop = false;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(() => window.scrollTo(0, 0));
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.showBackToTop = window.scrollY > 400;
    }
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
