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
| pnpm | 9.15 | Package manager (usar siempre, nunca npm) |
| Angular | 22.0 | Standalone components, SSR habilitado |
| Tailwind CSS | 4.1.12 | CSS-first (`@import 'tailwindcss'`), **no hay** `tailwind.config.js` |
| NestJS | 10 | Backend framework |
| Prisma | 5 | ORM, PostgreSQL |
| PostgreSQL | 18 | Base de datos (`kusiqumir`) |
| TypeScript | ~6.0 (frontend), ~5.7 (backend) |

## Frameworks y dependencias clave

**Frontend**: `@angular/forms`, `@angular/router`, `@angular/ssr`, `@angular/service-worker`, `@angular/localize`, `@angular/platform-server`, `@sentry/angular`, `express`, `http-proxy-middleware`, `@tailwindcss/postcss`, `@tailwindcss/typography`, `rxjs`, `tslib`, `postcss`, `prettier`, `vitest`, `jsdom`, `playwright-core`.

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

### Estilo general

- **Inputs**: `rounded-xl` o `rounded-2xl`, focus ring `primary/40`
- **Botones primarios admin**: `rounded-xl bg-white text-primary shadow-lg hover:scale-[1.02]`
- **Botones de acción tabla**: `rounded-lg border border-slate-200 bg-white`
- **Paginación**: `rounded-lg border border-slate-200 hover:border-primary/30`
- **Formularios admin**: secciones `rounded-xl border border-slate-100 bg-slate-50/50 p-5`
- **Headers admin (hero)**: gradiente `primary → primary-dark` con dots pattern
- **Stat cards**: panel con icono, contador grande, etiqueta

---

## Arquitectura

### Frontend (`Frontend/`)

```
src/app/
├── pages/
│   ├── home/          → Landing page
│   ├── destinos/      → Tours listing + tour detail
│   ├── experiencias/  → Experiences listing + detail
│   ├── blog/          → Articles listing + article detail
│   ├── paquetes/      → Packages listing
│   ├── reservar/      → Booking flow
│   ├── contacto/      → Contact form
│   ├── nosotros/      → About us
│   ├── auth/          → Login / Register
│   ├── cliente/       → Mis reservas / Mi perfil
│   ├── not-found/     → Página 404
│   ├── admin/         → Admin dashboard (12 dashboards)
│   │   ├── dashboard/ → 11 sub-dashboards individuales
│   │   │   ├── tours-dashboard.ts/html
│   │   │   ├── articles-dashboard.ts/html
│   │   │   ├── experiences-dashboard.ts/html
│   │   │   ├── bookings-dashboard.ts/html
│   │   │   ├── customers-dashboard.ts
│   │   │   ├── providers-dashboard.ts
│   │   │   ├── guides-dashboard.ts
│   │   │   ├── operations-dashboard.ts
│   │   │   ├── payments-dashboard.ts
│   │   │   ├── billing-dashboard.ts
│   │   │   └── packages-dashboard/  (directorio con .ts/.html)
│   │   ├── dashboard-page/ → admin-dashboard.ts
│   │   └── layout/         → admin-layout.ts
│   └── legal/         → Términos, privacidad, cancelaciones, etc.
├── services/          → Angular services (HttpClient)
├── shared/            → Modelos, pipes, utilidades
├── components/        → navbar, footer, shared components
├── guards/            → auth.guard, admin.guard
├── interceptors/      → HTTP interceptors
├── tokens/            → Injection tokens
├── data/              → Static/mock data
├── resolvers/         → Data resolvers
styles.css             → Estilos globales + design tokens
pages/page.css         → Estilos de páginas
```

### Backend (`backend/`)

