import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { GreenCard } from '../../../design-system/components/GreenCard'
import { GreenButton } from '../../../design-system/components/GreenButton'
import { GreenTag } from '../../../design-system/components/GreenTag'
import { sessionsApi } from '@/services/api/sessions.api'
import { routinesApi } from '@/services/api/routines.api'

interface SetData {
  weight: number
  reps: number
  restTime: number // in seconds
  done: boolean
  drop?: boolean
}

interface ExerciseData {
  id: string
  name: string
  category: string
  sets: SetData[]
}

const defaultExercises: ExerciseData[] = [
  {
    id: '43',
    name: 'Back Squat',
    category: 'PIERNAS / COMPUESTO',
    sets: [
      { weight: 100, reps: 5, restTime: 180, done: false },
      { weight: 100, reps: 5, restTime: 180, done: false },
    ],
  },
  {
    id: '25',
    name: 'Bench Press',
    category: 'EMPUJE / COMPUESTO',
    sets: [{ weight: 0, reps: 0, restTime: 180, done: false }],
  },
]

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, '0')
  const m = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0')
  const s = (totalSeconds % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

function formatRest(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function StrengthActiveSession() {
  const navigate = useNavigate()
  const location = useLocation()
  const { trainingType, routineId } = (location.state ?? {}) as { trainingType?: string; routineId?: string }
  const [elapsed, setElapsed] = useState(0)
  const [exercises, setExercises] = useState<ExerciseData[]>([])
  const [currentRoutineId, setCurrentRoutineId] = useState<string | undefined>(routineId)
  const [showTimer, setShowTimer] = useState(true)
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let active = true
    async function loadExercises() {
      try {
        const routines = await routinesApi.getRoutines()
        const routine = routines.find((r) => r.id === routineId) ?? routines[0] ?? null
        if (!routine || routine.exercises.length === 0) {
          if (active) setExercises(defaultExercises)
          return
        }
        if (active) {
          setCurrentRoutineId(routine.id)
          setExercises(
            routine.exercises.map((rex) => {
              const workSets = Array.from({ length: Math.max(1, rex.targetSets) }, () => ({
                weight: rex.currentWeight,
                reps: rex.targetRepsMax,
                restTime: rex.restSeconds,
                done: false,
              }))
              const dropSets = rex.dropset
                ? [
                    {
                      weight: Math.round(((rex.currentWeight * rex.dropsetPercent) / 100) / 1.25) * 1.25,
                      reps: rex.targetRepsMax,
                      restTime: 90,
                      done: false,
                      drop: true,
                    },
                  ]
                : []
              return {
                id: String(rex.exerciseId),
                name: rex.exercise?.name ?? `#${rex.exerciseId}`,
                category: (rex.exercise?.category ?? '').toUpperCase() || 'EJERCICIO',
                sets: [...workSets, ...dropSets],
              }
            })
          )
        }
      } catch {
        if (active) setExercises(defaultExercises)
      }
    }
    loadExercises()
    return () => {
      active = false
    }
  }, [routineId])

  const totalVolume = exercises.reduce((vol, ex) => {
    return (
      vol +
      ex.sets.reduce((setVol, set) => {
        return set.done ? setVol + set.weight * set.reps : setVol
      }, 0)
    )
  }, 0)

  const addSet = useCallback((exerciseId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex
        const last = ex.sets[ex.sets.length - 1]
        const newSet: SetData = {
          weight: last?.weight ?? 0,
          reps: last?.reps ?? 0,
          restTime: last?.restTime ?? 180,
          done: false,
        }
        return {
          ...ex,
          sets: last?.drop ? [...ex.sets.slice(0, -1), newSet, last] : [...ex.sets, newSet],
        }
      }),
    )
  }, [])

  const updateSet = useCallback((exerciseId: string, setIndex: number, data: Partial<SetData>) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex
        return {
          ...ex,
          sets: ex.sets.map((s, i) => (i === setIndex ? { ...s, ...data } : s)),
        }
      }),
    )
  }, [])

  const finishSession = async () => {
    setSaving(true)
    try {
      const date = new Date().toISOString().split('T')[0]
      const trainingTag = (trainingType ?? '').toUpperCase()
      for (const ex of exercises) {
        const doneSets = ex.sets.filter((s) => s.done && (s.weight > 0 || s.reps > 0))
        if (doneSets.length === 0) continue
        await sessionsApi.createStrengthSession({
          date,
          exerciseId: Number(ex.id),
          exerciseName: ex.name,
          sets: doneSets.map((s) => ({ reps: s.reps, weight: s.weight, rpe: 7 })),
          notes: `${trainingTag ? `[${trainingTag}] ` : ''}${notes}`.trim(),
        })
      }
      navigate(-1)
    } catch (e) {
      console.error('Error saving strength session:', e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen pb-32">
      <main className="px-5 pt-6 space-y-5">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <GreenButton
              onClick={() => navigate(-1)}
              variant="ghost"
              size="md"
              effects={true}
              aria-label="Volver"
              className="flex items-center justify-center w-10 h-10"
            >
              <span className="material-symbols-outlined text-text-muted">arrow_back</span>
            </GreenButton>
            <div className="flex-1">
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-text-green uppercase tracking-tight">
                Fuerza - Sesión Activa
              </h1>
            </div>
          </div>

          {/* Status bar with timer and volume */}
          <div className="flex items-center gap-3">
            <GreenCard variant="default" padding="sm" effects={true} className="flex-1">
              <span className="font-label-caps text-[10px] leading-none tracking-[0.1em] text-text-muted block">
                STATUS
              </span>
              <span className="font-data-display text-[24px] leading-none text-green tabular-nums">
                {formatTime(elapsed)}
              </span>
            </GreenCard>
            <GreenCard variant="default" padding="sm" effects={true} className="text-right">
              <span className="font-label-caps text-[10px] leading-none tracking-[0.1em] text-text-muted block">
                VOLUMEN
              </span>
              <span className="font-data-display text-[18px] leading-none text-text-green">
                {totalVolume.toLocaleString()}{' '}
                <span className="text-[11px] text-text-muted">KG</span>
              </span>
            </GreenCard>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <GreenButton
              onClick={() => setShowTimer(!showTimer)}
              aria-label={showTimer ? 'Ocultar timer' : 'Mostrar timer'}
              aria-pressed={showTimer}
              variant={showTimer ? 'primary' : 'default'}
              size="sm"
              effects={true}
            >
              <span className="material-symbols-outlined text-[16px]">timer</span>
              TIMER
            </GreenButton>
            <GreenButton
              onClick={() => navigate('/strength/routine')}
              aria-label="Ver pesos"
              variant="default"
              size="sm"
              effects={true}
            >
              <span className="material-symbols-outlined text-[16px]">fitness_center</span>
              PESOS
            </GreenButton>
            <GreenButton
              onClick={() => setShowNotes(!showNotes)}
              aria-label={showNotes ? 'Ocultar notas' : 'Mostrar notas'}
              aria-pressed={showNotes}
              variant={showNotes ? 'primary' : 'default'}
              size="sm"
              effects={true}
            >
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              NOTAS
            </GreenButton>
          </div>
        </div>

        {/* Notes panel */}
        {showNotes && (
          <GreenCard variant="glass" padding="md" effects={true}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas de la sesión..."
              className="w-full bg-black/40 border border-green/25 p-3 font-body-lg text-[16px] text-text-green focus:border-green focus:ring-0 outline-none resize-none h-24 transition-all placeholder:text-text-muted placeholder:opacity-30"
            />
          </GreenCard>
        )}

        {/* Exercise Cards */}
        {exercises.map((exercise) => (
          <GreenCard
            key={exercise.id}
            variant="default"
            padding="none"
            effects={true}
          >
            {/* Exercise Header */}
            <header className="p-4 flex items-center justify-between border-b border-green/25">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-green">fitness_center</span>
                <div>
                  <h2 className="font-headline-md text-[20px] leading-[1.4] font-semibold text-green uppercase">
                    {exercise.name}
                  </h2>
                  <GreenTag color="muted" variant="ghost" effects={true}>
                    {exercise.category}
                  </GreenTag>
                  {exercise.sets.some((s) => s.drop) && (
                    <GreenTag color="acid" variant="filled" effects={true}>DROPSET</GreenTag>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigate(`/logging/strength/history?exerciseId=${exercise.id}`)}
                  aria-label={`Historial de ${exercise.name}`}
                  className="p-2 text-text-muted hover:text-green rounded-lg transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">history</span>
                </button>
                <span className="material-symbols-outlined text-text-muted text-[20px]">expand_more</span>
              </div>
            </header>

            {/* Set Table */}
            <div className="p-4">
              <table className="w-full text-left border-separate border-spacing-y-1">
                <thead>
                  <tr className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-text-muted">
                    <th className="pb-1 pl-3 w-10">SET</th>
                    <th className="pb-1">KG</th>
                    <th className="pb-1">REPS</th>
                    <th className="pb-1">DESCANSO</th>
                    <th className="pb-1 text-center w-10">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {exercise.sets.map((set, i) => (
                    <tr
                      key={i}
                      className={`transition-colors ${
                        set.drop
                          ? 'bg-acid/10 border border-acid/30 hover:bg-acid/15'
                          : 'bg-panel/30 hover:bg-panel/50'
                      }`}
                    >
                      <td
                        className={`text-center font-label-caps text-[13px] leading-none border-l-2 ${
                          set.drop ? 'border-acid text-acid' : 'border-transparent text-text-muted'
                        }`}
                      >
                        {set.drop ? 'DROP' : (
                          <span className="font-data-display text-[24px]">{i + 1}</span>
                        )}
                      </td>
                      <td>
                        <input
                          type="number"
                          value={set.weight || ''}
                          placeholder="0"
                          onChange={(e) =>
                            updateSet(exercise.id, i, { weight: Number(e.target.value) })
                          }
                          className="bg-transparent w-full text-text-green font-data-display text-[18px] text-center border-none focus:ring-0 outline-none"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={set.reps || ''}
                          placeholder="0"
                          onChange={(e) =>
                            updateSet(exercise.id, i, { reps: Number(e.target.value) })
                          }
                          className="bg-transparent w-full text-text-green font-data-display text-[18px] text-center border-none focus:ring-0 outline-none"
                        />
                      </td>
                      <td>
                        <GreenButton
                          onClick={() =>
                            updateSet(exercise.id, i, {
                              restTime: set.restTime === 180 ? 300 : 180,
                            })
                          }
                          aria-label={`Descanso: ${formatRest(set.restTime)}`}
                          variant={set.restTime === 300 ? 'primary' : 'default'}
                          size="sm"
                          effects={true}
                          className="w-full text-center font-data-display text-[14px]"
                        >
                          {formatRest(set.restTime)}
                        </GreenButton>
                      </td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={set.done}
                          onChange={(e) =>
                            updateSet(exercise.id, i, { done: e.target.checked })
                          }
                          className="w-5 h-5 rounded-sm bg-black/40 border-green/25 text-green focus:ring-green/20 checked:bg-green cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Add Set Button */}
              <GreenButton
                onClick={() => addSet(exercise.id)}
                variant="default"
                size="md"
                fullWidth
                effects={true}
                className="mt-3 border-dashed"
              >
                + Agregar Set
              </GreenButton>
            </div>
          </GreenCard>
        ))}

        {/* Add Exercise */}
        <GreenButton
          aria-label="Agregar ejercicio"
          onClick={() => navigate('/logging/strength/picker', { state: { routineId: currentRoutineId } })}
          variant="default"
          fullWidth
          size="lg"
          effects={true}
          className="py-6 border-dashed flex flex-col items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[32px]">add_box</span>
          <span>+ Agregar Ejercicio</span>
        </GreenButton>

        {/* Finish Session Button */}
        <GreenButton
          onClick={finishSession}
          disabled={saving}
          aria-label="Finalizar sesión"
          variant="primary"
          fullWidth
          size="lg"
          effects={true}
          className="h-14"
        >
          {saving ? 'GUARDANDO…' : 'FINALIZAR SESIÓN'}
          <span className="material-symbols-outlined text-[20px]">stop_circle</span>
        </GreenButton>
      </main>
    </div>
  )
}
