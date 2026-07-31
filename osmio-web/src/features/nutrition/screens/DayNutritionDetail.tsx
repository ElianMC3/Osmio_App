import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { nutritionApi } from '@/services/api/nutrition.api'
import type { DailyNutrition } from '@/shared/types/nutrition.types'

export default function DayNutritionDetail() {
  const { date } = useParams()
  const navigate = useNavigate()
  const [nutrition, setNutrition] = useState<DailyNutrition | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!date) { setLoading(false); return }
    const day = date
    async function fetchData() {
      try {
        const data = await nutritionApi.getDayNutrition(day)
        setNutrition(data)
      } catch (e) {
        console.error('Error loading nutrition detail:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [date])

  const consumedCalories = nutrition?.totals.calories ?? 0
  const targetCalories = nutrition?.goal.calories ?? 2400
  const remaining = targetCalories - consumedCalories
  const calPercent = Math.min((consumedCalories / targetCalories) * 100, 100)

  const protein = { current: nutrition?.totals.protein ?? 0, goal: nutrition?.goal.protein ?? 180 }
  const carbs = { current: nutrition?.totals.carbs ?? 0, goal: nutrition?.goal.carbs ?? 280 }
  const fats = { current: nutrition?.totals.fat ?? 0, goal: nutrition?.goal.fat ?? 75 }

  const circumference = 2 * Math.PI * 70
  const strokeDashoffset = circumference - (calPercent / 100) * circumference

  const displayDate = date || 'Hoy'

  // Group meals by name prefix (up to first colon) as sections
  const mealSections = nutrition
    ? nutrition.meals.reduce((acc, meal) => {
        const sectionName = meal.name.includes(':') ? meal.name.split(':')[0].trim() : 'Comida'
        if (!acc[sectionName]) acc[sectionName] = []
        acc[sectionName].push(meal)
        return acc
      }, {} as Record<string, typeof nutrition.meals>)
    : {}

  const sectionColors = ['text-primary-fixed border-primary-fixed', 'text-secondary border-secondary', 'text-tertiary-fixed-dim border-tertiary-fixed-dim']
  const sectionIcons = ['wb_sunny', 'lunch_dining', 'dinner_dining']

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title & Sub-Tab Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Detalle Nutricional del Día</h1>
          <p className="font-label-caps text-xs text-on-surface-variant opacity-70">
            Registro desglosado para: <span className="text-primary-fixed font-bold">{displayDate}</span>
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
                tab.key === 'detail'
                  ? 'bg-primary-fixed text-on-primary-fixed font-bold shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Calorie Ring Section */}
        <div className="md:col-span-5 bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute -right-16 -top-16 opacity-10 w-48 h-48 bg-primary-fixed blur-[80px] pointer-events-none" />

          <div className="relative mb-4">
            <svg width="170" height="170" viewBox="0 0 160 160">
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
              <span className="font-data-display text-[44px] leading-none text-on-surface tracking-tighter">{consumedCalories.toLocaleString()}</span>
              <span className="font-label-caps text-xs text-on-surface-variant mt-1">kcal consumidas</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full mt-4 pt-4 border-t border-outline-variant/30 text-center">
            <div>
              <p className="font-label-caps text-[10px] text-on-surface-variant">CONSUMIDO</p>
              <p className="font-data-display text-base text-on-surface font-bold">{consumedCalories.toLocaleString()}</p>
            </div>
            <div className="border-x border-outline-variant/30">
              <p className="font-label-caps text-[10px] text-on-surface-variant">OBJETIVO</p>
              <p className="font-data-display text-base text-on-surface font-bold">{targetCalories.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-label-caps text-[10px] text-primary-fixed">RESTANTE</p>
              <p className="font-data-display text-base text-primary-fixed font-bold">{remaining.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Macros Summary Grid Cards */}
        <div className="md:col-span-7 flex flex-col gap-4">
          <h3 className="font-label-caps text-xs text-on-surface uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-primary-fixed inline-block" />
            Balanza de Macronutrientes
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
            <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-4 text-center flex flex-col justify-between">
              <p className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">KCAL</p>
              <p className="font-data-display text-xl text-primary-fixed font-bold">{consumedCalories}</p>
              <div className="h-1.5 bg-surface-container-high w-full mt-3 rounded-full overflow-hidden">
                <div className="h-full bg-primary-fixed" style={{ width: `${calPercent}%` }} />
              </div>
            </div>
            <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-4 text-center flex flex-col justify-between">
              <p className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">PROT</p>
              <p className="font-data-display text-xl text-primary-fixed font-bold">{protein.current}g</p>
              <div className="h-1.5 bg-surface-container-high w-full mt-3 rounded-full overflow-hidden">
                <div className="h-full bg-primary-fixed" style={{ width: `${Math.min((protein.current / protein.goal) * 100, 100)}%` }} />
              </div>
            </div>
            <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-4 text-center flex flex-col justify-between">
              <p className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">CARB</p>
              <p className="font-data-display text-xl text-secondary font-bold">{carbs.current}g</p>
              <div className="h-1.5 bg-surface-container-high w-full mt-3 rounded-full overflow-hidden">
                <div className="h-full bg-secondary" style={{ width: `${Math.min((carbs.current / carbs.goal) * 100, 100)}%` }} />
              </div>
            </div>
            <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-4 text-center flex flex-col justify-between">
              <p className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">GRASA</p>
              <p className="font-data-display text-xl text-tertiary-fixed-dim font-bold">{fats.current}g</p>
              <div className="h-1.5 bg-surface-container-high w-full mt-3 rounded-full overflow-hidden">
                <div className="h-full bg-tertiary-fixed-dim" style={{ width: `${Math.min((fats.current / fats.goal) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meal Timeline */}
      <div className="space-y-4 pt-4">
        <h3 className="font-label-caps text-xs text-primary-fixed uppercase tracking-wider flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-primary-fixed inline-block" />
          Cronograma de Comidas del Día
        </h3>
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <p className="font-label-caps text-sm text-text-muted animate-pulse">Cargando…</p>
            </div>
          ) : Object.keys(mealSections).length === 0 ? (
            <div className="bg-surface-container/50 border border-outline-variant/30 rounded-2xl p-6 text-center">
              <p className="font-label-caps text-sm text-on-surface-variant">Sin comidas registradas</p>
            </div>
          ) : Object.entries(mealSections).map(([sectionName, meals], idx) => {
            const colorIdx = idx % sectionColors.length
            const colors = sectionColors[colorIdx]
            const [textColor, borderColor] = colors.split(' ')
            const icon = sectionIcons[colorIdx]
            const totalKcal = meals.reduce((s, m) => s + m.calories, 0)
            const time = meals[0]?.timestamp ? new Date(meals[0].timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '—'

            return (
              <div key={sectionName} className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
                <div className={`border-l-4 ${borderColor} p-5`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center ${textColor}`}>
                        <span className="material-symbols-outlined text-[20px]">{icon}</span>
                      </div>
                      <div>
                        <span className={`font-label-caps text-base font-bold block ${textColor}`}>{sectionName}</span>
                        <span className="font-label-sm text-xs text-on-surface-variant">Hora: {time}</span>
                      </div>
                    </div>
                    <span className="font-data-display text-lg text-on-surface font-bold">{totalKcal} kcal</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {meals.map((item) => (
                      <div key={item.id} className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="font-body-lg text-sm font-bold text-on-surface truncate">{item.name}</p>
                          <p className="font-label-sm text-xs text-on-surface-variant">{item.timestamp ? new Date(item.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-label-caps text-[9px] text-primary-fixed bg-primary-fixed/10 px-1.5 py-0.5 rounded">P:{item.protein}g</span>
                          <span className="font-label-caps text-[9px] text-secondary bg-secondary/10 px-1.5 py-0.5 rounded">C:{item.carbs}g</span>
                          <span className="font-label-caps text-[9px] text-tertiary-fixed-dim bg-tertiary-fixed-dim/10 px-1.5 py-0.5 rounded">G:{item.fat}g</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate('/nutrition/quick-add')}
                  className="w-full py-3 bg-surface-container-high/40 border-t border-outline-variant/30 flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary-fixed hover:bg-primary-fixed/10 transition-all cursor-pointer font-label-caps text-xs font-bold"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  AÑADIR OTRO ALIMENTO A {sectionName.toUpperCase()}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
