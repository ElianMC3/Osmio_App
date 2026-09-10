import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { GreenCard } from '@/design-system/components/GreenCard'
import { GreenTag } from '@/design-system/components/GreenTag'
import { sessionsApi } from '@/services/api/sessions.api'
import { routinesApi } from '@/services/api/routines.api'
import ExerciseThumb from '@/features/strength/components/ExerciseThumb'
import type { Exercise } from '@/shared/types/session.types'

export default function ExercisePicker() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('todas')
  const [equipment, setEquipment] = useState('todos')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState<number | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { routineId } = (location.state ?? {}) as { routineId?: string }

  useEffect(() => {
    let active = true
    setLoading(true)
    sessionsApi
      .getExercises()
      .then((list) => {
        if (active) setExercises(list)
      })
      .catch(console.error)
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const categories = useMemo(
    () => ['todas', ...new Set(exercises.map((e) => e.category).filter(Boolean))],
    [exercises]
  )
  const equipments = useMemo(
    () => ['todos', ...new Set(exercises.map((e) => e.equipment).filter(Boolean))],
    [exercises]
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return exercises.filter((e) => {
      if (category !== 'todas' && e.category !== category) return false
      if (equipment !== 'todos' && e.equipment !== equipment) return false
      if (!q) return true
      const hay = `${e.name} ${e.category} ${e.equipment} ${e.target} ${e.muscleGroup} ${e.bodyPart}`.toLowerCase()
      return q.split(/\s+/).every((w) => hay.includes(w))
    })
  }, [exercises, search, category, equipment])

  const addToRoutine = async (exercise: Exercise) => {
    if (addingId !== null) return
    setAddingId(exercise.id)
    try {
      let targetRoutineId = routineId
      if (!targetRoutineId) {
        const routines = await routinesApi.getRoutines()
        if (routines.length > 0) {
          targetRoutineId = routines[0].id
        } else {
          const created = await routinesApi.createRoutine('Mi Rutina')
          targetRoutineId = created.id
        }
      }
      await routinesApi.addExercise(targetRoutineId, exercise.id, {
        currentWeight: 0,
        targetSets: 3,
        targetRepsMin: 8,
        targetRepsMax: 12,
        restSeconds: 180,
      })
      navigate(-1)
    } catch (e) {
      console.error('Error adding exercise:', e)
    } finally {
      setAddingId(null)
    }
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
          <h1 className="font-headline-md text-headline-md text-text-green leading-tight">Seleccionar ejercicio</h1>
          <span className="font-label-caps text-[10px] text-text-muted">{exercises.length.toLocaleString()} EJERCICIOS</span>
        </div>
      </header>

      <main className="p-md space-y-3">
        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre, músculo, equipo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-panel border border-green/25 rounded-xl py-3 pl-11 pr-4 text-sm text-text-green placeholder:text-text-muted placeholder:opacity-50 focus:outline-none focus:border-green"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-panel border border-green/25 rounded-lg px-3 py-2 text-xs text-text-green focus:outline-none focus:border-green"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'todas' ? 'Todas las categorías' : c}</option>
            ))}
          </select>
          <select
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            className="bg-panel border border-green/25 rounded-lg px-3 py-2 text-xs text-text-green focus:outline-none focus:border-green"
          >
            {equipments.map((c) => (
              <option key={c} value={c}>{c === 'todos' ? 'Todo equipo' : c}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="font-label-caps text-sm text-text-muted animate-pulse text-center py-10">Cargando ejercicios…</p>
        ) : (
          <div className="space-y-2">
            {filtered.length === 0 && (
              <p className="font-label-caps text-sm text-text-muted opacity-50 text-center py-10">Sin resultados</p>
            )}
            {filtered.map((ex) => (
              <GreenCard
                key={ex.id}
                variant="interactive"
                padding="sm"
                effects={true}
                onClick={() => addToRoutine(ex)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <ExerciseThumb exercise={ex} />
                <div className="flex-1 min-w-0">
                  <p className="font-label-caps text-sm text-text-green font-semibold truncate">{ex.name}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <GreenTag color="green" variant="outlined" effects={false}>{ex.category}</GreenTag>
                    {ex.equipment && <GreenTag color="muted" variant="ghost" effects={false}>{ex.equipment}</GreenTag>}
                  </div>
                </div>
                <span className="material-symbols-outlined text-text-muted text-[18px]">add_circle</span>
              </GreenCard>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
