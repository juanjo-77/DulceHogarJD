# Compila el APK de Dulce Hogar JD con las herramientas de Android de este computador.
#
# Se compila en una carpeta "taller" sin espacios ni tildes (C:\dh): las herramientas de C++
# de Android fallan con rutas como "JUAN JOSE PEÑA" o "Mama's_app". Al final el APK queda en
# Mama's_app\DulceHogarJD.apk. Uso (desde la carpeta app):  npm run apk
param([string]$Taller = 'C:\dh')
$ErrorActionPreference = 'Stop'

$app = Split-Path -Parent $PSScriptRoot
$raiz = Split-Path -Parent $app
$copia = Join-Path $Taller 'app'
$sdk = Join-Path $Taller 'sdk'

function Paso([string]$texto) { Write-Host "`n==> $texto" -ForegroundColor Magenta }

# Ajustes del proyecto Android generado. Se pueden aplicar varias veces sin duplicarse.
function Ajustar-Android {
  $sinBom = New-Object Text.UTF8Encoding $false
  # Poca memoria en este PC: poca RAM para Gradle y un solo tipo de procesador (arm64,
  # el de todos los celulares de los últimos años).
  $props = (Resolve-Path 'android\gradle.properties').Path
  $lineas = [IO.File]::ReadAllLines($props) | Where-Object { $_ -notmatch '^(org\.gradle\.workers\.max|kotlin\.daemon\.jvmargs)=' }
  $lineas = $lineas `
    -replace '^reactNativeArchitectures=.*', 'reactNativeArchitectures=arm64-v8a' `
    -replace '^org\.gradle\.jvmargs=.*', 'org.gradle.jvmargs=-Xmx1536m -XX:MaxMetaspaceSize=512m' `
    -replace '^org\.gradle\.parallel=.*', 'org.gradle.parallel=false'
  [IO.File]::WriteAllLines($props, [string[]]($lineas + 'org.gradle.workers.max=2' + 'kotlin.daemon.jvmargs=-Xmx768m'), $sinBom)

  # Windows no acepta rutas de más de 260 letras y las librerías nativas generan rutas
  # larguísimas: con este límite CMake acorta los nombres de sus archivos intermedios.
  $app = (Resolve-Path 'android\app\build.gradle').Path
  $texto = [IO.File]::ReadAllText($app)
  if ($texto -notmatch 'CMAKE_OBJECT_PATH_MAX') {
    $linea = "`$1defaultConfig {`n`$1    externalNativeBuild { cmake { arguments '-DCMAKE_OBJECT_PATH_MAX=240' } }"
    [IO.File]::WriteAllText($app, ($texto -replace '(?m)^(\s*)defaultConfig \{', $linea), $sinBom)
  }
}

New-Item -ItemType Directory -Force $Taller | Out-Null

Paso 'Android SDK visible sin espacios (es un enlace, no una copia)'
if (-not (Test-Path $sdk)) {
  cmd /c mklink /J "$sdk" "$(Join-Path $env:LOCALAPPDATA 'Android\Sdk')" | Out-Null
}

Paso "Copiando la app a $copia (solo lo que cambió)"
# Se excluyen con ruta completa: un nombre suelto (p. ej. "dist") también saltaría las
# carpetas dist de las librerías dentro de node_modules.
$excluir = 'android', 'ios', '.expo', 'dist' | ForEach-Object { Join-Path $app $_ }
robocopy $app $copia /MIR /MT:8 /R:1 /W:1 /NFL /NDL /NJH /NJS /NP /XD @excluir | Out-Null
if ($LASTEXITCODE -ge 8) { throw 'No se pudo copiar el proyecto.' }

$env:ANDROID_HOME = $sdk
$env:GRADLE_USER_HOME = Join-Path $Taller 'gradle'
# Java falla con la carpeta temporal del usuario ("Unable to establish loopback connection")
# porque la ruta tiene Ñ: se le da una carpeta temporal propia.
$temporal = Join-Path $Taller 'tmp'
New-Item -ItemType Directory -Force $temporal | Out-Null
$env:TEMP = $temporal
$env:TMP = $temporal
$env:JAVA_TOOL_OPTIONS = "-Djava.io.tmpdir=$temporal -Djdk.net.unixdomain.tmpdir=$temporal"
$env:NODE_ENV = 'production'   # usa app\.env.production (la dirección de Render)
if (-not $env:JAVA_HOME) {
  $env:JAVA_HOME = (Get-ChildItem 'C:\Program Files\Eclipse Adoptium' -Directory -Filter 'jdk-17*' | Select-Object -First 1).FullName
}

Push-Location $copia
try {
  # Sin --clean: así se reutiliza lo ya compilado (la parte nativa tarda mucho la primera vez).
  Paso 'Generando el proyecto Android desde app.json'
  npx expo prebuild --platform android --no-install
  if ($LASTEXITCODE) { throw 'Falló expo prebuild.' }
  Ajustar-Android


  Paso 'Compilando el APK (la primera vez tarda bastante: descarga Gradle y librerías)'
  Push-Location android
  try {
    .\gradlew.bat assembleRelease --no-daemon
    if ($LASTEXITCODE) { throw 'Falló la compilación de Gradle.' }
  } finally { Pop-Location }

  $apk = Join-Path $copia 'android\app\build\outputs\apk\release\app-release.apk'
  $destino = Join-Path $raiz 'DulceHogarJD.apk'
  Copy-Item $apk $destino -Force
  Paso "Listo: $destino ($([math]::Round((Get-Item $destino).Length / 1MB, 1)) MB)"
} finally { Pop-Location }
