import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

interface GreenCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'interactive' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  effects?: boolean
}

const variantStyles: Record<string, string> = {
  default: 'bg-panel border border-green/25',
  glass: 'bg-panel/50 backdrop-blur-xl border border-green/15',
  interactive: 'bg-panel border border-green/25',
}

const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
}

export const GreenCard = forwardRef<HTMLDivElement, GreenCardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      effects = true,
      className = '',
      children,
      ...props
    },
    ref,
  ) => {
    const interactiveClasses = variant === 'interactive'
      ? effects
        ? 'hover:border-green/50 hover:bg-green/5 cursor-pointer transition-all duration-300 active:scale-[0.97]'
        : 'hover:border-green/40 cursor-pointer transition-colors duration-300'
      : ''

    const glassClasses = variant === 'glass' && effects
      ? 'hover:border-green/30 transition-all duration-300'
      : ''

    return (
      <div
        ref={ref}
        className={`
          rounded-[22px]
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${interactiveClasses}
          ${glassClasses}
          relative overflow-hidden
          ${effects ? 'group' : ''}
          ${className}
        `}
        {...props}
      >
        {effects && (
          <span
            className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(180deg, transparent, rgba(199,217,136,0.03), transparent)',
              animation: 'greenScanMove 4s infinite linear',
            }}
          />
        )}
        {children}
        {effects && (
          <style>{`
            @keyframes greenScanMove {
              from { top: -60px; }
              to { top: 100%; }
            }
          `}</style>
        )}
      </div>
    )
  },
)

GreenCard.displayName = 'GreenCard'
