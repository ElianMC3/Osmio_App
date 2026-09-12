import { useNavigate } from 'react-router-dom'

const TABS = [
  { key: 'fuerza', label: 'Fuerza', path: '/analysis/strength' },
  { key: 'carga', label: 'Carga de Combate', path: '/analysis/combat' },
  { key: 'consistencia', label: 'Consistencia', path: '/analysis/consistency' },
] as const

export default function AnalysisTabs({ active }: { active: 'fuerza' | 'carga' | 'consistencia' }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container/60 backdrop-blur-xl border border-outline-variant/30 shadow-lg shadow-black/10">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => navigate(tab.path)}
          className={`flex-1 px-md py-2 rounded-lg font-label-caps text-label-caps transition-all duration-200 active:scale-[0.98] cursor-pointer ${
            tab.key === active
              ? 'bg-gradient-to-r from-primary via-green to-acid text-on-primary shadow-[0_2px_14px_color-mix(in_srgb,var(--green)_35%,transparent)]'
              : 'text-text-muted hover:text-text-green'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}