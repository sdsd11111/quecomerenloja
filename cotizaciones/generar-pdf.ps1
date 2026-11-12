# ============================================================
#  Genera el PDF de una cotización con Chrome / Edge en modo headless
#  Uso:
#    .\generar-pdf.ps1                          -> plantilla-cotizacion.html
#    .\generar-pdf.ps1 .\COT-2026-001.html      -> ese archivo
# ============================================================
param(
  [string]$Html = "plantilla-cotizacion.html",
  [string]$SalidaPdf = ""
)

$ErrorActionPreference = "Stop"
$base = Split-Path -Parent $MyInvocation.MyCommand.Path

# --- Localizar el HTML ---
$htmlPath = if ([System.IO.Path]::IsPathRooted($Html)) { $Html } else { Join-Path $base $Html }
if (-not (Test-Path $htmlPath)) { throw "No se encontró el archivo: $htmlPath" }

# --- Localizar Chrome o Edge ---
$navegadores = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ }

if (-not $navegadores) { throw "No se encontró Chrome ni Edge instalado." }
$navegador = $navegadores[0]

# --- Ruta de salida ---
$nombrePdf = if ($SalidaPdf) {
  $SalidaPdf
} else {
  Join-Path $base ("salida\" + [System.IO.Path]::GetFileNameWithoutExtension($htmlPath) + ".pdf")
}
$nombrePdf = [System.IO.Path]::GetFullPath($nombrePdf)
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $nombrePdf) | Out-Null

$uri = ([System.Uri]$htmlPath).AbsoluteUri
$perfilTemporal = Join-Path $env:TEMP ("cotizacion-chrome-" + [guid]::NewGuid().ToString("N").Substring(0, 8))

Write-Host "Navegador : $navegador"
Write-Host "HTML      : $htmlPath"
Write-Host "PDF       : $nombrePdf"

$argumentos = @(
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--no-pdf-header-footer",
  "--run-all-compositor-stages-before-draw",
  "--virtual-time-budget=4000",
  "--user-data-dir=$perfilTemporal",
  "--print-to-pdf=$nombrePdf",
  $uri
)

# Chrome escribe su log en stderr: se silencia sin tratarlo como error fatal
$anteriorErrorAction = $ErrorActionPreference
$ErrorActionPreference = "Continue"
& $navegador @argumentos 2>&1 | Out-Null
$ErrorActionPreference = $anteriorErrorAction

Start-Sleep -Milliseconds 800
if (-not (Test-Path $nombrePdf)) { throw "Chrome no generó el PDF. Revisa que el HTML cargue bien." }

# --- Limpieza del perfil temporal ---
Remove-Item -Recurse -Force $perfilTemporal -ErrorAction SilentlyContinue

$info = Get-Item $nombrePdf
Write-Host ("Listo: {0} ({1:N1} KB)" -f $info.FullName, ($info.Length / 1KB)) -ForegroundColor Green
