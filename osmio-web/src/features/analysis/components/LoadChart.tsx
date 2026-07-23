const data = [
  { week: 'Sem 1', load: 1200 },
  { week: 'Sem 2', load: 1350 },
  { week: 'Sem 3', load: 1280 },
  { week: 'Sem 4', load: 1500 },
  { week: 'Sem 5', load: 1420 },
  { week: 'Sem 6', load: 1600 },
]

export function LoadChart() {
  const maxLoad = Math.max(...data.map((d) => d.load))

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-4">Volumen semanal (kg)</h3>
      <div className="flex items-end gap-2 h-40">
        {data.map((d) => (
          <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs text-gray-500">{d.load}</span>
            <div
              className="w-full bg-purple-600 rounded-t-md transition-all"
              style={{ height: `${(d.load / maxLoad) * 100}%` }}
            />
            <span className="text-xs text-gray-500">{d.week.replace('Sem ', '')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
