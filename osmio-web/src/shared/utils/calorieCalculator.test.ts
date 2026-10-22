import { describe, expect, it } from 'vitest'

import {
  ACTIVITY_MULTIPLIERS,
  calculateBMR,
  calculateCalorieGoal,
  calculateMacroSplit,
  calculateTDEE,
} from './calorieCalculator'

describe('calculateBMR', () => {
  it('aplica la fórmula de Mifflin-St Jeor para hombres', () => {
    // 10*80 + 6.25*180 - 5*30 + 5
    expect(calculateBMR(80, 180, 30, 'male')).toBe(1780)
  })

  it('aplica la fórmula de Mifflin-St Jeor para mujeres', () => {
    // 10*80 + 6.25*180 - 5*30 - 161
    expect(calculateBMR(80, 180, 30, 'female')).toBe(1614)
  })

  it('devuelve el mismo resultado en ambos sexos salvo la constante', () => {
    const male = calculateBMR(70, 170, 25, 'male')
    const female = calculateBMR(70, 170, 25, 'female')

    expect(male - female).toBe(166)
  })

  it('no redondea: devuelve el valor exacto de la fórmula', () => {
    // 10*70.5 + 6.25*175 - 5*28 + 5 = 1663.75
    expect(calculateBMR(70.5, 175, 28, 'male')).toBe(1663.75)
  })

  it('descuenta calorías a medida que aumenta la edad', () => {
    expect(calculateBMR(80, 180, 40, 'male')).toBe(1730)
  })
})

describe('calculateTDEE', () => {
  it('multiplica el BMR por el factor de actividad y redondea', () => {
    // 1780 * 1.375 = 2447.5 → 2448
    expect(calculateTDEE(1780, 1.375)).toBe(2448)
  })

  it('devuelve un entero', () => {
    const result = calculateTDEE(1780, 1.55)

    expect(Number.isInteger(result)).toBe(true)
    expect(result).toBe(2759)
  })

  it('devuelve el mismo valor con factor 1', () => {
    expect(calculateTDEE(1780, 1)).toBe(1780)
  })
})

describe('calculateMacroSplit', () => {
  it('asigna 2 g de proteína por kilo de peso corporal', () => {
    expect(calculateMacroSplit(3000, 80).protein).toBe(160)
  })

  it('asigna un 25% de las calorías a la grasa por defecto', () => {
    // 3000*0.25/9 = 83.3 → 83 g
    expect(calculateMacroSplit(3000, 80).fat).toBe(83)
  })

  it('respeta un porcentaje de grasa distinto', () => {
    // 3000*0.30/9 = 100 g
    expect(calculateMacroSplit(3000, 80, 0.3).fat).toBe(100)
  })

  it('asigna a los carbohidratos las calorías que sobran', () => {
    // (3000 - 160*4 - 83*9)/4 = 403.25 → 403 g
    expect(calculateMacroSplit(3000, 80)).toEqual({
      protein: 160,
      carbs: 403,
      fat: 83,
    })
  })

  it('devuelve gramos enteros', () => {
    const macros = calculateMacroSplit(2500, 80)

    expect(Number.isInteger(macros.protein)).toBe(true)
    expect(Number.isInteger(macros.fat)).toBe(true)
    expect(Number.isInteger(macros.carbs)).toBe(true)
  })

  it('reconstruye las calorías de partida salvo redondeo (±4 kcal)', () => {
    const calories = 2500
    const { protein, carbs, fat } = calculateMacroSplit(calories, 80)

    expect(Math.abs(protein * 4 + carbs * 4 + fat * 9 - calories)).toBeLessThanOrEqual(4)
  })

  it('no asigna proteína si no hay peso corporal', () => {
    expect(calculateMacroSplit(2500, 0).protein).toBe(0)
  })

  it('asigna menos carbohidratos cuando sube el porcentaje de grasa', () => {
    const lean = calculateMacroSplit(2500, 80, 0.2)
    const fatty = calculateMacroSplit(2500, 80, 0.35)

    expect(fatty.carbs).toBeLessThan(lean.carbs)
  })
})

