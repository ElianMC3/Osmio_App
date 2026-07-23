import { useParams, useNavigate } from 'react-router-dom'
const mockSessions = [
  {
    id: 1,
    type: 'STRIKING',
    title: 'MUAY THAI CLAYMORE',
    duration: '90 MIN',
    color: 'border-l-primary-fixed',
    typeColor: 'text-primary-fixed',
    icon: 'bolt',
    iconFill: true,
    stats: [
      { label: 'ROUNDS', value: '08' },
      { label: 'INTENSITY', value: '7.5' },
      { label: 'FOCUS', value: '9.0' },
    ],
    hrAvg: '158 BPM',
    hrPct: 75,
    exercises: null,
  },
  {
    id: 2,
    type: 'STRENGTH',
    title: 'LOWER BODY POWER',
    duration: '60 MIN',
    color: 'border-l-secondary',
    typeColor: 'text-secondary',
    icon: 'fitness_center',
    iconFill: true,
    totalVolume: '12,450 KG',
    stats: null,
    hrAvg: null,
    hrPct: null,
    exercises: [
      { name: 'Zercher Squat', sets: '5 x 5 @ 120KG' },
      { name: 'RDL', sets: '4 x 8 @ 100KG' },
      { name: 'Plyo Box Jumps', sets: '3 x 10 @ 30"' },
    ],
  },
]

const recoveryMetrics = [
  { icon: 'sleep', label: 'SLEEP QUALITY', value: '84%' },
  { icon: 'water_drop', label: 'HYDRATION', value: '3.8L' },
  { icon: 'monitor_heart', label: 'RESTING HR', value: '48BPM' },
]

const nutrition = {
  calories: 2840,
  targetPct: 102,
  protein: { value: '185G', pct: 90, color: 'bg-secondary' },
  carbs: { value: '310G', pct: 100, color: 'bg-primary-fixed' },
  fats: { value: '82G', pct: 80, color: 'bg-outline' },
}

