import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../shared/hooks/useAuth'

interface SidebarItem {
  icon: string
  label: string
  path: string
}

interface SidebarSection {
  label: string
  items: SidebarItem[]
}

const navSections: SidebarSection[] = [
  {
    label: 'Principal',
    items: [
      { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
      { icon: 'fitness_center', label: 'Entrenamiento', path: '/logging' },
      { icon: 'assignment', label: 'Mi Rutina', path: '/strength/routine' },
    ],
  },
  {
    label: 'Seguimiento',
    items: [
      { icon: 'monitoring', label: 'Análisis', path: '/analysis/strength' },
      { icon: 'restaurant', label: 'Nutrición', path: '/nutrition' },
      { icon: 'calendar_month', label: 'Historial', path: '/history' },
    ],
  },
  {
    label: 'Cuenta',
    items: [{ icon: 'person', label: 'Perfil', path: '/profile' }],
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className = '' }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    setSigningOut(true)
    setIsOpen(false)
    await logout()
    navigate('/login', { replace: true })
  }

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

  const isActivePath = (path: string) => {
    const basePath = path.startsWith('/analysis') ? '/analysis' : path
    return (
      location.pathname === path ||
      (basePath !== '/dashboard' && location.pathname.startsWith(basePath))
    )
  }

  const navContent = (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-green to-acid flex items-center justify-center shadow-[0_0_24px_color-mix(in_srgb,var(--primary)_35%,transparent)]">
          <span className="material-symbols-outlined text-xl text-on-primary" style={{ fontVariationSettings: '"FILL" 1' }}>
            fitness_center
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-data-display text-lg font-bold tracking-tight text-on-surface leading-none">OSMIO</p>
          <p className="font-label-caps text-[9px] text-on-surface-variant tracking-[0.2em] mt-1">COMBAT INTEL</p>
        </div>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 min-h-0 overflow-y-auto scrollbar-thin px-3 mt-2">
        {navSections.map((section) => (
          <div key={section.label} className="mb-1">
            <p className="font-label-caps text-[9px] text-on-surface-variant/70 tracking-[0.18em] px-3.5 pt-5 pb-2">
              {section.label.toUpperCase()}
            </p>
            <div className="space-y-1">
              {section.items.map(({ icon, label, path }) => {
                const isActive = isActivePath(path)
                return (
                  <button
                    key={`${path}-${label}`}
                    onClick={() => { navigate(path); setIsOpen(false) }}
                    aria-current={isActive ? 'page' : undefined}
                    className={`group relative flex items-center gap-3 w-full text-left px-3.5 py-2.5 rounded-xl border transition-all duration-200
                      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                      active:scale-[0.98] cursor-pointer ${
                        isActive
                          ? 'text-primary bg-primary/12 border-primary/25 shadow-[inset_0_0_20px_color-mix(in_srgb,var(--primary)_8%,transparent)]'
                          : 'text-on-surface-variant border-transparent hover:text-on-surface hover:bg-surface-container-high'
                      }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-gradient-to-b from-primary via-green to-acid" />
                    )}
                    <span
                      className="material-symbols-outlined text-[20px] shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ fontVariationSettings: isActive ? '"FILL" 1' : undefined }}
                    >
                      {icon}
                    </span>
                    <span className="font-label-caps text-xs truncate">{label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* CTA + user */}
      <div className="px-3 pt-4 space-y-3">
        <button
          onClick={() => { navigate('/logging'); setIsOpen(false) }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-primary via-green to-acid
            font-label-caps text-xs font-bold tracking-[0.18em] text-on-primary text-center
            shadow-[0_4px_24px_color-mix(in_srgb,var(--primary)_30%,transparent)]
            hover:brightness-110 active:scale-[0.98] transition-all duration-200
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
        >
          LOG WORKOUT
        </button>

        <div className="flex items-center gap-3 rounded-xl bg-surface-container/70 border border-outline-variant/20 p-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-acid flex items-center justify-center shrink-0">
            <span className="font-data-display text-sm font-bold text-on-primary uppercase">
              {(user?.email ? user.email[0] : 'O')}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-on-surface truncate leading-tight">
              {(user?.email ?? 'Invitado').split('@')[0]}
            </p>
            <p className="text-[11px] text-on-surface-variant truncate">{user?.email ?? 'Sin sesión'}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { navigate('/settings'); setIsOpen(false) }}
              aria-label="Configuración"
              title="Configuración"
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </button>
            <button
              onClick={handleLogout}
              disabled={signingOut}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors cursor-pointer disabled:opacity-50
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="material-symbols-outlined text-[18px]">{signingOut ? 'hourglass_empty' : 'logout'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="fixed top-4 left-4 z-[60] lg:hidden p-2 bg-surface-container/80 backdrop-blur-xl
          border border-outline-variant/30 rounded-xl
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
        className={`hidden lg:flex h-screen w-72 fixed left-0 top-0 z-40 p-3 pb-4 ${className}`}
        role="navigation"
        aria-label="Desktop navigation"
      >
        <div className="w-full h-full rounded-2xl bg-surface-container/70 backdrop-blur-2xl border border-outline-variant/25 shadow-2xl overflow-hidden flex flex-col">
          {navContent}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-72 rounded-r-2xl bg-surface-container/95 backdrop-blur-2xl border-r border-outline-variant/25 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${className} ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="navigation"
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        <div className="w-full h-full flex flex-col">{navContent}</div>
      </aside>
    </>
  )
}