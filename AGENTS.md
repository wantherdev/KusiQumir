# AGENTS.md — Kusi Q'umir

Conocimiento del proyecto para asistentes IA.

---

## Identidad del proyecto

- **Nombre**: Kusi Q'umir (quechua: "alegría verde")
- **Tipo**: Agencia de viajes digital peruana — sitio web + plataforma de gestión
- **URL producción**: https://kusiqumir.com
- **Repositorio**: `https://github.com/wantherdev/KusiQumir.git`

---

## Stack tecnológico

| Herramienta | Versión | Notas |
|-------------|---------|-------|
| Node.js | ≥ 22 | Runtime |
| pnpm | 9.15.0 | Package manager (usar siempre, nunca npm) |
| Angular | 22.0 | Standalone components, SSR habilitado |
| Tailwind CSS | 4.1.12 | CSS-first (`@import 'tailwindcss'`), **no hay** `tailwind.config.js` |
| PostCSS | 8.5.3 | Procesador CSS |
| NestJS | 10.4 | Backend framework |
| Prisma | 5.22 | ORM, PostgreSQL |
| PostGIS (PostgreSQL) | 17-3.5 alpine | Base de datos `kusiqumir` con extensión espacial |
| TypeScript | ~6.0.2 (frontend), ~5.7.3 (backend) | |
| ESLint | 10.7 | Linter |
| Prettier | 3.8.1 | Formatter |
| Vitest | 4.0.8 | Testing frontend (devDependency) |
| Jest | 30.4 | Testing backend |
| ts-jest | 29.4 | Transformer Jest para TS |

## Frameworks y dependencias clave

**Frontend**: `@angular/forms`, `@angular/router`, `@angular/ssr` (22.0.7), `@angular/service-worker`, `@angular/localize`, `@angular/platform-server`, `@angular/cdk` (22.0.5), `@angular/build` (22.0.7), `@sentry/angular`, `express`, `http-proxy-middleware`, `@tailwindcss/postcss`, `@tailwindcss/typography`, `rxjs`, `tslib`, `postcss`, `prettier`, `vitest`, `jsdom`, `playwright-core`.

**Backend**: `@nestjs/config`, `@nestjs/jwt`, `@nestjs/passport`, `@nestjs/swagger`, `@nestjs/throttler`, `@nestjs/cache-manager`, `@prisma/client`, `bcryptjs`, `class-transformer`, `class-validator`, `compression`, `cookie-parser`, `csrf-csrf`, `helmet`, `passport`, `passport-jwt`, `multer`, `nestjs-pino`, `pino`, `pino-http`, `reflect-metadata`, `uuid`, `@sentry/node`, `@sentry/profiling-node`, `joi`, `cache-manager`, `swagger`.

---

## Diseño visual (Brand tokens)

### Colores

```css
--color-primary:       #00abaa    /* Teal — botones, acentos, links */
--color-primary-dark:  #00908f    /* Hover de primary */
--color-secondary:     #647bab    /* Azul acero — secundarios */
--color-secondary-dark:#4a5e8c    /* Hover de secondary */
--color-tertiary:      #0f172a    /* Slate oscuro — textos, títulos */
/* Soft background */
--color-secondary-soft: rgba(100, 123, 171, 0.14)
```

### Tipografía

