const data = [
  { week: 'L', striking: 4, grappling: 3 },
  { week: 'M', striking: 0, grappling: 5 },
  { week: 'X', striking: 3, grappling: 0 },
  { week: 'J', striking: 0, grappling: 4 },
  { week: 'V', striking: 5, grappling: 3 },
  { week: 'S', striking: 0, grappling: 0 },
  { week: 'D', striking: 0, grappling: 0 },
]

export function StackedBarChart() {
  const maxTotal = Math.max(...data.map((d) => d.striking + d.grappling), 1)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-4">Rounds por día</h3>
      <div className="flex items-end gap-2 h-40">
        {data.map((d) => {
          const total = d.striking + d.grappling
          return (
            <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">{total || ''}</span>
              <div className="w-full flex flex-col" style={{ height: `${(total / maxTotal) * 100}%` }}>
                {d.grappling > 0 && (
                  <div className="w-full bg-blue-500 rounded-t-md" style={{ flex: d.grappling }} />
                )}
                {d.striking > 0 && (
                  <div
                    className="w-full bg-red-500"
                    style={{ flex: d.striking, borderRadius: d.grappling === 0 ? '0.375rem 0.375rem 0 0' : 0 }}
                  />
                )}
              </div>
              <span className="text-xs text-gray-500">{d.week}</span>
            </div>
          )
        })}
      </div>
      <div className="flex justify-center gap-4 mt-3">
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-red-500" /> Striking
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-blue-500" /> Grappling
        </span>
      </div>
    </div>
  )
}
