import { useNavigate } from 'react-router-dom'
import { useNutritionStore } from '../../../store/nutritionStore'

const quickAddPresets = [
  { icon: 'blender', name: 'Batido Proteico 1-Tap', kcal: 320, protein: 35, carbs: 20, fat: 5 },
  { icon: 'lunch_dining', name: 'Pollo con Arroz Jazmín', kcal: 498, protein: 46, carbs: 58, fat: 6 },
  { icon: 'dinner_dining', name: 'Bowl de Salmón y Camote', kcal: 620, protein: 42, carbs: 49, fat: 18 },
  { icon: 'cookie', name: 'Snack de Frutos Secos', kcal: 210, protein: 6, carbs: 12, fat: 16 },
]

export default function NutritionDashboard() {
  const navigate = useNavigate()
  const { todayMeals, calorieGoal, addMeal } = useNutritionStore()

  // Calculate totals from store or fallback mock baseline
  const loggedKcal = todayMeals.reduce((sum, m) => sum + m.calories, 0)
  const loggedProtein = todayMeals.reduce((sum, m) => sum + m.protein, 0)
  const loggedCarbs = todayMeals.reduce((sum, m) => sum + m.carbs, 0)
  const loggedFat = todayMeals.reduce((sum, m) => sum + m.fat, 0)

  const baselineKcal = 1200
  const consumed = loggedKcal > 0 ? loggedKcal : baselineKcal
  const target = calorieGoal || 2847
  const remaining = Math.max(target - consumed, 0)
  const calPercent = Math.min((consumed / target) * 100, 100)

  const protein = { current: loggedProtein > 0 ? loggedProtein : 168, goal: 200 }
  const carbs = { current: loggedCarbs > 0 ? loggedCarbs : 312, goal: 350 }
  const fats = { current: loggedFat > 0 ? loggedFat : 78, goal: 90 }

  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (calPercent / 100) * circumference

  const handleQuickAddPreset = (preset: typeof quickAddPresets[0]) => {
    addMeal({
      id: Date.now().toString(),
      name: preset.name,
      calories: preset.kcal,
      protein: preset.protein,
      carbs: preset.carbs,
      fat: preset.fat,
      timestamp: new Date().toISOString(),
    })
  }

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-5 py-3 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/dashboard')} aria-label="Volver" className="text-on-surface-variant hover:text-on-surface transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="font-headline-md text-headline-md text-on-surface">Dashboard Nutricional</h1>
            <span className="font-label-caps text-[10px] text-on-surface-variant">Control táctico de macros</span>
          </div>
        </div>
        <div onClick={() => navigate('/profile')} className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center cursor-pointer hover:bg-surface-container-highest transition-colors duration-200">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">person</span>
        </div>
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
              tab.key === 'dashboard'
                ? 'text-primary-fixed border-b-2 border-primary-fixed'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-5 py-4 space-y-6 max-w-sm mx-auto">
        {/* Calorie Summary with Ring */}
        <div className="bg-surface-container/50 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-6 flex flex-col items-center relative overflow-hidden">
          <div className="absolute -right-16 -top-16 opacity-10 w-48 h-48 bg-primary-fixed blur-[80px] pointer-events-none" />

          <div className="relative mb-4">
            <svg width="140" height="140" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="6" className="text-surface-container-high" />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="var(--color-primary-fixed)"
                strokeWidth="6"
                strokeLinecap="square"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 60 60)"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-data-display text-[40px] leading-none text-on-surface tracking-tighter">{remaining.toLocaleString()}</span>
              <span className="font-label-caps text-label-caps text-primary-fixed mt-1">kcal</span>
            </div>
          </div>
          <p className="font-label-caps text-label-caps text-on-surface-variant">Calorías Restantes Hoy</p>

          {/* Quick stats row */}
          <div className="flex justify-between w-full mt-4 pt-4 border-t border-outline-variant">
            <div className="text-center flex-1">
              <p className="font-label-caps text-[9px] text-on-surface-variant">CONSUMIDAS</p>
              <p className="font-data-display text-headline-md text-on-surface">{consumed.toLocaleString()}</p>
            </div>
            <div className="text-center flex-1 border-x border-outline-variant">
              <p className="font-label-caps text-[9px] text-on-surface-variant">OBJETIVO</p>
              <p className="font-data-display text-headline-md text-on-surface">{target.toLocaleString()}</p>
            </div>
            <div className="text-center flex-1">
              <p className="font-label-caps text-[9px] text-primary-fixed">DÉFICIT</p>
              <p className="font-data-display text-headline-md text-primary-fixed">-{remaining.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Macros Row */}
        <div className="grid grid-cols-3 gap-3">
          {/* Protein */}
          <div className="bg-surface-container/50 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-3">
            <p className="font-label-caps text-[9px] text-on-surface-variant mb-2">PROTEÍNA</p>
            <p className="font-data-display text-body-lg text-primary-fixed mb-1">{protein.current}g</p>
            <div className="h-1 bg-surface-container-high w-full mb-1">
              <div className="h-full bg-primary-fixed transition-all duration-700" style={{ width: `${Math.min((protein.current / protein.goal) * 100, 100)}%` }} />
            </div>
            <p className="font-label-caps text-[8px] text-on-surface-variant">/ {protein.goal}g</p>
          </div>
          {/* Carbs */}
          <div className="bg-surface-container/50 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-3">
            <p className="font-label-caps text-[9px] text-on-surface-variant mb-2">CARBOHIDRATOS</p>
            <p className="font-data-display text-body-lg text-secondary mb-1">{carbs.current}g</p>
            <div className="h-1 bg-surface-container-high w-full mb-1">
              <div className="h-full bg-secondary transition-all duration-700" style={{ width: `${Math.min((carbs.current / carbs.goal) * 100, 100)}%` }} />
            </div>
            <p className="font-label-caps text-[8px] text-on-surface-variant">/ {carbs.goal}g</p>
          </div>
          {/* Fats */}
          <div className="bg-surface-container/50 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-3">
            <p className="font-label-caps text-[9px] text-on-surface-variant mb-2">GRASAS</p>
            <p className="font-data-display text-body-lg text-tertiary-fixed-dim mb-1">{fats.current}g</p>
            <div className="h-1 bg-surface-container-high w-full mb-1">
              <div className="h-full bg-tertiary-fixed-dim transition-all duration-700" style={{ width: `${Math.min((fats.current / fats.goal) * 100, 100)}%` }} />
            </div>
            <p className="font-label-caps text-[8px] text-on-surface-variant">/ {fats.goal}g</p>
          </div>
        </div>

        {/* 1-Tap Presets Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-label-caps text-label-caps text-on-surface flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-fixed inline-block" />
              Registro Rápido 1-Tap
            </h3>
            <button onClick={() => navigate('/nutrition/quick-add')} className="font-label-caps text-[10px] text-primary-fixed hover:underline">
              Ver Todo +
            </button>
          </div>
          <div className="space-y-2">
            {quickAddPresets.map((item) => (
              <div
                key={item.name}
                className="w-full bg-surface-container/50 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-3 flex items-center justify-between hover:bg-surface-container-high transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-container-high border border-outline-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-fixed text-[20px]">{item.icon}</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps text-on-surface block">{item.name}</span>
                    <span className="font-label-sm text-[10px] text-on-surface-variant">P:{item.protein}g • C:{item.carbs}g • G:{item.fat}g</span>
                  </div>
                </div>
                <button
                  onClick={() => handleQuickAddPreset(item)}
                  className="bg-primary-fixed/10 border border-primary-fixed/30 text-primary-fixed font-label-caps text-[10px] px-3 py-1.5 hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors active:scale-[0.98] cursor-pointer"
                >
                  +{item.kcal} kcal
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Registered Today List */}
        {todayMeals.length > 0 && (
          <div>
            <h3 className="font-label-caps text-label-caps text-on-surface mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-tertiary-fixed inline-block" />
              Registradas Hoy ({todayMeals.length})
            </h3>
            <div className="space-y-2">
              {todayMeals.map((m) => (
                <div key={m.id} className="bg-surface-container/50 border border-outline-variant/30 rounded-2xl p-3 flex justify-between items-center">
                  <div>
                    <p className="font-label-caps text-label-caps text-on-surface">{m.name}</p>
                    <p className="font-label-sm text-[10px] text-on-surface-variant">P:{m.protein}g • C:{m.carbs}g • G:{m.fat}g</p>
                  </div>
                  <span className="font-data-display text-headline-md text-primary-fixed">+{m.calories} kcal</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
