import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { MotionConfig } from 'motion/react'
import { SmoothScroll } from '../shared/components/SmoothScroll'
import { initTheme, type ThemeMode } from '../design-system/theme'

interface AppProvidersProps {
  children: ReactNode
}

/** Un solo <Toaster>, montado a la raíz. Reinicia si esta condición se renderiza por página. */
function AppToaster() {
  const [mode, setMode] = useState<ThemeMode>(() => initTheme().mode)

  useEffect(() => {
    const sync = (e: Event) => setMode((e as CustomEvent<{ mode: ThemeMode }>).detail.mode)
    window.addEventListener('osmio:themechange', sync)
    return () => window.removeEventListener('osmio:themechange', sync)
  }, [])

  return (
    <Toaster
      position="bottom-center"
      theme={mode}
      visibleToasts={3}
      gap={10}
      // Desktop: margen estándar. Móvil (<600px): levanta el stack por encima
      // de la tab bar flotante (~76px) y respeta la zona segura del sistema.
      offset={32}
      mobileOffset={{ bottom: 'calc(6.5rem + env(safe-area-inset-bottom, 0px))' }}
    />
  )
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>{children}</SmoothScroll>
      <AppToaster />
    </MotionConfig>
  )
}
