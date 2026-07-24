# Database Schema

Este documento describe el modelo de datos actual de Kusi Q'umir.  
**Base de datos**: PostgreSQL 17 con extensión PostGIS (`postgis/postgis:17-3.5-alpine`)  
**ORM**: Prisma 5

## Configuración general

- `datasource db`: PostgreSQL (`provider = "postgresql"`)
- `generator client`: Prisma Client JS
- Esquema completo en `backend/prisma/schema.prisma`

## Modelos principales

### Role

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| name | String | @unique |
| users | User[] | |

### User

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| email | String | @unique |
| password | String | Hasheado con bcryptjs |
| roleId | String | FK → Role |
| role | Role | @relation |
| createdAt | DateTime | @default(now()) |

### Customer

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| name | String | |
| email | String | @unique |
| nationality | String? | |
| passport | String? | |
| phone | String? | |
| preferences | String? | |
| createdAt | DateTime | @default(now()) |
| bookings | Booking[] | |
| acceptances | DocumentAcceptance[] | |
| invoices | Invoice[] | |

### Provider

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| name | String | |
| type | String | |
| contact | String | |
| contract | String? | |
| commission | String? | |
| services | String? | |
| createdAt | DateTime | @default(now()) |
| tours | Tour[] | |

### Guide

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| name | String | |
| languages | String | |
| credential | String | |
| availability | Boolean | @default(true) |
| rating | Float | @default(0) |
| createdAt | DateTime | @default(now()) |
| operations | Operation[] | |

### Category

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| slug | String | @unique |
| name | String | |
| description | String? | |
| tours | Tour[] | |

### Destination

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| slug | String | @unique |
| name | String | |
| description | String | |
| tours | TourDestination[] | |

### Tour

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| slug | String | @unique |
| code | String | @unique |
| title | String | |
| subtitle | String? | |
| shortDescription | String | |
| description | String | |
| durationHours | Int | |
| durationDays | Int | |
| difficulty | Difficulty | Enum: Easy, Moderate, Challenging |
| groupType | GroupType | Enum: Shared, Private |
| serviceType | ServiceType | Enum: HalfDay, FullDay, MultiDay |
| featured | Boolean | @default(false) |
| active | Boolean | @default(true) |
| recommendedFor | String[] | |
| categoryId | String | FK → Category |
| category | Category | @relation |
| providerId | String? | FK → Provider |
| provider | Provider? | @relation |
| packages | Package[] | |
| bookings | Booking[] | |
| experiences | Experience[] | |
| schedules | TourSchedule[] | |
| itineraryDays | ItineraryDay[] | |
| destinations | TourDestination[] | |
| includes | TourInclude[] | |
| excludes | TourExclude[] | |
| faqs | TourFaq[] | |
| recommendations | TourRecommendation[] | |
| requirements | TourRequirement[] | |
| prices | TourPrice[] | |
| images | TourImage[] | |
| seo | TourSeo? | |
| metadata | TourMetadata? | |
| reviews | Review[] | |
| testimonials | Testimonial[] | |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

### Enums de Tour

- **Difficulty**: `Easy`, `Moderate`, `Challenging`
- **GroupType**: `Shared`, `Private`
- **ServiceType**: `HalfDay`, `FullDay`, `MultiDay`

### TourSchedule

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| departure | String | |
| pickupStart | String | |
| arrival | String | |
| language | String? | |
| available | Boolean | @default(true) |
| tourId | String | FK → Tour |

### TourPrice

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| name | String | |
| currency | String | |
| adult | Decimal | |
| child | Decimal? | |
| private | Decimal? | |
| tourId | String | FK → Tour |

### TourImage

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| url | String | |
| alt | String | |
| featured | Boolean | @default(false) |
| sortOrder | Int | |
| source | String? | |
| tourId | String | FK → Tour |

### TourInclude / TourExclude

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| title | String | |
| description | String? | |
| tourId | String | FK → Tour |

### TourFaq

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| question | String | |
| answer | String | |
| sortOrder | Int | |
| tourId | String | FK → Tour |

### TourRecommendation

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| title | String | |
| description | String | |
| tourId | String | FK → Tour |

### TourRequirement

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| requirement | String | |
| tourId | String | FK → Tour |

### TourSeo

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| title | String | |
| description | String | |
| keywords | Json? | |
| canonical | String? | |
| tourId | String | @unique, FK → Tour |

### TourMetadata

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| provider | String? | |
| sourceUrl | String? | |
| lastUpdated | DateTime? | |
| tourId | String | @unique, FK → Tour |

### ItineraryDay

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| day | Int | |
| title | String | |
| tourId | String | FK → Tour |
| activities | ItineraryActivity[] | |

### ItineraryActivity

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| sortOrder | Int | |
| time | String? | |
| title | String | |
| description | String | |
| duration | Int | |
| itineraryDayId | String | FK → ItineraryDay |

### TourDestination

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| sortOrder | Int | |
| tourId | String | FK → Tour |
| destinationId | String | FK → Destination |

### Review

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| rating | Int | 1-5 |
| comment | String | |
| name | String? | |
| country | String? | |
| createdAt | DateTime | @default(now()) |
| tourId | String | FK → Tour |

### Testimonial

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| name | String | |
| role | String? | |
| content | String | |
| email | String? | |
| avatar | String? | |
| rating | Int | |
| tags | String[] | |
| featured | Boolean | @default(false) |
| sortOrder | Int | @default(0) |
| active | Boolean | @default(true) |
| tourId | String? | FK → Tour |
| tour | Tour? | @relation |
| consent | Json? | |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

