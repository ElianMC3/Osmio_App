import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

type GreenButtonVariant = 'default' | 'primary' | 'ghost'
type GreenButtonSize = 'sm' | 'md' | 'lg'

interface GreenButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GreenButtonVariant
  size?: GreenButtonSize
  fullWidth?: boolean
  effects?: boolean
  children: ReactNode
}

const variantStyles: Record<GreenButtonVariant, string> = {
  default:
    'bg-transparent border border-green/35 text-text-green',
  primary:
    'bg-gradient-to-r from-primary via-green to-acid text-on-primary border border-on-green/10 font-semibold',
  ghost:
    'bg-transparent text-text-muted border border-transparent hover:text-text-green',
}

const sizeStyles: Record<GreenButtonSize, string> = {
  sm: 'py-2 px-3 text-[10px]',
  md: 'py-2.5 px-4 text-[11px]',
  lg: 'py-3 px-5 text-[12px]',
}

export const GreenButton = forwardRef<HTMLButtonElement, GreenButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      fullWidth = false,
      effects = true,
      className = '',
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyle = effects
      ? 'transition-all duration-300 active:scale-[0.97]'
      : 'transition-colors duration-200'

    const hoverStyle = effects
      ? variant === 'default'
        ? 'hover:bg-green/10 hover:border-green hover:text-green'
        : variant === 'primary'
          ? 'hover:brightness-110 hover:shadow-[0_0_24px_color-mix(in_srgb,var(--green)_35%,transparent)]'
          : 'hover:bg-green/5'
      : variant === 'default'
        ? 'hover:border-green/50'
        : variant === 'primary'
          ? 'hover:border-green/80'
          : ''

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
          font-label-caps uppercase tracking-[1px]
          cursor-pointer
          disabled:opacity-40 disabled:cursor-not-allowed
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green
          rounded-[10px]
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${baseStyle}
          ${hoverStyle}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    )
  },
)

GreenButton.displayName = 'GreenButton'
