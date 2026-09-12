import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GreenCard } from '@/design-system/components/GreenCard'
import { GreenButton } from '@/design-system/components/GreenButton'
import { PageBackdrop } from '@/design-system/components/PageBackdrop'
import { PageHeader } from '@/design-system/components/PageHeader'
import { SectionHeader } from '@/design-system/components/SectionHeader'
import { analyticsApi } from '@/services/api/analytics.api'
import { useProgression } from '../../strength/hooks/useProgression'
import type { ProgressionRecommendation } from '../../strength/lib/progression'
import type { StrengthAnalytics } from '@/services/api/analytics.api'
import AnalysisTabs from '../components/AnalysisTabs'

export default function StrengthAnalysis() {
  const navigate = useNavigate()
  const [data, setData] = useState<StrengthAnalytics | null>(null)
  const [activeChip, setActiveChip] = useState<'technical' | 'physical' | 'sparring'>('physical')
  const { routines, recommendations, loading: progressionLoading } = useProgression()

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await analyticsApi.getStrengthAnalytics()
        setData(result)
      } catch (e) {
        console.error('Error loading strength analytics:', e)
      }
    }
    fetchData()
  }, [])

  const weeklyBars = ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((label, i) => {
    const vol = data?.volumeByWeek[i]
    return { label, height: vol ? Math.min(Math.round(vol.load / 500), 100) : 0 }
  })

  const totalVolume = data?.volumeByWeek.reduce((s, w) => s + w.load, 0) ?? 0
  const prCount = data?.prs.length ?? 0
  const avgDaily = weeklyBars.length > 0 ? Math.round(totalVolume / weeklyBars.length) : 0
  const weeks = data?.volumeByWeek ?? []
  const prevVolume = weeks.length > 1 ? weeks[weeks.length - 2].load : 0
  const lastVolume = weeks.length > 0 ? weeks[weeks.length - 1].load : 0
  const changePct = prevVolume > 0 ? Math.round(((lastVolume - prevVolume) / prevVolume) * 100) : 0
  const changeLabel = changePct >= 0 ? `+${changePct}%` : `${changePct}%`

  const prCards = (data?.prs ?? []).slice(0, 3).map((pr) => ({
    exercise: pr.exercise.toUpperCase(),
    value: pr.weight,
    unit: 'KG',
    date: new Date(pr.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase(),
  }))

  const weekLabel = data?.volumeByWeek.length ? `Semana ${data.volumeByWeek.length}` : '—'

  const recList: { name: string; rec: ProgressionRecommendation }[] = []
  for (const r of routines) {
    for (const rex of r.exercises) {
      const rec = recommendations.get(rex.id)
      if (rec) recList.push({ name: rex.exercise?.name ?? `#${rex.exerciseId}`, rec })
      if (recList.length >= 4) break
    }
    if (recList.length >= 4) break
  }

  const recBadge = (action: string, weight: number): { label: string; className: string } => {
    if (action === 'increase') return { label: `SUBIR A ${weight} KG`, className: 'text-green' }
    if (action === 'deload') return { label: `DESCARGAR A ${weight} KG`, className: 'text-acid' }
    return { label: `MANTENER ${weight} KG`, className: 'text-text-muted' }
  }

  return (
    <div className="relative min-h-screen pb-24">
      <PageBackdrop />
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="px-5 pt-6">
          <PageHeader
            kicker="CENTRO DE ANÁLISIS · FUERZA"
            title="Análisis"
            titleAccent="de Fuerza"
            subtitle="Volumen, rendimiento y recomendaciones de progresión."
            onBack={() => navigate(-1)}
            status={
              <span className="status-pill">
                <span className="status-dot bg-green" />
                {weekLabel.toUpperCase()}
              </span>
            }
          />
        </div>

        <main className="p-md pt-6 space-y-lg">
          <AnalysisTabs active="fuerza" />

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

          {data && (
            <div className="grid grid-cols-3 gap-sm">
              <GreenCard variant="default" padding="sm" effects className="relative overflow-hidden">
                <span className="gradient-hairline" />
                <span className="font-label-caps text-[9px] text-text-muted block uppercase">% vs Semana Ant.</span>
                <span className="font-label-caps text-[18px] text-text-green font-bold">{changeLabel}</span>
              </GreenCard>
              <GreenCard variant="default" padding="sm" effects>
                <span className="font-label-caps text-[9px] text-text-muted block uppercase">Vol. Promedio Día</span>
                <span className="font-label-caps text-[18px] text-green-dim font-bold">{avgDaily.toLocaleString()}</span>
              </GreenCard>
              <GreenCard variant="default" padding="sm" effects>
                <span className="font-label-caps text-[9px] text-text-muted block uppercase">Diferencia</span>
                <span className="font-label-caps text-[18px] text-acid font-bold">
                  {changePct >= 0 ? '+' : ''}{changePct}
                </span>
              </GreenCard>
            </div>
          )}

          <div>
            <div className="mb-3">
              <SectionHeader kicker="STRENGTH MATRIX" title="Personal Records" />
            </div>
            <div className="grid grid-cols-3 gap-sm">
              {prCards.length > 0 ? prCards.map((pr) => (
                <GreenCard key={pr.exercise} variant="default" padding="sm" effects className="relative overflow-hidden">
                  <span className="gradient-hairline" />
                  <span className="font-label-caps text-[9px] text-text-muted block mb-xs">{pr.exercise}</span>
                  <div className="flex items-baseline gap-xs mb-xs">
                    <span className="font-label-caps text-[28px] text-gradient-green font-bold leading-none">{pr.value}</span>
                    <span className="font-label-caps text-[9px] text-green">{pr.unit}</span>
                  </div>
                  <div className="flex items-center gap-xs text-text-muted">
                    <span className="material-symbols-outlined text-[12px]">calendar_month</span>
                    <span className="font-label-caps text-[8px]">{pr.date}</span>
                  </div>
                </GreenCard>
              )) : (
                <div className="col-span-3 font-label-caps text-sm text-text-muted opacity-40 text-center py-6">
                  SIN PRs REGISTRADOS
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-3">
              <SectionHeader kicker="PROGRESSION ENGINE" title="Recomendaciones de Peso" />
            </div>
            <div className="space-y-sm">
              {progressionLoading ? (
                <div className="font-label-caps text-sm text-text-muted opacity-40 text-center py-6">CARGANDO…</div>
              ) : recList.length > 0 ? (
                recList.map((item) => {
                  const badge = recBadge(item.rec.action, item.rec.suggestedWeight)
                  return (
                    <GreenCard key={item.name} variant="default" padding="sm" effects className="relative overflow-hidden">
                      <span className="gradient-hairline" />
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="min-w-0">
                          <p className="font-label-caps text-xs text-text-green font-bold truncate">{item.name}</p>
                          <p className="font-label-caps text-[9px] text-text-muted">
                            {item.rec.targetSets} × {item.rec.targetRepsMin}-{item.rec.targetRepsMax} · actual {item.rec.currentWeight} kg
                          </p>
                        </div>
                        <span className={`font-label-caps text-xs ${badge.className} font-bold`}>{badge.label}</span>
                      </div>
                      <p className="font-label-sm text-[11px] text-text-muted leading-relaxed mt-xs">{item.rec.reason}</p>
                    </GreenCard>
                  )
                })
              ) : (
                <div className="font-label-caps text-sm text-text-muted opacity-40 text-center py-6">
                  SIN RUTINA CONFIGURADA
                </div>
              )}
            </div>
          </div>

          <GreenCard padding="md" effects className="relative overflow-hidden">
            <span className="gradient-hairline" />
            <div className="mb-4">
              <SectionHeader kicker="LOAD INTENSITY" title="Volumen Semanal" />
            </div>
            <div className="flex items-end justify-between gap-xs h-40">
              {weeklyBars.map((bar, i) => (
                <div key={bar.label} className="flex flex-col items-center flex-1 group">
                  <div className="w-full bg-surface-container-low h-full relative rounded-t-sm">
                    <div
                      className={`absolute bottom-0 w-full transition-all rounded-t-sm ${
                        i === weeklyBars.length - 1
                          ? 'bg-gradient-to-t from-primary via-green to-acid shadow-[0_0_16px_color-mix(in_srgb,var(--green)_45%,transparent)]'
                          : 'bg-green/40 group-hover:bg-green/60'
                      }`}
                      style={{ height: `${bar.height}%` }}
                    />
                  </div>
                  <span
                    className={`font-label-caps text-[8px] mt-xs ${
                      i === weeklyBars.length - 1 ? 'text-green' : 'text-text-muted'
                    }`}
                  >
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-md border-t border-outline-variant/25 flex justify-between items-baseline mt-md">
              <span className="font-label-caps text-label-caps text-text-muted">TOTAL TONNAGE</span>
              <div className="flex items-baseline gap-xs">
                <span className="font-label-caps text-headline-md text-gradient-green font-bold">{totalVolume.toLocaleString()}</span>
                <span className="font-label-caps text-[10px] text-green">KG</span>
              </div>
            </div>
          </GreenCard>

          <div className="grid grid-cols-3 gap-sm">
            <GreenCard variant="default" padding="sm" effects>
              <span className="font-label-caps text-[9px] text-text-muted block uppercase">Total Volume</span>
              <span className="font-label-caps text-[18px] text-text-green font-bold">{totalVolume.toLocaleString()} KG</span>
            </GreenCard>
            <GreenCard variant="default" padding="sm" effects>
              <span className="font-label-caps text-[9px] text-text-muted block uppercase">Weeks</span>
              <span className="font-label-caps text-[18px] text-text-green font-bold">{data?.volumeByWeek.length ?? 0}</span>
            </GreenCard>
            <GreenCard variant="default" padding="sm" effects>
              <span className="font-label-caps text-[9px] text-text-muted block uppercase">PRs</span>
              <span className="font-label-caps text-[18px] text-text-green font-bold">{prCount}</span>
            </GreenCard>
          </div>
        </main>
      </div>
    </div>
  )
}