```
src/
├── main.ts                   → Entry point (puerto 3000)
├── app.module.ts             → Módulo raíz
├── prisma/prisma.service.ts  → Prisma singleton
├── common/                   → DTOs, filters, interceptors
└── modules/
    ├── auth/           → JWT, login, register, guards
    ├── tours/          → CRUD tours
    ├── bookings/       → Reservas + estados
    ├── customers/      → Clientes
    ├── providers/      → Proveedores
    ├── guides/         → Guías turísticos
    ├── operations/     → Operaciones logísticas
    ├── packages/       → Paquetes turísticos
    ├── experiences/    → Experiencias
    ├── articles/       → Blog
    ├── categories/     → Categorías de tours
    ├── destinations/   → Destinos
    ├── payments/       → Pagos
    ├── billing/        → Facturación
    ├── notifications/  → Email, WhatsApp
    ├── legal/          → Documentos legales
    ├── analytics/      → Métricas dashboard
    ├── uploads/        → Subida de imágenes
    ├── health/         → Health check
    └── csrf/           → CSRF protection
```

---

## API

- **Base URL**: `http://localhost:3000/api/v1` (dev)
- **Swagger**: `http://localhost:3000/api/v1/docs`
- **Autenticación**: JWT en httpOnly cookie + CSRF token
- **Endpoints públicos**: tours publicados, articles publicados, experiences publicados, packages, categories, destinations, health, auth (login/register/csrf)
- **Endpoints admin**: requieren rol ADMIN (guard)
- **Endpoints cliente**: requieren auth (authGuard), ej: `/bookings/me`, `/customers/me`

### Modelos principales (Prisma)

- **Tour**: slug (unique), code (unique), title, difficulty (Easy/Moderate/Challenging), groupType (Shared/Private), serviceType (HalfDay/FullDay/MultiDay), active, featured
- **Booking**: customerId, tourId?, packageId?, travelers, status (PENDIENTE/CONFIRMADA/COMPLETADA/CANCELADA), total, date
- **Customer**: name, email (unique), phone, nationality, passport
- **Article**: slug (unique), title, content, status (DRAFT/PUBLISHED/ARCHIVED), category, tags
- **Experience**: slug (unique), title, summary, content, status (DRAFT/PUBLISHED/ARCHIVED), featured, sortOrder, tourId?
- **Package**: name, description, price, featured, durationDays, discount, tours (many-to-many)
- **Guide**: name, languages, credential, availability, rating
- **Provider**: name, type, contact, contract, commission
- **User**: email (unique), password (hash), roleId → Role
- **Payment**: bookingId (unique), amount, method, status
- **Operation**: bookingId (unique), guideId?, transport, pickupTime, status
- **Invoice**: bookingId (unique), customerId, amount, status
- **Category**: slug (unique), name
- **Destination**: slug (unique), name
- **Review**: rating (1-5), comment, name?, country?, tourId
- **TourSchedule**: departure, pickupStart, arrival, language, available
- **TourPrice**: name, currency, adult, child?, private?
- **TourImage**: url, alt, featured, sortOrder
- **Notification**: channel, recipient, message, status
- **Document**: title, version, type
- **DocumentAcceptance**: documentId, customerId, ip, version
- **Role**: name (unique), users (User[])
- **Log**: action, details?, createdAt
- **ItineraryDay**: day, title, tourId, activities (ItineraryActivity[])
- **ItineraryActivity**: sortOrder, time?, title, description, duration
- **TourFaq**: question, answer, sortOrder
- **TourInclude**: title, description?
- **TourExclude**: title, description?
- **TourRecommendation**: title, description
- **TourRequirement**: requirement
- **TourSeo**: title, description, keywords?, canonical?
- **TourMetadata**: provider?, sourceUrl?, lastUpdated?
- **TourDestination**: tourId, destinationId, sortOrder

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

### Backend
- Módulos NestJS por dominio con CRUD estándar
- Validación con `class-validator` + `class-transformer`
- PrismaService como provider global
- Rutas versionadas (`/api/v1/...`)
- Admin endpoints separados bajo `/admin/` dentro de cada módulo
  - **Nota:** El patrón no es uniforme — Tours usa `/tours/admin` (subpath), Articles y Experiences usan `/admin/articles` y `/admin/experiences` (prefijo separado), Packages no tiene ruta admin separada

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

## URLs importantes

| Servicio | URL |
|----------|-----|
| Frontend (dev) | http://localhost:4200 |
| Backend API | http://localhost:3000/api/v1 |
| Swagger Docs | http://localhost:3000/api/v1/docs |
| Prisma Studio | `cd backend && pnpm prisma studio` |
| PostgreSQL | `localhost:5432`, DB: `kusiqumir` |
