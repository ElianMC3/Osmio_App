import type { ReactNode } from 'react'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  // Wrap with QueryClientProvider, ThemeProvider, etc. as needed
  return <>{children}</>
}
