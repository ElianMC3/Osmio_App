import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
            Análisis - Carga de Combate
          </h1>
          <span className="font-label-caps text-[10px] text-on-surface-variant">
            Volumen táctico & intensidad acumulada
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
              tab.key === 'carga'
                ? 'text-primary-fixed border-b-2 border-primary-fixed'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-md space-y-lg">
        {/* Time Range Selector */}
        <div className="flex gap-xs bg-surface-container-low p-unit border border-outline-variant">
          {([
            { key: '7d', label: '7 Días' },
            { key: '4w', label: 'Últimas 4 Semanas' },
            { key: '3m', label: '3 Meses' },
          ] as const).map((opt) => (
            <button
              key={opt.key}
              onClick={() => setTimeRange(opt.key)}
              className={`px-md py-xs font-label-sm text-label-sm transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                timeRange === opt.key
                  ? 'bg-primary-fixed text-on-primary font-bold'
                  : 'text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-sm">
          <div className="bg-surface-container-low border-l-2 border-primary-fixed p-sm">
            <span className="font-label-caps text-[9px] text-on-surface-variant block uppercase">
              % vs Semana Ant.
            </span>
            <span className="font-data-display text-[18px] text-primary-fixed">
              +18%
            </span>
          </div>
          <div className="bg-surface-container-low border-l-2 border-secondary p-sm">
            <span className="font-label-caps text-[9px] text-on-surface-variant block uppercase">
              Promedio/Día
            </span>
            <span className="font-data-display text-[18px] text-secondary">
              10.2
            </span>
          </div>
          <div className="bg-surface-container-low border-l-2 border-tertiary p-sm">
            <span className="font-label-caps text-[9px] text-on-surface-variant block uppercase">
              Diferencia
            </span>
            <span className="font-data-display text-[18px] text-tertiary">
              +6.4
            </span>
          </div>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center gap-md flex-wrap">
          <div className="flex items-center gap-xs">
            <span className="w-3 h-3 bg-primary-fixed" />
            <span className="font-label-sm text-label-sm">STRIKING</span>
          </div>
          <div className="flex items-center gap-xs">
            <span className="w-3 h-3 bg-secondary" />
            <span className="font-label-sm text-label-sm">GRAPPLING</span>
          </div>
          <div className="flex items-center gap-xs ml-auto">
            <span className="w-3 h-0.5 bg-tertiary" />
            <span className="font-label-sm text-label-sm">INTENSIDAD (1-10)</span>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-surface-container border border-outline-variant p-md">
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">
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
                      className="w-10 bg-secondary/80 group-hover:opacity-100 transition-opacity"
                      style={{ height: `${grapplingH}%`, minHeight: d.grappling > 0 ? 8 : 0 }}
                    />
                    <div
                      className="w-10 bg-primary-fixed group-hover:opacity-100 transition-opacity"
                      style={{ height: `${strikingH}%`, minHeight: d.striking > 0 ? 8 : 0 }}
                    />
                  </div>
                  <span className="font-label-caps text-label-caps mt-sm text-on-surface-variant">
                    {d.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-sm">
          <div className="bg-surface-container-low border-l-2 border-primary-fixed p-sm">
            <span className="font-label-caps text-[9px] text-on-surface-variant block uppercase">
              Total Rounds
            </span>
            <span className="font-data-display text-[18px] text-primary-fixed">
              142
            </span>
            <span className="font-label-caps text-[8px] text-primary-fixed-dim">
              +12% vs prev.
            </span>
          </div>
          <div className="bg-surface-container-low border-l-2 border-primary-fixed p-sm">
            <span className="font-label-caps text-[9px] text-on-surface-variant block uppercase">
              Sessions
            </span>
            <span className="font-data-display text-[18px] text-primary-fixed">
              28
            </span>
          </div>
          <div className="bg-surface-container-low border-l-2 border-primary-fixed p-sm">
            <span className="font-label-caps text-[9px] text-on-surface-variant block uppercase">
              PRs
            </span>
            <span className="font-data-display text-[18px] text-primary-fixed">
              2
            </span>
          </div>
        </div>

        {/* Distribution Card */}
        <div className="bg-surface-container border border-outline-variant p-md">
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-md">
            SPARRING VS TÉCNICA
          </p>
          <div className="space-y-md">
            <div>
              <div className="flex justify-between items-end mb-xs">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase">
                    Sparring Duro
                  </span>
                  <span className="font-data-display text-data-display">
                    42 <span className="text-xs font-normal">Rnds</span>
                  </span>
                </div>
                <span className="font-label-caps text-label-caps text-primary-fixed">29.5%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest">
                <div className="h-full bg-primary-fixed" style={{ width: '29.5%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-xs">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase">
                    Drills Técnicos
                  </span>
                  <span className="font-data-display text-data-display">
                    100 <span className="text-xs font-normal">Rnds</span>
                  </span>
                </div>
                <span className="font-label-caps text-label-caps text-secondary">70.5%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest">
                <div className="h-full bg-secondary" style={{ width: '70.5%' }} />
              </div>
            </div>
          </div>
          <div className="mt-md p-sm border-l-2 border-outline-variant bg-surface-container-high/50 italic text-sm text-on-surface-variant">
            "Tu volumen de grappling ha aumentado un 18% esta semana, enfocando la carga en rounds de alta intensidad."
          </div>
        </div>

        {/* Bottom Metric Cards */}
        <div className="grid grid-cols-1 gap-sm">
          <div className="bg-surface-container-low border border-outline-variant p-md flex items-center gap-md">
            <div className="p-md rounded-full border border-primary-fixed/20 bg-primary-fixed/5 text-primary-fixed">
              <span className="material-symbols-outlined text-3xl">bolt</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant">
                INTENSIDAD PICO
              </p>
              <p className="font-headline-md text-headline-md">9.2 / 10</p>
              <p className="font-label-sm text-label-sm text-error">Sesión del Jueves</p>
            </div>
          </div>
          <div className="bg-surface-container-low border border-outline-variant p-md flex items-center gap-md">
            <div className="p-md rounded-full border border-secondary/20 bg-secondary/5 text-secondary">
              <span className="material-symbols-outlined text-3xl">timer</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant">
                DURACIÓN PROMEDIO
              </p>
              <p className="font-headline-md text-headline-md">
                5:00 <span className="text-xs text-on-surface-variant">MIN/RND</span>
              </p>
              <p className="font-label-sm text-label-sm text-primary-fixed-dim">
                Intervalos Estándar
              </p>
            </div>
          </div>
          <div className="bg-surface-container-low border border-outline-variant p-md flex items-center gap-md">
            <div className="p-md rounded-full border border-tertiary/20 bg-tertiary/5 text-tertiary">
              <span className="material-symbols-outlined text-3xl">history</span>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant">
                RECUPERACIÓN INTER-ROUND
              </p>
              <p className="font-headline-md text-headline-md">
                1:00 <span className="text-xs text-on-surface-variant">MIN</span>
              </p>
              <p className="font-label-sm text-label-sm text-primary-fixed-dim">
                Consistente
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