- **Sans-serif (general)**: `Inter`, con fallback system-ui
- **Display (títulos hero)**: `Fjalla One`
- **Monospace (código)**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Roboto Mono, Courier New`

> Ambas fuentes cargadas desde Google Fonts en `styles.css`.

### Clases utilitarias globales (definidas en `styles.css`)

| Clase | Propósito |
|-------|-----------|
| `.glass-effect` | `backdrop-filter: blur(10px)` fondo traslúcido |
| `.container-page` | `max-w-screen-2xl` con padding responsive |
| `.section-title` | Título grande bold en tertiary |
| `.eyebrow` | Label uppercase tracking-wide en primary |
| `.panel` | Card/bloque: `rounded-[2rem] border border-slate-200 bg-white shadow-sm` |
| `.panel--dashed` | Variante dashed |
| `.sub-box` | Fondo secondary-soft `rounded-2xl` |
| `.btn` | Botón base: `rounded-full px-5 py-2.5 text-sm font-semibold` |
| `.btn-primary` | Botón primary: relleno teal, texto blanco, shadow |
| `.btn-ghost` | Botón ghost: borde slate-200, hover teal |
| `.input` | Input: `rounded-2xl border-slate-200 bg-slate-50`, focus ring primary |
| `.hero-dots` | Patrón de dots con `radial-gradient` (usado en headers admin) |
| `.admin-btn-hero` | Botón hero admin: blanco con sombra, hover scale |
| `.admin-btn-submit` | Botón submit admin: gradiente primary, sombra |
| `.admin-btn-ghost` | Botón ghost admin: borde, hover primary |
| `.admin-btn-action` | Botón acción tabla: pequeño, borde, hover primary |
| `.admin-btn-hero-danger` | Botón hero danger: borde rojo, hover scale |
| `.admin-btn-danger` | Botón danger: borde slate, hover rojo |
| `.markdown-content` | Contenedor de contenido markdown con tipografía estilizada |
| `.animate-slide-up` | Animación fade + slide up |

### Estilo general

- **Inputs**: `rounded-xl` o `rounded-2xl`, focus ring `primary/40`
- **Botones primarios admin**: `rounded-xl bg-white text-primary shadow-lg hover:scale-[1.02]`
- **Botones de acción tabla**: `rounded-lg border border-slate-200 bg-white`
- **Paginación**: `rounded-lg border border-slate-200 hover:border-primary/30`
- **Formularios admin**: secciones `rounded-xl border border-slate-100 bg-slate-50/50 p-5`
- **Headers admin (hero)**: gradiente `primary → primary-dark` con dots pattern
- **Stat cards**: panel con icono, contador grande, etiqueta
- **Accesibilidad**: `:focus-visible` outline primary, `prefers-reduced-motion` desactiva animaciones

---

## Arquitectura

### Frontend (`Frontend/`)

```
src/
├── app/
│   ├── pages/
│   │   ├── home/              → Landing page
│   │   ├── destinos/          → Tours listing + tour detail + redirect
│   │   ├── experiencias/      → Experiences listing + detail
│   │   ├── blog/              → Articles listing + article detail
│   │   ├── paquetes/          → Packages listing
│   │   ├── reservar/          → Booking flow
│   │   ├── contacto/          → Contact form
│   │   ├── nosotros/          → About us
│   │   ├── resenar-testimonio/→ Public testimonial form
│   │   ├── auth/              → Login / Register
│   │   ├── cliente/           → Mis reservas / Mi perfil
│   │   ├── not-found/         → Página 404
│   │   ├── admin/
│   │   │   ├── dashboard/     → 12 sub-dashboards individuales
│   │   │   │   ├── tours-dashboard.ts/html
│   │   │   │   ├── articles-dashboard.ts/html
│   │   │   │   ├── experiences-dashboard.ts/html
│   │   │   │   ├── bookings-dashboard.ts/html
│   │   │   │   ├── customers-dashboard.ts
│   │   │   │   ├── providers-dashboard.ts
│   │   │   │   ├── guides-dashboard.ts
│   │   │   │   ├── operations-dashboard.ts
│   │   │   │   ├── payments-dashboard.ts
│   │   │   │   ├── billing-dashboard.ts
│   │   │   │   ├── testimonials-dashboard.ts
│   │   │   │   └── packages-dashboard/  (directorio con .ts/.html)
│   │   │   ├── dashboard-page/ → admin-dashboard.ts
│   │   │   └── layout/         → admin-layout.ts
│   │   └── legal/
│   │       ├── terminos/              → Términos y condiciones
│   │       ├── politica-privacidad/   → Política de privacidad
│   │       ├── cancelaciones/         → Cancelaciones y reembolsos
│   │       ├── libro-reclamaciones/   → Libro de reclamaciones
│   │       └── contrato/              → Contrato de prestación de servicios
│   ├── services/             → Angular services (HttpClient)
│   │   ├── auth.service.ts
│   │   ├── local-bookings.service.ts
│   │   ├── notification.service.ts
│   │   ├── tour-state.service.ts
│   │   └── travel-api.service.ts
│   ├── shared/               → Modelos, utilidades
│   │   ├── markdown.ts
│   │   └── tour-ui.ts
│   ├── components/           → Componentes reutilizables
│   │   ├── navbar/
│   │   ├── footer/
│   │   ├── confirm-dialog/
│   │   ├── page-hero/
│   │   ├── skeleton/
│   │   ├── testimonial-card/
│   │   ├── testimonial-category-selector/
│   │   ├── toast/
│   │   └── tour-card/
│   ├── guards/               → auth.guard.ts, admin.guard.ts
│   ├── interceptors/         → HTTP interceptors
│   │   ├── auth.interceptor.ts (JWT)
│   │   └── csrf.interceptor.ts (CSRF token)
│   ├── tokens/               → api-url.ts
│   ├── data/                 → travel-content.ts (static/mock data)
│   ├── resolvers/            → data.resolvers.ts
│   ├── app.config.ts         → App configuration (providers, interceptors)
│   ├── app.routes.ts         → Route definitions
│   ├── app.routes.server.ts  → Server-specific route config
│   ├── app.config.server.ts  → Server-specific providers
│   ├── app.ts, app.html, app.css
│   └── app.spec.ts
├── environments/
│   ├── environment.ts        → Dev env (apiUrl, sentryDsn, social links)
│   └── environment.prod.ts   → Prod env
├── styles.css                → Estilos globales + design tokens
├── server.ts                 → SSR entry with API proxy
├── main.ts                   → Browser entry
├── main.server.ts            → Server entry
├── index.html                → HTML shell
├── proxy.conf.json           → Dev proxy (/api → localhost:3000/api/v1)
├── angular.json              → Build config (SSR, budgets, allowedHosts)
├── ngsw-config.json          → Service worker config
├── .postcssrc.json           → PostCSS config
├── tsconfig.json / tsconfig.app.json / tsconfig.spec.json
└── eslint.config.mjs / .prettierrc
```

### Backend (`backend/`)

```
src/
├── main.ts                   → Entry point (puerto 3000)
│   └── Sentry init, helmet CSP, compression, cookie-parser,
│       CORS, ValidationPipe, Swagger solo dev, graceful shutdown
├── app.module.ts             → Módulo raíz
│   └── Global guards: ThrottlerGuard, JwtAuthGuard, RolesGuard
├── prisma/
│   ├── prisma.service.ts     → Prisma singleton
│   └── prisma.module.ts
├── common/
│   ├── env.validation.ts     → Joi validation schema
│   ├── http-exception.filter.ts
│   ├── metrics.interceptor.ts
│   └── authenticated-request.ts
├── modules/
│   ├── auth/           → JWT, login, register, guards
│   ├── tours/          → CRUD tours
│   ├── bookings/       → Reservas + estados
│   ├── customers/      → Clientes
│   ├── providers/      → Proveedores
│   ├── guides/         → Guías turísticos
│   ├── operations/     → Operaciones logísticas
│   ├── packages/       → Paquetes turísticos
│   ├── experiences/    → Experiencias
│   ├── articles/       → Blog
│   ├── categories/     → Categorías de tours
│   ├── destinations/   → Destinos
│   ├── testimonials/   → Testimonios
│   ├── payments/       → Pagos
│   ├── billing/        → Facturación
│   ├── notifications/  → Email, WhatsApp
│   ├── legal/          → Documentos legales
│   ├── analytics/      → Métricas dashboard
│   ├── uploads/        → Subida de imágenes
│   ├── health/         → Health check
│   └── csrf/           → CSRF protection
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts              → 10 tours, 4 packages, 4 testimonials, 2 roles, 1 admin
│   └── migrations/
├── test/                    → E2E tests
├── uploads/                 → Archivos subidos (static)
├── docs/                    → Documentación backend
├── Dockerfile               → Multi-stage build
├── nest-cli.json
├── tsconfig.json
├── eslint.config.mjs
├── jest.config.ts / jest-e2e.json
└── .env / .env.example
```

---

## API

- **Base URL**: `http://localhost:3000/api/v1` (dev)
- **Swagger**: `http://localhost:3000/api/v1/docs` (solo disponible en desarrollo)
- **Autenticación**: JWT en httpOnly cookie + CSRF token
- **CSRF**: Token obtenido de `GET /api/auth/csrf` al iniciar la app (en `APP_INITIALIZER`)
- **Endpoints públicos**: tours publicados, articles publicados, experiences publicados, packages, categories, destinations, health, auth (login/register/csrf)
- **Endpoints admin**: requieren rol ADMIN (guard)
- **Endpoints cliente**: requieren auth (authGuard), ej: `/bookings/me`, `/customers/me`
- **Global guards**: ThrottlerGuard (rate limiting), JwtAuthGuard (protección global), RolesGuard (role-based)

