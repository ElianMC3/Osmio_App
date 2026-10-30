import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { RoutineWithExercisesRow } from './rows'

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
  getCurrentUserId: vi.fn(),
}))

vi.mock('@/services/supabase/client', () => ({ supabase: { from: mocks.from } }))
vi.mock('@/services/supabase/currentUser', () => ({
  getCurrentUserId: mocks.getCurrentUserId,
}))

import { routinesApi } from './routines.api'
import { routinesCache } from '@/services/offline/routinesCache'

const USER_ID = 'user-1'

function row(id: string, name: string): RoutineWithExercisesRow {
  return {
    id,
    user_id: USER_ID,
    name,
    description: '',
    created_at: '2026-10-01T00:00:00Z',
    routine_exercises: [
      {
        id: `re-${id}`,
        routine_id: id,
        exercise_id: 3,
        position: 0,
        target_sets: 5,
        target_reps_min: 5,
        target_reps_max: 5,
        current_weight: 110,
        rest_seconds: 180,
        notes: '',
        dropset: false,
        dropset_percent: 50,
        exercises: {
          id: 3,
          name: 'Sentadilla',
          category: 'strength',
          type: 'barbell',
          body_part: 'legs',
          equipment: 'barbell',
          muscle_group: 'quads',
          target: 'quads',
          secondary_muscles: [],
          instructions: {},
          image: null,
          gif_url: null,
          attribution: null,
        },
      },
    ],
  }
}

function mockQuery(result: { data: unknown; error: unknown }) {
  mocks.from.mockReturnValue({
    select: () => ({
      eq: () => ({
        order: () => Promise.resolve(result),
      }),
    }),
  })
}

function setOnline(value: boolean) {
  Object.defineProperty(navigator, 'onLine', { configurable: true, value })
}

beforeEach(async () => {
  vi.clearAllMocks()
  setOnline(true)
  mocks.getCurrentUserId.mockResolvedValue(USER_ID)
  await routinesCache.clear(USER_ID)
})

describe('routinesApi.getRoutines', () => {
  it('devuelve la rutina del servidor y la guarda para poder entrenar offline', async () => {
    mockQuery({ data: [row('r-1', 'Fuerza A')], error: null })

    const routines = await routinesApi.getRoutines()

    expect(routines.map((r) => r.name)).toEqual(['Fuerza A'])
    expect(routines[0].exercises[0]).toMatchObject({
      exerciseId: 3,
      targetSets: 5,
      currentWeight: 110,
    })
    expect(routines[0].exercises[0].exercise?.name).toBe('Sentadilla')
    await expect(routinesCache.get(USER_ID)).resolves.toHaveLength(1)
  })

  it('sin red devuelve la última copia en vez de la rutina por defecto', async () => {
    mockQuery({ data: [row('r-1', 'Fuerza A')], error: null })
    await routinesApi.getRoutines()

    setOnline(false)
    mockQuery({ data: null, error: { message: 'Failed to fetch' } })

    const routines = await routinesApi.getRoutines()

    expect(routines.map((r) => r.name)).toEqual(['Fuerza A'])
  })

  it('también cae a la copia si el fallo es de red aunque el navegador se crea online', async () => {
    mockQuery({ data: [row('r-1', 'Fuerza A')], error: null })
    await routinesApi.getRoutines()

    mockQuery({ data: null, error: { message: 'TypeError: Load failed' } })

    await expect(routinesApi.getRoutines()).resolves.toHaveLength(1)
  })

  it('no tapa un error de permisos con datos viejos', async () => {
    mockQuery({ data: [row('r-1', 'Fuerza A')], error: null })
    await routinesApi.getRoutines()

    mockQuery({ data: null, error: { message: 'permission denied for table routines' } })

    await expect(routinesApi.getRoutines()).rejects.toThrow('permission denied')
  })

  it('propaga el error si no hay copia local todavía', async () => {
    mockQuery({ data: null, error: { message: 'Failed to fetch' } })

    await expect(routinesApi.getRoutines()).rejects.toThrow('Failed to fetch')
  })

  it('guarda la lista vacía para no reintentar en balde sin red', async () => {
    mockQuery({ data: [], error: null })
    await expect(routinesApi.getRoutines()).resolves.toEqual([])

    setOnline(false)
    mockQuery({ data: null, error: { message: 'Failed to fetch' } })

    await expect(routinesApi.getRoutines()).resolves.toEqual([])
  })

  it('no rompe la lectura si IndexedDB está bloqueado', async () => {
    mockQuery({ data: [row('r-1', 'Fuerza A')], error: null })
    const save = vi.spyOn(routinesCache, 'save').mockRejectedValue(new Error('QuotaExceeded'))

    await expect(routinesApi.getRoutines()).resolves.toHaveLength(1)
    save.mockRestore()
  })
})
