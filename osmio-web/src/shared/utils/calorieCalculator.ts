export function calculateBMR(weight: number, height: number, age: number, gender: 'male' | 'female'): number {
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
  proteinRatio: number,
  fatRatio: number,
): { protein: number; carbs: number; fat: number } {
  const protein = Math.round((calories * proteinRatio) / 4)
  const fat = Math.round((calories * fatRatio) / 9)
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4)
  return { protein, carbs, fat }
}
