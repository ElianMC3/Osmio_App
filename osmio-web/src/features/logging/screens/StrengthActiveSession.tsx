import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

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
    <div className="min-h-screen bg-background pb-32">
      <main className="px-5 pt-6 space-y-5">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              aria-label="Volver"
              className="w-10 h-10 flex items-center justify-center border border-outline-variant hover:bg-surface-container-high transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
            >
              <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
            </button>
            <div className="flex-1">
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface uppercase tracking-tight">
                Fuerza - Sesión Activa
              </h1>
            </div>
          </div>

          {/* Status bar with timer and volume */}
          <div className="flex items-center gap-3">
            <div className="bg-surface-container-high px-3 py-2 border border-outline-variant flex-1">
              <span className="font-label-caps text-[10px] leading-none tracking-[0.1em] text-on-surface-variant block">
                STATUS
              </span>
              <span className="font-data-display text-[24px] leading-none text-primary-fixed tabular-nums">
                {formatTime(elapsed)}
              </span>
            </div>
            <div className="bg-surface-container-high px-3 py-2 border border-outline-variant text-right">
              <span className="font-label-caps text-[10px] leading-none tracking-[0.1em] text-on-surface-variant block">
                VOLUMEN
              </span>
              <span className="font-data-display text-[18px] leading-none text-on-surface">
                {totalVolume.toLocaleString()}{' '}
                <span className="text-[11px] text-on-surface-variant">KG</span>
              </span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowTimer(!showTimer)}
              aria-label={showTimer ? 'Ocultar timer' : 'Mostrar timer'}
              aria-pressed={showTimer}
              className={`flex items-center gap-1.5 px-3 py-1.5 border font-label-caps text-[10px] leading-none tracking-[0.1em] transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                showTimer
                  ? 'border-primary bg-primary-fixed/10 text-primary-fixed'
                  : 'border-outline-variant bg-surface-container text-on-surface-variant hover:border-outline'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">timer</span>
              TIMER
            </button>
            <button aria-label="Ver pesos" className="flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant bg-surface-container text-on-surface-variant font-label-caps text-[10px] leading-none tracking-[0.1em] hover:border-outline transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">fitness_center</span>
              PESOS
            </button>
            <button
              onClick={() => setShowNotes(!showNotes)}
              aria-label={showNotes ? 'Ocultar notas' : 'Mostrar notas'}
              aria-pressed={showNotes}
              className={`flex items-center gap-1.5 px-3 py-1.5 border font-label-caps text-[10px] leading-none tracking-[0.1em] transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                showNotes
                  ? 'border-primary bg-primary-fixed/10 text-primary-fixed'
                  : 'border-outline-variant bg-surface-container text-on-surface-variant hover:border-outline'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              NOTAS
            </button>
          </div>
        </div>

        {/* Notes panel */}
        {showNotes && (
          <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas de la sesión..."
              className="w-full bg-surface-container-lowest border border-outline-variant p-3 font-body-lg text-[16px] text-on-surface focus:border-primary focus:ring-0 outline-none resize-none h-24 transition-all placeholder:text-on-surface-variant placeholder:opacity-30"
            />
          </div>
        )}

        {/* Exercise Cards */}
        {exercises.map((exercise) => (
          <section
            key={exercise.id}
            className="bg-surface-container-low border border-outline-variant overflow-hidden"
          >
            {/* Exercise Header */}
            <header className="p-4 flex items-center justify-between border-b border-outline-variant">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-fixed">fitness_center</span>
                <div>
                  <h2 className="font-headline-md text-[20px] leading-[1.4] font-semibold text-primary-fixed uppercase">
                    {exercise.name}
                  </h2>
                  <p className="font-label-sm text-[11px] leading-none text-on-surface-variant">
                    {exercise.category}
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">expand_more</span>
            </header>

            {/* Set Table */}
            <div className="p-4 bg-surface-container-lowest/50">
              <table className="w-full text-left border-separate border-spacing-y-1">
                <thead>
                  <tr className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-on-surface-variant">
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
                      className="bg-surface-container h-11 hover:bg-surface-container-high transition-colors"
                    >
                      <td className="text-center font-data-display text-[24px] leading-none text-on-surface-variant border-l-2 border-transparent">
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
                          className="bg-transparent w-full text-on-surface font-data-display text-[18px] text-center border-none focus:ring-0 outline-none"
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
                          className="bg-transparent w-full text-on-surface font-data-display text-[18px] text-center border-none focus:ring-0 outline-none"
                        />
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            updateSet(exercise.id, i, {
                              restTime: set.restTime === 180 ? 300 : 180,
                            })
                          }
                          aria-label={`Descanso: ${formatRest(set.restTime)}`}
                          className={`w-full py-1 font-data-display text-[14px] text-center border transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                            set.restTime === 300
                              ? 'border-primary bg-primary-fixed/10 text-primary-fixed'
                              : 'border-outline-variant bg-transparent text-on-surface-variant hover:border-outline'
                          }`}
                        >
                          {formatRest(set.restTime)}
                        </button>
                      </td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={set.done}
                          onChange={(e) =>
                            updateSet(exercise.id, i, { done: e.target.checked })
                          }
                          className="w-5 h-5 rounded-sm bg-surface-variant border-surface-variant text-primary-fixed focus:ring-primary-fixed/20 checked:bg-primary-fixed cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Add Set Button */}
              <button
                onClick={() => addSet(exercise.id)}
                className="mt-3 w-full py-2 font-label-caps text-[12px] leading-none tracking-[0.1em] text-on-surface-variant hover:text-primary-fixed border border-dashed border-outline-variant hover:border-primary-fixed transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary uppercase cursor-pointer"
              >
                + Agregar Set
              </button>
            </div>
          </section>
        ))}

        {/* Add Exercise */}
        <button aria-label="Agregar ejercicio" className="w-full py-6 border-2 border-dashed border-outline-variant bg-surface-container-low/30 hover:bg-surface-container-low hover:border-primary-fixed text-on-surface-variant hover:text-primary-fixed transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary flex flex-col items-center justify-center gap-2 cursor-pointer">
          <span className="material-symbols-outlined text-[32px]">add_box</span>
          <span className="font-label-caps text-[12px] leading-none tracking-[0.1em] uppercase">
            + Agregar Ejercicio
          </span>
        </button>

        {/* Finish Session Button */}
        <button
          onClick={() => navigate(-1)}
          aria-label="Finalizar sesión"
          className="w-full h-14 bg-primary-fixed text-on-primary font-label-caps text-[12px] leading-none tracking-[0.1em] uppercase flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
        >
          FINALIZAR SESIÓN
          <span className="material-symbols-outlined text-[20px]">stop_circle</span>
        </button>
      </main>
    </div>
  )
}
