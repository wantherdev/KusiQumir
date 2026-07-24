# Kusi Q'umir Travel — Frontend

Plataforma web de agencia de viajes en Cusco y Perú, construida con Angular 22, NestJS, Prisma y PostgreSQL.

## Requisitos

- Node.js 22+
- pnpm 9.15
- PostgreSQL 17+ en ejecución (o Docker)

## Variables de entorno

Backend (`.env` en `backend/`):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kusiqumir
JWT_SECRET=your-secret-key-min-16-chars
CSRF_SECRET=your-csrf-secret-min-16-chars
CORS_ORIGIN=http://localhost:4200
PORT=3000
```

## Instalación

```bash
# Instalar dependencias
cd Frontend && pnpm install
cd ../backend && pnpm install
cd ..

# Iniciar BD con Docker
docker compose up -d postgres

# Migrar y seed
cd backend
pnpm prisma generate
pnpm prisma migrate dev --name init
pnpm prisma db seed
cd ..
```

## Ejecución

```bash
# Terminal 1 — Backend (http://localhost:3000)
pnpm --prefix Frontend backend:start

# Terminal 2 — Frontend (http://localhost:4200)
pnpm --prefix Frontend frontend:start
```

O desde sus respectivas carpetas:

```bash
cd backend && pnpm start:dev
cd Frontend && pnpm start
```

## Estado actual

- Catálogo público de destinos, tours, paquetes, experiencias y blog
- Páginas legales (términos, privacidad, cancelaciones, libro de reclamaciones, contrato)
- Panel admin con 12 dashboards (tours, blog, experiencias, paquetes, reservas, clientes, proveedores, guías, testimonios, operaciones, pagos, facturación)
- Autenticación JWT + CSRF
- SSR con Angular 22
- API NestJS con 20+ módulos
- Seed con datos originales de viajes en Cusco y Perú