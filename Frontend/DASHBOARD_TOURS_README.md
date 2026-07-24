# Dashboard de Gestión de Tours

## Overview

Dashboard de administración para gestionar tours con funcionalidades CRUD.

## Características

- Crear tours con formulario completo
- Editar tours existentes
- Eliminar tours del sistema
- Tabla interactiva con listado completo
- Generación automática de slugs
- Gestión de itinerarios, incluidos y excluidos
- Validación de formularios en tiempo real

## Acceso al Dashboard

### URL

```
http://localhost:4200/admin/tours
```

### Autenticación

La autenticación usa **httpOnly cookie JWT + CSRF**.  
El login se realiza en `/auth/login` y el token se maneja automáticamente.

Credenciales de prueba (seed): `admin@example.com` / `password123`

## Endpoints API Utilizados

Base: `/api/v1`

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `GET` | `/tours` | Público | Listar tours publicados |
| `GET` | `/tours/admin` | ADMIN | Listar todos los tours |
| `GET` | `/tours/slug/:slug` | Público | Obtener tour por slug |
| `GET` | `/tours/:id` | Público | Obtener tour por ID |
| `POST` | `/tours` | ADMIN | Crear tour |
| `PATCH` | `/tours/:id` | ADMIN | Actualizar tour |
| `DELETE` | `/tours/:id` | ADMIN | Eliminar tour |

## Estructura de Datos — Tour

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| title | string | ✓ | Nombre del tour |
| slug | string | ✓ | URL amigable única (auto-generada) |
| shortDescription | string | ✓ | Descripción corta |
| description | string | ✓ | Descripción detallada |
| durationHours | number | ✓ | Duración en horas |
| durationDays | number | ✓ | Duración en días |
| difficulty | enum | ✓ | Easy, Moderate, Challenging |
| groupType | enum | ✓ | Shared, Private |
| serviceType | enum | ✓ | HalfDay, FullDay, MultiDay |
| featured | boolean | | Marcar como destacado |
| active | boolean | | Activo/inactivo |
| categoryId | string | ✓ | ID de categoría |
| providerId | string | | ID del proveedor |
| subtitle | string | | Subtítulo |
| prices | array | | Precios (adult, child, private) |
| images | array | | URLs de imágenes |
| includes | array | | Items incluidos |
| excludes | array | | Items no incluidos |
| itineraryDays | array | | Itinerario por días |
| faqs | array | | Preguntas frecuentes |
| recommendations | array | | Recomendaciones |
| requirements | array | | Requisitos |
| schedules | array | | Horarios disponibles |

## Validaciones del Formulario

- **title**: Mínimo 3 caracteres
- **slug**: Requerido (auto-generado)
- **shortDescription**: Mínimo 10 caracteres
- **durationDays**: Mínimo 1
- **price** (en prices): Mínimo 0

## Mensajes

- ✅ Verde: Operación exitosa
- ❌ Rojo: Error en operación
- La tabla se recarga automáticamente tras cada operación

## Notas Importantes

1. El slug debe ser único (validado por backend)
2. Los campos de matriz (itinerario, incluido, excluido) aceptan múltiples líneas
3. El slug se auto-genera al escribir el título
4. El botón "Guardar" se deshabilita hasta que todos los campos requeridos sean válidos

## Troubleshooting

### Error 401: No autenticado
- Verifica que hayas iniciado sesión
- El token JWT se maneja via cookie automáticamente

### Error 404: Recurso no encontrado
- Verifica que el ID del tour sea correcto
- El tour puede haber sido eliminado

### Error de validación
- Completa todos los campos requeridos (marcados con *)
- Respeta los requisitos mínimos de caracteres

## Archivos del Componente

- `tours-dashboard.ts` — Lógica del componente
- `tours-dashboard.html` — Template
- `travel-api.service.ts` — Métodos CRUD via API