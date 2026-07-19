import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const cached = auth.user();
  if (cached) return true;

  return auth.me().pipe(
    map((user) => {
      auth.user.set({ email: user.email, role: user.role });
      return true;
    }),
    catchError(() => {
      return of(router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } }));
    }),
  );
};
