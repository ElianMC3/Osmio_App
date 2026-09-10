import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { profilesApi } from '@/services/api/profiles.api'
import { nutritionApi } from '@/services/api/nutrition.api'
import { ACTIVITY_MULTIPLIERS, useCalorieGoal } from '../hooks/useCalorieGoal'

export default function NutritionRecommendationCard() {
  const navigate = useNavigate()
  const [weight, setWeight] = useState<number | null>(null)
  const [height, setHeight] = useState<number | null>(null)
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    profilesApi
      .getProfile()
      .then((profile) => {
        if (!active) return
        if (profile) {
          setWeight(profile.weight > 0 ? profile.weight : null)
          setHeight(profile.height > 0 ? profile.height : null)
          setExperience(profile.experience)
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const goal = useCalorieGoal({
    weightKg: weight ?? 0,
    heightCm: height ?? 0,
    activityMultiplier: ACTIVITY_MULTIPLIERS[experience] ?? 1.55,
    goal: 'bulk',
  })

  const hasData = weight !== null && weight > 0 && height !== null && height > 0

  const handleApply = async () => {
    setApplying(true)
    setError(null)
    try {
      await nutritionApi.updateNutritionGoal({
        calories: goal.target,
        protein: goal.protein,
        carbs: goal.carbs,
        fat: goal.fat,
      })
      setApplied(true)
      setTimeout(() => setApplied(false), 2500)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar el objetivo')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-5">
        <p className="font-label-caps text-sm text-on-surface-variant animate-pulse">Calculando recomendación…</p>
      </div>
    )
  }

  if (!hasData) {
    return (
      <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-label-caps text-sm text-on-surface font-bold">Recomendación nutricional</p>
          <p className="font-label-sm text-xs text-on-surface-variant mt-1">
            Completa tu peso y altura en tu perfil para calcular cuánto debes consumir y ganar masa muscular.
          </p>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="bg-primary-fixed text-on-primary-fixed font-label-caps text-xs px-4 py-2.5 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all font-bold cursor-pointer shrink-0"
        >
          COMPLETAR PERFIL
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-primary-fixed/10 to-secondary/5 backdrop-blur-xl border border-primary-fixed/30 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute -right-14 -top-14 opacity-10 w-48 h-48 bg-primary-fixed blur-[80px] pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div>
            <h3 className="font-label-caps text-sm text-on-surface font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary-fixed">psychiatry</span>
              RECOMENDACIÓN NUTRICIONAL
            </h3>
            <p className="font-label-sm text-xs text-on-surface-variant mt-0.5">
              Para ganar masa muscular · {weight} kg · {height} cm · {experience}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'TMB (basal)', value: `${goal.bmr.toLocaleString()}`, unit: 'kcal' },
            { label: 'Mantenimiento', value: `${goal.maintenance.toLocaleString()}`, unit: 'kcal' },
            { label: 'Objetivo', value: `${goal.target.toLocaleString()}`, unit: 'kcal', highlight: true },
            { label: 'Superávit', value: `+${goal.surplus}`, unit: 'kcal' },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-xl p-3 border ${
                s.highlight
                  ? 'bg-primary-fixed text-on-primary-fixed border-transparent'
                  : 'bg-surface-container/60 border-outline-variant/30'
              }`}
            >
              <p className={`font-label-caps text-[9px] uppercase tracking-wider ${s.highlight ? 'text-on-primary-fixed/80' : 'text-on-surface-variant'}`}>
                {s.label}
              </p>
              <p className={`font-data-display text-xl font-bold ${s.highlight ? 'text-on-primary-fixed' : 'text-on-surface'}`}>
                {s.value} <span className="text-xs font-label-caps">{s.unit}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-3">
          {[
            { label: 'Proteína', value: `${goal.protein}g`, pct: '2 g/kg', color: 'text-primary-fixed' },
            { label: 'Carbohidratos', value: `${goal.carbs}g`, pct: 'para entrenar', color: 'text-secondary' },
            { label: 'Grasas', value: `${goal.fat}g`, pct: '~25% de la ingesta', color: 'text-tertiary-fixed-dim' },
          ].map((m) => (
            <div key={m.label} className="bg-surface-container/60 border border-outline-variant/30 rounded-xl p-3 text-center">
              <p className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider">{m.label}</p>
              <p className={`font-data-display text-lg font-bold ${m.color}`}>{m.value}</p>
              <p className="font-label-caps text-[9px] text-on-surface-variant mt-0.5">{m.pct}</p>
            </div>
          ))}
        </div>

        <p className="font-label-sm text-xs text-on-surface-variant leading-relaxed mt-4 border-l-2 border-primary-fixed/50 pl-3">
          Para subir masa muscular consume alrededor de <span className="text-on-surface font-bold">{goal.target.toLocaleString()} kcal al día</span> (superávit de +300 sobre tu mantenimiento de {goal.maintenance.toLocaleString()} kcal). Prioriza la proteína: mínimo {goal.protein} g al día ({weight} kg × 2 g/kg), carbohidratos para rendir en el gimnasio y grasas al 25% de la ingesta. Ajusta tu peso corporal 1-2 veces por semana y recalcula cada ~5 kg de cambio.
        </p>

        {error && <p className="font-label-sm text-sm text-error mt-3">{error}</p>}

        <button
          onClick={handleApply}
          disabled={applying}
          className="mt-4 bg-primary-fixed text-on-primary-fixed font-label-caps text-xs px-5 py-3 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all font-bold cursor-pointer disabled:opacity-50 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[16px]">flag</span>
          {applying ? 'GUARDANDO…' : applied ? '✓ OBJETIVO APLICADO' : 'USAR COMO OBJETIVO DIARIO'}
        </button>
      </div>
    </div>
  )
}
