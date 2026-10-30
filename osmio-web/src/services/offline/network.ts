/**
 * Distingue "no hay red" de un error real del servidor.
 *
 * Sin esto, un token caducado o un fallo de permisos quedaría oculto detrás de
 * la caché o de las sesiones pendientes.
 */
export function isNetworkError(error: unknown): boolean {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return true

  const message = error instanceof Error ? error.message.toLowerCase() : ''
  return (
    message.includes('failed to fetch') ||
    message.includes('fetch failed') ||
    message.includes('load failed') ||
    message.includes('networkerror') ||
    message.includes('network error') ||
    message.includes('offline')
  )
}

export function isOnline(): boolean {
  return typeof navigator === 'undefined' || navigator.onLine !== false
}
