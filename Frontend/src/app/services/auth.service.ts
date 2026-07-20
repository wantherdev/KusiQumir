import { Injectable, signal, Inject, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { API_URL } from '../tokens/api-url';

export interface AuthResponse {
  user: { email: string; role: string };
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<{ email: string; role: string } | null>(null);
  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    private readonly http: HttpClient,
    @Inject(API_URL) private readonly apiUrl: string,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const stored = sessionStorage.getItem('user');
      if (stored) {
        try {
          this.user.set(JSON.parse(stored));
        } catch {
          sessionStorage.removeItem('user');
        }
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }, { withCredentials: true }).pipe(
      tap((response) => {
        this.user.set(response.user);
        if (isPlatformBrowser(this.platformId)) {
          sessionStorage.setItem('user', JSON.stringify(response.user));
        }
      }),
    );
  }

  register(email: string, password: string): Observable<{ id: string; email: string; role: string }> {
    return this.http.post<{ id: string; email: string; role: string }>(`${this.apiUrl}/auth/register`, { email, password }, { withCredentials: true });
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true }).subscribe({
      complete: () => this.clearUser(),
      error: () => this.clearUser(),
    });
  }

  me(): Observable<{ userId: string; email: string; role: string }> {
    return this.http.get<{ userId: string; email: string; role: string }>(`${this.apiUrl}/auth/me`, { withCredentials: true });
  }

  clearUser(): void {
    this.user.set(null);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('user');
    }
  }
}