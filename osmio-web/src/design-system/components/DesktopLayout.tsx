import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'

interface DesktopLayoutProps {
  children: ReactNode
  hideBottomNav?: boolean
}

export function DesktopLayout({ children, hideBottomNav = false }: DesktopLayoutProps) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <main className="lg:ml-64 pt-16 pb-32 lg:pb-8 px-4 md:px-6 lg:px-8 max-w-[1440px] mx-auto">
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  )
}
