import { describe, expect, it } from 'vitest'
import { buildConsistencyHeatmap, isoWeekToDate } from './heatmap'

describe('isoWeekToDate', () => {
  it('convierte una semana ISO al lunes local', () => {
    const date = isoWeekToDate('2026-W43')

    expect(date.getFullYear()).toBe(2026)
    expect(date.getMonth()).toBe(9)
    expect(date.getDate()).toBe(19)
    expect(date.getDay()).toBe(1)
  })
})

describe('buildConsistencyHeatmap', () => {
  it('genera columnas semanales domingo-sábado con la actividad marcada', () => {
    const today = new Date(2026, 9, 28)
    const entries = [
      { date: '2026-10-20', active: true },
      { date: '2026-10-27', active: true },
      { date: '2026-10-28', active: true },
      { date: '2026-10-29', active: false },
    ]

    const columns = buildConsistencyHeatmap(entries, today, 4)
    const lastWeek = columns.at(-1)

    expect(columns).toHaveLength(4)
    expect(columns.every((column) => column.bins.length === 7)).toBe(true)
    expect(lastWeek?.bins[0].date.getDay()).toBe(0)
    expect(
      lastWeek?.bins.filter((bin) => bin.count > 0).map((bin) => bin.date.getDate()),
    ).toEqual([27, 28])
  })
})
