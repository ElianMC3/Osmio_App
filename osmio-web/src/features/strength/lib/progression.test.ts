import { describe, expect, it } from 'vitest'

import type { RoutineExercise, SetEntry, StrengthSession } from '@/shared/types/session.types'

import { evaluateProgression } from './progression'

const set = (weight: number, reps: number, rpe = 8): SetEntry => ({ weight, reps, rpe })

const session = (date: string, sets: SetEntry[], exerciseId = 1): StrengthSession => ({
  id: `session-${date}`,
  date,
  exerciseId,
  exerciseName: 'Sentadilla',
  sets,
  notes: '',
})

const squat = (overrides: Partial<RoutineExercise> = {}): RoutineExercise => ({
  id: 'rex-1',
  routineId: 'routine-1',
  exerciseId: 1,
  position: 1,
  targetSets: 3,
  targetRepsMin: 6,
  targetRepsMax: 10,
  currentWeight: 100,
  restSeconds: 120,
  dropset: false,
  dropsetPercent: 0,
  notes: '',
  exercise: {
    id: 1,
    name: 'Sentadilla',
    category: 'upper legs',
  },
  ...overrides,
})

/** Tres series limpias: todas a 10 reps (el máximo) y RPE 8. */
const cleanTopSession = (date: string): StrengthSession =>
  session(date, [set(100, 10), set(100, 10), set(100, 10)])

