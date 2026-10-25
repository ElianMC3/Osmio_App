import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

const TABS = [
  { key: 'fuerza', label: 'Fuerza', path: '/analysis/strength' },
  { key: 'carga', label: 'Carga de Combate', path: '/analysis/combat' },
  { key: 'consistencia', label: 'Consistencia', path: '/analysis/consistency' },
] as const

export default function AnalysisTabs({ active }: { active: 'fuerza' | 'carga' | 'consistencia' }) {
  const navigate = useNavigate()
  return (
    <div className="relative flex items-center gap-1 p-1 rounded-xl bg-surface-container/60 backdrop-blur-xl border border-outline-variant/30 shadow-lg shadow-black/10">
      {TABS.map((tab) => {
        const isActive = tab.key === active
        return (
          <button
            key={tab.key}
            onClick={() => navigate(tab.path)}
            className={`relative flex-1 px-md py-2 rounded-lg font-label-caps text-label-caps z-10 transition-colors duration-200 active:scale-[0.98] cursor-pointer ${
              isActive ? 'text-on-primary' : 'text-text-muted hover:text-text-green'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {isActive && (
              <motion.div
                layoutId="analysis-tab-indicator"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary via-green to-acid shadow-[0_2px_14px_color-mix(in_srgb,var(--green)_35%,transparent)]"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}