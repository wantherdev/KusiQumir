import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from '../tokens/api-url';

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface TourSchedule {
  id: string;
  departure: string;
  pickupStart: string;
  arrival: string;
  language?: string;
  available: boolean;
}

export interface ItineraryActivity {
  id: string;
  itineraryDayId: string;
  sortOrder: number;
  time?: string;
  title: string;
  description: string;
  duration: number;
}

export interface ItineraryDay {
  id: string;
  day: number;
  title: string;
  activities: ItineraryActivity[];
}

export interface TourDestination {
  id: string;
  tourId: string;
  destinationId: string;
  sortOrder: number;
  destination: Destination;
}

export interface TourInclude {
  id: string;
  title: string;
  description?: string;
}

export interface TourExclude {
  id: string;
  title: string;
  description?: string;
}

export interface TourFaq {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface TourRecommendation {
  id: string;
  title: string;
  description: string;
}

export interface TourRequirement {
  id: string;
  requirement: string;
}

export interface TourPrice {
  id: string;
  name: string;
  currency: string;
  adult: number;
  child?: number;
  private?: number;
}

export interface TourImage {
  id: string;
  url: string;
  alt: string;
  featured: boolean;
  sortOrder: number;
  source?: string;
}

export interface TourSeo {
  id: string;
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
}

export interface TourMetadata {
  id: string;
  provider?: string;
  sourceUrl?: string;
  lastUpdated?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  name?: string;
  country?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  email?: string;
  avatar?: string;
  rating: number;
  tags: string[];
  featured: boolean;
  sortOrder: number;
  active: boolean;
  tourId?: string;
  tour?: { id: string; title: string; slug?: string };
  consent?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialPayload {
  name: string;
  role?: string;
  content: string;
  email?: string;
  avatar?: string;
  rating: number;
  tags?: string[];
  featured?: boolean;
  sortOrder?: number;
  active?: boolean;
  tourId?: string;
  consent?: Record<string, unknown>;
}

export interface Tour {
  id: string;
  slug: string;
  code: string;
  title: string;
  subtitle?: string;
  shortDescription: string;
  description: string;
  durationHours: number;
  durationDays: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  groupType: 'Shared' | 'Private';
  serviceType: 'HalfDay' | 'FullDay' | 'MultiDay';
  featured: boolean;
  active: boolean;
  categoryId: string;
  providerId?: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  provider?: Provider;
  schedules?: TourSchedule[];
  itineraryDays?: ItineraryDay[];
  destinations?: TourDestination[];
  includes?: TourInclude[];
  excludes?: TourExclude[];
  faqs?: TourFaq[];
  recommendations?: TourRecommendation[];
  requirements?: TourRequirement[];
  prices?: TourPrice[];
  images?: TourImage[];
  seo?: TourSeo;
  metadata?: TourMetadata;
  reviews?: Review[];
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
}

export type TourPayload = Omit<Tour, 'id' | 'createdAt' | 'updatedAt' | 'category' | 'provider' | 'schedules' | 'itineraryDays' | 'destinations' | 'includes' | 'excludes' | 'faqs' | 'recommendations' | 'requirements' | 'prices' | 'images' | 'seo' | 'metadata' | 'reviews'> & {
  schedules?: { create: { departure: string; pickupStart: string; arrival: string; language?: string; available?: boolean }[] };
  itineraryDays?: { create: { day: number; title: string; activities?: { create: { sortOrder: number; time?: string; title: string; description: string; duration: number }[] } }[] };
  destinations?: { create: { destinationId: string; sortOrder: number }[] };
  includes?: { create: { title: string; description?: string }[] };
  excludes?: { create: { title: string; description?: string }[] };
  faqs?: { create: { question: string; answer: string; sortOrder: number }[] };
  recommendations?: { create: { title: string; description: string }[] };
  requirements?: { create: { requirement: string }[] };
  prices?: { create: { name: string; currency: string; adult: number; child?: number; private?: number }[] };
  images?: { create: { url: string; alt: string; featured?: boolean; sortOrder: number; source?: string }[] };
  seo?: { create: { title: string; description: string; keywords?: string[]; canonical?: string } };
  metadata?: { create: { provider?: string; sourceUrl?: string; lastUpdated?: string } };
  reviews?: { create: { rating: number; comment: string; name?: string; country?: string }[] };
};

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
  slug?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
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

export interface Customer {
  id: string;
  name: string;
  email: string;
  nationality?: string | null;
  passport?: string | null;
  phone?: string | null;
  preferences?: string | null;
  createdAt: string;
  bookings?: Booking[];
}

export interface Provider {
  id: string;
  name: string;
  type: string;
  contact: string;
  contract?: string | null;
  commission?: string | null;
  services?: string | null;
  createdAt: string;
}

export interface Guide {
  id: string;
  name: string;
  languages: string;
  credential: string;
  availability: boolean;
  rating: number;
  createdAt: string;
}

export interface Operation {
  id: string;
  bookingId: string;
  guideId?: string | null;
  guide?: Guide | null;
  transport: string;
  pickupTime: string;
  status: string;
  createdAt: string;
  booking?: Booking | null;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  method?: string | null;
  status: string;
  createdAt: string;
  booking?: Booking | null;
}

export interface Invoice {
  id: string;
  bookingId: string;
  customerId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  booking?: Booking | null;
  customer?: Customer | null;
}

export interface AnalyticsData {
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  toursCount: number;
  packagesCount: number;
  articlesCount: number;
  experiencesCount: number;
  customersCount: number;
  providersCount: number;
  guidesCount: number;
  operationsCount: number;
  paymentsCount: number;
  invoicesCount: number;
  recentBookings: Booking[];
  revenueByMonth: { month: string; revenue: number }[];
  bookingsByStatus: { status: string; count: number }[];
}

@Injectable({ providedIn: 'root' })
export class TravelApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_URL) private readonly apiUrl: string,
  ) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  createCategory(name: string, description?: string): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, { name, description });
  }

  getDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(`${this.apiUrl}/destinations`);
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

  getToursAdmin(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${this.apiUrl}/tours/admin`);
  }

  getTourById(id: string): Observable<Tour> {
    return this.http.get<Tour>(`${this.apiUrl}/tours/${id}`);
  }

  getTourBySlug(slug: string): Observable<Tour> {
    return this.http.get<Tour>(`${this.apiUrl}/tours/slug/${slug}`);
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

  bulkCreateTours(tours: TourPayload[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/tours/bulk`, { tours });
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
    return this.http.get<Article[]>(`${this.apiUrl}/articles/admin`);
  }

  createArticle(payload: ArticlePayload): Observable<Article> {
    return this.http.post<Article>(`${this.apiUrl}/articles/admin`, payload);
  }

  updateArticle(id: string, payload: Partial<ArticlePayload>): Observable<Article> {
    return this.http.patch<Article>(`${this.apiUrl}/articles/admin/${id}`, payload);
  }

  deleteArticle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/articles/admin/${id}`);
  }

  // --- Experiences ---
  getExperiences(): Observable<PaginatedResponse<Experience>> {
    return this.http.get<PaginatedResponse<Experience>>(`${this.apiUrl}/experiences`);
  }

  getExperience(slug: string): Observable<Experience> {
    return this.http.get<Experience>(`${this.apiUrl}/experiences/${slug}`);
  }

  getExperiencesAdmin(): Observable<Experience[]> {
    return this.http.get<Experience[]>(`${this.apiUrl}/experiences/admin`);
  }

  createExperience(payload: ExperiencePayload): Observable<Experience> {
    return this.http.post<Experience>(`${this.apiUrl}/experiences/admin`, payload);
  }

  updateExperience(id: string, payload: Partial<ExperiencePayload>): Observable<Experience> {
    return this.http.patch<Experience>(`${this.apiUrl}/experiences/admin/${id}`, payload);
  }

  deleteExperience(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/experiences/admin/${id}`);
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
  getPackagesAdmin(): Observable<TravelPackage[]> {
    return this.http.get<TravelPackage[]>(`${this.apiUrl}/packages/admin`);
  }

  createPackage(payload: Record<string, unknown>): Observable<TravelPackage> {
    return this.http.post<TravelPackage>(`${this.apiUrl}/packages/admin`, payload);
  }

  updatePackage(id: string, payload: Record<string, unknown>): Observable<TravelPackage> {
    return this.http.patch<TravelPackage>(`${this.apiUrl}/packages/admin/${id}`, payload);
  }

  deletePackage(id: string): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/packages/admin/${id}`);
  }

  // --- Testimonials ---
  getFeaturedTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.apiUrl}/testimonials/featured`);
  }

  getTestimonialTags(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/testimonials/tags`);
  }

  getTestimonialsAdmin(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.apiUrl}/testimonials/admin`);
  }

  getTestimonialAdmin(id: string): Observable<Testimonial> {
    return this.http.get<Testimonial>(`${this.apiUrl}/testimonials/admin/${id}`);
  }

  createTestimonial(payload: TestimonialPayload): Observable<Testimonial> {
    return this.http.post<Testimonial>(`${this.apiUrl}/testimonials/admin`, payload);
  }

  createPublicTestimonial(payload: TestimonialPayload): Observable<Testimonial> {
    return this.http.post<Testimonial>(`${this.apiUrl}/testimonials`, payload);
  }

  updateTestimonial(id: string, payload: Partial<TestimonialPayload>): Observable<Testimonial> {
    return this.http.patch<Testimonial>(`${this.apiUrl}/testimonials/admin/${id}`, payload);
  }

  deleteTestimonial(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/testimonials/admin/${id}`);
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/uploads`, formData);
  }

  // --- Customers ---
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customers`);
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/customers/${id}`);
  }

  createCustomer(payload: { name: string; email: string; phone?: string; nationality?: string; passport?: string }): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/customers`, payload);
  }

  // --- Providers ---
  getProviders(): Observable<Provider[]> {
    return this.http.get<Provider[]>(`${this.apiUrl}/providers`);
  }

  getProvider(id: string): Observable<Provider> {
    return this.http.get<Provider>(`${this.apiUrl}/providers/${id}`);
  }

  createProvider(payload: { name: string; type: string; contact: string; contract?: string; commission?: string; services?: string }): Observable<Provider> {
    return this.http.post<Provider>(`${this.apiUrl}/providers`, payload);
  }

  updateProvider(id: string, payload: Partial<{ name: string; type: string; contact: string; contract?: string; commission?: string; services?: string }>): Observable<Provider> {
    return this.http.patch<Provider>(`${this.apiUrl}/providers/${id}`, payload);
  }

  deleteProvider(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/providers/${id}`);
  }

  // --- Guides ---
  getGuides(): Observable<Guide[]> {
    return this.http.get<Guide[]>(`${this.apiUrl}/guides`);
  }

  getGuide(id: string): Observable<Guide> {
    return this.http.get<Guide>(`${this.apiUrl}/guides/${id}`);
  }

  createGuide(payload: { name: string; languages: string; credential: string; availability?: boolean; rating?: number }): Observable<Guide> {
    return this.http.post<Guide>(`${this.apiUrl}/guides`, payload);
  }

  updateGuide(id: string, payload: Partial<{ name: string; languages: string; credential: string; availability?: boolean; rating?: number }>): Observable<Guide> {
    return this.http.patch<Guide>(`${this.apiUrl}/guides/${id}`, payload);
  }

  deleteGuide(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/guides/${id}`);
  }

  // --- Operations ---
  getOperations(): Observable<Operation[]> {
    return this.http.get<Operation[]>(`${this.apiUrl}/operations`);
  }

  getOperation(id: string): Observable<Operation> {
    return this.http.get<Operation>(`${this.apiUrl}/operations/${id}`);
  }

  createOperation(payload: { bookingId: string; guideId?: string; transport: string; pickupTime: string; status?: string }): Observable<Operation> {
    return this.http.post<Operation>(`${this.apiUrl}/operations`, payload);
  }

  updateOperation(id: string, payload: { guideId?: string; transport?: string; pickupTime?: string; status?: string }): Observable<Operation> {
    return this.http.patch<Operation>(`${this.apiUrl}/operations/${id}`, payload);
  }

  // --- Payments ---
  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments`);
  }

  getPayment(id: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/payments/${id}`);
  }

  createPayment(payload: { bookingId: string; amount: number; currency?: string; method?: string }): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/payments`, payload);
  }

  // --- Billing / Invoices ---
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/billing/invoices`);
  }

  getInvoice(id: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/billing/invoices/${id}`);
  }

  createInvoice(payload: { bookingId: string; customerId: string; amount: number; currency?: string }): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/billing/invoices`, payload);
  }

  // --- Analytics ---
  getAnalytics(): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(`${this.apiUrl}/analytics/dashboard`);
  }
}