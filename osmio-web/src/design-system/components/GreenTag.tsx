import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

type GreenTagColor = 'green' | 'acid' | 'muted' | 'paper'
type GreenTagVariant = 'outlined' | 'filled' | 'ghost'

interface GreenTagProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  color?: GreenTagColor
  variant?: GreenTagVariant
  effects?: boolean
}

const colorMap: Record<GreenTagColor, { text: string; border: string; bg: string }> = {
  green: { text: 'text-green', border: 'border-green/25', bg: 'bg-green/10' },
  acid: { text: 'text-acid', border: 'border-acid/25', bg: 'bg-acid/10' },
  muted: { text: 'text-text-muted', border: 'border-text-muted/20', bg: 'bg-text-muted/10' },
  paper: { text: 'text-paper', border: 'border-paper/25', bg: 'bg-paper/10' },
}

const variantStyles: Record<GreenTagVariant, string> = {
  outlined: 'border',
  filled: 'border',
  ghost: 'border border-transparent',
}

export const GreenTag = forwardRef<HTMLSpanElement, GreenTagProps>(
  (
    {
      children,
      color = 'green',
      variant = 'outlined',
      effects = true,
      className = '',
      ...props
    },
    ref,
  ) => {
    const chosen = colorMap[color]

    return (
      <span
        ref={ref}
        className={`
          font-label-caps text-[9px] uppercase tracking-[0.8px]
          px-2.5 py-1 inline-flex items-center gap-1
          rounded-[6px]
          ${variantStyles[variant]}
          ${chosen.text}
          ${chosen.border}
          ${variant === 'filled' ? chosen.bg : ''}
          ${effects ? 'transition-all duration-300 hover:scale-105 hover:shadow-[0_0_12px_color-mix(in_srgb,var(--green)_20%,transparent)]' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </span>
    )
  },
)

GreenTag.displayName = 'GreenTag'
