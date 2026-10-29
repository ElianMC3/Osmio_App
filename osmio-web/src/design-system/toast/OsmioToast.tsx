import { Check, Info, TriangleAlert, X, LoaderCircle } from 'lucide-react'
import { toast as sonnerToast } from 'sonner'

export type ToastTone = 'success' | 'error' | 'info'

const TONES: Record<ToastTone, { iconClass: string; iconBg: string; Icon: typeof Check }> = {
  success: { iconClass: 'text-on-green', iconBg: 'bg-green/90', Icon: Check },
  error: { iconClass: 'text-on-error', iconBg: 'bg-error/90', Icon: TriangleAlert },
  info: { iconClass: 'text-on-primary', iconBg: 'bg-primary/90', Icon: Info },
}

export interface OsmioToastProps {
  tone: ToastTone
  title: string
  description?: string
  action?: { label: string; onClick: () => void; destructive?: boolean }
  loading?: boolean
}

/**
 * Tarjeta de notificación Osmio: vidrio translúcido en línea con la restante
 * chrome (tab bar, sidebar), icono semanticamente tintado con tokens del tema.
 * Sonner gestiona el toast (swipe, stack, pausas) y llama este componente
 * como contenido headless.
 */
export function OsmioToast({ toastId, ...toastProps }: { toastId: string | number } & OsmioToastProps) {
  const { tone, title, description, action, loading = false } = toastProps
  const { iconClass, iconBg, Icon } = TONES[tone]

  return (
    <div
      role="status"
      className="flex w-[calc(100vw-1.5rem)] max-w-md items-start gap-3 rounded-2xl border border-outline-variant/30 bg-surface-container/85 p-3.5 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.55)]"
    >
      <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        {loading ? (
          <LoaderCircle size={15} className={`${iconClass} animate-spin`} aria-hidden="true" />
        ) : (
          <Icon size={15} className={iconClass} strokeWidth={2.6} aria-hidden="true" />
        )}
      </span>

      <div className="flex-1 min-w-0 pt-0.5">
        <p className="font-medium text-sm leading-snug text-on-surface">{title}</p>
        {description && <p className="mt-0.5 text-xs leading-relaxed text-on-surface-variant">{description}</p>}
        {action && (
          <button
            onClick={() => {
              action.onClick()
              sonnerToast.dismiss(toastId)
            }}
            className={`mt-2.5 font-label-caps text-[11px] tracking-[0.08em] uppercase cursor-pointer
              rounded-lg px-2.5 py-1.5 transition-colors duration-150
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
              ${action.destructive ? 'text-error hover:bg-error/10' : 'text-primary hover:bg-primary/10'}`}
          >
            {action.label}
          </button>
        )}
      </div>

      <button
        onClick={() => sonnerToast.dismiss(toastId)}
        aria-label="Cerrar notificación"
        className="shrink-0 cursor-pointer rounded-lg p-1.5 -m-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-150
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <X size={15} strokeWidth={2.2} aria-hidden="true" />
      </button>
    </div>
  )
}
