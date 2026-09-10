import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { GreenCard } from '@/design-system/components/GreenCard'
import { GreenButton } from '@/design-system/components/GreenButton'
import { GreenTag } from '@/design-system/components/GreenTag'
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
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-30 flex items-center gap-md px-md h-14 bg-panel/80 backdrop-blur-xl border-b border-green/20">
        <button
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="material-symbols-outlined text-text-muted hover:text-green transition-colors duration-200 active:scale-[0.98] cursor-pointer"
        >
          arrow_back
        </button>
        <div className="flex flex-col">
          <h1 className="font-headline-md text-headline-md text-text-green leading-tight">
            {exercise?.name ?? 'Historial'}
          </h1>
          <span className="font-label-caps text-[10px] text-text-muted">
            {exercise?.category ? `${exercise.category} · ${exercise.equipment}` : 'SESIONES REGISTRADAS'}
          </span>
        </div>
      </header>

      <main className="p-md space-y-3">
        {!exerciseId ? (
          <GreenCard variant="glass" padding="lg" effects={false} className="text-center">
            <p className="font-label-caps text-sm text-text-muted mb-md">Selecciona un ejercicio desde "Mi Rutina" o la sesión activa para ver su historial.</p>
            <GreenButton variant="primary" size="md" effects onClick={() => navigate('/strength/routine')}>
              IR A MI RUTINA
            </GreenButton>
          </GreenCard>
        ) : loading ? (
          <p className="font-label-caps text-sm text-text-muted animate-pulse text-center py-10">Cargando historial…</p>
        ) : (
          <>
            {exercise && <ExerciseInfoCard exercise={exercise} />}

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
                <GreenCard key={session.id} variant="default" padding="md" effects={false}>
                  <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                    <span className="font-label-caps text-xs text-text-muted">
                      {new Date(session.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
                    </span>
                    <div className="flex items-center gap-2">
                      {avgRpe > 0 && <GreenTag color="green" variant="outlined" effects={false}>RPE {avgRpe}</GreenTag>}
                      <GreenTag color="muted" variant="ghost" effects={false}>{sets.length} SERIES</GreenTag>
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm flex-wrap">
                    <span className="text-text-muted">Mejor set</span>
                    <span className="text-text-green font-medium">{topWeight} kg × {topReps}</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {sets.map((set, idx) => (
                      <div key={idx} className="flex justify-between text-xs font-label-sm text-text-muted border-t border-green/10 pt-1">
                        <span>Serie {idx + 1}</span>
                        <span>{set.reps} reps × {set.weight} kg</span>
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
  )
}