### Modelos principales (Prisma)

- **Role**: id, name (unique), users[]
- **User**: id, email (unique), password (hash), roleId → Role, createdAt
- **Customer**: id, name, email (unique), nationality, passport, phone, preferences, createdAt, bookings[], acceptances[], invoices[]
- **Tour**: slug (unique), code (unique), title, subtitle, shortDescription, description, durationHours, durationDays, difficulty (Easy/Moderate/Challenging), groupType (Shared/Private), serviceType (HalfDay/FullDay/MultiDay), featured, active, categoryId → Category, providerId → Provider, packages[], bookings[], experiences[], schedules[], itineraryDays[], destinations[], includes[], excludes[], faqs[], recommendations[], requirements[], prices[], images[], seo?, metadata?, reviews[], testimonials[], createdAt, updatedAt
- **Booking**: id, customerId → Customer, tourId? → Tour, packageId? → Package, travelers, status (PENDIENTE/CONFIRMADA/COMPLETADA/CANCELADA), date, total, unitPrice, customerName, customerEmail, customerPhone, startDate, notes, canceledAt, payment?, operation?, invoice?
- **Payment**: id, bookingId (unique) → Booking, amount, currency, method, status (PENDIENTE/...), createdAt
- **Operation**: id, bookingId (unique) → Booking, guideId? → Guide, transport, pickupTime, status, createdAt
- **Invoice**: id, bookingId (unique) → Booking, customerId → Customer, amount, currency, status (GENERADA/...), createdAt
- **Article**: slug (unique), title, excerpt, content, coverImage, imageAlt, category?, tags?, status (DRAFT/PUBLISHED/ARCHIVED), publishedAt, createdAt, updatedAt
- **Experience**: slug (unique), title, summary, content, coverImage, imageAlt, location?, duration?, tourId? → Tour, status (DRAFT/PUBLISHED/ARCHIVED), featured, sortOrder, publishedAt, createdAt, updatedAt
- **Package**: id, name, description, price, featured, durationDays, discount, imageUrl, included, excluded, tours[] (many-to-many), bookings[], createdAt
- **Guide**: id, name, languages, credential, availability, rating, operations[]
- **Provider**: id, name, type, contact, contract?, commission?, services?, tours[]
- **Category**: id, slug (unique), name, description?, tours[]
- **Destination**: id, slug (unique), name, description, tours (TourDestination[])
- **Testimonial**: id, name, role?, content, email?, avatar?, rating (Int), tags (String[]), featured, sortOrder, active, tourId? → Tour, consent? (Json), createdAt, updatedAt
- **Review**: id, rating (1-5), comment, name?, country?, createdAt, tourId → Tour
- **TourSchedule**: id, departure, pickupStart, arrival, language?, available, tourId → Tour
- **TourPrice**: id, name, currency, adult (Decimal), child? (Decimal), private? (Decimal), tourId → Tour
- **TourImage**: id, url, alt, featured, sortOrder, source?, tourId → Tour
- **TourInclude**: id, title, description?, tourId → Tour
- **TourExclude**: id, title, description?, tourId → Tour
- **TourFaq**: id, question, answer, sortOrder, tourId → Tour
- **TourRecommendation**: id, title, description, tourId → Tour
- **TourRequirement**: id, requirement, tourId → Tour
- **TourSeo**: id, title, description, keywords (Json?), canonical?, tourId (unique) → Tour
- **TourMetadata**: id, provider?, sourceUrl?, lastUpdated?, tourId (unique) → Tour
- **ItineraryDay**: id, day, title, tourId → Tour, activities (ItineraryActivity[])
- **ItineraryActivity**: id, itineraryDayId → ItineraryDay, sortOrder, time?, title, description, duration
- **TourDestination**: id, tourId → Tour, destinationId → Destination, sortOrder
- **Document**: id, title, version, type?, acceptances (DocumentAcceptance[])
- **DocumentAcceptance**: id, documentId → Document, customerId → Customer, ip, version, acceptedAt
- **Notification**: id, channel, recipient, message, status, sentAt
- **Log**: id, action, details?, createdAt