export default function DayDetail() {
  const { date } = useParams()
  const navigate = useNavigate()
  const displayDate = date
    ? new Date(date + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()
    : '24 OCT 2023'

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-md h-14 bg-surface/80 backdrop-blur-xl border-b border-outline-variant">
        <div className="flex items-center gap-md">
          <button
            onClick={() => navigate(-1)}
            aria-label="Volver"
            className="material-symbols-outlined text-on-surface-variant hover:text-primary-fixed transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
          >
            arrow_back
          </button>
          <div className="flex flex-col">
            <h1 className="font-headline-md text-headline-md text-on-surface leading-tight">
              Detalle del Día
            </h1>
            <span className="font-label-caps text-[10px] text-on-surface-variant">
              {displayDate}
            </span>
          </div>
        </div>
        <button aria-label="Eliminar día" className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer">
          delete
        </button>
      </header>

      <div className="p-md space-y-lg">
        {/* Summary Section */}
        <div className="grid grid-cols-2 gap-sm">
          <div className="bg-surface-container-low border border-outline-variant p-md flex items-center gap-md">
            <span className="material-symbols-outlined text-primary-fixed text-2xl">groups</span>
            <div>
              <p className="font-label-caps text-[9px] text-on-surface-variant uppercase">Total Sessions</p>
              <p className="font-data-display text-headline-md text-on-surface">{mockSessions.length}</p>
            </div>
          </div>
          <div className="bg-surface-container-low border border-outline-variant p-md flex items-center gap-md">
            <span className="material-symbols-outlined text-primary-fixed text-2xl">fitness_center</span>
            <div>
              <p className="font-label-caps text-[9px] text-on-surface-variant uppercase">Total Volume</p>
              <p className="font-data-display text-headline-md text-on-surface">12,450 KG</p>
            </div>
          </div>
        </div>

        {/* Session Cards */}
        {mockSessions.map((session) => (
          <div
            key={session.id}
            className={`bg-surface-container/50 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-md border-l-4 ${session.color}`}
          >
            {/* Session Header */}
            <div className="flex justify-between items-start mb-md">
              <div>
                <span className={`font-label-caps text-label-caps ${session.typeColor}`}>
                  {session.type}
                </span>
                <h4 className="font-headline-md text-headline-md text-on-surface">
                  {session.title}
                </h4>
              </div>
              <span className={`material-symbols-outlined ${session.typeColor}`} style={session.iconFill ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                {session.icon}
              </span>
            </div>

            {/* Stats Grid */}
            {session.stats && (
              <div className="grid grid-cols-3 gap-sm mb-md">
                {session.stats.map((stat) => (
                  <div key={stat.label} className="bg-surface-container-highest p-sm">
                    <p className="font-label-caps text-[8px] text-on-surface-variant">{stat.label}</p>
                    <p className="font-data-display text-data-display">{stat.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* HR Bar */}
            {session.hrAvg && (
              <div className="space-y-xs mb-md">
                <div className="flex justify-between font-label-caps text-[10px]">
                  <span>HEART RATE AVG</span>
                  <span className="font-data-display">{session.hrAvg}</span>
                </div>
                <div className="h-1 bg-surface-container-highest w-full overflow-hidden">
                  <div className="h-full bg-primary-fixed" style={{ width: `${session.hrPct}%` }} />
                </div>
              </div>
            )}

            {/* Total Volume Display */}
            {session.totalVolume && (
              <div className="bg-surface-container-highest p-md mb-md">
                <p className="font-label-caps text-[9px] text-on-surface-variant mb-xs">TOTAL VOLUME</p>
                <p className="font-data-display text-display-lg text-primary-fixed leading-none">
                  {session.totalVolume.split(' ')[0]}<span className="text-sm"> {session.totalVolume.split(' ')[1]}</span>
                </p>
              </div>
            )}

            {/* Exercise List */}
            {session.exercises && (
              <div className="space-y-xs">
                {session.exercises.map((ex, i) => (
                  <div
                    key={ex.name}
                    className={`flex justify-between items-center py-xs ${
                      i < session.exercises!.length - 1 ? 'border-b border-outline-variant/30' : ''
                    }`}
                  >
                    <span className="font-body-lg text-sm text-on-surface">{ex.name}</span>
                    <span className="font-data-display text-sm text-on-surface-variant">{ex.sets}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-sm">
          {recoveryMetrics.map((metric) => (
            <div key={metric.label} className="bg-surface-container-low border border-outline-variant p-sm flex items-center gap-sm">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">{metric.icon}</span>
              <div>
                <p className="font-label-caps text-[8px] text-on-surface-variant">{metric.label}</p>
                <p className="font-data-display text-sm text-on-surface">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Nutrition Summary */}
        <div className="bg-surface-container/50 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-md relative overflow-hidden">
          <div className="flex justify-between items-center mb-md">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 bg-primary-fixed/10 border border-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-fixed text-lg">restaurant</span>
              </div>
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant">NUTRITION LOG</span>
                <h4 className="font-headline-md text-headline-md text-on-surface">DAILY INTAKE</h4>
              </div>
            </div>
            <div className="text-right">
              <p className="font-data-display text-headline-md text-on-surface">
                {nutrition.calories.toLocaleString()} <span className="text-sm font-label-caps">KCAL</span>
              </p>
              <p className="font-label-caps text-[9px] text-on-surface-variant">{nutrition.targetPct}% OF TARGET</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-md">
            {([
              { label: 'PROTEIN', ...nutrition.protein },
              { label: 'CARBS', ...nutrition.carbs },
              { label: 'FATS', ...nutrition.fats },
            ] as const).map((macro) => (
              <div className="space-y-xs" key={macro.label}>
                <div className="flex justify-between font-label-caps text-[10px]">
                  <span>{macro.label}</span>
                  <span className="font-data-display">{macro.value}</span>
                </div>
                <div className="h-2 bg-surface-container-highest overflow-hidden">
                  <div className={`h-full ${macro.color}`} style={{ width: `${Math.min(macro.pct, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 30-Day Performance Strip */}
        <div className="pt-md border-t border-outline-variant">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-md">
            LAST 30 DAYS PERFORMANCE
          </h3>
          <div className="flex gap-1 overflow-x-auto scrollbar-thin pb-sm">
            {Array.from({ length: 30 }, (_, i) => {
              const intensity = Math.random()
              const color =
                intensity > 0.8
                  ? 'bg-primary-fixed'
                  : intensity > 0.4
                    ? 'bg-primary-fixed/50'
                    : 'bg-surface-container-highest'
              return (
                <div
                  key={i}
                  className={`w-7 h-7 shrink-0 ${color} border border-surface`}
                  title={`Day -${30 - i}`}
                />
              )
            })}
          </div>
          <div className="flex justify-between items-center mt-xs">
            <span className="font-label-caps text-[9px] text-on-surface-variant">MES ANTERIOR</span>
            <span className="font-label-caps text-[9px] text-on-surface-variant">MES ACTUAL</span>
          </div>
        </div>
      </div>

    </div>
  )
}
