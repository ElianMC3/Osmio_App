import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { configureBoneyard } from 'boneyard-js/react'
import 'lenis/dist/lenis.css'
import './index.css'
import './bones/registry'
import { initTheme } from './design-system/theme'
import App from './app/App'

// boneyard inyecta el shimmer como `animation` inline; la clase permite que
// `prefers-reduced-motion` lo apague desde index.css.
configureBoneyard({ boneClass: 'boneyard-bone' })

initTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
