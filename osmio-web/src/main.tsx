import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { configureBoneyard } from 'boneyard-js/react'
import { registerSW } from 'virtual:pwa-register'
import 'lenis/dist/lenis.css'
import './index.css'
import './bones/registry'
import { initTheme } from './design-system/theme'
import { toast } from './design-system/toast'
import App from './app/App'

// boneyard inyecta el shimmer como `animation` inline; la clase permite que
// `prefers-reduced-motion` lo apague desde index.css.
configureBoneyard({ boneClass: 'boneyard-bone' })

initTheme()

/**
 * Service worker (PWA). `immediate` para que la primera visita ya deje el app
 * shell en caché — si esperamos a `load`, una instalación desde la tab bar
 * puede quedarse sin caché. `registerType: 'prompt'` en vite.config: la versión
 * nueva espera a que el usuario acepte, así no se recarga en medio de una serie.
 */
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    toast.info('Nueva versión de Osmio', 'Actualiza para cargar los últimos cambios.', {
      duration: 15000,
      action: { label: 'Actualizar', onClick: () => void updateSW(true) },
    })
  },
  onRegisterError(error) {
    console.error('[pwa] no se pudo registrar el service worker', error)
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
