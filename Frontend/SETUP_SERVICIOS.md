# Guía para Levantar los Servicios

## Requisitos Previos

1. **Node.js 22+** y **pnpm 9.15** instalados
2. **Docker & Docker Compose** (para PostgreSQL)
3. Puerto `5432` libre

---

## Orden Correcto de Arranque

### Paso 1: Levantar la Base de Datos (PostgreSQL)

```bash
docker compose up -d postgres
```

Verifica que está disponible:

```bash
docker compose exec postgres psql -U postgres -d kusiqumir -c "SELECT 1"
```

---

### Paso 2: Preparar el Backend

```bash
cd backend
pnpm install
pnpm prisma:generate
pnpm db:migrate
pnpm db:seed    # Opcional — carga datos iniciales
cd ..
```

---

### Paso 3: Levantar Backend (NestJS)

```bash
# Desarrollo (con hot reload)
cd backend && pnpm start:dev

# El backend estará en: http://localhost:3000
```

---

### Paso 4: Preparar el Frontend

```bash
cd Frontend
pnpm install
cd ..
```

---

### Paso 5: Levantar Frontend (Angular)

```bash
# Desarrollo (con hot reload)
cd Frontend && pnpm start

# El frontend estará en: http://localhost:4200
```

---

## Acceso a Servicios

| Servicio | URL | Puerto |
|----------|-----|--------|
| Frontend (Angular dev) | http://localhost:4200 | 4200 |
| Backend (NestJS) | http://localhost:3000 | 3000 |
| API Docs (Swagger) | http://localhost:3000/api/v1/docs | 3000 |
| Base de Datos | localhost:5432 | 5432 |
| Prisma Studio | `cd backend && pnpm prisma studio` | 5555 |

---

## Dashboard de Administración

Una vez ambos servicios están corriendo:

1. Ve a **http://localhost:4200/admin**
2. Login con credenciales del seed (`admin@example.com` / `password123`)
3. La autenticación usa **httpOnly cookie JWT + CSRF** (no Bearer token manual)

---

## Solución de Problemas

### Error: "ENOENT: no such file or directory"

```bash
cd backend && pnpm prisma:generate
```

### Error: "connect ECONNREFUSED 127.0.0.1:5432"

```bash
# PostgreSQL no está corriendo
docker compose up -d postgres
```

### Error: "Unknown column in field list"

```bash
cd backend && pnpm db:migrate
```

### Error: "Cannot find module"

```bash
pnpm install && cd Frontend && pnpm install && cd ../backend && pnpm install
```

---

## Comandos Útiles

```bash
# Ver todos los scripts disponibles
pnpm run

# Limpiar y reinstalar
rm -rf node_modules pnpm-lock.yaml Frontend/node_modules backend/node_modules
pnpm install && cd Frontend && pnpm install && cd ../backend && pnpm install && cd ..

# Ver estado de la base de datos
cd backend && pnpm prisma studio

# Ejecutar tests
pnpm --prefix Frontend frontend:test     # Frontend (Vitest)
pnpm --prefix backend test               # Backend (Jest)
```