import { create } from 'zustand'

interface OnboardingData {
  name: string
  weight: number
  height: number
  goal: 'strength' | 'combat' | 'both'
  experience: 'beginner' | 'intermediate' | 'advanced'
}

interface OnboardingState {
  currentStep: number
  data: Partial<OnboardingData>
  setStep: (step: number) => void
  updateData: (partial: Partial<OnboardingData>) => void
  reset: () => void
}

const initialState = {
  currentStep: 0,
  data: {},
}

export const useOnboarding = create<OnboardingState>((set) => ({
  ...initialState,
  setStep: (step) => set({ currentStep: step }),
  updateData: (partial) => set((state) => ({ data: { ...state.data, ...partial } })),
  reset: () => set(initialState),
}))
