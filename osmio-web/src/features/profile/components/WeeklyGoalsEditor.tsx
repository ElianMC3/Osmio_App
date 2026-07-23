import { useState } from 'react'

interface Goals {
  strength: number
  combat: number
  nutrition: number
}

export function WeeklyGoalsEditor() {
  const [goals, setGoals] = useState<Goals>({ strength: 4, combat: 3, nutrition: 7 })

  const updateGoal = (key: keyof Goals, value: number) => {
    setGoals((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className="font-semibold text-white mb-4">Metas semanales</h3>
      <div className="space-y-4">
        {(Object.keys(goals) as (keyof Goals)[]).map((key) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-300 capitalize">{key === 'strength' ? 'Fuerza' : key === 'combat' ? 'Combate' : 'Nutrición'}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateGoal(key, Math.max(1, goals[key] - 1))}
                className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <span className="text-white font-medium w-6 text-center">{goals[key]}</span>
              <button
                onClick={() => updateGoal(key, goals[key] + 1)}
                className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
