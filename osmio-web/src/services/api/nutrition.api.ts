import { supabase } from '../supabase/client'
import type { DailyNutrition, MealEntry, MacroEntry } from '../../shared/types/nutrition.types'
import { localDayRange, parseLocalDate } from '../../shared/utils/dateHelpers'
import type { BodyWeightRow, MealRow, NutritionGoalRow } from './rows'

function mapMealRow(row: MealRow): MealEntry {
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

function sumMacros(meals: MealRow[]): MacroEntry {
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

/** Mediodía local del día pedido: evita que un `T12:00:00Z` caiga en otro día. */
function localNoon(date: string): string {
  const noon = parseLocalDate(date)
  noon.setHours(12)
  return noon.toISOString()
}

export const nutritionApi = {
  getDayNutrition: async (date: string): Promise<DailyNutrition> => {
    const userId = await requireUserId()
    // `logged_at` es timestamptz: el rango se calcula en la zona horaria del
    // usuario y se envía en UTC. Con T00:00:00Z/T23:59:59Z las comidas de la
    // tarde-noche caían en el día siguiente (o en el anterior).
    const { start, end } = localDayRange(date)

    const { data: meals, error: mealsError } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', start)
      .lt('logged_at', end)
      .order('logged_at', { ascending: true })
    if (mealsError) throw new Error(mealsError.message)

    const { data: goalRow, error: goalError } = await supabase
      .from('nutrition_goals')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (goalError && goalError.code !== 'PGRST116') throw new Error(goalError.message)

    const mealRows = (meals ?? []) as MealRow[]
    const goal = goalRow as NutritionGoalRow | null
    const defaultGoal: MacroEntry = { calories: 2400, protein: 180, carbs: 280, fat: 75 }

    return {
      date,
      meals: mealRows.map(mapMealRow),
      totals: sumMacros(mealRows),
      goal: goal
        ? { calories: goal.calories, protein: goal.protein, carbs: goal.carbs, fat: goal.fat }
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
        logged_at: meal.timestamp || localNoon(date),
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return mapMealRow(data as MealRow)
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
    return (data ?? []) as BodyWeightRow[]
  },

  updateWeight: async (date: string, weight: number): Promise<void> => {
    const userId = await requireUserId()
    const { error } = await supabase
      .from('body_weight')
      .upsert({ user_id: userId, date, weight }, { onConflict: 'user_id, date' })
    if (error) throw new Error(error.message)
  },

  updateNutritionGoal: async (goal: MacroEntry): Promise<void> => {
    const userId = await requireUserId()
    // user_id es la PK de nutrition_goals: un upsert evita duplicados y
    // sustituye al select('id') previo, que apuntaba a una columna inexistente.
    const { error } = await supabase
      .from('nutrition_goals')
      .upsert(
        {
          user_id: userId,
          calories: goal.calories,
          protein: goal.protein,
          carbs: goal.carbs,
          fat: goal.fat,
        },
        { onConflict: 'user_id' }
      )
    if (error) throw new Error(error.message)
  },
}
