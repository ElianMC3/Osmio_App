interface MacroBarProps {
  calories: number
  goal: number
  protein: number
  proteinGoal: number
  carbs: number
  carbsGoal: number
  fat: number
  fatGoal: number
}

export function MacroBar({ calories, goal, protein, proteinGoal, carbs, carbsGoal, fat, fatGoal }: MacroBarProps) {
  const calPercent = Math.min((calories / goal) * 100, 100)
  const protPercent = Math.min((protein / proteinGoal) * 100, 100)
  const carbPercent = Math.min((carbs / carbsGoal) * 100, 100)
  const fatPercent = Math.min((fat / fatGoal) * 100, 100)

  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Calorías</span>
          <span>{Math.round(calPercent)}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${calPercent}%` }} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Prot</span>
            <span>{protein}g</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: `${protPercent}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Carbos</span>
            <span>{carbs}g</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${carbPercent}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Grasa</span>
            <span>{fat}g</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${fatPercent}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
