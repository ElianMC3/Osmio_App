interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  color?: 'primary' | 'secondary' | 'tertiary' | 'error'
  size?: 'sm' | 'md'
  label?: string
}

const colorMap: Record<string, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary',
  error: 'bg-error',
}

export function ProgressBar({
  value,
  max = 100,
  className = '',
  color = 'primary',
  size = 'sm',
  label,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const height = size === 'sm' ? 'h-1' : 'h-1.5'

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <span className="font-label-caps text-[10px] text-on-surface-variant block mb-xs">
          {label}
        </span>
      )}
      <div
        className={`w-full ${height} bg-outline-variant overflow-hidden`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={`h-full ${colorMap[color]} transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
