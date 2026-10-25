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

export function BottomNav({ items = navItems, className = '' }: BottomNavProps) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      className={`fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 h-20 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/20 lg:hidden ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {items.map(({ icon: Icon, label, path }) => {
        const basePath = path.startsWith('/analysis') ? '/analysis' : path
        const isActive =
          location.pathname === path || (basePath !== '/dashboard' && location.pathname.startsWith(basePath))
        return (
          <motion.button
            key={path}
            onClick={() => navigate(path)}
            aria-label={label}
            whileTap={{ scale: 0.95 }}
            className={`
              relative flex flex-col items-center pt-2 gap-1 flex-1
              transition-colors duration-200 cursor-pointer
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
              ${isActive ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}
            `}
            aria-current={isActive ? 'page' : undefined}
          >
            {isActive && (
              <motion.span
                layoutId="bottomnav-active"
                className="absolute top-0 h-0.5 w-8 bg-gradient-to-r from-primary via-green to-acid"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <motion.span
              animate={{ scale: isActive ? 1.05 : 1, y: isActive ? -1 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex items-center justify-center"
            >
              <Icon size={22} />
            </motion.span>
            <span className="font-label-sm text-label-sm uppercase">{label}</span>
          </motion.button>
        )
      })}
    </nav>
  )
}
