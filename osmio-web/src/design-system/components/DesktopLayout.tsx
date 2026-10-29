import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Header } from './Header'
import { FloatingActions } from './FloatingActions'

interface DesktopLayoutProps {
  children: ReactNode
  hideBottomNav?: boolean
  hideHeader?: boolean
}

export function DesktopLayout({ children, hideBottomNav = false, hideHeader = false }: DesktopLayoutProps) {
  return (
    <div className="min-h-dvh bg-surface relative">
      {!hideHeader && (
        <>
          <Header />
          <FloatingActions />
        </>
      )}
      <Sidebar />
      <main
        className={`lg:ml-72 max-w-[1440px] mx-auto min-h-dvh px-4 sm:px-6 lg:px-8
          ${!hideHeader ? 'pt-[calc(3.75rem+env(safe-area-inset-top,0px))] lg:pt-[calc(5rem+env(safe-area-inset-top,0px))]' : 'pt-[calc(1.5rem+env(safe-area-inset-top,0px))]'}
          pb-[calc(8.25rem+env(safe-area-inset-bottom,0px))] lg:pb-12`}
      >
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  )
}
