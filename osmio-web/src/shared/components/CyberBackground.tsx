import { lazy, Suspense } from 'react'

// three.js es ~1.2 MB: se carga aparte para que el login pinte antes de que
// llegue. El gradiente de .cyber-background-fallback cubre ambos huecos: el
// chunk descargándose y la primera textura del canvas.
const CyberBackgroundCanvas = lazy(() => import('./CyberBackgroundCanvas'))

export default function CyberBackground() {
  return (
    <>
      <div className="cyber-background cyber-background-fallback" aria-hidden="true" />
      <Suspense fallback={null}>
        <CyberBackgroundCanvas />
      </Suspense>
    </>
  )
}
