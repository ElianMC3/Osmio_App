import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { nutritionApi } from '@/services/api/nutrition.api'
import type { DailyNutrition } from '@/shared/types/nutrition.types'

const quickAddPresets = [
  { icon: 'blender', name: 'Batido Proteico 1-Tap', kcal: 320, protein: 35, carbs: 20, fat: 5 },
  { icon: 'lunch_dining', name: 'Pollo con Arroz Jazmín', kcal: 498, protein: 46, carbs: 58, fat: 6 },
  { icon: 'dinner_dining', name: 'Bowl de Salmón y Camote', kcal: 620, protein: 42, carbs: 49, fat: 18 },
  { icon: 'cookie', name: 'Snack de Frutos Secos', kcal: 210, protein: 6, carbs: 12, fat: 16 },
]

export default function NutritionDashboard() {
  const navigate = useNavigate()
  const [nutrition, setNutrition] = useState<DailyNutrition | null>(null)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await nutritionApi.getDayNutrition(today)
        setNutrition(data)
      } catch (e) {
        console.error('Error loading nutrition:', e)
      }
    }
    fetchData()
  }, [today])

  const meals = nutrition?.meals ?? []
  const consumed = meals.reduce((s, m) => s + m.calories, 0)
  const target = nutrition?.goal.calories ?? 2400
  const remaining = Math.max(target - consumed, 0)
  const calPercent = Math.min((consumed / target) * 100, 100)

  const protein = { current: meals.reduce((s, m) => s + m.protein, 0), goal: nutrition?.goal.protein ?? 180 }
  const carbs = { current: meals.reduce((s, m) => s + m.carbs, 0), goal: nutrition?.goal.carbs ?? 280 }
  const fats = { current: meals.reduce((s, m) => s + m.fat, 0), goal: nutrition?.goal.fat ?? 75 }

  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (calPercent / 100) * circumference

  const handleQuickAddPreset = async (preset: typeof quickAddPresets[0]) => {
    try {
      await nutritionApi.addMeal(today, {
        name: preset.name,
        calories: preset.kcal,
        protein: preset.protein,
        carbs: preset.carbs,
        fat: preset.fat,
        timestamp: new Date().toISOString(),
      })
      setNutrition((prev) => prev ? {
        ...prev,
        meals: [...prev.meals, { id: Date.now().toString(), name: preset.name, calories: preset.kcal, protein: preset.protein, carbs: preset.carbs, fat: preset.fat, timestamp: new Date().toISOString() }],
        totals: { calories: prev.totals.calories + preset.kcal, protein: prev.totals.protein + preset.protein, carbs: prev.totals.carbs + preset.carbs, fat: prev.totals.fat + preset.fat },
      } : null)
    } catch (e) {
      console.error('Error adding meal:', e)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title & Sub-Tab Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Dashboard Nutricional</h1>
          <p className="font-label-caps text-xs text-on-surface-variant opacity-70">
            Monitoreo táctico de macronutrientes e ingesta energética
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
                tab.key === 'dashboard'
                  ? 'bg-primary-fixed text-on-primary-fixed font-bold shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Calorie Summary Ring Card */}
        <div className="md:col-span-5 bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute -right-16 -top-16 opacity-15 w-48 h-48 bg-primary-fixed blur-[80px] pointer-events-none" />

          <div className="relative mb-4">
            <svg width="150" height="150" viewBox="0 0 120 120">
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
              <span className="font-data-display text-[42px] leading-none text-on-surface tracking-tighter">{remaining.toLocaleString()}</span>
              <span className="font-label-caps text-xs text-primary-fixed mt-1">kcal restantes</span>
            </div>
          </div>
          <p className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest">OBJETIVO DIARIO</p>

          {/* Quick stats row */}
          <div className="flex justify-between w-full mt-6 pt-4 border-t border-outline-variant/30">
            <div className="text-center flex-1">
              <p className="font-label-caps text-[10px] text-on-surface-variant">CONSUMIDAS</p>
              <p className="font-data-display text-lg text-on-surface font-bold">{consumed.toLocaleString()}</p>
            </div>
            <div className="text-center flex-1 border-x border-outline-variant/30">
              <p className="font-label-caps text-[10px] text-on-surface-variant">OBJETIVO</p>
              <p className="font-data-display text-lg text-on-surface font-bold">{target.toLocaleString()}</p>
            </div>
            <div className="text-center flex-1">
              <p className="font-label-caps text-[10px] text-primary-fixed">DÉFICIT</p>
              <p className="font-data-display text-lg text-primary-fixed font-bold">-{remaining.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Macros Breakdown Cards */}
        <div className="md:col-span-7 flex flex-col gap-4">
          <h3 className="font-label-caps text-xs text-on-surface uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-primary-fixed inline-block" />
            Macronutrientes del Día
          </h3>

          <div className="grid grid-cols-3 gap-3 flex-1">
            {/* Protein */}
            <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <p className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">PROTEÍNA</p>
                <p className="font-data-display text-xl text-primary-fixed font-bold">{protein.current}g</p>
              </div>
              <div className="mt-4">
                <div className="h-1.5 bg-surface-container-high w-full rounded-full overflow-hidden mb-1.5">
                  <div className="h-full bg-primary-fixed transition-all duration-700" style={{ width: `${Math.min((protein.current / protein.goal) * 100, 100)}%` }} />
                </div>
                <p className="font-label-caps text-[9px] text-on-surface-variant">Meta: {protein.goal}g</p>
              </div>
            </div>

            {/* Carbs */}
            <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <p className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">CARBOHIDRATOS</p>
                <p className="font-data-display text-xl text-secondary font-bold">{carbs.current}g</p>
              </div>
              <div className="mt-4">
                <div className="h-1.5 bg-surface-container-high w-full rounded-full overflow-hidden mb-1.5">
                  <div className="h-full bg-secondary transition-all duration-700" style={{ width: `${Math.min((carbs.current / carbs.goal) * 100, 100)}%` }} />
                </div>
                <p className="font-label-caps text-[9px] text-on-surface-variant">Meta: {carbs.goal}g</p>
              </div>
            </div>

            {/* Fats */}
            <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <p className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">GRASAS</p>
                <p className="font-data-display text-xl text-tertiary-fixed-dim font-bold">{fats.current}g</p>
              </div>
              <div className="mt-4">
                <div className="h-1.5 bg-surface-container-high w-full rounded-full overflow-hidden mb-1.5">
                  <div className="h-full bg-tertiary-fixed-dim transition-all duration-700" style={{ width: `${Math.min((fats.current / fats.goal) * 100, 100)}%` }} />
                </div>
                <p className="font-label-caps text-[9px] text-on-surface-variant">Meta: {fats.goal}g</p>
              </div>
            </div>
          </div>

          {/* Quick Add Banner Callout */}
          <div className="bg-surface-container-high/60 border border-primary-fixed/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-fixed/10 border border-primary-fixed/40 rounded-xl flex items-center justify-center text-primary-fixed">
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
              </div>
              <div>
                <p className="font-label-caps text-sm text-on-surface font-bold">¿Necesitas registrar una comida?</p>
                <p className="font-label-sm text-xs text-on-surface-variant">Agrega alimentos en 1-tap o escanea calorías</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/nutrition/quick-add')}
              className="bg-primary-fixed text-on-primary-fixed font-label-caps text-xs px-4 py-2.5 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all font-bold cursor-pointer"
            >
              + REGISTRO RÁPIDO
            </button>
          </div>
        </div>
      </div>

      {/* 1-Tap Presets Section */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center">
          <h3 className="font-label-caps text-sm text-on-surface uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-secondary inline-block" />
            Acceso Rápido 1-Tap
          </h3>
          <button onClick={() => navigate('/nutrition/quick-add')} className="font-label-caps text-xs text-primary-fixed hover:underline cursor-pointer">
            Ver Formulario Completo +
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickAddPresets.map((item) => (
            <div
              key={item.name}
              className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-4 flex items-center justify-between hover:bg-surface-container-high/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-surface-container-high border border-outline-variant/40 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-fixed text-[22px]">{item.icon}</span>
                </div>
                <div>
                  <span className="font-label-caps text-sm text-on-surface font-bold block">{item.name}</span>
                  <span className="font-label-sm text-xs text-on-surface-variant">P:{item.protein}g • C:{item.carbs}g • G:{item.fat}g</span>
                </div>
              </div>
              <button
                onClick={() => handleQuickAddPreset(item)}
                className="bg-primary-fixed/10 border border-primary-fixed/40 text-primary-fixed font-label-caps text-xs px-3.5 py-2 rounded-lg hover:bg-primary-fixed hover:text-on-primary-fixed transition-all active:scale-[0.98] cursor-pointer font-bold"
              >
                +{item.kcal} kcal
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Registered Today List */}
      {meals.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="font-label-caps text-sm text-on-surface uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-tertiary-fixed inline-block" />
            Registradas Hoy ({meals.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {meals.map((m) => (
              <div key={m.id} className="bg-surface-container/50 border border-outline-variant/30 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-label-caps text-sm text-on-surface font-bold">{m.name}</p>
                  <p className="font-label-sm text-xs text-on-surface-variant">P:{m.protein}g • C:{m.carbs}g • G:{m.fat}g</p>
                </div>
                <span className="font-data-display text-xl text-primary-fixed font-bold">+{m.calories} kcal</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
