import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GreenCard } from '@/design-system/components/GreenCard'
import { GreenButton } from '@/design-system/components/GreenButton'
import { GreenTag } from '@/design-system/components/GreenTag'
import { routinesApi } from '@/services/api/routines.api'
import { useProgression } from '../hooks/useProgression'
import ExerciseThumb from '../components/ExerciseThumb'
import type { RoutineExercise } from '@/shared/types/session.types'
import type { ProgressionRecommendation } from '../lib/progression'

function ExerciseEditFields({ rex, onSave, onCancel }: { rex: RoutineExercise; onSave: (p: Partial<RoutineExercise>) => void; onCancel: () => void }) {
  const [sets, setSets] = useState(String(rex.targetSets))
  const [repsMin, setRepsMin] = useState(String(rex.targetRepsMin))
  const [repsMax, setRepsMax] = useState(String(rex.targetRepsMax))
  const [rest, setRest] = useState(String(rex.restSeconds))
  const [dropset, setDropset] = useState(rex.dropset)
  const [dropsetPercent, setDropsetPercent] = useState(String(rex.dropsetPercent))

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-green/20">
      {[
        { label: 'Series', value: sets, set: setSets },
        { label: 'Reps min', value: repsMin, set: setRepsMin },
        { label: 'Reps max', value: repsMax, set: setRepsMax },
        { label: 'Descanso (s)', value: rest, set: setRest },
      ].map((f) => (
        <label key={f.label} className="flex flex-col gap-1">
          <span className="font-label-caps text-[9px] text-text-muted uppercase tracking-wider">{f.label}</span>
          <input
            type="number"
            min="1"
            value={f.value}
            onChange={(e) => f.set(e.target.value)}
            className="bg-black/40 border border-green/25 rounded-lg px-3 py-2 text-sm text-text-green focus:border-green focus:outline-none"
          />
        </label>
      ))}
      <div className="col-span-2 sm:col-span-4 flex items-center gap-3 flex-wrap">
        <button
          role="switch"
          aria-checked={dropset}
          aria-label="Activar dropset"
          onClick={() => setDropset(!dropset)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${dropset ? 'bg-acid' : 'bg-black/40 border border-green/25'}`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${dropset ? 'left-6 bg-paper' : 'left-0.5 bg-text-muted'}`}
          />
        </button>
        <span className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider">
          Dropset
        </span>
        {dropset && (
          <label className="flex flex-col gap-1">
            <span className="font-label-caps text-[9px] text-text-muted uppercase tracking-wider">% del peso</span>
            <input
              type="number"
              min="1"
              max="100"
              value={dropsetPercent}
              onChange={(e) => setDropsetPercent(e.target.value)}
              className="w-20 bg-black/40 border border-green/25 rounded-lg px-3 py-2 text-sm text-text-green focus:border-green focus:outline-none"
            />
          </label>
        )}
      </div>
      <div className="col-span-2 sm:col-span-4 flex justify-end gap-2">
        <GreenButton variant="ghost" size="sm" effects onClick={onCancel}>Cancelar</GreenButton>
        <GreenButton
          variant="primary"
          size="sm"
          effects
          onClick={() =>
            onSave({
              targetSets: Math.max(1, Number(sets) || 3),
              targetRepsMin: Math.max(1, Number(repsMin) || 8),
              targetRepsMax: Math.max(1, Number(repsMax) || 12),
              restSeconds: Math.max(0, Number(rest) || 180),
              dropset,
              dropsetPercent: Math.min(100, Math.max(1, Number(dropsetPercent) || 50)),
            })
          }
        >
          Guardar
        </GreenButton>
      </div>
    </div>
  )
}

