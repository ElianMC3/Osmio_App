import { useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
    <div className="min-h-screen bg-gray-950 p-6">
      <header className="mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 text-sm mb-2 cursor-pointer">← Volver</button>
        <h1 className="text-2xl font-bold text-white">Seleccionar ejercicio</h1>
      </header>

      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar ejercicio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      <div className="space-y-1">
        {filtered.map((ex) => (
          <button
            key={ex.id}
            onClick={() => navigate('/logging/strength')}
            className="w-full flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <span className="text-white">{ex.name}</span>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">{ex.category}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
