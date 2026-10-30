import { supabase } from '../supabase/client'
import { isNetworkError } from '../offline/network'
import { routinesCache } from '../offline/routinesCache'
import { getCurrentUserId } from '../supabase/currentUser'
import type { Routine, RoutineExercise, Exercise, StrengthSession } from '../../shared/types/session.types'
import type {
  ExerciseRow,
  RoutineExerciseRow,
  RoutineRow,
  RoutineWithExercisesRow,
  SetEntryRow,
  StrengthSessionWithSetsRow,
} from './rows'

const EXERCISE_FIELDS =
  'id, name, category, body_part, equipment, muscle_group, target, secondary_muscles, instructions, image, gif_url, attribution'

function mapExercise(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    name: row.name,
    category: row.category ?? '',
    bodyPart: row.body_part ?? '',
    equipment: row.equipment ?? '',
    muscleGroup: row.muscle_group ?? '',
    target: row.target ?? '',
    secondaryMuscles: row.secondary_muscles ?? [],
    instructions: (row.instructions ?? {}) as Record<string, string>,
    image: row.image ?? '',
    gifUrl: row.gif_url ?? '',
    attribution: row.attribution ?? '',
  }
}

function mapRoutineExercise(row: RoutineExerciseRow): RoutineExercise {
  return {
    id: row.id,
    routineId: row.routine_id,
    exerciseId: row.exercise_id,
    position: row.position ?? 0,
    targetSets: row.target_sets ?? 3,
    targetRepsMin: row.target_reps_min ?? 8,
    targetRepsMax: row.target_reps_max ?? 12,
    currentWeight: Number(row.current_weight ?? 0),
    restSeconds: row.rest_seconds ?? 180,
    dropset: row.dropset ?? false,
    dropsetPercent: Number(row.dropset_percent ?? 50),
    notes: row.notes ?? '',
    exercise: row.exercises ? mapExercise(row.exercises) : undefined,
  }
}

function mapRoutine(row: RoutineRow, exercises: RoutineExerciseRow[] = []): Routine {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    exercises: exercises.map(mapRoutineExercise),
  }
}

const requireUserId = getCurrentUserId

