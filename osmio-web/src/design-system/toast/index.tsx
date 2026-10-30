import { toast as sonnerToast, type ExternalToast } from 'sonner'
import { OsmioToast, type OsmioToastProps } from './OsmioToast'

/**
 * Sistema de toasts de Osmio sobre Sonner. Headless (toast.custom): Sonner
 * aporta posicionamiento, stack, swipe-to-dismiss y pausas (pestaña oculta);
 * la tarjeta es del design system. Un solo <Toaster> vive en providers.tsx.
 *
 * ```ts
 * import { toast } from '@/design-system/toast'
 * toast.success('Rutina creada')
 * toast.error('No se pudo guardar', 'Revisa tu conexión.', {
 *   action: { label: 'Reintentar', onClick: retry },
 * })
 * toast.confirm('¿Eliminar esta rutina?', '…', { label: 'Eliminar', onClick })
 * ```
 */

const DURATIONS: Record<OsmioToastProps['tone'], number> & { confirm: number } = {
  success: 3500,
  error: 6500,
  info: 4000,
  confirm: 8000,
}

function show(customProps: OsmioToastProps, duration: number, options?: ExternalToast) {
  // `duration` primero para que un aviso concreto (p. ej. actualización de la
  // PWA) pueda pedir más tiempo sin cambiar el default del tono.
  return sonnerToast.custom((id) => <OsmioToast toastId={id} {...customProps} />, {
    duration,
    ...options,
  })
}

export const toast = {
  /** Confirmación de una acción exitosa. */
  success: (title: string, description?: string, options?: ExternalToast) =>
    show({ tone: 'success', title, description }, DURATIONS.success, options),

  /** Error: dura más (6.5s). Añade description y/o action. */
  error: (
    title: string,
    description?: string,
    options?: ExternalToast & { action?: OsmioToastProps['action'] },
  ) => show({ tone: 'error', title, description }, DURATIONS.error, options),

  /** Notificación neutra. Acepta action para avisos que piden una decisión. */
  info: (
    title: string,
    description?: string,
    options?: ExternalToast & { action?: OsmioToastProps['action'] },
  ) => show({ tone: 'info', title, description, action: options?.action }, DURATIONS.info, options),

  /** Confirmación destructiva con botón en el propio toast; auto-cierra en 8s sin decisión. */
  confirm: (title: string, description: string, action: { label: string; onClick: () => void }) =>
    show({ tone: 'error', title, description, action: { ...action, destructive: true } }, DURATIONS.confirm),

  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
}