---

## Convenciones de código

### General
- **Sin comentarios en código** — el código debe ser autoexplicativo
- Nombres en inglés para código, contenido en español
- Commits convencionales (`feat:`, `fix:`, `refactor:`, `style:`, `chore:`)
- No forzar push, no ammend commits, no commits vacíos

### Frontend
- Standalone components (sin NgModules)
- URLs relativas para assets y API
- Servicios con HttpClient, tipados con interfaces de `shared/`
- Admin dashboards siguen el estilo Tours como referencia visual
- Uso de `@theme {}` en CSS para design tokens (Tailwind v4)
- SSR con `@angular/ssr` entry point en `server.ts` (proxy de API incluido)
- Dev proxy configurado en `proxy.conf.json` (`/api` → `localhost:3000/api/v1`)
- Interceptors: `auth.interceptor` (JWT) y `csrf.interceptor` (CSRF)
- CSRF token se obtiene al inicio via `APP_INITIALIZER`

### Backend
- Módulos NestJS por dominio con CRUD estándar
- Validación con `class-validator` + `class-transformer` (whitelist: true, forbidNonWhitelisted: true)
- PrismaService como provider global
- Rutas versionadas (`/api/v1/...`)
- Admin endpoints separados bajo `/admin/` dentro de cada módulo
  - **Nota:** El patrón no es uniforme — Tours usa `/tours/admin` (subpath), Articles y Experiences usan `/admin/articles` y `/admin/experiences` (prefijo separado), Packages no tiene ruta admin separada
