# API Routes

Base path: `/api/v1`

## Auth

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/auth/csrf` | Público | - | Obtener token CSRF |
| `GET` | `/auth/health` | Público | - | Health check de auth |
| `POST` | `/auth/register` | Público | - | Registrar usuario (rate limit: 5/min) |
| `POST` | `/auth/login` | Público | - | Login, setea cookie httpOnly JWT (rate limit: 5/min) |
| `GET` | `/auth/me` | JWT | - | Obtener usuario actual |
| `POST` | `/auth/logout` | Público | - | Cerrar sesión (limpia cookie) |

## Health

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/health` | Público | - | Health check global (verifica conexión BD) |

## Tours

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/tours` | Público | - | Listar tours publicados (query: take, cursor, difficulty) |
| `GET` | `/tours/admin` | JWT | ADMIN | Listar todos los tours |
| `GET` | `/tours/slug/:slug` | Público | - | Obtener tour por slug |
| `GET` | `/tours/:id` | Público | - | Obtener tour por ID |
| `POST` | `/tours` | JWT | ADMIN | Crear tour |
| `POST` | `/tours/bulk` | JWT | ADMIN | Crear tours en masa |
| `PATCH` | `/tours/:id` | JWT | ADMIN | Actualizar tour |
| `DELETE` | `/tours/:id` | JWT | ADMIN | Eliminar tour |

## Bookings

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/bookings` | JWT | ADMIN | Listar reservas (query: take, cursor, status, customerId) |
| `GET` | `/bookings/me` | JWT | ADMIN, CLIENTE | Mis reservas |
| `POST` | `/bookings` | JWT | ADMIN, CLIENTE | Crear reserva |
| `GET` | `/bookings/:id` | JWT | ADMIN, CLIENTE | Obtener reserva por ID |
| `POST` | `/bookings/:id/cancel` | JWT | ADMIN, CLIENTE | Cancelar reserva |
| `PATCH` | `/bookings/:id/status` | JWT | ADMIN | Actualizar estado de reserva |

## Customers

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/customers` | JWT | ADMIN | Listar clientes |
| `POST` | `/customers` | JWT | ADMIN | Crear cliente |
| `GET` | `/customers/me` | JWT | ADMIN, CLIENTE | Mi perfil de cliente |
| `PATCH` | `/customers/me` | JWT | ADMIN, CLIENTE | Actualizar mi perfil |
| `GET` | `/customers/:id` | JWT | ADMIN | Obtener cliente por ID |

## Articles

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/articles` | Público | - | Listar artículos publicados (query: take, cursor, category) |
| `GET` | `/articles/:slug` | Público | - | Obtener artículo por slug |
| `GET` | `/articles/admin` | JWT | ADMIN | Listar todos los artículos |
| `GET` | `/articles/admin/:id` | JWT | ADMIN | Obtener artículo por ID |
| `POST` | `/articles/admin` | JWT | ADMIN | Crear artículo |
| `PATCH` | `/articles/admin/:id` | JWT | ADMIN | Actualizar artículo |
| `DELETE` | `/articles/admin/:id` | JWT | ADMIN | Eliminar artículo |

## Experiences

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/experiences` | Público | - | Listar experiencias publicadas (query: take, cursor, featured, location) |
| `GET` | `/experiences/:slug` | Público | - | Obtener experiencia por slug |
| `GET` | `/experiences/admin` | JWT | ADMIN | Listar todas las experiencias |
| `GET` | `/experiences/admin/:id` | JWT | ADMIN | Obtener experiencia por ID |
| `POST` | `/experiences/admin` | JWT | ADMIN | Crear experiencia |
| `PATCH` | `/experiences/admin/:id` | JWT | ADMIN | Actualizar experiencia |
| `DELETE` | `/experiences/admin/:id` | JWT | ADMIN | Eliminar experiencia |

## Packages

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/packages` | Público | - | Listar paquetes turísticos |
| `GET` | `/packages/:id` | Público | - | Obtener paquete por ID |
| `GET` | `/packages/admin` | JWT | ADMIN | Listar paquetes (admin) |
| `POST` | `/packages/admin` | JWT | ADMIN | Crear paquete |
| `PATCH` | `/packages/admin/:id` | JWT | ADMIN | Actualizar paquete |
| `DELETE` | `/packages/admin/:id` | JWT | ADMIN | Eliminar paquete |

