# 🏔️ Backend Architecture - Digital Travel Agency PRO

## 📌 Contexto del Proyecto

Este documento define la arquitectura backend para una **Agencia de Viajes Digital Full Stack** especializada en turismo en Cusco, Perú.

La plataforma debe soportar:

- Venta directa de servicios turísticos propios.
- Intermediación de servicios de terceros.
- Paquetes turísticos completos.
- Reservas online.
- Pagos digitales.
- Gestión de clientes.
- Gestión operativa.
- Gestión de proveedores.
- Documentación legal turística.
- Facturación electrónica.
- Automatización mediante WhatsApp y correo.
- Escalabilidad futura hacia marketplace turístico.

---

# 🎯 Objetivo

Crear un backend empresarial, modular y escalable que funcione como:

- Sistema de reservas.
- CRM turístico.
- ERP operativo.
- Plataforma ecommerce.
- Centro administrativo.
- API para aplicaciones web y móviles.

---

# 🏗️ Stack Tecnológico Recomendado

## Backend

```
NestJS
TypeScript
Prisma ORM
PostgreSQL
Redis
Docker
JWT Authentication
REST API
Swagger
```

---

## Infraestructura

```
AWS / Cloud Provider

S3 Storage
RDS PostgreSQL

Redis Cache

Docker Containers

CI/CD Pipeline
```

---

# 📂 Estructura General del Proyecto

```
travel-agency-backend/

├── apps/
│
│ ├── api/
│ │
│ │ └── src/
│ │
│ │ ├── modules/
│ │ ├── config/
│ │ ├── database/
│ │ ├── middleware/
│ │ ├── guards/
│ │ ├── utils/
│ │ └── main.ts
│ │
│ └── worker/
│
├── packages/
│
│ ├── shared/
│ ├── types/
│ └── constants/
│
├── database/
│
│ ├── migrations/
│ ├── seeds/
│ └── backups/
│
├── storage/
│
│ ├── images/
│ ├── documents/
│ ├── invoices/
│ └── contracts/
│
├── tests/
│
├── docs/
│
└── docker-compose.yml
```

---

# 🔐 Módulo Authentication

Ruta:

```
modules/auth
```

Responsabilidad:

- Registro usuarios.
- Login.
- Recuperación contraseña.
- OAuth Google.
- WhatsApp Login.
- JWT.
- Refresh Tokens.
- Control de permisos.

---

## Roles del Sistema

```ts
SUPER_ADMIN;

ADMIN;

OPERADOR;

GUIA;

CLIENTE;

PROVEEDOR;
```

---

# 👥 Módulo Customers CRM

Ruta:

```
modules/customers
```

Gestiona:

```
Cliente

- Datos personales
- Nacionalidad
- Pasaporte
- Historial de viajes
- Preferencias
- Documentos
- Comunicaciones
```

---

# 🏔️ Módulo Tours

Ruta:

```
modules/tours
```

Gestiona catálogo turístico.

Entidad:

```
Tour

id

nombre

descripcion

imagenes

duracion

dificultad

precio

itinerario

incluye

noIncluye

ubicacion

disponibilidad

proveedor
```

---

# 📦 Módulo Packages

Ruta:

```
modules/packages
```

Gestiona paquetes completos.

Ejemplo:

```
Cusco 7 Días

Día 1:
Aeropuerto

Día 2:
City Tour

Día 3:
Valle Sagrado

Día 4:
Machu Picchu

Día 5:
Humantay

Día 6:
Montaña 7 Colores

Día 7:
Salida
```

Funciones:

- Crear paquetes.
- Añadir servicios.
- Calcular precios.
- Personalización.

---

# 📅 Módulo Bookings

Ruta:

```
modules/bookings
```

Motor principal de reservas.

Flujo:

```
Cliente

↓

Selecciona Tour

↓

Fecha

↓

Pasajeros

↓

Pago

↓

Confirmación

↓

Voucher
```

---

Estados:

```
PENDIENTE

CONFIRMADA

PAGADA

EN_PROCESO

FINALIZADA

CANCELADA
```

---

# 🤝 Módulo Providers

Ruta:

```
modules/providers
```

