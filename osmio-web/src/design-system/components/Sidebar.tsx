import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface SidebarItem {
  icon: string
  label: string
  path: string
}

const sidebarItems: SidebarItem[] = [
  { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { icon: 'fitness_center', label: 'Entrenamiento', path: '/logging' },
  { icon: 'assignment', label: 'Mi Rutina', path: '/strength/routine' },
  { icon: 'monitoring', label: 'Análisis', path: '/analysis/strength' },
  { icon: 'restaurant', label: 'Nutrición', path: '/nutrition' },
  { icon: 'calendar_month', label: 'Historial', path: '/history' },
  { icon: 'person', label: 'Perfil', path: '/profile' },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className = '' }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const navContent = (
    <>
      <div className="px-md mb-xl">
        <h2
          className="font-data-display text-data-display text-primary cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => { navigate('/dashboard'); setIsOpen(false) }}
        >
          OSMIO
        </h2>
        <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">
          Combat Intel
        </p>
      </div>

      <nav className="flex-1 space-y-xs">
        {sidebarItems.map(({ icon, label, path }) => {
          const basePath = path.startsWith('/analysis') ? '/analysis' : path
          const isActive = location.pathname === path || (basePath !== '/dashboard' && location.pathname.startsWith(basePath))
          return (
            <button
              key={`${path}-${label}`}
              onClick={() => { navigate(path); setIsOpen(false) }}
              className={`flex items-center gap-sm w-full text-left px-4 py-3 transition-all duration-200
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                active:scale-[0.98]
                ${
                  isActive
                    ? 'text-primary border-l-4 border-primary bg-surface-container-high'
                    : 'text-on-surface-variant hover:bg-surface-bright/50'
                }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="material-symbols-outlined">{icon}</span>
              <span className="font-label-caps text-label-caps">{label}</span>
            </button>
          )
        })}
      </nav>

      <div className="px-md mt-auto">
        <button
          className="w-full py-4 bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps font-bold tracking-widest
            hover:opacity-90 active:scale-[0.98] transition-all duration-200
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={() => { navigate('/logging'); setIsOpen(false) }}
        >
          LOG WORKOUT
        </button>

        <div className="mt-lg space-y-xs">
          <a
            href="#"
            className="flex items-center gap-sm text-on-surface-variant px-4 py-2 text-label-sm
              hover:text-primary transition-colors duration-200
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="material-symbols-outlined">help</span>
            <span>Support</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-sm text-on-surface-variant px-4 py-2 text-label-sm
              hover:text-primary transition-colors duration-200
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Sign Out</span>
          </a>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="fixed top-4 left-4 z-[60] lg:hidden p-2 bg-surface-container/80 backdrop-blur-xl
          border border-outline-variant/30 rounded-lg
          hover:bg-surface-container-high transition-all duration-200
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={isOpen}
      >
        <span className="material-symbols-outlined text-on-surface">
          {isOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-scrim/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col bg-surface-container border-r border-outline-variant/20 py-lg z-40 ${className}`}
        role="navigation"
        aria-label="Desktop navigation"
      >
        {navContent}
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-surface-container w-72 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${className}`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="pt-16 pb-lg flex-1 flex flex-col">
          {navContent}
        </div>
      </aside>
    </>
  )
}
