import { describe, expect, it } from 'vitest'

import { calculateBMR, calculateMacroSplit, calculateTDEE } from './calorieCalculator'

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
  it('reparte las calorías en gramos de proteína, grasa y carbohidratos', () => {
    // 2759*0.30/4 = 206.9 → 207 g proteína
    // 2759*0.25/9 = 76.6  → 77 g grasa
    // (2759 - 207*4 - 77*9)/4 = 309.5 → 310 g carbohidratos
    expect(calculateMacroSplit(2759, 0.3, 0.25)).toEqual({
      protein: 207,
      fat: 77,
      carbs: 310,
    })
  })

  it('devuelve gramos enteros', () => {
    const macros = calculateMacroSplit(2500, 0.3, 0.25)

    expect(Number.isInteger(macros.protein)).toBe(true)
    expect(Number.isInteger(macros.fat)).toBe(true)
    expect(Number.isInteger(macros.carbs)).toBe(true)
  })

  it('asigna los carbohidratos como calorías restantes', () => {
    const calories = 2500
    const { protein, carbs, fat } = calculateMacroSplit(calories, 0.3, 0.25)

    // El reparto reconstruye las calorías de partida salvo redondeo (±4 kcal)
    expect(Math.abs(protein * 4 + carbs * 4 + fat * 9 - calories)).toBeLessThanOrEqual(4)
  })

  it('con más proteína y grasa asigna menos carbohidratos', () => {
    const light = calculateMacroSplit(2500, 0.25, 0.2)
    const heavy = calculateMacroSplit(2500, 0.35, 0.3)

    expect(heavy.protein).toBeGreaterThan(light.protein)
    expect(heavy.fat).toBeGreaterThan(light.fat)
    expect(heavy.carbs).toBeLessThan(light.carbs)
  })
})
