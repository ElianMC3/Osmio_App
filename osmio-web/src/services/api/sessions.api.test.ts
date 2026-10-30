import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { CombatSession, StrengthSession } from '@/shared/types/session.types'

const mocks = vi.hoisted(() => ({
  getSessionsByDate: vi.fn(),
  getStrengthSessions: vi.fn(),
  getCombatSessions: vi.fn(),
  getSessionsByExercise: vi.fn(),
  createStrengthSession: vi.fn(),
  createCombatSession: vi.fn(),
}))

vi.mock('./sessions.remote', () => ({ sessionsRemote: mocks }))

import { sessionsApi } from './sessions.api'
import { sessionQueue } from '@/services/offline/sessionQueue'

function strength(id: string, overrides: Partial<StrengthSession> = {}): StrengthSession {
  return {
    id,
    date: '2026-10-30',
    exerciseId: 1,
    exerciseName: 'Sentadilla',
    sets: [{ reps: 5, weight: 100, rpe: 7 }],
    notes: '',
    ...overrides,
  }
}

function combat(id: string): CombatSession {
  return {
    id,
    date: '2026-10-30',
    type: 'striking',
    rounds: 6,
    durationMinutes: 45,
    rpe: 8,
    positions: [],
    notes: '',
  }
}

function setOnline(value: boolean) {
  Object.defineProperty(navigator, 'onLine', { configurable: true, value })
}

beforeEach(async () => {
  vi.clearAllMocks()
  setOnline(true)
  await sessionQueue.clear()
})

describe('sessionsApi.createStrengthSession', () => {
  it('devuelve pending=true sin tocar la red cuando está offline', async () => {
    setOnline(false)

    const result = await sessionsApi.createStrengthSession({
      date: '2026-10-30',
      exerciseId: 1,
      exerciseName: 'Sentadilla',
      sets: [{ reps: 5, weight: 100, rpe: 7 }],
      notes: '',
    })

    expect(result.pending).toBe(true)
    expect(result.session.id).toBeTruthy()
    expect(mocks.createStrengthSession).not.toHaveBeenCalled()
    expect(await sessionQueue.count()).toBe(1)
  })

  it('devuelve pending=false y deja la cola vacía cuando la red responde', async () => {
    mocks.createStrengthSession.mockResolvedValue(undefined)

    const result = await sessionsApi.createStrengthSession({
      date: '2026-10-30',
      exerciseId: 1,
      exerciseName: 'Sentadilla',
      sets: [{ reps: 5, weight: 100, rpe: 7 }],
      notes: '',
    })

    expect(result.pending).toBe(false)
    expect(await sessionQueue.count()).toBe(0)
    expect(mocks.createStrengthSession).toHaveBeenCalledWith(
      expect.objectContaining({ id: result.session.id }),
    )
  })

  it('marca pending=true si la red falla, pero conserva la sesión', async () => {
    mocks.createStrengthSession.mockRejectedValue(new Error('Failed to fetch'))

    const result = await sessionsApi.createStrengthSession({
      date: '2026-10-30',
      exerciseId: 1,
      exerciseName: 'Sentadilla',
      sets: [],
      notes: '',
    })

    expect(result.pending).toBe(true)
    expect(await sessionQueue.count()).toBe(1)
  })

  it('sube la sesión pendiente cuando vuelve la red', async () => {
    setOnline(false)
    const saved = await sessionsApi.createStrengthSession({
      date: '2026-10-30',
      exerciseId: 1,
      exerciseName: 'Sentadilla',
      sets: [{ reps: 5, weight: 100, rpe: 7 }],
      notes: '',
    })
    expect(saved.pending).toBe(true)

    setOnline(true)
    mocks.createStrengthSession.mockResolvedValue(undefined)
    const result = await sessionQueue.flush()

    expect(result).toEqual({ synced: 1, failed: 0 })
    expect(mocks.createStrengthSession).toHaveBeenCalledWith(
      expect.objectContaining({ id: saved.session.id }),
    )
    expect(await sessionQueue.count()).toBe(0)
  })
})

