import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReducedMotion } from 'motion/react'
import { Skeleton } from 'boneyard-js/react'
import { Area, AreaChart } from '@/components/charts/area-chart'
import { Grid } from '@/components/charts/grid'
import { XAxis } from '@/components/charts/x-axis'
import { ChartTooltip } from '@/components/charts/tooltip'
import { GreenCard } from '@/design-system/components/GreenCard'
import { GreenProgress } from '@/design-system/components/GreenProgress'
import { PageBackdrop } from '@/design-system/components/PageBackdrop'
import { PageHeader } from '@/design-system/components/PageHeader'
import { SectionHeader } from '@/design-system/components/SectionHeader'
import { analyticsApi } from '@/services/api/analytics.api'
import type { CombatAnalytics } from '@/services/api/analytics.api'
import { isoWeekToDate } from '@/shared/utils/heatmap'
import AnalysisTabs from '../components/AnalysisTabs'
import { CombatLoadAnalysisSkeletonFixture, StatusPillBone } from '@/design-system/skeletons/fixtures'

export default function CombatLoadAnalysis() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [data, setData] = useState<CombatAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await analyticsApi.getCombatAnalytics()
        setData(result)
      } catch (e) {
        console.error('Error loading combat analytics:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const weeklyData = (data?.roundsByWeek ?? []).slice(-4).map((w, i) => ({
    label: `SEM ${String(i + 1).padStart(2, '0')}`,
    striking: w.striking,
    grappling: w.grappling,
  }))

  const totalRounds = (data?.totalRounds.striking ?? 0) + (data?.totalRounds.grappling ?? 0)
  const avgPerDay = weeklyData.length > 0 ? Math.round(totalRounds / (weeklyData.length * 7)) : 0
  const roundsByWeek = data?.roundsByWeek ?? []
  const combatChartData = roundsByWeek.slice(-8).map((week) => ({
    date: isoWeekToDate(week.week),
    striking: week.striking,
    grappling: week.grappling,
  }))
  const combatLabels = combatChartData.map((point) =>
    point.date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
  )
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
    <div className="relative min-h-dvh pb-[calc(7.25rem+env(safe-area-inset-bottom,0px))]">
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
              loading ? (
                <StatusPillBone />
              ) : (
                <span className="status-pill">
                  <span className="status-dot bg-acid" />
                  {totalRounds} ROUNDS
                </span>
              )
            }
          />
        </div>

        <main className="p-md pt-6 space-y-lg">
          <AnalysisTabs active="carga" />
          <Skeleton
            name="combat-load-analysis"
            loading={loading}
            select="viewport"
            transition={180}
            className="block"
            fixture={<CombatLoadAnalysisSkeletonFixture />}
            fallback={<CombatLoadAnalysisSkeletonFixture />}
          >
            {loading ? null : (
            <div className="space-y-lg">

          <div className="grid grid-cols-3 gap-sm">
            <GreenCard variant="default" padding="sm" className="relative overflow-hidden">
              <span className="gradient-hairline" />
              <span className="font-label-caps text-[9px] text-text-muted block uppercase">% vs Semana Ant.</span>
              <span className="font-label-caps text-[18px] text-text-green font-bold">{changePct >= 0 ? '+' : ''}{changePct}%</span>
            </GreenCard>
            <GreenCard variant="default" padding="sm">
              <span className="font-label-caps text-[9px] text-text-muted block uppercase">Promedio/Día</span>
              <span className="font-label-caps text-[18px] text-green-dim font-bold">{avgPerDay}</span>
            </GreenCard>
            <GreenCard variant="default" padding="sm">
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
          </div>

          <GreenCard padding="md" className="relative overflow-hidden">
            <span className="gradient-hairline" />
            <SectionHeader kicker="VOLUMEN TÁCTICO" title="Rounds por Semana" />
            {combatChartData.length > 1 ? (
              <div className="mt-md">
                <AreaChart
                  data={combatChartData}
                  xDataKey="date"
                  aspectRatio="5 / 2"
                  animationDuration={reduceMotion ? 0 : 800}
                  margin={{ top: 20, right: 16, bottom: 24, left: 16 }}
                >
                  <Grid horizontal strokeDasharray="3,5" />
                  <Area
                    dataKey="striking"
                    fill="var(--chart-line-primary)"
                    fillOpacity={0.35}
                    strokeWidth={2}
                    animate={!reduceMotion}
                  />
                  <Area
                    dataKey="grappling"
                    fill="var(--outline)"
                    stroke="var(--outline)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    animate={!reduceMotion}
                  />
                  <XAxis labels={combatLabels} numTicks={5} />
                  <ChartTooltip />
                </AreaChart>
              </div>
            ) : (
              <div className="py-8 text-center font-label-caps text-sm text-text-muted opacity-40">
                SIN DATOS DE ROUNDS
              </div>
            )}
          </GreenCard>

          <div className="grid grid-cols-3 gap-sm">
            <GreenCard variant="default" padding="sm">
              <span className="font-label-caps text-[9px] text-text-muted block uppercase">Total Rounds</span>
              <span className="font-label-caps text-[18px] text-text-green font-bold">{totalRounds}</span>
              <span className="font-label-caps text-[8px] text-text-green-dim">{changePct >= 0 ? '+' : ''}{changePct}% vs prev.</span>
            </GreenCard>
            <GreenCard variant="default" padding="sm">
              <span className="font-label-caps text-[9px] text-text-muted block uppercase">Weeks</span>
              <span className="font-label-caps text-[18px] text-text-green font-bold">{data?.roundsByWeek.length ?? 0}</span>
            </GreenCard>
            <GreenCard variant="default" padding="sm">
              <span className="font-label-caps text-[9px] text-text-muted block uppercase">Striking</span>
              <span className="font-label-caps text-[18px] text-text-green font-bold">{strikingTotal}</span>
            </GreenCard>
          </div>

          <GreenCard padding="md" className="relative overflow-hidden">
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
            <GreenCard variant="default" padding="md" className="relative overflow-hidden">
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
            <GreenCard variant="default" padding="md" className="relative overflow-hidden">
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
            <GreenCard variant="default" padding="md" className="relative overflow-hidden">
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
            </div>
            )}
          </Skeleton>
        </main>
      </div>
    </div>
  )
}