- Sentry activado en producción para error tracking + profiling
- Helmet CSP configurado, compression, cookie-parser
- Graceful shutdown en señales SIGTERM/SIGINT

---

## Admin Dashboards (estilo unificado)

Todos los dashboards admin (`/admin/*`) siguen el diseño de `tours-dashboard.html`:

1. **Hero**: gradiente `primary → primary-dark` con dots pattern, título, botón "Nuevo"
2. **Stat cards** (cuando aplica): panel blanco con icono, valor, etiqueta, opcional filtro
3. **Barra de búsqueda**: input con icono lupa, botón limpiar (X), contador "Mostrando X de Y"
4. **Tabla**: `rounded-2xl border border-slate-200 bg-white shadow-sm`, cabecera slate-50
5. **Botones de acción tabla**: `rounded-lg border border-slate-200 bg-white`
6. **Formulario modal/inline**: secciones `rounded-xl border border-slate-100 bg-slate-50/50 p-5`
7. **Paginación**: `rounded-lg border border-slate-200 hover:border-primary/30`

Componentes imports requeridos en dashboards admin: `CommonModule`, `FormsModule`, `RouterLink`.

Dashboards implementados (12):

| Ruta | Componente | Módulo Backend |
|------|-----------|----------------|
| `/admin` | AdminDashboard | analytics |
| `/admin/tours` | ToursDashboard | tours |
| `/admin/blog` | ArticlesDashboard | articles |
| `/admin/experiencias` | ExperiencesDashboard | experiences |
| `/admin/paquetes` | PackagesDashboard | packages |
| `/admin/reservas` | BookingsDashboard | bookings |
| `/admin/clientes` | CustomersDashboard | customers |
| `/admin/proveedores` | ProvidersDashboard | providers |
| `/admin/guias` | GuidesDashboard | guides |
| `/admin/testimonios` | TestimonialsDashboard | testimonials |
| `/admin/operaciones` | OperationsDashboard | operations |
| `/admin/pagos` | PaymentsDashboard | payments |
| `/admin/facturacion` | BillingDashboard | billing |

---

## Variables de entorno

Basado en `.env.example`:

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `POSTGRES_USER` | Usuario de PostgreSQL | Sí |
| `POSTGRES_PASSWORD` | Password de PostgreSQL (≥8 chars) | Sí |
| `PGPASSWORD` | Alias de POSTGRES_PASSWORD | Sí |
| `JWT_SECRET` | Secreto JWT (≥16 chars) | Sí |
| `JWT_EXPIRES_IN` | Expiración JWT (ej: `1h`) | No |
| `CSRF_SECRET` | Secreto CSRF (≥16 chars) | Sí |
| `CSRF_SKIP_PATHS` | Rutas sin CSRF (default: `auth/csrf,auth/login,auth/register,health`) | No |
| `CORS_ORIGIN` | Orígenes CORS separados por coma | Sí |
| `WHATSAPP_PHONE` | Número WhatsApp business (10-15 dígitos) | No |
| `SENTRY_DSN` | DSN de Sentry (opcional, vacío = desactivado) | No |
| `API_URL` | URL del backend para SSR (default: `http://backend:3000`) | Sí (prod) |
| `GRAFANA_PASSWORD` | Password admin de Grafana | No |
| `CLOUDFRONT_DISTRIBUTION_ID` | ID de distribución CloudFront | No |
| `RETENTION_DAYS` | Días de retención (default: 7) | No |
| `SLACK_WEBHOOK_URL` | Webhook Slack para notificaciones de deploy | No |

