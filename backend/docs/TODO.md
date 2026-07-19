# TODO - Backend Architecture Roadmap

## 1. Fase 1 - Core

- [x] Inicializar proyecto NestJS con `src/main.ts`, `src/app.module.ts` y Swagger.
- [x] Crear `docs/BACKEND_ARCHITECTURE.md` con la visión del proyecto.
- [ ] Crear módulo `auth` con login, salud y estructura básica.
- [ ] Crear módulo `customers` con endpoints CRUD básicos.
- [ ] Crear módulo `tours` con catálogo básico y CRUD.
- [ ] Crear módulo `bookings` con flujo de reserva básico.
- [ ] Crear módulo `payments` con registro de pagos y estado.
- [ ] Integrar Prisma y generar el esquema de datos inicial.
- [ ] Conectar módulos `auth`, `customers`, `tours`, `bookings` y `payments` a la base de datos.

## 2. Fase 2 - Operaciones

- [ ] Crear módulo `guides` con gestión de guías.
- [ ] Crear módulo `providers` con gestión de proveedores.
- [ ] Crear módulo `packages` con creación de paquetes turísticos.
- [ ] Crear módulo `operations` con asignaciones operativas.
- [ ] Implementar relaciones `Booking -> Guide`, `Booking -> Provider`, `Booking -> Package`.
- [ ] Añadir `availability` y `status` en tours, guías y operaciones.

## 3. Fase 3 - Automatización

- [ ] Crear módulo `notifications` para email, WhatsApp, SMS y push.
- [ ] Crear módulo `billing` para facturación electrónica y SUNAT.
- [ ] Crear módulo `legal` para documentos legales, aceptación y auditoría.
- [ ] Implementar registros (`logs`) y auditoría de acciones.
- [ ] Crear integraciones simuladas para WhatsApp y correo.

## 4. Fase 4 - Plataforma avanzada

- [ ] Definir el roadmap para marketplace turístico.
- [ ] Crear módulo `analytics` con métricas de ventas y conversión.
- [ ] Crear documentación de API `/docs` y rutas REST completas.
- [ ] Implementar soporte para aplicaciones móviles, guía y portal cliente.
- [ ] Agregar soporte de IA y recomendaciones como siguiente fase.

## 5. Infraestructura y DevOps

- [ ] Crear `docker-compose.yml` para desarrollo con PostgreSQL y Redis.
- [ ] Configurar `DATABASE_URL` y `.env` para entornos locales.
- [ ] Preparar `Prisma` para migraciones y seeds.
- [ ] Configurar CI/CD básico para build y lint.

## 6. Seguridad y calidad

- [ ] Implementar JWT y refresh tokens.
- [ ] Agregar validación de DTOs con `class-validator`.
- [ ] Implementar RBAC con roles: SUPER_ADMIN, ADMIN, OPERADOR, GUIA, CLIENTE, PROVEEDOR.
- [ ] Agregar rate limiting y HTTPS en producción.
- [ ] Diseñar backup y cifrado de documentos.

## 7. Documentación adicional

- [ ] Generar `docs/DATABASE_SCHEMA.md` con modelo PostgreSQL/Prisma.
- [ ] Generar `docs/API_ROUTES.md` con todos los endpoints REST.
- [ ] Generar `docs/COPILOT_INSTRUCTIONS.md` con reglas de generación de código.
- [ ] Mantener `docs/BACKEND_ARCHITECTURE.md` actualizado con cambios de diseño.
