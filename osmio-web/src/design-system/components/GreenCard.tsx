import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

interface GreenCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'interactive' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  effects?: boolean
}

const variantStyles: Record<string, string> = {
  default: 'bg-panel/70 backdrop-blur-xl border border-outline-variant/30 shadow-xl shadow-black/25',
  glass: 'bg-panel/45 backdrop-blur-2xl border border-outline-variant/20 shadow-lg shadow-black/20',
  interactive: 'bg-panel/70 backdrop-blur-xl border border-outline-variant/30 shadow-xl shadow-black/25',
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
        ? 'hover:-translate-y-0.5 hover:border-green/50 hover:bg-green/[0.04] hover:shadow-green/10 cursor-pointer transition-all duration-300 active:scale-[0.98]'
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
          ${className}
        `}
        {...props}
      >
        {effects && (
          <span
            className="absolute left-0 right-0 pointer-events-none z-10"
            style={{
              top: '-60px',
              height: '50px',
              background: 'linear-gradient(180deg, transparent, rgba(199,217,136,0.28), transparent)',
              animation: 'greenScanMove 4s infinite linear',
            }}
          />
        )}
        {effects && (
          <span className="pointer-events-none absolute left-5 right-5 top-0 h-px bg-gradient-to-r from-transparent via-green/40 to-transparent z-10" />
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
