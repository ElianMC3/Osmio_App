import { useEffect, useMemo, useState } from 'react'
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
import { TodayCard } from '@/features/home/components/TodayCard'
import { DashboardHoySkeletonFixture } from '@/design-system/skeletons/fixtures'
import { analyticsApi, type CombatAnalytics } from '@/services/api/analytics.api'
import { nutritionApi } from '@/services/api/nutrition.api'
import { profilesApi } from '@/services/api/profiles.api'
import { sessionsApi } from '@/services/api/sessions.api'
import type { DailyNutrition } from '@/shared/types/nutrition.types'
import type { CombatSession, StrengthSession } from '@/shared/types/session.types'
import { computeConsistencyStats, type ConsistencyEntry } from '@/shared/utils/consistency'
import { parseLocalDate, toLocalDateString } from '@/shared/utils/dateHelpers'
import { buildConsistencyHeatmap } from '@/shared/utils/heatmap'

function strengthVolume(session: StrengthSession): number {
  return session.sets.reduce((sum, set) => sum + set.weight * set.reps, 0)
}

function getFirstName(fullName?: string): string {
  return fullName?.trim().split(/\s+/)[0] ?? ''
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

/**
 * Saludo de bienvenida: foto de disciplina con degradado Apple — la imagen
 * se disuelve hacia el fondo en la parte inferior, y el saludo + nombre
 * (large title) viven sobre la zona sólida.
 */
function WelcomeHero({ name }: { name: string }) {
  return (
    <div className="relative h-44 sm:h-52 lg:h-64 overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 -mt-[calc(3.75rem+env(safe-area-inset-top,0px))] lg:-mt-[calc(5rem+env(safe-area-inset-top,0px))]">
      <img
        src="/backgrounds/discipline-fuerza.jpeg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
      />
      {/* Degradado: de imagen libre a fondo sólido, el texto asienta abajo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface"
      />
      <div className="relative flex h-full flex-col justify-end px-5 pb-4">
        <p className="text-sm font-medium text-on-surface-variant">{getGreeting()}</p>
        {name && (
          <p className="text-[28px] sm:text-[32px] leading-tight font-semibold tracking-tight text-on-surface">
            {name}
          </p>
        )}
      </div>
    </div>
  )
}

export default function DashboardHoy() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()

  const [sessions, setSessions] = useState<(StrengthSession | CombatSession)[]>([])
  const [combat, setCombat] = useState<CombatAnalytics>({
    roundsByWeek: [],
    totalRounds: { striking: 0, grappling: 0 },
  })
  const [consistency, setConsistency] = useState<ConsistencyEntry[]>([])
  const [nutrition, setNutrition] = useState<DailyNutrition | null>(null)
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const todayKey = toLocalDateString()
  const todayDate = useMemo(() => parseLocalDate(todayKey), [todayKey])

  useEffect(() => {
    let active = true

    async function fetchData() {
      try {
        const [daySessions, combatAnalytics, consistencyData, dayNutrition, profile] =
          await Promise.all([
            sessionsApi.getSessionsByDate(todayKey),
            analyticsApi.getCombatAnalytics(),
            analyticsApi.getConsistency(),
            nutritionApi.getDayNutrition(todayKey),
            profilesApi.getProfile(),
          ])
        if (!active) return
        setSessions(daySessions)
        setCombat(combatAnalytics)
        setConsistency(consistencyData)
        setNutrition(dayNutrition)
        setUserName(getFirstName(profile?.name))
      } catch (e) {
        console.error('Dashboard load error:', e)
        if (active) setError('No se pudieron cargar los datos del panel.')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchData()
    return () => {
      active = false
    }
  }, [todayKey])

  const stats = useMemo(
    () => computeConsistencyStats(consistency, todayDate),
    [consistency, todayDate],
  )
  const heatmap = useMemo(
    () => buildConsistencyHeatmap(consistency, todayDate, 12),
    [consistency, todayDate],
  )

  const weekRounds = combat.roundsByWeek.slice(-7)
  const strikingBars = Array.from({ length: 7 }, (_, i) =>
    Math.min((weekRounds[i]?.striking ?? 0) / 6, 1),
  )
  const grapplingBars = Array.from({ length: 7 }, (_, i) =>
    Math.min((weekRounds[i]?.grappling ?? 0) / 6, 1),
  )

  const sessionTotals = useMemo(
    () =>
      sessions.reduce(
        (totals, session) => {
          if ('sets' in session) {
            totals.sets += session.sets.length
            totals.volume += strengthVolume(session)
          } else {
            totals.rounds += session.rounds
            totals.minutes += session.durationMinutes
          }
          return totals
        },
        { sets: 0, rounds: 0, volume: 0, minutes: 0 },
      ),
    [sessions],
  )

  const sessionSummary = [
    sessionTotals.sets > 0 && `${sessionTotals.sets} series`,
    sessionTotals.rounds > 0 && `${sessionTotals.rounds} rounds`,
    sessionTotals.volume > 0 && `${sessionTotals.volume.toLocaleString()} kg`,
  ]
    .filter(Boolean)
    .join(' · ')

  const remainingKcal = nutrition
    ? Math.max(nutrition.goal.calories - nutrition.totals.calories, 0)
    : 0
  const statusLabel = todayDate
    .toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    .toUpperCase()

  return (
    <div className="relative min-h-dvh pb-[calc(7.25rem+env(safe-area-inset-bottom,0px))]">
      <PageBackdrop />
      <div className="relative z-10">
        <WelcomeHero name={userName} />
        <div className="max-w-4xl mx-auto">
          <div className="px-5 pt-4">
          <PageHeader
            kicker="CENTRO DE MANDO · HOY"
            title="Panel de"
            titleAccent="Hoy"
            subtitle="Tu día en un vistazo: sesión, nutrición y rachas."
            status={
              <span className="status-pill">
                <span className="status-dot bg-green" />
                {statusLabel}
              </span>
            }
          />
        </div>

        <main className="p-md pt-6 space-y-lg">
          {error && (
            <GreenCard variant="glass" padding="md" className="border-l-4 border-l-error">
              <p className="text-sm text-error">{error}</p>
            </GreenCard>
          )}

          <Skeleton
            name="dashboard-hoy"
            loading={loading}
            select="viewport"
            transition={180}
            className="block"
            fixture={<DashboardHoySkeletonFixture />}
            fallback={<DashboardHoySkeletonFixture />}
          >
            {loading ? null : (
            <div className="space-y-lg">
              {/* 01 · Sesión de hoy — hero con CTA primario */}
              <TodayCard
                sessions={sessions}
                summary={sessionSummary}
                onRegister={() => navigate('/logging')}
              />

              {/* 02 · Rendimiento — nutrición y combate como dos lecturas limpias */}
              <section className="space-y-sm">
                <h2 className="text-base font-semibold text-on-surface">Rendimiento</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                  {nutrition ? (
                    <GreenCard variant="glass" padding="lg" className="space-y-4">
                      <div className="flex items-baseline justify-between gap-sm">
                        <h3 className="text-sm font-medium text-on-surface">Nutrición</h3>
                        <p className="text-xs text-on-surface-variant">
                          Objetivo {nutrition.goal.calories.toLocaleString()} kcal
                        </p>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-data-display text-[38px] leading-none tracking-tight text-on-surface">
                          {remainingKcal.toLocaleString()}
                        </span>
                        <span className="text-xs text-on-surface-variant">kcal restantes</span>
                      </div>
                      <div className="space-y-3">
                        <MacroRow label="Proteína" current={nutrition.totals.protein} target={nutrition.goal.protein} />
                        <MacroRow label="Carbohidratos" current={nutrition.totals.carbs} target={nutrition.goal.carbs} />
                        <MacroRow label="Grasas" current={nutrition.totals.fat} target={nutrition.goal.fat} />
                      </div>
                      <p className="text-xs text-on-surface-variant border-t border-outline-variant/20 pt-sm">
                        {nutrition.totals.calories.toLocaleString()} kcal consumidas · {nutrition.meals.length}{' '}
                        {nutrition.meals.length === 1 ? 'comida' : 'comidas'}
                      </p>
                    </GreenCard>
                  ) : (
                    <GreenCard
                      variant="glass"
                      padding="lg"
                      className="flex items-center min-h-[180px]"
                    >
                      <div>
                        <h3 className="text-sm font-medium text-on-surface">Nutrición</h3>
                        <p className="text-xs text-on-surface-variant mt-1">
                          Sin datos de nutrición para hoy.
                        </p>
                      </div>
                    </GreenCard>
                  )}

                  <GreenCard variant="glass" padding="lg" className="space-y-4">
                    <div className="flex items-baseline justify-between gap-sm">
                      <h3 className="text-sm font-medium text-on-surface">Combate</h3>
                      <p className="text-xs text-on-surface-variant">Últimas 7 semanas</p>
                    </div>
                    <div className="space-y-4">
                      <RoundBars label="Striking" total={combat.totalRounds.striking} values={strikingBars} tone="green" />
                      <RoundBars label="Grappling" total={combat.totalRounds.grappling} values={grapplingBars} tone="dim" />
                    </div>
                    <p className="text-xs text-on-surface-variant border-t border-outline-variant/20 pt-sm">
                      {(combat.totalRounds.striking + combat.totalRounds.grappling).toLocaleString()} rondas en total
                    </p>
                  </GreenCard>
                </div>
              </section>

              {/* 03 · Consistencia — heatmap arriba, cifras en una sola línea */}
              <section className="space-y-sm">
                <h2 className="text-base font-semibold text-on-surface">Consistencia</h2>
                <GreenCard variant="glass" padding="lg">
                  <div className="flex items-baseline justify-between gap-sm mb-4">
                    <h3 className="text-sm font-medium text-on-surface">Últimas 12 semanas</h3>
                    <p className="text-xs text-on-surface-variant">
                      {stats.activeDays} días activos
                    </p>
                  </div>

                  <div className="overflow-x-auto scrollbar-thin pb-xs">
                    <HeatmapInteractionProvider>
                      <HeatmapInteractionBoundary className="min-w-[300px]">
                        <HeatmapChart
                          data={heatmap}
                          weekStartDay={1}
                          layout="fluid"
                          cellHeight={28}
                          gap={4}
                          margin={{ top: 24, right: 0, bottom: 0, left: 32 }}
                          animate={!reduceMotion}
                          animationDuration={reduceMotion ? 0 : 900}
                        >
                          <HeatmapCells cornerRadius={3} />
                          <HeatmapXAxis className="text-[9px] text-on-surface-variant/70" />
                          <HeatmapYAxis
                            tickFilter="odd"
                            labelFormat="full"
                            className="text-[9px] text-on-surface-variant/70"
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
                            formatLabel={(count) => (count > 0 ? 'Día activo' : 'Sin actividad')}
                          />
                        </HeatmapChart>
                        <div className="mt-sm flex justify-end">
                          <HeatmapLegend
                            lessLabel="Menos"
                            moreLabel="Más"
                            cellSize={10}
                            fontSize={9}
                            labelClassName="text-[9px] text-on-surface-variant/70"
                          />
                        </div>
                      </HeatmapInteractionBoundary>
                    </HeatmapInteractionProvider>
                  </div>

                  <div className="grid grid-cols-3 divide-x divide-outline-variant/20 border-t border-outline-variant/20 pt-sm">
                    <SummaryStat label="Racha actual" value={stats.currentStreak} unit="días" />
                    <SummaryStat label="Mejor racha" value={stats.bestStreak} unit="días" />
                    <SummaryStat label="Consistencia" value={stats.consistencyPct} unit="%" />
                  </div>
                </GreenCard>
              </section>
            </div>
            )}
          </Skeleton>
        </main>
        </div>
      </div>
    </div>
  )
}