---

## Infraestructura

### Docker Compose

| Archivo | Propósito |
|---------|-----------|
| `docker-compose.yml` | Base: postgres (PostGIS), pgbackup, backend, frontend |
| `docker-compose.prod.yml` | Producción: añade nginx + certbot-renew |
| `docker-compose.staging.yml` | Staging: override env vars |
| `docker-compose.monitoring.yml` | Monitoreo: Loki + Promtail + Grafana |

### Servicios en producción

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| nginx | 80/443 | Reverse proxy con SSL, HSTS, CSP, rate limiting, cache |
| frontend | 4000 | SSR con Angular (Node Express) |
| backend | 3000 | API NestJS |
| postgres | 5432 | PostGIS |
| pgbackup | - | Backup automático diario |
| certbot-renew | - | Renovación automática SSL |
| loki | 3100 | Agregación de logs |
| promtail | 9080 | Recolección de logs |
| grafana | 3001 | Dashboards de monitoreo |

### CDN
- CloudFront delante de nginx
- Cache de chunks JS/CSS: 1 año (immutable)
- Cache de imágenes: 30 días
- Config en `cloudfront-config.json`

### CI/CD (GitHub Actions)
- **Workflow**: `.github/workflows/ci.yml`
- **Jobs**:
  1. `test-backend`: lint, typecheck, prisma generate/migrate, test, build
  2. `test-frontend`: lint, build, test
  3. `docker-build`: push a DockerHub (backend, nginx, frontend)
  4. `deploy`: SSH al servidor, pull images, ejecuta `scripts/deploy.sh`
- **Requerido**: ramas main/develop para push, PR a main

### Deploy Script (`scripts/deploy.sh`)
- Soporta `staging` y `production`
- Modo dry-run (`--dry-run`)
- Validaciones pre-deploy: docker, docker compose, .env, CORS_ORIGIN, WHATSAPP_PHONE, JWT_SECRET, POSTGRES_PASSWORD
- Rollback automático si health checks fallan
- Slack notifications
- CloudFront cache invalidation opcional

### Monitoreo
- **Loki**: agregación de logs centralizada
- **Promtail**: recolecta logs de contenedores Docker
- **Grafana**: dashboards con Loki como datasource (puerto 3001, localhost-only)
- Datasources y dashboards pre-configurados en `grafana/`

---

## Cómo comenzar a trabajar

```bash
# Instalar dependencias (cada proyecto por separado)
cd Frontend && pnpm install && cd ..
cd backend && pnpm install && cd ..

# Iniciar BD
docker compose up -d postgres

# Migrar y seed
cd backend
pnpm prisma migrate dev
pnpm prisma db seed
cd ..

# Backend (terminal 1) — desde Frontend/ o backend/
pnpm --prefix Frontend backend:start

# Frontend (terminal 2)
pnpm --prefix Frontend frontend:start
```

### Scripts disponibles

**Frontend** (`Frontend/package.json`):

| Comando | Descripción |
|---------|-------------|
| `pnpm start` | Alias de `frontend:start` |
| `pnpm frontend:start` | Dev server (puerto 4200) |
| `pnpm frontend:build` | Build producción |
| `pnpm frontend:watch` | Build watch development |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm format` / `pnpm format:fix` | Prettier |
| `pnpm frontend:test` | Tests (Vitest) |
| `pnpm serve:ssr:kusiqumir_page` | SSR production server (puerto 4000) |

**Backend** (`backend/package.json`):

| Comando | Descripción |
|---------|-------------|
| `pnpm start` | `nest start` |
| `pnpm start:dev` | Dev watch mode (puerto 3000) |
| `pnpm start:prod` | Migrate deploy + start production |
| `pnpm build` | `nest build` |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm format` / `pnpm format:fix` | Prettier |
| `pnpm prisma:generate` | Generar Prisma Client |
| `pnpm db:migrate` | `prisma migrate dev --name init --skip-seed` |
| `pnpm db:reset` | `prisma migrate reset --force` |
| `pnpm db:seed` | `prisma db seed` |
| `pnpm test` | Jest unit tests |
| `pnpm test:e2e` | Jest E2E tests |
| `pnpm test:all` | Unit + E2E |

