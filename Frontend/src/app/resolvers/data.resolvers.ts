import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { TravelApiService, Tour, Article, Experience, TravelPackage, Testimonial } from '../services/travel-api.service';
import { TourStateService } from '../services/tour-state.service';

export interface HomeData {
  tours: Tour[];
  packages: TravelPackage[];
  testimonials: Testimonial[];
}

export const homeResolver: ResolveFn<HomeData> = () => {
  const api = inject(TravelApiService);
  const state = inject(TourStateService);
  return forkJoin({
    tours: api.getTours(),
    packages: api.getPackages(),
    testimonials: api.getFeaturedTestimonials(),
  }).pipe(
    map(({ tours, packages, testimonials }) => ({ tours: tours.items, packages, testimonials })),
    tap((data) => state.setTours(data.tours)),
    catchError(() => of({ tours: [] as Tour[], packages: [] as TravelPackage[], testimonials: [] as Testimonial[] })),
  );
};

export const toursResolver: ResolveFn<Tour[]> = () => {
  const api = inject(TravelApiService);
  const state = inject(TourStateService);
  return api.getTours().pipe(
    map((res) => res.items),
    tap((tours) => state.setTours(tours)),
    catchError(() => of([] as Tour[])),
  );
};

export const articlesResolver: ResolveFn<Article[]> = () => {
  const api = inject(TravelApiService);
  return api.getArticles().pipe(
    map((res) => res.items),
    catchError(() => of([] as Article[])),
  );
};

export const experiencesResolver: ResolveFn<Experience[]> = () => {
  const api = inject(TravelApiService);
  return api.getExperiences().pipe(
    map((res) => res.items),
    catchError(() => of([] as Experience[])),
  );
};

export const tourDetailResolver: ResolveFn<Tour | null> = (route: ActivatedRouteSnapshot) => {
  const api = inject(TravelApiService);
  const slug = route.paramMap.get('slug');
  if (!slug) return of(null);
  return api.getTourBySlug(slug).pipe(catchError(() => of(null)));
};

export const articleResolver: ResolveFn<Article | null> = (route: ActivatedRouteSnapshot) => {
  const api = inject(TravelApiService);
  const slug = route.paramMap.get('slug');
  if (!slug) return of(null);
  return api.getArticle(slug).pipe(catchError(() => of(null)));
};

export const experienceResolver: ResolveFn<Experience | null> = (route: ActivatedRouteSnapshot) => {
  const api = inject(TravelApiService);
  const slug = route.paramMap.get('slug');
  if (!slug) return of(null);
  return api.getExperience(slug).pipe(catchError(() => of(null)));
};
