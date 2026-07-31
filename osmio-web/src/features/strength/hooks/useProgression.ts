import { useState, useEffect, useCallback, useMemo } from 'react'
import { routinesApi } from '@/services/api/routines.api'
import type { Routine, StrengthSession } from '@/shared/types/session.types'
import { evaluateProgression, type ProgressionRecommendation } from '../lib/progression'

export function useProgression() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [sessions, setSessions] = useState<Record<number, StrengthSession[]>>({})
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    ;(async () => {
      try {
        const rs = await routinesApi.getRoutines()
        if (!active) return
        setRoutines(rs)
        const ids = [...new Set(rs.flatMap((r) => r.exercises.map((e) => e.exerciseId)))]
        const grouped = await routinesApi.getSessionsForExercises(ids)
        if (!active) return
        setSessions(grouped)
      } catch (e) {
        console.error('Error loading progression:', e)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [tick])

  const recommendations = useMemo(() => {
    const map = new Map<string, ProgressionRecommendation>()
    for (const r of routines) {
      for (const ex of r.exercises) {
        const rec = evaluateProgression(ex, sessions[ex.exerciseId] ?? [])
        if (rec) map.set(ex.id, rec)
      }
    }
    return map
  }, [routines, sessions])

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  return { routines, sessions, recommendations, loading, refresh }
}
