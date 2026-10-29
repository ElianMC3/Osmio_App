import type { HeatmapColumn } from '@/components/charts/heatmap'
import { activeDateKeys, type ConsistencyEntry } from './consistency'
import { toLocalDateString } from './dateHelpers'

/**
 * Convierte las entradas de consistencia al formato de columnas de Bklit:
 * una columna por semana (domingo → sábado) y una celda por día.
 * `weekStartDay={1}` en el chart rota la vista para empezar en lunes.
 */
export function buildConsistencyHeatmap(
  entries: ConsistencyEntry[],
  today: Date = new Date(),
  weeks = 12,
): HeatmapColumn[] {
  const active = activeDateKeys(entries, today)
  const endSunday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  endSunday.setDate(endSunday.getDate() - endSunday.getDay())

  const startSunday = new Date(endSunday)
  startSunday.setDate(startSunday.getDate() - (weeks - 1) * 7)

  return Array.from({ length: weeks }, (_, weekIndex) => ({
    bin: weekIndex,
    bins: Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date(startSunday)
      date.setDate(startSunday.getDate() + weekIndex * 7 + dayIndex)
      const key = toLocalDateString(date)
      return {
        bin: dayIndex,
        count: active.has(key) ? 1 : 0,
        date,
      }
    }),
  }))
}

/** `2026-W43` (semana ISO, lunes como primer día) → fecha local del lunes. */
export function isoWeekToDate(week: string): Date {
  const match = /^(\d{4})-W(\d{2})$/.exec(week)
  if (!match) return new Date()
  const year = Number(match[1])
  const weekNumber = Number(match[2])
  const jan4 = new Date(year, 0, 4)
  const jan4Day = jan4.getDay() || 7
  return new Date(year, 0, 4 - (jan4Day - 1) + (weekNumber - 1) * 7)
}
