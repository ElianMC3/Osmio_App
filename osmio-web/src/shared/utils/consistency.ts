import { parseLocalDate, toLocalDateString } from './dateHelpers'

export interface ConsistencyEntry {
  date: string
  active: boolean
}

export interface ConsistencyStats {
  currentStreak: number
  bestStreak: number
  consistencyPct: number
  activeDays: number
  windowDays: number
}

export interface ConsistencyCell {
  date: string
  active: boolean
  future: boolean
}

const DAY_MS = 24 * 60 * 60 * 1000

/** Clave 'YYYY-MM-DD' de una entrada, o null si la fecha no es válida. */
function dateKey(value: string, todayKey: string): string | null {
  try {
    const key = toLocalDateString(parseLocalDate(value.slice(0, 10)))
    return key <= todayKey ? key : null
  } catch {
    return null
  }
}

/** Días activos (sin futuros ni fechas inválidas) como claves 'YYYY-MM-DD'. */
export function activeDateKeys(
  entries: ConsistencyEntry[],
  today: Date = new Date(),
): Set<string> {
  const todayKey = toLocalDateString(today)
  const dates = new Set<string>()
  for (const entry of entries) {
    if (!entry.active) continue
    const key = dateKey(entry.date, todayKey)
    if (key) dates.add(key)
  }
  return dates
}

/** Días calendario entre dos fechas locales, sin verse afectado por el DST. */
function calendarDiff(a: Date, b: Date): number {
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.round((utcA - utcB) / DAY_MS)
}

/**
 * Estadísticas de consistencia calculadas sobre días de calendario reales.
 * La vista `training_consistency` solo devuelve días activos, así que la racha
 * no puede contarse recorriendo el array: hay que comprobar huecos.
 */
export function computeConsistencyStats(
  entries: ConsistencyEntry[],
  today: Date = new Date(),
  windowDays = 90,
): ConsistencyStats {
  const dates = activeDateKeys(entries, today)
  const todayKey = toLocalDateString(today)

  // Si hoy aún no hay sesión, la racha sigue viva hasta ayer.
  const cursor = parseLocalDate(todayKey)
  if (!dates.has(todayKey)) cursor.setDate(cursor.getDate() - 1)

  let currentStreak = 0
  while (dates.has(toLocalDateString(cursor))) {
    currentStreak++
    cursor.setDate(cursor.getDate() - 1)
  }

  let bestStreak = 0
  let run = 0
  let previous: Date | null = null
  for (const key of Array.from(dates).sort()) {
    const date = parseLocalDate(key)
    run = previous && calendarDiff(date, previous) === 1 ? run + 1 : 1
    bestStreak = Math.max(bestStreak, run)
    previous = date
  }

  const windowStart = parseLocalDate(todayKey)
  windowStart.setDate(windowStart.getDate() - (windowDays - 1))

  let activeDays = 0
  for (const key of dates) {
    if (calendarDiff(parseLocalDate(key), windowStart) >= 0) activeDays++
  }

  return {
    currentStreak,
    bestStreak,
    consistencyPct: Math.round((activeDays / windowDays) * 100),
    activeDays,
    windowDays,
  }
}

function startOfWeek(date: Date): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = start.getDay()
  start.setDate(start.getDate() - (day === 0 ? 6 : day - 1))
  return start
}

/**
 * Matriz `semanas × 7` (lunes a domingo) con los últimos `weeks` períodos,
 * terminando en la semana que contiene `today`. Las celdas futuras se marcan
 * para poder atenuarlas sin contar actividad que aún no ha ocurrido.
 */
export function buildConsistencyWeeks(
  entries: ConsistencyEntry[],
  today: Date = new Date(),
  weeks = 12,
): ConsistencyCell[][] {
  const dates = activeDateKeys(entries, today)
  const todayKey = toLocalDateString(today)
  const end = startOfWeek(today)
  const start = new Date(end)
  start.setDate(start.getDate() - (weeks - 1) * 7)

  return Array.from({ length: weeks }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => {
      const cell = new Date(start)
      cell.setDate(start.getDate() + weekIndex * 7 + dayIndex)
      const key = toLocalDateString(cell)
      return {
        date: key,
        active: dates.has(key),
        future: key > todayKey,
      }
    }),
  )
}
