export type Gender = 'male' | 'female'
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced'
export type NutritionGoalType = 'bulk' | 'cut' | 'maintain'

/** Factores de actividad aplicados al BMR según el nivel de experiencia. */
export const ACTIVITY_MULTIPLIERS: Record<ExperienceLevel, number> = {
  beginner: 1.375,
  intermediate: 1.55,
  advanced: 1.725,
}

/** Ajuste calórico diario sobre el mantenimiento según el objetivo. */
export const GOAL_SURPLUS: Record<NutritionGoalType, number> = {
  bulk: 300,
  cut: -500,
  maintain: 0,
}

export const DEFAULT_AGE = 25
/** Gramos de proteína por kilo de peso corporal. */
export const PROTEIN_PER_KG = 2
/** Fracción de las calorías objetivo destinada a grasa. */
export const DEFAULT_FAT_RATIO = 0.25

export interface MacroSplit {
  protein: number
  carbs: number
  fat: number
}

export interface CalorieGoal extends MacroSplit {
  bmr: number
  maintenance: number
  target: number
  surplus: number
}

export interface CalorieGoalParams {
  weightKg: number
  heightCm: number
  age?: number
  gender?: Gender
  activityMultiplier?: number
  goal?: NutritionGoalType
}

export function calculateBMR(weight: number, height: number, age: number, gender: Gender): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5
  }
  return 10 * weight + 6.25 * height - 5 * age - 161
}

export function calculateTDEE(bmr: number, activityLevel: number): number {
  return Math.round(bmr * activityLevel)
}

export function calculateMacroSplit(
  calories: number,
  bodyWeightKg: number,
  fatRatio: number = DEFAULT_FAT_RATIO,
): MacroSplit {
  const protein = Math.round(bodyWeightKg * PROTEIN_PER_KG)
  const fat = Math.round((calories * fatRatio) / 9)
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4)
  return { protein, carbs, fat }
}

export function calculateCalorieGoal({
  weightKg,
  heightCm,
  age = DEFAULT_AGE,
  gender = 'male',
  activityMultiplier = ACTIVITY_MULTIPLIERS.intermediate,
  goal = 'bulk',
}: CalorieGoalParams): CalorieGoal {
  const bmr = calculateBMR(weightKg, heightCm, age, gender)
  const maintenance = calculateTDEE(bmr, activityMultiplier)
  const surplus = GOAL_SURPLUS[goal]
  const target = Math.round(maintenance + surplus)

  return {
    bmr: Math.round(bmr),
    maintenance,
    target,
    surplus,
    ...calculateMacroSplit(target, weightKg),
  }
}
