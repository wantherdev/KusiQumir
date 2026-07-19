# Database Schema

Este documento describe el modelo de datos actual utilizado por Prisma con `DATABASE_URL="file:./dev.db"`.

## Configuración general

- `datasource db` usa SQLite en local.
- `generator client` genera el cliente Prisma en `node_modules/@prisma/client`.
- Para producción se recomienda migrar a PostgreSQL y ajustar `DATABASE_URL`.

## Modelos principales

### Role

- id: `String` @id @default(cuid())
- name: `String` @unique
- users: `User[]`

### User

- id: `String` @id @default(cuid())
- email: `String` @unique
- password: `String`
- roleId: `String`
- role: `Role` @relation(fields: [roleId], references: [id])
- createdAt: `DateTime` @default(now())

### Customer

- id: `String` @id @default(cuid())
- name: `String`
- email: `String` @unique
- nationality: `String?`
- passport: `String?`
- preferences: `String?`
- createdAt: `DateTime` @default(now())
- bookings: `Booking[]`
- acceptances: `DocumentAcceptance[]`
- invoices: `Invoice[]`

### Provider

- id: `String` @id @default(cuid())
- name: `String`
- type: `String`
- contact: `String`
- contract: `String?`
- commission: `String?`
- services: `String?`
- createdAt: `DateTime` @default(now())
- tours: `Tour[]`

### Guide

- id: `String` @id @default(cuid())
- name: `String`
- languages: `String`
- credential: `String`
- availability: `Boolean` @default(true)
- rating: `Float` @default(0)
- createdAt: `DateTime` @default(now())
- operations: `Operation[]`

### Tour

- id: `String` @id @default(cuid())
- name: `String`
- description: `String`
- images: `String?`
- duration: `String?`
- difficulty: `String?`
- price: `Float`
- itinerary: `String?`
- includes: `String?`
- excludes: `String?`
- location: `String?`
- availability: `Boolean` @default(true)
- providerId: `String?`
- provider: `Provider?` @relation(fields: [providerId], references: [id])
- packages: `Package[]`
- bookings: `Booking[]`
- createdAt: `DateTime` @default(now())

### Package

- id: `String` @id @default(cuid())
- name: `String`
- description: `String`
- price: `Float`
- tours: `Tour[]`
- bookings: `Booking[]`
- createdAt: `DateTime` @default(now())

### Booking

- id: `String` @id @default(cuid())
- customerId: `String`
- tourId: `String?`
- packageId: `String?`
- travelers: `Int`
- status: `String` @default("PENDIENTE")
- date: `DateTime` @default(now())
- total: `Float?`
- customer: `Customer` @relation(fields: [customerId], references: [id])
- tour: `Tour?` @relation(fields: [tourId], references: [id])
- package: `Package?` @relation(fields: [packageId], references: [id])
- payment: `Payment?`
- operation: `Operation?`
- invoice: `Invoice?`

### Payment

- id: `String` @id @default(cuid())
- bookingId: `String` @unique
- amount: `Float`
- currency: `String`
- method: `String?`
- status: `String` @default("PENDIENTE")
- createdAt: `DateTime` @default(now())
- booking: `Booking` @relation(fields: [bookingId], references: [id])

### Operation

- id: `String` @id @default(cuid())
- bookingId: `String` @unique
- guideId: `String?`
- guide: `Guide?` @relation(fields: [guideId], references: [id])
- transport: `String`
- pickupTime: `String`
- status: `String` @default("Confirmado")
- createdAt: `DateTime` @default(now())
- booking: `Booking` @relation(fields: [bookingId], references: [id])

### Invoice

- id: `String` @id @default(cuid())
- bookingId: `String` @unique
- customerId: `String`
- amount: `Float`
- currency: `String`
- status: `String` @default("GENERADA")
- createdAt: `DateTime` @default(now())
- booking: `Booking` @relation(fields: [bookingId], references: [id])
- customer: `Customer` @relation(fields: [customerId], references: [id])

### Document

- id: `String` @id @default(cuid())
- title: `String`
- version: `String`
- type: `String?`
- createdAt: `DateTime` @default(now())
- acceptances: `DocumentAcceptance[]`

### DocumentAcceptance

- id: `String` @id @default(cuid())
- documentId: `String`
- customerId: `String`
- ip: `String`
- version: `String`
- acceptedAt: `DateTime` @default(now())
- document: `Document` @relation(fields: [documentId], references: [id])
- customer: `Customer` @relation(fields: [customerId], references: [id])

### Notification

- id: `String` @id @default(cuid())
- channel: `String`
- recipient: `String`
- message: `String`
- status: `String` @default("sent")
- sentAt: `DateTime` @default(now())

### Log

- id: `String` @id @default(cuid())
- action: `String`
- details: `String?`
- createdAt: `DateTime` @default(now())

## Relaciones principales

- `User` -> `Role`
- `Customer` -> `Booking`, `DocumentAcceptance`, `Invoice`
- `Booking` -> `Customer`, `Tour`, `Package`, `Payment`, `Operation`, `Invoice`
- `Tour` -> `Provider`, `Package`, `Booking`
- `Package` -> `Tour`, `Booking`
- `Operation` -> `Booking`, `Guide`
- `Invoice` -> `Booking`, `Customer`
