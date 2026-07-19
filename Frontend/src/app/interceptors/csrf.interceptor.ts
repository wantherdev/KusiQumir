import { HttpInterceptorFn } from '@angular/common/http';

let csrfToken: string | null = null;

export function setCsrfToken(token: string): void {
  csrfToken = token;
}

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  if (!csrfToken || ['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next(req);
  }

  const cloned = req.clone({
    headers: req.headers.set('x-csrf-token', csrfToken),
  });

  return next(cloned);
};
