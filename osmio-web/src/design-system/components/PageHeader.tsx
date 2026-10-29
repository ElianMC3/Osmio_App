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

/**
 * Cabecera de página: tarjeta glass con título de la pantalla y contexto.
 * Jerarquía por peso/tamaño (sentence-case); sin decoración — el acento
 * de marca vive solo en `titleAccent`.
 */
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
    <>
      {/* Móvil (< lg): título suelto estilo Apple — jerarquía por peso/tamaño, sin tarjeta */}
      <h1 className="lg:hidden text-[26px] leading-tight font-semibold tracking-tight text-on-surface">
        {title}
        {titleAccent && <span className="text-primary ml-2">{titleAccent}</span>}
      </h1>

      {/* Desktop (lg+): tarjeta glass completa */}
      <header className="hidden lg:block relative overflow-hidden rounded-2xl border border-outline-variant/25 bg-surface-container/60 backdrop-blur-2xl px-5 py-5 sm:px-6">
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Volver"
              className="mt-0.5 w-9 h-9 flex items-center justify-center rounded-xl border border-outline-variant/40 bg-surface-container-high/60 text-on-surface-variant hover:text-text-green hover:border-green/40 hover:bg-green/5 transition-colors duration-200 active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          )}
          <div className="min-w-0">
            {kicker && (
              <p className="text-[10px] font-medium tracking-[0.14em] text-on-surface-variant/70 mb-1">
                {kicker}
              </p>
            )}
            <h1 className="text-[22px] sm:text-[26px] leading-tight font-semibold tracking-tight text-on-surface">
              {title}
              {titleAccent && <span className="text-primary ml-2">{titleAccent}</span>}
            </h1>
            {subtitle && (
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
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
    </>
  )
}
