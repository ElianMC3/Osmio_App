import { api } from './client'

export interface StrengthAnalytics {
  volumeByWeek: { week: string; load: number }[]
  prs: { exercise: string; weight: string; date: string }[]
}

export interface CombatAnalytics {
  roundsByWeek: { week: string; striking: number; grappling: number }[]
  totalRounds: { striking: number; grappling: number }
}

export const analyticsApi = {
  getStrengthAnalytics: () => api.get<StrengthAnalytics>('/analytics/strength'),
  getCombatAnalytics: () => api.get<CombatAnalytics>('/analytics/combat'),
  getConsistency: () => api.get<{ date: string; active: boolean }[]>('/analytics/consistency'),
}
