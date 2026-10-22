import { useMemo } from 'react'

import {
  calculateCalorieGoal,
  type CalorieGoal,
  type Gender,
  type NutritionGoalType,
} from '@/shared/utils/calorieCalculator'

interface Params {
  weightKg: number
  heightCm: number
  age?: number
  gender?: Gender
  activityMultiplier?: number
  goal?: NutritionGoalType
}

export function useCalorieGoal({
  weightKg,
  heightCm,
  age,
  gender,
  activityMultiplier,
  goal,
}: Params): CalorieGoal {
  return useMemo(
    () => calculateCalorieGoal({ weightKg, heightCm, age, gender, activityMultiplier, goal }),
    [weightKg, heightCm, age, gender, activityMultiplier, goal],
  )
}
