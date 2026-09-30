# Osmio

Aplicación web de seguimiento de entrenamiento de fuerza y deportes de combate, con análisis de carga, historial, consistencia y nutrición.

Construida con React 19, TypeScript, Vite, Tailwind CSS v4 y Supabase (PostgreSQL + Auth). Interfaz dark militar con acento "acid green".

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

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

Ambas son obligatorias: `src/services/supabase/client.ts` lanza error al cargar si faltan.

### Scripts

```bash
npm run dev       # servidor de desarrollo
npm run build     # tsc -b + build de producción
npm run lint      # oxlint
npm run preview   # previsualiza el build
```

---

## Base de datos

Las migraciones están en `migrations/` y se aplican **en orden** desde Supabase → SQL Editor.

| Archivo | Contenido |
|---------|-----------|
| `001_exercises_extend.sql` | Extiende `exercises` (categoría, equipo, grupo muscular, patrón de movimiento) |
| `002_routines.sql` | `routines` + `routine_exercises` con RLS owner-only |
| `003_seed_exercises_part_01..20.sql` | Seed del catálogo de ejercicios (~2.000 registros) |
| `004_routine_dropset.sql` | Columnas `dropset` / `dropset_percent` en `routine_exercises` |

Todas las tablas de usuario aplican **Row Level Security**: cada cliente solo lee y escribe sus propios registros (`auth.uid() = user_id`).

Vistas usadas por el módulo de análisis: `strength_volume_by_week`, `strength_prs`.

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

---

## Convenciones

- Imports con alias `@/` para todo lo bajo `src/`
- Sin estilos inline: las clases de Tailwind se componentizan en el design system
- Las consultas a datos viven en `src/services/api/*.api.ts`; las pantallas no accedan a Supabase directamente
- Optimistic updates mediante stores Zustand para datos de sesión

---

## Estado actual

- Migración `004_routine_dropset.sql` pendiente de aplicar en Supabase
- `FINAL FOOD DATASET` en revisión para sustituir la base local de alimentos
- Sin suite de tests configurada (solo `lint` + `tsc` + `build` en CI)

---

## Licencia

Proyecto privado. Todos los derechos reservados.
