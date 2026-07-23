import { useMemo } from 'react'

interface Suggestion {
  type: 'strength' | 'combat' | 'nutrition' | 'rest'
  title: string
  description: string
}

export function useTodaySuggestion(): Suggestion {
  return useMemo(() => {
    // Placeholder logic - determine what training today based on schedule
    const dayOfWeek = new Date().getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { type: 'rest', title: 'Día de descanso', description: 'Recupera para la próxima semana' }
    }
    if (dayOfWeek % 2 === 1) {
      return { type: 'strength', title: 'Fuerza - Tren superior', description: 'Press banca, remo, press militar' }
    }
    return { type: 'combat', title: 'Sparring suave', description: '3 rounds de 5 min' }
  }, [])
}
