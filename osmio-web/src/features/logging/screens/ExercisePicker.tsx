import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Skeleton } from 'boneyard-js/react'
import { PageBackdrop } from '@/design-system/components/PageBackdrop'
import { PageHeader } from '@/design-system/components/PageHeader'
import { sessionsApi } from '@/services/api/sessions.api'
import { routinesApi } from '@/services/api/routines.api'
import ExerciseCarousel3D from '../components/ExerciseCarousel3D'
import ExerciseDetailPanel from '../components/ExerciseDetailPanel'
import { Bone, PickerSkeletonFixture, StatusPillBone } from '@/design-system/skeletons/fixtures'
import type { Exercise } from '@/shared/types/session.types'

/**
 * El dataset real tiene ~1.300 movimientos. El reel solo monta los primeros
 * 40: el resto se alcanza afinando la búsqueda o los filtros.
 */
const REEL_LIMIT = 40

interface DetailState {
  exercise: Exercise
  source: HTMLElement | null
}

export default function ExercisePicker() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('todas')
  const [equipment, setEquipment] = useState('todos')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState<number | null>(null)
  const [detail, setDetail] = useState<DetailState | null>(null)
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

  const reelExercises = useMemo(() => filtered.slice(0, REEL_LIMIT), [filtered])
  const hasFilters = search.trim() !== '' || category !== 'todas' || equipment !== 'todos'

  const openDetail = useCallback((exercise: Exercise, source: HTMLElement | null) => {
    setDetail({ exercise, source })
  }, [])

  const closeDetail = useCallback(() => setDetail(null), [])

  const openHistory = useCallback(
    (exercise: Exercise) => {
      navigate(`/logging/strength/history?exerciseId=${exercise.id}`)
    },
    [navigate]
  )

  const resetFilters = () => {
    setSearch('')
    setCategory('todas')
    setEquipment('todos')
  }

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
    <div className="relative min-h-screen pb-24">
      <PageBackdrop />

      <div className="relative z-10 mx-auto max-w-3xl px-5 pt-6">
        <PageHeader
          kicker="Biblioteca de movimientos"
          title="Seleccionar"
          titleAccent="Ejercicio"
          subtitle="Explora el carrusel, abre la ficha de cada movimiento y añádelo a tu rutina."
          onBack={() => navigate(-1)}
          status={
            loading ? (
              <StatusPillBone />
            ) : (
              <span className="status-pill">
                <span className="status-dot bg-green" />
                {exercises.length.toLocaleString('es-ES')} EJERCICIOS
              </span>
            )
          }
        />
      </div>

      <div className="relative z-10 mx-auto mt-4 max-w-3xl px-5">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre, músculo, equipo…"
            value={search}
            autoComplete="off"
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container/60 backdrop-blur-xl border border-outline-variant/40 rounded-xl py-3 pl-11 pr-4 text-sm text-text-green placeholder:text-text-muted placeholder:opacity-50 focus:outline-none focus:border-green focus:shadow-[0_0_0_1px_color-mix(in_srgb,var(--green)_35%,transparent),0_0_22px_color-mix(in_srgb,var(--green)_18%,transparent)] transition-all"
          />
        </div>

        <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filtrar por categoría"
            className="min-w-0 flex-1 cursor-pointer rounded-lg border border-outline-variant/40 bg-surface-container/60 px-3 py-2 text-xs text-text-green backdrop-blur-xl transition-all focus:border-green focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'todas' ? 'Todas las categorías' : c}
              </option>
            ))}
          </select>
          <select
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            aria-label="Filtrar por equipamiento"
            className="min-w-0 flex-1 cursor-pointer rounded-lg border border-outline-variant/40 bg-surface-container/60 px-3 py-2 text-xs text-text-green backdrop-blur-xl transition-all focus:border-green focus:outline-none"
          >
            {equipments.map((c) => (
              <option key={c} value={c}>
                {c === 'todos' ? 'Todo equipo' : c}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 font-label-caps text-[9px] uppercase tracking-[0.2em] text-text-muted">
          <span className="truncate">
            {loading ? (
              <Bone className="inline-block h-2 w-28 rounded-full" />
            ) : (
              <>
                {filtered.length.toLocaleString('es-ES')} movimientos
                {filtered.length > REEL_LIMIT ? ` · viendo ${REEL_LIMIT}` : ''}
              </>
            )}
          </span>
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="shrink-0 text-green/80 transition-colors hover:text-green"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-2">
        <Skeleton
          name="exercise-picker"
          loading={loading}
          select="viewport"
          transition={180}
          className="block"
          fixture={<PickerSkeletonFixture />}
          fallback={<PickerSkeletonFixture />}
        >
          {loading ? null : reelExercises.length === 0 ? (
            <div className="flex min-h-[46svh] flex-col items-center justify-center gap-4 px-5 text-center">
              <p className="font-label-caps text-sm text-text-muted opacity-60">
                Sin resultados para esta combinación de filtros.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="font-label-caps text-xs uppercase tracking-[0.24em] text-green transition-opacity hover:opacity-80"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <ExerciseCarousel3D
              exercises={reelExercises}
              addingId={addingId}
              onOpen={openDetail}
              onAdd={addToRoutine}
              onHistory={openHistory}
            />
          )}
        </Skeleton>
      </div>

      {detail && (
        <ExerciseDetailPanel
          exercise={detail.exercise}
          sourceEl={detail.source}
          adding={addingId === detail.exercise.id}
          onAdd={() => addToRoutine(detail.exercise)}
          onHistory={() => openHistory(detail.exercise)}
          onClose={closeDetail}
        />
      )}
    </div>
  )
}
