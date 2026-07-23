const prs = [
  { exercise: 'Press Banca', weight: '85 kg', date: '5 jul 2026' },
  { exercise: 'Sentadilla', weight: '120 kg', date: '1 jul 2026' },
  { exercise: 'Peso Muerto', weight: '140 kg', date: '25 jun 2026' },
  { exercise: 'Press Militar', weight: '60 kg', date: '20 jun 2026' },
]

export function PrTable() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-3">PRs personales</h3>
      <div className="space-y-2">
        {prs.map((pr) => (
          <div key={pr.exercise} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
            <span className="text-white text-sm">{pr.exercise}</span>
            <div className="text-right">
              <span className="text-purple-400 font-semibold text-sm">{pr.weight}</span>
              <p className="text-xs text-gray-500">{pr.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
