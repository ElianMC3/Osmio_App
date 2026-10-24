import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GreenButton } from '@/design-system/components/GreenButton'
import { GreenCard } from '@/design-system/components/GreenCard'
import { GreenProgress } from '@/design-system/components/GreenProgress'
import { GreenTag } from '@/design-system/components/GreenTag'
import { PageBackdrop } from '@/design-system/components/PageBackdrop'
import { PageHeader } from '@/design-system/components/PageHeader'
import { SectionHeader } from '@/design-system/components/SectionHeader'
import { analyticsApi, type CombatAnalytics } from '@/services/api/analytics.api'
import { nutritionApi } from '@/services/api/nutrition.api'
import { sessionsApi } from '@/services/api/sessions.api'
import type { DailyNutrition } from '@/shared/types/nutrition.types'
import type { CombatSession, StrengthSession } from '@/shared/types/session.types'
import {
  activeDateKeys,
  buildConsistencyWeeks,
  computeConsistencyStats,
  type ConsistencyEntry,
} from '@/shared/utils/consistency'
import { getDaysInMonth, parseLocalDate, toLocalDateString } from '@/shared/utils/dateHelpers'

const WEEKDAYS = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM']
const HEATMAP_ROWS = ['Lun', '', 'Mié', '', 'Vie', '', '']

function strengthVolume(session: StrengthSession): number {
  return session.sets.reduce((sum, set) => sum + set.weight * set.reps, 0)
}

