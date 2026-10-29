import { Home, Dumbbell, BarChart3, Utensils, Calendar, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

interface NavItem {
  icon: typeof Home
  label: string
  path: string
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Inicio', path: '/dashboard' },
  { icon: Dumbbell, label: 'Sesión', path: '/logging' },
  { icon: BarChart3, label: 'Análisis', path: '/analysis/strength' },
  { icon: Utensils, label: 'Nutrición', path: '/nutrition' },
  { icon: Calendar, label: 'Historial', path: '/history' },
  { icon: User, label: 'Perfil', path: '/profile' },
]

interface BottomNavProps {
  items?: NavItem[]
  className?: string
}

/**
 * Tab bar flotante para móvil, al estilo Liquid Glass de iOS: los tabs son
 * solo-icono (el nombre accesible lo aporta aria-label) y el activo se marca
 * con una cápsula de vidrio que morfea entre tabs con un spring. 6 destinos
 * caben a 320px con target táctil completo.
 */
export function BottomNav({ items = navItems, className = '' }: BottomNavProps) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      className={`fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] z-50 mx-auto flex h-16 max-w-md items-stretch rounded-3xl
        border border-outline-variant/30 bg-surface-container/60 backdrop-blur-2xl backdrop-saturate-150
        shadow-[0_16px_48px_-12px_rgba(0,0,0,0.55)]
        lg:hidden ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Refracción de la luz: brillo superior y viñeta inferior del vidrio */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.08] via-transparent to-black/[0.06]" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-5 top-0 h-px bg-white/20" />

      {items.map(({ icon: Icon, label, path }) => {
        const basePath = path.startsWith('/analysis') ? '/analysis' : path
        const isActive =
          location.pathname === path || (basePath !== '/dashboard' && location.pathname.startsWith(basePath))
        return (
          <motion.button
            key={path}
            onClick={() => navigate(path)}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className={`
              relative flex flex-1 cursor-pointer items-center justify-center rounded-[1.25rem]
              transition-colors duration-200
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
              ${isActive ? 'text-primary' : 'text-on-surface-variant'}
            `}
          >
            {isActive && (
              <motion.span
                layoutId="bottomnav-glass-pill"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="absolute inset-x-1 inset-y-1.5 rounded-[1.25rem] bg-primary/15
                  shadow-[inset_0_0_16px_color-mix(in_srgb,var(--primary)_10%,transparent)]"
              />
            )}
            <motion.span
              animate={isActive ? { scale: 1.1, y: -1 } : { scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 26 }}
              className="relative z-10 flex items-center justify-center"
            >
              <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.4 : 2} />
            </motion.span>
          </motion.button>
        )
      })}
    </nav>
  )
}
