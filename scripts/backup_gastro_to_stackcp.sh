#!/bin/bash
# ============================================================
# backup_gastro_to_stackcp.sh
# Backup diario: local loja_gastronomia → StackCP
# Autores: Qué Comer en Loja / VPS 178.238.238.158
# Cron: 0 8 * * * (3am hora Ecuador = 8am UTC)
# ============================================================

set -euo pipefail

# --- Config -----------------------------------------------
LOG="/var/log/backup_gastro.log"
BACKUP_DIR="/root/backups/gastronomia"
LOCAL_DB="loja_gastronomia"
LOCAL_USER="root"
REMOTE_HOST="mysql.us.stackcp.com"
REMOTE_PORT="46630"
REMOTE_USER="quecomerlojadinamic-313931562a"
REMOTE_PASS="{bS_c5HrdlrW"
REMOTE_DB="quecomerlojadinamic-313931562a"
APP_URL="https://www.quecomerenloja.com"
KEEP_DAYS=7
LOCKFILE="/tmp/backup_gastro.lock"

# --- Lock (evita solapamiento) ----------------------------
exec 200>"$LOCKFILE"
flock -n 200 || { echo "[$(date -Iseconds)] SKIP: backup ya en curso" >> "$LOG"; exit 0; }

mkdir -p "$BACKUP_DIR"
STAMP=$(date +%Y%m%d_%H%M%S)
DUMP_FILE="$BACKUP_DIR/gastro_${STAMP}.sql.gz"

log() { echo "[$(date -Iseconds)] $*" | tee -a "$LOG"; }

log "=== INICIO BACKUP ==="

# --- 1. Verificar que la DB local responde ----------------
LOCAL_COUNT=$(mysql -u "$LOCAL_USER" "$LOCAL_DB" -se "SELECT COUNT(*) FROM promociones_aliados;" 2>/dev/null) || {
  log "ERROR: DB local no responde"
  exit 1
}
log "Registros locales: $LOCAL_COUNT promociones"

# --- 2. Dump local → archivo comprimido ------------------
mysqldump -u "$LOCAL_USER" \
  --single-transaction \
  --no-tablespaces \
  --hex-blob \
  --routines \
  --triggers \
  "$LOCAL_DB" | gzip > "$DUMP_FILE"
log "Dump creado: $DUMP_FILE ($(du -sh "$DUMP_FILE" | cut -f1))"

# --- 3. Restaurar en StackCP (overwrite completo) --------
# Descomprimimos y ejecutamos contra el StackCP remoto
zcat "$DUMP_FILE" | mysql \
  -h "$REMOTE_HOST" \
  -P "$REMOTE_PORT" \
  -u "$REMOTE_USER" \
  -p"$REMOTE_PASS" \
  --init-command="SET SESSION FOREIGN_KEY_CHECKS=0;" \
  "$REMOTE_DB" 2>/dev/null

REMOTE_COUNT=$(mysql \
  -h "$REMOTE_HOST" \
  -P "$REMOTE_PORT" \
  -u "$REMOTE_USER" \
  -p"$REMOTE_PASS" \
  "$REMOTE_DB" \
  -se "SELECT COUNT(*) FROM promociones_aliados;" 2>/dev/null)
log "Registros en StackCP tras sync: $REMOTE_COUNT promociones"

# --- 4. Validar integridad: mismo count en ambos ---------
if [ "$LOCAL_COUNT" -ne "$REMOTE_COUNT" ]; then
  log "ALERTA: conteos distintos (local=$LOCAL_COUNT, remote=$REMOTE_COUNT)"
else
  log "OK: sincronización verificada ($LOCAL_COUNT = $REMOTE_COUNT)"
fi

# --- 5. Smoke test: la app responde ----------------------
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$APP_URL/api/promos" || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
  log "OK: App responde HTTP $HTTP_CODE"
else
  log "ALERTA: App retornó HTTP $HTTP_CODE"
fi

# --- 6. Limpiar backups viejos ---------------------------
find "$BACKUP_DIR" -name "*.sql.gz" -mtime "+$KEEP_DAYS" -delete
REMAINING=$(ls "$BACKUP_DIR" | wc -l)
log "Backups retenidos: $REMAINING"

log "=== FIN BACKUP OK ==="
