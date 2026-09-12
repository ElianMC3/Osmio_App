import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Header } from './Header'

interface DesktopLayoutProps {
  children: ReactNode
  hideBottomNav?: boolean
  hideHeader?: boolean
}

export function DesktopLayout({ children, hideBottomNav = false, hideHeader = false }: DesktopLayoutProps) {
  return (
    <div className="min-h-screen bg-surface relative">
      {!hideHeader && <Header />}
      <Sidebar />
      <main className={`lg:ml-72 ${!hideHeader ? 'pt-20' : 'pt-4'} pb-28 lg:pb-12 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto min-h-screen`}>
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  )
}
