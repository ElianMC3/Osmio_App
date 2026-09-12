import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GreenCard } from '@/design-system/components/GreenCard'
import { sessionsApi } from '@/services/api/sessions.api'
import { nutritionApi } from '@/services/api/nutrition.api'
import type { StrengthSession, CombatSession } from '@/shared/types/session.types'
import type { DailyNutrition } from '@/shared/types/nutrition.types'

export default function DayDetail() {
  const { date } = useParams()
  const navigate = useNavigate()

  const [sessions, setSessions] = useState<(StrengthSession | CombatSession)[]>([])
  const [nutrition, setNutrition] = useState<DailyNutrition | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!date) { setLoading(false); return }
    const day = date
    async function fetchData() {
      try {
        const [daySessions, dayNutrition] = await Promise.all([
          sessionsApi.getSessionsByDate(day),
          nutritionApi.getDayNutrition(day),
        ])
        setSessions(daySessions)
        setNutrition(dayNutrition)
      } catch (e) {
        console.error('Error loading day detail:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [date])

  const totalVolume = sessions
    .filter((s): s is StrengthSession => 'sets' in s)
    .reduce((sum, s) => sum + s.sets.reduce((ss, set) => ss + set.weight * set.reps, 0), 0)

  const displayDate = date
    ? new Date(date + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()
    : '—'

  const targetPct = nutrition ? Math.round((nutrition.totals.calories / nutrition.goal.calories) * 100) : 0

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="mx-md px-md h-14 flex items-center justify-between rounded-2xl bg-panel/80 backdrop-blur-xl border border-green/20 shadow-lg shadow-black/20">
        <div className="flex items-center gap-md">
          <button
            onClick={() => navigate(-1)}
            aria-label="Volver"
            className="material-symbols-outlined text-text-muted hover:text-green transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green cursor-pointer"
          >
            arrow_back
          </button>
          <div className="flex flex-col">
            <h1 className="font-headline-md text-headline-md text-text-green leading-tight">
              Detalle del Día
            </h1>
            <span className="font-label-caps text-[10px] text-text-muted">
              {displayDate}
            </span>
          </div>
        </div>
        <button aria-label="Eliminar día" className="material-symbols-outlined text-text-muted hover:text-error transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green cursor-pointer">
          delete
        </button>
      </header>

      <div className="p-md space-y-lg">
        {/* Summary Section */}
        <div className="grid grid-cols-2 gap-sm">
          <GreenCard variant="default" padding="md" effects={true} className="flex items-center gap-md">
            <span className="material-symbols-outlined text-green text-2xl">groups</span>
            <div>
              <p className="font-label-caps text-[9px] text-text-muted uppercase">Total Sessions</p>
              <p className="font-label-caps text-headline-md text-text-green">{sessions.length}</p>
            </div>
          </GreenCard>
          <GreenCard variant="default" padding="md" effects={true} className="flex items-center gap-md">
            <span className="material-symbols-outlined text-green text-2xl">fitness_center</span>
            <div>
              <p className="font-label-caps text-[9px] text-text-muted uppercase">Total Volume</p>
              <p className="font-label-caps text-headline-md text-text-green">{totalVolume.toLocaleString()} KG</p>
            </div>
          </GreenCard>
        </div>

        {/* Session Cards */}
        {loading ? (
          <div className="flex justify-center py-10">
            <p className="font-label-caps text-sm text-text-muted animate-pulse">Cargando sesiones…</p>
          </div>
        ) : sessions.length === 0 ? (
          <GreenCard variant="glass" padding="md" effects={true} className="flex justify-center py-10">
            <p className="font-label-caps text-sm text-text-muted">SIN SESIONES REGISTRADAS</p>
          </GreenCard>
        ) : sessions.map((session) => {
          const isStrength = 'exerciseName' in session
          const typeLabel = isStrength ? 'STRENGTH' : session.type.toUpperCase()
          const title = isStrength ? session.exerciseName : `${session.type.toUpperCase()} TRAINING`
          const color = isStrength ? 'border-l-secondary' : 'border-l-primary-fixed'
          const typeColor = isStrength ? 'text-secondary' : 'text-primary-fixed'
          const icon = isStrength ? 'fitness_center' : 'sports_kabaddi'
          const totalVol = isStrength
            ? (session as StrengthSession).sets.reduce((s, set) => s + set.weight * set.reps, 0)
            : 0

          return (
            <GreenCard
              key={session.id}
              variant="glass" padding="md" effects={true}
              className={`border-l-4 ${color}`}
            >
              <div className="flex justify-between items-start mb-md">
                <div>
                  <span className={`font-label-caps text-label-caps ${typeColor}`}>{typeLabel}</span>
                  <h4 className="font-headline-md text-headline-md text-text-green">{title}</h4>
                </div>
                <span className={`material-symbols-outlined ${typeColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {icon}
                </span>
              </div>

              {isStrength && (session as StrengthSession).sets.length > 0 && (
                <div className="space-y-xs">
                  {(session as StrengthSession).sets.map((set, i) => (
                    <div key={i} className="flex justify-between items-center py-xs border-b border-green/20 last:border-0">
                      <span className="font-body-lg text-sm text-text-green">Set {i + 1}</span>
                      <span className="font-label-caps text-sm text-text-muted">
                        {set.reps} x {set.weight}KG {set.rpe ? `@ ${set.rpe}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {!isStrength && (
                <div className="grid grid-cols-3 gap-sm mb-md">
                  <GreenCard variant="default" padding="sm" effects={true}>
                    <p className="font-label-caps text-[8px] text-text-muted">ROUNDS</p>
                    <p className="font-label-caps text-data-display">{(session as CombatSession).rounds}</p>
                  </GreenCard>
                  <GreenCard variant="default" padding="sm" effects={true}>
                    <p className="font-label-caps text-[8px] text-text-muted">RPE</p>
                    <p className="font-label-caps text-data-display">{(session as CombatSession).rpe}</p>
                  </GreenCard>
                  <GreenCard variant="default" padding="sm" effects={true}>
                    <p className="font-label-caps text-[8px] text-text-muted">DURACIÓN</p>
                    <p className="font-label-caps text-data-display">{(session as CombatSession).durationMinutes}MIN</p>
                  </GreenCard>
                </div>
              )}

              {isStrength && totalVol > 0 && (
                <GreenCard variant="default" padding="md" effects={true} className="mt-sm">
                  <p className="font-label-caps text-[9px] text-text-muted mb-xs">TOTAL VOLUME</p>
                  <p className="font-label-caps text-display-lg text-green leading-none">
                    {totalVol.toLocaleString()}<span className="text-sm"> KG</span>
                  </p>
                </GreenCard>
              )}
            </GreenCard>
          )
        })}

        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-sm">
          <GreenCard variant="default" padding="sm" effects={true} className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-text-muted text-lg">monitor_heart</span>
            <div>
              <p className="font-label-caps text-[8px] text-text-muted uppercase">SESIONES</p>
              <p className="font-label-caps text-sm text-text-green">{sessions.length}</p>
            </div>
          </GreenCard>
          <GreenCard variant="default" padding="sm" effects={true} className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-text-muted text-lg">fitness_center</span>
            <div>
              <p className="font-label-caps text-[8px] text-text-muted uppercase">VOLUMEN TOTAL</p>
              <p className="font-label-caps text-sm text-text-green">{totalVolume.toLocaleString()} KG</p>
            </div>
          </GreenCard>
          <GreenCard variant="default" padding="sm" effects={true} className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-text-muted text-lg">restaurant</span>
            <div>
              <p className="font-label-caps text-[8px] text-text-muted uppercase">KCAL CONSUMIDAS</p>
              <p className="font-label-caps text-sm text-text-green">{nutrition?.totals.calories.toLocaleString() ?? '—'}</p>
            </div>
          </GreenCard>
        </div>

        {/* Nutrition Summary */}
        {nutrition && (
          <GreenCard variant="glass" padding="md" effects={true} className="relative overflow-hidden">
            <div className="flex justify-between items-center mb-md">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 bg-green/10 border border-green flex items-center justify-center">
                  <span className="material-symbols-outlined text-green text-lg">restaurant</span>
                </div>
                <div>
                  <span className="font-label-caps text-label-caps text-text-muted">NUTRITION LOG</span>
                  <h4 className="font-headline-md text-headline-md text-text-green">DAILY INTAKE</h4>
                </div>
              </div>
              <div className="text-right">
                <p className="font-label-caps text-headline-md text-text-green">
                  {nutrition.totals.calories.toLocaleString()} <span className="text-sm font-label-caps">KCAL</span>
                </p>
                <p className="font-label-caps text-[9px] text-text-muted">{targetPct}% OF TARGET</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-md">
              {[
                { label: 'PROTEIN', value: `${nutrition.totals.protein}G`, pct: nutrition.goal.protein ? Math.round((nutrition.totals.protein / nutrition.goal.protein) * 100) : 0, color: 'bg-secondary' },
                { label: 'CARBS', value: `${nutrition.totals.carbs}G`, pct: nutrition.goal.carbs ? Math.round((nutrition.totals.carbs / nutrition.goal.carbs) * 100) : 0, color: 'bg-primary-fixed' },
                { label: 'FATS', value: `${nutrition.totals.fat}G`, pct: nutrition.goal.fat ? Math.round((nutrition.totals.fat / nutrition.goal.fat) * 100) : 0, color: 'bg-outline' },
              ].map((macro) => (
                <div className="space-y-xs" key={macro.label}>
                  <div className="flex justify-between font-label-caps text-[10px]">
                    <span>{macro.label}</span>
                    <span className="font-label-caps">{macro.value}</span>
                  </div>
                  <div className="h-2 bg-panel2 overflow-hidden">
                    <div className={`h-full ${macro.color}`} style={{ width: `${Math.min(macro.pct, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GreenCard>
        )}

        {/* 30-Day Performance Strip */}
        <div className="pt-md border-t border-green/20">
          <h3 className="font-label-caps text-label-caps text-text-muted mb-md">
            LAST 30 DAYS PERFORMANCE
          </h3>
          <div className="flex gap-1 overflow-x-auto scrollbar-thin pb-sm">
            {Array.from({ length: 30 }, (_, i) => {
              const intensity = Math.random()
              const color =
                intensity > 0.8
                  ? 'bg-green'
                  : intensity > 0.4
                    ? 'bg-green/50'
                    : 'bg-panel2'
              return (
                <div
                  key={i}
                  className={`w-7 h-7 shrink-0 ${color} border border-outline-variant`}
                  title={`Day -${30 - i}`}
                />
              )
            })}
          </div>
          <div className="flex justify-between items-center mt-xs">
            <span className="font-label-caps text-[9px] text-text-muted">MES ANTERIOR</span>
            <span className="font-label-caps text-[9px] text-text-muted">MES ACTUAL</span>
          </div>
        </div>
      </div>

    </div>
  )
}
