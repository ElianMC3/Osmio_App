interface DayCellProps {
  day: number
  hasTraining: boolean
  onClick?: () => void
}

export function DayCell({ day, hasTraining, onClick }: DayCellProps) {
  return (
    <button
      onClick={onClick}
      className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-colors cursor-pointer ${
        hasTraining
          ? 'bg-purple-600/30 text-purple-300 hover:bg-purple-600/50'
          : 'text-gray-500 hover:bg-gray-800'
      }`}
    >
      {day}
    </button>
  )
}
