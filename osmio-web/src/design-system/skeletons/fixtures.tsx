/**
 * Fixtures de boneyard.
 *
 * `fixture` solo se renderiza durante `npx boneyard-js build`: el CLI activa
 * `window.__BONEYARD_BUILD` antes de cargar la página y `<Skeleton>` muestra
 * `fixture` en lugar de los hijos. Sirve para medir el layout sin depender de
 * datos reales (los carruseles y gráficos transformados no se pueden medir).
 * La misma estructura se usa como `fallback` en el primer render, antes de que
 * el registry resuelva los huesos.
 *
 * Reglas para escribir fixtures:
 *
 * 1. Copiar las clases reales de la pantalla (aunque alguna resuelva a 0): la
 *    geometría del esqueleto debe coincidir con la del contenido que sustituye.
 * 2. Nada de alturas dependientes del viewport (`vh`/`svh`) ni `min-h-screen`:
 *    boneyard escala en vertical con `altura_del_contenedor / altura_capturada`
 *    y una captura dependiente del viewport deforma los huesos.
 * 3. Los bloques hoja usan `bg-surface-container-high`; boneyard descarta los
 *    fondos de contenedor, así que solo se dibujan las hojas.
 * 4. Mantener los textos y datos fuera: esto describe la forma, no el copy.
 */

import type { ReactNode } from 'react'

/** Bloque base de un hueso. El color final lo aplica boneyard al renderizar. */
export function Bone({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse motion-reduce:animate-none bg-surface-container-high ${className}`}
    />
  )
}

/** Silueta de `GreenCard` (radio + borde) sin fondo visible. */
function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border border-outline-variant/30 ${className}`}>{children}</div>
  )
}

/**
 * Contador del `PageHeader` mientras los datos están en vuelo. Vive fuera del
 * host del skeleton (el header es estático), así que no lo captura boneyard:
 * pulsa para indicar que el número real aún no está disponible.
 */
export function StatusPillBone() {
  return (
    <span className="status-pill" aria-hidden>
      <span className="status-dot bg-surface-container-high" />
      <span className="block h-2 w-14 animate-pulse motion-reduce:animate-none rounded-full bg-surface-container-high" />
    </span>
  )
}

/** Cabecera de sección (`SectionHeader`) sin copy. */
function SectionTitleBone() {
  return (
    <div className="space-y-1">
      <Bone className="h-2.5 w-28 rounded-full" />
      <Bone className="h-5 w-44 rounded-md" />
    </div>
  )
}

/** Fila de progreso genérica: etiqueta, valor y barra. */
function ProgressBone() {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <Bone className="h-2 w-20 rounded-full" />
        <Bone className="h-2 w-16 rounded-full" />
      </div>
      <Bone className="h-1.5 w-full rounded-full" />
    </div>
  )
}

