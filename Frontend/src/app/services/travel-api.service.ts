import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from '../tokens/api-url';

export interface Destination {
  id: number;
  name: string;
  slug: string;
  description: string;
  region: string;
  price: number;
  duration: number;
  highlights: string[];
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PackageDestination {
  id: string;
  packageId: string;
  destinationId: number;
  destination: Destination;
}

export interface Tour {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  images?: string | null;
  difficulty?: string | null;
  itinerary?: string | null;
  includes?: string | null;
  excludes?: string | null;
  location?: string | null;
  availability: boolean;
  providerId?: string | null;
  createdAt?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
}

export type TourPayload = Omit<Tour, 'id' | 'createdAt'>;

export interface Booking {
  id: string;
  customerId: string;
  tourId?: string | null;
  packageId?: string | null;
  travelers: number;
  status: string;
  date: string;
  total?: number | null;
  unitPrice?: number | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  startDate?: string | null;
  notes?: string | null;
  canceledAt?: string | null;
  createdAt?: string;
  tour?: Tour | null;
  package?: TravelPackage | null;
  customer?: { id: string; name: string; email: string } | null;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  imageAlt?: string | null;
  category?: string | null;
  tags?: string | null;
  status: string;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ArticlePayload = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>;

export interface Experience {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  coverImage?: string | null;
  imageAlt?: string | null;
  location?: string | null;
  duration?: string | null;
  tourId?: string | null;
  status: string;
  featured: boolean;
  sortOrder: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ExperiencePayload = Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>;

export interface TravelPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  featured?: boolean;
  durationDays?: number | null;
  discount?: number | null;
  imageUrl?: string | null;
  included?: string | null;
  excluded?: string | null;
  tours?: Tour[];
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  nationality?: string | null;
  passport?: string | null;
  phone?: string | null;
  preferences?: string | null;
}

export type UserProfilePayload = Pick<UserProfile, 'name' | 'phone' | 'nationality' | 'passport' | 'preferences'>;

@Injectable({ providedIn: 'root' })
export class TravelApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_URL) private readonly apiUrl: string,
  ) {}

  getDestinations(limit = 4): Observable<Destination[]> {
    const params = new HttpParams().set('take', limit);
    return this.http.get<Destination[]>(`${this.apiUrl}/destinations`, { params });
  }

  getDestination(id: number): Observable<Destination> {
    return this.http.get<Destination>(`${this.apiUrl}/destinations/${id}`);
  }

  getFeaturedPackages(limit = 3): Observable<TravelPackage[]> {
    const params = new HttpParams().set('featured', 'true').set('take', limit);
    return this.http.get<TravelPackage[]>(`${this.apiUrl}/packages`, { params });
  }

  getPackages(): Observable<TravelPackage[]> {
    return this.http.get<TravelPackage[]>(`${this.apiUrl}/packages`);
  }

  getPackage(id: string): Observable<TravelPackage> {
    return this.http.get<TravelPackage>(`${this.apiUrl}/packages/${id}`);
  }

  getTours(): Observable<PaginatedResponse<Tour>> {
    return this.http.get<PaginatedResponse<Tour>>(`${this.apiUrl}/tours`);
  }

  getTourById(id: string): Observable<Tour> {
    return this.http.get<Tour>(`${this.apiUrl}/tours/${id}`);
  }

  createTour(payload: TourPayload): Observable<Tour> {
    return this.http.post<Tour>(`${this.apiUrl}/tours`, payload);
  }

  updateTour(id: string, payload: Partial<TourPayload>): Observable<Tour> {
    return this.http.patch<Tour>(`${this.apiUrl}/tours/${id}`, payload);
  }

  deleteTour(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tours/${id}`);
  }

  // --- Bookings ---
  getBookings(params?: Record<string, string>): Observable<PaginatedResponse<Booking>> {
    return this.http.get<PaginatedResponse<Booking>>(`${this.apiUrl}/bookings`, { params });
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings/me`);
  }

  createBooking(payload: {
    tourId?: string;
    packageId?: string;
    travelers: number;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    startDate?: string;
    notes?: string;
  }): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/bookings`, payload);
  }

  getBooking(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/bookings/${id}`);
  }

  cancelBooking(id: string): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/bookings/${id}/cancel`, {});
  }

  updateBookingStatus(id: string, status: string): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}/bookings/${id}/status`, { status });
  }

  // --- Articles ---
  getArticles(): Observable<PaginatedResponse<Article>> {
    return this.http.get<PaginatedResponse<Article>>(`${this.apiUrl}/articles`);
  }

  getArticle(slug: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/articles/${slug}`);
  }

  getArticlesAdmin(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/admin/articles`);
  }

  createArticle(payload: ArticlePayload): Observable<Article> {
    return this.http.post<Article>(`${this.apiUrl}/admin/articles`, payload);
  }

  updateArticle(id: string, payload: Partial<ArticlePayload>): Observable<Article> {
    return this.http.patch<Article>(`${this.apiUrl}/admin/articles/${id}`, payload);
  }

  deleteArticle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/articles/${id}`);
  }

  // --- Experiences ---
  getExperiences(): Observable<PaginatedResponse<Experience>> {
    return this.http.get<PaginatedResponse<Experience>>(`${this.apiUrl}/experiences`);
  }

  getExperience(slug: string): Observable<Experience> {
    return this.http.get<Experience>(`${this.apiUrl}/experiences/${slug}`);
  }

  getExperiencesAdmin(): Observable<Experience[]> {
    return this.http.get<Experience[]>(`${this.apiUrl}/admin/experiences`);
  }

  createExperience(payload: ExperiencePayload): Observable<Experience> {
    return this.http.post<Experience>(`${this.apiUrl}/admin/experiences`, payload);
  }

  updateExperience(id: string, payload: Partial<ExperiencePayload>): Observable<Experience> {
    return this.http.patch<Experience>(`${this.apiUrl}/admin/experiences/${id}`, payload);
  }

  deleteExperience(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/experiences/${id}`);
  }

  // --- Contact ---
  sendContact(payload: { name: string; email: string; phone?: string; message: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/contact`, payload);
  }

  sendClaim(payload: Record<string, unknown>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/claims`, payload);
  }

  // --- Customer Profile ---
  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/customers/me`);
  }

  updateMyProfile(payload: Partial<UserProfilePayload>): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.apiUrl}/customers/me`, payload);
  }

  // Admin methods for packages management
  createPackage(payload: Record<string, unknown>): Observable<TravelPackage> {
    return this.http.post<TravelPackage>(`${this.apiUrl}/packages`, payload);
  }

  updatePackage(id: string, payload: Record<string, unknown>): Observable<TravelPackage> {
    return this.http.patch<TravelPackage>(`${this.apiUrl}/packages/${id}`, payload);
  }

  deletePackage(id: string): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/packages/${id}`);
  }
}
