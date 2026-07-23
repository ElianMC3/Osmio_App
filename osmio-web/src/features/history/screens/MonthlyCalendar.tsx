import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
const WEEKDAYS = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM']
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const trainingDays: Record<string, number[]> = {
  '2026-07': [1, 2, 4, 5, 7, 8, 9, 11, 12, 14, 15, 16, 18, 19, 21, 22, 23, 25, 26, 28, 29],
  '2026-06': [1, 3, 4, 6, 7, 10, 11, 13, 14, 17, 18, 20, 21, 24, 25, 27, 28],
  '2026-08': [2, 3, 5, 6, 9, 10, 12, 13, 16, 17, 19, 20, 23, 24, 26, 27],
}

const disciplineMap: Record<number, string[]> = {
  1: ['striking'],
  2: ['grappling', 'fuerza'],
  4: ['striking'],
  5: ['fuerza'],
  7: ['grappling'],
  8: ['striking', 'grappling'],
  9: ['fuerza'],
  11: ['striking'],
  12: ['grappling'],
  14: ['fuerza'],
  15: ['striking'],
  16: ['grappling', 'fuerza'],
  18: ['striking'],
  19: ['grappling'],
  21: ['fuerza'],
  22: ['striking', 'grappling'],
  23: ['fuerza'],
  25: ['striking'],
  26: ['grappling'],
  28: ['fuerza', 'striking'],
  29: ['grappling'],
}

const dotColors: Record<string, string> = {
  striking: 'bg-primary-fixed',
  grappling: 'bg-secondary',
  fuerza: 'bg-tertiary',
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
}

function DayDetailPanel({ day, year, month, onClose }: DayDetailPanelProps) {
  const navigate = useNavigate()
  const disciplines = disciplineMap[day] || []
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  return (
    <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-md flex flex-col gap-md">
      <header className="border-b border-outline-variant pb-sm">
        <div className="flex justify-between items-center">
          <h4 className="font-label-caps text-label-caps text-primary-fixed mb-xs">INTEL DE HOY</h4>
          <button onClick={onClose} aria-label="Cerrar detalle" className="material-symbols-outlined text-on-surface-variant cursor-pointer text-sm hover:text-primary-fixed transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            close
          </button>
        </div>
        <p className="font-data-display text-headline-md">DÍA {day}</p>
      </header>
      <div className="flex flex-col gap-sm overflow-y-auto">
        {disciplines.length > 0 ? (
          disciplines.map((disc) => (
            <div
              key={disc}
              className="bg-surface-container-low border border-outline-variant p-md flex flex-col gap-sm"
            >
              <div className="flex justify-between items-start">
                <span className={`font-label-caps text-label-caps ${disc === 'striking' ? 'text-primary-fixed' : disc === 'grappling' ? 'text-secondary' : 'text-tertiary'}`}>
                  {disc.toUpperCase()}
                </span>
                <span className="font-data-display text-[14px]">
                  {disc === 'striking' ? '90 MIN' : '60 MIN'}
                </span>
              </div>
              <div className="flex items-center gap-xs text-[10px] font-label-caps text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">timer</span>
                {disc === 'striking' ? '07:00 AM - 08:30 AM' : '06:00 PM - 07:00 PM'}
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center border border-dashed border-outline-variant p-lg opacity-40">
            <span className="font-label-caps text-[10px]">SIN SESIONES REGISTRADAS</span>
          </div>
        )}
        <button
          onClick={() => navigate(`/history/${dateStr}`)}
          className="mt-sm w-full bg-primary-fixed/10 border border-primary-fixed/30 text-primary-fixed font-label-caps text-[10px] py-2.5 hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <span>VER REGISTRO COMPLETO DEL DÍA</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  )
}

export default function MonthlyCalendar() {
  const navigate = useNavigate()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const days = trainingDays[monthKey] || []

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
            Historial - Calendario
          </h1>
          <span className="font-label-caps text-[10px] text-on-surface-variant">
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
              className="material-symbols-outlined text-primary-fixed hover:bg-surface-container-high p-xs rounded transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
            >
              chevron_left
            </button>
            <h3 className="font-data-display text-headline-md text-on-surface">
              {MONTH_NAMES[month].toUpperCase()} {year}
            </h3>
            <button
              onClick={nextMonth}
              aria-label="Mes siguiente"
              className="material-symbols-outlined text-primary-fixed hover:bg-surface-container-high p-xs rounded transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
            >
              chevron_right
            </button>
          </div>
          <div className="flex gap-sm">
            <span className="flex items-center gap-xs font-label-caps text-[8px] text-on-surface-variant">
              <span className="w-2 h-2 bg-primary-fixed" /> STRIKING
            </span>
            <span className="flex items-center gap-xs font-label-caps text-[8px] text-on-surface-variant">
              <span className="w-2 h-2 bg-secondary" /> GRAPPLING
            </span>
            <span className="flex items-center gap-xs font-label-caps text-[8px] text-on-surface-variant">
              <span className="w-2 h-2 bg-tertiary" /> FUERZA
            </span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div>
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-t border-l border-outline-variant">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="border-r border-b border-outline-variant py-sm text-center font-label-caps text-label-caps text-on-surface-variant opacity-40"
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
                    className="border-r border-b border-outline-variant p-sm flex flex-col justify-between h-20 bg-surface-dim/20 opacity-20"
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
                  className={`border-r border-b border-outline-variant p-sm flex flex-col justify-between h-20 text-left transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                    isSelected
                      ? 'bg-surface-container-high/40'
                      : hasTraining
                        ? 'hover:bg-surface-container-low'
                        : 'hover:bg-surface-dim/30'
                  }`}
                  style={isSelected ? { border: '1px solid var(--color-primary-fixed)', boxShadow: 'inset 0 0 10px rgba(210, 240, 0, 0.1)' } : undefined}
                >
                  <span className={`font-data-display text-sm ${isSelected ? 'text-primary-fixed' : ''}`}>
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
          />
        )}

        {/* Monthly Totals Footer */}
        <div className="pt-md border-t border-outline-variant">
          <div className="flex items-center justify-between flex-wrap gap-md">
            <span className="font-label-caps text-label-caps text-on-surface-variant opacity-60">
              MONTHLY TOTALS:
            </span>
            <div className="flex items-center gap-lg">
              <div className="flex items-center gap-sm">
                <span className="font-label-caps text-[9px] text-on-surface-variant">ROUNDS</span>
                <span className="font-data-display text-primary-fixed">142</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="font-label-caps text-[9px] text-on-surface-variant">TONNAGE</span>
                <span className="font-data-display text-primary-fixed">12.8T</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="font-label-caps text-[9px] text-on-surface-variant">KCAL</span>
                <span className="font-data-display text-primary-fixed">24,502</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-sm mt-sm">
            <div className="h-1 flex-1 bg-surface-container-highest overflow-hidden" role="progressbar" aria-valuenow={72} aria-valuemin={0} aria-valuemax={100} aria-label="Progreso de objetivo mensual: 72%">
              <div className="h-full bg-primary-fixed" style={{ width: '72%' }} />
            </div>
            <span className="font-data-display text-[10px] text-primary-fixed">72% GOAL</span>
          </div>
        </div>
      </div>

    </div>
  )
}
