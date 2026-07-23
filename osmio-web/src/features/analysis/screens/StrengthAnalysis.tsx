import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
type Chip = 'technical' | 'physical' | 'sparring'

const weeklyBars = [
  { label: 'L', height: 65 },
  { label: 'M', height: 80 },
  { label: 'X', height: 55 },
  { label: 'J', height: 90 },
  { label: 'V', height: 72 },
  { label: 'S', height: 45 },
  { label: 'D', height: 30 },
]

const prCards = [
  { exercise: 'SENTADILLA (BACK SQUAT)', value: '185.0', unit: 'KG', date: 'OCT 24, 2023' },
  { exercise: 'PRESS DE BANCA', value: '127.5', unit: 'KG', date: 'NOV 02, 2023' },
  { exercise: 'PESO MUERTO', value: '220.0', unit: 'KG', date: 'OCT 12, 2023' },
]

export default function StrengthAnalysis() {
  const navigate = useNavigate()
  const [activeChip, setActiveChip] = useState<Chip>('physical')

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center gap-md px-md h-14 bg-surface/80 backdrop-blur-xl border-b border-outline-variant">
        <button
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="material-symbols-outlined text-on-surface-variant hover:text-primary-fixed transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
        >
          arrow_back
        </button>
        <div className="flex flex-col">
          <h1 className="font-headline-md text-headline-md text-on-surface leading-tight">
            Análisis - Fuerza
          </h1>
          <span className="font-label-caps text-[10px] text-on-surface-variant">
            Jun 30 – Jul 06, 2026
          </span>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex items-center border-b border-outline-variant px-md">
        {([
          { key: 'fuerza', label: 'Fuerza', path: '/analysis/strength' },
          { key: 'carga', label: 'Carga de Combate', path: '/analysis/combat' },
          { key: 'consistencia', label: 'Consistencia', path: '/analysis/consistency' },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => navigate(tab.path)}
            className={`pb-sm px-md font-label-caps text-label-caps transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
              tab.key === 'fuerza'
                ? 'text-primary-fixed border-b-2 border-primary-fixed'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-md space-y-lg">
        {/* Segmented Chips */}
        <div className="flex gap-xs">
          {([
            { key: 'technical', label: 'Technical' },
            { key: 'physical', label: 'Physical' },
            { key: 'sparring', label: 'Sparring' },
          ] as const).map((chip) => (
            <button
              key={chip.key}
              onClick={() => setActiveChip(chip.key)}
              className={`px-md py-xs font-label-caps text-label-caps border transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                activeChip === chip.key
                  ? 'bg-primary-fixed/10 border-primary-fixed text-primary-fixed'
                  : 'border-outline-variant text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Summary Cards Row */}
        <div className="grid grid-cols-3 gap-sm">
          <div className="bg-surface-container-low border-l-2 border-primary-fixed p-sm">
            <span className="font-label-caps text-[9px] text-on-surface-variant block uppercase">
              % vs Semana Ant.
            </span>
            <span className="font-data-display text-[18px] text-primary-fixed">
              +12.4%
            </span>
          </div>
          <div className="bg-surface-container-low border-l-2 border-secondary p-sm">
            <span className="font-label-caps text-[9px] text-on-surface-variant block uppercase">
              Vol. Promedio Día
            </span>
            <span className="font-data-display text-[18px] text-secondary">
              3,486
            </span>
          </div>
          <div className="bg-surface-container-low border-l-2 border-tertiary p-sm">
            <span className="font-label-caps text-[9px] text-on-surface-variant block uppercase">
              Diferencia
            </span>
            <span className="font-data-display text-[18px] text-tertiary">
              +420
            </span>
          </div>
        </div>

        {/* PR Cards */}
        <div>
          <p className="font-label-caps text-label-caps text-primary-fixed/60 mb-xs">
            STRENGTH MATRIX
          </p>
          <h2 className="font-headline-md text-headline-md text-on-surface uppercase italic mb-md">
            Personal Records
          </h2>
          <div className="grid grid-cols-3 gap-sm">
            {prCards.map((pr) => (
              <div
                key={pr.exercise}
                className="bg-surface-container p-sm border border-outline-variant relative overflow-hidden group"
              >
                <span className="font-label-caps text-[9px] text-on-surface-variant block mb-xs">
                  {pr.exercise}
                </span>
                <div className="flex items-baseline gap-xs mb-xs">
                  <span className="font-data-display text-[28px] text-primary-fixed font-bold leading-none">
                    {pr.value}
                  </span>
                  <span className="font-label-caps text-[9px] text-primary-fixed">
                    {pr.unit}
                  </span>
                </div>
                <div className="flex items-center gap-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[12px]">calendar_month</span>
                  <span className="font-label-caps text-[8px]">{pr.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-surface-container border border-outline-variant p-md">
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">
            LOAD INTENSITY
          </p>
          <h3 className="font-headline-md text-headline-md text-on-surface uppercase mb-lg">
            Volumen Semanal
          </h3>
          <div className="flex items-end justify-between gap-xs h-40">
            {weeklyBars.map((bar, i) => (
              <div key={bar.label} className="flex flex-col items-center flex-1 group">
                <div className="w-full bg-outline-variant/30 h-full relative">
                  <div
                    className={`absolute bottom-0 w-full transition-all ${
                      i === weeklyBars.length - 1
                        ? 'bg-primary-fixed neon-glow'
                        : 'bg-primary-fixed/40 group-hover:opacity-100 opacity-60'
                    }`}
                    style={{ height: `${bar.height}%` }}
                  />
                </div>
                <span
                  className={`font-label-caps text-[8px] mt-xs ${
                    i === weeklyBars.length - 1
                      ? 'text-primary-fixed'
                      : 'text-on-surface-variant'
                  }`}
                >
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-md border-t border-outline-variant flex justify-between items-baseline mt-md">
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              TOTAL TONNAGE
            </span>
            <div className="flex items-baseline gap-xs">
              <span className="font-data-display text-headline-md text-primary-fixed font-bold">
                24,402
              </span>
              <span className="font-label-caps text-[10px] text-primary-fixed">KG</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-sm">
          <div className="bg-surface-container-low border-l-2 border-primary-fixed p-sm">
            <span className="font-label-caps text-[9px] text-on-surface-variant block uppercase">
              Total Volume
            </span>
            <span className="font-data-display text-[18px] text-primary-fixed">
              24,402 KG
            </span>
          </div>
          <div className="bg-surface-container-low border-l-2 border-primary-fixed p-sm">
            <span className="font-label-caps text-[9px] text-on-surface-variant block uppercase">
              Sessions
            </span>
            <span className="font-data-display text-[18px] text-primary-fixed">
              18
            </span>
          </div>
          <div className="bg-surface-container-low border-l-2 border-primary-fixed p-sm">
            <span className="font-label-caps text-[9px] text-on-surface-variant block uppercase">
              PRs
            </span>
            <span className="font-data-display text-[18px] text-primary-fixed">
              3
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}
