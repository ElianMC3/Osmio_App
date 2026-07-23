import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-fixed text-on-primary hover:brightness-110 active:scale-[0.98] border border-primary-fixed',
  secondary:
    'bg-transparent text-primary-fixed border border-primary-fixed/30 hover:border-primary-fixed hover:bg-primary-fixed/5 active:scale-[0.98]',
  ghost:
    'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high active:scale-[0.98]',
  danger:
    'bg-error-container text-on-error-container hover:brightness-110 active:scale-[0.98] border border-error-container',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'py-2 px-3 text-sm',
  md: 'py-3 px-5 text-base',
  lg: 'py-4 px-6 text-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      className = '',
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
          font-label-caps uppercase tracking-[0.2em] text-label-caps
          transition-all duration-200 cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
          active:scale-[0.98]
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
