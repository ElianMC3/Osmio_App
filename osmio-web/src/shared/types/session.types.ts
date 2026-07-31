export interface Exercise {
  id: number
  name: string
  category: string
  type?: 'strength' | 'cardio'
  bodyPart?: string
  equipment?: string
  muscleGroup?: string
  target?: string
  secondaryMuscles?: string[]
  instructions?: { es?: string; en?: string }
  image?: string
  gifUrl?: string
}

export interface RoutineExercise {
  id: string
  routineId: string
  exerciseId: number
  position: number
  targetSets: number
  targetRepsMin: number
  targetRepsMax: number
  currentWeight: number
  restSeconds: number
  notes: string
  exercise?: Exercise
}

export interface Routine {
  id: string
  name: string
  description: string
  exercises: RoutineExercise[]
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
