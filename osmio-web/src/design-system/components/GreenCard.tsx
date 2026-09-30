import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

interface GreenCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'interactive' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  effects?: boolean
}

const variantStyles: Record<string, string> = {
  default: 'bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30',
  glass: 'bg-surface-container/40 border border-outline-variant/25',
  interactive:
    'bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 hover:border-primary-fixed/50 hover:bg-surface-container-high/60 transition-all duration-200',
}

const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export const GreenCard = forwardRef<HTMLDivElement, GreenCardProps>(
  ({ variant = 'default', padding = 'md', effects = false, className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-2xl
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  },
)

GreenCard.displayName = 'GreenCard'
