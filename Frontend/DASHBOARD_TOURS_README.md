# Dashboard de Gestión de Tours

## Overview

Se ha agregado un **Dashboard de Administración** completo para gestionar tours (paquetes de viajes) con funcionalidades CRUD (Crear, Leer, Actualizar, Eliminar).

## Características

✅ **Crear Tours** - Formulario completo para agregar nuevos tours  
✅ **Editar Tours** - Modificar información de tours existentes  
✅ **Eliminar Tours** - Remover tours del sistema  
✅ **Listar Tours** - Tabla interactiva con todos los tours  
✅ **Generar Slug** - Generación automática de URLs amigables  
✅ **Gestión de Matrices** - Itinerarios, items incluidos y excluidos  
✅ **Validación de Formularios** - Validaciones en tiempo real  

## Acceso al Dashboard

### URL
```
http://localhost:4200/admin/tours
```

### Requisitos de Acceso
- Se requiere **autenticación JWT** para realizar operaciones CRUD
- Solo **GET** (lectura) funciona sin autenticación
- Las operaciones de **POST, PATCH, DELETE** requieren token de autenticación válido

## Flujo de Funcionamiento

### 1. Listar Tours
Al entrar al dashboard se cargan automáticamente todos los tours disponibles en una tabla.

### 2. Crear Nuevo Tour
- Click en botón "+ Nuevo Tour"
- Completar el formulario con los siguientes campos:
  - **Nombre**: Nombre descriptivo del tour
  - **Slug**: URL amigable (se auto-genera al escribir el nombre)
  - **Descripción**: Descripción detallada del tour
  - **Duración**: Días del tour
  - **Precio**: Precio en USD
  - **Descuento**: Porcentaje de descuento (opcional)
  - **Destacado**: Marcar si es un tour featured
  - Campos adicionales (Categoría, Dificultad, Temporada, etc.)
  - **Itinerario, Incluido, No Incluido**: Agregar una línea por ítem
- Click en "Guardar"

### 3. Editar Tour
- Click en botón "Editar" en la fila del tour
- Modificar los datos necesarios
- Click en "Guardar"

### 4. Eliminar Tour
- Click en botón "Eliminar" en la fila del tour
- Confirmar la acción en el diálogo de confirmación

## Estructura de Datos

### Campos del Tour/Package

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| name | string | ✓ | Nombre del tour |
| slug | string | ✓ | URL amigable única |
| description | string | ✓ | Descripción detallada |
| durationDays | number | ✓ | Duración en días |
| price | number | ✓ | Precio en USD |
| discount | number | | Descuento en porcentaje |
| imageUrl | string | | URL de imagen |
| featured | boolean | | Marcar como destacado |
| category | string | | Categoría del tour |
| country | string | | País (default: Perú) |
| city | string | | Ciudad |
| difficulty | string | | Nivel de dificultad |
| bestSeason | string | | Mejor temporada |
| itinerary | string[] | | Días del itinerario |
| included | string[] | | Items incluidos |
| excluded | string[] | | Items no incluidos |
| subtitle | string | | Subtítulo |
| mapUrl | string | | URL del mapa |

## Autenticación

Para usar el dashboard, necesitas obtener un token JWT:

### Endpoint de Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

El token se envía automáticamente en el header `Authorization: Bearer {token}`.

## Endpoints API Utilizados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/packages` | Listar todos los tours |
| GET | `/api/packages/:id` | Obtener un tour específico |
| POST | `/api/packages` | Crear nuevo tour (requiere JWT) |
| PATCH | `/api/packages/:id` | Actualizar tour (requiere JWT) |
| DELETE | `/api/packages/:id` | Eliminar tour (requiere JWT) |

## Archivos Agregados/Modificados

### Nuevos Archivos
- `src/app/pages/admin/dashboard/tours-dashboard.ts` - Componente principal
- `src/app/pages/admin/dashboard/tours-dashboard.html` - Template
- `src/app/pages/admin/dashboard/tours-dashboard.css` - Estilos

### Archivos Modificados
- `src/app/services/travel-api.service.ts` - Agregados métodos CRUD y extensión de interfaz
- `src/app/app.routes.ts` - Agregada ruta `/admin/tours`

## Validaciones

El formulario valida:
- **Nombre**: Mínimo 3 caracteres
- **Slug**: Requerido
- **Descripción**: Mínimo 10 caracteres
- **Duración**: Mínimo 1 día
- **Precio**: Mínimo 0
- **Descuento**: Entre 0 y 100%

## Mensajes de Error y Éxito

- ✅ Mensajes verdes: Operación exitosa
- ❌ Mensajes rojos: Error en operación
- El dashboard intenta automáticamente recargar la lista después de operaciones

## Notas Importantes

1. **Slug Único**: El slug debe ser único en el sistema (validado por el backend)
2. **Campos de Matriz**: Los campos "Itinerario", "Incluido" y "No Incluido" aceptan múltiples líneas (una por item)
3. **Auto-generación de Slug**: Escribe el nombre y el slug se generará automáticamente al perder el foco
4. **Validación en Tiempo Real**: El botón "Guardar" está deshabilitado hasta que todos los campos requeridos sean válidos
5. **Autenticación Persistente**: Asegúrate de que tu token JWT sea válido para realizar operaciones

## Troubleshooting

### Error 401: No autenticado
- Verifica que tengas un token JWT válido
- Intenta hacer login nuevamente

### Error 404: Recurso no encontrado
- Verifica que el ID del tour sea correcto
- El tour puede haber sido eliminado

### Error de Validación
- Completa todos los campos requeridos (marcados con *)
- Respeta los requisitos mínimos de caracteres

## Próximas Mejoras Sugeridas

- Agregar búsqueda y filtrado en la tabla
- Implementar paginación para listas grandes
- Agregar carga de imágenes directa
- Agregar historial de cambios
- Exportar a CSV/PDF
