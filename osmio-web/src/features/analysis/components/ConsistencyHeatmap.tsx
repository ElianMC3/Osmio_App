const weeks = [
  [1, 1, 0, 1, 1, 0, 0],
  [1, 1, 1, 0, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 0],
  [1, 0, 1, 1, 1, 0, 0],
  [1, 1, 0, 1, 0, 0, 0],
]

const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function getColor(intensity: number) {
  if (intensity === 0) return 'bg-gray-800'
  return 'bg-purple-600'
}

export function ConsistencyHeatmap() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-4">Últimas 5 semanas</h3>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {dayLabels.map((d) => (
          <div key={d} className="text-xs text-gray-500 text-center">{d}</div>
        ))}
        {weeks.flat().map((val, i) => (
          <div
            key={i}
            className={`aspect-square rounded-md ${getColor(val)}`}
            title={val ? 'Entrenó' : 'Descanso'}
          />
        ))}
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <span className="w-3 h-3 rounded bg-gray-800" /> Sin actividad
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <span className="w-3 h-3 rounded bg-purple-600" /> Activo
        </span>
      </div>
    </div>
  )
}
