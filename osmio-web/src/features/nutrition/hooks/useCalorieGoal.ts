import { useMemo } from 'react'

interface CalorieGoal {
  maintenance: number
  target: number
  surplus: number
  protein: number
  carbs: number
  fat: number
}

export function useCalorieGoal(weight: number, activityLevel: number, goal: 'bulk' | 'cut' | 'maintain'): CalorieGoal {
  return useMemo(() => {
    // Simplified Mifflin-St Jeor + activity multiplier
    const bmr = 10 * weight + 625 + 5 // placeholder assuming male, 175cm, 25yo
    const maintenance = Math.round(bmr * activityLevel)
    const surplus = goal === 'bulk' ? 300 : goal === 'cut' ? -500 : 0
    const target = maintenance + surplus
    const protein = Math.round(weight * 2)
    const fat = Math.round(target * 0.25 / 9)
    const carbs = Math.round((target - protein * 4 - fat * 9) / 4)

    return { maintenance, target, surplus, protein, carbs, fat }
  }, [weight, activityLevel, goal])
}
