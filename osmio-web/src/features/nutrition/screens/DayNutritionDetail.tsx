import { useNavigate, useParams } from 'react-router-dom'
interface FoodItem {
  name: string
  portion: string
  protein: number
  carbs: number
  fat: number
  kcal: number
}

interface MealSection {
  name: string
  time: string
  accentColor: string
  borderColor: string
  icon: string
  items: FoodItem[]
}

const mealSections: MealSection[] = [
  {
    name: 'Desayuno',
    time: '07:30',
    accentColor: 'text-primary-fixed',
    borderColor: 'border-primary-fixed',
    icon: 'wb_sunny',
    items: [
      { name: 'Avena con proteína', portion: '80g + 30g', protein: 30, carbs: 55, fat: 8, kcal: 420 },
      { name: 'Banana', portion: '1 unidad', protein: 1, carbs: 27, fat: 0, kcal: 105 },
    ],
  },
  {
    name: 'Almuerzo',
    time: '13:15',
    accentColor: 'text-secondary',
    borderColor: 'border-secondary',
    icon: 'lunch_dining',
    items: [
      { name: 'Pollo con arroz jazmín', portion: '200g + 150g', protein: 45, carbs: 60, fat: 10, kcal: 498 },
      { name: 'Ensalada verde', portion: '100g', protein: 2, carbs: 5, fat: 0, kcal: 25 },
    ],
  },
  {
    name: 'Cena',
    time: '19:45',
    accentColor: 'text-tertiary-fixed-dim',
    borderColor: 'border-tertiary-fixed-dim',
    icon: 'dinner_dining',
    items: [
      { name: 'Salmón al horno', portion: '180g', protein: 40, carbs: 0, fat: 12, kcal: 280 },
      { name: 'Camote asado', portion: '150g', protein: 2, carbs: 45, fat: 0, kcal: 190 },
      { name: 'Espárragos', portion: '100g', protein: 2, carbs: 4, fat: 0, kcal: 20 },
    ],
  },
]

