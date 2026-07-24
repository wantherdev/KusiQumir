# Kusi Q'umir — Agencia de Viajes Digital

Plataforma web completa para una agencia de viajes peruana con gestión de tours, reservas, blog, experiencias y panel administrativo.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | **Angular 22** + SSR + Service Worker (PWA) |
| Estilos | **Tailwind CSS v4** + `@tailwindcss/typography` |
| Backend | **NestJS 10** + Express |
| ORM | **Prisma 5** + PostgreSQL 17 (PostGIS) |
| Auth | JWT (httpOnly cookie) + CSRF + Passport |
| API Docs | Swagger en `/api/v1/docs` |
| Monitoreo | Sentry + Grafana / Loki / Promtail |
| Cache | `@nestjs/cache-manager` |
| Logs | `pino` + `nestjs-pino` |
| Contenerización | Docker Compose (postgres, backend, frontend, nginx) |
| CDN | AWS CloudFront |
| CI/CD | GitHub Actions |

## Requisitos

- Node.js ≥ 22
- pnpm 9.15
- Docker & Docker Compose (opcional, para PostgreSQL)

## Inicio rápido

```bash
# 1. Clonar e instalar dependencias
pnpm install
cd frontend
pnpm install
cd ../backend
pnpm install
cd ..

# 2. Iniciar PostgreSQL con Docker
docker compose up -d postgres

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con los valores correctos

# 4. Migrar BD y seed
cd backend
pnpm prisma migrate dev
pnpm prisma db seed
cd ..

# 5. Iniciar backend (http://localhost:3000)
pnpm backend:start

# 6. En otra terminal, iniciar frontend (http://localhost:4200)
pnpm frontend:start
```

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm frontend:start` | Servidor dev Angular en `:4200` |
| `pnpm frontend:build` | Build producción |
| `pnpm backend:start` | Servidor dev NestJS en `:3000` |
| `pnpm backend:prisma:generate` | Regenerar cliente Prisma |
| `pnpm backend:prisma:studio` | Abrir Prisma Studio |
| `pnpm backend:prisma:seed` | Sembrar BD con datos de ejemplo |
| `pnpm serve:ssr:kusiqumir_page` | Servir build SSR |

## Estructura

```
Frontend/         → Aplicación Angular 22 (cliente)
  src/app/
    pages/        → Páginas: home, destinos, blog, admin/*, etc.
    services/     → API calls
    shared/       → Modelos, pipes, utilidades
    components/   → Componentes compartidos (navbar, footer, etc.)
backend/          → API NestJS
  src/modules/    → Módulos por dominio: auth, tours, bookings, etc.
  prisma/         → Schema + seed + migraciones
nginx/            → Reverse proxy para producción
grafana/          → Monitoreo
.github/          → CI/CD
```

## Diseño y marca

- **Primary**: `#00abaa` — Teal
- **Primary-dark**: `#00908f`
- **Secondary**: `#647bab` — Azul acero
- **Tertiary**: `#0f172a` — Slate oscuro
- **Tipografía**: Inter (sans), Fjalla One (display)
- **Framework CSS**: Tailwind v4, sin `tailwind.config.js` (configuración CSS-first con `@theme`)
- **Estilo**: Bordes redondeados grandes (`rounded-[2rem]`), sombras suaves, gradientes teal, glass effect

## Licencia

Uso interno — Kusi Q'umir E.I.R.L.
