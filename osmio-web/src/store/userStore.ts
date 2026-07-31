import { create } from 'zustand'

export interface UserProfile {
  id: string
  name: string
  email: string
  weight: number
  height: number
  experience: 'beginner' | 'intermediate' | 'advanced'
  goal: 'strength' | 'combat' | 'both'
}

interface UserState {
  profile: UserProfile | null
  setProfile: (profile: UserProfile) => void
  updateProfile: (partial: Partial<UserProfile>) => void
  clearProfile: () => void
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  updateProfile: (partial) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...partial } : null,
    })),
  clearProfile: () => set({ profile: null }),
}))
