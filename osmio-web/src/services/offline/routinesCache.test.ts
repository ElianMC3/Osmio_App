import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Routine } from '@/shared/types/session.types'
import { routinesCache } from './routinesCache'

function routine(id: string, name = 'Full body'): Routine {
  return {
    id,
    name,
    description: '',
    exercises: [
      {
        id: `re-${id}`,
        routineId: id,
        exerciseId: 1,
        position: 0,
        targetSets: 4,
        targetRepsMin: 6,
        targetRepsMax: 8,
        currentWeight: 100,
        restSeconds: 180,
        dropset: false,
        dropsetPercent: 50,
        notes: '',
        exercise: undefined,
      },
    ],
  }
}

beforeEach(async () => {
  await routinesCache.clear('user-1')
  await routinesCache.clear('user-2')
})

describe('routinesCache', () => {
  it('devuelve null cuando todavía no hay copia', async () => {
    await expect(routinesCache.get('user-1')).resolves.toBeNull()
  })

  it('hace round-trip de las rutinas con sus ejercicios', async () => {
    const routines = [routine('r-1', 'Empuje'), routine('r-2', 'Tirón')]

    await routinesCache.save('user-1', routines)

    const cached = await routinesCache.get('user-1')
    expect(cached).toHaveLength(2)
    expect(cached?.[0].name).toBe('Empuje')
    expect(cached?.[0].exercises[0]).toMatchObject({ targetSets: 4, currentWeight: 100 })
  })

  it('guarda la lista vacía (usuario sin rutinas) como copia válida', async () => {
    await routinesCache.save('user-1', [])

    await expect(routinesCache.get('user-1')).resolves.toEqual([])
  })

  it('no mezcla las rutinas de dos usuarios del mismo dispositivo', async () => {
    await routinesCache.save('user-1', [routine('r-1', 'Empuje')])
    await routinesCache.save('user-2', [routine('r-2', 'Pierna')])

    expect((await routinesCache.get('user-1'))?.map((r) => r.name)).toEqual(['Empuje'])
    expect((await routinesCache.get('user-2'))?.map((r) => r.name)).toEqual(['Pierna'])
  })

  it('olvida la copia al cerrar sesión', async () => {
    await routinesCache.save('user-1', [routine('r-1')])

    await routinesCache.clear('user-1')

    await expect(routinesCache.get('user-1')).resolves.toBeNull()
  })
})
