import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GreenCard } from '@/design-system/components/GreenCard'
import { GreenProgress } from '@/design-system/components/GreenProgress'
import { analyticsApi } from '@/services/api/analytics.api'
import type { CombatAnalytics } from '@/services/api/analytics.api'

export default function CombatLoadAnalysis() {
  const navigate = useNavigate()
  const [data, setData] = useState<CombatAnalytics | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await analyticsApi.getCombatAnalytics()
        setData(result)
      } catch (e) {
        console.error('Error loading combat analytics:', e)
      }
    }
    fetchData()
  }, [])

  const weeklyData = (data?.roundsByWeek ?? []).slice(-4).map((w, i) => ({
    label: `SEM ${String(i + 1).padStart(2, '0')}`,
    striking: w.striking,
    grappling: w.grappling,
  }))

  const maxRounds = Math.max(1, ...weeklyData.map((d) => d.striking + d.grappling))
  const totalRounds = (data?.totalRounds.striking ?? 0) + (data?.totalRounds.grappling ?? 0)
  const avgPerDay = weeklyData.length > 0 ? Math.round(totalRounds / (weeklyData.length * 7)) : 0
  const roundsByWeek = data?.roundsByWeek ?? []
  const prev = roundsByWeek.length > 1 ? roundsByWeek[roundsByWeek.length - 2] : null
  const prevStriking = prev?.striking ?? 0
  const prevGrappling = prev?.grappling ?? 0
  const prevTotal = prevStriking + prevGrappling
  const changePct = prevTotal > 0 ? Math.round(((totalRounds - prevTotal) / prevTotal) * 100) : 0
  const strikingTotal = data?.totalRounds.striking ?? 0
  const grapplingTotal = data?.totalRounds.grappling ?? 0
  const strikingPct = totalRounds > 0 ? Math.round((strikingTotal / totalRounds) * 100) : 50
  const grapplingPct = totalRounds > 0 ? Math.round((grapplingTotal / totalRounds) * 100) : 50

  return (
    <div className="min-h-screen pb-20">
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
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-sm">
          <GreenCard variant="default" padding="sm" effects>
            <span className="font-label-caps text-[9px] text-text-muted block uppercase">
              % vs Semana Ant.
            </span>
            <span className="font-label-caps text-[18px] text-green">
              {changePct >= 0 ? '+' : ''}{changePct}%
            </span>
          </GreenCard>
          <GreenCard variant="default" padding="sm" effects>
            <span className="font-label-caps text-[9px] text-text-muted block uppercase">
              Promedio/Día
            </span>
            <span className="font-label-caps text-[18px] text-green-dim">
              {avgPerDay}
            </span>
          </GreenCard>
          <GreenCard variant="default" padding="sm" effects>
            <span className="font-label-caps text-[9px] text-text-muted block uppercase">
              Diferencia
            </span>
            <span className="font-label-caps text-[18px] text-acid">
              {changePct !== 0 ? (changePct >= 0 ? '+' : '') + changePct : '—'}
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
              {totalRounds}
            </span>
            <span className="font-label-caps text-[8px] text-green-dim">
              {changePct >= 0 ? '+' : ''}{changePct}% vs prev.
            </span>
          </GreenCard>
          <GreenCard variant="default" padding="sm" effects>
            <span className="font-label-caps text-[9px] text-text-muted block uppercase">
              Weeks
            </span>
            <span className="font-label-caps text-[18px] text-green">
              {data?.roundsByWeek.length ?? 0}
            </span>
          </GreenCard>
          <GreenCard variant="default" padding="sm" effects>
            <span className="font-label-caps text-[9px] text-text-muted block uppercase">
              Striking
            </span>
            <span className="font-label-caps text-[18px] text-green">
              {strikingTotal}
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
                    Striking
                  </span>
                  <span className="font-label-caps text-data-display text-text-green">
                    {strikingTotal} <span className="text-xs font-normal">Rnds</span>
                  </span>
                </div>
                <span className="font-label-caps text-label-caps text-green">{strikingPct}%</span>
              </div>
              <GreenProgress value={strikingPct} size="sm" effects />
            </div>
            <div>
              <div className="flex justify-between items-end mb-xs">
                <div>
                  <span className="font-label-sm text-label-sm text-text-muted block uppercase">
                    Grappling
                  </span>
                  <span className="font-label-caps text-data-display text-text-green">
                    {grapplingTotal} <span className="text-xs font-normal">Rnds</span>
                  </span>
                </div>
                <span className="font-label-caps text-label-caps text-green-dim">{grapplingPct}%</span>
              </div>
              <GreenProgress value={grapplingPct} size="sm" effects />
            </div>
          </div>
          <div className="mt-md p-sm border-l-2 border-green/20 bg-panel/50 italic text-sm text-text-muted">
            {data ? `Carga total: ${totalRounds} rounds (Striking ${strikingPct}% / Grappling ${grapplingPct}%)` : 'Cargando datos...'}
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
                <p className="font-headline-md text-headline-md text-text-green">—</p>
                <p className="font-label-sm text-label-sm text-text-muted">Registra sesiones para ver datos</p>
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
                  TOTAL ROUNDS
                </p>
                <p className="font-headline-md text-headline-md text-text-green">
                  {totalRounds} <span className="text-xs text-text-muted">RNDS</span>
                </p>
                <p className="font-label-sm text-label-sm text-green-dim">
                  {data?.roundsByWeek.length ?? 0} semanas registradas
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
                  PROMEDIO/SEMANA
                </p>
                <p className="font-headline-md text-headline-md text-text-green">
                  {data?.roundsByWeek.length ? Math.round(totalRounds / data.roundsByWeek.length) : 0} <span className="text-xs text-text-muted">RNDS</span>
                </p>
                <p className="font-label-sm text-label-sm text-green-dim">
                  Últimas {data?.roundsByWeek.length || 0} semanas
                </p>
              </div>
            </div>
          </GreenCard>
        </div>
      </div>

    </div>
  )
}
