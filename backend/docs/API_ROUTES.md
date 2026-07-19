# API Routes

Base path: `/api/v1`

## Auth

- `GET /auth/health`
  - Health check del módulo de autenticación.

- `POST /auth/register`
  - Crea un usuario nuevo.
  - Body: `{ email, password }`

- `POST /auth/login`
  - Genera token JWT.
  - Body: `{ email, password }`

## Customers

- `GET /customers`
  - Lista clientes.
  - Requiere JWT.
  - Roles: `ADMIN`.

- `POST /customers`
  - Crea un cliente.
  - Body: `{ name, email, nationality? }`
  - Requiere JWT.
  - Roles: `ADMIN`.

- `GET /customers/:id`
  - Obtiene cliente por ID.
  - Requiere JWT.
  - Roles: `ADMIN`.

## Tours

- `GET /tours`
  - Lista tours.
  - Requiere JWT.

- `POST /tours`
  - Crea un tour.
  - Body: `{ name, description, price, duration }`
  - Requiere JWT.
  - Roles: `ADMIN`.

- `GET /tours/:id`
  - Obtiene tour por ID.
  - Requiere JWT.

## Bookings

- `GET /bookings`
  - Lista reservas.
  - Requiere JWT.
  - Roles: `ADMIN`.

- `POST /bookings`
  - Crea una reserva.
  - Body: `{ customerId, travelers, tourId? , packageId? }`
  - Requiere JWT.
  - Roles: `ADMIN`, `CLIENTE`.

- `GET /bookings/:id`
  - Obtiene reserva por ID.
  - Requiere JWT.
  - Roles: `ADMIN`.

## Payments

- `GET /payments`
  - Lista pagos.
  - Requiere JWT.
  - Roles: `ADMIN`.

- `POST /payments`
  - Registra un pago.
  - Body: `{ bookingId, amount, currency }`
  - Requiere JWT.
  - Roles: `ADMIN`, `CLIENTE`.

- `GET /payments/:id`
  - Obtiene pago por ID.
  - Requiere JWT.
  - Roles: `ADMIN`.

## Packages

- `GET /packages`
  - Lista paquetes turísticos.
  - Requiere JWT.

- `POST /packages`
  - Crea un paquete.
  - Body: `{ name, description, tours, price }`
  - Requiere JWT.

- `GET /packages/:id`
  - Obtiene paquete por ID.
  - Requiere JWT.

## Providers

- `GET /providers`
  - Lista proveedores.
  - Requiere JWT.

- `POST /providers`
  - Crea un proveedor.
  - Body: `{ name, type, contact }`
  - Requiere JWT.

- `GET /providers/:id`
  - Obtiene proveedor por ID.
  - Requiere JWT.

## Operations

- `GET /operations`
  - Lista operaciones.
  - Requiere JWT.

- `POST /operations`
  - Crea una operación.
  - Body: `{ bookingId, transport, pickupTime, guideId? }`
  - Requiere JWT.

- `GET /operations/:id`
  - Obtiene operación por ID.
  - Requiere JWT.

## Notifications

- `POST /notifications/send`
  - Envía una notificación.
  - Body: `{ channel, recipient, message }`
  - Requiere JWT.

## Billing

- `GET /billing/invoices`
  - Lista facturas.
  - Requiere JWT.

- `POST /billing/invoices`
  - Crea una factura.
  - Body: `{ bookingId, amount, currency, customerId }`
  - Requiere JWT.

- `GET /billing/invoices/:id`
  - Obtiene factura por ID.
  - Requiere JWT.

## Legal

- `GET /legal/documents`
  - Lista documentos legales.
  - Requiere JWT.

- `POST /legal/accept`
  - Acepta un documento.
  - Body: `{ documentId, clientId, ip, version }`
  - Requiere JWT.

- `GET /legal/acceptances/:id`
  - Obtiene aceptación por ID.
  - Requiere JWT.

## Analytics

- `GET /analytics/dashboard`
  - Obtiene métricas de ventas y reservas.
  - Requiere JWT.

## Otros

- `GET /docs`
  - Swagger UI generado automáticamente.
