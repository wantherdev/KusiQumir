# Deploy — Kusi Q'umir

## Requisitos del servidor

- **SO**: Ubuntu 22.04+ / Debian 12+
- **Docker** 24+ y **Docker Compose** v2
- **Git**
- **Dominio**: `kusiqumir.com` y `www.kusiqumir.com` apuntando al servidor
- **Puertos**: 80 (HTTP), 443 (HTTPS) abiertos

---

## 1. Preparación inicial

```bash
# Clonar repositorio
git clone https://github.com/wantherdev/KusiQumir.git
cd KusiQumir

# Crear archivo .env desde ejemplo
cp backend/.env.example backend/.env
```

## 2. Variables de entorno

Editar `backend/.env` con valores reales de producción:

| Variable | Valor | Obligatorio |
|----------|-------|-------------|
| `POSTGRES_PASSWORD` | Contraseña segura (≥12 chars) | Sí |
| `JWT_SECRET` | Secreto seguro (≥32 chars) | Sí |
| `CSRF_SECRET` | Secreto seguro (≥32 chars) | Sí |
| `CSRF_SECURE` | `true` | Sí |
| `CORS_ORIGIN` | `https://kusiqumir.com,https://www.kusiqumir.com` | Sí |
| `SENTRY_DSN` | DSN de Sentry (vacío = desactivado) | No |
| `WHATSAPP_PHONE` | Número WhatsApp business | No |
| `SLACK_WEBHOOK_URL` | Webhook Slack para notificaciones deploy | No |
| `CLOUDFRONT_DISTRIBUTION_ID` | ID de distribución CloudFront | No |

Ejemplo mínimo para producción:

```env
POSTGRES_PASSWORD="una-contraseña-muy-segura-123"
JWT_SECRET="otro-secreto-muy-largo-de-al-menos-32-caracteres"
CSRF_SECRET="otro-secreto-para-csrf-de-al-menos-32-caracteres"
CSRF_SECURE=true
CORS_ORIGIN="https://kusiqumir.com,https://www.kusiqumir.com"
```

---

## 3. SSL (Let's Encrypt)

Ejecutar una sola vez para generar los certificados:

```bash
# Instalar certbot en el host
sudo apt install certbot

# Generar certificados
sudo certbot certonly --standalone -d kusiqumir.com -d www.kusiqumir.com

# Copiar a la ruta que espera nginx
sudo mkdir -p ssl
sudo cp /etc/letsencrypt/live/kusiqumir.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/kusiqumir.com/privkey.pem ssl/
sudo chown -R $(whoami):$(whoami) ssl/
```

> El contenedor `certbot-renew` renovará automáticamente los certificados cada 24h.

---

## 4. Desplegar

### Primer deploy

```bash
# Iniciar todos los servicios
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Verificar que los servicios están saludables
docker compose ps
```

### Actualización (deploys subsecuentes)

```bash
# Pull del código más reciente
git pull

# Reconstruir y reiniciar solo servicios con cambios
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Opcional: usar el script de deploy (requiere Slack webhook configurado)
bash scripts/deploy.sh production
bash scripts/deploy.sh production --dry-run  # Simular sin cambios
```

---

## 5. Migraciones de base de datos

Las migraciones de Prisma se ejecutan automáticamente al iniciar el backend (`pnpm start:prod` ejecuta `prisma migrate deploy`). Si se agregan nuevos modelos o campos:

```bash
# Local: crear migración
cd backend
pnpm prisma migrate dev --name descripcion-del-cambio

# Commitear la migración
git add prisma/migrations
git commit -m "feat: agregar migración ..."

# En producción, el backend ejecutará migrate deploy al iniciar
git pull
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Para cambios que no requieren migración formal (ej: añadir campos opcionales):

```bash
docker compose exec backend npx prisma db push
```

---

## 6. Monitoreo

### Logs

```bash
# Ver logs de todos los servicios
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
```

### Grafana (monitoreo)

```bash
# Iniciar stack de monitoreo
docker compose -f docker-compose.monitoring.yml up -d

# Acceder: http://<servidor>:3001 (usuario: admin, contraseña: definida en variables)
```

### Sentry

El error tracking con Sentry está integrado tanto en frontend como backend.
Configurar `SENTRY_DSN` en `.env` para activarlo.

---

## 7. CDN (CloudFront)

Si usas CloudFront:

```bash
# Configurar origin → nginx (puerto 443)
# Cache behaviors:
#   /assets/*, /chunk-*.js → 1 año (immutable)
#   /images/* → 30 días
#   default → 0 (no cachear HTML)

# Invalidar cache después de un deploy
aws cloudfront create-invalidation --distribution-id ID --paths "/*"
```

---

## 8. Backup

### Automático (diario, 7 días de retención)

El contenedor `pgbackup` realiza backups automáticos cada 24h.
Los archivos se guardan en `./backups/`.

### Manual

```bash
docker compose exec postgres pg_dump -U kusiqumir kusiqumir > backup-$(date +%Y%m%d).sql
```

### Restaurar

```bash
cat backup.sql | docker compose exec -T postgres psql -U kusiqumir kusiqumir
```

---

## 9. Health checks

| Servicio | Endpoint |
|----------|----------|
| Backend | `https://kusiqumir.com/api/v1/health` |
| Nginx | `https://kusiqumir.com/healthcheck.html` |
| Frontend | `https://kusiqumir.com/` |

---

## 10. Rollback

Si el deploy falla:

```bash
# El script deploy.sh tiene rollback automático.
# Manualmente:
git reset --hard HEAD~1
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

---

## Troubleshooting

### Error: "port 80/443 already in use"
```bash
sudo lsof -i :80 -i :443
# Detener el proceso que ocupa el puerto (ej: apache, nginx del host)
sudo systemctl stop apache2
```

### Error: "Connection refused" en backend
```bash
# Verificar que PostgreSQL está saludable
docker compose logs postgres

# Verificar variable DATABASE_URL en backend
docker compose exec backend env | grep DATABASE_URL
```

### Error: CSRF token inválido
```bash
# Verificar que CSRF_SECRET está configurado
docker compose exec backend env | grep CSRF_SECRET

# Las rutas públicas (contact, claims) pueden fallar si no están en CSRF_SKIP_PATHS
```

### Error: Uploads no disponibles
```bash
# Verificar el volume de uploads
docker compose exec backend ls -la /app/uploads
# Los uploads se almacenan en el volume docker 'uploads:/app/uploads'
```
