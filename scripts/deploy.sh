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

if [ -f .env ]; then
  echo "[deploy] Cargando variables de .env"
  export $(grep -v '^#' .env | xargs)
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

echo "[deploy] Iniciando deploy a $ENV..."
docker compose $COMPOSE_FILES up -d --build --remove-orphans
docker compose $COMPOSE_FILES exec -T postgres pg_isready -U kusiqumir || true

# Invalidar CDN si está configurado
if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ] && command -v aws >/dev/null 2>&1; then
  echo "[deploy] Invalidando caché de CloudFront ($CLOUDFRONT_DISTRIBUTION_ID)..."
  aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "/*" \
    --output json
  echo "[deploy] Invalidation enviada a CloudFront"
fi

echo "[deploy] Deploy completado a $ENV"
