import { api } from './client'
import type { DailyNutrition, MealEntry } from '../../shared/types/nutrition.types'

export const nutritionApi = {
  getDayNutrition: (date: string) => api.get<DailyNutrition>(`/nutrition/${date}`),
  addMeal: (date: string, meal: Omit<MealEntry, 'id'>) =>
    api.post<MealEntry>(`/nutrition/${date}/meals`, meal),
  deleteMeal: (date: string, mealId: string) =>
    api.delete(`/nutrition/${date}/meals/${mealId}`),
  getWeightHistory: () => api.get<{ date: string; weight: number }[]>('/nutrition/weight'),
  updateWeight: (date: string, weight: number) =>
    api.post('/nutrition/weight', { date, weight }),
}