### Article

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| slug | String | @unique |
| title | String | |
| excerpt | String | |
| content | String | |
| coverImage | String? | |
| imageAlt | String? | |
| category | String? | |
| tags | String? | |
| status | String | @default("DRAFT") |
| publishedAt | DateTime? | |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

Índices: `[status, publishedAt]`, `[category]`

### Experience

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| slug | String | @unique |
| title | String | |
| summary | String | |
| content | String | |
| coverImage | String? | |
| imageAlt | String? | |
| location | String? | |
| duration | String? | |
| tourId | String? | FK → Tour |
| tour | Tour? | @relation |
| status | String | @default("DRAFT") |
| featured | Boolean | @default(false) |
| sortOrder | Int | @default(0) |
| publishedAt | DateTime? | |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

Índices: `[status, publishedAt]`, `[featured, sortOrder]`, `[location]`

### Package

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| name | String | |
| description | String | |
| price | Float | |
| featured | Boolean | @default(false) |
| durationDays | Int? | |
| discount | Float? | |
| imageUrl | String? | |
| included | String? | |
| excluded | String? | |
| tours | Tour[] | Many-to-many |
| bookings | Booking[] | |
| createdAt | DateTime | @default(now()) |

### Booking

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| customerId | String | FK → Customer |
| tourId | String? | FK → Tour |
| packageId | String? | FK → Package |
| travelers | Int | |
| status | String | @default("PENDIENTE") |
| date | DateTime | @default(now()) |
| total | Float? | |
| unitPrice | Float? | |
| customerName | String? | |
| customerEmail | String? | |
| customerPhone | String? | |
| startDate | DateTime? | |
| notes | String? | |
| canceledAt | DateTime? | |
| customer | Customer | @relation |
| tour | Tour? | @relation |
| package | Package? | @relation |
| payment | Payment? | |
| operation | Operation? | |
| invoice | Invoice? | |

Índices: `[customerId, date]`, `[status, date]`, `[date]`
Estados: `PENDIENTE`, `CONFIRMADA`, `COMPLETADA`, `CANCELADA`

### Payment

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| bookingId | String | @unique, FK → Booking |
| amount | Float | |
| currency | String | |
| method | String? | |
| status | String | @default("PENDIENTE") |
| createdAt | DateTime | @default(now()) |
| booking | Booking | @relation |

Índice: `[status, createdAt]`

### Operation

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| bookingId | String | @unique, FK → Booking |
| guideId | String? | FK → Guide |
| guide | Guide? | @relation |
| transport | String | |
| pickupTime | String | |
| status | String | @default("Confirmado") |
| createdAt | DateTime | @default(now()) |
| booking | Booking | @relation |

### Invoice

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| bookingId | String | @unique, FK → Booking |
| customerId | String | FK → Customer |
| amount | Float | |
| currency | String | |
| status | String | @default("GENERADA") |
| createdAt | DateTime | @default(now()) |
| booking | Booking | @relation |
| customer | Customer | @relation |

Índices: `[customerId, createdAt]`, `[status, createdAt]`

### Document

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| title | String | |
| version | String | |
| type | String? | |
| createdAt | DateTime | @default(now()) |
| acceptances | DocumentAcceptance[] | |

### DocumentAcceptance

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| documentId | String | FK → Document |
| customerId | String | FK → Customer |
| ip | String | |
| version | String | |
| acceptedAt | DateTime | @default(now()) |
| document | Document | @relation |
| customer | Customer | @relation |

### Notification

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| channel | String | |
| recipient | String | |
| message | String | |
| status | String | @default("sent") |
| sentAt | DateTime | @default(now()) |

### Log

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| action | String | |
| details | String? | |
| createdAt | DateTime | @default(now()) |

### Contact

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| name | String | |
| email | String | |
| phone | String? | |
| message | String | |
| createdAt | DateTime | @default(now()) |

### Claim

| Campo | Tipo | Notas |
|-------|------|-------|
| id | String (cuid) | @id |
| nombre | String | |
| documento | String | |
| correo | String | |
| telefono | String? | |
| servicio | String? | |
| reserva | String? | |
| fechaServicio | String? | |
| motivo | String | |
| descripcion | String | |
| documentos | String? | |
| permitirContacto | Boolean | @default(true) |
| createdAt | DateTime | @default(now()) |

## Relaciones principales

- `User` → `Role`
- `Customer` → `Booking[]`, `DocumentAcceptance[]`, `Invoice[]`
- `Booking` → `Customer`, `Tour?`, `Package?`, `Payment?`, `Operation?`, `Invoice?`
- `Tour` → `Category`, `Provider?`, `Package[]`, `Booking[]`, `Experience[]`, `Review[]`, `Testimonial[]`, `TourSchedule[]`, `TourPrice[]`, `TourImage[]`, `TourInclude[]`, `TourExclude[]`, `TourFaq[]`, `TourRecommendation[]`, `TourRequirement[]`, `TourSeo?`, `TourMetadata?`, `ItineraryDay[]`
- `ItineraryDay` → `ItineraryActivity[]`
- `Tour` ↔ `Destination` via `TourDestination`
- `Package` ↔ `Tour` (many-to-many)
- `Operation` → `Booking`, `Guide?`
- `Invoice` → `Booking`, `Customer`
- `Payment` → `Booking`
- `Document` → `DocumentAcceptance[]`
- `DocumentAcceptance` → `Document`, `Customer`