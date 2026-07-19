# 🚀 Guía Correcta para Levantar los Servicios

## Requisitos Previos

1. **Node.js** (v20+) y **pnpm** instalados
2. **PostgreSQL** corriendo localmente en `localhost:5432`
3. Credenciales PostgreSQL: usuario `postgres`, contraseña `postgres`

---

## 📋 Orden Correcto de Arranque

### Paso 1: Levantar la Base de Datos (PostgreSQL)

Asegúrate de que PostgreSQL esté corriendo:

```bash
# En Linux/Mac
brew services start postgresql

# En Windows (si está instalado)
net start PostgreSQL
```

Verifica que está disponible:
```bash
psql -U postgres -h localhost
```

---

### Paso 2: Preparar el Backend

#### 2a. Instalar dependencias del backend
```bash
cd backend
pnpm install
```

#### 2b. Generar cliente Prisma
```bash
pnpm run prisma:generate
```

#### 2c. Ejecutar migraciones (crea tablas)
```bash
pnpm run prisma:migrate
```

#### 2d. Seed de datos (opcional - carga datos iniciales)
```bash
pnpm run prisma:seed
```

---

### Paso 3: Levantar Backend (NestJS)

**Opción A - Desarrollo (con hot reload):**
```bash
cd backend
pnpm run start:dev
```

**Opción B - Producción:**
```bash
cd backend
pnpm run build
pnpm run start:prod
```

✅ El backend estará disponible en: **http://localhost:3000**

---

### Paso 4: Preparar el Frontend (en otra terminal)

#### 4a. Instalar dependencias del frontend
```bash
# Vuelve a la raíz del proyecto
cd ..
pnpm install
```

---

### Paso 5: Levantar Frontend (Angular)

**Opción A - Desarrollo (con hot reload):**
```bash
pnpm start
```

**Opción B - Build y servir:**
```bash
pnpm run build
pnpm run serve:ssr:kusiqumir_page
```

✅ El frontend estará disponible en: **http://localhost:4200**

---

## 🔗 Acceso a Servicios

| Servicio | URL | Puerto |
|----------|-----|--------|
| Frontend (Angular) | http://localhost:4200 | 4200 |
| Backend (NestJS) | http://localhost:3000 | 3000 |
| API Docs (Swagger) | http://localhost:3000/api | 3000 |
| Base de Datos | localhost:5432 | 5432 |
| Prisma Studio | http://localhost:5555 | 5555 |

---

## 📱 Dashboard de Tours (después de levantar)

Una vez ambos servicios están corriendo:

1. Ve a **http://localhost:4200**
2. Navega a **http://localhost:4200/admin/tours**
3. Login si es necesario
4. ¡Gestiona tours!

---

## 🛠️ Solución de Problemas

### Error: "ENOENT: no such file or directory"
```bash
# Regenerar prisma client
cd backend
pnpm run prisma:generate
```

### Error: "connect ECONNREFUSED 127.0.0.1:5432"
```bash
# PostgreSQL no está corriendo
# Reinicia PostgreSQL:
brew services restart postgresql  # Mac
# o sudo systemctl restart postgresql  # Linux
```

### Error: "Unknown column in field list"
```bash
# Tablas no existen, ejecuta migraciones:
cd backend
pnpm run prisma:migrate
```

### Error: "Cannot find module"
```bash
# Dependencias no instaladas
pnpm install
cd backend && pnpm install
```

---

## 🔑 Generar Token JWT para Dashboard

El dashboard requiere autenticación. Para obtener token:

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# Respuesta:
# {
#   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# }

# 2. Copiar el token y usarlo en requests:
curl http://localhost:4200/admin/tours \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎯 Configuración de Puertos

Si necesitas cambiar puertos:

**Backend (.env):**
```env
PORT=3001  # Cambiar a otro puerto
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kusiqumir"
```

**Frontend (package.json):**
```json
{
  "scripts": {
    "start": "ng serve --host 0.0.0.0 --port 4300"  // Cambiar puerto
  }
}
```

---

## ✅ Checklist de Arranque Rápido

```bash
# Terminal 1 - Backend
cd backend
pnpm install
pnpm run prisma:generate
pnpm run prisma:migrate
pnpm run start:dev

# Terminal 2 - Frontend  
pnpm install
pnpm start

# Terminal 3 - (Opcional) Prisma Studio para ver DB
cd backend && pnpm run prisma:studio
```

---

## 📌 Comandos Útiles

```bash
# Ver todos los scripts disponibles
pnpm run

# Limpiar y reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Ver estado de la base de datos
cd backend && pnpm run prisma:studio

# Ejecutar tests
pnpm run test           # Frontend
cd backend && pnpm run test  # Backend

# Generar documentación API (Swagger)
# Disponible automáticamente en http://localhost:3000/api
```

---

¡Listo! 🎉 Ya tienes todo configurado para desarrollar.
