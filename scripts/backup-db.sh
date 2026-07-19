#!/bin/sh
set -e

BACKUP_DIR=${BACKUP_DIR:-/backups}
RETENTION_DAYS=${RETENTION_DAYS:-7}
DB_HOST=${DB_HOST:-postgres}
DB_USER=${DB_USER:-kusiqumir}
DB_NAME=${DB_NAME:-kusiqumir}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"

echo "[$(date)] Iniciando backup de ${DB_NAME}..."
pg_dump -h "${DB_HOST}" -U "${DB_USER}" "${DB_NAME}" | gzip > "${FILENAME}"
echo "[$(date)] Backup completado: ${FILENAME}"

# Limpiar backups antiguos
find "${BACKUP_DIR}" -name "${DB_NAME}_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete
echo "[$(date)] Limpieza completada (retención: ${RETENTION_DAYS} días)"
