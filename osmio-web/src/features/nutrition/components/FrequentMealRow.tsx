import { Plus } from 'lucide-react'

interface FrequentMealRowProps {
  label: string
  calories: number
  onAdd: () => void
}

export function FrequentMealRow({ label, calories, onAdd }: FrequentMealRowProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-800 last:border-0">
      <div>
        <span className="text-sm text-gray-200">{label}</span>
        <span className="text-xs text-gray-500 ml-2">{calories} kcal</span>
      </div>
      <button
        onClick={onAdd}
        className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors cursor-pointer"
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
