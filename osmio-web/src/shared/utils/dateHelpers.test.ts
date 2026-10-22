import { describe, expect, it } from 'vitest'

import { localDayRange, parseLocalDate, toLocalDateString } from './dateHelpers'

describe('toLocalDateString', () => {
  it('usa el día local, no el UTC', () => {
    const lateNight = new Date(2026, 0, 5, 23, 30)

    expect(toLocalDateString(lateNight)).toBe('2026-01-05')
  })

  it('no adelanta el día en las primeras horas de la madrugada', () => {
    const earlyMorning = new Date(2026, 0, 5, 0, 30)

    expect(toLocalDateString(earlyMorning)).toBe('2026-01-05')
  })

  it('rellena mes y día con dos dígitos', () => {
    expect(toLocalDateString(new Date(2026, 0, 9, 12))).toBe('2026-01-09')
  })

  it('hace round-trip con parseLocalDate conservando el día local', () => {
    const original = new Date(2026, 6, 20, 23, 59)
    const parsed = parseLocalDate(toLocalDateString(original))

    expect([parsed.getFullYear(), parsed.getMonth(), parsed.getDate()]).toEqual([2026, 6, 20])
  })
})

describe('parseLocalDate', () => {
  it('interpreta la fecha como medianoche local', () => {
    const parsed = parseLocalDate('2026-03-10')

    expect([parsed.getFullYear(), parsed.getMonth(), parsed.getDate()]).toEqual([2026, 2, 10])
    expect(parsed.getHours()).toBe(0)
    expect(parsed.getMinutes()).toBe(0)
  })

  it('rechaza fechas inexistentes en lugar de normalizarlas', () => {
    // new Date(2026, 1, 31) se normalizaría al 3 de marzo
    expect(() => parseLocalDate('2026-02-31')).toThrow()
  })

  it('rechaza meses fuera de rango', () => {
    expect(() => parseLocalDate('2026-13-01')).toThrow()
  })

  it('rechaza formatos que no son YYYY-MM-DD', () => {
    expect(() => parseLocalDate('no-es-fecha')).toThrow()
    expect(() => parseLocalDate('2026-06')).toThrow()
  })
})

describe('localDayRange', () => {
  it('empieza en la medianoche local del día pedido', () => {
    const start = new Date(localDayRange('2026-06-10').start)

    expect([start.getFullYear(), start.getMonth(), start.getDate()]).toEqual([2026, 5, 10])
    expect(start.getHours()).toBe(0)
  })

  it('termina en la medianoche local del día siguiente', () => {
    const end = new Date(localDayRange('2026-06-10').end)

    expect([end.getFullYear(), end.getMonth(), end.getDate()]).toEqual([2026, 5, 11])
    expect(end.getHours()).toBe(0)
  })

  it('cubre un día completo salvo cambios de horario', () => {
    const { start, end } = localDayRange('2026-06-10')
    const hours = (Date.parse(end) - Date.parse(start)) / 3_600_000

    expect(hours).toBeGreaterThanOrEqual(22)
    expect(hours).toBeLessThanOrEqual(26)
  })

  it('incluye una comida a las 23:30 locales del mismo día', () => {
    const { start, end } = localDayRange('2026-06-10')
    const meal = new Date(2026, 5, 10, 23, 30).toISOString()

    expect(meal >= start).toBe(true)
    expect(meal < end).toBe(true)
  })

  it('excluye una comida de la madrugada del día siguiente', () => {
    const { start, end } = localDayRange('2026-06-10')
    const meal = new Date(2026, 5, 11, 0, 30).toISOString()

    expect(meal >= start).toBe(true)
    expect(meal < end).toBe(false)
  })

  it('incluye la medianoche exacta y excluye la siguiente', () => {
    const { start, end } = localDayRange('2026-06-10')
    const midnight = new Date(2026, 5, 10, 0, 0, 0, 0).toISOString()
    const nextMidnight = new Date(2026, 5, 11, 0, 0, 0, 0).toISOString()

    expect(midnight >= start).toBe(true)
    expect(nextMidnight < end).toBe(false)
  })

  it('devuelve ISO UTC listo para PostgREST', () => {
    const { start, end } = localDayRange('2026-06-10')

    expect(start).toMatch(/Z$/)
    expect(end).toMatch(/Z$/)
    expect(new Date(start).toISOString()).toBe(start)
    expect(new Date(end).toISOString()).toBe(end)
  })

  it('rechaza una fecha inválida', () => {
    expect(() => localDayRange('2026-02-31')).toThrow()
  })
})
