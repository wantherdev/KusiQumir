# Copilot Instructions

Este documento define reglas y convenciones para el desarrollo asistido por Copilot.

## Estilo de código

- Usar TypeScript estricto y validación con `class-validator`.
- Preferir servicios con inyección de dependencias en NestJS.
- Mantener módulos independientes y coherentes.
- Usar DTOs claros y `@ApiTags` para documentación Swagger.
- No usar lógica de negocio en controladores; debe residir en servicios.

## Backend

- Cada módulo debe exportar `Controller`, `Service` y `Module`.
- Usar `PrismaService` global para acceso a la base de datos.
- Manejar errores con excepciones de NestJS (`BadRequestException`, `UnauthorizedException`, etc.).
- Usar JWT para rutas protegidas y `JwtAuthGuard`.
- Registrar `ValidationPipe` global en `main.ts`.

## Datos y persistencia

- El modelo de datos debe mapearse con Prisma.
- `seed.ts` debe ser idempotente y no asumir claves únicas inexistentes.
- Las relaciones deben respetar las llaves foráneas.

## Documentación

- Mantener actualizados `docs/BACKEND_ARCHITECTURE.md`, `docs/DATABASE_SCHEMA.md`, `docs/API_ROUTES.md`.
- Agregar nuevos endpoints a `docs/API_ROUTES.md` conforme se creen.
- Documentar la evolución del esquema en `docs/BACKEND_ARCHITECTURE.md`.

## Git

- Hacer commits pequeños y descriptivos.
- Incluir cambios de documentación y código en el mismo commit cuando estén relacionados.
