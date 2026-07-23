import { useState, useCallback } from 'react'

interface SetEntry {
  reps: number
  weight: number
  rpe: number
}

interface SessionFormState {
  exerciseId: number | null
  sets: SetEntry[]
  notes: string
}

const emptyState: SessionFormState = {
  exerciseId: null,
  sets: [],
  notes: '',
}

export function useSessionForm() {
  const [form, setForm] = useState<SessionFormState>(emptyState)

  const setExercise = useCallback((id: number) => setForm((f) => ({ ...f, exerciseId: id })), [])

  const addSet = useCallback(() => {
    setForm((f) => ({
      ...f,
      sets: [...f.sets, { reps: 10, weight: 0, rpe: 7 }],
    }))
  }, [])

  const updateSet = useCallback((index: number, data: SetEntry) => {
    setForm((f) => ({
      ...f,
      sets: f.sets.map((s, i) => (i === index ? data : s)),
    }))
  }, [])

  const setNotes = useCallback((notes: string) => setForm((f) => ({ ...f, notes })), [])

  const reset = useCallback(() => setForm(emptyState), [])

  return { form, setExercise, addSet, updateSet, setNotes, reset }
}
