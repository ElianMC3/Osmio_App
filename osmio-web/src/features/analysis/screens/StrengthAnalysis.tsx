import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GreenCard } from '@/design-system/components/GreenCard'
import { GreenButton } from '@/design-system/components/GreenButton'
import { GreenProgress } from '@/design-system/components/GreenProgress'
import { GreenTag } from '@/design-system/components/GreenTag'
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
    <div className="min-h-screen bg-[#050705] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center gap-md px-md h-14 bg-panel/80 backdrop-blur-xl border-b border-green/20">
        <button
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="material-symbols-outlined text-text-muted hover:text-green transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green cursor-pointer"
        >
          arrow_back
        </button>
        <div className="flex flex-col">
          <h1 className="font-headline-md text-headline-md text-text-green leading-tight">
            Análisis - Fuerza
          </h1>
          <span className="font-label-caps text-[10px] text-text-muted">
            Jun 30 – Jul 06, 2026
          </span>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex items-center border-b border-green/20 px-md">
        {([
          { key: 'fuerza', label: 'Fuerza', path: '/analysis/strength' },
          { key: 'carga', label: 'Carga de Combate', path: '/analysis/combat' },
          { key: 'consistencia', label: 'Consistencia', path: '/analysis/consistency' },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => navigate(tab.path)}
            className={`pb-sm px-md font-label-caps text-label-caps transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green cursor-pointer ${
              tab.key === 'fuerza'
                ? 'text-green border-b-2 border-green'
                : 'text-text-muted hover:text-text-green'
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
            <GreenButton
              key={chip.key}
              variant={activeChip === chip.key ? 'primary' : 'default'}
              size="sm"
              effects
              onClick={() => setActiveChip(chip.key)}
            >
              {chip.label}
            </GreenButton>
          ))}
        </div>

        {/* Summary Cards Row */}
        <div className="grid grid-cols-3 gap-sm">
          <GreenCard variant="default" padding="sm" effects>
            <span className="font-label-caps text-[9px] text-text-muted block uppercase">
              % vs Semana Ant.
            </span>
            <span className="font-label-caps text-[18px] text-green">
              +12.4%
            </span>
          </GreenCard>
          <GreenCard variant="default" padding="sm" effects>
            <span className="font-label-caps text-[9px] text-text-muted block uppercase">
              Vol. Promedio Día
            </span>
            <span className="font-label-caps text-[18px] text-green-dim">
              3,486
            </span>
          </GreenCard>
          <GreenCard variant="default" padding="sm" effects>
            <span className="font-label-caps text-[9px] text-text-muted block uppercase">
              Diferencia
            </span>
            <span className="font-label-caps text-[18px] text-acid">
              +420
            </span>
          </GreenCard>
        </div>

        {/* PR Cards */}
        <div>
          <p className="font-label-caps text-label-caps text-green/60 mb-xs">
            STRENGTH MATRIX
          </p>
          <h2 className="font-headline-md text-headline-md text-text-green uppercase italic mb-md">
            Personal Records
          </h2>
          <div className="grid grid-cols-3 gap-sm">
            {prCards.map((pr) => (
              <GreenCard
                key={pr.exercise}
                variant="default"
                padding="sm"
                effects
              >
                <span className="font-label-caps text-[9px] text-text-muted block mb-xs">
                  {pr.exercise}
                </span>
                <div className="flex items-baseline gap-xs mb-xs">
                  <span className="font-label-caps text-[28px] text-green font-bold leading-none">
                    {pr.value}
                  </span>
                  <span className="font-label-caps text-[9px] text-green">
                    {pr.unit}
                  </span>
                </div>
                <div className="flex items-center gap-xs text-text-muted">
                  <span className="material-symbols-outlined text-[12px]">calendar_month</span>
                  <span className="font-label-caps text-[8px]">{pr.date}</span>
                </div>
              </GreenCard>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <GreenCard padding="md" effects>
          <p className="font-label-caps text-label-caps text-text-muted mb-xs">
            LOAD INTENSITY
          </p>
          <h3 className="font-headline-md text-headline-md text-text-green uppercase mb-lg">
            Volumen Semanal
          </h3>
          <div className="flex items-end justify-between gap-xs h-40">
            {weeklyBars.map((bar, i) => (
              <div key={bar.label} className="flex flex-col items-center flex-1 group">
                <div className="w-full bg-green/10 h-full relative">
                  <div
                    className={`absolute bottom-0 w-full transition-all ${
                      i === weeklyBars.length - 1
                        ? 'bg-green shadow-[0_0_8px_rgba(199,217,136,0.5)]'
                        : 'bg-green/40 group-hover:opacity-100 opacity-60'
                    }`}
                    style={{ height: `${bar.height}%` }}
                  />
                </div>
                <span
                  className={`font-label-caps text-[8px] mt-xs ${
                    i === weeklyBars.length - 1
                      ? 'text-green'
                      : 'text-text-muted'
                  }`}
                >
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-md border-t border-green/20 flex justify-between items-baseline mt-md">
            <span className="font-label-caps text-label-caps text-text-muted">
              TOTAL TONNAGE
            </span>
            <div className="flex items-baseline gap-xs">
              <span className="font-label-caps text-headline-md text-green font-bold">
                24,402
              </span>
              <span className="font-label-caps text-[10px] text-green">KG</span>
            </div>
          </div>
        </GreenCard>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-sm">
          <GreenCard variant="default" padding="sm" effects>
            <span className="font-label-caps text-[9px] text-text-muted block uppercase">
              Total Volume
            </span>
            <span className="font-label-caps text-[18px] text-green">
              24,402 KG
            </span>
          </GreenCard>
          <GreenCard variant="default" padding="sm" effects>
            <span className="font-label-caps text-[9px] text-text-muted block uppercase">
              Sessions
            </span>
            <span className="font-label-caps text-[18px] text-green">
              18
            </span>
          </GreenCard>
          <GreenCard variant="default" padding="sm" effects>
            <span className="font-label-caps text-[9px] text-text-muted block uppercase">
              PRs
            </span>
            <span className="font-label-caps text-[18px] text-green">
              3
            </span>
          </GreenCard>
        </div>
      </div>

    </div>
  )
}
