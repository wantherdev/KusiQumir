# Kusi Q'umir Travel

Plataforma web de agencia de viajes en Cusco y Perú, construida con Angular 20, NestJS, Prisma y PostgreSQL.

## Requisitos

- Node.js 20+
- pnpm
- PostgreSQL en ejecución

## Variables de entorno

Crea un archivo .env en la raíz del backend con:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kusiqumir
PORT=3000
```

## Instalación

```bash
cd /home/k3rnyx/Documents/Proyect/pages/kusiqumir_page
pnpm install
cd backend
pnpm install
pnpm prisma generate
pnpm prisma migrate dev --name init
pnpm prisma db seed
```

## Ejecución

Frontend (desde la raíz del proyecto):

```bash
cd /home/k3rnyx/Documents/Proyect/pages/kusiqumir_page
pnpm frontend:start
```

Backend (desde la raíz del proyecto):

```bash
cd /home/k3rnyx/Documents/Proyect/pages/kusiqumir_page
pnpm backend:start
```

También puedes ejecutar comandos específicos del backend desde su carpeta:

```bash
cd /home/k3rnyx/Documents/Proyect/pages/kusiqumir_page/backend
pnpm start:dev
```

## Estado actual

- Catálogo público de destinos y paquetes
- Páginas de inicio, paquetes y blog con contenido inicial
- API de destinos, paquetes y reservas
- Seed con datos originales de viajes en Cusco y Perú