## Categories

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/categories` | Público | - | Listar categorías |
| `POST` | `/categories` | JWT | ADMIN | Crear categoría |

## Destinations

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/destinations` | Público | - | Listar destinos |

## Testimonials

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/testimonials/featured` | Público | - | Listar testimonios destacados |
| `GET` | `/testimonials/tags` | Público | - | Listar todos los tags disponibles |
| `POST` | `/testimonials` | Público | - | Enviar testimonio desde formulario público |
| `GET` | `/testimonials/admin` | JWT | ADMIN | Listar todos los testimonios |
| `GET` | `/testimonials/admin/:id` | JWT | ADMIN | Obtener testimonio por ID |
| `POST` | `/testimonials/admin` | JWT | ADMIN | Crear testimonio |
| `PATCH` | `/testimonials/admin/:id` | JWT | ADMIN | Actualizar testimonio |
| `DELETE` | `/testimonials/admin/:id` | JWT | ADMIN | Eliminar testimonio |

## Providers

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/providers` | JWT | ADMIN | Listar proveedores |
| `POST` | `/providers` | JWT | ADMIN | Crear proveedor |
| `GET` | `/providers/:id` | JWT | ADMIN | Obtener proveedor por ID |
| `PATCH` | `/providers/:id` | JWT | ADMIN | Actualizar proveedor |
| `DELETE` | `/providers/:id` | JWT | ADMIN | Eliminar proveedor |

## Guides

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/guides` | JWT | ADMIN | Listar guías turísticos |
| `POST` | `/guides` | JWT | ADMIN | Crear guía turístico |
| `GET` | `/guides/:id` | JWT | ADMIN | Obtener guía por ID |
| `PATCH` | `/guides/:id` | JWT | ADMIN | Actualizar guía |
| `DELETE` | `/guides/:id` | JWT | ADMIN | Eliminar guía |

## Operations

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/operations` | JWT | ADMIN | Listar operaciones |
| `POST` | `/operations` | JWT | ADMIN | Crear operación de reserva |
| `GET` | `/operations/:id` | JWT | ADMIN | Obtener operación por ID |
| `PATCH` | `/operations/:id` | JWT | ADMIN | Actualizar operación |

## Payments

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/payments` | JWT | ADMIN | Listar pagos |
| `POST` | `/payments` | JWT | ADMIN, CLIENTE | Registrar pago |
| `GET` | `/payments/:id` | JWT | ADMIN | Obtener pago por ID |

## Billing

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/billing/invoices` | JWT | ADMIN | Listar facturas |
| `POST` | `/billing/invoices` | JWT | ADMIN | Crear factura |
| `GET` | `/billing/invoices/:id` | JWT | ADMIN | Obtener factura por ID |

## Notifications

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `POST` | `/notifications/send` | JWT | ADMIN | Enviar notificación |

## Legal

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/legal/documents` | Público | - | Listar documentos legales |
| `POST` | `/legal/accept` | JWT | CLIENTE | Aceptar documento legal |
| `GET` | `/legal/acceptances/:id` | JWT | ADMIN | Obtener aceptación por ID |

## Analytics

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `GET` | `/analytics/dashboard` | JWT | ADMIN | Obtener métricas de ventas y reservas |

## Contact (público)

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `POST` | `/contact` | Público | - | Enviar mensaje de contacto |

## Claims (público)

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `POST` | `/claims` | Público | - | Enviar reclamo (Libro de Reclamaciones) |

## Uploads

| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| `POST` | `/uploads` | JWT | ADMIN | Subir imagen (multipart, máx 10MB) |

## Documentación

| Recurso | URL |
|---------|-----|
| Swagger UI | `/api/v1/docs` (solo en desarrollo) |