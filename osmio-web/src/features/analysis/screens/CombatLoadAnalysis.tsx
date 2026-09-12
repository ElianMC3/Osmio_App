import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GreenCard } from '@/design-system/components/GreenCard'
import { GreenProgress } from '@/design-system/components/GreenProgress'
import { PageBackdrop } from '@/design-system/components/PageBackdrop'
import { PageHeader } from '@/design-system/components/PageHeader'
import { SectionHeader } from '@/design-system/components/SectionHeader'
import { analyticsApi } from '@/services/api/analytics.api'
import type { CombatAnalytics } from '@/services/api/analytics.api'
import AnalysisTabs from '../components/AnalysisTabs'

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
    <div className="relative min-h-screen pb-24">
      <PageBackdrop />
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="px-5 pt-6">
          <PageHeader
            kicker="CENTRO DE ANÁLISIS · COMBATE"
            title="Carga"
            titleAccent="de Combate"
            subtitle="Volumen táctico e intensidad acumulada."
            onBack={() => navigate(-1)}
            status={
              <span className="status-pill">
                <span className="status-dot bg-acid" />
                {totalRounds} ROUNDS
              </span>
            }
          />
        </div>

        <main className="p-md pt-6 space-y-lg">
          <AnalysisTabs active="carga" />

          <div className="grid grid-cols-3 gap-sm">
            <GreenCard variant="default" padding="sm" effects className="relative overflow-hidden">
              <span className="gradient-hairline" />
              <span className="font-label-caps text-[9px] text-text-muted block uppercase">% vs Semana Ant.</span>
              <span className="font-label-caps text-[18px] text-text-green font-bold">{changePct >= 0 ? '+' : ''}{changePct}%</span>
            </GreenCard>
            <GreenCard variant="default" padding="sm" effects>
              <span className="font-label-caps text-[9px] text-text-muted block uppercase">Promedio/Día</span>
              <span className="font-label-caps text-[18px] text-green-dim font-bold">{avgPerDay}</span>
            </GreenCard>
            <GreenCard variant="default" padding="sm" effects>
              <span className="font-label-caps text-[9px] text-text-muted block uppercase">Diferencia</span>
              <span className="font-label-caps text-[18px] text-acid font-bold">
                {changePct !== 0 ? (changePct >= 0 ? '+' : '') + changePct : '—'}
              </span>
            </GreenCard>
          </div>

          <div className="flex items-center gap-md flex-wrap">
            <div className="flex items-center gap-xs">
              <span className="w-3 h-3 bg-green rounded-[3px]" />
              <span className="font-label-sm text-label-sm text-text-green">STRIKING</span>
            </div>
            <div className="flex items-center gap-xs">
              <span className="w-3 h-3 bg-outline rounded-[3px]" />
              <span className="font-label-sm text-label-sm text-text-green">GRAPPLING</span>
            </div>
            <div className="flex items-center gap-xs ml-auto">
              <span className="w-3 h-0.5 bg-acid" />
              <span className="font-label-sm text-label-sm text-text-green">INTENSIDAD (1-10)</span>
            </div>
          </div>

          <GreenCard padding="md" effects className="relative overflow-hidden">
            <span className="gradient-hairline" />
            <SectionHeader kicker="VOLUMEN TÁCTICO" title="Rounds por Semana" />
            <div className="flex items-end justify-between gap-md h-48 mt-md">
              {weeklyData.map((d) => {
                const strikingH = (d.striking / maxRounds) * 100
                const grapplingH = (d.grappling / maxRounds) * 100
                return (
                  <div key={d.label} className="flex-1 flex flex-col justify-end items-center gap-1 group">
                    <div className="flex flex-col gap-unit w-full items-center">
                      <div
                        className="w-10 bg-outline group-hover:opacity-100 transition-opacity rounded-t-sm"
                        style={{ height: `${grapplingH}%`, minHeight: d.grappling > 0 ? 8 : 0 }}
                      />
                      <div
                        className="w-10 bg-gradient-to-t from-primary via-green to-acid group-hover:opacity-100 transition-opacity rounded-t-sm shadow-[0_0_10px_color-mix(in_srgb,var(--green)_30%,transparent)]"
                        style={{ height: `${strikingH}%`, minHeight: d.striking > 0 ? 8 : 0 }}
                      />
                    </div>
                    <span className="font-label-caps text-label-caps mt-sm text-text-muted">{d.label}</span>
                  </div>
                )
              })}
            </div>
          </GreenCard>

          <div className="grid grid-cols-3 gap-sm">
            <GreenCard variant="default" padding="sm" effects>
              <span className="font-label-caps text-[9px] text-text-muted block uppercase">Total Rounds</span>
              <span className="font-label-caps text-[18px] text-text-green font-bold">{totalRounds}</span>
              <span className="font-label-caps text-[8px] text-text-green-dim">{changePct >= 0 ? '+' : ''}{changePct}% vs prev.</span>
            </GreenCard>
            <GreenCard variant="default" padding="sm" effects>
              <span className="font-label-caps text-[9px] text-text-muted block uppercase">Weeks</span>
              <span className="font-label-caps text-[18px] text-text-green font-bold">{data?.roundsByWeek.length ?? 0}</span>
            </GreenCard>
            <GreenCard variant="default" padding="sm" effects>
              <span className="font-label-caps text-[9px] text-text-muted block uppercase">Striking</span>
              <span className="font-label-caps text-[18px] text-text-green font-bold">{strikingTotal}</span>
            </GreenCard>
          </div>

          <GreenCard padding="md" effects className="relative overflow-hidden">
            <span className="gradient-hairline" />
            <SectionHeader kicker="DISTRIBUCIÓN" title="Sparring vs Técnica" />
            <div className="space-y-md mt-md">
              <div>
                <div className="flex justify-between items-end mb-xs">
                  <div>
                    <span className="font-label-sm text-label-sm text-text-muted block uppercase">Striking</span>
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
                    <span className="font-label-sm text-label-sm text-text-muted block uppercase">Grappling</span>
                    <span className="font-label-caps text-data-display text-text-green">
                      {grapplingTotal} <span className="text-xs font-normal">Rnds</span>
                    </span>
                  </div>
                  <span className="font-label-caps text-label-caps text-green-dim">{grapplingPct}%</span>
                </div>
                <GreenProgress value={grapplingPct} size="sm" effects />
              </div>
            </div>
            <div className="mt-md p-sm border-l-2 border-acid/40 bg-surface-container-low/60 italic text-sm text-text-muted rounded-r-lg">
              {data ? `Carga total: ${totalRounds} rounds (Striking ${strikingPct}% / Grappling ${grapplingPct}%)` : 'Cargando datos...'}
            </div>
          </GreenCard>

          <div className="grid grid-cols-1 gap-sm">
            <GreenCard variant="default" padding="md" effects className="relative overflow-hidden">
              <span className="gradient-hairline" />
              <div className="flex items-center gap-md">
                <div className="p-md rounded-full border border-outline-variant/30 bg-gradient-to-br from-green/[0.12] to-transparent text-green shadow-[0_0_18px_color-mix(in_srgb,var(--green)_20%,transparent)]">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>bolt</span>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-text-muted">INTENSIDAD PICO</p>
                  <p className="font-headline-md text-headline-md text-gradient-green">—</p>
                  <p className="font-label-sm text-label-sm text-text-muted">Registra sesiones para ver datos</p>
                </div>
              </div>
            </GreenCard>
            <GreenCard variant="default" padding="md" effects className="relative overflow-hidden">
              <span className="gradient-hairline" />
              <div className="flex items-center gap-md">
                <div className="p-md rounded-full border border-outline-variant/30 bg-gradient-to-br from-green/[0.12] to-transparent text-green-dim shadow-[0_0_18px_color-mix(in_srgb,var(--outline)_20%,transparent)]">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>timer</span>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-text-muted">TOTAL ROUNDS</p>
                  <p className="font-headline-md text-headline-md text-gradient-green">
                    {totalRounds} <span className="text-xs text-text-muted">RNDS</span>
                  </p>
                  <p className="font-label-sm text-label-sm text-green-dim">{data?.roundsByWeek.length ?? 0} semanas registradas</p>
                </div>
              </div>
            </GreenCard>
            <GreenCard variant="default" padding="md" effects className="relative overflow-hidden">
              <span className="gradient-hairline" />
              <div className="flex items-center gap-md">
                <div className="p-md rounded-full border border-outline-variant/30 bg-gradient-to-br from-acid/[0.14] to-transparent text-acid shadow-[0_0_18px_color-mix(in_srgb,var(--acid)_20%,transparent)]">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>history</span>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-text-muted">PROMEDIO/SEMANA</p>
                  <p className="font-headline-md text-headline-md text-gradient-green">
                    {data?.roundsByWeek.length ? Math.round(totalRounds / data.roundsByWeek.length) : 0} <span className="text-xs text-text-muted">RNDS</span>
                  </p>
                  <p className="font-label-sm text-label-sm text-green-dim">Últimas {data?.roundsByWeek.length || 0} semanas</p>
                </div>
              </div>
            </GreenCard>
          </div>
        </main>
      </div>
    </div>
  )
}