import type { RoutineExercise, StrengthSession } from '@/shared/types/session.types'

export type ProgressionAction = 'increase' | 'maintain' | 'deload'

export interface LastSessionSummary {
  date: string
  topWeight: number
  topReps: number
  setCount: number
  e1rm: number
}

export interface ProgressionRecommendation {
  action: ProgressionAction
  currentWeight: number
  suggestedWeight: number
  reason: string
  targetSets: number
  targetRepsMin: number
  targetRepsMax: number
  lastSession: LastSessionSummary | null
}

interface WorkingSetSummary {
  topReps: number
  minReps: number
  maxRpe: number
  e1rm: number
}

const roundToPlate = (weight: number): number => Math.round(weight / 1.25) * 1.25

const epley = (weight: number, reps: number): number => weight * (1 + reps / 30)

function incrementFor(exercise: RoutineExercise['exercise']): number {
  const category = (exercise?.category ?? '').toLowerCase()
  if (category.includes('upper legs') || category.includes('lower legs')) return 5
  if (category.includes('upper arms') || category.includes('lower arms')) return 1.25
  if (category.includes('waist') || category.includes('neck')) return 1.25
  return 2.5
}

function summarizeSession(sets: StrengthSession['sets'], currentWeight: number): WorkingSetSummary | null {
  const working = sets.filter((s) => (currentWeight > 0 ? s.weight >= currentWeight : s.weight > 0))
  if (working.length === 0) return null

  const repsList = working.map((s) => s.reps).filter((r) => r > 0)
  if (repsList.length === 0) return null

  const topReps = Math.max(...repsList)
  const minReps = Math.min(...repsList)
  const rpes = working.map((s) => s.rpe ?? 0)
  return {
    topReps,
    minReps,
    maxRpe: Math.max(...rpes),
    e1rm: Math.max(...working.map((s) => (s.weight > 0 && s.reps > 0 ? epley(s.weight, s.reps) : 0))),
  }
}

export function evaluateProgression(
  rex: RoutineExercise,
  sessions: StrengthSession[]
): ProgressionRecommendation | null {
  const targetSets = rex.targetSets
  const minReps = rex.targetRepsMin
  const maxReps = rex.targetRepsMax
  const currentWeight = rex.currentWeight

  const base: ProgressionRecommendation = {
    action: 'maintain',
    currentWeight,
    suggestedWeight: currentWeight,
    reason: '',
    targetSets,
    targetRepsMin: minReps,
    targetRepsMax: maxReps,
    lastSession: null,
  }

  if (currentWeight <= 0) {
    return { ...base, reason: 'Establece tu peso de trabajo para activar recomendaciones.' }
  }

  const valid = sessions
    .filter((s) => s.exerciseId === rex.exerciseId)
    .sort((a, b) => a.date.localeCompare(b.date)) // cronológico
    .map((s) => {
      const summary = summarizeSession(s.sets, currentWeight)
      if (!summary) return null
      const reachedTop = summary.topReps >= maxReps
      const reachedBottom = summary.topReps >= minReps
      return {
        session: s,
        summary,
        reachedTop,
        reachedBottom,
        allAtOrAboveTop: reachedTop && summary.minReps >= maxReps,
      }
    })
    .filter((x): x is { session: StrengthSession; summary: WorkingSetSummary; reachedTop: boolean; reachedBottom: boolean; allAtOrAboveTop: boolean } => x !== null)

  if (valid.length === 0) {
    return { ...base, reason: 'Aún no tienes sesiones registradas con este peso.' }
  }

  const last = valid[valid.length - 1].summary
  base.lastSession = {
    date: valid[valid.length - 1].session.date,
    topWeight: currentWeight,
    topReps: last.topReps,
    setCount: valid[valid.length - 1].session.sets.filter((s) => s.weight >= currentWeight).length,
    e1rm: last.e1rm,
  }

  const lastTwo = valid.slice(-2)
  const lastThree = valid.slice(-3)

  const cleanHitTop = (x: { summary: WorkingSetSummary; allAtOrAboveTop: boolean }) =>
    x.allAtOrAboveTop && (x.summary.maxRpe === 0 || x.summary.maxRpe <= 8)

  if (lastTwo.length >= 2 && lastTwo.every(cleanHitTop)) {
    const increment = incrementFor(rex.exercise)
    const suggestedWeight = roundToPlate(currentWeight + increment)
    return {
      ...base,
      action: 'increase',
      suggestedWeight,
      reason: `Completaste ${maxReps} reps en todas las series durante 2 sesiones seguidas con RPE ≤ 8. Sube a ${suggestedWeight} kg (${increment} kg).`,
    }
  }

  if (lastThree.length >= 3 && lastThree.every((x) => !x.reachedBottom)) {
    const suggestedWeight = roundToPlate(currentWeight * 0.9)
    return {
      ...base,
      action: 'deload',
      suggestedWeight,
      reason: `3 sesiones seguidas sin alcanzar ${minReps} reps. Descarga a ${suggestedWeight} kg (−10%) y retoma la progresión.`,
    }
  }

  const remaining = base.lastSession
    ? `${valid[valid.length - 1].session.date.split('T')[0]}: ${base.lastSession.topReps}/${minReps}-${maxReps} reps a ${currentWeight} kg.`
    : ''
  return {
    ...base,
    reason: `Mantén ${currentWeight} kg. Completa ${maxReps} reps en todas las series 2 sesiones seguidas para subir. ${remaining}`.trim(),
  }
}
