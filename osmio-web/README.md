# Osmio

Aplicación web de seguimiento de entrenamiento de fuerza y deportes de combate, con análisis de carga, historial, consistencia y nutrición.

Construida con React 19, TypeScript, Vite, Tailwind CSS v4 y Supabase (PostgreSQL + Auth).

---

## Stack

| Capa | Tecnología |
|------|-----------|
| UI | React 19 + React Router 7 |
| Lenguaje | TypeScript 6 (`strict`) |
| Build | Vite 8 |
| Estilos | Tailwind CSS v4 (tokens en `@theme`, sin config JS) |
| Iconos | lucide-react |
| Estado | Zustand |
| Animaciones | Motion (`motion/react`) + Lenis (scroll suave) |
| 3D / efectos | Three.js (`CyberBackground`) |
| Datos / Auth | Supabase (PostgreSQL, Auth, RLS) |
| Lint | oxlint |

---

## Inicio rápido

```bash
npm install
cp .env.example .env   # completar credenciales de Supabase
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### Variables de entorno

`.env` no se versiona (está en `.gitignore`). El repo incluye `.env.example` con la plantilla:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

Ambas son obligatorias: `src/services/supabase/client.ts` lanza error al cargar si faltan.

### Autenticación (Supabase Auth)

Los emails de confirmación y de recuperación de contraseña vuelven a la app. En
**Authentication → URL Configuration** del proyecto:

- `Site URL`: el origen de la app (`http://localhost:5173` en desarrollo).
- `Redirect URLs`: ese origen con comodín (`http://localhost:5173/**`).

Al desplegar, añade el dominio de producción a ambas listas. El enlace de recuperación
apunta a `/reset-password`: si la sesión temporal del enlace falta o caducó, la pantalla
lo indica y ofrece pedir uno nuevo.

### Scripts

```bash
npm run dev       # servidor de desarrollo
npm run build     # tsc -b + build de producción
npm run lint      # oxlint
npm run preview   # previsualiza el build
npm run bones     # regenera los skeleton loaders (ver más abajo)
```

---

## Base de datos

Las migraciones están en `migrations/` y se aplican **en orden** desde Supabase → SQL Editor.

| Archivo | Contenido |
|---------|-----------|
| `000_core_schema.sql` | **Ejecutar primero.** Tablas base (perfiles, sesiones, series, combate, nutrición, metas, recuperación), índices y RLS owner-only |
| `001_exercises_extend.sql` | Extiende `exercises` (categoría, equipo, grupo muscular, patrón de movimiento) |
| `002_routines.sql` | `routines` + `routine_exercises` con RLS owner-only |
| `003_seed_exercises_part_01..20.sql` | Seed del catálogo de ejercicios (~5.200 registros) |
| `004_routine_dropset.sql` | Columnas `dropset` / `dropset_percent` en `routine_exercises` |
| `005_profile_age.sql` | Columna `profiles.age` (que `profiles.api.ts` ya intentaba guardar) |
| `006_views.sql` | Vistas de análisis con `security_invoker = true` |

Todas las tablas de usuario aplican **Row Level Security**: cada cliente solo lee y escribe sus propios registros (`auth.uid() = user_id`).

`006_views.sql` es obligatorio: sin `security_invoker`, las vistas se ejecutan con los privilegios de `postgres`, saltan RLS y la anon key podía leer datos de **todos** los usuarios.

Vistas usadas por el módulo de análisis: `strength_volume_by_week`, `strength_prs`, `combat_rounds_by_week`, `combat_total_rounds`, `training_consistency` y `daily_nutrition_totals`.

---

## Funcionalidades

### Autenticación y onboarding
Login con Supabase Auth y asistente inicial de configuración (`/setup`) para fijar datos corporales y metas.

### Hoy (`/dashboard`)
Tarjeta de entrenamiento del día, resumen de metas semanales, alertas y fila de registro rápido.

### Registro de entrenamiento
- **Selector de disciplina** (`/logging`)
- **Sesión de fuerza activa** (`/logging/strength`) — series, peso, repeticiones, RPE, descanso
- **Selector de ejercicios** (`/logging/strength/picker`) con búsqueda y filtros
- **Historial de ejercicio** (`/logging/strength/history`) — series previas
- **Registro de combate** (`/logging/combat`) — rondas de striking/grappling por posición

### Rutinas (`/strength/routine`)
Plantillas de rutina con ejercicios, posición, series/reps objetivo, peso actual, descanso, notas y soporte de drop set.