describe('calculateCalorieGoal', () => {
  it('calcula el objetivo de volumen por defecto', () => {
    const goal = calculateCalorieGoal({ weightKg: 80, heightCm: 180 })

    expect(goal).toEqual({
      bmr: 1805,
      maintenance: 2798,
      surplus: 300,
      target: 3098,
      protein: 160,
      carbs: 421,
      fat: 86,
    })
  })

  it('resta 500 kcal en definición', () => {
    const goal = calculateCalorieGoal({ weightKg: 80, heightCm: 180, goal: 'cut' })

    expect(goal.surplus).toBe(-500)
    expect(goal.target).toBe(2298)
    expect(goal.carbs).toBe(271)
  })

  it('no aplica superávit en mantenimiento', () => {
    const goal = calculateCalorieGoal({ weightKg: 80, heightCm: 180, goal: 'maintain' })

    expect(goal.surplus).toBe(0)
    expect(goal.target).toBe(goal.maintenance)
  })

  it('usa 25 años cuando no se indica la edad', () => {
    const goal = calculateCalorieGoal({ weightKg: 80, heightCm: 180 })

    // 10*80 + 6.25*180 - 5*25 + 5 = 1805
    expect(goal.bmr).toBe(1805)
  })

  it('respeta la edad indicada', () => {
    const goal = calculateCalorieGoal({ weightKg: 80, heightCm: 180, age: 40 })

    // 10*80 + 6.25*180 - 5*40 + 5 = 1730
    expect(goal.bmr).toBe(1730)
  })

  it('usa el multiplicador intermedio por defecto', () => {
    const goal = calculateCalorieGoal({ weightKg: 80, heightCm: 180 })

    expect(ACTIVITY_MULTIPLIERS.intermediate).toBe(1.55)
    expect(goal.maintenance).toBe(2798)
  })

  it('respeta un multiplicador de actividad explícito', () => {
    const goal = calculateCalorieGoal({
      weightKg: 80,
      heightCm: 180,
      activityMultiplier: ACTIVITY_MULTIPLIERS.beginner,
    })

    // 1805 * 1.375 = 2481.875 → 2482
    expect(goal.maintenance).toBe(2482)
    expect(goal.target).toBe(2782)
  })

  it('usa la fórmula femenina cuando se indica', () => {
    const goal = calculateCalorieGoal({ weightKg: 80, heightCm: 180, gender: 'female' })

    // 1805 - 161 - 5 = 1639 → 1639 * 1.55 = 2540.45 → 2540
    expect(goal.bmr).toBe(1639)
    expect(goal.maintenance).toBe(2540)
    expect(goal.protein).toBe(160)
  })

  it('calcula el mantenimiento sobre el BMR exacto, no sobre el redondeado', () => {
    const goal = calculateCalorieGoal({ weightKg: 82.5, heightCm: 178.5 })

    // BMR exacto 1820.625 → 1820.625 * 1.55 = 2821.96875 → 2822
    // con el BMR redondeado daría 1821 * 1.55 = 2822.55 → 2823
    expect(goal.bmr).toBe(1821)
    expect(goal.maintenance).toBe(2822)
  })

  it('deriva la proteína del peso corporal y no de las calorías', () => {
    const light = calculateCalorieGoal({ weightKg: 70, heightCm: 180, goal: 'cut' })
    const heavy = calculateCalorieGoal({ weightKg: 90, heightCm: 180, goal: 'cut' })

    expect(light.protein).toBe(140)
    expect(heavy.protein).toBe(180)
    expect(heavy.target).toBeGreaterThan(light.target)
  })

  it('mantiene target como mantenimiento más superávit sin doble redondeo', () => {
    const goal = calculateCalorieGoal({ weightKg: 80, heightCm: 180, goal: 'bulk' })

    expect(goal.target).toBe(goal.maintenance + goal.surplus)
  })
})
