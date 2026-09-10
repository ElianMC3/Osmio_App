import { supabase } from '../supabase/client'
import type { UserProfile } from '../../store/userStore'

async function requireUser(): Promise<{ id: string; email?: string }> {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('Not authenticated')
  return { id: data.user.id, email: data.user.email ?? undefined }
}

function mapProfileRow(row: any): UserProfile & { age?: number } {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    weight: row.weight ? Number(row.weight) : 0,
    height: row.height ? Number(row.height) : 0,
    experience: row.experience ?? 'intermediate',
    goal: row.goal ?? 'both',
    age: row.age ?? undefined,
  }
}

export const profilesApi = {
  getProfile: async (): Promise<(UserProfile & { age?: number }) | null> => {
    const { id: userId } = await requireUser()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    if (error) throw new Error(error.message)
    return data ? mapProfileRow(data) : null
  },

  updateProfile: async (profile: Partial<UserProfile & { age?: number }>): Promise<void> => {
    const { id: userId, email } = await requireUser()

    const payload: Record<string, any> = {}
    if (profile.name !== undefined) payload.name = profile.name
    if (profile.weight !== undefined) payload.weight = profile.weight
    if (profile.height !== undefined) payload.height = profile.height
    if (profile.experience !== undefined) payload.experience = profile.experience
    if (profile.goal !== undefined) payload.goal = profile.goal
    if (profile.age !== undefined) payload.age = profile.age

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, email: email ?? '', ...payload })

    // La columna `age` puede no existir aún en la tabla; reintenta sin ella
    // para que el resto del perfil sí se guarde.
    if (error && error.code === '42703' && payload.age !== undefined) {
      delete payload.age
      const { error: retryError } = await supabase
        .from('profiles')
        .upsert({ id: userId, email: email ?? '', ...payload })
      if (retryError) throw new Error(retryError.message)
      return
    }

    if (error) throw new Error(error.message)
  },

  getTrainingDays: async (): Promise<Record<string, boolean>> => {
    const { id: userId } = await requireUser()

    const { data, error } = await supabase
      .from('training_days')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    if (error) throw new Error(error.message)

    return data
      ? {
          L: data.monday,
          M: data.tuesday,
          X: data.wednesday,
          J: data.thursday,
          V: data.friday,
          S: data.saturday,
          D: data.sunday,
        }
      : { L: true, M: true, X: false, J: true, V: true, S: false, D: false }
  },

  updateTrainingDays: async (days: Record<string, boolean>): Promise<void> => {
    const { id: userId } = await requireUser()

    const { error } = await supabase.from('training_days').upsert({
      user_id: userId,
      monday: days.L ?? false,
      tuesday: days.M ?? false,
      wednesday: days.X ?? false,
      thursday: days.J ?? false,
      friday: days.V ?? true,
      saturday: days.S ?? false,
      sunday: days.D ?? true,
    })
    if (error) throw new Error(error.message)
  },

  getWeeklyGoals: async (): Promise<{ strength: number; combat: number; nutrition: number }> => {
    const { id: userId } = await requireUser()

    const { data, error } = await supabase
      .from('weekly_goals')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    if (error) throw new Error(error.message)

    return data
      ? { strength: data.strength, combat: data.combat, nutrition: data.nutrition }
      : { strength: 4, combat: 3, nutrition: 7 }
  },

  updateWeeklyGoals: async (goals: { strength: number; combat: number; nutrition: number }): Promise<void> => {
    const { id: userId } = await requireUser()

    const { error } = await supabase
      .from('weekly_goals')
      .upsert({ user_id: userId, ...goals })
    if (error) throw new Error(error.message)
  },
}