### Análisis
- **Fuerza** (`/analysis/strength`) — volumen por semana, tabla de PRs
- **Carga de combate** (`/analysis/combat`) — rondas por semana, balance striking/grappling
- **Consistencia** (`/analysis/consistency`) — mapa de calor de adherencia

### Historial (`/history`)
Calendario mensual con estado por día y detalle por fecha (`/history/:date`).

### Nutrición
- **Dashboard** (`/nutrition`) — calorías, macros, peso y tendencia
- **Registro rápido** (`/nutrition/quick-add`) — búsqueda de alimentos desde base local
- **Detalle diario** (`/nutrition/:date`)

### Perfil y ajustes
Metas semanales, notificaciones, datos corporales y preferencias.

---

## Rutas

| Ruta | Pantalla |
|------|----------|
| `/` | Redirección según sesión |
| `/login` | Login |
| `/setup` | Onboarding |
| `/dashboard` | Hoy |
| `/logging` | Selector de disciplina |
| `/logging/strength` | Sesión de fuerza |
| `/logging/strength/picker` | Selector de ejercicios |
| `/logging/strength/history` | Historial de ejercicio |
| `/logging/combat` | Registro de combate |
| `/strength/routine` | Mi rutina |
| `/analysis/strength` | Análisis de fuerza |
| `/analysis/combat` | Carga de combate |
| `/analysis/consistency` | Consistencia |
| `/history` | Calendario mensual |
| `/history/:date` | Detalle del día |
| `/nutrition` | Dashboard de nutrición |
| `/nutrition/quick-add` | Registro rápido |
| `/nutrition/:date` | Detalle nutricional |
| `/profile` | Perfil |
| `/settings` | Ajustes |

Todas las rutas salvo `/login` están protegidas por `AuthGuard` + `DesktopLayout`.

---

## Estructura

```
src/
├── app/                 # Router, providers y layout raíz
├── design-system/       # Tokens, tema y componentes base
│   ├── components/      # Button, Card, GreenCard, GreenButton, Sidebar…
│   ├── tokens.ts        # Escala de espaciado, radios y sombras
│   └── theme.ts         # Paleta y Tipografía
├── features/            # Módulos por dominio
│   ├── auth/            # Login
│   ├── onboarding/      # Splash y asistente inicial
│   ├── home/            # Dashboard de hoy
│   ├── logging/         # Registro de fuerza y combate
│   ├── strength/        # Rutinas y progresión
│   ├── analysis/        # Gráficas y mapas de calor
│   ├── history/         # Calendario y detalle
│   ├── nutrition/       # Calorías, macros y alimentos
│   ├── profile/         # Perfil y metas
│   └── settings/        # Preferencias
├── services/
│   ├── api/             # Clientes Supabase por dominio
│   ├── supabase/        # Instancia del cliente
│   └── storage/         # Caché local
├── shared/              # Tipos, hooks, utils y datos compartidos
│   ├── data/            # Base local de alimentos
│   └── utils/           # Fechas, cálculo de calorías
├── store/               # Stores Zustand (sesión, usuario, nutrición)
└── index.css            # Tokens @theme y estilos globales
```

### Alias
`@/` apunta a `src/` (configurado en `vite.config.ts`).

---

## Design system

Tokens definidos en `src/index.css` con `@theme` de Tailwind v4. Tipografías: **Inter** (texto) y **JetBrains Mono** (datos, cifras y labels en mayúsculas).

Componentes base reutilizables: `Button`, `Card`, `GreenCard`, `GreenButton`, `GreenProgress`, `GreenTag`, `Chip`, `Stepper`, `ProgressBar`, `SegmentedControl`, `PageHeader`, `PageBackdrop`, `SectionHeader`, `DesktopLayout`, `Sidebar`, `BottomNav`.

`AnalysisTabs` implementa las pestañas de la sección de análisis.

Las animaciones de tabs, botones y navegación usan `motion/react` (indicadores con `layoutId`, `AnimatePresence` en el sidebar móvil y transiciones entre rutas). El scroll suave lo aporta `SmoothScroll` (`src/shared/components/SmoothScroll.tsx`), que monta Lenis sobre el scroll de la ventana, sincroniza su loop con Motion y se desactiva con `prefers-reduced-motion`. Al cambiar de ruta, la posición vuelve al inicio.

### Skeleton loaders

