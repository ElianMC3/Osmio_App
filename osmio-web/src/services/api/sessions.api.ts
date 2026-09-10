import { supabase } from '../supabase/client'
import type { StrengthSession, CombatSession, Exercise } from '../../shared/types/session.types'

function mapStrengthRow(row: any, sets?: StrengthSession['sets']): StrengthSession {
  return {
    id: row.id,
    date: row.date,
    exerciseId: row.exercise_id,
    exerciseName: row.exercise_name,
    sets: sets ?? [],
    notes: row.notes ?? '',
  }
}

function mapCombatRow(row: any): CombatSession {
  return {
    id: row.id,
    date: row.date,
    type: row.type,
    rounds: row.rounds,
    durationMinutes: row.duration_minutes,
    rpe: row.rpe,
    positions: row.positions ?? [],
    notes: row.notes ?? '',
  }
}

function mapSets(entries: any[]): StrengthSession['sets'] {
  return (entries ?? [])
    .sort((a, b) => a.set_order - b.set_order)
    .map((s) => ({ reps: s.reps, weight: s.weight, rpe: s.rpe }))
}

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('Not authenticated')
  return data.user.id
}

function mapExerciseRow(row: any): Exercise {
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

export const sessionsApi = {
  getExercises: async (): Promise<Exercise[]> => {
    const { data, error } = await supabase
      .from('exercises')
      .select('id, name, category, body_part, equipment, muscle_group, target, secondary_muscles, instructions, image, gif_url, attribution')
      .order('name')
    if (error) throw new Error(error.message)
    return (data ?? []).map(mapExerciseRow)
  },

  getExercise: async (id: number): Promise<Exercise | null> => {
    const { data, error } = await supabase
      .from('exercises')
      .select('id, name, category, body_part, equipment, muscle_group, target, secondary_muscles, instructions, image, gif_url, attribution')
      .eq('id', id)
      .maybeSingle()
    if (error) throw new Error(error.message)
    return data ? mapExerciseRow(data) : null
  },

  getSessionsByExercise: async (exerciseId: number): Promise<StrengthSession[]> => {
    const { data, error } = await supabase
      .from('strength_sessions')
      .select('*, set_entries(reps, weight, rpe, set_order)')
      .eq('exercise_id', exerciseId)
      .order('date', { ascending: false })
      .limit(50)
    if (error) throw new Error(error.message)
    return data.map((row: any) => mapStrengthRow(row, mapSets(row.set_entries)))
  },

  getStrengthSessions: async (): Promise<StrengthSession[]> => {
    const { data, error } = await supabase
      .from('strength_sessions')
      .select('*, set_entries(reps, weight, rpe, set_order)')
      .order('date', { ascending: false })
    if (error) throw new Error(error.message)
    return data.map((row: any) => mapStrengthRow(row, mapSets(row.set_entries)))
  },

  getCombatSessions: async (): Promise<CombatSession[]> => {
    const { data, error } = await supabase
      .from('combat_sessions')
      .select('*')
      .order('date', { ascending: false })
    if (error) throw new Error(error.message)
    return data.map(mapCombatRow)
  },

  createStrengthSession: async (session: Omit<StrengthSession, 'id'>): Promise<StrengthSession> => {
    const userId = await requireUserId()
    const { data, error } = await supabase
      .from('strength_sessions')
      .insert({
        user_id: userId,
        date: session.date,
        exercise_id: session.exerciseId,
        exercise_name: session.exerciseName,
        notes: session.notes,
      })
      .select()
      .single()
    if (error) throw new Error(error.message)

    if (session.sets.length > 0) {
      const setRows = session.sets.map((set, i) => ({
        session_id: data.id,
        set_order: i + 1,
        reps: set.reps,
        weight: set.weight,
        rpe: set.rpe,
      }))
      const { error: setsError } = await supabase.from('set_entries').insert(setRows)
      if (setsError) throw new Error(setsError.message)
    }
    return mapStrengthRow(data, session.sets)
  },

  createCombatSession: async (session: Omit<CombatSession, 'id'>): Promise<CombatSession> => {
    const userId = await requireUserId()
    const { data, error } = await supabase
      .from('combat_sessions')
      .insert({
        user_id: userId,
        date: session.date,
        type: session.type,
        rounds: session.rounds,
        duration_minutes: session.durationMinutes,
        rpe: session.rpe,
        positions: session.positions,
        notes: session.notes,
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return mapCombatRow(data)
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

    const strength = strengthData.map((row: any) => mapStrengthRow(row, mapSets(row.set_entries)))
    const combat = combatData.map(mapCombatRow)
    return [...strength, ...combat]
  },
}
