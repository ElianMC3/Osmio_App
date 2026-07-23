import { create } from 'zustand'
import type { StrengthSession, CombatSession } from '../shared/types/session.types'

interface SessionState {
  strengthSessions: StrengthSession[]
  combatSessions: CombatSession[]
  activeSession: { type: 'strength' | 'combat'; exerciseId?: number } | null
  addStrengthSession: (session: StrengthSession) => void
  addCombatSession: (session: CombatSession) => void
  setActiveSession: (session: SessionState['activeSession']) => void
  clearActiveSession: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  strengthSessions: [],
  combatSessions: [],
  activeSession: null,
  addStrengthSession: (session) =>
    set((state) => ({ strengthSessions: [...state.strengthSessions, session] })),
  addCombatSession: (session) =>
    set((state) => ({ combatSessions: [...state.combatSessions, session] })),
  setActiveSession: (session) => set({ activeSession: session }),
  clearActiveSession: () => set({ activeSession: null }),
}))