Los estados de carga usan [boneyard-js](https://boneyard.vercel.app): el contenido real se envuelve en `<Skeleton name="..." loading={...}>` y, mientras `loading` es `true`, se pintan huesos medidos del layout de verdad (no placeholders inventados a mano). Configuración en `boneyard.config.json`; la salida vive en `src/bones/` y se registra una sola vez en `src/main.tsx`.

La estructura que se mide se declara en `fixture`, que solo se renderiza durante el build (`window.__BONEYARD_BUILD`). Todos los fixtures viven en `src/design-system/skeletons/fixtures.tsx` y deben mantenerse alineados con el layout real de cada pantalla:

- Copia las clases reales del contenido (radios, bordes, paddings, grid) para que los huesos caigan donde caerá el contenido.
- Nada de `vh` ni `min-h-screen` (salvo `AppShellSkeleton`, que representa el shell): boneyard reescala según la altura del contenedor y una captura dependiente del viewport deformaría la tarjeta.
- Las hojas usan `bg-surface-container-high`; sin texto de relleno, porque el hueso ya comunica la forma.

Patrón de uso:

```tsx
<Skeleton
  name="dashboard-hoy"
  loading={loading}
  select="viewport"
  transition={180}
  className="block"
  fixture={<DashboardHoySkeletonFixture />}
  fallback={<DashboardHoySkeletonFixture />}
>
  {loading ? null : <div>…contenido real…</div>}
</Skeleton>
```

`select="viewport"` hace que el breakpoint se resuelva por el ancho de ventana (el CLI captura así), no por el contenedor. `{loading ? null : …}` mantiene la altura del host determinista para que el paso de huesos a contenido no salte. `fallback` cubre el caso de un hueso no registrado (build de producción sin captura): se ve el mismo fixture, estático.

Los encabezados (`PageHeader`) y las pestañas de análisis (`AnalysisTabs`) se renderizan siempre; los contadores dinámicos se sustituyen por `StatusPillBone` mientras cargan, fuera del host de boneyard. `AppShellSkeleton` (auth/redirect) y `SessionCardSkeleton` (historial del panel de detalle, que vive dentro de una hoja y no es capturable) están escritos a mano.

| Skeleton | Ruta | Pantalla |
|----------|------|----------|
| `dashboard-hoy` | `/dashboard` | `DashboardHoy` |
| `my-routine` | `/strength/routine` | `MyRoutine` |
| `monthly-calendar` | `/history` | `MonthlyCalendar` |
| `day-detail` | `/history/:date` | `DayDetail` |
| `nutrition-dashboard` | `/nutrition` | `NutritionDashboard` (solo la rejilla principal) |
| `nutrition-recommendation` | `/nutrition` | `NutritionRecommendationCard` |
| `day-nutrition-detail` | `/nutrition/:date` | `DayNutritionDetail` |
| `strength-analysis` | `/analysis/strength` | `StrengthAnalysis` |
| `combat-load-analysis` | `/analysis/combat` | `CombatLoadAnalysis` |
| `consistency-map` | `/analysis/consistency` | `ConsistencyMap` |
| `profile-settings` | `/profile` | `ProfileSettings` |
| `exercise-picker` | `/logging/strength/picker` | `ExercisePicker` |
| `exercise-history` | `/logging/strength/history` | `ExerciseHistory` |

Regeneración (el CLI necesita una sesión iniciada, por eso reutiliza un Chrome ya autenticado). Las rutas que recorre están en `boneyard.config.json` → `routes`; si añades una pantalla con skeleton, añádela también ahí:

```bash
# 1. Chrome con puerto de depuración y perfil propio
google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-bones

# 2. Inicia sesión en http://localhost:5173 y luego (con `npm run dev` activo):
npm run bones -- --cdp 9222
```

`boneyard-js` detecta el modo oscuro por la clase `.dark` en `<html>`; `applyTheme` la sincroniza con `data-theme`. Los huesos de `Bone`/`StatusPillBone` pulsan con `animate-pulse` y respetan `prefers-reduced-motion` (`motion-reduce:animate-none`); el shimmer de boneyard se desactiva con la preferencia del sistema.

---

## Convenciones

- Imports con alias `@/` para todo lo bajo `src/`
- Sin estilos inline: las clases de Tailwind se componentizan en el design system
- Las consultas a datos viven en `src/services/api/*.api.ts`; las pantallas no accedan a Supabase directamente
- Optimistic updates mediante stores Zustand para datos de sesión

---

## Estado actual

- La cadena de migraciones se puede reconstruir desde cero: `000` → `001` → `002` → `003` → `004` → `005` → `006`
- Migraciones `004`, `005` y `006` aplicadas y verificadas en el proyecto de Supabase
- `FINAL FOOD DATASET` en revisión para sustituir la base local de alimentos
- Suite de tests con Vitest (`npm test`); CI ejecuta `lint`, `typecheck`, `test` y `build`

---

## Licencia

Proyecto privado. Todos los derechos reservados.
