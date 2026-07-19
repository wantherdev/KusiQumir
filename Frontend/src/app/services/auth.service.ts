import { Injectable, signal, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { API_URL } from '../tokens/api-url';

export interface AuthResponse {
  user: { email: string; role: string };
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<{ email: string; role: string } | null>(null);

  constructor(
    private readonly http: HttpClient,
    @Inject(API_URL) private readonly apiUrl: string,
  ) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response) => this.user.set(response.user)),
    );
  }

  register(email: string, password: string): Observable<{ id: string; email: string; role: string }> {
    return this.http.post<{ id: string; email: string; role: string }>(`${this.apiUrl}/auth/register`, { email, password });
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe({
      complete: () => this.user.set(null),
      error: () => this.user.set(null),
    });
  }

  me(): Observable<{ userId: string; email: string; role: string }> {
    return this.http.get<{ userId: string; email: string; role: string }>(`${this.apiUrl}/auth/me`);
  }
}
