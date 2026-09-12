import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { GreenCard } from '@/design-system/components/GreenCard'
import { GreenButton } from '@/design-system/components/GreenButton'
import { GreenTag } from '@/design-system/components/GreenTag'
import { PageBackdrop } from '@/design-system/components/PageBackdrop'
import { PageHeader } from '@/design-system/components/PageHeader'
import { sessionsApi } from '@/services/api/sessions.api'
import ExerciseInfoCard from '@/features/strength/components/ExerciseInfoCard'
import type { Exercise, StrengthSession } from '@/shared/types/session.types'

export default function ExerciseHistory() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const exerciseId = Number(searchParams.get('exerciseId') || 0)

  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [sessions, setSessions] = useState<StrengthSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!exerciseId) {
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    Promise.all([sessionsApi.getExercise(exerciseId), sessionsApi.getSessionsByExercise(exerciseId)])
      .then(([ex, s]) => {
        if (!active) return
        setExercise(ex)
        setSessions(s)
      })
      .catch(console.error)
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [exerciseId])

  return (
    <div className="relative min-h-screen pb-24">
      <PageBackdrop />
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="px-5 pt-6">
          <PageHeader
            kicker="REGISTRO DE MOVIMIENTO"
            title={exercise?.name ?? 'Historial'}
            titleAccent="del Ejercicio"
            subtitle={
              exercise?.category
                ? `${exercise.category} · ${exercise.equipment}`
                : 'Sesiones registradas de este movimiento'
            }
            onBack={() => navigate(-1)}
            status={
              <span className="status-pill">
                <span className="status-dot bg-green" />
                {sessions.length} SESIONES
              </span>
            }
          />
        </div>

        <main className="p-md pt-4 space-y-3">
          {!exerciseId ? (
            <GreenCard variant="glass" padding="lg" effects={false} className="text-center">
              <p className="font-label-caps text-sm text-text-muted mb-md">
                Selecciona un ejercicio desde "Mi Rutina" o la sesión activa para ver su historial.
              </p>
              <GreenButton variant="primary" size="md" effects onClick={() => navigate('/strength/routine')}>
                IR A MI RUTINA
              </GreenButton>
            </GreenCard>
          ) : loading ? (
            <p className="font-label-caps text-sm text-text-muted animate-pulse text-center py-10">
              Cargando historial…
            </p>
          ) : (
            <>
              <div className="pt-2">
                {exercise && <ExerciseInfoCard exercise={exercise} />}
              </div>

              {sessions.length === 0 ? (
                <p className="font-label-caps text-sm text-text-muted opacity-50 text-center py-10">
                  Sin sesiones registradas para {exercise?.name ?? 'este ejercicio'}.
                </p>
              ) : (
                sessions.map((session) => {
                  const sets = session.sets.filter((s) => s.weight > 0 || s.reps > 0)
                  const topWeight = sets.length > 0 ? Math.max(...sets.map((s) => s.weight)) : 0
                  const topReps = sets.length > 0 ? Math.max(...sets.map((s) => s.reps)) : 0
                  const avgRpe = sets.length > 0 ? Math.round((sets.reduce((acc, s) => acc + (s.rpe ?? 0), 0) / sets.length) * 10) / 10 : 0
                  return (
                    <GreenCard key={session.id} variant="default" padding="md" effects={false} className="relative overflow-hidden">
                      <span className="gradient-hairline" />
                      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                        <span className="font-label-caps text-xs text-text-muted flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-green">calendar_month</span>
                          {new Date(session.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
                        </span>
                        <div className="flex items-center gap-2">
                          {avgRpe > 0 && <GreenTag color="green" variant="outlined" effects={false}>RPE {avgRpe}</GreenTag>}
                          <GreenTag color="muted" variant="ghost" effects={false}>{sets.length} SERIES</GreenTag>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-label-sm text-xs text-text-muted">MEJOR SET</span>
                        <span className="font-data-display text-[22px] text-gradient-green leading-none">
                          {topWeight} KG × {topReps}
                        </span>
                      </div>
                      <div className="mt-3 space-y-1">
                        {sets.map((set, idx) => (
                          <div key={idx} className="flex justify-between text-xs font-label-sm text-text-muted border-t border-outline-variant/20 pt-1.5">
                            <span>Serie {idx + 1}</span>
                            <span className="text-text-green">{set.reps} reps × {set.weight} kg</span>
                            {set.rpe ? <span>RPE {set.rpe}</span> : null}
                          </div>
                        ))}
                      </div>
                    </GreenCard>
                  )
                })
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}