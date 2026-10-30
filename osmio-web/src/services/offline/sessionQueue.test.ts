import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { CombatSession, StrengthSession } from '@/shared/types/session.types'

const mocks = vi.hoisted(() => ({
  createStrengthSession: vi.fn(),
  createCombatSession: vi.fn(),
}))

vi.mock('@/services/api/sessions.remote', () => ({
  sessionsRemote: {
    createStrengthSession: mocks.createStrengthSession,
    createCombatSession: mocks.createCombatSession,
  },
}))

import { sessionQueue } from './sessionQueue'

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

describe('sessionQueue', () => {
  it('guarda la sesión en la cola aunque el envío falle', async () => {
    mocks.createStrengthSession.mockRejectedValue(new Error('Failed to fetch'))

    await sessionQueue.enqueueStrength(strength('s-1'))
    const result = await sessionQueue.flushOne('s-1')

    expect(result).toBe(false)
    const pending = await sessionQueue.pending()
    expect(pending).toHaveLength(1)
    expect(pending[0].payload).toMatchObject({ id: 's-1', exerciseName: 'Sentadilla' })
    expect(pending[0].attempts).toBe(1)
  })

  it('no intenta enviar nada si no hay red, pero conserva la sesión', async () => {
    setOnline(false)

    await sessionQueue.enqueueStrength(strength('s-1'))
    const pending = await sessionQueue.pending()

    expect(pending).toHaveLength(1)
    expect(mocks.createStrengthSession).not.toHaveBeenCalled()
  })

  it('vacía la cola y marca éxito cuando el envío funciona', async () => {
    mocks.createStrengthSession.mockResolvedValue(undefined)

    await sessionQueue.enqueueStrength(strength('s-1'))
    const result = await sessionQueue.flushOne('s-1')

    expect(result).toBe(true)
    expect(await sessionQueue.count()).toBe(0)
    expect(mocks.createStrengthSession).toHaveBeenCalledWith(
      expect.objectContaining({ id: 's-1', exerciseName: 'Sentadilla' }),
    )
  })

  it('sincroniza en orden de llegada y reporta cuántas subieron', async () => {
    mocks.createStrengthSession.mockResolvedValue(undefined)
    mocks.createCombatSession.mockResolvedValue(undefined)

    await sessionQueue.enqueueStrength(strength('s-1'))
    await sessionQueue.enqueueCombat(combat('c-1'))
    await sessionQueue.enqueueStrength(strength('s-2'))

    const result = await sessionQueue.flush()

    expect(result).toEqual({ synced: 3, failed: 0 })
    expect(mocks.createStrengthSession.mock.calls.map(([s]) => s.id)).toEqual(['s-1', 's-2'])
    expect(mocks.createCombatSession).toHaveBeenCalledTimes(1)
    expect(await sessionQueue.count()).toBe(0)
  })

  it('deja en la cola solo lo que falló y sigue con el resto', async () => {
    mocks.createStrengthSession
      .mockRejectedValueOnce(new Error('permission denied'))
      .mockResolvedValueOnce(undefined)

    await sessionQueue.enqueueStrength(strength('s-1'))
    await sessionQueue.enqueueStrength(strength('s-2'))

    const result = await sessionQueue.flush()

    expect(result).toEqual({ synced: 1, failed: 1 })
    const pending = await sessionQueue.pending()
    expect(pending.map((entry) => entry.id)).toEqual(['s-1'])
    expect(pending[0].attempts).toBe(1)
  })

  it('corta el lote en el primer fallo si el dispositivo está sin red', async () => {
    setOnline(false)
    mocks.createStrengthSession.mockRejectedValue(new Error('Failed to fetch'))

    await sessionQueue.enqueueStrength(strength('s-1'))
    await sessionQueue.enqueueStrength(strength('s-2'))

    const result = await sessionQueue.flush()

    expect(result).toEqual({ synced: 0, failed: 2 })
    expect(mocks.createStrengthSession).not.toHaveBeenCalled()
    expect(await sessionQueue.count()).toBe(2)
  })
})
