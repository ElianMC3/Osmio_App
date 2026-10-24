import { describe, expect, it } from 'vitest'

import { buildConsistencyWeeks, computeConsistencyStats, type ConsistencyEntry } from './consistency'

const entry = (date: string, active = true): ConsistencyEntry => ({ date, active })

// Viernes 23 de octubre de 2026
const today = new Date(2026, 9, 23, 12)

describe('computeConsistencyStats', () => {
  it('devuelve ceros cuando no hay datos', () => {
    expect(computeConsistencyStats([], today)).toEqual({
      currentStreak: 0,
      bestStreak: 0,
      consistencyPct: 0,
      activeDays: 0,
      windowDays: 90,
    })
  })

  it('cuenta la racha actual terminando hoy', () => {
    const stats = computeConsistencyStats(
      [entry('2026-10-21'), entry('2026-10-22'), entry('2026-10-23')],
      today,
    )

    expect(stats.currentStreak).toBe(3)
    expect(stats.bestStreak).toBe(3)
  })

  it('mantiene la racha si hoy todavía no se ha entrenado', () => {
    const stats = computeConsistencyStats(
      [entry('2026-10-20'), entry('2026-10-21'), entry('2026-10-22')],
      today,
    )

    expect(stats.currentStreak).toBe(3)
  })

  it('corta la racha actual cuando hay un hueco', () => {
    const stats = computeConsistencyStats(
      [entry('2026-10-19'), entry('2026-10-20'), entry('2026-10-23')],
      today,
    )

    expect(stats.currentStreak).toBe(1)
  })

  it('calcula la mejor racha de todo el historial', () => {
    const stats = computeConsistencyStats(
      [
        entry('2026-01-01'),
        entry('2026-01-02'),
        entry('2026-01-03'),
        entry('2026-03-01'),
        entry('2026-03-02'),
        entry('2026-03-03'),
        entry('2026-03-04'),
        entry('2026-03-05'),
        entry('2026-03-06'),
        entry('2026-03-07'),
        entry('2026-10-23'),
      ],
      today,
    )

    expect(stats.bestStreak).toBe(7)
    expect(stats.currentStreak).toBe(1)
  })

  it('calcula el porcentaje sobre la ventana indicada', () => {
    const stats = computeConsistencyStats(
      [entry('2026-07-25'), entry('2026-10-01'), entry('2026-10-02'), entry('2026-10-03')],
      today,
      30,
    )

    // 2026-07-25 queda fuera de los últimos 30 días.
    expect(stats.activeDays).toBe(3)
    expect(stats.windowDays).toBe(30)
    expect(stats.consistencyPct).toBe(10)
  })

  it('ignora fechas futuras', () => {
    const stats = computeConsistencyStats(
      [entry('2026-10-24'), entry('2026-10-25'), entry('2026-10-26')],
      today,
    )

    expect(stats.activeDays).toBe(0)
    expect(stats.currentStreak).toBe(0)
    expect(stats.bestStreak).toBe(0)
  })

  it('ignora fechas inválidas y entradas inactivas', () => {
    const stats = computeConsistencyStats(
      [entry('no-es-fecha'), entry('2026-02-31'), entry('2026-10-23', false), entry('2026-10-22')],
      today,
    )

    expect(stats.activeDays).toBe(1)
    expect(stats.currentStreak).toBe(1)
    expect(stats.bestStreak).toBe(1)
  })

  it('acepta las entradas desordenadas', () => {
    const stats = computeConsistencyStats(
      [entry('2026-10-23'), entry('2026-10-21'), entry('2026-10-22')],
      today,
    )

    expect(stats.currentStreak).toBe(3)
    expect(stats.bestStreak).toBe(3)
  })
})

describe('buildConsistencyWeeks', () => {
  it('genera una matriz de 7 días por semana, terminando en la semana actual', () => {
    const weeks = buildConsistencyWeeks([], today, 12)

    expect(weeks).toHaveLength(12)
    expect(weeks.every((week) => week.length === 7)).toBe(true)
    expect(weeks[11][4]).toMatchObject({ date: '2026-10-23', active: false, future: false })
  })

  it('marca los días activos y deja los futuros como no activos', () => {
    const weeks = buildConsistencyWeeks(
      [entry('2026-10-19'), entry('2026-10-21'), entry('2026-10-23'), entry('2026-10-24')],
      today,
      12,
    )

    expect(weeks[11][0]).toMatchObject({ date: '2026-10-19', active: true })
    expect(weeks[11][2]).toMatchObject({ date: '2026-10-21', active: true })
    expect(weeks[11][4]).toMatchObject({ date: '2026-10-23', active: true })
    expect(weeks[11][5]).toMatchObject({ date: '2026-10-24', active: false, future: true })
  })

  it('empieza en el lunes de hace exactamente 11 semanas', () => {
    const weeks = buildConsistencyWeeks([entry('2026-08-03')], today, 12)

    expect(weeks[0][0]).toMatchObject({ date: '2026-08-03', active: true })
    expect(weeks[1][0]).toMatchObject({ date: '2026-08-10', active: false })
  })
})