/** Rejilla de calendario/mapa de calor con celdas cuadradas. */
function CellGridBone({ columns, rows, className = 'h-3' }: { columns: number; rows: number; className?: string }) {
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {Array.from({ length: columns * rows }).map((_, i) => (
        <Bone key={i} className={`${className} rounded-[2px]`} />
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Picker de ejercicios                                                       */
/* -------------------------------------------------------------------------- */

/** Tarjeta central + título + acciones + controles del picker. */
export function PickerSkeletonFixture() {
  return (
    <div className="w-full">
      <div className="flex h-[504px] items-center justify-center">
        <div className="aspect-square w-[min(78vw,330px)] rounded-2xl bg-surface-container-high sm:w-[min(52vw,380px)] lg:w-[min(34vw,420px)]" />
      </div>

      <div className="mx-auto mt-6 w-full max-w-2xl text-center">
        <div className="mx-auto h-3.5 w-36 rounded-full bg-surface-container-high" />
        <div className="mx-auto mt-1.5 h-[44px] w-full max-w-[36rem] rounded-lg bg-surface-container-high sm:h-10" />
        <div className="mt-2.5 flex justify-center gap-2">
          <div className="h-6 w-20 rounded-full bg-surface-container-high" />
          <div className="h-6 w-28 rounded-full bg-surface-container-high" />
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <div className="h-10 w-[171px] rounded-lg bg-surface-container-high" />
          <div className="h-10 w-[85px] rounded-lg bg-surface-container-high" />
          <div className="h-10 w-[49px] rounded-lg bg-surface-container-high" />
        </div>
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-[36rem] items-center gap-3 sm:gap-4">
        <div className="size-10 shrink-0 rounded-full bg-surface-container-high" />
        <div className="min-w-0 flex-1">
          <div className="flex items-end justify-between">
            <div className="h-2.5 w-10 rounded-full bg-surface-container-high" />
            <div className="h-2.5 w-24 rounded-full bg-surface-container-high" />
          </div>
          <div className="mt-2 h-px w-full bg-surface-container-high" />
        </div>
        <div className="size-10 shrink-0 rounded-full bg-surface-container-high" />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Historial de un ejercicio                                                  */
/* -------------------------------------------------------------------------- */

/** Ficha del ejercicio + tarjetas de sesión del historial. */
export function ExerciseHistorySkeletonFixture() {
  return (
    <div className="space-y-3">
      <FichaEjercicioBone />
      <SessionCardSkeleton />
      <SessionCardSkeleton />
    </div>
  )
}

export function FichaEjercicioBone() {
  return (
    <div className="pt-2">
      <Card className="bg-surface-container/50 p-4">
        <div className="flex items-center gap-3">
          <Bone className="size-14 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <Bone className="h-3 w-1/2 rounded-full" />
            <Bone className="h-2.5 w-2/3 rounded-full" />
          </div>
        </div>
      </Card>
    </div>
  )
}

/**
 * Tarjeta de sesión. También se usa como estado de carga del panel de detalle
 * (ese panel no se puede capturar con el CLI: solo existe después de un click).
 */
export function SessionCardSkeleton() {
  return (
    <Card className="bg-surface-container/50 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Bone className="h-3 w-28 rounded-full" />
        <div className="flex items-center gap-2">
          <Bone className="h-5 w-14 rounded-full" />
          <Bone className="h-5 w-16 rounded-full" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Bone className="h-2.5 w-16 rounded-full" />
        <Bone className="h-5 w-32 rounded-md" />
      </div>

      <div className="mt-3 space-y-1.5">
        <Bone className="h-2.5 w-full rounded-full opacity-70" />
        <Bone className="h-2.5 w-full rounded-full opacity-70" />
        <Bone className="h-2.5 w-full rounded-full opacity-70" />
      </div>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/* Panel de hoy                                                               */
/* -------------------------------------------------------------------------- */

export function DashboardHoySkeletonFixture() {
  return (
    <div className="space-y-lg">
      {/* 01 · Sesión de hoy */}
      <section className="space-y-md">
        <SectionTitleBone />
        <Card className="p-6">
          <ul className="divide-y divide-green/15">
            {[0, 1].map((row) => (
              <li key={row} className="flex items-center gap-md py-sm first:pt-0 last:pb-0">
                <Bone className="h-11 w-11 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Bone className="h-3 w-40 rounded-full" />
                  <Bone className="h-2.5 w-52 rounded-full" />
                </div>
                <Bone className="h-5 w-16 rounded-full" />
              </li>
            ))}
          </ul>
          <div className="mt-md flex flex-wrap items-center justify-between gap-sm border-t border-outline-variant/25 pt-md">
            <Bone className="h-2.5 w-36 rounded-full" />
            <Bone className="h-8 w-36 rounded-lg" />
          </div>
        </Card>
      </section>

      {/* 02 · Resumen semanal */}
      <section className="space-y-md">
        <SectionTitleBone />
        <div className="grid grid-cols-1 gap-sm md:grid-cols-12">
          <Card className="p-4 md:col-span-7">
            <div className="mb-md flex items-center justify-between">
              <Bone className="h-2.5 w-44 rounded-full" />
              <Bone className="h-2 w-14 rounded-full" />
            </div>
            <div className="space-y-md">
              {[0, 1].map((row) => (
                <div key={row} className="space-y-xs">
                  <div className="flex items-end justify-between">
                    <Bone className="h-2.5 w-20 rounded-full" />
                    <Bone className="h-2.5 w-16 rounded-full" />
                  </div>
                  <div className="flex h-5 gap-1">
                    {Array.from({ length: 7 }).map((_, bar) => (
                      <Bone key={bar} className="flex-1 rounded-[2px]" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-md flex items-baseline justify-between border-t border-outline-variant/25 pt-sm">
              <Bone className="h-2 w-20 rounded-full" />
              <Bone className="h-3 w-12 rounded-full" />
            </div>
          </Card>

          <Card className="p-4 md:col-span-5">
            <div className="mb-md text-center">
              <Bone className="mx-auto h-10 w-24 rounded-md" />
              <Bone className="mx-auto mt-2 h-2 w-24 rounded-full" />
              <Bone className="mx-auto mt-2 h-2.5 w-32 rounded-full" />
            </div>
            <div className="space-y-sm">
              {[0, 1, 2].map((row) => (
                <ProgressBone key={row} />
              ))}
            </div>
            <div className="mt-md grid grid-cols-2 gap-sm border-t border-outline-variant/25 pt-sm">
              <div className="space-y-1">
                <Bone className="h-2 w-16 rounded-full" />
                <Bone className="h-3 w-10 rounded-full" />
              </div>
              <div className="ml-auto space-y-1 text-right">
                <Bone className="ml-auto h-2 w-14 rounded-full" />
                <Bone className="ml-auto h-3 w-6 rounded-full" />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 03 · Consistencia */}
      <section className="space-y-md">
        <SectionTitleBone />
        <Card className="p-4">
          <div className="mb-md flex items-center justify-between gap-sm">
            <Bone className="h-3 w-44 rounded-full" />
            <Bone className="h-2.5 w-28 rounded-full" />
          </div>
          <div className="flex gap-1">
            <Bone className="w-7 shrink-0" />
            <div className="grid flex-1 grid-cols-12 gap-1">
              {Array.from({ length: 12 }).map((_, week) => (
                <div key={week} className="grid gap-1" style={{ gridTemplateRows: 'repeat(7, 12px)' }}>
                  {Array.from({ length: 7 }).map((_, day) => (
                    <Bone key={day} className="h-3 rounded-[2px]" />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <Bone className="mt-sm h-2 w-48 rounded-full" />
        </Card>

        <div className="grid grid-cols-3 gap-sm">
          {[0, 1, 2].map((card) => (
            <Card key={card} className="p-3">
              <Bone className="h-2 w-16 rounded-full" />
              <Bone className="mt-1.5 h-7 w-12 rounded-md" />
              <Bone className="mt-1.5 h-2 w-8 rounded-full" />
            </Card>
          ))}
        </div>
      </section>

      {/* 04 · Calendario del mes */}
      <section className="space-y-md">
        <SectionTitleBone />
        <Card className="p-4">
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, day) => (
              <Bone key={`label-${day}`} className="mx-auto h-2 w-6 rounded-full" />
            ))}
            {Array.from({ length: 35 }).map((_, cell) => (
              <Bone key={cell} className="aspect-square w-full rounded-lg" />
            ))}
          </div>
        </Card>
      </section>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Mi rutina                                                                  */
/* -------------------------------------------------------------------------- */

export function MyRoutineSkeletonFixture() {
  return (
    <div className="space-y-lg">
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Bone className="h-11 flex-1 rounded-xl" />
          <Bone className="h-11 w-40 rounded-lg" />
        </div>
      </Card>

      {[0, 1].map((routine) => (
        <Card key={routine} className="overflow-hidden">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/25 p-4">
            <div className="min-w-0 space-y-1.5">
              <Bone className="h-5 w-36 rounded-md" />
              <Bone className="h-2 w-24 rounded-full" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Bone className="h-8 w-28 rounded-lg" />
              <Bone className="h-8 w-24 rounded-lg" />
              <Bone className="size-9 rounded-lg" />
            </div>
          </header>

          <div className="divide-y divide-outline-variant/15">
            {[0, 1].map((exercise) => (
              <div key={exercise} className="space-y-3 p-4">
                <div className="flex items-center gap-3">
                  <Bone className="h-14 w-14 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Bone className="h-3 w-44 rounded-full" />
                    <div className="flex gap-1.5">
                      <Bone className="h-5 w-16 rounded-full" />
                      <Bone className="h-5 w-20 rounded-full" />
                    </div>
                  </div>
                  <Bone className="h-5 w-28 rounded-full" />
                </div>
                <div className="flex flex-wrap items-end gap-2">
                  <div className="space-y-1">
                    <Bone className="h-2 w-20 rounded-full" />
                    <Bone className="h-9 w-28 rounded-lg" />
                  </div>
                  <Bone className="h-8 w-24 rounded-lg" />
                  <div className="flex-1" />
                  <Bone className="h-8 w-32 rounded-lg" />
                  <Bone className="size-9 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Detalle del día (historial)                                                */
/* -------------------------------------------------------------------------- */

export function DayDetailSkeletonFixture() {
  return (
    <div className="p-md space-y-lg">
      <div className="grid grid-cols-2 gap-sm">
        {[0, 1].map((card) => (
          <Card key={card} className="flex items-center gap-md p-4">
            <Bone className="size-8 shrink-0 rounded-lg" />
            <div className="space-y-1.5">
              <Bone className="h-2 w-20 rounded-full" />
              <Bone className="h-5 w-14 rounded-md" />
            </div>
          </Card>
        ))}
      </div>

      {[0, 1].map((session) => (
        <Card key={session} className="border-l-4 p-4">
          <div className="mb-md flex items-start justify-between">
            <div className="space-y-1.5">
              <Bone className="h-2.5 w-20 rounded-full" />
              <Bone className="h-6 w-52 rounded-md" />
            </div>
            <Bone className="size-6 rounded-md" />
          </div>
          <div className="space-y-2">
            {[0, 1, 2].map((set) => (
              <div key={set} className="flex justify-between border-b border-green/20 py-1 last:border-0">
                <Bone className="h-2.5 w-16 rounded-full" />
                <Bone className="h-2.5 w-24 rounded-full" />
              </div>
            ))}
          </div>
          <Card className="mt-sm p-4">
            <Bone className="mb-1 h-2 w-24 rounded-full" />
            <Bone className="h-8 w-32 rounded-md" />
          </Card>
        </Card>
      ))}

      <div className="grid grid-cols-3 gap-sm">
        {[0, 1, 2].map((card) => (
          <Card key={card} className="flex items-center gap-sm p-3">
            <Bone className="size-5 shrink-0 rounded-md" />
            <div className="space-y-1">
              <Bone className="h-2 w-16 rounded-full" />
              <Bone className="h-3 w-10 rounded-full" />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="mb-md flex items-start justify-between">
          <div className="flex items-center gap-md">
            <Bone className="size-10 rounded-lg" />
            <div className="space-y-1.5">
              <Bone className="h-2 w-24 rounded-full" />
              <Bone className="h-5 w-32 rounded-md" />
            </div>
          </div>
          <div className="space-y-1.5 text-right">
            <Bone className="ml-auto h-5 w-24 rounded-md" />
            <Bone className="ml-auto h-2 w-20 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-md">
          {[0, 1, 2].map((macro) => (
            <div key={macro} className="space-y-1.5">
              <div className="flex justify-between">
                <Bone className="h-2 w-14 rounded-full" />
                <Bone className="h-2 w-8 rounded-full" />
              </div>
              <Bone className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </Card>

      <div className="border-t border-green/20 pt-md">
        <Bone className="mb-md h-2.5 w-48 rounded-full" />
        <div className="flex gap-1">
          {Array.from({ length: 30 }).map((_, day) => (
            <Bone key={day} className="h-7 w-7 shrink-0 rounded-none" />
          ))}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Calendario mensual                                                         */
/* -------------------------------------------------------------------------- */

export function MonthlyCalendarSkeletonFixture() {
  return (
    <div className="p-md space-y-lg">
      <div className="flex items-center justify-between px-xs">
        <div className="flex items-center gap-md">
          <Bone className="size-8 rounded-lg" />
          <Bone className="h-5 w-40 rounded-md" />
          <Bone className="size-8 rounded-lg" />
        </div>
        <div className="flex gap-sm">
          <Bone className="h-6 w-20 rounded-full" />
          <Bone className="h-6 w-24 rounded-full" />
          <Bone className="h-6 w-16 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-7 border-l border-t border-green/20">
        {Array.from({ length: 7 }).map((_, day) => (
          <div key={`weekday-${day}`} className="border-b border-r border-green/20 py-sm">
            <Bone className="mx-auto h-2.5 w-8 rounded-full" />
          </div>
        ))}
        {Array.from({ length: 35 }).map((_, cell) => (
          <div
            key={cell}
            className="flex h-20 flex-col justify-between border-b border-r border-green/20 p-sm"
          >
            <Bone className="h-3 w-4 rounded-sm" />
            <Bone className="h-2 w-8 rounded-sm" />
          </div>
        ))}
      </div>

      <div className="border-t border-green/20 pt-md">
        <div className="flex flex-wrap items-center justify-between gap-md">
          <Bone className="h-2.5 w-32 rounded-full" />
          <div className="flex items-center gap-lg">
            <Bone className="h-3 w-14 rounded-full" />
            <Bone className="h-3 w-14 rounded-full" />
            <Bone className="h-3 w-14 rounded-full" />
          </div>
        </div>
        <div className="mt-sm flex items-center gap-sm">
          <Bone className="h-2 w-full rounded-full" />
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Nutrición                                                                  */
/* -------------------------------------------------------------------------- */

/** Recomendación nutricional (tarjeta superior del dashboard). */
export function NutritionRecommendationSkeletonFixture() {
  return (
    <Card className="p-6">
      <div className="mb-4 space-y-2">
        <Bone className="h-4 w-56 rounded-md" />
        <Bone className="h-2.5 w-72 rounded-full" />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[0, 1, 2, 3].map((stat) => (
          <div key={stat} className="rounded-xl border border-outline-variant/30 p-3">
            <Bone className="h-2 w-16 rounded-full" />
            <Bone className="mt-1.5 h-6 w-20 rounded-md" />
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        {[0, 1, 2].map((macro) => (
          <div key={macro} className="rounded-xl border border-outline-variant/30 p-3">
            <Bone className="mx-auto h-2 w-16 rounded-full" />
            <Bone className="mx-auto mt-1.5 h-5 w-14 rounded-md" />
            <Bone className="mx-auto mt-1 h-2 w-20 rounded-full" />
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1.5 border-l-2 border-primary-fixed/50 pl-3">
        <Bone className="h-2.5 w-full rounded-full" />
        <Bone className="h-2.5 w-11/12 rounded-full" />
        <Bone className="h-2.5 w-4/5 rounded-full" />
      </div>

      <Bone className="mt-4 h-12 w-64 rounded-xl" />
    </Card>
  )
}

/** Anillo de calorías + macros del dashboard nutricional. */
export function NutritionDashboardSkeletonFixture() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
      <Card className="flex flex-col items-center justify-center p-6 md:col-span-5">
        <Bone className="mb-4 size-[150px] rounded-full" />
        <Bone className="h-2.5 w-32 rounded-full" />
        <div className="mt-6 flex w-full justify-between border-t border-outline-variant/30 pt-4">
          {[0, 1, 2].map((stat) => (
            <div key={stat} className="flex-1 space-y-1 text-center">
              <Bone className="mx-auto h-2 w-16 rounded-full" />
              <Bone className="mx-auto h-4 w-12 rounded-md" />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-col gap-4 md:col-span-7">
        <Bone className="h-3 w-48 rounded-full" />
        <div className="grid flex-1 grid-cols-3 gap-3">
          {[0, 1, 2].map((macro) => (
            <Card key={macro} className="flex flex-col justify-between p-4">
              <div className="space-y-1.5">
                <Bone className="h-2 w-16 rounded-full" />
                <Bone className="h-5 w-14 rounded-md" />
              </div>
              <div className="mt-4 space-y-1.5">
                <Bone className="h-1.5 w-full rounded-full" />
                <Bone className="h-2 w-16 rounded-full" />
              </div>
            </Card>
          ))}
        </div>
        <Card className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Bone className="size-10 rounded-xl" />
            <div className="space-y-1.5">
              <Bone className="h-3 w-56 rounded-full" />
              <Bone className="h-2 w-44 rounded-full" />
            </div>
          </div>
          <Bone className="h-9 w-32 rounded-lg" />
        </Card>
      </div>
    </div>
  )
}

/** Anillo + macros + cronograma del detalle nutricional. */
export function DayNutritionSkeletonFixture() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <Card className="flex flex-col items-center justify-center p-6 md:col-span-5">
          <Bone className="mb-4 size-[170px] rounded-full" />
          <div className="grid w-full grid-cols-3 gap-3 border-t border-outline-variant/30 pt-4">
            {[0, 1, 2].map((stat) => (
              <div key={stat} className="space-y-1 text-center">
                <Bone className="mx-auto h-2 w-16 rounded-full" />
                <Bone className="mx-auto h-4 w-12 rounded-md" />
              </div>
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-4 md:col-span-7">
          <Bone className="h-3 w-48 rounded-full" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[0, 1, 2, 3].map((macro) => (
              <Card key={macro} className="flex flex-col justify-between p-4">
                <Bone className="mx-auto h-2 w-10 rounded-full" />
                <Bone className="mx-auto my-2 h-5 w-14 rounded-md" />
                <Bone className="h-1.5 w-full rounded-full" />
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Bone className="h-2.5 w-56 rounded-full" />
        {[0, 1].map((section) => (
          <Card key={section} className="overflow-hidden">
            <div className="border-l-4 border-primary-fixed p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bone className="size-9 rounded-xl" />
                  <div className="space-y-1.5">
                    <Bone className="h-3 w-24 rounded-full" />
                    <Bone className="h-2 w-20 rounded-full" />
                  </div>
                </div>
                <Bone className="h-4 w-16 rounded-md" />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[0, 1].map((meal) => (
                  <div
                    key={meal}
                    className="flex items-center justify-between rounded-xl border border-outline-variant/30 p-3"
                  >
                    <div className="min-w-0 flex-1 space-y-1.5 pr-2">
                      <Bone className="h-3 w-36 rounded-full" />
                      <Bone className="h-2 w-20 rounded-full" />
                    </div>
                    <div className="flex gap-1.5">
                      <Bone className="h-4 w-10 rounded" />
                      <Bone className="h-4 w-10 rounded" />
                      <Bone className="h-4 w-10 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-outline-variant/30 p-4">
              <Bone className="mx-auto h-2.5 w-56 rounded-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Análisis                                                                   */
/* -------------------------------------------------------------------------- */

function StatTripletBone() {
  return (
    <div className="grid grid-cols-3 gap-sm">
      {[0, 1, 2].map((card) => (
        <Card key={card} className="p-3">
          <Bone className="h-2 w-20 rounded-full" />
          <Bone className="mt-1.5 h-5 w-14 rounded-md" />
        </Card>
      ))}
    </div>
  )
}

export function StrengthAnalysisSkeletonFixture() {
  return (
    <div className="space-y-lg">
      <StatTripletBone />

      <div>
        <Bone className="mb-3 h-5 w-40 rounded-md" />
        <div className="grid grid-cols-3 gap-sm">
          {[0, 1, 2].map((card) => (
            <Card key={card} className="p-3">
              <Bone className="mb-1.5 h-2 w-20 rounded-full" />
              <Bone className="mb-1.5 h-7 w-14 rounded-md" />
              <Bone className="h-2 w-24 rounded-full" />
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Bone className="mb-3 h-5 w-48 rounded-md" />
        <div className="space-y-sm">
          {[0, 1, 2].map((card) => (
            <Card key={card} className="p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Bone className="h-3 w-40 rounded-full" />
                  <Bone className="h-2 w-32 rounded-full" />
                </div>
                <Bone className="h-3 w-28 rounded-full" />
              </div>
              <Bone className="mt-2 h-2.5 w-3/4 rounded-full" />
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-4">
        <Bone className="mb-4 h-4 w-40 rounded-md" />
        <div className="flex h-40 items-end justify-between gap-xs">
          {Array.from({ length: 7 }).map((_, bar) => (
            <Bone key={bar} className="w-full flex-1 rounded-t-sm" />
          ))}
        </div>
        <div className="mt-md flex items-baseline justify-between border-t border-outline-variant/25 pt-md">
          <Bone className="h-2.5 w-28 rounded-full" />
          <Bone className="h-6 w-24 rounded-md" />
        </div>
      </Card>

      <StatTripletBone />
    </div>
  )
}

export function CombatLoadAnalysisSkeletonFixture() {
  return (
    <div className="space-y-lg">
      <StatTripletBone />

      <div className="flex flex-wrap items-center gap-md">
        <Bone className="h-3 w-24 rounded-full" />
        <Bone className="h-3 w-24 rounded-full" />
        <Bone className="ml-auto h-3 w-32 rounded-full" />
      </div>

      <Card className="p-4">
        <Bone className="h-4 w-44 rounded-md" />
        <div className="mt-md flex h-48 items-end justify-between gap-md">
          {Array.from({ length: 4 }).map((_, group) => (
            <div key={group} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full items-end justify-center gap-1">
                <Bone className="h-20 w-10 rounded-t-sm" />
                <Bone className="h-32 w-10 rounded-t-sm" />
              </div>
              <Bone className="mt-sm h-2 w-10 rounded-full" />
            </div>
          ))}
        </div>
      </Card>

      <StatTripletBone />

      <Card className="p-4">
        <Bone className="h-4 w-48 rounded-md" />
        <div className="mt-md space-y-md">
          {[0, 1].map((row) => (
            <div key={row} className="space-y-1.5">
              <div className="flex items-end justify-between">
                <Bone className="h-3 w-24 rounded-full" />
                <Bone className="h-3 w-10 rounded-full" />
              </div>
              <Bone className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
        <Bone className="mt-md h-10 w-full rounded-r-lg" />
      </Card>

      <div className="grid grid-cols-1 gap-sm">
        {[0, 1, 2].map((card) => (
          <Card key={card} className="p-4">
            <div className="flex items-center gap-md">
              <Bone className="size-14 rounded-full" />
              <div className="space-y-1.5">
                <Bone className="h-2 w-24 rounded-full" />
                <Bone className="h-6 w-28 rounded-md" />
                <Bone className="h-2 w-32 rounded-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ConsistencyMapSkeletonFixture() {
  return (
    <div className="space-y-lg">
      <Bone className="h-2.5 w-40 rounded-full" />

      <Card className="p-4">
        <div className="mb-md flex items-center justify-between gap-sm">
          <Bone className="h-3 w-52 rounded-full" />
          <Bone className="h-2.5 w-28 rounded-full" />
        </div>
        <div className="flex gap-2">
          <div className="grid gap-[2px]">
            {Array.from({ length: 7 }).map((_, day) => (
              <Bone key={day} className="h-3 w-6 rounded-sm" />
            ))}
          </div>
          <CellGridBone columns={20} rows={7} />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-sm">
        {[0, 1].map((card) => (
          <Card key={card} className="p-4">
            <Bone className="mb-1.5 h-2.5 w-24 rounded-full" />
            <Bone className="h-9 w-20 rounded-md" />
            <Bone className="mt-1.5 h-2 w-28 rounded-full" />
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="mb-md flex items-center justify-between">
          <Bone className="h-2.5 w-40 rounded-full" />
          <Bone className="size-5 rounded-md" />
        </div>
        <div className="flex flex-col items-center">
          <Bone className="size-40 rounded-full" />
          <div className="mt-md grid w-full grid-cols-2 gap-sm">
            {[0, 1].map((card) => (
              <Card key={card} className="p-3">
                <Bone className="h-2 w-20 rounded-full" />
                <Bone className="mt-1 h-3 w-16 rounded-full" />
              </Card>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="space-y-2">
          <Bone className="h-3 w-40 rounded-full" />
          <Bone className="h-5 w-full rounded-md" />
          <Bone className="h-5 w-4/5 rounded-md" />
          <Bone className="h-2.5 w-3/4 rounded-full" />
        </div>
      </Card>

      <Card className="p-4">
        <Bone className="mb-md h-3 w-48 rounded-full" />
        <div className="space-y-sm">
          {[0, 1].map((row) => (
            <div key={row} className="space-y-1">
              <div className="flex justify-between">
                <Bone className="h-2 w-20 rounded-full" />
                <Bone className="h-2 w-8 rounded-full" />
              </div>
              <Bone className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-sm border-t border-outline-variant/25 pt-md">
        {[0, 1, 2, 3].map((stat) => (
          <div key={stat} className="space-y-1">
            <Bone className="h-2 w-24 rounded-full" />
            <Bone className="h-5 w-16 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Perfil                                                                     */
/* -------------------------------------------------------------------------- */

export function ProfileSettingsSkeletonFixture() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <Card className="p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <Bone className="size-24 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <Bone className="mx-auto h-7 w-44 rounded-md sm:mx-0" />
            <Bone className="mx-auto h-3 w-52 rounded-full sm:mx-0" />
            <div className="flex flex-wrap justify-center gap-2 pt-1 sm:justify-start">
              <Bone className="h-6 w-28 rounded-full" />
              <Bone className="h-6 w-24 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:flex sm:gap-6">
            {[0, 1, 2].map((stat) => (
              <div key={stat} className="space-y-1">
                <Bone className="mx-auto h-5 w-10 rounded-md" />
                <Bone className="mx-auto h-2 w-6 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[0, 1, 2, 3].map((card) => (
          <Card key={card} className="space-y-4 p-5">
            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
              <Bone className="size-5 rounded-md" />
              <Bone className="h-3 w-40 rounded-full" />
            </div>

            {card % 2 === 0 ? (
              <>
                <div className="space-y-1.5">
                  <Bone className="h-2 w-28 rounded-full" />
                  <Bone className="h-11 w-full rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Bone className="h-2 w-16 rounded-full" />
                  <Bone className="h-11 w-full rounded-xl" />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((field) => (
                    <div key={field} className="space-y-1.5">
                      <Bone className="h-2 w-12 rounded-full" />
                      <Bone className="h-11 w-full rounded-xl" />
                    </div>
                  ))}
                </div>
                <Bone className="h-20 w-full rounded-xl" />
              </>
            )}
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        <Bone className="h-14 w-full rounded-xl" />
      </div>
      <Bone className="h-14 w-full rounded-xl" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Shell de la app (gate de autenticación)                                    */
/* -------------------------------------------------------------------------- */

/** Silueta del layout protegido mientras `useAuth` resuelve la sesión. */
export function AppShellSkeleton() {
  return (
    <div className="relative min-h-screen bg-surface">
      <div className="fixed inset-x-0 top-0 z-40 h-16 border-b border-outline-variant/20 bg-surface/80 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-full max-w-[1440px] items-center gap-3">
          <Bone className="size-9 rounded-xl" />
          <Bone className="h-3 w-28 rounded-full" />
          <Bone className="ml-auto h-8 w-24 rounded-lg" />
        </div>
      </div>

      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-outline-variant/20 p-5 pt-24 lg:block">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, item) => (
            <Bone key={item} className="h-9 w-full rounded-lg" />
          ))}
        </div>
      </aside>

      <main className="mx-auto min-h-screen max-w-[1440px] px-4 pb-28 pt-24 sm:px-6 lg:ml-72 lg:px-8">
        <div className="space-y-4">
          <Bone className="h-4 w-40 rounded-full" />
          <Bone className="h-8 w-64 rounded-md" />
          <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
            <Bone className="h-40 rounded-2xl" />
            <Bone className="h-40 rounded-2xl" />
          </div>
          <Bone className="h-56 rounded-2xl" />
        </div>
      </main>
    </div>
  )
}
