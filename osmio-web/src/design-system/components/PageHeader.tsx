import { type ReactNode } from 'react'

interface PageHeaderProps {
  kicker?: string
  title: string
  titleAccent?: string
  subtitle?: string
  onBack?: () => void
  status?: ReactNode
  right?: ReactNode
  children?: ReactNode
}

export function PageHeader({
  kicker,
  title,
  titleAccent,
  subtitle,
  onBack,
  status,
  right,
  children,
}: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-outline-variant/25 bg-surface-container/60 backdrop-blur-2xl shadow-2xl shadow-black/25 px-5 py-5 sm:px-6">
      <div
        className="c-glow"
        style={{
          inset: -60,
          filter: 'blur(80px)',
          opacity: 0.4,
          background:
            'radial-gradient(circle at 88% 15%, color-mix(in srgb, var(--acid) 24%, transparent), transparent 72%)',
        }}
      />
      <span className="scanline-y" />
      <span className="gradient-hairline" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Volver"
              className="mt-0.5 w-9 h-9 flex items-center justify-center rounded-xl border border-outline-variant/40 bg-surface-container-high/60 text-on-surface-variant hover:text-text-green hover:border-green/40 hover:bg-green/5 hover:shadow-[0_0_18px_color-mix(in_srgb,var(--green)_28%,transparent)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          )}
          <div className="min-w-0">
            {kicker && (
              <p className="flex items-center gap-2 font-label-caps text-[10px] tracking-[0.22em] text-text-muted uppercase mb-1.5">
                <span className="w-1.5 h-1.5 bg-green inline-block rotate-45" />
                {kicker}
              </p>
            )}
            <h1 className="font-headline-md text-[22px] sm:text-[26px] leading-tight font-bold uppercase tracking-tight text-on-surface">
              {title}
              {titleAccent && <span className="text-gradient-green ml-2">{titleAccent}</span>}
            </h1>
            {subtitle && (
              <p className="font-label-sm text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {(status || right) && (
          <div className="flex items-center gap-2 flex-shrink-0">{status}{right}</div>
        )}
      </div>
      {children && <div className="relative mt-4">{children}</div>}
    </header>
  )
}