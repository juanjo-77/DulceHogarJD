# Dulce Hogar JD

App para manejar la lencería de hogar **Dulce Hogar JD**: inventario, ventas de contado, fiados, plan separe, abonos con recibo, pedidos de clientes, surtido, caja diaria, devoluciones y un resumen mensual de cómo va el negocio. Hecha para usarse desde el celular, con letra grande y botones claros.

## Cómo está armada

Un **monolito liviano**: un solo programa en C# guarda todo y la app del celular le pregunta los datos.

```
Mama's_app/
├── backend/DulceHogar.Api/   ← C# (.NET 10, Minimal APIs, EF Core + Postgres)
│   ├── Entidades/            ← las tablas: Producto, Cliente, Venta, Abono, Encargo, Surtido…
│   ├── Features/<Tema>/      ← por tema: *Endpoints (rutas), *Servicio (lógica), *Dtos (lo que viaja)
│   └── Data/                 ← conexión, migraciones y datos de ejemplo
├── app/                      ← Expo (React Native + TypeScript): la app del celular
├── Dockerfile                ← cómo Render arma el backend
└── render.yaml               ← el servicio de Render, listo para "Blueprint"
```

- **Base de datos:** Postgres en **Neon** (las fotos también se guardan ahí).
- **Plata:** pesos enteros (`long`). **Hora:** siempre la de Colombia.
- **Secretos** (conexión, PIN, teléfono): solo en variables de entorno, nunca en el repositorio.

## Desplegar en internet

Así la app funciona en el celular de tu mamá aunque el computador esté apagado.

### 1. Neon (base de datos)
1. En [neon.com](https://neon.com) crea un proyecto. La región de Render en `render.yaml` debe ser la misma (hoy: Neon `us-east-2` → Render `ohio`).
2. En **Connect**, desactiva **Connection pooling** y copia la cadena (la que **no** dice `-pooler`). Se ve así:
   `postgresql://usuario:clave@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`
3. No hace falta crear tablas: el backend las crea solo al arrancar.

### 2. GitHub
Sube la carpeta `Mama's_app` a un repositorio **privado**. El `.gitignore` ya deja fuera `node_modules`, `bin`, `obj` y los datos locales.

### 3. Render (backend)
1. **New → Blueprint** → elige el repositorio. Render lee `render.yaml` y te pide 3 valores:

   | Variable | Valor |
   |---|---|
   | `ConnectionStrings__Default` | la cadena de Neon |
   | `Acceso__Pin` | el PIN del negocio (4 a 8 números) |
   | `Negocio__Telefono` | el WhatsApp del negocio (10 números) |

2. Cuando termine, copia la dirección del servicio (algo como `https://dulce-hogar-api.onrender.com`) y prueba `…/api/salud`: debe decir `"ok":true`.

> En el plan gratis Render "se duerme" tras 15 minutos sin uso: la primera vez del día la app muestra *"Abriendo tu negocio…"* y puede tardar hasta un minuto.

### 4. La app (APK)
La dirección del servidor está en `app/.env.production` (y en `app/eas.json` para EAS): hoy `https://dulcehogarjd.onrender.com`.

**En este computador** (Android Studio / SDK instalados), desde la carpeta `app`:

```bash
npm run apk
```

El script `app/scripts/compilar-apk.ps1` copia la app a `C:\dh` (sin espacios ni tildes, que rompen las herramientas de Android), genera el proyecto Android desde `app.json`, compila solo para `arm64-v8a` y deja el resultado en **`Mama's_app\DulceHogarJD.apk`**. La primera vez tarda bastante; las siguientes, menos. `C:\dh` se puede borrar cuando quieras (se vuelve a crear).

**O en la nube con EAS** (sin Android Studio): `npx eas-cli@latest build -p android --profile preview`.

Para instalarlo: pasa el `.apk` al celular de tu mamá (WhatsApp, cable o Drive), ábrelo y permite "instalar apps de esta fuente". La primera vez pide el PIN. Para actualizarla, se instala el APK nuevo encima: los datos viven en Neon, no en el celular.

## PIN y WhatsApp del negocio
- **PIN** (`Acceso__Pin`, de 4 a 8 números; vacío = sin PIN): se pide una vez por celular y queda guardado cifrado. Tras 8 intentos fallidos esa conexión se bloquea un minuto. Para cambiarlo, cambia la variable en Render; la app lo pedirá de nuevo.
- **Teléfono** (`Negocio__Telefono`): sale en recibos y estados de cuenta. Se pone solo al crear la base; luego se cambia en **Ajustes → Tu negocio**. Los WhatsApps salen de la cuenta de WhatsApp del celular desde donde se envían.

## Copias de seguridad
Neon guarda el historial de la base de datos y permite volver a un momento anterior (según tu plan). Además, **Ajustes → Exportar todo a Excel**.

## Trabajar en el computador
El backend necesita una base Postgres. Lo más fácil: en Neon crea una **rama** `desarrollo` y guarda su cadena solo en este computador:

```bash
cd backend/DulceHogar.Api
dotnet user-secrets set "ConnectionStrings:Default" "postgresql://…"
dotnet run -- --Demo:Seed=true
```

El PIN y el teléfono locales también están en `user-secrets` (fuera del repositorio). `Demo:Seed=true` llena una base **vacía** con datos de ejemplo: no lo uses contra la base real.

Para la app, en otra terminal:

```bash
cd app
npx expo start
```

Escanea el QR con **Expo Go** (mismo WiFi). Sin `EXPO_PUBLIC_API_URL`, la app busca el backend en el computador donde corre Expo. Si Metro se queda en "Starting Metro Bundler" en este PC, usa `npm run web:ci` (sin recarga automática).

| Tarea | Comando |
|---|---|
| Compilar backend | `dotnet build backend/DulceHogar.slnx` |
| Nueva migración | `cd backend/DulceHogar.Api && dotnet ef migrations add <Nombre> -o Data/Migraciones` |
| Revisar tipos de la app | `cd app && npm run typecheck` |

Las migraciones se aplican solas al arrancar el backend.
