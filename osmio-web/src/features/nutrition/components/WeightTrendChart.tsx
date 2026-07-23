const weightData = [
  { day: 1, weight: 78.5 },
  { day: 5, weight: 78.2 },
  { day: 10, weight: 78.0 },
  { day: 15, weight: 77.8 },
  { day: 20, weight: 77.5 },
  { day: 25, weight: 77.3 },
  { day: 30, weight: 77.1 },
]

export function WeightTrendChart() {
  const minW = Math.min(...weightData.map((d) => d.weight))
  const maxW = Math.max(...weightData.map((d) => d.weight))
  const range = maxW - minW || 1

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-3">Tendencia de peso</h3>
      <div className="flex items-end gap-1 h-24">
        {weightData.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs text-gray-500">{d.weight}</span>
            <div
              className="w-full bg-green-500 rounded-t-md"
              style={{ height: `${((d.weight - minW) / range) * 80 + 20}%` }}
            />
            <span className="text-xs text-gray-500">{d.day}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-gray-500 mt-2">-1.4 kg este mes</p>
    </div>
  )
}
