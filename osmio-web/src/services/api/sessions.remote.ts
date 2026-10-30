import { supabase } from '../supabase/client'
import { getCurrentUserId } from '../supabase/currentUser'
import type { StrengthSession, CombatSession, Exercise } from '../../shared/types/session.types'
import type {
  CombatSessionRow,
  ExerciseRow,
  SetEntryRow,
  StrengthSessionRow,
  StrengthSessionWithSetsRow,
} from './rows'

/**
 * Llamadas directas a Supabase. No las usan las pantallas: la capa pública es
 * `sessions.api.ts`, que añade la cola offline y mezcla las sesiones pendientes.
 */

/** Postgres: unique_violation. Reintentar una sesión ya insertada no es un error. */
const DUPLICATE_KEY = '23505'

function mapStrengthRow(row: StrengthSessionRow, sets?: StrengthSession['sets']): StrengthSession {
  return {
    id: row.id,
    date: row.date,
    exerciseId: row.exercise_id ?? 0,
    exerciseName: row.exercise_name,
    sets: sets ?? [],
    notes: row.notes ?? '',
  }
}

function mapCombatRow(row: CombatSessionRow): CombatSession {
  return {
    id: row.id,
    date: row.date,
    type: row.type,
    rounds: row.rounds,
    durationMinutes: row.duration_minutes,
    rpe: row.rpe ?? 0,
    positions: row.positions ?? [],
    notes: row.notes ?? '',
  }
}

function mapSets(entries: SetEntryRow[] | null | undefined): StrengthSession['sets'] {
  return (entries ?? [])
    .sort((a, b) => a.set_order - b.set_order)
    .map((s) => ({ reps: s.reps, weight: s.weight, rpe: s.rpe ?? 0 }))
}

const requireUserId = getCurrentUserId

function mapExerciseRow(row: ExerciseRow): Exercise {
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

async function insertSets(session: StrengthSession): Promise<void> {
  if (session.sets.length === 0) return

  const rows = session.sets.map((set, i) => ({
    session_id: session.id,
    set_order: i + 1,
    reps: set.reps,
    weight: set.weight,
    rpe: set.rpe,
  }))

  const { error } = await supabase.from('set_entries').insert(rows)
  if (error) throw new Error(error.message)
}

export const sessionsRemote = {
  getExercises: async (): Promise<Exercise[]> => {
    const { data, error } = await supabase
      .from('exercises')
      .select('id, name, category, body_part, equipment, muscle_group, target, secondary_muscles, instructions, image, gif_url, attribution')
      .order('name')
    if (error) throw new Error(error.message)
    return ((data ?? []) as ExerciseRow[]).map(mapExerciseRow)
  },

  getExercise: async (id: number): Promise<Exercise | null> => {
    const { data, error } = await supabase
      .from('exercises')
      .select('id, name, category, body_part, equipment, muscle_group, target, secondary_muscles, instructions, image, gif_url, attribution')
      .eq('id', id)
      .maybeSingle()
    if (error) throw new Error(error.message)
    return data ? mapExerciseRow(data as ExerciseRow) : null
  },

  getSessionsByExercise: async (exerciseId: number): Promise<StrengthSession[]> => {
    const { data, error } = await supabase
      .from('strength_sessions')
      .select('*, set_entries(reps, weight, rpe, set_order)')
      .eq('exercise_id', exerciseId)
      .order('date', { ascending: false })
      .limit(50)
    if (error) throw new Error(error.message)
    return ((data ?? []) as StrengthSessionWithSetsRow[]).map((row) => mapStrengthRow(row, mapSets(row.set_entries)))
  },

  getStrengthSessions: async (): Promise<StrengthSession[]> => {
    const { data, error } = await supabase
      .from('strength_sessions')
      .select('*, set_entries(reps, weight, rpe, set_order)')
      .order('date', { ascending: false })
    if (error) throw new Error(error.message)
    return ((data ?? []) as StrengthSessionWithSetsRow[]).map((row) => mapStrengthRow(row, mapSets(row.set_entries)))
  },

  getCombatSessions: async (): Promise<CombatSession[]> => {
    const { data, error } = await supabase
      .from('combat_sessions')
      .select('*')
      .order('date', { ascending: false })
    if (error) throw new Error(error.message)
    return ((data ?? []) as CombatSessionRow[]).map(mapCombatRow)
  },

  /**
   * Inserta con el id generado en el cliente. Si el id ya existe (un reintento
   * cuyo envío anterior sí llegó), se considera éxito y solo se completan las
   * series si faltan — nunca se duplican.
   */
  createStrengthSession: async (session: StrengthSession): Promise<StrengthSession> => {
    const userId = await requireUserId()
    const { error } = await supabase.from('strength_sessions').insert({
      id: session.id,
      user_id: userId,
      date: session.date,
      exercise_id: session.exerciseId,
      exercise_name: session.exerciseName,
      notes: session.notes,
    })

    if (error && error.code !== DUPLICATE_KEY) throw new Error(error.message)

    if (error?.code === DUPLICATE_KEY) {
      const { count } = await supabase
        .from('set_entries')
        .select('id', { count: 'exact', head: true })
        .eq('session_id', session.id)
      if (!count) await insertSets(session)
    } else {
      await insertSets(session)
    }

    return session
  },

  createCombatSession: async (session: CombatSession): Promise<CombatSession> => {
    const userId = await requireUserId()
    const { error } = await supabase.from('combat_sessions').insert({
      id: session.id,
      user_id: userId,
      date: session.date,
      type: session.type,
      rounds: session.rounds,
      duration_minutes: session.durationMinutes,
      rpe: session.rpe,
      positions: session.positions,
      notes: session.notes,
    })

    if (error && error.code !== DUPLICATE_KEY) throw new Error(error.message)
    return session
  },

  getSessionsByDate: async (date: string): Promise<(StrengthSession | CombatSession)[]> => {
    const { data: strengthData, error: strengthError } = await supabase
      .from('strength_sessions')
      .select('*, set_entries(reps, weight, rpe, set_order)')
      .eq('date', date)
    if (strengthError) throw new Error(strengthError.message)

    const { data: combatData, error: combatError } = await supabase
      .from('combat_sessions')
      .select('*')
      .eq('date', date)
    if (combatError) throw new Error(combatError.message)

    const strength = ((strengthData ?? []) as StrengthSessionWithSetsRow[]).map((row) => mapStrengthRow(row, mapSets(row.set_entries)))
    const combat = ((combatData ?? []) as CombatSessionRow[]).map(mapCombatRow)
    return [...strength, ...combat]
  },
}