function RoundBars({
  label,
  total,
  values,
  tone,
}: {
  label: string
  total: number
  values: number[]
  tone: 'green' | 'dim'
}) {
  const full = tone === 'green' ? 'bg-green' : 'bg-green-dim'
  const partial = tone === 'green' ? 'bg-green/40' : 'bg-green-dim/40'

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-xs text-on-surface-variant">{label}</span>
        <span className="font-data-display text-xs text-on-surface">{total}</span>
      </div>
      <div className="flex gap-1.5 h-4" aria-hidden>
        {values.map((value, index) => (
          <div
            key={index}
            className={`flex-1 rounded-[3px] transition-colors ${
              value >= 0.8 ? full : value > 0 ? partial : 'bg-surface-container-high/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function MacroRow({ label, current, target }: { label: string; current: number; target: number }) {
  const pct = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-xs text-on-surface-variant">{label}</span>
        <span className="font-data-display text-xs text-on-surface">
          {current} / {target} g
        </span>
      </div>
      <GreenProgress value={pct} size="sm" effects={false} />
    </div>
  )
}

function SummaryStat({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 text-center first:pl-0 last:pr-0">
      <p className="text-[11px] text-on-surface-variant">{label}</p>
      <p className="font-data-display text-lg leading-none tracking-tight text-on-surface">
        {value}
        <span className="text-[11px] text-on-surface-variant ml-1.5 font-normal">{unit}</span>
      </p>
    </div>
  )
}
