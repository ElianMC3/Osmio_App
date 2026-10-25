import type { ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { SmoothScroll } from '../shared/components/SmoothScroll'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  // Wrap with QueryClientProvider, ThemeProvider, etc. as needed
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>{children}</SmoothScroll>
    </MotionConfig>
  )
}
