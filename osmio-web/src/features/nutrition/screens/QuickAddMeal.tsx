import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNutritionStore } from '../../../store/nutritionStore'

interface FoodEntry {
  id: number
  name: string
  portion: string
  protein: number
  carbs: number
  fat: number
  kcal: number
}

const mealTypes = ['Desayuno', 'Almuerzo', 'Cena', 'Snack'] as const
type MealType = (typeof mealTypes)[number]

const initialFoods: FoodEntry[] = [
  { id: 1, name: 'Pechuga de pollo', portion: '200g', protein: 46, carbs: 0, fat: 4, kcal: 220 },
  { id: 2, name: 'Arroz jazmín', portion: '150g', protein: 4, carbs: 58, fat: 0, kcal: 250 },
  { id: 3, name: 'Brócoli', portion: '100g', protein: 3, carbs: 7, fat: 0, kcal: 35 },
]

export default function QuickAddMeal() {
  const navigate = useNavigate()
  const addMealToStore = useNutritionStore((state) => state.addMeal)
  const [selectedMeal, setSelectedMeal] = useState<MealType>('Almuerzo')
  const [searchQuery, setSearchQuery] = useState('')
  const [foods, setFoods] = useState<FoodEntry[]>(initialFoods)
  const [customName, setCustomName] = useState('')
  const [customKcal, setCustomKcal] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const totalKcal = foods.reduce((sum, f) => sum + f.kcal, 0)
  const totalProtein = foods.reduce((sum, f) => sum + f.protein, 0)
  const totalCarbs = foods.reduce((sum, f) => sum + f.carbs, 0)
  const totalFat = foods.reduce((sum, f) => sum + f.fat, 0)

  const targetKcal = 700
  const targetProtein = 100
  const targetCarbs = 80
  const targetFat = 25

  const removeFood = (id: number) => {
    setFoods((prev) => prev.filter((f) => f.id !== id))
  }

  const handleAddCustomFood = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customName || !customKcal) return
    const kcalNum = parseInt(customKcal, 10) || 100
    const newFood: FoodEntry = {
      id: Date.now(),
      name: customName,
      portion: '1 porción',
      protein: Math.round(kcalNum * 0.08),
      carbs: Math.round(kcalNum * 0.12),
      fat: Math.round(kcalNum * 0.03),
      kcal: kcalNum,
    }
    setFoods((prev) => [...prev, newFood])
    setCustomName('')
    setCustomKcal('')
    setShowAddForm(false)
  }

  const handleSaveMeal = () => {
    if (foods.length === 0) return
    addMealToStore({
      id: Date.now().toString(),
      name: `${selectedMeal}: ${foods.map((f) => f.name).join(', ')}`,
      calories: totalKcal,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      timestamp: new Date().toISOString(),
    })
    navigate('/nutrition')
  }

  const filteredFoods = foods.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const SmallRing = ({ value, max, colorClass }: { value: number; max: number; colorClass: string }) => {
    const r = 14
    const c = 2 * Math.PI * r
    const pct = Math.min(value / max, 1)
    return (
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-surface-container-high" />
        <circle cx="18" cy="18" r={r} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeDasharray={c} strokeDashoffset={c - pct * c} transform="rotate(-90 18 18)" className={colorClass} />
      </svg>
    )
  }

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-5 py-3 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/nutrition')} aria-label="Volver" className="text-on-surface-variant hover:text-on-surface transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md text-on-surface">Registro Rápido 1-Tap</h1>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
      </header>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center border-b border-outline-variant px-5 bg-surface-container-low">
        {[
          { key: 'dashboard', label: 'Diario', path: '/nutrition' },
          { key: 'quick', label: 'Registro Rápido 1-Tap', path: '/nutrition/quick-add' },
          { key: 'detail', label: 'Detalle del Día', path: '/nutrition/today' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => navigate(tab.path)}
            className={`pb-2 pt-3 px-3 font-label-caps text-label-caps transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
              tab.key === 'quick'
                ? 'text-primary-fixed border-b-2 border-primary-fixed'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-5 py-4 space-y-5 max-w-sm mx-auto">
        {/* Meal Type Selector */}
        <div className="flex gap-1 border border-outline-variant p-1 bg-surface-container-low">
          {mealTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedMeal(type)}
              className={`flex-1 py-2 font-label-caps text-label-caps transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                selectedMeal === type
                  ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Search & Add New Button */}
        <div className="flex gap-2">
          <div className="relative flex-1 group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-fixed transition-colors text-[20px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar alimento..."
              className="w-full bg-surface-container-low border border-outline-variant py-2.5 pl-10 pr-4 font-label-sm text-label-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary-fixed transition-all"
            />
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary-fixed/10 border border-primary-fixed/30 text-primary-fixed px-3 py-2 font-label-caps text-[10px] hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors cursor-pointer"
          >
            + Añadir
          </button>
        </div>

        {/* Custom Add Form */}
        {showAddForm && (
          <form onSubmit={handleAddCustomFood} className="bg-surface-container border border-outline-variant p-4 space-y-3">
            <p className="font-label-caps text-label-caps text-primary-fixed">Nuevo Alimento</p>
            <input
              type="text"
              placeholder="Nombre del alimento (ej. Manzana)"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full bg-surface border border-outline-variant p-2 text-sm text-on-surface"
              required
            />
            <input
              type="number"
              placeholder="Calorías (kcal)"
              value={customKcal}
              onChange={(e) => setCustomKcal(e.target.value)}
              className="w-full bg-surface border border-outline-variant p-2 text-sm text-on-surface"
              required
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1 text-xs text-on-surface-variant">Cancelar</button>
              <button type="submit" className="px-3 py-1 bg-primary-fixed text-on-primary-fixed text-xs font-bold">Agregar</button>
            </div>
          </form>
        )}

        {/* Food Entries */}
        <div className="space-y-2">
          <h3 className="font-label-caps text-label-caps text-primary-fixed flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-fixed inline-block" />
            Alimentos Seleccionados ({filteredFoods.length})
          </h3>
          {filteredFoods.map((food) => (
            <div key={food.id} className="bg-surface-container/50 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-label-caps text-label-caps text-on-surface truncate">{food.name}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">{food.portion}</p>
              </div>
              <div className="flex items-center gap-2 mx-3">
                <span className="font-label-caps text-[8px] text-primary-fixed bg-primary-fixed/10 px-1.5 py-0.5">P:{food.protein}g</span>
                <span className="font-label-caps text-[8px] text-secondary bg-secondary/10 px-1.5 py-0.5">C:{food.carbs}g</span>
                <span className="font-label-caps text-[8px] text-tertiary-fixed-dim bg-tertiary-fixed-dim/10 px-1.5 py-0.5">G:{food.fat}g</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-data-display text-[14px] text-on-surface-variant mr-1">{food.kcal}</span>
                <button
                  onClick={() => removeFood(food.id)}
                  aria-label={`Eliminar ${food.name}`}
                  className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-error transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Macros Summary */}
        <div className="bg-surface-container/50 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-4">
          <h3 className="font-label-caps text-label-caps text-on-surface mb-3 border-b border-outline-variant pb-2">RESUMEN MACROS</h3>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center">
              <SmallRing value={totalKcal} max={targetKcal} colorClass="text-primary-fixed" />
              <span className="font-data-display text-headline-md text-primary-fixed mt-1">{totalKcal}</span>
              <span className="font-label-caps text-[8px] text-on-surface-variant">kcal</span>
            </div>
            <div className="flex flex-col items-center">
              <SmallRing value={totalProtein} max={targetProtein} colorClass="text-primary-fixed" />
              <span className="font-data-display text-headline-md text-primary-fixed mt-1">{totalProtein}g</span>
              <span className="font-label-caps text-[8px] text-on-surface-variant">Proteína</span>
            </div>
            <div className="flex flex-col items-center">
              <SmallRing value={totalCarbs} max={targetCarbs} colorClass="text-secondary" />
              <span className="font-data-display text-headline-md text-secondary mt-1">{totalCarbs}g</span>
              <span className="font-label-caps text-[8px] text-on-surface-variant">Carbos</span>
            </div>
            <div className="flex flex-col items-center">
              <SmallRing value={totalFat} max={targetFat} colorClass="text-tertiary-fixed-dim" />
              <span className="font-data-display text-headline-md text-tertiary-fixed-dim mt-1">{totalFat}g</span>
              <span className="font-label-caps text-[8px] text-on-surface-variant">Grasas</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveMeal}
          className="w-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps py-3.5 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
          Guardar Comida ({totalKcal} kcal)
        </button>
      </div>
    </div>
  )
}
