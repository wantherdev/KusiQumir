import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Tour, TourPayload, Category, Destination, TravelApiService } from '../../../services/travel-api.service';
import { Observable, of, tap } from 'rxjs';
import { Skeleton } from '../../../components/skeleton/skeleton';
import { ConfirmDialog } from '../../../components/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-tours-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Skeleton, ConfirmDialog],
  templateUrl: './tours-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToursDashboard implements OnInit {
  tours: Tour[] = [];
  categories: Category[] = [];
  destinations: Destination[] = [];
  pageSize = 10;
  currentPage = 1;
  activeView: 'list' | 'form' | 'bulk' = 'list';
  selectedId: string | null = null;
  isLoading = false;
  saving = false;
  categorySearch = '';
  showCategoryDropdown = false;
  searchQuery = '';
  formSubmitted = false;
  subEntityTab: 'itinerary' | 'includes' | 'excludes' | 'faqs' | 'prices' | 'recommendations' | 'requirements' | 'schedules' | 'images' | 'seo' = 'itinerary';

  form: FormGroup;

  bulkJson = '';
  bulkParsed: any[] | null = null;
  bulkError = '';
  bulkUploading = false;
  bulkResult = '';

  private readonly notification = inject(NotificationService);

  get pagedItems() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }

  get filtered(): Tour[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.tours;
    return this.tours.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q) ||
      t.code.toLowerCase().includes(q)
    );
  }

  get isEditMode(): boolean {
    return this.selectedId !== null;
  }

  get itineraryDays(): FormArray {
    return this.form.get('itineraryDays') as FormArray;
  }

  get includes(): FormArray {
    return this.form.get('includes') as FormArray;
  }

  get excludes(): FormArray {
    return this.form.get('excludes') as FormArray;
  }

  get faqs(): FormArray {
    return this.form.get('faqs') as FormArray;
  }

  get prices(): FormArray {
    return this.form.get('prices') as FormArray;
  }

  get recommendations(): FormArray {
    return this.form.get('recommendations') as FormArray;
  }

  get requirements(): FormArray {
    return this.form.get('requirements') as FormArray;
  }

  get schedules(): FormArray {
    return this.form.get('schedules') as FormArray;
  }

  get images(): FormArray {
    return this.form.get('images') as FormArray;
  }

  constructor(
    private readonly api: TravelApiService,
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      slug: [''],
      code: [''],
      title: ['', Validators.required],
      subtitle: [''],
      shortDescription: ['', Validators.required],
      description: ['', Validators.required],
      durationHours: [0, [Validators.required, Validators.min(0)]],
      durationDays: [0, [Validators.required, Validators.min(0)]],
      difficulty: ['Easy', Validators.required],
      groupType: ['Shared', Validators.required],
      serviceType: ['FullDay', Validators.required],
      featured: [false],
      active: [true],
      categoryId: ['', Validators.required],
      providerId: [''],
      seoTitle: [''],
      seoDescription: [''],
      seoKeywords: [''],
      seoCanonical: [''],
      itineraryDays: this.fb.array([]),
      includes: this.fb.array([]),
      excludes: this.fb.array([]),
      faqs: this.fb.array([]),
      prices: this.fb.array([]),
      recommendations: this.fb.array([]),
      requirements: this.fb.array([]),
      schedules: this.fb.array([]),
      images: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadTours();
    this.api.getCategories().subscribe({
      next: (cats) => { this.categories = cats; this.cdr.markForCheck(); },
    });
    this.api.getDestinations().subscribe({
      next: (dests) => { this.destinations = dests; this.cdr.markForCheck(); },
    });
  }

  loadTours(): void {
    this.currentPage = 1;
    this.isLoading = true;
    this.api.getToursAdmin().subscribe({
      next: (items) => { this.tours = items; this.isLoading = false; this.cdr.markForCheck(); },
      error: () => { this.notification.show('Error al cargar tours.', 'error'); this.isLoading = false; this.cdr.markForCheck(); },
    });
  }

  prevPage() { this.currentPage = Math.max(1, this.currentPage - 1); }
  nextPage() { this.currentPage = Math.min(this.totalPages, this.currentPage + 1); }
  onSearch() { this.currentPage = 1; }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearch();
  }

  get filteredCategories(): Category[] {
    const q = this.categorySearch.toLowerCase().trim();
    return q ? this.categories.filter(c => c.name.toLowerCase().includes(q)) : this.categories;
  }

  get currentCategoryName(): string {
    const id = this.form.get('categoryId')?.value;
    return this.categories.find(c => c.id === id)?.name ?? '';
  }

  onCategoryInput(event: Event): void {
    this.categorySearch = (event.target as HTMLInputElement).value;
    this.showCategoryDropdown = true;
  }

  autoSelectCategory(): void {
    const match = this.categories.find(c => c.name.toLowerCase() === this.categorySearch.trim().toLowerCase());
    if (match) {
      this.selectCategory(match);
    }
  }

  hideCategoryDropdown(): void {
    setTimeout(() => {
      this.showCategoryDropdown = false;
      this.autoSelectCategory();
    }, 200);
  }

  createCategory(): void {
    const name = this.categorySearch.trim();
    if (!name) return;
    this.api.createCategory(name).subscribe({
      next: (cat) => {
        this.categories = [...this.categories, cat].sort((a, b) => a.name.localeCompare(b.name));
        this.selectCategory(cat);
        this.cdr.markForCheck();
      },
    });
  }

  selectCategory(cat: Category): void {
    this.form.patchValue({ categoryId: cat.id });
    this.categorySearch = cat.name;
    this.showCategoryDropdown = false;
  }

  clearCategory(): void {
    this.form.patchValue({ categoryId: '' });
    this.categorySearch = '';
  }

  openForm(item?: Tour): void {
    this.formSubmitted = false;
    this.selectedId = item?.id ?? null;
    this.subEntityTab = 'itinerary';
    this.clearArrays();

    this.form.patchValue({
      code: item?.code ?? '',
      slug: item?.slug ?? '',
      title: item?.title ?? '',
      subtitle: item?.subtitle ?? '',
      shortDescription: item?.shortDescription ?? '',
      description: item?.description ?? '',
      durationHours: item?.durationHours ?? 0,
      durationDays: item?.durationDays ?? 1,
      difficulty: item?.difficulty ?? 'Easy',
      groupType: item?.groupType ?? 'Shared',
      serviceType: item?.serviceType ?? 'FullDay',
      featured: item?.featured ?? false,
      active: item?.active ?? true,
      categoryId: item?.categoryId ?? '',
      providerId: item?.providerId ?? '',
      seoTitle: item?.seo?.title ?? '',
      seoDescription: item?.seo?.description ?? '',
      seoKeywords: item?.seo?.keywords?.join(', ') ?? '',
      seoCanonical: item?.seo?.canonical ?? '',
    });

    this.categorySearch = item?.category?.name || '';

    if (item?.itineraryDays) {
      for (const day of item.itineraryDays) {
        const dayGroup = this.fb.group({
          day: [day.day, Validators.required],
          title: [day.title, Validators.required],
          activities: this.fb.array(
            (day.activities ?? []).map(a => this.fb.group({
              sortOrder: [a.sortOrder],
              time: [a.time ?? ''],
              title: [a.title, Validators.required],
              description: [a.description, Validators.required],
              duration: [a.duration, [Validators.required, Validators.min(0)]],
            }))
          ),
        });
        this.itineraryDays.push(dayGroup);
      }
    }

    if (item?.includes) {
      for (const inc of item.includes) {
        this.includes.push(this.fb.group({ title: [inc.title, Validators.required], description: [inc.description ?? ''] }));
      }
    }
    if (item?.excludes) {
      for (const exc of item.excludes) {
        this.excludes.push(this.fb.group({ title: [exc.title, Validators.required], description: [exc.description ?? ''] }));
      }
    }
    if (item?.faqs) {
      for (const faq of item.faqs) {
        this.faqs.push(this.fb.group({ question: [faq.question, Validators.required], answer: [faq.answer, Validators.required], sortOrder: [faq.sortOrder] }));
      }
    }
    if (item?.prices) {
      for (const p of item.prices) {
        this.prices.push(this.fb.group({ name: [p.name, Validators.required], currency: [p.currency, Validators.required], adult: [p.adult, [Validators.required, Validators.min(0)]], child: [p.child ?? null], private: [p.private ?? null] }));
      }
    }
    if (item?.recommendations) {
      for (const r of item.recommendations) {
        this.recommendations.push(this.fb.group({ title: [r.title, Validators.required], description: [r.description, Validators.required] }));
      }
    }
    if (item?.requirements) {
      for (const r of item.requirements) {
        this.requirements.push(this.fb.group({ requirement: [r.requirement, Validators.required] }));
      }
    }
    if (item?.schedules) {
      for (const s of item.schedules) {
        this.schedules.push(this.fb.group({ departure: [s.departure, Validators.required], pickupStart: [s.pickupStart, Validators.required], arrival: [s.arrival, Validators.required], language: [s.language ?? ''], available: [s.available ?? true] }));
      }
    }
    if (item?.images) {
      for (const img of item.images) {
        this.images.push(this.fb.group({ url: [img.url, Validators.required], alt: [img.alt ?? ''], featured: [img.featured ?? false], sortOrder: [img.sortOrder], source: [img.source ?? ''] }));
      }
    }

    this.activeView = 'form';
  }

  closeForm(): void {
    this.activeView = 'list';
    this.selectedId = null;
    this.formSubmitted = false;
    this.form.reset({
      difficulty: 'Easy', groupType: 'Shared', serviceType: 'FullDay',
      featured: false, active: true, durationHours: 0, durationDays: 1,
    });
    this.clearArrays();
  }

  openBulk(): void {
    this.activeView = 'bulk';
    this.bulkJson = '';
    this.bulkParsed = null;
    this.bulkError = '';
    this.bulkResult = '';
  }

  closeBulk(): void {
    this.activeView = 'list';
  }

  onBulkFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.bulkJson = String(reader.result || '');
      this.validateBulk();
    };
    reader.readAsText(file);
  }

  loadBulkExample(): void {
    this.bulkJson = JSON.stringify([
      {
        slug: "valle-sagrado-3d",
        code: "VS-001",
        title: "Tour Valle Sagrado 3 días",
        subtitle: "Cusco",
        shortDescription: "Recorrido por el Valle Sagrado de los Incas.",
        description: "Un tour completo por los sitios más emblemáticos del Valle Sagrado.",
        durationHours: 8,
        durationDays: 3,
        difficulty: "Moderate",
        groupType: "Shared",
        serviceType: "MultiDay",
        featured: true,
        active: true,
        categoryName: "Aventura",
        prices: { create: [{ name: "Adulto", currency: "USD", adult: 350, child: 250 }] },
        includes: { create: [{ title: "Transporte", description: "Ida y vuelta" }] },
        excludes: { create: [{ title: "Almuerzo", description: "No incluido" }] },
        itineraryDays: { create: [{ day: 1, title: "Llegada a Cusco", activities: { create: [{ sortOrder: 1, time: "09:00", title: "Recojo", description: "Traslado al hotel", duration: 60 }] } }] },
        faqs: { create: [{ question: "¿Incluye boletos?", answer: "No", sortOrder: 1 }] },
      },
    ], null, 2);
    this.validateBulk();
  }

  validateBulk(): void {
    this.bulkError = '';
    this.bulkParsed = null;
    if (!this.bulkJson.trim()) {
      this.bulkError = 'Pega o carga un JSON con el arreglo de tours.';
      return;
    }
    try {
      const parsed = JSON.parse(this.bulkJson);
      const arr = Array.isArray(parsed) ? parsed : parsed.tours;
      if (!Array.isArray(arr) || arr.length === 0) {
        this.bulkError = 'El JSON debe ser un arreglo de tours (o un objeto con la propiedad "tours").';
        return;
      }
      const missing = arr.filter(t => !t.title || (!t.categoryId && !t.categoryName) || !t.shortDescription || !t.description || !t.slug || !t.code);
      if (missing.length) {
        this.bulkError = `${missing.length} tour(s) le faltan campos requeridos (title, slug, code, shortDescription, description, categoryId o categoryName).`;
        return;
      }
      this.bulkParsed = arr;
    } catch (e: any) {
      this.bulkError = 'JSON inválido: ' + (e?.message ?? 'revísalo.');
    }
  }

  uploadBulk(): void {
    if (!this.bulkParsed) {
      this.validateBulk();
      if (!this.bulkParsed) return;
    }
    this.bulkUploading = true;
    this.bulkResult = '';
    this.api.bulkCreateTours(this.bulkParsed as any[]).subscribe({
      next: (res: any[]) => {
        this.bulkUploading = false;
        this.bulkResult = `${res.length} tour(s) creados correctamente.`;
        this.notification.show(`${res.length} tours creados.`, 'success');
        this.loadTours();
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.bulkUploading = false;
        this.bulkError = err?.error?.message || err?.message || 'Error al crear los tours.';
        this.notification.show('Error al crear los tours.', 'error');
        this.cdr.markForCheck();
      },
    });
  }

  private clearArrays(): void {
    while (this.itineraryDays.length) this.itineraryDays.removeAt(0);
    while (this.includes.length) this.includes.removeAt(0);
    while (this.excludes.length) this.excludes.removeAt(0);
    while (this.faqs.length) this.faqs.removeAt(0);
    while (this.prices.length) this.prices.removeAt(0);
    while (this.recommendations.length) this.recommendations.removeAt(0);
    while (this.requirements.length) this.requirements.removeAt(0);
    while (this.schedules.length) this.schedules.removeAt(0);
    while (this.images.length) this.images.removeAt(0);
  }

  addItineraryDay(): void {
    this.itineraryDays.push(this.fb.group({
      day: [this.itineraryDays.length + 1],
      title: ['', Validators.required],
      activities: this.fb.array([]),
    }));
  }

  removeItineraryDay(index: number): void {
    this.itineraryDays.removeAt(index);
  }

  getActivities(dayIndex: number): FormArray {
    return this.itineraryDays.at(dayIndex).get('activities') as FormArray;
  }

  addActivity(dayIndex: number): void {
    this.getActivities(dayIndex).push(this.fb.group({
      sortOrder: [this.getActivities(dayIndex).length + 1],
      time: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      duration: [60, [Validators.required, Validators.min(0)]],
    }));
  }

  removeActivity(dayIndex: number, activityIndex: number): void {
    this.getActivities(dayIndex).removeAt(activityIndex);
  }

  addInclude(): void {
    this.includes.push(this.fb.group({ title: ['', Validators.required], description: [''] }));
  }

  removeInclude(index: number): void {
    this.includes.removeAt(index);
  }

  addExclude(): void {
    this.excludes.push(this.fb.group({ title: ['', Validators.required], description: [''] }));
  }

  removeExclude(index: number): void {
    this.excludes.removeAt(index);
  }

  addFaq(): void {
    this.faqs.push(this.fb.group({ question: ['', Validators.required], answer: ['', Validators.required], sortOrder: [this.faqs.length + 1] }));
  }

  removeFaq(index: number): void {
    this.faqs.removeAt(index);
  }

  addPrice(): void {
    this.prices.push(this.fb.group({ name: ['', Validators.required], currency: ['USD', Validators.required], adult: [0, [Validators.required, Validators.min(0)]], child: [null], private: [null] }));
  }

  removePrice(index: number): void {
    this.prices.removeAt(index);
  }

  addRecommendation(): void {
    this.recommendations.push(this.fb.group({ title: ['', Validators.required], description: ['', Validators.required] }));
  }

  removeRecommendation(index: number): void {
    this.recommendations.removeAt(index);
  }

  addRequirement(): void {
    this.requirements.push(this.fb.group({ requirement: ['', Validators.required] }));
  }

  removeRequirement(index: number): void {
    this.requirements.removeAt(index);
  }

  addSchedule(): void {
    this.schedules.push(this.fb.group({ departure: ['', Validators.required], pickupStart: ['', Validators.required], arrival: ['', Validators.required], language: [''], available: [true] }));
  }

  removeSchedule(index: number): void {
    this.schedules.removeAt(index);
  }

  addImage(): void {
    this.images.push(this.fb.group({ url: ['', Validators.required], alt: [''], featured: [false], sortOrder: [0], source: [''] }));
  }

  removeImage(index: number): void {
    this.images.removeAt(index);
  }

  moveImage(index: number, dir: -1 | 1): void {
    const arr = this.images;
    const target = index + dir;
    if (target < 0 || target >= arr.length) return;
    const a = arr.at(index) as FormGroup;
    const b = arr.at(target) as FormGroup;
    const soA = a.get('sortOrder')?.value ?? index;
    const soB = b.get('sortOrder')?.value ?? target;
    a.get('sortOrder')?.setValue(soB);
    b.get('sortOrder')?.setValue(soA);
    arr.setControl(index, b);
    arr.setControl(target, a);
    arr.updateValueAndValidity();
    this.cdr.markForCheck();
  }

  makeFeatured(index: number): void {
    this.images.controls.forEach((ctrl, i) =>
      (ctrl as FormGroup).get('featured')?.setValue(i === index),
    );
    this.cdr.markForCheck();
  }

  tourThumb(t: Tour): string | null {
    return t.images && t.images.length ? t.images[0].url : null;
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  uploading = false;
  uploadingIndex: number | null = null;

  onUploadImage(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.uploadingIndex = index;
    this.api.uploadImage(file).subscribe({
      next: (res) => {
        (this.images.at(index) as FormGroup).patchValue({ url: res.url });
        this.uploadingIndex = null;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.notification.show(err?.error?.message || 'Error al subir la imagen.', 'error');
        this.uploadingIndex = null;
        this.cdr.markForCheck();
      },
    });
  }

  onUploadNewImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.uploading = true;
    this.api.uploadImage(file).subscribe({
      next: (res) => {
        this.addImage();
        (this.images.at(this.images.length - 1) as FormGroup).patchValue({ url: res.url });
        this.uploading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.notification.show(err?.error?.message || 'Error al subir la imagen.', 'error');
        this.uploading = false;
        this.cdr.markForCheck();
      },
    });
  }

  saveTour(): void {
    this.formSubmitted = true;
    this.autoSelectCategory();

    const categorySet$: Observable<any> = !this.form.get('categoryId')?.value && this.categorySearch.trim()
      ? this.api.createCategory(this.categorySearch.trim()).pipe(
          tap((cat) => {
            this.categories = [...this.categories, cat].sort((a, b) => a.name.localeCompare(b.name));
            this.selectCategory(cat);
          }),
        )
      : of(null);

    categorySet$.subscribe({
      next: () => {
        const requiredScalars = ['title', 'shortDescription', 'description', 'durationHours', 'durationDays', 'difficulty', 'groupType', 'serviceType', 'categoryId'];
        const invalid = requiredScalars.filter((f) => this.form.get(f)?.invalid);
        if (invalid.length) {
          this.saving = false;
          this.notification.show('Corrige los campos principales marcados en rojo antes de guardar.', 'error');
          return;
        }
        this.persistTour();
      },
      error: () => {
        this.saving = false;
        this.notification.show('No se pudo crear la categoría.', 'error');
      },
    });
  }

  private persistTour(): void {
    this.saving = true;
    const raw = this.form.getRawValue();

    const slug = raw.slug || this.slugify(raw.title);
    const code = raw.code || this.generateCode();
    const payload: any = {
      slug,
      code,
      title: raw.title,
      subtitle: raw.subtitle || undefined,
      shortDescription: raw.shortDescription,
      description: raw.description,
      durationHours: raw.durationHours,
      durationDays: raw.durationDays,
      difficulty: raw.difficulty,
      groupType: raw.groupType,
      serviceType: raw.serviceType,
      featured: raw.featured,
      active: raw.active,
      categoryId: raw.categoryId,
      providerId: raw.providerId || undefined,
    };

    if (raw.itineraryDays?.length) {
      const days = raw.itineraryDays
        .filter((d: any) => d.title && String(d.title).trim())
        .map((d: any) => ({
          day: d.day,
          title: d.title,
          activities: {
            create: (d.activities || [])
              .filter((a: any) => a.title && String(a.title).trim() && a.description && String(a.description).trim())
              .map((a: any) => ({
                sortOrder: a.sortOrder ?? 0,
                time: a.time || undefined,
                title: a.title,
                description: a.description,
                duration: a.duration ?? 0,
              })),
          },
        }));
      if (days.length) payload.itineraryDays = { create: days };
    }
    if (raw.includes?.length) {
      const arr = raw.includes.filter((i: any) => i.title && String(i.title).trim());
      if (arr.length) payload.includes = { create: arr.map((i: any) => ({ title: i.title, description: i.description || undefined })) };
    }
    if (raw.excludes?.length) {
      const arr = raw.excludes.filter((e: any) => e.title && String(e.title).trim());
      if (arr.length) payload.excludes = { create: arr.map((e: any) => ({ title: e.title, description: e.description || undefined })) };
    }
    if (raw.faqs?.length) {
      const arr = raw.faqs.filter((f: any) => f.question && String(f.question).trim() && f.answer && String(f.answer).trim());
      if (arr.length) payload.faqs = { create: arr.map((f: any) => ({ question: f.question, answer: f.answer, sortOrder: f.sortOrder ?? 0 })) };
    }
    if (raw.prices?.length) {
      const arr = raw.prices.filter((p: any) => p.name && String(p.name).trim() && p.currency && p.adult != null && p.adult !== '');
      if (arr.length) payload.prices = { create: arr.map((p: any) => ({ name: p.name, currency: p.currency, adult: p.adult, child: p.child ?? undefined, private: p.private ?? undefined })) };
    }
    if (raw.recommendations?.length) {
      const arr = raw.recommendations.filter((r: any) => r.title && String(r.title).trim() && r.description && String(r.description).trim());
      if (arr.length) payload.recommendations = { create: arr.map((r: any) => ({ title: r.title, description: r.description })) };
    }
    if (raw.requirements?.length) {
      const arr = raw.requirements.filter((r: any) => r.requirement && String(r.requirement).trim());
      if (arr.length) payload.requirements = { create: arr.map((r: any) => ({ requirement: r.requirement })) };
    }
    if (raw.schedules?.length) {
      const arr = raw.schedules.filter((s: any) => s.departure && String(s.departure).trim() && s.pickupStart && String(s.pickupStart).trim() && s.arrival && String(s.arrival).trim());
      if (arr.length) payload.schedules = { create: arr.map((s: any) => ({ departure: s.departure, pickupStart: s.pickupStart, arrival: s.arrival, language: s.language || undefined, available: s.available ?? true })) };
    }
    if (raw.images?.length) {
      const arr = raw.images.filter((img: any) => img.url && String(img.url).trim());
      if (arr.length) payload.images = { create: arr.map((img: any) => ({ url: img.url, alt: img.alt || '', featured: img.featured ?? false, sortOrder: img.sortOrder ?? 0, source: img.source || undefined })) };
    }
    if (raw.seoTitle || raw.seoDescription) {
      payload.seo = {
        create: {
          title: raw.seoTitle,
          description: raw.seoDescription,
          keywords: raw.seoKeywords ? raw.seoKeywords.split(',').map((k: string) => k.trim()).filter(Boolean) : undefined,
          canonical: raw.seoCanonical || undefined,
        },
      };
    }

    const req = this.selectedId
      ? this.api.updateTour(this.selectedId, payload)
      : this.api.createTour(payload);

    req.subscribe({
      next: () => {
        this.notification.show(this.isEditMode ? 'Tour actualizado.' : 'Tour creado.', 'success');
        this.saving = false;
        this.closeForm();
        this.loadTours();
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.notification.show(err.error?.message || 'Error al guardar.', 'error');
        this.saving = false;
        this.cdr.markForCheck();
      },
    });
  }

  showConfirm = false;
  pendingDeleteId = '';

  confirmDelete(id: string): void {
    this.pendingDeleteId = id;
    this.showConfirm = true;
  }

  deleteTour(): void {
    this.isLoading = true;
    this.api.deleteTour(this.pendingDeleteId).subscribe({
      next: () => {
        this.notification.show('Tour eliminado.', 'success');
        this.showConfirm = false;
        this.pendingDeleteId = '';
        this.loadTours();
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.show('Error al eliminar.', 'error');
        this.showConfirm = false;
        this.pendingDeleteId = '';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  difficultyColor(d: string): string {
    const map: Record<string, string> = { Easy: 'bg-green-100 text-green-700', Moderate: 'bg-yellow-100 text-yellow-700', Challenging: 'bg-red-100 text-red-700' };
    return map[d] ?? 'bg-slate-100 text-slate-700';
  }

  onTitleChange(): void {
    const title = this.form.get('title')?.value;
    if (title) {
      this.form.patchValue({ slug: this.slugify(title), code: this.form.get('code')?.value || this.generateCode() });
    }
  }

  private slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9áéíóúñü\s-]/g, '').replace(/[\s]+/g, '-').replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '');
  }

  private generateCode(): string {
    return 'T-' + Date.now().toString(36).toUpperCase();
  }

  fc(abs: import('@angular/forms').AbstractControl | null): import('@angular/forms').FormControl {
    return abs as import('@angular/forms').FormControl;
  }

  trackByFn(index: number, item: any): string | number {
    return item.id ?? index;
  }
}
