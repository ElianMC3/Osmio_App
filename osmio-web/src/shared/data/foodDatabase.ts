export interface FoodItem {
  name: string
  keywords: string[]
  kcalPer100g: number
  proteinPer100g: number
  carbsPer100g: number
  fatPer100g: number
}

export const FOOD_DB: FoodItem[] = [
  { name: 'Pechuga de pollo', keywords: ['pollo', 'pechuga', 'parrilla', 'plancha'], kcalPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6 },
  { name: 'Muslo de pollo', keywords: ['pollo', 'muslo'], kcalPer100g: 209, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 11 },
  { name: 'Pavo', keywords: ['pavo', 'pechuga de pavo'], kcalPer100g: 135, proteinPer100g: 30, carbsPer100g: 0, fatPer100g: 1 },
  { name: 'Carne de res magra', keywords: ['res', 'ternera', 'bistec', 'carne roja', 'carne'], kcalPer100g: 217, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 12 },
  { name: 'Carne de cerdo', keywords: ['cerdo', 'pork'], kcalPer100g: 242, proteinPer100g: 27, carbsPer100g: 0, fatPer100g: 14 },
  { name: 'Jamón', keywords: ['jamon', 'serrano', 'cocido'], kcalPer100g: 145, proteinPer100g: 21, carbsPer100g: 1.5, fatPer100g: 6 },
  { name: 'Salchicha', keywords: ['salchicha', 'chorizo', 'embutido'], kcalPer100g: 301, proteinPer100g: 12, carbsPer100g: 2.5, fatPer100g: 27 },
  { name: 'Salmón', keywords: ['salmon', 'pescado'], kcalPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13 },
  { name: 'Atún en agua', keywords: ['atun', 'tonno', 'pescado'], kcalPer100g: 116, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 1 },
  { name: 'Camarones', keywords: ['camaron', 'gamba', 'langostino'], kcalPer100g: 99, proteinPer100g: 24, carbsPer100g: 0.2, fatPer100g: 0.3 },
  { name: 'Huevo', keywords: ['huevo', 'huevos'], kcalPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11 },
  { name: 'Clara de huevo', keywords: ['clara', 'huevo'], kcalPer100g: 52, proteinPer100g: 11, carbsPer100g: 1, fatPer100g: 0.2 },
  { name: 'Arroz blanco', keywords: ['arroz', 'jazmin', 'arroz blanco'], kcalPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatPer100g: 0.3 },
  { name: 'Arroz integral', keywords: ['arroz integral', 'arroz'], kcalPer100g: 112, proteinPer100g: 2.6, carbsPer100g: 24, fatPer100g: 0.9 },
  { name: 'Pasta cocida', keywords: ['pasta', 'fideos', 'tallarines', 'espagueti'], kcalPer100g: 131, proteinPer100g: 5, carbsPer100g: 25, fatPer100g: 1.1 },
  { name: 'Avena', keywords: ['avena', 'oat'], kcalPer100g: 71, proteinPer100g: 2.5, carbsPer100g: 12, fatPer100g: 1.5 },
  { name: 'Pan integral', keywords: ['pan', 'pan integral', 'tostada'], kcalPer100g: 247, proteinPer100g: 13, carbsPer100g: 41, fatPer100g: 3.4 },
  { name: 'Papa', keywords: ['papa', 'patata', 'potato'], kcalPer100g: 77, proteinPer100g: 2, carbsPer100g: 17, fatPer100g: 0.1 },
  { name: 'Batata', keywords: ['batata', 'camote', 'boniato'], kcalPer100g: 86, proteinPer100g: 1.6, carbsPer100g: 20, fatPer100g: 0.1 },
  { name: 'Elote', keywords: ['elote', 'maiz', 'choclo'], kcalPer100g: 96, proteinPer100g: 3.4, carbsPer100g: 21, fatPer100g: 1.5 },
  { name: 'Garbanzos', keywords: ['garbanzo', 'legumbre'], kcalPer100g: 164, proteinPer100g: 8.9, carbsPer100g: 27, fatPer100g: 2.6 },
  { name: 'Lentejas', keywords: ['lenteja', 'legumbre'], kcalPer100g: 116, proteinPer100g: 9, carbsPer100g: 20, fatPer100g: 0.4 },
  { name: 'Frijoles negros', keywords: ['frijol', 'frijoles', 'poroto', 'judia'], kcalPer100g: 132, proteinPer100g: 8.9, carbsPer100g: 24, fatPer100g: 0.5 },
  { name: 'Tofu', keywords: ['tofu', 'soja'], kcalPer100g: 76, proteinPer100g: 8, carbsPer100g: 1.9, fatPer100g: 4.8 },
  { name: 'Brócoli', keywords: ['brocoli', 'verdura'], kcalPer100g: 35, proteinPer100g: 2.4, carbsPer100g: 7, fatPer100g: 0.4 },
  { name: 'Espinaca', keywords: ['espinaca', 'verdura'], kcalPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4 },
  { name: 'Zanahoria', keywords: ['zanahoria', 'carrot'], kcalPer100g: 41, proteinPer100g: 0.9, carbsPer100g: 9.6, fatPer100g: 0.2 },
  { name: 'Tomate', keywords: ['tomate', 'tomato'], kcalPer100g: 18, proteinPer100g: 0.9, carbsPer100g: 3.9, fatPer100g: 0.2 },
  { name: 'Aguacate', keywords: ['aguacate', 'palta', 'avocado'], kcalPer100g: 160, proteinPer100g: 2, carbsPer100g: 9, fatPer100g: 15 },
  { name: 'Plátano', keywords: ['platano', 'banana', 'banano'], kcalPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23, fatPer100g: 0.3 },
  { name: 'Manzana', keywords: ['manzana', 'apple'], kcalPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 14, fatPer100g: 0.2 },
  { name: 'Naranja', keywords: ['naranja', 'orange'], kcalPer100g: 47, proteinPer100g: 0.9, carbsPer100g: 12, fatPer100g: 0.1 },
  { name: 'Frutilla', keywords: ['frutilla', 'fresa', 'strawberry'], kcalPer100g: 32, proteinPer100g: 0.7, carbsPer100g: 7.7, fatPer100g: 0.3 },
  { name: 'Arándanos', keywords: ['arandano', 'blueberry'], kcalPer100g: 57, proteinPer100g: 0.7, carbsPer100g: 14, fatPer100g: 0.3 },
  { name: 'Leche entera', keywords: ['leche', 'milk'], kcalPer100g: 61, proteinPer100g: 3.2, carbsPer100g: 4.8, fatPer100g: 3.3 },
  { name: 'Yogur natural', keywords: ['yogur', 'yogurt', 'yogourt'], kcalPer100g: 59, proteinPer100g: 3.5, carbsPer100g: 4.7, fatPer100g: 3.3 },
  { name: 'Yogur griego', keywords: ['yogur griego', 'yogurt griego'], kcalPer100g: 59, proteinPer100g: 10, carbsPer100g: 3.6, fatPer100g: 0.4 },
  { name: 'Queso cheddar', keywords: ['queso', 'cheddar'], kcalPer100g: 403, proteinPer100g: 25, carbsPer100g: 1.3, fatPer100g: 33 },
  { name: 'Queso crema', keywords: ['queso crema', 'cream cheese'], kcalPer100g: 342, proteinPer100g: 6, carbsPer100g: 4, fatPer100g: 34 },
  { name: 'Queso cottage', keywords: ['cottage', 'queso'], kcalPer100g: 98, proteinPer100g: 11, carbsPer100g: 3.4, fatPer100g: 4.3 },
  { name: 'Almendras', keywords: ['almendra', 'fruto seco'], kcalPer100g: 579, proteinPer100g: 21, carbsPer100g: 22, fatPer100g: 50 },
  { name: 'Nueces', keywords: ['nuez', 'nueces', 'fruto seco'], kcalPer100g: 654, proteinPer100g: 15, carbsPer100g: 14, fatPer100g: 65 },
  { name: 'Maní', keywords: ['mani', 'cacahuate', 'fruto seco'], kcalPer100g: 567, proteinPer100g: 26, carbsPer100g: 16, fatPer100g: 49 },
  { name: 'Mantequilla de maní', keywords: ['mantequilla de mani', 'manteca de cacahuate'], kcalPer100g: 588, proteinPer100g: 25, carbsPer100g: 20, fatPer100g: 50 },
  { name: 'Aceite de oliva', keywords: ['aceite', 'oliva', 'aceite de oliva'], kcalPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100 },
  { name: 'Hummus', keywords: ['hummus', 'garbanzo'], kcalPer100g: 166, proteinPer100g: 8, carbsPer100g: 14, fatPer100g: 10 },
]

const STOP_WORDS = new Set(['de', 'el', 'la', 'los', 'las', 'con', 'al', 'a', 'y', 'en', 'un', 'una'])

export function findFoodMatch(query: string): FoodItem | null {
  const q = query.toLowerCase().trim()
  if (!q) return null
  const words = q.split(/\s+/).filter((w) => w.length >= 2 && !STOP_WORDS.has(w))
  if (words.length === 0) return null

  let best: FoodItem | null = null
  let bestScore = 0
  for (const item of FOOD_DB) {
    const hay = `${item.name} ${item.keywords.join(' ')}`.toLowerCase()
    const score = words.filter((w) => hay.includes(w)).length
    if (score > bestScore) {
      bestScore = score
      best = item
    }
  }
  return bestScore > 0 ? best : null
}
