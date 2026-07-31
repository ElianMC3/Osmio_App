import { supabase } from '../supabase/client'
import type { DailyNutrition, MealEntry, MacroEntry } from '../../shared/types/nutrition.types'

function mapMealRow(row: any): MealEntry {
  return {
    id: row.id,
    name: row.name,
    calories: row.calories,
    protein: row.protein,
    carbs: row.carbs,
    fat: row.fat,
    timestamp: row.logged_at,
  }
}

function sumMacros(meals: any[]): MacroEntry {
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 }
  for (const m of meals) {
    totals.calories += Number(m.calories)
    totals.protein += Number(m.protein)
    totals.carbs += Number(m.carbs)
    totals.fat += Number(m.fat)
  }
  return totals
}

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('Not authenticated')
  return data.user.id
}

export const nutritionApi = {
  getDayNutrition: async (date: string): Promise<DailyNutrition> => {
    const userId = await requireUserId()
    const dayStart = `${date}T00:00:00Z`
    const dayEnd = `${date}T23:59:59Z`

    const { data: meals, error: mealsError } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', dayStart)
      .lt('logged_at', dayEnd)
      .order('logged_at', { ascending: true })
    if (mealsError) throw new Error(mealsError.message)

    const { data: goalRow, error: goalError } = await supabase
      .from('nutrition_goals')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (goalError && goalError.code !== 'PGRST116') throw new Error(goalError.message)

    const defaultGoal: MacroEntry = { calories: 2400, protein: 180, carbs: 280, fat: 75 }

    return {
      date,
      meals: meals.map(mapMealRow),
      totals: sumMacros(meals),
      goal: goalRow
        ? { calories: goalRow.calories, protein: goalRow.protein, carbs: goalRow.carbs, fat: goalRow.fat }
        : defaultGoal,
    }
  },

  addMeal: async (date: string, meal: Omit<MealEntry, 'id'>): Promise<MealEntry> => {
    const userId = await requireUserId()
    const { data, error } = await supabase
      .from('meals')
      .insert({
        user_id: userId,
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        logged_at: meal.timestamp || `${date}T12:00:00Z`,
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return mapMealRow(data)
  },

  deleteMeal: async (_date: string, mealId: string): Promise<void> => {
    const { error } = await supabase.from('meals').delete().eq('id', mealId)
    if (error) throw new Error(error.message)
  },

  getWeightHistory: async (): Promise<{ date: string; weight: number }[]> => {
    const userId = await requireUserId()
    const { data, error } = await supabase
      .from('body_weight')
      .select('date, weight')
      .eq('user_id', userId)
      .order('date', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  },

  updateWeight: async (date: string, weight: number): Promise<void> => {
    const userId = await requireUserId()
    const { error } = await supabase
      .from('body_weight')
      .upsert({ user_id: userId, date, weight }, { onConflict: 'user_id, date' })
    if (error) throw new Error(error.message)
  },
}
