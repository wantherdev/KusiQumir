#!/bin/sh
set -e

ENV=${1:-production}
COMPOSE_FILES="-f docker-compose.yml"
CLOUDFRONT_DISTRIBUTION_ID=${CLOUDFRONT_DISTRIBUTION_ID:-}

case "$ENV" in
  staging)
    COMPOSE_FILES="$COMPOSE_FILES -f docker-compose.staging.yml"
    ;;
  production)
    COMPOSE_FILES="$COMPOSE_FILES -f docker-compose.prod.yml"
    ;;
  *)
    echo "Usage: $0 {staging|production}"
    exit 1
    ;;
esac

# ── Pre-flight checks ─────────────────────────────────────────────

if ! command -v docker >/dev/null 2>&1; then
  echo "[deploy] ERROR: docker no está instalado o no está en PATH"
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "[deploy] ERROR: docker compose no está disponible"
  exit 1
fi

if [ ! -f .env ]; then
  echo "[deploy] ERROR: No se encontró el archivo .env"
  exit 1
fi

echo "[deploy] Cargando variables de .env"
set -a; source .env; set +a

# Validar CORS_ORIGIN — cada origen debe empezar con http:// o https://
if [ -n "$CORS_ORIGIN" ]; then
  IFS=','
  for origin in $CORS_ORIGIN; do
    case "$origin" in
      http://*|https://*) ;;
      *)
        echo "[deploy] ERROR: CORS_ORIGIN contiene una URL inválida: $origin"
        exit 1
        ;;
    esac
  done
  unset IFS
fi

# Validar WHATSAPP_PHONE — solo dígitos, 10-15 caracteres
if [ -n "$WHATSAPP_PHONE" ]; then
  case "$WHATSAPP_PHONE" in
    *[!0-9]*)
      echo "[deploy] ERROR: WHATSAPP_PHONE debe contener solo dígitos"
      exit 1
      ;;
  esac
  if [ "${#WHATSAPP_PHONE}" -lt 10 ] || [ "${#WHATSAPP_PHONE}" -gt 15 ]; then
    echo "[deploy] ERROR: WHATSAPP_PHONE debe tener entre 10 y 15 dígitos"
    exit 1
  fi
fi

# Validar variables críticas
if [ -z "$JWT_SECRET" ] || [ "${#JWT_SECRET}" -lt 16 ]; then
  echo "[deploy] ERROR: JWT_SECRET debe tener al menos 16 caracteres"
  exit 1
fi
if [ -z "$POSTGRES_PASSWORD" ] || [ "${#POSTGRES_PASSWORD}" -lt 8 ]; then
  echo "[deploy] ERROR: POSTGRES_PASSWORD debe tener al menos 8 caracteres"
  exit 1
fi

# ── Rollback ──────────────────────────────────────────────────────

ROLLBACK() {
  echo "[deploy] ERROR: Health checks fallaron. Ejecutando rollback..."
  docker compose $COMPOSE_FILES down 2>/dev/null || true
  for svc in backend frontend nginx; do
    prev=$(cat /tmp/prev_${svc}.img 2>/dev/null || echo "")
    [ -n "$prev" ] && docker tag "$prev" "${svc}:latest" 2>/dev/null || true
  done
  docker compose $COMPOSE_FILES up -d --remove-orphans --wait 2>/dev/null || true
  echo "[deploy] Rollback completado. Saliendo con error."
  exit 1
}

# ── Deploy ────────────────────────────────────────────────────────

echo "[deploy] Iniciando deploy a $ENV..."

# Guardar imágenes actuales para posible rollback
for svc in backend frontend nginx; do
  docker compose $COMPOSE_FILES images --quiet "$svc" > /tmp/prev_${svc}.img 2>/dev/null || true
done

docker compose $COMPOSE_FILES up -d --build --remove-orphans --wait

# Health check post-deploy
echo "[deploy] Verificando estado de servicios..."
sleep 10
for svc in backend frontend; do
  if docker compose $COMPOSE_FILES ps --filter "health=healthy" --format "{{.Name}}" | grep -q "$svc"; then
    echo "[deploy] $svc saludable"
  else
    ROLLBACK
  fi
done

docker compose $COMPOSE_FILES exec -T postgres pg_isready -U "$POSTGRES_USER" || true

# Invalidar CDN si está configurado
if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ] && command -v aws >/dev/null 2>&1; then
  echo "[deploy] Invalidando caché de CloudFront ($CLOUDFRONT_DISTRIBUTION_ID)..."
  aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "/*" \
    --output json
  echo "[deploy] Invalidation enviada a CloudFront"
fi

echo "[deploy] Deploy completado exitosamente a $ENV"