**Monorepo desde Frontend/**

| Comando | Descripción |
|---------|-------------|
| `pnpm backend:start` | Inicia backend |
| `pnpm backend:build` | Build backend |
| `pnpm backend:prisma:generate` | Generate Prisma |
| `pnpm backend:prisma:studio` | Abre Prisma Studio |
| `pnpm backend:prisma:seed` | Ejecuta seed |

### Docker Compose

```bash
# Desarrollo (solo BD)
docker compose up -d postgres

# Producción (full stack + nginx + SSL)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Staging
docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d --build

# Monitoreo
docker compose -f docker-compose.monitoring.yml up -d

# Deploy completo (producción)
bash scripts/deploy.sh production
bash scripts/deploy.sh production --dry-run  # Simular sin cambios

# Deploy staging
bash scripts/deploy.sh staging
```

---

## URLs importantes

| Servicio | URL |
|----------|-----|
| Frontend (dev) | http://localhost:4200 |
| Frontend (prod/SSR) | http://localhost:4000 |
| Backend API | http://localhost:3000/api/v1 |
| Swagger Docs | http://localhost:3000/api/v1/docs |
| Prisma Studio | `cd backend && pnpm prisma studio` |
| PostgreSQL | `localhost:5432`, DB: `kusiqumir` |
| Grafana (local) | http://localhost:3001 (user: admin) |

---

## Servicios / APIs de terceros integrados

| Servicio | Propósito |
|----------|-----------|
| Sentry | Error tracking y profiling (frontend + backend) |
| Slack Webhook | Notificaciones de deploy |
| DockerHub | Registry de imágenes Docker |
| CloudFront (AWS) | CDN |
| WhatsApp Business API | Comunicación con clientes |
| Google Fonts | Inter + Fjalla One |
| cdnjs (Cloudflare) | Librerías JS externas (CSP) |

---

## Skills necesarias para trabajar en el proyecto

### Frontend
- **Angular 22**: standalone components, routing con lazy loading, SSR (`@angular/ssr`), service workers
- **Tailwind CSS v4**: utility-first, `@theme` para design tokens, `@plugin` para plugins, sin `tailwind.config.js`
- **PostCSS**: procesamiento CSS con `@tailwindcss/postcss`
- **TypeScript ~6.0**: tipado avanzado, interfaces para modelos de datos
- **Angular CDK**: componentes headless

### Backend
- **NestJS 10**: módulos, guards globales, pipes, interceptors, filters, DTOs con validación
- **Prisma 5**: schema design, migrations, seed, queries relacionales, Prisma Studio
- **PostGIS**: base de datos con extensión geoespacial
- **JWT + Passport**: autenticación con httpOnly cookies
- **CSRF**: protección con tokens dobles (csrf-csrf)
- **Helmet**: seguridad HTTP (CSP, HSTS, frameguard, etc.)

### DevOps / Infraestructura
- **Docker + Docker Compose**: multi-stage builds, healthchecks, redes, volúmenes
- **Nginx**: reverse proxy, SSL termination, rate limiting, caching, CSP headers
- **GitHub Actions**: CI/CD pipelines multi-job con tests, builds, deploy
- **AWS CloudFront**: CDN con cache behaviors
- **Grafana + Loki + Promtail**: monitoreo y logging
- **Certbot / Let's Encrypt**: renovación automática SSL
- **PostgreSQL / PostGIS**: administración y backups

### Testing
- **Vitest** (frontend): unit tests
- **Jest + ts-jest** (backend): unit tests + E2E con Supertest
- **Playwright** (e2e opcional)

### Herramientas
- **pnpm 9.15**: package manager estricto (frozen-lockfile, workspace)
- **ESLint 10**: linting con `typescript-eslint`
- **Prettier**: formateo consistente
