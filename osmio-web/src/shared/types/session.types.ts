export interface Exercise {
  id: number
  name: string
  category: string
  type: 'strength' | 'cardio'
}

export interface SetEntry {
  reps: number
  weight: number
  rpe: number
}

export interface StrengthSession {
  id: string
  date: string
  exerciseId: number
  exerciseName: string
  sets: SetEntry[]
  notes: string
}

export interface CombatSession {
  id: string
  date: string
  type: 'striking' | 'grappling'
  rounds: number
  durationMinutes: number
  rpe: number
  positions: string[]
  notes: string
}

export type Session = StrengthSession | CombatSession
