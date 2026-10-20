// Filas tal como las devuelve PostgREST (snake_case). Tiparlas evita que un
// cambio de columna pase desapercibido: el mapeo falla en compilación.
//
// Las columnas `numeric` llegan como number y las anulables como null.

export interface ExerciseRow {
  id: number
  name: string
  category: string
  type: string
  body_part: string | null
  equipment: string | null
  muscle_group: string | null
  target: string | null
  secondary_muscles: string[] | null
  instructions: Record<string, string> | null
  image: string | null
  gif_url: string | null
  attribution: string | null
}

export interface SetEntryRow {
  id: string
  session_id: string
  set_order: number
  reps: number
  weight: number
  rpe: number | null
}

export interface StrengthSessionRow {
  id: string
  user_id: string
  date: string
  exercise_id: number | null
  exercise_name: string
  notes: string | null
  created_at: string
}

export interface StrengthSessionWithSetsRow extends StrengthSessionRow {
  set_entries: SetEntryRow[] | null
}

export interface CombatSessionRow {
  id: string
  user_id: string
  date: string
  type: 'striking' | 'grappling'
  combat_type: string | null
  result: string | null
  rounds: number
  duration_minutes: number
  rpe: number | null
  positions: string[] | null
  notes: string | null
  created_at: string
}

export interface MealRow {
  id: string
  user_id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  logged_at: string
}

export interface NutritionGoalRow {
  user_id: string
  calories: number
  protein: number
  carbs: number
  fat: number
  updated_at: string
}

export interface BodyWeightRow {
  user_id: string
  date: string
  weight: number
}

export interface ProfileRow {
  id: string
  name: string
  email: string
  weight: number | null
  height: number | null
  age: number | null
  experience: 'beginner' | 'intermediate' | 'advanced' | null
  goal: 'strength' | 'combat' | 'both' | null
  created_at: string
}

export interface RoutineRow {
  id: string
  user_id: string
  name: string
  description: string
  created_at: string
}

export interface RoutineExerciseRow {
  id: string
  routine_id: string
  exercise_id: number
  position: number
  target_sets: number
  target_reps_min: number
  target_reps_max: number
  current_weight: number
  rest_seconds: number
  notes: string
  dropset: boolean
  dropset_percent: number
  exercises?: ExerciseRow | null
}

export interface RoutineWithExercisesRow extends RoutineRow {
  routine_exercises: RoutineExerciseRow[] | null
}

export interface VolumeByWeekRow {
  user_id: string
  week: string
  load: number
}

export interface PrRow {
  user_id: string
  exercise: string
  weight: string
  date: string
}

export interface CombatRoundsByWeekRow {
  user_id: string
  week: string
  striking: number | null
  grappling: number | null
}

export interface CombatTotalRoundsRow {
  user_id: string
  striking: number
  grappling: number
}

export interface TrainingConsistencyRow {
  user_id: string
  date: string
  active: boolean
}

export interface TrainingDaysRow {
  user_id: string
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
}

export interface WeeklyGoalsRow {
  user_id: string
  strength: number
  combat: number
  nutrition: number
  updated_at: string
}