describe('evaluateProgression', () => {
  describe('sin datos suficientes', () => {
    it('pide configurar el peso de trabajo cuando currentWeight es 0', () => {
      const result = evaluateProgression(squat({ currentWeight: 0 }), [])

      expect(result).not.toBeNull()
      expect(result?.action).toBe('maintain')
      expect(result?.suggestedWeight).toBe(0)
      expect(result?.lastSession).toBeNull()
      expect(result?.reason).toContain('Establece tu peso de trabajo')
    })

    it('pide configurar el peso de trabajo con un peso negativo', () => {
      const result = evaluateProgression(squat({ currentWeight: -10 }), [
        cleanTopSession('2026-10-01T10:00:00Z'),
      ])

      expect(result?.action).toBe('maintain')
      expect(result?.reason).toContain('Establece tu peso de trabajo')
    })

    it('no recomienda nada cuando no hay sesiones', () => {
      const result = evaluateProgression(squat(), [])

      expect(result?.action).toBe('maintain')
      expect(result?.suggestedWeight).toBe(100)
      expect(result?.lastSession).toBeNull()
      expect(result?.reason).toBe('Aún no tienes sesiones registradas con este peso.')
    })

    it('ignora las sesiones con un peso inferior al de trabajo', () => {
      const result = evaluateProgression(squat(), [
        session('2026-10-01T10:00:00Z', [set(80, 10), set(80, 10)]),
      ])

      expect(result?.action).toBe('maintain')
      expect(result?.reason).toBe('Aún no tienes sesiones registradas con este peso.')
    })

    it('ignora las sesiones de otro ejercicio', () => {
      const result = evaluateProgression(squat(), [
        session('2026-10-01T10:00:00Z', [set(100, 10)], 2),
      ])

      expect(result?.reason).toBe('Aún no tienes sesiones registradas con este peso.')
    })

    it('ignora las sesiones sin series con reps registradas', () => {
      const result = evaluateProgression(squat(), [
        session('2026-10-01T10:00:00Z', [set(100, 0), set(100, 0)]),
      ])

      expect(result?.reason).toBe('Aún no tienes sesiones registradas con este peso.')
    })
  })

  describe('subida de peso', () => {
    it('sube tras dos sesiones seguidas con todas las series al máximo y RPE ≤ 8', () => {
      const result = evaluateProgression(squat(), [
        cleanTopSession('2026-10-01T10:00:00Z'),
        cleanTopSession('2026-10-03T10:00:00Z'),
      ])

      expect(result?.action).toBe('increase')
      expect(result?.suggestedWeight).toBe(105)
      expect(result?.reason).toContain('RPE ≤ 8')
    })

    it('mantiene el peso si solo la última sesión fue limpia', () => {
      const result = evaluateProgression(squat(), [
        session('2026-10-01T10:00:00Z', [set(100, 10), set(100, 8)]),
        cleanTopSession('2026-10-03T10:00:00Z'),
      ])

      expect(result?.action).toBe('maintain')
      expect(result?.reason).toContain('Mantén 100 kg')
    })

    it('mantiene el peso con una sola sesión limpia', () => {
      const result = evaluateProgression(squat(), [cleanTopSession('2026-10-01T10:00:00Z')])

      expect(result?.action).toBe('maintain')
    })

    it('no sube si alguna serie de la sesión no llegó al máximo', () => {
      const result = evaluateProgression(squat(), [
        session('2026-10-01T10:00:00Z', [set(100, 10), set(100, 10), set(100, 8)]),
        session('2026-10-03T10:00:00Z', [set(100, 10), set(100, 10), set(100, 8)]),
      ])

      expect(result?.action).toBe('maintain')
    })

    it('no sube si el RPE de la sesión supera 8', () => {
      const result = evaluateProgression(squat(), [
        session('2026-10-01T10:00:00Z', [set(100, 10, 9), set(100, 10, 9)]),
        session('2026-10-03T10:00:00Z', [set(100, 10, 9), set(100, 10, 9)]),
      ])

      expect(result?.action).toBe('maintain')
    })

    it('trata el RPE sin registrar (0) como sesión limpia', () => {
      const result = evaluateProgression(squat(), [
        session('2026-10-01T10:00:00Z', [set(100, 10, 0)]),
        session('2026-10-03T10:00:00Z', [set(100, 10, 0)]),
      ])

      expect(result?.action).toBe('increase')
    })

    it('usa 5 kg de incremento para piernas', () => {
      const result = evaluateProgression(
        squat({ exercise: { id: 1, name: 'Sentadilla', category: 'upper legs' } }),
        [cleanTopSession('2026-10-01T10:00:00Z'), cleanTopSession('2026-10-03T10:00:00Z')],
      )

      expect(result?.suggestedWeight).toBe(105)
    })

    it('usa 1.25 kg de incremento para brazos', () => {
      const result = evaluateProgression(
        squat({ exercise: { id: 1, name: 'Curl', category: 'upper arms' } }),
        [cleanTopSession('2026-10-01T10:00:00Z'), cleanTopSession('2026-10-03T10:00:00Z')],
      )

      expect(result?.suggestedWeight).toBe(101.25)
    })

    it('usa 2.5 kg cuando el ejercicio no tiene categoría', () => {
      const result = evaluateProgression(squat({ exercise: undefined }), [
        cleanTopSession('2026-10-01T10:00:00Z'),
        cleanTopSession('2026-10-03T10:00:00Z'),
      ])

      expect(result?.suggestedWeight).toBe(102.5)
    })

    it('redondea el peso sugerido al disco de 1.25 kg más cercano', () => {
      const result = evaluateProgression(squat({ currentWeight: 101 }), [
        session('2026-10-01T10:00:00Z', [set(101, 10)]),
        session('2026-10-03T10:00:00Z', [set(101, 10)]),
      ])

      // 101 + 5 = 106 → el múltiplo de 1.25 más cercano es 106.25
      expect(result?.suggestedWeight).toBe(106.25)
    })

    it('ordena las sesiones por fecha antes de evaluar', () => {
      const result = evaluateProgression(squat(), [
        cleanTopSession('2026-10-03T10:00:00Z'),
        cleanTopSession('2026-10-01T10:00:00Z'),
      ])

      expect(result?.action).toBe('increase')
    })

    it('incluye el resumen de la última sesión en la recomendación de subida', () => {
      const result = evaluateProgression(squat(), [
        cleanTopSession('2026-10-01T10:00:00Z'),
        cleanTopSession('2026-10-03T10:00:00Z'),
      ])

      expect(result?.lastSession).toMatchObject({
        date: '2026-10-03T10:00:00Z',
        topWeight: 100,
        topReps: 10,
        setCount: 3,
      })
    })
  })

  describe('descarga', () => {
    it('descarga un 10% tras tres sesiones seguidas sin llegar al mínimo', () => {
      const result = evaluateProgression(squat(), [
        session('2026-10-01T10:00:00Z', [set(100, 5), set(100, 5)]),
        session('2026-10-03T10:00:00Z', [set(100, 5), set(100, 5)]),
        session('2026-10-05T10:00:00Z', [set(100, 5), set(100, 5)]),
      ])

      expect(result?.action).toBe('deload')
      expect(result?.suggestedWeight).toBe(90)
      expect(result?.reason).toContain('Descarga a 90 kg')
    })

    it('no descarga con solo dos sesiones fallidas', () => {
      const result = evaluateProgression(squat(), [
        session('2026-10-01T10:00:00Z', [set(100, 5)]),
        session('2026-10-03T10:00:00Z', [set(100, 5)]),
      ])

      expect(result?.action).toBe('maintain')
    })

    it('no descarga si alguna de las tres sesiones alcanzó el mínimo', () => {
      const result = evaluateProgression(squat(), [
        session('2026-10-01T10:00:00Z', [set(100, 5)]),
        session('2026-10-03T10:00:00Z', [set(100, 6)]),
        session('2026-10-05T10:00:00Z', [set(100, 5)]),
      ])

      expect(result?.action).toBe('maintain')
    })

    it('redondea el peso de descarga al disco de 1.25 kg más cercano', () => {
      const result = evaluateProgression(squat({ currentWeight: 102.5 }), [
        session('2026-10-01T10:00:00Z', [set(102.5, 5)]),
        session('2026-10-03T10:00:00Z', [set(102.5, 5)]),
        session('2026-10-05T10:00:00Z', [set(102.5, 5)]),
      ])

      // 102.5 * 0.9 = 92.25 → el múltiplo de 1.25 más cercano es 92.5
      expect(result?.suggestedWeight).toBe(92.5)
    })
  })

  describe('mantener', () => {
    it('resume la última sesión con serie tope, reps y 1RM estimado', () => {
      const result = evaluateProgression(squat(), [
        session('2026-10-01T10:00:00Z', [set(100, 8), set(100, 10), set(90, 12)]),
      ])

      expect(result?.action).toBe('maintain')
      expect(result?.lastSession).toEqual({
        date: '2026-10-01T10:00:00Z',
        topWeight: 100,
        topReps: 10,
        setCount: 2,
        e1rm: 100 * (1 + 10 / 30),
      })
    })

    it('cuenta solo las series con el peso de trabajo o superior', () => {
      const result = evaluateProgression(squat(), [
        session('2026-10-01T10:00:00Z', [set(105, 6), set(100, 6), set(95, 6)]),
      ])

      expect(result?.lastSession?.setCount).toBe(2)
    })

    it('explica el criterio de subida y la fecha de la última sesión', () => {
      const result = evaluateProgression(squat(), [
        session('2026-10-01T10:00:00Z', [set(100, 8)]),
      ])

      expect(result?.reason).toContain('Mantén 100 kg')
      expect(result?.reason).toContain('2 sesiones seguidas para subir')
      expect(result?.reason).toContain('2026-10-01: 8/6-10 reps a 100 kg')
    })

    it('preserva los objetivos de la rutina en todas las recomendaciones', () => {
      const result = evaluateProgression(
        squat({ targetSets: 4, targetRepsMin: 8, targetRepsMax: 12 }),
        [session('2026-10-01T10:00:00Z', [set(100, 10)])],
      )

      expect(result).toMatchObject({
        targetSets: 4,
        targetRepsMin: 8,
        targetRepsMax: 12,
        currentWeight: 100,
      })
    })
  })
})
