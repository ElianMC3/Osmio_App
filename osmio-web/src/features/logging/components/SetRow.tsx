interface SetData {
  reps: number
  weight: number
  rpe: number
}

interface SetRowProps {
  index: number
  data: SetData
  onChange: (data: SetData) => void
}

export function SetRow({ index, data, onChange }: SetRowProps) {
  return (
    <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl p-3">
      <span className="text-sm font-medium text-gray-500 w-6">{index + 1}</span>
      <div className="flex-1 grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-gray-500">Reps</label>
          <input
            type="number"
            value={data.reps}
            onChange={(e) => onChange({ ...data, reps: Number(e.target.value) })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-1.5 px-2 text-white text-sm focus:outline-none focus:border-purple-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Peso (kg)</label>
          <input
            type="number"
            value={data.weight}
            onChange={(e) => onChange({ ...data, weight: Number(e.target.value) })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-1.5 px-2 text-white text-sm focus:outline-none focus:border-purple-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">RPE</label>
          <input
            type="number"
            min={1}
            max={10}
            value={data.rpe}
            onChange={(e) => onChange({ ...data, rpe: Number(e.target.value) })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-1.5 px-2 text-white text-sm focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>
    </div>
  )
}