describe('sessionsApi reads con sesiones pendientes', () => {
  it('mezcla las sesiones del servidor con las que esperan sincronizar', async () => {
    mocks.getSessionsByDate.mockResolvedValue([strength('remote-1')])
    await sessionQueue.enqueueStrength(strength('local-1', { exerciseName: 'Peso muerto' }))

    const sessions = await sessionsApi.getSessionsByDate('2026-10-30')

    expect(sessions.map((s) => s.id).sort()).toEqual(['local-1', 'remote-1'])
  })

  it('no duplica una sesión que ya está en el servidor', async () => {
    mocks.getSessionsByDate.mockResolvedValue([strength('same-1')])
    await sessionQueue.enqueueStrength(strength('same-1'))

    const sessions = await sessionsApi.getSessionsByDate('2026-10-30')

    expect(sessions).toHaveLength(1)
  })

  it('ignora las pendientes de otra fecha', async () => {
    mocks.getSessionsByDate.mockResolvedValue([])
    await sessionQueue.enqueueStrength(strength('local-1', { date: '2026-10-29' }))

    const sessions = await sessionsApi.getSessionsByDate('2026-10-30')

    expect(sessions).toHaveLength(0)
  })

  it('devuelve las pendientes cuando la red falla, en vez de romper la pantalla', async () => {
    setOnline(false)
    mocks.getSessionsByDate.mockRejectedValue(new Error('Failed to fetch'))
    await sessionQueue.enqueueStrength(strength('local-1'))
    await sessionQueue.enqueueCombat(combat('local-2'))

    const sessions = await sessionsApi.getSessionsByDate('2026-10-30')

    expect(sessions.map((s) => s.id).sort()).toEqual(['local-1', 'local-2'])
  })

  it('propaga el error si no hay nada pendiente que mostrar', async () => {
    mocks.getSessionsByDate.mockRejectedValue(new Error('permission denied'))

    await expect(sessionsApi.getSessionsByDate('2026-10-30')).rejects.toThrow('permission denied')
  })

  it('propaga un error del servidor aunque haya pendientes (no oculta fallos de auth)', async () => {
    mocks.getSessionsByDate.mockRejectedValue(new Error('JWT expired'))
    await sessionQueue.enqueueStrength(strength('local-1'))

    await expect(sessionsApi.getSessionsByDate('2026-10-30')).rejects.toThrow('JWT expired')
  })

  it('getStrengthSessions solo añade pendientes de fuerza', async () => {
    mocks.getStrengthSessions.mockResolvedValue([])
    await sessionQueue.enqueueStrength(strength('local-1'))
    await sessionQueue.enqueueCombat(combat('local-2'))

    const sessions = await sessionsApi.getStrengthSessions()

    expect(sessions.map((s) => s.id)).toEqual(['local-1'])
  })

  it('getSessionsByExercise filtra por ejercicio', async () => {
    mocks.getSessionsByExercise.mockResolvedValue([])
    await sessionQueue.enqueueStrength(strength('local-1', { exerciseId: 1 }))
    await sessionQueue.enqueueStrength(strength('local-2', { exerciseId: 2 }))

    const sessions = await sessionsApi.getSessionsByExercise(1)

    expect(sessions.map((s) => s.id)).toEqual(['local-1'])
  })

  it('sigue leyendo del servidor si IndexedDB no está disponible', async () => {
    mocks.getSessionsByDate.mockResolvedValue([strength('remote-1')])
    const spy = vi.spyOn(sessionQueue, 'pending').mockRejectedValue(new Error('IndexedDB bloqueado'))

    const sessions = await sessionsApi.getSessionsByDate('2026-10-30')

    expect(sessions.map((s) => s.id)).toEqual(['remote-1'])
    spy.mockRestore()
  })
})
