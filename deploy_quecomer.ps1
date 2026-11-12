$ErrorActionPreference = 'Continue'

# Parámetros del VPS y de este proyecto
$keyDst = "$PSScriptRoot\vps-entrada\agenda_vps_nueva"
$deployKeySrc = "$PSScriptRoot\vps-entrada\quecomer_deploy_key"
$vpsHost = "root@178.238.238.158"
$appFolder = "/root/que-comer-en-loja"
$repoUrl = "git@github.com:sdsd11111/quecomerenloja.git"
$containerName = "quecomerenloja-app"
$projectRoot = $PSScriptRoot

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Desplegando Qué Comer en Loja al VPS     " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Configurar la deploy key en el VPS si no existe
Write-Host "`n[1/5] Verificando clave Deploy en el VPS..." -ForegroundColor Yellow
& scp -i $keyDst -o StrictHostKeyChecking=no $deployKeySrc "${vpsHost}:/root/.ssh/quecomer_deploy_key"

# 2. Configurar SSH config en el VPS para usar esta deploy key al clonar este repositorio
$setupSshCmd = @'
set -e
chmod 600 /root/.ssh/quecomer_deploy_key 2>/dev/null || true
# Si la clave de deploy no es valida para OpenSSH, se usa la que ya funciona en el VPS
if ! ssh-keygen -y -f /root/.ssh/quecomer_deploy_key >/dev/null 2>&1; then
    echo "Clave de deploy invalida: se usa /root/.ssh/id_ed25519"
    KEYFILE=/root/.ssh/id_ed25519
else
    KEYFILE=/root/.ssh/quecomer_deploy_key
fi
if ! grep -q "github-quecomer" /root/.ssh/config 2>/dev/null; then
    mkdir -p /root/.ssh
    echo -e "\nHost github-quecomer\n  HostName github.com\n  User git\n  IdentityFile $KEYFILE\n  StrictHostKeyChecking no\n" >> /root/.ssh/config
else
    sed -i "s#IdentityFile .*#  IdentityFile $KEYFILE#" /root/.ssh/config
fi
chmod 600 /root/.ssh/config
echo "Clave de deploy en uso: $KEYFILE"
'@
& ssh -i $keyDst -o StrictHostKeyChecking=no $vpsHost $setupSshCmd

# 3. Sincronizar .env.local
Write-Host "`n[2/5] Asegurando carpeta remota y sincronizando .env.local..." -ForegroundColor Yellow
& ssh -i $keyDst -o StrictHostKeyChecking=no $vpsHost "mkdir -p $appFolder"
& scp -i $keyDst -o StrictHostKeyChecking=no "$projectRoot\.env.local" "${vpsHost}:${appFolder}/.env.local"

# 4. Clonar o actualizar y compilar Docker
Write-Host "`n[3/5] Descargando código desde GitHub y compilando contenedor Docker..." -ForegroundColor Yellow
$deployCmd = @"
set -e
if [ ! -d "$appFolder/.git" ]; then
    echo "Clonando repositorio con clave SSH..."
    git clone git@github-quecomer:sdsd11111/quecomerenloja.git $appFolder
fi

cd $appFolder
echo "Sincronizando con rama main..."
git stash
git pull origin main
git log --oneline -1

echo "Reconstruyendo contenedor Docker en puerto 3006..."
docker compose up -d --build
docker ps --filter "name=$containerName"

echo "Limpiando la cache de builds antigua para que el disco no se llene..."
docker builder prune -f --filter "until=168h" 2>&1 | tail -2
echo "Disco tras la limpieza:"
df -h / | tail -1
"@
& ssh -i $keyDst -o StrictHostKeyChecking=no $vpsHost $deployCmd

# 5. Configurar Caddy reverse proxy
Write-Host "`n[4/5] Configurando Caddyfile con dominio quecomerenloja.com..." -ForegroundColor Yellow
$caddyCmd = @'
if ! grep -q "quecomerenloja.com" /etc/caddy/Caddyfile 2>/dev/null; then
    cat << 'EOF' >> /etc/caddy/Caddyfile

quecomerenloja.com, www.quecomerenloja.com {
    encode gzip zstd

    handle /_next/static/* {
        header Cache-Control "public, max-age=31536000, immutable"
        reverse_proxy localhost:3006
    }

    reverse_proxy localhost:3006
}
EOF
    echo "Bloque agregado a Caddyfile."
fi

caddy reload --config /etc/caddy/Caddyfile
echo "Caddy recargado con éxito."
'@
& ssh -i $keyDst -o StrictHostKeyChecking=no $vpsHost $caddyCmd

# 6. Comprobación de salud local
Write-Host "`n[5/5] Probando respuesta en el puerto 3006 del VPS..." -ForegroundColor Yellow
$healthCmd = @'
sleep 3
echo "--- home ---"
curl -I -s http://localhost:3006 | head -n 1
echo "--- rutas clave ---"
for p in /formulario /admin/solicitudes /api/search/catalog; do
  echo "$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3006$p")  $p"
done
echo "--- version desplegada ---"
curl -s http://localhost:3006/api/admin/solicitudes -H "Cookie: admin_session_token=authenticated_mi_sitio_admin_2026" -o /dev/null -w "admin/solicitudes: %{http_code}\n"
'@
& ssh -i $keyDst -o StrictHostKeyChecking=no $vpsHost $healthCmd

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host " ¡DESPLIEGUE EN VPS FINALIZADO CON ÉXITO!               " -ForegroundColor Green
Write-Host " El contenedor está corriendo en el puerto 3006         " -ForegroundColor Green
Write-Host " Y Caddy está listo para recibir el dominio.            " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
