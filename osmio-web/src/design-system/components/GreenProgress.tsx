import { forwardRef, type HTMLAttributes } from 'react'

interface GreenProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  label?: string
  showValue?: boolean
  size?: 'sm' | 'md'
  effects?: boolean
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
}

export const GreenProgress = forwardRef<HTMLDivElement, GreenProgressProps>(
  (
    {
      value,
      label,
      showValue = false,
      size = 'md',
      effects = true,
      className = '',
      ...props
    },
    ref,
  ) => {
    const clampedValue = Math.min(100, Math.max(0, value))

    return (
      <div ref={ref} className={`space-y-1 ${className}`} {...props}>
        {(label || showValue) && (
          <div className="flex justify-between items-end">
            {label && (
              <span className="font-label-caps text-[10px] uppercase tracking-[0.5px] text-text-muted">
                {label}
              </span>
            )}
            {showValue && (
              <span className="font-data-display text-[11px] text-text-green">
                {clampedValue}%
              </span>
            )}
          </div>
        )}
        <div className="bg-outline/15 rounded-full relative" style={{ height: sizeStyles[size] }}>
          <div
            className={`h-full bg-gradient-to-r from-green to-acid rounded-full ${effects ? 'transition-all duration-500' : ''}`}
            style={{ width: `${clampedValue}%` }}
          />
          {effects && clampedValue > 0 && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                width: `${clampedValue}%`,
                boxShadow: '0 0 6px color-mix(in srgb, var(--green) 30%, transparent)',
              }}
            />
          )}
        </div>
      </div>
    )
  },
)

GreenProgress.displayName = 'GreenProgress'