Gestiona proveedores externos:

```
Hoteles

Trenes

Transporte

Restaurantes

Guías externos

Operadores trekking
```

Información:

```
Contrato

Comisiones

Servicios

Contacto

Facturación
```

---

# 🚐 Módulo Operations

Ruta:

```
modules/operations
```

Gestión diaria.

Ejemplo:

```
Reserva:

Machu Picchu

Asignar:

Guía:
Carlos

Transporte:
Empresa X

Recojo:
05:00 AM

Estado:
Confirmado
```

---

# 🧑‍🏫 Módulo Guides

Ruta:

```
modules/guides
```

Gestiona:

```
Guías turísticos

Nombre

Idiomas

Credencial

Disponibilidad

Tours asignados

Calificaciones
```

---

# 💳 Módulo Payments

Ruta:

```
modules/payments
```

Integraciones:

Perú:

```
Culqi

Niubiz

Izipay

MercadoPago
```

Internacional:

```
Stripe

PayPal
```

---

Entidad:

```
Payment

id

bookingId

amount

currency

method

status

createdAt
```

---

# 🧾 Módulo Billing

Ruta:

```
modules/billing
```

Integración:

```
SUNAT

Factura electrónica

Boleta electrónica
```

Genera:

```
PDF

XML

CDR
```

---

# ⚖️ Módulo Legal

Ruta:

```
modules/legal
```

Gestiona:

```
Términos y condiciones

Contrato turístico

Política privacidad

Aceptaciones digitales
```

Guardar:

```
Documento aceptado

Fecha

IP

Versión

Cliente
```

---

# 🔔 Módulo Notifications

Ruta:

```
modules/notifications
```

Canales:

```
Email

WhatsApp API

SMS

Push Notifications
```

Eventos:

```
Reserva creada

Pago recibido

Voucher generado

Recordatorio viaje
```

---

# 📊 Módulo Analytics

Ruta:

```
modules/analytics
```

Dashboard:

```
Ventas

Ingresos

Tours vendidos

Clientes

Conversión

Comisiones

Reportes
```

---

# 🗄️ Modelo Base de Datos Inicial

PostgreSQL:

```
users

roles

customers

guides

providers

tours

packages

itineraries

bookings

booking_items

payments

invoices

documents

reviews

notifications

logs
```

---

# 🔒 Seguridad

Implementar:

```
HTTPS

JWT

Refresh Tokens

RBAC

Rate Limiting

2FA

Logs

Auditoría

Backups

Cifrado documentos
```

---

# 🌎 API Architecture

Base URL:

```
api.agencia.com/v1
```

Ejemplo:

```
GET

/api/v1/tours

POST

/api/v1/bookings

GET

/api/v1/customers/:id
```

---

# 🖥️ Panel Administrativo

URL:

```
admin.agencia.com
```

Módulos:

```
Dashboard

Clientes

Tours

Reservas

Pagos

Guías

Proveedores

Reportes

Configuración
```

---

# 📱 Aplicaciones Futuras

La API debe permitir:

```
Web Angular

App Android

App iOS

App Guía

Portal Cliente
```

---

# 🚀 Desarrollo por Fases

## FASE 1 - Core

Crear:

```
Authentication

Users

Roles

Tours

Customers

Bookings

Payments
```

---

## FASE 2 - Operaciones

Crear:

```
Guides

Providers

Calendar

Assignments

Operations
```

---

## FASE 3 - Automatización

Crear:

```
WhatsApp

Email

SUNAT

Documents

Notifications
```

---

## FASE 4 - Plataforma avanzada

Crear:

```
Marketplace

IA Travel Assistant

App móvil

CRM avanzado

Motor recomendaciones
```

---

# 🤖 Instrucciones para GitHub Copilot

Cuando generes código:

- Usar arquitectura modular NestJS.
- Aplicar Clean Architecture.
- Separar Controllers, Services, DTOs y Entities.
- Usar TypeScript estricto.
- Implementar validaciones.
- Crear documentación Swagger.
- Aplicar buenas prácticas REST.
- Preparar código escalable empresarial.
  El objetivo es construir una plataforma turística profesional preparada para crecimiento internacional.
