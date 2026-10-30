import { supabase } from '../supabase/client'
import { getCurrentUser } from '../supabase/currentUser'
import type { UserProfile } from '../../store/userStore'
import type { ProfileRow, TrainingDaysRow, WeeklyGoalsRow } from './rows'

async function requireUser(): Promise<{ id: string; email?: string }> {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')
  return { id: user.id, email: user.email ?? undefined }
}

function mapProfileRow(row: ProfileRow): UserProfile & { age?: number } {
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
    return data ? mapProfileRow(data as ProfileRow) : null
  },

  updateProfile: async (profile: Partial<UserProfile & { age?: number }>): Promise<void> => {
    const { id: userId, email } = await requireUser()

    const payload: Record<string, string | number> = {}
    if (profile.name !== undefined) payload.name = profile.name
    if (profile.weight !== undefined) payload.weight = profile.weight
    if (profile.height !== undefined) payload.height = profile.height
    if (profile.experience !== undefined) payload.experience = profile.experience
    if (profile.goal !== undefined) payload.goal = profile.goal
    if (profile.age !== undefined) payload.age = profile.age

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, email: email ?? '', ...payload })

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

    if (!data) return { L: true, M: true, X: false, J: true, V: true, S: false, D: false }
    const row = data as TrainingDaysRow
    return {
      L: row.monday,
      M: row.tuesday,
      X: row.wednesday,
      J: row.thursday,
      V: row.friday,
      S: row.saturday,
      D: row.sunday,
    }
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

    if (!data) return { strength: 4, combat: 3, nutrition: 7 }
    const row = data as WeeklyGoalsRow
    return { strength: row.strength, combat: row.combat, nutrition: row.nutrition }
  },

  updateWeeklyGoals: async (goals: { strength: number; combat: number; nutrition: number }): Promise<void> => {
    const { id: userId } = await requireUser()

    const { error } = await supabase
      .from('weekly_goals')
      .upsert({ user_id: userId, ...goals })
    if (error) throw new Error(error.message)
  },
}
