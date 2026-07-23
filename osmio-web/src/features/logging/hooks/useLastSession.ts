import { useMemo } from 'react'

interface SessionData {
  date: string
  sets: { reps: number; weight: number }[]
}

export function useLastSession(exerciseId: number): SessionData | null {
  return useMemo(() => {
    // Placeholder - fetch last session from store/API
    if (!exerciseId) return null
    return {
      date: '8 jul 2026',
      sets: [
        { reps: 10, weight: 70 },
        { reps: 8, weight: 70 },
        { reps: 8, weight: 70 },
        { reps: 6, weight: 70 },
      ],
    }
  }, [exerciseId])
}
