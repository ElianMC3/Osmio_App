import { useNavigate } from 'react-router-dom'
import { GreenCard } from '../../../design-system/components/GreenCard'
import { GreenButton } from '../../../design-system/components/GreenButton'

const history = [
  { date: '8 jul 2026', sets: 4, reps: '10, 8, 8, 6', weight: '70kg', rpe: 8 },
  { date: '4 jul 2026', sets: 4, reps: '10, 8, 8, 7', weight: '67.5kg', rpe: 7 },
  { date: '1 jul 2026', sets: 3, reps: '10, 10, 8', weight: '65kg', rpe: 7 },
]

export default function ExerciseHistory() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#050705] p-6">
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
        <h1 className="text-2xl font-bold text-text-green">Press Banca</h1>
        <p className="text-text-muted text-sm">Historial de sesiones</p>
      </header>

      <div className="space-y-3">
        {history.map((h, i) => (
          <GreenCard key={i} variant="default" padding="md" effects={true}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-text-muted">{h.date}</span>
              <span className="text-xs bg-green/10 text-green px-2 py-1 rounded">RPE {h.rpe}</span>
            </div>
            <div className="flex gap-6 text-sm">
              <span className="text-text-muted">{h.sets} series</span>
              <span className="text-text-muted">{h.reps} reps</span>
              <span className="text-text-green font-medium">{h.weight}</span>
            </div>
          </GreenCard>
        ))}
      </div>
    </div>
  )
}