export const routinesApi = {
  getRoutines: async (): Promise<Routine[]> => {
    const userId = await requireUserId()
    try {
      const { data, error } = await supabase
        .from('routines')
        .select(`*, routine_exercises(*, exercises(${EXERCISE_FIELDS}))`)
        .eq('user_id', userId)
        .order('created_at')
      if (error) throw new Error(error.message)

      const routines = ((data ?? []) as RoutineWithExercisesRow[]).map((row) =>
        mapRoutine(row, [...(row.routine_exercises ?? [])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)))
      )
      // La caché es una mejora: si IndexedDB falla, la petición ya funcionó.
      await routinesCache.save(userId, routines).catch(() => {})
      return routines
    } catch (error) {
      // Sin red se entrena con la última copia buena. Un error de permisos o de
      // sesión sí se propaga: no se tapa un problema real con datos viejos.
      const cached = await routinesCache.get(userId).catch(() => null)
      if (cached && isNetworkError(error)) return cached
      throw error
    }
  },

  createRoutine: async (name: string, description = ''): Promise<Routine> => {
    const userId = await requireUserId()
    const { data, error } = await supabase
      .from('routines')
      .insert({ user_id: userId, name, description })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return mapRoutine(data as RoutineRow)
  },

  updateRoutine: async (id: string, partial: { name?: string; description?: string }): Promise<void> => {
    const { error } = await supabase.from('routines').update(partial).eq('id', id)
    if (error) throw new Error(error.message)
  },

  deleteRoutine: async (id: string): Promise<void> => {
    const { error } = await supabase.from('routines').delete().eq('id', id)
    if (error) throw new Error(error.message)
  },

  addExercise: async (
    routineId: string,
    exerciseId: number,
    options: Partial<Pick<RoutineExercise, 'targetSets' | 'targetRepsMin' | 'targetRepsMax' | 'currentWeight' | 'restSeconds' | 'dropset' | 'dropsetPercent' | 'position'>> = {}
  ): Promise<RoutineExercise> => {
    const { data: maxRow } = await supabase
      .from('routine_exercises')
      .select('position')
      .eq('routine_id', routineId)
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle()

    const row: Record<string, unknown> = {
      routine_id: routineId,
      exercise_id: exerciseId,
      position: options.position ?? ((maxRow?.position ?? -1) + 1),
      target_sets: options.targetSets ?? 3,
      target_reps_min: options.targetRepsMin ?? 8,
      target_reps_max: options.targetRepsMax ?? 12,
      current_weight: options.currentWeight ?? 0,
      rest_seconds: options.restSeconds ?? 180,
    }
    row.dropset = options.dropset ?? false
    row.dropset_percent = options.dropsetPercent ?? 50
    const { data, error } = await supabase
      .from('routine_exercises')
      .insert(row)
      .select(`*, exercises(${EXERCISE_FIELDS})`)
      .single()
    if (error) throw new Error(error.message)
    return mapRoutineExercise(data as RoutineExerciseRow)
  },

  updateRoutineExercise: async (
    id: string,
    partial: Partial<Pick<RoutineExercise, 'targetSets' | 'targetRepsMin' | 'targetRepsMax' | 'currentWeight' | 'restSeconds' | 'dropset' | 'dropsetPercent' | 'notes' | 'position'>>
  ): Promise<void> => {
    const payload: Record<string, unknown> = {}
    if (partial.targetSets !== undefined) payload.target_sets = partial.targetSets
    if (partial.targetRepsMin !== undefined) payload.target_reps_min = partial.targetRepsMin
    if (partial.targetRepsMax !== undefined) payload.target_reps_max = partial.targetRepsMax
    if (partial.currentWeight !== undefined) payload.current_weight = partial.currentWeight
    if (partial.restSeconds !== undefined) payload.rest_seconds = partial.restSeconds
    if (partial.notes !== undefined) payload.notes = partial.notes
    if (partial.position !== undefined) payload.position = partial.position
    if (partial.dropset !== undefined) payload.dropset = partial.dropset
    if (partial.dropsetPercent !== undefined) payload.dropset_percent = partial.dropsetPercent

    const { error } = await supabase.from('routine_exercises').update(payload).eq('id', id)
    if (error) throw new Error(error.message)
  },

  removeExercise: async (id: string): Promise<void> => {
    const { error } = await supabase.from('routine_exercises').delete().eq('id', id)
    if (error) throw new Error(error.message)
  },

  getSessionsForExercises: async (exerciseIds: number[]): Promise<Record<number, StrengthSession[]>> => {
    if (exerciseIds.length === 0) return {}
    const { data, error } = await supabase
      .from('strength_sessions')
      .select('*, set_entries(reps, weight, rpe, set_order)')
      .in('exercise_id', exerciseIds)
      .order('date', { ascending: false })
      .limit(300)
    if (error) throw new Error(error.message)

    type PartialSetRow = Pick<SetEntryRow, 'reps' | 'weight' | 'rpe' | 'set_order'>
    type PartialSessionRow = Omit<StrengthSessionWithSetsRow, 'set_entries'> & {
      set_entries: PartialSetRow[] | null
    }

    const grouped: Record<number, StrengthSession[]> = {}
    for (const row of (data ?? []) as PartialSessionRow[]) {
      if (row.exercise_id === null) continue
      const sets = (row.set_entries ?? [])
        .sort((a, b) => a.set_order - b.set_order)
        .map((s) => ({ reps: s.reps, weight: s.weight, rpe: s.rpe ?? 0 }))
      const session: StrengthSession = {
        id: row.id,
        date: row.date,
        exerciseId: row.exercise_id,
        exerciseName: row.exercise_name,
        sets,
        notes: row.notes ?? '',
      }
      ;(grouped[row.exercise_id] ??= []).push(session)
    }
    return grouped
  },
}
