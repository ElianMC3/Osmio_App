import { create } from 'zustand'
import type { MealEntry, FrequentMeal } from '../shared/types/nutrition.types'

interface NutritionState {
  todayMeals: MealEntry[]
  frequentMeals: FrequentMeal[]
  calorieGoal: number
  addMeal: (meal: MealEntry) => void
  removeMeal: (mealId: string) => void
  addFrequentMeal: (meal: FrequentMeal) => void
  removeFrequentMeal: (mealId: string) => void
  setCalorieGoal: (goal: number) => void
}

export const useNutritionStore = create<NutritionState>((set) => ({
  todayMeals: [],
  frequentMeals: [],
  calorieGoal: 2400,
  addMeal: (meal) => set((state) => ({ todayMeals: [...state.todayMeals, meal] })),
  removeMeal: (mealId) =>
    set((state) => ({ todayMeals: state.todayMeals.filter((m) => m.id !== mealId) })),
  addFrequentMeal: (meal) =>
    set((state) => ({ frequentMeals: [...state.frequentMeals, meal] })),
  removeFrequentMeal: (mealId) =>
    set((state) => ({ frequentMeals: state.frequentMeals.filter((m) => m.id !== mealId) })),
  setCalorieGoal: (goal) => set({ calorieGoal: goal }),
}))
