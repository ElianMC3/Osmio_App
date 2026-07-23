import { useNavigate } from 'react-router-dom'

const history = [
  { date: '8 jul 2026', sets: 4, reps: '10, 8, 8, 6', weight: '70kg', rpe: 8 },
  { date: '4 jul 2026', sets: 4, reps: '10, 8, 8, 7', weight: '67.5kg', rpe: 7 },
  { date: '1 jul 2026', sets: 3, reps: '10, 10, 8', weight: '65kg', rpe: 7 },
]

export default function ExerciseHistory() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <header className="mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 text-sm mb-2 cursor-pointer">← Volver</button>
        <h1 className="text-2xl font-bold text-white">Press Banca</h1>
        <p className="text-gray-400 text-sm">Historial de sesiones</p>
      </header>

      <div className="space-y-3">
        {history.map((h, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">{h.date}</span>
              <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">RPE {h.rpe}</span>
            </div>
            <div className="flex gap-6 text-sm">
              <span className="text-gray-300">{h.sets} series</span>
              <span className="text-gray-300">{h.reps} reps</span>
              <span className="text-white font-medium">{h.weight}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
