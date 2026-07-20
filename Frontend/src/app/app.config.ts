import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners, APP_INITIALIZER, inject } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withFetch, withInterceptors, HttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { tap, catchError, retry } from 'rxjs/operators';
import { of, lastValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { csrfInterceptor, setCsrfToken } from './interceptors/csrf.interceptor';
import { TourStateService } from './services/tour-state.service';
import { PaginatedResponse, Tour } from './services/travel-api.service';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, csrfInterceptor])),
    provideClientHydration(withEventReplay()),
    provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode(), registrationStrategy: 'registerWhenStable:3000' }),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const http = inject(HttpClient);
        return () =>
          lastValueFrom(
            http.get<{ csrfToken: string }>('/api/auth/csrf').pipe(
              retry(2),
              tap((res) => setCsrfToken(res.csrfToken)),
              catchError(() => {
                if (isDevMode()) console.warn('[CSRF] No se pudo obtener el token. Las mutaciones pueden fallar con 403.');
                return of(undefined);
              }),
            ),
          );
      },
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const http = inject(HttpClient);
        const state = inject(TourStateService);
        return () =>
          lastValueFrom(
            http.get<PaginatedResponse<Tour>>('/api/tours').pipe(
              tap((res) => state.setTours(res.items)),
              catchError(() => {
                if (isDevMode()) console.warn('[Navbar] No se pudieron precargar los tours.');
                return of(undefined);
              }),
            ),
          );
      },
      multi: true,
    },
  ],
};
