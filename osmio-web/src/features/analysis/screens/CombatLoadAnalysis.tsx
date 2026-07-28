import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GreenCard } from '@/design-system/components/GreenCard'
import { GreenButton } from '@/design-system/components/GreenButton'
import { GreenProgress } from '@/design-system/components/GreenProgress'
import { GreenTag } from '@/design-system/components/GreenTag'
type TimeRange = '7d' | '4w' | '3m'

const weeklyData = [
  { label: 'SEM 01', striking: 160, grappling: 120 },
  { label: 'SEM 02', striking: 224, grappling: 96 },
  { label: 'SEM 03', striking: 128, grappling: 192 },
  { label: 'SEM 04', striking: 256, grappling: 64 },
]

const maxRounds = Math.max(...weeklyData.map((d) => d.striking + d.grappling))

export default function CombatLoadAnalysis() {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState<TimeRange>('4w')

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
            Análisis - Carga de Combate
          </h1>
          <span className="font-label-caps text-[10px] text-text-muted">
            Volumen táctico & intensidad acumulada
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
              tab.key === 'carga'
                ? 'text-green border-b-2 border-green'
                : 'text-text-muted hover:text-text-green'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-md space-y-lg">
        {/* Time Range Selector */}
        <div className="flex gap-xs">
          {([
            { key: '7d', label: '7 Días' },
            { key: '4w', label: 'Últimas 4 Semanas' },
            { key: '3m', label: '3 Meses' },
          ] as const).map((opt) => (
            <GreenButton
              key={opt.key}
              variant={timeRange === opt.key ? 'primary' : 'default'}
              size="sm"
              effects
              onClick={() => setTimeRange(opt.key)}
            >
              {opt.label}
            </GreenButton>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-sm">
          <GreenCard variant="default" padding="sm" effects>
            <span className="font-label-caps text-[9px] text-text-muted block uppercase">
              % vs Semana Ant.
            </span>
            <span className="font-label-caps text-[18px] text-green">
              +18%
            </span>
          </GreenCard>
          <GreenCard variant="default" padding="sm" effects>
            <span className="font-label-caps text-[9px] text-text-muted block uppercase">
              Promedio/Día
            </span>
            <span className="font-label-caps text-[18px] text-green-dim">
              10.2
            </span>
          </GreenCard>
          <GreenCard variant="default" padding="sm" effects>
            <span className="font-label-caps text-[9px] text-text-muted block uppercase">
              Diferencia
            </span>
            <span className="font-label-caps text-[18px] text-acid">
              +6.4
            </span>
          </GreenCard>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center gap-md flex-wrap">
          <div className="flex items-center gap-xs">
            <span className="w-3 h-3 bg-green" />
            <span className="font-label-sm text-label-sm text-text-green">STRIKING</span>
          </div>
          <div className="flex items-center gap-xs">
            <span className="w-3 h-3 bg-green-dim" />
            <span className="font-label-sm text-label-sm text-text-green">GRAPPLING</span>
          </div>
          <div className="flex items-center gap-xs ml-auto">
            <span className="w-3 h-0.5 bg-acid" />
            <span className="font-label-sm text-label-sm text-text-green">INTENSIDAD (1-10)</span>
          </div>
        </div>

        {/* Bar Chart */}
        <GreenCard padding="md" effects>
          <p className="font-label-caps text-label-caps text-text-muted mb-xs">
            VOLUMEN DE ROUNDS POR SEMANA
          </p>
          <div className="flex items-end justify-between gap-md h-48 mt-md">
            {weeklyData.map((d) => {
              const strikingH = (d.striking / maxRounds) * 100
              const grapplingH = (d.grappling / maxRounds) * 100
              return (
                <div key={d.label} className="flex-1 flex flex-col justify-end items-center gap-1 group">
                  <div className="flex flex-col gap-unit w-full items-center">
                    <div
                      className="w-10 bg-green-dim/80 group-hover:opacity-100 transition-opacity"
                      style={{ height: `${grapplingH}%`, minHeight: d.grappling > 0 ? 8 : 0 }}
                    />
                    <div
                      className="w-10 bg-green group-hover:opacity-100 transition-opacity"
                      style={{ height: `${strikingH}%`, minHeight: d.striking > 0 ? 8 : 0 }}
                    />
                  </div>
                  <span className="font-label-caps text-label-caps mt-sm text-text-muted">
                    {d.label}
                  </span>
                </div>
              )
            })}
          </div>
        </GreenCard>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-sm">
          <GreenCard variant="default" padding="sm" effects>
            <span className="font-label-caps text-[9px] text-text-muted block uppercase">
              Total Rounds
            </span>
            <span className="font-label-caps text-[18px] text-green">
              142
            </span>
            <span className="font-label-caps text-[8px] text-green-dim">
              +12% vs prev.
            </span>
          </GreenCard>
          <GreenCard variant="default" padding="sm" effects>
            <span className="font-label-caps text-[9px] text-text-muted block uppercase">
              Sessions
            </span>
            <span className="font-label-caps text-[18px] text-green">
              28
            </span>
          </GreenCard>
          <GreenCard variant="default" padding="sm" effects>
            <span className="font-label-caps text-[9px] text-text-muted block uppercase">
              PRs
            </span>
            <span className="font-label-caps text-[18px] text-green">
              2
            </span>
          </GreenCard>
        </div>

        {/* Distribution Card */}
        <GreenCard padding="md" effects>
          <p className="font-label-caps text-label-caps text-text-muted mb-md">
            SPARRING VS TÉCNICA
          </p>
          <div className="space-y-md">
            <div>
              <div className="flex justify-between items-end mb-xs">
                <div>
                  <span className="font-label-sm text-label-sm text-text-muted block uppercase">
                    Sparring Duro
                  </span>
                  <span className="font-label-caps text-data-display text-text-green">
                    42 <span className="text-xs font-normal">Rnds</span>
                  </span>
                </div>
                <span className="font-label-caps text-label-caps text-green">29.5%</span>
              </div>
              <GreenProgress value={29.5} size="sm" effects />
            </div>
            <div>
              <div className="flex justify-between items-end mb-xs">
                <div>
                  <span className="font-label-sm text-label-sm text-text-muted block uppercase">
                    Drills Técnicos
                  </span>
                  <span className="font-label-caps text-data-display text-text-green">
                    100 <span className="text-xs font-normal">Rnds</span>
                  </span>
                </div>
                <span className="font-label-caps text-label-caps text-green-dim">70.5%</span>
              </div>
              <GreenProgress value={70.5} size="sm" effects />
            </div>
          </div>
          <div className="mt-md p-sm border-l-2 border-green/20 bg-panel/50 italic text-sm text-text-muted">
            "Tu volumen de grappling ha aumentado un 18% esta semana, enfocando la carga en rounds de alta intensidad."
          </div>
        </GreenCard>

        {/* Bottom Metric Cards */}
        <div className="grid grid-cols-1 gap-sm">
          <GreenCard variant="default" padding="md" effects>
            <div className="flex items-center gap-md">
              <div className="p-md rounded-full border border-green/20 bg-green/5 text-green">
                <span className="material-symbols-outlined text-3xl">bolt</span>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-text-muted">
                  INTENSIDAD PICO
                </p>
                <p className="font-headline-md text-headline-md text-text-green">9.2 / 10</p>
                <p className="font-label-sm text-label-sm text-error">Sesión del Jueves</p>
              </div>
            </div>
          </GreenCard>
          <GreenCard variant="default" padding="md" effects>
            <div className="flex items-center gap-md">
              <div className="p-md rounded-full border border-green-dim/20 bg-green-dim/5 text-green-dim">
                <span className="material-symbols-outlined text-3xl">timer</span>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-text-muted">
                  DURACIÓN PROMEDIO
                </p>
                <p className="font-headline-md text-headline-md text-text-green">
                  5:00 <span className="text-xs text-text-muted">MIN/RND</span>
                </p>
                <p className="font-label-sm text-label-sm text-green-dim">
                  Intervalos Estándar
                </p>
              </div>
            </div>
          </GreenCard>
          <GreenCard variant="default" padding="md" effects>
            <div className="flex items-center gap-md">
              <div className="p-md rounded-full border border-acid/20 bg-acid/5 text-acid">
                <span className="material-symbols-outlined text-3xl">history</span>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-text-muted">
                  RECUPERACIÓN INTER-ROUND
                </p>
                <p className="font-headline-md text-headline-md text-text-green">
                  1:00 <span className="text-xs text-text-muted">MIN</span>
                </p>
                <p className="font-label-sm text-label-sm text-green-dim">
                  Consistente
                </p>
              </div>
            </div>
          </GreenCard>
        </div>
      </div>

    </div>
  )
}
