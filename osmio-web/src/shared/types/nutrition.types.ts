export interface MacroEntry {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface MealEntry {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  timestamp: string
}

export interface DailyNutrition {
  date: string
  meals: MealEntry[]
  totals: MacroEntry
  goal: MacroEntry
}

export interface FrequentMeal {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
}
