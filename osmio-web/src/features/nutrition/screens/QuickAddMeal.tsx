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
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Title & Sub-Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Registro Rápido 1-Tap</h1>
          <p className="font-label-caps text-xs text-on-surface-variant opacity-70">
            Añade alimentos a tus comidas diarias rápidamente
          </p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low p-1 border border-outline-variant/40 rounded-xl">
          {[
            { key: 'dashboard', label: 'Diario', path: '/nutrition' },
            { key: 'quick', label: 'Registro Rápido', path: '/nutrition/quick-add' },
            { key: 'detail', label: 'Detalle del Día', path: '/nutrition/today' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => navigate(tab.path)}
              className={`px-4 py-2 font-label-caps text-xs rounded-lg transition-all active:scale-[0.98] cursor-pointer ${
                tab.key === 'quick'
                  ? 'bg-primary-fixed text-on-primary-fixed font-bold shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Meal Type Selector */}
      <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-4 space-y-3">
        <label className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider block">Seleccionar Tipo de Comida</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {mealTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedMeal(type)}
              className={`py-3 font-label-caps text-xs rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                selectedMeal === type
                  ? 'bg-primary-fixed text-on-primary-fixed font-extrabold shadow-lg'
                  : 'bg-surface-container-low border border-outline-variant/40 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Add New Custom Food */}
      <div className="flex gap-3">
        <div className="relative flex-1 group">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-fixed transition-colors text-[20px]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar alimento en tu base de datos..."
            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl py-3 pl-11 pr-4 font-label-sm text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary-fixed transition-all"
          />
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary-fixed/10 border border-primary-fixed/40 text-primary-fixed font-label-caps text-xs px-4 py-3 rounded-xl hover:bg-primary-fixed hover:text-on-primary-fixed transition-all active:scale-[0.98] font-bold cursor-pointer flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Crear Alimento
        </button>
      </div>

      {/* Custom Food Form */}
      {showAddForm && (
        <form onSubmit={handleAddCustomFood} className="bg-surface-container/60 border border-primary-fixed/40 rounded-2xl p-5 space-y-4 shadow-xl">
          <h4 className="font-label-caps text-sm text-primary-fixed font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
            Nuevo Alimento Personalizado
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre del alimento (ej. Pechuga de Pavo)"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="bg-surface-dim border border-outline-variant p-3 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary-fixed"
              required
            />
            <input
              type="number"
              placeholder="Calorías aproximadas (kcal)"
              value={customKcal}
              onChange={(e) => setCustomKcal(e.target.value)}
              className="bg-surface-dim border border-outline-variant p-3 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary-fixed"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-xs font-label-caps text-on-surface-variant hover:text-on-surface">Cancelar</button>
            <button type="submit" className="px-5 py-2 bg-primary-fixed text-on-primary-fixed text-xs font-label-caps font-bold rounded-lg shadow-md hover:brightness-110">Guardar Alimento</button>
          </div>
        </form>
      )}

      {/* Selected Foods List */}
      <div className="space-y-3">
        <h3 className="font-label-caps text-xs text-primary-fixed uppercase tracking-wider flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-primary-fixed inline-block" />
          Alimentos Agregados a la Comida ({filteredFoods.length})
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {filteredFoods.map((food) => (
            <div key={food.id} className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-4 flex items-center justify-between hover:bg-surface-container-high/50 transition-all">
              <div className="flex-1 min-w-0">
                <p className="font-label-caps text-sm text-on-surface font-bold truncate">{food.name}</p>
                <p className="font-label-sm text-xs text-on-surface-variant">{food.portion}</p>
              </div>
              <div className="flex items-center gap-2 mx-4">
                <span className="font-label-caps text-[10px] text-primary-fixed bg-primary-fixed/10 border border-primary-fixed/30 px-2 py-0.5 rounded">P:{food.protein}g</span>
                <span className="font-label-caps text-[10px] text-secondary bg-secondary/10 border border-secondary/30 px-2 py-0.5 rounded">C:{food.carbs}g</span>
                <span className="font-label-caps text-[10px] text-tertiary-fixed-dim bg-tertiary-fixed-dim/10 border border-tertiary-fixed-dim/30 px-2 py-0.5 rounded">G:{food.fat}g</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-data-display text-base text-on-surface font-bold">{food.kcal} kcal</span>
                <button
                  onClick={() => removeFood(food.id)}
                  aria-label={`Eliminar ${food.name}`}
                  className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Macros Summary Grid */}
      <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6 space-y-4">
        <h3 className="font-label-caps text-xs text-on-surface uppercase tracking-wider border-b border-outline-variant/30 pb-3">RESUMEN DE MACRONUTRIENTES</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col items-center bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
            <SmallRing value={totalKcal} max={targetKcal} colorClass="text-primary-fixed" />
            <span className="font-data-display text-xl text-primary-fixed font-bold mt-2">{totalKcal}</span>
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">kcal</span>
          </div>
          <div className="flex flex-col items-center bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
            <SmallRing value={totalProtein} max={targetProtein} colorClass="text-primary-fixed" />
            <span className="font-data-display text-xl text-primary-fixed font-bold mt-2">{totalProtein}g</span>
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Proteína</span>
          </div>
          <div className="flex flex-col items-center bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
            <SmallRing value={totalCarbs} max={targetCarbs} colorClass="text-secondary" />
            <span className="font-data-display text-xl text-secondary font-bold mt-2">{totalCarbs}g</span>
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Carbos</span>
          </div>
          <div className="flex flex-col items-center bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
            <SmallRing value={totalFat} max={targetFat} colorClass="text-tertiary-fixed-dim" />
            <span className="font-data-display text-xl text-tertiary-fixed-dim font-bold mt-2">{totalFat}g</span>
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Grasas</span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveMeal}
        className="w-full bg-primary-fixed text-on-primary-fixed font-label-caps text-sm font-extrabold py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
      >
        <span className="material-symbols-outlined text-[20px]">save</span>
        GUARDAR REGISTRO DE COMIDA ({totalKcal} KCAL)
      </button>
    </div>
  )
}
