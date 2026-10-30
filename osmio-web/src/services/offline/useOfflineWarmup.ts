import { useEffect } from 'react'
import { routinesApi } from '@/services/api/routines.api'
import { isOnline } from './network'

/**
 * Precalienta la caché local con lo imprescindible para **empezar** a entrenar
 * sin red.
 *
 * El service worker guarda el código de la app, pero las rutinas viven en
 * Supabase. Sin esta descarga previa, abrir el gimnasio sin cobertura dejaba a
 * la sesión activa con los ejercicios por defecto en vez de tu rutina.
 */
export function useOfflineWarmup() {
  useEffect(() => {
    let active = true

    const warm = () => {
      if (!isOnline()) return
      void routinesApi.getRoutines().catch((error) => {
        if (active) console.error('[offline] no se pudieron cachear las rutinas', error)
      })
    }

    warm()
    window.addEventListener('online', warm)

    return () => {
      active = false
      window.removeEventListener('online', warm)
    }
  }, [])
}
