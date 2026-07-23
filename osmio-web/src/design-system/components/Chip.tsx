import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

type ChipVariant = 'default' | 'primary' | 'secondary' | 'tertiary' | 'error'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  selected?: boolean
  variant?: ChipVariant
  icon?: ReactNode
}

const variantStyles: Record<ChipVariant, string> = {
  default:
    'border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high',
  primary:
    'border-primary/50 text-primary',
  secondary:
    'border-secondary/50 text-secondary',
  tertiary:
    'border-tertiary/50 text-tertiary',
  error:
    'border-error/50 text-error',
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      children,
      selected = false,
      variant = 'default',
      icon,
      className = '',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        className={`
          inline-flex items-center gap-xs px-md py-sm rounded-full
          border text-label-caps font-label-caps uppercase
          transition-all duration-200 cursor-pointer
          active:scale-[0.98]
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
          ${
            selected
              ? 'bg-primary-fixed/10 border-primary-fixed text-primary-fixed'
              : variantStyles[variant]
          }
          ${className}
        `}
        {...props}
      >
        {icon}
        {children}
      </button>
    )
  },
)

Chip.displayName = 'Chip'
