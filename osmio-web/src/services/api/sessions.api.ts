import { api } from './client'
import type { StrengthSession, CombatSession } from '../../shared/types/session.types'

export const sessionsApi = {
  getStrengthSessions: () => api.get<StrengthSession[]>('/sessions/strength'),
  getCombatSessions: () => api.get<CombatSession[]>('/sessions/combat'),
  createStrengthSession: (data: Omit<StrengthSession, 'id'>) =>
    api.post<StrengthSession>('/sessions/strength', data),
  createCombatSession: (data: Omit<CombatSession, 'id'>) =>
    api.post<CombatSession>('/sessions/combat', data),
  getSessionsByDate: (date: string) => api.get<(StrengthSession | CombatSession)[]>(`/sessions?date=${date}`),
}