function RecommendationBadge({ rec }: { rec: ProgressionRecommendation | undefined }) {
  if (!rec) {
    return <GreenTag color="muted" variant="outlined" effects={false}>SIN DATOS</GreenTag>
  }
  if (rec.action === 'increase') {
    return <GreenTag color="green" variant="filled" effects={false}>SUBIR A {rec.suggestedWeight} KG</GreenTag>
  }
  if (rec.action === 'deload') {
    return <GreenTag color="acid" variant="filled" effects={false}>DESCARGAR A {rec.suggestedWeight} KG</GreenTag>
  }
  return <GreenTag color="muted" variant="outlined" effects={false}>MANTENER {rec.currentWeight} KG</GreenTag>
}

export default function MyRoutine() {
  const navigate = useNavigate()
  const { routines, recommendations, loading, refresh } = useProgression()
  const [newName, setNewName] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!newName.trim() || busy) return
    setBusy(true)
    setError(null)
    try {
      await routinesApi.createRoutine(newName.trim())
      setNewName('')
      refresh()
    } catch (e) {
      console.error('Error creating routine:', e)
      setError(e instanceof Error ? e.message : 'No se pudo crear la rutina')
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteRoutine = async (id: string) => {
    if (!window.confirm('¿Eliminar esta rutina?')) return
    await routinesApi.deleteRoutine(id)
    refresh()
  }

  const commitWeight = async (rex: RoutineExercise, value: string) => {
    const w = parseFloat(value)
    if (Number.isNaN(w) || w < 0) return
    await routinesApi.updateRoutineExercise(rex.id, { currentWeight: w })
    refresh()
  }

  const saveTargets = async (rex: RoutineExercise, partial: Partial<RoutineExercise>) => {
    await routinesApi.updateRoutineExercise(rex.id, partial)
    setExpanded(null)
    refresh()
  }

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
          <h1 className="font-headline-md text-headline-md text-text-green leading-tight">Mi Rutina</h1>
          <span className="font-label-caps text-[10px] text-text-muted">PESOS + PROGRESIÓN</span>
        </div>
      </header>

      <main className="p-md space-y-lg">
        {loading ? (
          <p className="font-label-caps text-sm text-text-muted animate-pulse text-center py-10">Cargando rutinas…</p>
        ) : (
          <>
            {/* Create Routine */}
            <GreenCard variant="glass" padding="md" effects={false}>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  placeholder="Nombre de la rutina (ej. Push / Pull / Piernas)"
                  className="flex-1 bg-black/40 border border-green/25 rounded-xl px-4 py-3 text-sm text-text-green placeholder:text-text-muted placeholder:opacity-50 focus:border-green focus:outline-none"
                />
                <GreenButton variant="primary" size="md" effects onClick={handleCreate} disabled={busy}>
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  CREAR RUTINA
                </GreenButton>
              </div>
              {error && (
                <p className="mt-3 font-label-sm text-[11px] text-acid leading-relaxed">{error}</p>
              )}
            </GreenCard>

            {routines.length === 0 && (
              <p className="font-label-caps text-sm text-text-muted opacity-60 text-center py-8">
                Crea una rutina y agrega tus ejercicios para activar las recomendaciones de peso.
              </p>
            )}

            {/* Routines */}
            {routines.map((routine) => (
              <GreenCard key={routine.id} variant="default" padding="none" effects={false}>
                <header className="p-4 border-b border-green/20 flex items-center justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <h2 className="font-headline-md text-[20px] text-text-green uppercase font-semibold truncate">
                      {routine.name}
                    </h2>
                    <span className="font-label-caps text-[10px] text-text-muted">
                      {routine.exercises.length} EJERCICIOS
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <GreenButton
                      size="sm"
                      variant="primary"
                      effects
                      onClick={() => navigate('/logging/strength', { state: { routineId: routine.id } })}
                    >
                      <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                      COMENZAR
                    </GreenButton>
                    <GreenButton
                      size="sm"
                      effects
                      onClick={() => navigate('/logging/strength/picker', { state: { routineId: routine.id } })}
                    >
                      <span className="material-symbols-outlined text-[14px]">add</span>
                      AGREGAR
                    </GreenButton>
                    <button
                      onClick={() => handleDeleteRoutine(routine.id)}
                      aria-label={`Eliminar rutina ${routine.name}`}
                      className="p-2 text-text-muted hover:text-acid hover:bg-acid/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </header>

                {routine.exercises.length === 0 ? (
                  <p className="p-6 font-label-caps text-sm text-text-muted opacity-50 text-center">
                    Sin ejercicios. Toca "AGREGAR" para buscar en la base de datos.
                  </p>
                ) : (
                  <div className="divide-y divide-green/15">
                    {routine.exercises.map((rex) => {
                      const rec = recommendations.get(rex.id)
                      return (
                        <div key={rex.id} className="p-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <ExerciseThumb
                              exercise={rex.exercise}
                              onInfo={() => navigate(`/logging/strength/history?exerciseId=${rex.exerciseId}`)}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-label-caps text-sm text-text-green font-bold truncate">
                                {rex.exercise?.name ?? `#${rex.exerciseId}`}
                              </p>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <GreenTag color="green" variant="outlined" effects={false}>
                                  {rex.targetSets} × {rex.targetRepsMin}-{rex.targetRepsMax}
                                </GreenTag>
                                {rex.dropset && (
                                  <GreenTag color="acid" variant="filled" effects={false}>
                                    DROPSET {rex.dropsetPercent}%
                                  </GreenTag>
                                )}
                                {rex.exercise?.equipment && (
                                  <GreenTag color="muted" variant="ghost" effects={false}>
                                    {rex.exercise.equipment}
                                  </GreenTag>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <RecommendationBadge rec={rec} />
                              {rec?.lastSession && (
                                <span className="font-label-caps text-[9px] text-text-muted">
                                  Últ.: {rec.lastSession.topReps} reps · e1RM {rec.lastSession.e1rm.toFixed(0)} kg
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Weight + actions row */}
                          <div className="flex items-end gap-2 flex-wrap">
                            <label className="flex flex-col gap-1">
                              <span className="font-label-caps text-[9px] text-text-muted uppercase tracking-wider">Peso actual (kg)</span>
                              <input
                                key={rex.currentWeight}
                                type="number"
                                min="0"
                                step="1.25"
                                defaultValue={rex.currentWeight || ''}
                                onBlur={(e) => commitWeight(rex, e.target.value)}
                                className="w-28 bg-black/40 border border-green/25 rounded-lg px-3 py-2 text-sm text-text-green focus:border-green focus:outline-none"
                                placeholder="0"
                              />
                            </label>
                            <GreenButton
                              size="sm"
                              variant="ghost"
                              effects
                              onClick={() => navigate(`/logging/strength/history?exerciseId=${rex.exerciseId}`)}
                            >
                              <span className="material-symbols-outlined text-[14px]">history</span>
                              HISTORIAL
                            </GreenButton>
                            <div className="flex-1" />
                            <GreenButton
                              size="sm"
                              variant={expanded === rex.id ? 'primary' : 'default'}
                              effects
                              onClick={() => {
                                setExpanded(expanded === rex.id ? null : rex.id)
                              }}
                            >
                              <span className="material-symbols-outlined text-[14px]">tune</span>
                              SERIES / REPS
                            </GreenButton>
                            <button
                              onClick={async () => {
                                await routinesApi.removeExercise(rex.id)
                                refresh()
                              }}
                              aria-label={`Quitar ${rex.exercise?.name}`}
                              className="p-2 text-text-muted hover:text-acid hover:bg-acid/10 rounded-lg transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>

                          {/* Reason */}
                          {rec?.reason && (
                            <p className="font-label-sm text-[11px] text-text-muted leading-relaxed border-l-2 border-green/30 pl-3">
                              {rec.reason}
                            </p>
                          )}

                          {expanded === rex.id && (
                            <ExerciseEditFields
                              rex={rex}
                              onSave={(p) => saveTargets(rex, p)}
                              onCancel={() => setExpanded(null)}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </GreenCard>
            ))}
          </>
        )}
      </main>
    </div>
  )
}
