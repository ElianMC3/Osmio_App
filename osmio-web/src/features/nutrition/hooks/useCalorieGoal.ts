import { useMemo } from 'react'

export type NutritionGoalType = 'bulk' | 'cut' | 'maintain'

export const ACTIVITY_MULTIPLIERS: Record<'beginner' | 'intermediate' | 'advanced', number> = {
  beginner: 1.375,
  intermediate: 1.55,
  advanced: 1.725,
}

export interface CalorieGoal {
  bmr: number
  maintenance: number
  target: number
  surplus: number
  protein: number
  carbs: number
  fat: number
}

interface Params {
  weightKg: number
  heightCm: number
  age?: number
  activityMultiplier?: number
  goal?: NutritionGoalType
}

export function useCalorieGoal({
  weightKg,
  heightCm,
  age = 25,
  activityMultiplier = ACTIVITY_MULTIPLIERS.intermediate,
  goal = 'bulk',
}: Params): CalorieGoal {
  return useMemo(() => {
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    const maintenance = Math.round(bmr * activityMultiplier)
    const surplus = goal === 'bulk' ? 300 : goal === 'cut' ? -500 : 0
    const target = Math.round(maintenance + surplus)
    const protein = Math.round(weightKg * 2)
    const fat = Math.round((target * 0.25) / 9)
    const carbs = Math.round((target - protein * 4 - fat * 9) / 4)
    return { bmr: Math.round(bmr), maintenance, target, surplus, protein, carbs, fat }
  }, [weightKg, heightCm, age, activityMultiplier, goal])
}
