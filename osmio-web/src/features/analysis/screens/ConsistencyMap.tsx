import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReducedMotion } from 'motion/react'
import { Skeleton } from 'boneyard-js/react'
import {
  HeatmapCells,
  HeatmapChart,
  HeatmapInteractionBoundary,
  HeatmapInteractionProvider,
  HeatmapLegend,
  HeatmapTooltip,
  HeatmapXAxis,
  HeatmapYAxis,
} from '@/components/charts/heatmap'
import { GreenCard } from '@/design-system/components/GreenCard'
import { GreenProgress } from '@/design-system/components/GreenProgress'
import { PageBackdrop } from '@/design-system/components/PageBackdrop'
import { PageHeader } from '@/design-system/components/PageHeader'
import { analyticsApi } from '@/services/api/analytics.api'
import { buildConsistencyHeatmap } from '@/shared/utils/heatmap'
import AnalysisTabs from '../components/AnalysisTabs'
import { ConsistencyMapSkeletonFixture, StatusPillBone } from '@/design-system/skeletons/fixtures'

export default function ConsistencyMap() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const today = useMemo(() => new Date(), [])
  const [consistency, setConsistency] = useState<{ date: string; active: boolean }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await analyticsApi.getConsistency()
        setConsistency(data)
      } catch (e) {
        console.error('Error loading consistency:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const heatmapData = useMemo(
    () => buildConsistencyHeatmap(consistency, today, 20),
    [consistency, today],
  )

  const totalActive = consistency.filter((c) => c.active).length
  const totalDays = consistency.length || 1
  const compliancePct = Math.round((totalActive / Math.min(totalDays, 365)) * 100)

  let currentStreak = 0
  let bestStreak = 0
  let streak = 0
  for (let i = consistency.length - 1; i >= 0; i--) {
    if (consistency[i].active) streak++
    else break
  }
  currentStreak = streak
  for (let i = 0; i < consistency.length; i++) {
    if (consistency[i].active) {
      streak++
      bestStreak = Math.max(bestStreak, streak)
    } else {
      streak = 0
    }
  }
  bestStreak = Math.max(bestStreak, currentStreak)

  const stats = [
    { label: 'TOTAL SESIONES', value: String(totalActive) },
    { label: 'DÍAS REGISTRADOS', value: String(totalDays) },
    { label: 'CONSISTENCIA', value: `${compliancePct}%` },
    { label: 'MEJOR RACHA', value: `${bestStreak} DÍAS` },
  ]

  const disciplines = [
    { label: 'ACTIVOS', pct: compliancePct },
    { label: 'INACTIVOS', pct: 100 - compliancePct },
  ]

  return (
    <div className="relative min-h-dvh pb-[calc(7.25rem+env(safe-area-inset-bottom,0px))]">
      <PageBackdrop />
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="px-5 pt-6">
          <PageHeader
            kicker="CENTRO DE ANÁLISIS · CONSISTENCIA"
            title="Mapa de"
            titleAccent="Consistencia"
            subtitle="Tu patrón de entrenamiento a lo largo del tiempo."
            onBack={() => navigate(-1)}
            status={
              loading ? (
                <StatusPillBone />
              ) : (
                <span className="status-pill">
                  <span className="status-dot bg-green" />
                  {consistency.length} DÍAS
                </span>
              )
            }
          />
        </div>

        <main className="p-md pt-6 space-y-lg">
          <AnalysisTabs active="consistencia" />
          <Skeleton
            name="consistency-map"
            loading={loading}
            select="viewport"
            transition={180}
            className="block"
            fixture={<ConsistencyMapSkeletonFixture />}
            fallback={<ConsistencyMapSkeletonFixture />}
          >
            {loading ? null : (
            <div className="space-y-lg">

          <p className="font-label-caps text-[10px] text-text-muted uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-acid inline-block rotate-45" />
            {consistency.length} días registrados
          </p>

          <GreenCard padding="md" className="relative overflow-hidden">
            <span className="gradient-hairline" />
            <div className="flex items-center gap-sm mb-md">
              <span className="material-symbols-outlined text-green" style={{ fontVariationSettings: '"FILL" 1' }}>calendar_view_month</span>
              <h3 className="font-label-caps text-text-green">VOLUMEN DE ENTRENAMIENTO</h3>
            </div>

            {consistency.length > 0 ? (
              <div className="overflow-x-auto scrollbar-thin pb-sm">
                <HeatmapInteractionProvider>
                  <HeatmapInteractionBoundary className="min-w-[480px]">
                    <HeatmapChart
                      data={heatmapData}
                      weekStartDay={1}
                      layout="fluid"
                      cellHeight={28}
                      gap={3}
                      margin={{ top: 24, right: 0, bottom: 0, left: 32 }}
                      animate={!reduceMotion}
                      animationDuration={reduceMotion ? 0 : 900}
                    >
                      <HeatmapCells cornerRadius={3} />
                      <HeatmapXAxis className="font-label-caps text-[8px] text-text-muted uppercase" />
                      <HeatmapYAxis
                        tickFilter="odd"
                        labelFormat="full"
                        className="font-label-caps text-[8px] text-text-muted uppercase"
                      />
                      <HeatmapTooltip
                        formatHeader={(date) =>
                          date.toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        }
                        formatWeekday={(date) =>
                          date.toLocaleDateString('es-ES', { weekday: 'long' })
                        }
                        formatLabel={(count) =>
                          count > 0 ? 'Día activo' : 'Sin actividad'
                        }
                      />
                    </HeatmapChart>
                    <div className="mt-sm flex justify-end">
                      <HeatmapLegend
                        lessLabel="MENOS"
                        moreLabel="MÁS"
                        cellSize={10}
                        fontSize={8}
                        labelClassName="font-label-caps text-[8px] text-text-muted uppercase"
                      />
                    </div>
                  </HeatmapInteractionBoundary>
                </HeatmapInteractionProvider>
              </div>
            ) : (
              <div className="py-6 text-center font-label-caps text-sm text-text-muted opacity-40">
                SIN DATOS DE CONSISTENCIA
              </div>
            )}
          </GreenCard>

          <div className="grid grid-cols-2 gap-sm">
            <GreenCard variant="default" padding="md"  className="relative overflow-hidden">
              <span className="gradient-hairline" />
              <div className="flex flex-col justify-center relative">
                <div className="absolute top-0 right-0 p-sm opacity-20">
                  <span className="material-symbols-outlined text-green text-[32px]" style={{ fontVariationSettings: '"FILL" 1' }}>local_fire_department</span>
                </div>
                <span className="font-label-caps text-text-muted mb-xs">RACHA ACTUAL</span>
                <div className="flex items-baseline gap-xs">
                  <span className="font-label-caps text-[36px] text-gradient-green leading-none">{currentStreak}</span>
                  <span className="font-headline-md text-text-green">DÍAS</span>
                </div>
                <p className="text-[10px] text-text-muted mt-xs">
                  Nivel: <span className="text-green">{currentStreak > 10 ? 'Alto' : currentStreak > 4 ? 'Medio' : 'Bajo'}</span>
                </p>
              </div>
            </GreenCard>

            <GreenCard variant="default" padding="md"  className="border-l-4 border-l-green relative overflow-hidden">
              <span className="gradient-hairline" />
              <div className="flex flex-col justify-center">
                <span className="font-label-caps text-text-muted mb-xs">MEJOR MARCA</span>
                <div className="flex items-baseline gap-xs">
                  <span className="font-label-caps text-[36px] text-gradient-green leading-none">{bestStreak}</span>
                  <span className="font-headline-md text-text-muted">DÍAS</span>
                </div>
                <p className="text-[10px] text-text-muted mt-xs">{consistency.length} días registrados</p>
              </div>
            </GreenCard>
          </div>

          <GreenCard padding="md"  className="relative overflow-hidden">
            <span className="gradient-hairline" />
            <div className="flex justify-between items-center mb-md">
              <span className="font-label-caps text-text-muted">CUMPLIMIENTO GENERAL</span>
              <span className="material-symbols-outlined text-green" style={{ fontVariationSettings: '"FILL" 1' }}>track_changes</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 flex items-center justify-center" role="progressbar" aria-valuenow={compliancePct} aria-valuemin={0} aria-valuemax={100} aria-label={`Cumplimiento: ${compliancePct}%`}>
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-surface-container-low" cx="80" cy="80" fill="transparent" r="68" stroke="currentColor" strokeWidth="10" />
                  <circle
                    className="text-green transition-all duration-1000 ease-out"
                    cx="80"
                    cy="80"
                    fill="transparent"
                    r="68"
                    stroke="currentColor"
                    strokeDasharray={2 * Math.PI * 68}
                    strokeDashoffset={2 * Math.PI * 68 * (1 - compliancePct / 100)}
                    strokeLinecap="square"
                    strokeWidth="10"
                    style={{ filter: 'drop-shadow(0 0 6px color-mix(in srgb, var(--green) 60%, transparent))' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-label-caps text-[36px] text-text-green leading-none">
                    {compliancePct}<span className="text-headline-md">%</span>
                  </span>
                  <span className="font-label-caps text-[9px] text-text-muted mt-xs">
                    {compliancePct > 70 ? 'META ALCANZADA' : 'EN PROGRESO'}
                  </span>
                </div>
              </div>
              <div className="w-full grid grid-cols-2 gap-sm mt-md">
                <GreenCard variant="default" padding="sm" >
                  <p className="font-label-caps text-[8px] text-text-muted">RACHA ACTUAL</p>
                  <p className="font-label-caps text-sm text-text-green">{currentStreak} DÍAS</p>
                </GreenCard>
                <GreenCard variant="default" padding="sm" >
                  <p className="font-label-caps text-[8px] text-text-muted">MEJOR RACHA</p>
                  <p className="font-label-caps text-sm text-green">▲ {bestStreak} DÍAS</p>
                </GreenCard>
              </div>
            </div>
          </GreenCard>

          <GreenCard variant="glass" padding="md"  className="relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[100px]">psychology</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-sm mb-md">
                <span className="material-symbols-outlined text-green" style={{ fontVariationSettings: '"FILL" 1' }}>lightbulb</span>
                <h3 className="font-label-caps font-bold text-green">ANALYSIS_INSIGHT</h3>
              </div>
              <p className="font-headline-md mb-md italic leading-tight text-text-green">
                {consistency.length > 0
                  ? `Llevas un ${compliancePct}% de consistencia con una racha actual de ${currentStreak} días.`
                  : 'Registra entrenamientos para ver tu análisis de consistencia.'}
              </p>
              <p className="text-sm font-medium opacity-80 border-t border-outline-variant/25 pt-md text-text-muted">
                {totalActive} días activos de {totalDays} días registrados.
              </p>
            </div>
          </GreenCard>

          <GreenCard padding="md"  className="relative overflow-hidden">
            <span className="gradient-hairline" />
            <h4 className="font-label-caps text-text-green mb-md">DISTRIBUCIÓN DE ACTIVIDAD</h4>
            <div className="space-y-sm">
              {disciplines.map((item) => (
                <GreenProgress key={item.label} value={item.pct} label={item.label} showValue size="sm" />
              ))}
            </div>
          </GreenCard>

          <div className="grid grid-cols-2 gap-sm pt-md border-t border-outline-variant/25">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-label-caps text-[9px] text-text-muted">{stat.label}</p>
                <p className={'font-label-caps text-headline-md text-text-green'}>{stat.value}</p>
              </div>
            ))}
          </div>
            </div>
            )}
          </Skeleton>
        </main>
      </div>
    </div>
  )
}