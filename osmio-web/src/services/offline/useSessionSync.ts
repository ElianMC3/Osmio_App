import { useEffect } from 'react'
import { toast } from '@/design-system/toast'
import { sessionQueue } from './sessionQueue'

/**
 * Vacía la cola de sesiones pendientes al arrancar, al volver la red y al
 * volver a la app desde segundo plano. Vive en el shell autenticado: sin
 * sesión iniciada no hay a quién subirle nada.
 */
export function useSessionSync() {
  useEffect(() => {
    let active = true

    const sync = async () => {
      try {
        const { synced } = await sessionQueue.flush()
        if (!active || synced === 0) return
        toast.success(
          'Sesiones sincronizadas',
          synced === 1
            ? '1 sesión guardada en la nube.'
            : `${synced} sesiones guardadas en la nube.`,
        )
      } catch (error) {
        // IndexedDB no disponible (modo privado antiguo): la app sigue
        // funcionando online, solo no hay cola offline.
        console.error('[offline] no se pudo sincronizar la cola', error)
      }
    }

    void sync()

    const onOnline = () => void sync()
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') void sync()
    }

    window.addEventListener('online', onOnline)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      active = false
      window.removeEventListener('online', onOnline)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])
}