export default function DayNutritionDetail() {
  const { date } = useParams()
  const navigate = useNavigate()

  const targetCalories = 2700
  const consumedCalories = 1842
  const remaining = targetCalories - consumedCalories
  const calPercent = Math.min((consumedCalories / targetCalories) * 100, 100)

  const protein = { current: 165, goal: 180 }
  const carbs = { current: 210, goal: 280 }
  const fats = { current: 45, goal: 75 }

  const circumference = 2 * Math.PI * 70
  const strokeDashoffset = circumference - (calPercent / 100) * circumference

  const displayDate = date || 'Hoy'

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-5 py-3 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/nutrition')} aria-label="Volver" className="text-on-surface-variant hover:text-on-surface transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md text-on-surface">Detalle Nutricional</h1>
        </div>
        <span className="font-label-caps text-[10px] text-on-surface-variant">{displayDate}</span>
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
              tab.key === 'detail'
                ? 'text-primary-fixed border-b-2 border-primary-fixed'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-5 py-4 space-y-5 max-w-sm mx-auto">
        {/* Calorie Ring Section */}
        <div className="bg-surface-container/50 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-6 flex flex-col items-center relative overflow-hidden">
          <div className="absolute -right-16 -top-16 opacity-10 w-48 h-48 bg-primary-fixed blur-[80px] pointer-events-none" />

          <div className="relative mb-4">
            <svg width="180" height="180" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-container-high" />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="var(--color-primary-fixed)"
                strokeWidth="8"
                strokeLinecap="square"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 80 80)"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-data-display text-[48px] leading-none text-on-surface tracking-tighter">{consumedCalories.toLocaleString()}</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant mt-1">kcal</span>
            </div>
          </div>

          <p className="font-label-caps text-label-caps text-on-surface-variant mb-4">Calorías Consumidas</p>

          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="text-center border-r border-outline-variant">
              <p className="font-label-caps text-[9px] text-on-surface-variant">CONSUMIDAS</p>
              <p className="font-data-display text-[18px] text-on-surface">{consumedCalories.toLocaleString()}</p>
            </div>
            <div className="text-center border-r border-outline-variant">
              <p className="font-label-caps text-[9px] text-on-surface-variant">OBJETIVO</p>
              <p className="font-data-display text-[18px] text-on-surface">{targetCalories.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="font-label-caps text-[9px] text-primary-fixed">RESTANTE</p>
              <p className="font-data-display text-[18px] text-primary-fixed">{remaining.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Macros Summary */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-surface-container/50 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-2.5 text-center">
            <p className="font-label-caps text-[8px] text-on-surface-variant mb-1">KCAL</p>
            <p className="font-data-display text-[16px] text-primary-fixed">{consumedCalories}</p>
            <div className="h-1 bg-surface-container-high w-full mt-2">
              <div className="h-full bg-primary-fixed" style={{ width: `${calPercent}%` }} />
            </div>
          </div>
          <div className="bg-surface-container/50 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-2.5 text-center">
            <p className="font-label-caps text-[8px] text-on-surface-variant mb-1">PROT</p>
            <p className="font-data-display text-[16px] text-primary-fixed">{protein.current}g</p>
            <div className="h-1 bg-surface-container-high w-full mt-2">
              <div className="h-full bg-primary-fixed" style={{ width: `${Math.min((protein.current / protein.goal) * 100, 100)}%` }} />
            </div>
          </div>
          <div className="bg-surface-container/50 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-2.5 text-center">
            <p className="font-label-caps text-[8px] text-on-surface-variant mb-1">CARB</p>
            <p className="font-data-display text-[16px] text-secondary">{carbs.current}g</p>
            <div className="h-1 bg-surface-container-high w-full mt-2">
              <div className="h-full bg-secondary" style={{ width: `${Math.min((carbs.current / carbs.goal) * 100, 100)}%` }} />
            </div>
          </div>
          <div className="bg-surface-container/50 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-2.5 text-center">
            <p className="font-label-caps text-[8px] text-on-surface-variant mb-1">GRASA</p>
            <p className="font-data-display text-[16px] text-tertiary-fixed-dim">{fats.current}g</p>
            <div className="h-1 bg-surface-container-high w-full mt-2">
              <div className="h-full bg-tertiary-fixed-dim" style={{ width: `${Math.min((fats.current / fats.goal) * 100, 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Meal Timeline */}
        <div>
          <h3 className="font-label-caps text-label-caps text-primary-fixed mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-fixed inline-block" />
            Comidas del Día
          </h3>
          <div className="space-y-3">
            {mealSections.map((meal) => {
              const mealTotalKcal = meal.items.reduce((s, i) => s + i.kcal, 0)
              return (
                <div key={meal.name} className="bg-surface-container/50 backdrop-blur-sm border border-outline-variant/30 rounded-2xl overflow-hidden">
                  {/* Meal header with colored left border */}
                  <div className={`border-l-4 ${meal.borderColor} p-4`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-[18px] ${meal.accentColor}`}>{meal.icon}</span>
                        <span className={`font-label-caps text-label-caps ${meal.accentColor}`}>{meal.name}</span>
                        <span className="font-label-sm text-[10px] text-on-surface-variant">{meal.time}</span>
                      </div>
                      <span className="font-data-display text-[14px] text-on-surface">{mealTotalKcal} kcal</span>
                    </div>

                    {/* Food items */}
                    <div className="space-y-2">
                      {meal.items.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-body-lg text-[14px] text-on-surface truncate">{item.name}</p>
                            <p className="font-label-sm text-[10px] text-on-surface-variant">{item.portion}</p>
                          </div>
                          <div className="flex items-center gap-1.5 ml-2">
                            <span className="font-label-caps text-[8px] text-primary-fixed bg-primary-fixed/10 px-1 py-0.5">P:{item.protein}g</span>
                            <span className="font-label-caps text-[8px] text-secondary bg-secondary/10 px-1 py-0.5">C:{item.carbs}g</span>
                            <span className="font-label-caps text-[8px] text-tertiary-fixed-dim bg-tertiary-fixed-dim/10 px-1 py-0.5">G:{item.fat}g</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add food button */}
                  <button
                    onClick={() => navigate('/nutrition/quick-add')}
                    className="w-full py-2.5 border-t border-outline-variant flex items-center justify-center gap-1.5 text-on-surface-variant hover:text-primary-fixed hover:bg-primary-fixed/5 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span className="font-label-caps text-[10px]">Agregar Comida</span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Summary Bar */}
        <div className="bg-surface-container-highest border-t-2 border-primary-fixed p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant">TOTAL HOY</p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-data-display text-headline-md text-primary-fixed">{consumedCalories.toLocaleString()}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">/ {targetCalories.toLocaleString()} kcal</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-label-caps text-label-caps text-on-surface-variant">RESTANTE</p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-data-display text-headline-md text-on-surface">{remaining.toLocaleString()}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">kcal</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/nutrition/quick-add')}
            className="w-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps py-3 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            LOG NEXT MEAL
          </button>
        </div>
      </div>

    </div>
  )
}
