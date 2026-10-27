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
chmod 600 /root/.ssh/quecomer_deploy_key
if ! grep -q "github-quecomer" /root/.ssh/config 2>/dev/null; then
    mkdir -p /root/.ssh
    echo -e "\nHost github-quecomer\n  HostName github.com\n  User git\n  IdentityFile /root/.ssh/quecomer_deploy_key\n  StrictHostKeyChecking no\n" >> /root/.ssh/config
    chmod 600 /root/.ssh/config
fi
'@
& ssh -i $keyDst -o StrictHostKeyChecking=no $vpsHost $setupSshCmd

# 3. Sincronizar .env.local
Write-Host "`n[2/5] Asegurando carpeta remota y sincronizando .env.local..." -ForegroundColor Yellow
& ssh -i $keyDst -o StrictHostKeyChecking=no $vpsHost "mkdir -p $appFolder"
& scp -i $keyDst -o StrictHostKeyChecking=no "$projectRoot\.env.local" "${vpsHost}:${appFolder}/.env.local"

# 4. Clonar o actualizar y compilar Docker
Write-Host "`n[3/5] Descargando código desde GitHub y compilando contenedor Docker..." -ForegroundColor Yellow
$deployCmd = @"
if [ ! -d "$appFolder/.git" ]; then
    echo "Clonando repositorio con clave SSH..."
    git clone git@github-quecomer:sdsd11111/quecomerenloja.git $appFolder
fi

cd $appFolder
echo "Sincronizando con rama main..."
git stash
git pull origin main

echo "Reconstruyendo contenedor Docker en puerto 3006..."
docker compose up -d --build
docker ps --filter "name=$containerName"
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
curl -I -s http://localhost:3006 | head -n 5
'@
& ssh -i $keyDst -o StrictHostKeyChecking=no $vpsHost $healthCmd

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host " ¡DESPLIEGUE EN VPS FINALIZADO CON ÉXITO!               " -ForegroundColor Green
Write-Host " El contenedor está corriendo en el puerto 3006         " -ForegroundColor Green
Write-Host " Y Caddy está listo para recibir el dominio.            " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
