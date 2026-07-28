import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GreenCard } from '../../../design-system/components/GreenCard'
import { GreenButton } from '../../../design-system/components/GreenButton'

const exercises = [
  { id: 1, name: 'Press Banca', category: 'Pecho' },
  { id: 2, name: 'Sentadilla', category: 'Pierna' },
  { id: 3, name: 'Peso Muerto', category: 'Espalda' },
  { id: 4, name: 'Remo con barra', category: 'Espalda' },
  { id: 5, name: 'Press Militar', category: 'Hombro' },
  { id: 6, name: 'Curl de bíceps', category: 'Brazo' },
  { id: 7, name: 'Fondos', category: 'Pecho' },
  { id: 8, name: 'Dominadas', category: 'Espalda' },
]

export default function ExercisePicker() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = exercises.filter(
    (e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <GreenButton
          onClick={() => navigate(-1)}
          variant="ghost"
          size="sm"
          effects={true}
          className="mb-2"
        >
          ← Volver
        </GreenButton>
        <h1 className="text-2xl font-bold text-text-green">Seleccionar ejercicio</h1>
      </header>

      <div className="relative mb-4">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">
          search
        </span>
        <input
          type="text"
          placeholder="Buscar ejercicio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-panel border border-green/25 rounded-lg py-2.5 pl-10 pr-4 text-text-green placeholder:text-text-muted placeholder:opacity-50 focus:outline-none focus:border-green"
        />
      </div>

      <div className="space-y-1">
        {filtered.map((ex) => (
          <GreenCard
            key={ex.id}
            variant="interactive"
            padding="sm"
            effects={true}
            onClick={() => navigate('/logging/strength')}
            className="flex justify-between items-center cursor-pointer"
          >
            <span className="text-text-green">{ex.name}</span>
            <span className="text-xs text-text-muted bg-green/10 px-2 py-1 rounded">{ex.category}</span>
          </GreenCard>
        ))}
      </div>
    </div>
  )
}
