import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { GreenCard } from '../../../design-system/components/GreenCard'
import { GreenButton } from '../../../design-system/components/GreenButton'
import { GreenProgress } from '../../../design-system/components/GreenProgress'
import { GreenTag } from '../../../design-system/components/GreenTag'

interface SetData {
  weight: number
  reps: number
  restTime: number // in seconds
  done: boolean
}

interface ExerciseData {
  id: string
  name: string
  category: string
  sets: SetData[]
}

const defaultExercises: ExerciseData[] = [
  {
    id: '1',
    name: 'Back Squat',
    category: 'PIERNAS / COMPUESTO',
    sets: [
      { weight: 100, reps: 5, restTime: 180, done: false },
      { weight: 100, reps: 5, restTime: 180, done: false },
    ],
  },
  {
    id: '2',
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
  const [elapsed, setElapsed] = useState(0)
  const [exercises, setExercises] = useState<ExerciseData[]>(defaultExercises)
  const [showTimer, setShowTimer] = useState(true)
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

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
        return {
          ...ex,
          sets: [
            ...ex.sets,
            {
              weight: last?.weight ?? 0,
              reps: last?.reps ?? 0,
              restTime: last?.restTime ?? 180,
              done: false,
            },
          ],
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

  return (
    <div className="min-h-screen bg-[#050705] pb-32">
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
                </div>
              </div>
              <span className="material-symbols-outlined text-text-muted text-[20px]">expand_more</span>
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
                      className="bg-panel/30 hover:bg-panel/50 transition-colors"
                    >
                      <td className="text-center font-data-display text-[24px] leading-none text-text-muted border-l-2 border-transparent">
                        {i + 1}
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
          onClick={() => navigate(-1)}
          aria-label="Finalizar sesión"
          variant="primary"
          fullWidth
          size="lg"
          effects={true}
          className="h-14"
        >
          FINALIZAR SESIÓN
          <span className="material-symbols-outlined text-[20px]">stop_circle</span>
        </GreenButton>
      </main>
    </div>
  )
}
