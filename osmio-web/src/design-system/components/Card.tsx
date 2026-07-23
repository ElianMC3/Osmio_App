import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'glass' | 'interactive'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const variantStyles: Record<string, string> = {
  default:
    'bg-surface-container border border-outline-variant/20',
  glass:
    'bg-surface-container/50 backdrop-blur-xl border border-outline-variant/15',
  interactive:
    'bg-surface-container border border-outline-variant/20 hover:border-primary-fixed/50 hover:bg-primary-fixed/5 cursor-pointer transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
}

const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-sm',
  md: 'p-md',
  lg: 'p-lg',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      className = '',
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`rounded-2xl animate-fade-in ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  },
)

Card.displayName = 'Card'
