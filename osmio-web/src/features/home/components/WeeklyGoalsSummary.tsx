import { ProgressBar } from '../../../design-system/components/ProgressBar'

const goals = [
  { label: 'Fuerza', current: 3, target: 4, color: 'primary' as const },
  { label: 'Combate', current: 2, target: 3, color: 'secondary' as const },
  { label: 'Nutrición', current: 5, target: 7, color: 'tertiary' as const },
]

export function WeeklyGoalsSummary() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-medium text-gray-400">Meta semanal</h3>
      {goals.map((g) => (
        <div key={g.label} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-300">{g.label}</span>
            <span className="text-gray-500">{g.current}/{g.target}</span>
          </div>
          <ProgressBar value={g.current} max={g.target} color={g.color} />
        </div>
      ))}
    </div>
  )
}
