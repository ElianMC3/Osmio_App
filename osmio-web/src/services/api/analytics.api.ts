import { supabase } from '../supabase/client'

export interface StrengthAnalytics {
  volumeByWeek: { week: string; load: number }[]
  prs: { exercise: string; weight: string; date: string }[]
}

export interface CombatAnalytics {
  roundsByWeek: { week: string; striking: number; grappling: number }[]
  totalRounds: { striking: number; grappling: number }
}

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('Not authenticated')
  return data.user.id
}

export const analyticsApi = {
  getStrengthAnalytics: async (): Promise<StrengthAnalytics> => {
    const userId = await requireUserId()

    const { data: volumeData, error: volumeError } = await supabase
      .from('strength_volume_by_week')
      .select('week, load')
      .eq('user_id', userId)
    if (volumeError) throw new Error(volumeError.message)

    const { data: prsData, error: prsError } = await supabase
      .from('strength_prs')
      .select('exercise, weight, date')
      .eq('user_id', userId)
    if (prsError) throw new Error(prsError.message)

    return {
      volumeByWeek: volumeData ?? [],
      prs: prsData ?? [],
    }
  },

  getCombatAnalytics: async (): Promise<CombatAnalytics> => {
    const userId = await requireUserId()

    const { data: roundsData, error: roundsError } = await supabase
      .from('combat_rounds_by_week')
      .select('week, striking, grappling')
      .eq('user_id', userId)
    if (roundsError) throw new Error(roundsError.message)

    const { data: totalsData, error: totalsError } = await supabase
      .from('combat_total_rounds')
      .select('striking, grappling')
      .eq('user_id', userId)
      .maybeSingle()
    if (totalsError) throw new Error(totalsError.message)

    return {
      roundsByWeek: roundsData ?? [],
      totalRounds: totalsData ?? { striking: 0, grappling: 0 },
    }
  },

  getConsistency: async (): Promise<{ date: string; active: boolean }[]> => {
    const userId = await requireUserId()

    const { data, error } = await supabase
      .from('training_consistency')
      .select('date, active')
      .eq('user_id', userId)
    if (error) throw new Error(error.message)
    return data ?? []
  },
}
