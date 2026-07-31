import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GreenCard } from '@/design-system/components/GreenCard'
import { GreenButton } from '@/design-system/components/GreenButton'
import { GreenTag } from '@/design-system/components/GreenTag'
import { GreenProgress } from '@/design-system/components/GreenProgress'
import { sessionsApi } from '@/services/api/sessions.api'
import type { StrengthSession, CombatSession } from '@/shared/types/session.types'
const WEEKDAYS = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM']
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const dotColors: Record<string, string> = {
  striking: 'bg-green',
  grappling: 'bg-green-dim',
  fuerza: 'bg-acid',
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1 // Monday = 0
}

interface DayDetailPanelProps {
  day: number
  year: number
  month: number
  onClose: () => void
  disciplines: string[]
}

function DayDetailPanel({ day, year, month, onClose, disciplines }: DayDetailPanelProps) {
  const navigate = useNavigate()
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  return (
    <GreenCard variant="glass" padding="md" effects={true} className="flex flex-col gap-md">
      <header className="border-b border-green/20 pb-sm">
        <div className="flex justify-between items-center">
          <h4 className=" font-label-caps text-label-caps text-green mb-xs">INTEL DE HOY</h4>
          <button onClick={onClose} aria-label="Cerrar detalle" className="material-symbols-outlined text-text-muted cursor-pointer text-sm hover:text-green transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green">
            close
          </button>
        </div>
        <p className="font-label-caps text-headline-md text-text-muted">DÍA {day}</p>
      </header>
      <div className="flex flex-col gap-sm overflow-y-auto">
        {disciplines.length > 0 ? (
          disciplines.map((disc) => (
            <GreenCard
              key={disc}
              variant="default" padding="md" effects={true}
              className="flex flex-col gap-sm"
            >
              <div className="flex justify-between items-start">
                <span className={`font-label-caps text-label-caps ${disc === 'striking' ? 'text-green' : disc === 'grappling' ? 'text-green-dim' : 'text-acid'}`}>
                  {disc.toUpperCase()}
                </span>
                <span className="font-label-caps text-[14px] text-text-muted">
                  {disc === 'striking' ? '90 MIN' : '60 MIN'}
                </span>
              </div>
              <div className="flex items-center gap-xs text-[10px] font-label-caps text-text-muted">
                <span className="material-symbols-outlined text-sm">timer</span>
                {disc === 'striking' ? '07:00 AM - 08:30 AM' : '06:00 PM - 07:00 PM'}
              </div>
            </GreenCard>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center border border-dashed border-green/20 p-lg opacity-40">
            <span className="font-label-caps text-[15px] text-on-surface">SIN SESIONES REGISTRADAS</span>
          </div>
        )}
        <GreenButton
          variant="default" size="md" effects={true} fullWidth
          onClick={() => navigate(`/history/${dateStr}`)}
          className="mt-sm flex items-center justify-center gap-2"
        >
          <span>VER REGISTRO COMPLETO DEL DÍA</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </GreenButton>
      </div>
    </GreenCard>
  )
}

export default function MonthlyCalendar() {
  const navigate = useNavigate()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [allSessions, setAllSessions] = useState<(StrengthSession | CombatSession)[]>([])

  useEffect(() => {
    async function fetchSessions() {
      try {
        const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`
        const [strength, combat] = await Promise.all([
          sessionsApi.getStrengthSessions(),
          sessionsApi.getCombatSessions(),
        ])
        const filtered = [...strength, ...combat].filter((s) => s.date.startsWith(monthKey))
        setAllSessions(filtered)
      } catch (e) {
        console.error('Error loading sessions:', e)
        setAllSessions([])
      }
    }
    fetchSessions()
  }, [year, month])

  const days = useMemo(() => {
    const daySet = new Set<number>()
    for (const s of allSessions) {
      const d = new Date(s.date).getDate()
      daySet.add(d)
    }
    return Array.from(daySet).sort()
  }, [allSessions])

  const disciplineMap = useMemo(() => {
    const map: Record<number, string[]> = {}
    for (const s of allSessions) {
      const d = new Date(s.date).getDate()
      if (!map[d]) map[d] = []
      if ('exerciseName' in s) {
        if (!map[d].includes('fuerza')) map[d].push('fuerza')
      } else {
        if (!map[d].includes(s.type)) map[d].push(s.type)
      }
    }
    return map
  }, [allSessions])

  const monthlyTotals = useMemo(() => {
    let rounds = 0
    let totalKg = 0
    for (const s of allSessions) {
      if ('rounds' in s) rounds += s.rounds
      if ('sets' in s) {
        for (const set of s.sets) totalKg += set.weight * set.reps
      }
    }
    return { rounds, tonnage: totalKg }
  }, [allSessions])

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const calendarCells = useMemo(() => {
    const cells: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    return cells
  }, [firstDay, daysInMonth])

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
    setSelectedDay(null)
  }

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
    setSelectedDay(null)
  }

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
            Historial - Calendario
          </h1>
          <span className="font-label-caps text-[12px] text-text-muted">
            Registro de entrenamientos
          </span>
        </div>
      </header>

      <div className="p-md space-y-lg">
        {/* Month Navigation */}
        <div className="flex justify-between items-center px-xs">
          <div className="flex items-center gap-md">
            <button
              onClick={prevMonth}
              aria-label="Mes anterior"
              className="material-symbols-outlined text-green hover:bg-panel2 p-xs rounded transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green cursor-pointer"
            >
              chevron_left
            </button>
            <h3 className="font-label-caps text-headline-md text-text-green">
              {MONTH_NAMES[month].toUpperCase()} {year}
            </h3>
            <button
              onClick={nextMonth}
              aria-label="Mes siguiente"
              className="material-symbols-outlined text-green hover:bg-panel2 p-xs rounded transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green cursor-pointer"
            >
              chevron_right
            </button>
          </div>
          <div className="flex gap-sm">
            <GreenTag color="green" variant="outlined" effects={true}>STRIKING</GreenTag>
            <GreenTag color="muted" variant="outlined" effects={true}>GRAPPLING</GreenTag>
            <GreenTag color="acid" variant="outlined" effects={true}>FUERZA</GreenTag>
          </div>
        </div>

        {/* Calendar Grid */}
        <div>
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-t border-l border-green/20">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="border-r border-b border-green/20 py-sm text-center font-label-caps text-label-caps text-text-muted opacity-40"
              >
                {day}
              </div>
            ))}

            {/* Calendar Cells */}
            {calendarCells.map((day, i) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${i}`}
                    className="border-r border-b border-green/20 p-sm flex flex-col justify-between h-20 bg-panel2/20 opacity-20"
                  />
                )
              }

              const hasTraining = days.includes(day)
              const isSelected = selectedDay === day
              const disciplines = disciplineMap[day] || []

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={`text-text-muted border-r border-b border-green/20 p-sm flex flex-col justify-between h-20 text-left transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green cursor-pointer ${
                    isSelected
                      ? 'bg-panel2/40'
                      : hasTraining
                        ? 'hover:bg-panel'
                        : 'hover:bg-panel2/30'
                  }`}
                  style={isSelected ? { border: '1px solid #c7d988', boxShadow: 'inset 0 0 10px rgba(199, 217, 136, 0.1)' } : undefined}
                >
                  <span className={`font-label-caps text-sm ${isSelected ? 'text-green' : ''}`}>
                    {day}
                  </span>
                  {disciplines.length > 0 && (
                    <div className="flex gap-xs">
                      {disciplines.map((d) => (
                        <div key={d} className={`w-2 h-2 ${dotColors[d]}`} />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Day Detail Panel */}
        {selectedDay !== null && (
          <DayDetailPanel
            day={selectedDay}
            year={year}
            month={month}
            onClose={() => setSelectedDay(null)}
            disciplines={disciplineMap[selectedDay] ?? []}
          />
        )}

        {/* Monthly Totals Footer */}
        <div className="pt-md border-t border-green/20">
          <div className="flex items-center justify-between flex-wrap gap-md">
            <span className="font-label-caps text-label-caps text-text-muted opacity-60">
              MONTHLY TOTALS:
            </span>
              <div className="flex items-center gap-lg">
                <div className="flex items-center gap-sm">
                  <span className="font-label-caps text-[9px] text-text-muted">ROUNDS</span>
                  <span className="font-label-caps text-green">{monthlyTotals.rounds}</span>
                </div>
                <div className="flex items-center gap-sm">
                  <span className="font-label-caps text-[9px] text-text-muted">TONNAGE</span>
                  <span className="font-label-caps text-green">{(monthlyTotals.tonnage / 1000).toFixed(1)}T</span>
                </div>
                <div className="flex items-center gap-sm">
                  <span className="font-label-caps text-[9px] text-text-muted">SESIONES</span>
                  <span className="font-label-caps text-green">{allSessions.length}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-sm mt-sm">
              <GreenProgress value={days.length > 0 ? Math.round((days.length / daysInMonth) * 100) : 0} label="GOAL" showValue={true} size="sm" effects={true} />
            </div>
        </div>
      </div>

    </div>
  )
}
