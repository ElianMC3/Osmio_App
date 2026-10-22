export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

export function getDayOfWeek(date: Date): string {
  return date.toLocaleDateString('es-ES', { weekday: 'long' })
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function subDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Convierte 'YYYY-MM-DD' en la medianoche local de ese día.
 * Lanza si la fecha no existe (p. ej. 2026-02-31), en lugar de normalizarla.
 */
export function parseLocalDate(date: string): Date {
  const parts = date.split('-')
  if (parts.length !== 3) {
    throw new Error(`Fecha inválida: ${date}`)
  }

  const [year, month, day] = parts.map(Number)
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    throw new Error(`Fecha inválida: ${date}`)
  }

  const parsed = new Date(year, month - 1, day)
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    throw new Error(`Fecha inválida: ${date}`)
  }

  return parsed
}

/** Fecha local de hoy como 'YYYY-MM-DD'. No usa UTC: `toISOString()` adelanta o atrasa el día. */
export function toLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Rango [inicio, fin) del día local `date`, en ISO UTC.
 * Se calcula desde la medianoche local, así que respeta la zona horaria del
 * usuario y los cambios de horario (23 o 25 horas en los días de DST).
 */
export function localDayRange(date: string): { start: string; end: string } {
  const start = parseLocalDate(date)
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1)
  return { start: start.toISOString(), end: end.toISOString() }
}