function buildMonthCells(year: number, month: number): (number | null)[] {
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
  const cells: (number | null)[] = Array.from({ length: firstWeekday }, () => null)
  for (let day = 1; day <= getDaysInMonth(year, month); day++) cells.push(day)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export default function DashboardHoy() {
  const navigate = useNavigate()

  const [sessions, setSessions] = useState<(StrengthSession | CombatSession)[]>([])
  const [combat, setCombat] = useState<CombatAnalytics>({
    roundsByWeek: [],
    totalRounds: { striking: 0, grappling: 0 },
  })
  const [consistency, setConsistency] = useState<ConsistencyEntry[]>([])
  const [nutrition, setNutrition] = useState<DailyNutrition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const todayKey = toLocalDateString()
  const todayDate = useMemo(() => parseLocalDate(todayKey), [todayKey])

  useEffect(() => {
    let active = true

    async function fetchData() {
      try {
        const [daySessions, combatAnalytics, consistencyData, dayNutrition] = await Promise.all([
          sessionsApi.getSessionsByDate(todayKey),
          analyticsApi.getCombatAnalytics(),
          analyticsApi.getConsistency(),
          nutritionApi.getDayNutrition(todayKey),
        ])
        if (!active) return
        setSessions(daySessions)
        setCombat(combatAnalytics)
        setConsistency(consistencyData)
        setNutrition(dayNutrition)
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
  const activeKeys = useMemo(() => activeDateKeys(consistency, todayDate), [consistency, todayDate])
  const heatmap = useMemo(
    () => buildConsistencyWeeks(consistency, todayDate, 12),
    [consistency, todayDate],
  )
  const calendarCells = useMemo(
    () => buildMonthCells(todayDate.getFullYear(), todayDate.getMonth()),
    [todayDate],
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

  const sessionSummary =
    [
      sessionTotals.sets > 0 && `${sessionTotals.sets} series`,
      sessionTotals.rounds > 0 && `${sessionTotals.rounds} rounds`,
      sessionTotals.volume > 0 && `${sessionTotals.volume.toLocaleString()} kg`,
    ]
      .filter(Boolean)
      .join(' · ') || 'Aún no hay actividad hoy'

  const remainingKcal = nutrition
    ? Math.max(nutrition.goal.calories - nutrition.totals.calories, 0)
    : 0
  const monthLabel = todayDate
    .toLocaleDateString('es-ES', { month: 'long' })
    .toUpperCase()
  const statusLabel = todayDate
    .toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    .toUpperCase()

  return (
    <div className="relative min-h-screen pb-24">
      <PageBackdrop />
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="px-5 pt-6">
          <PageHeader
            kicker="CENTRO DE MANDO · HOY"
            title="Panel de"
            titleAccent="Hoy"
            subtitle="Sesiones, nutrición y consistencia del día en un vistazo."
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
              <p className="font-label-caps text-xs text-error">{error}</p>
            </GreenCard>
          )}

          {loading ? (
            <div className="flex justify-center py-16">
              <p className="font-label-caps text-sm text-text-muted animate-pulse">CARGANDO PANEL…</p>
            </div>
          ) : (
            <>
              <section className="space-y-md">
                <SectionHeader
                  kicker="01 · Operaciones"
                  title="Sesión"
                  titleAccent="de hoy"
                  right={
                    <GreenTag color="acid" variant="outlined" effects={false}>
                      {sessions.length} {sessions.length === 1 ? 'SESIÓN' : 'SESIONES'}
                    </GreenTag>
                  }
                />

                <GreenCard padding="lg" className="relative overflow-hidden">
                  <span className="gradient-hairline" />
                  <div className="absolute -right-6 -top-8 pointer-events-none opacity-[0.07]">
                    <span className="material-symbols-outlined text-[140px] text-green">
                      sports_kabaddi
                    </span>
                  </div>

                  <div className="relative">
                    {sessions.length > 0 ? (
                      <ul className="divide-y divide-green/15">
                        {sessions.map((session) => (
                          <SessionRow key={session.id} session={session} />
                        ))}
                      </ul>
                    ) : (
                      <div className="flex items-center gap-md py-sm">
                        <div className="w-12 h-12 shrink-0 rounded-xl border border-outline-variant/40 bg-surface-container-high/60 flex items-center justify-center">
                          <span className="material-symbols-outlined text-text-muted">hotel</span>
                        </div>
                        <div>
                          <p className="font-label-caps text-sm text-text-green">
                            SIN SESIONES REGISTRADAS
                          </p>
                          <p className="font-label-sm text-[11px] text-text-muted mt-xs">
                            Registra tu primer entrenamiento del día.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="mt-md pt-md border-t border-outline-variant/25 flex flex-wrap items-center justify-between gap-sm">
                      <p className="font-label-caps text-[10px] text-text-muted">{sessionSummary}</p>
                      <GreenButton variant="primary" size="sm" onClick={() => navigate('/logging')}>
                        REGISTRAR SESIÓN
                      </GreenButton>
                    </div>
                  </div>
                </GreenCard>
              </section>

              <section className="space-y-md">
                <SectionHeader kicker="02 · Rendimiento" title="Resumen" titleAccent="semanal" />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-sm">
                  <GreenCard padding="md" className="md:col-span-7 relative overflow-hidden">
                    <span className="gradient-hairline" />
                    <div className="flex items-center justify-between mb-md">
                      <h3 className="font-label-caps text-text-green">COMBATE · ÚLTIMAS 7 SEMANAS</h3>
                      <span className="font-label-caps text-[9px] text-text-muted">RONDAS</span>
                    </div>

                    <div className="space-y-md">
                      <RoundBars
                        label="STRIKING"
                        total={combat.totalRounds.striking}
                        values={strikingBars}
                        tone="green"
                      />
                      <RoundBars
                        label="GRAPPLING"
                        total={combat.totalRounds.grappling}
                        values={grapplingBars}
                        tone="dim"
                      />
                    </div>

                    <div className="mt-md pt-sm border-t border-outline-variant/25 flex justify-between items-baseline">
                      <span className="font-label-caps text-[9px] text-text-muted">TOTAL RONDAS</span>
                      <span className="font-label-caps text-sm text-text-green">
                        {(combat.totalRounds.striking + combat.totalRounds.grappling).toLocaleString()}
                      </span>
                    </div>
                  </GreenCard>

                  <GreenCard padding="md" className="md:col-span-5 relative overflow-hidden">
                    <span className="gradient-hairline" />
                    {nutrition ? (
                      <>
                        <div className="text-center mb-md">
                          <p className="font-label-caps text-[38px] leading-none text-text-green">
                            {remainingKcal.toLocaleString()}
                          </p>
                          <p className="font-label-caps text-[9px] text-text-muted mt-xs">
                            KCAL RESTANTES
                          </p>
                          <p className="font-label-sm text-[10px] text-text-muted mt-xs">
                            Objetivo {nutrition.goal.calories.toLocaleString()} kcal
                          </p>
                        </div>

                        <div className="space-y-sm">
                          <MacroRow
                            label="PROTEÍNA"
                            current={nutrition.totals.protein}
                            target={nutrition.goal.protein}
                          />
                          <MacroRow
                            label="CARBOHIDRATOS"
                            current={nutrition.totals.carbs}
                            target={nutrition.goal.carbs}
                          />
                          <MacroRow
                            label="GRASAS"
                            current={nutrition.totals.fat}
                            target={nutrition.goal.fat}
                          />
                        </div>

                        <div className="mt-md pt-sm border-t border-outline-variant/25 grid grid-cols-2 gap-sm">
                          <div>
                            <p className="font-label-caps text-[8px] text-text-muted">CONSUMIDAS</p>
                            <p className="font-label-caps text-sm text-text-green">
                              {nutrition.totals.calories.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-label-caps text-[8px] text-text-muted">COMIDAS</p>
                            <p className="font-label-caps text-sm text-text-green">
                              {nutrition.meals.length}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="py-10 text-center font-label-caps text-sm text-text-muted opacity-40">
                        SIN DATOS DE NUTRICIÓN
                      </div>
                    )}
                  </GreenCard>
                </div>
              </section>

              <section className="space-y-md">
                <SectionHeader
                  kicker="03 · Consistencia"
                  title="Actividad"
                  titleAccent="y rachas"
                />

                <GreenCard padding="md" className="relative overflow-hidden">
                  <span className="gradient-hairline" />
                  <div className="flex items-center justify-between gap-sm flex-wrap mb-md">
                    <div className="flex items-center gap-sm">
                      <span
                        className="material-symbols-outlined text-green text-[20px]"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                      >
                        calendar_view_month
                      </span>
                      <h3 className="font-label-caps text-text-green">ÚLTIMAS 12 SEMANAS</h3>
                    </div>
                    <div className="flex items-center gap-xs">
                      <span className="font-label-caps text-[8px] text-text-muted">MENOS</span>
                      {[
                        'bg-surface-container-low',
                        'bg-green/25',
                        'bg-green-dim',
                        'bg-green',
                        'bg-gradient-to-br from-green to-acid',
                      ].map((color) => (
                        <span key={color} className={`w-2.5 h-2.5 rounded-[2px] ${color}`} />
                      ))}
                      <span className="font-label-caps text-[8px] text-text-muted">MÁS</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto scrollbar-thin pb-xs">
                    <div className="flex gap-1 min-w-[420px]">
                      <div
                        className="grid gap-1"
                        style={{ gridTemplateRows: 'repeat(7, 12px)' }}
                        aria-hidden
                      >
                        {HEATMAP_ROWS.map((label, i) => (
                          <span
                            key={i}
                            className="font-label-caps text-[8px] text-text-muted flex items-center"
                          >
                            {label}
                          </span>
                        ))}
                      </div>

                      <div
                        className="flex-1 grid gap-1"
                        style={{ gridTemplateColumns: `repeat(${heatmap.length}, minmax(0, 1fr))` }}
                      >
                        {heatmap.map((week, weekIndex) => (
                          <div
                            key={weekIndex}
                            className="grid gap-1"
                            style={{ gridTemplateRows: 'repeat(7, 12px)' }}
                          >
                            {week.map((cell) => (
                              <div
                                key={cell.date}
                                title={`${cell.date}${cell.active ? ' · activo' : ''}`}
                                className={`h-3 rounded-[2px] ${
                                  cell.future
                                    ? 'border border-outline-variant/15'
                                    : cell.active
                                      ? 'bg-gradient-to-br from-green to-acid shadow-[0_0_6px_color-mix(in_srgb,var(--green)_35%,transparent)]'
                                      : 'bg-surface-container-low'
                                }`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="font-label-caps text-[9px] text-text-muted mt-sm">
                    {stats.activeDays} DÍAS ACTIVOS · VENTANA DE {stats.windowDays} DÍAS
                  </p>
                </GreenCard>

                <div className="grid grid-cols-3 gap-sm">
                  <StatCard
                    icon="local_fire_department"
                    label="RACHA ACTUAL"
                    value={stats.currentStreak}
                    unit="DÍAS"
                  />
                  <StatCard
                    icon="emoji_events"
                    label="MEJOR RACHA"
                    value={stats.bestStreak}
                    unit="DÍAS"
                  />
                  <StatCard
                    icon="track_changes"
                    label="CONSISTENCIA"
                    value={stats.consistencyPct}
                    unit="%"
                  />
                </div>
              </section>

              <section className="space-y-md">
                <SectionHeader
                  kicker="04 · Historial"
                  title="Calendario"
                  titleAccent={monthLabel}
                  right={
                    <GreenButton variant="ghost" size="sm" onClick={() => navigate('/history')}>
                      VER HISTORIAL
                    </GreenButton>
                  }
                />

                <GreenCard padding="md">
                  <div className="grid grid-cols-7 gap-1">
                    {WEEKDAYS.map((day) => (
                      <span
                        key={day}
                        className="py-xs text-center font-label-caps text-[8px] text-text-muted opacity-60"
                      >
                        {day}
                      </span>
                    ))}

                    {calendarCells.map((day, index) => {
                      if (day === null) {
                        return <span key={`empty-${index}`} className="aspect-square" aria-hidden />
                      }

                      const dateKey = toLocalDateString(
                        new Date(todayDate.getFullYear(), todayDate.getMonth(), day),
                      )
                      const isToday = dateKey === todayKey
                      const isFuture = dateKey > todayKey
                      const hasSession = activeKeys.has(dateKey)

                      return (
                        <button
                          key={dateKey}
                          type="button"
                          onClick={() => navigate(`/history/${dateKey}`)}
                          disabled={isFuture}
                          aria-label={`Ver el ${day} de ${monthLabel.toLowerCase()}`}
                          aria-current={isToday ? 'date' : undefined}
                          className={`aspect-square rounded-lg font-label-caps text-xs flex items-center justify-center border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green ${
                            isToday
                              ? 'border-green bg-green/10 text-green'
                              : hasSession
                                ? 'border-green/25 bg-green/10 text-green hover:bg-green/15 cursor-pointer'
                                : isFuture
                                  ? 'border-transparent text-text-muted/30 cursor-not-allowed'
                                  : 'border-transparent text-text-muted hover:bg-green/5 cursor-pointer'
                          }`}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </GreenCard>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function SessionRow({ session }: { session: StrengthSession | CombatSession }) {
  const isStrength = 'exerciseName' in session
  const title = isStrength ? session.exerciseName : `${session.type.toUpperCase()} TRAINING`
  const detail = isStrength
    ? `${session.sets.length} ${session.sets.length === 1 ? 'serie' : 'series'} · ${strengthVolume(session).toLocaleString()} kg`
    : `${session.rounds} rounds · ${session.durationMinutes} min`

  return (
    <li className="flex items-center gap-md py-sm first:pt-0 last:pb-0">
      <div className="w-11 h-11 shrink-0 rounded-xl border border-green/30 bg-green/5 flex items-center justify-center">
        <span className="material-symbols-outlined text-green text-[22px]">
          {isStrength ? 'fitness_center' : 'sports_kabaddi'}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-label-caps text-xs font-bold text-text-green truncate">{title}</p>
        <p className="font-label-sm text-[11px] text-text-muted truncate">
          {detail}
          {session.notes ? ` · ${session.notes}` : ''}
        </p>
      </div>
      <GreenTag color={isStrength ? 'acid' : 'green'} variant="outlined" effects={false}>
        {isStrength ? 'FUERZA' : session.type.toUpperCase()}
      </GreenTag>
    </li>
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
    <div className="space-y-xs">
      <div className="flex justify-between items-end">
        <span className="font-label-caps text-[10px] text-text-muted">{label}</span>
        <span className="font-label-caps text-[10px] text-text-green">{total} ROUNDS</span>
      </div>
      <div className="flex gap-1 h-5" aria-hidden>
        {values.map((value, index) => (
          <div
            key={index}
            className={`flex-1 rounded-[2px] ${
              value >= 0.8 ? full : value > 0 ? partial : 'bg-surface-container-low'
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
    <div className="space-y-xs">
      <div className="flex justify-between font-label-caps text-[10px]">
        <span className="text-text-muted">{label}</span>
        <span className="text-text-green">
          {current} / {target} g
        </span>
      </div>
      <GreenProgress value={pct} size="sm" effects={false} />
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: string
  label: string
  value: number
  unit: string
}) {
  return (
    <GreenCard variant="default" padding="sm" className="relative overflow-hidden">
      <span className="absolute right-0 top-0 p-sm opacity-15 pointer-events-none">
        <span className="material-symbols-outlined text-green text-[28px]">{icon}</span>
      </span>
      <p className="font-label-caps text-[8px] text-text-muted">{label}</p>
      <p className="font-label-caps text-[28px] leading-none text-gradient-green mt-xs">{value}</p>
      <p className="font-label-caps text-[8px] text-text-muted mt-xs">{unit}</p>
    </GreenCard>
  )
}
