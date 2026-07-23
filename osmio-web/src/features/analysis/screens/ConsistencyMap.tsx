import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
type Period = '1w' | '1m' | '3m'

const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function getHeatColor(level: number): string {
  switch (level) {
    case 0: return 'bg-surface-container-highest'
    case 1: return 'bg-primary-container'
    case 2: return 'bg-primary-fixed-dim'
    case 3: return 'bg-primary-fixed'
    default: return 'bg-surface-container-highest'
  }
}

function generateHeatmapData(): number[][] {
  const weeks: number[][] = []
  for (let w = 0; w < 20; w++) {
    const week: number[] = []
    for (let d = 0; d < 7; d++) {
      const r = Math.random()
      if (r < 0.15) week.push(0)
      else if (r < 0.4) week.push(1)
      else if (r < 0.7) week.push(2)
      else week.push(3)
    }
    weeks.push(week)
  }
  // Ensure last 2 weeks have high activity
  weeks[weeks.length - 1] = [3, 3, 2, 3, 3, 1, 0]
  weeks[weeks.length - 2] = [2, 3, 3, 2, 3, 2, 1]
  return weeks
}

export default function ConsistencyMap() {
  const navigate = useNavigate()
  const [activePeriod, setActivePeriod] = useState<Period>('3m')
  const heatmapData = useMemo(() => generateHeatmapData(), [])

  const stats = [
    { label: 'TOTAL SESIONES (AÑO)', value: '284' },
    { label: 'HORAS ACTIVAS', value: '512.5h' },
    { label: 'MISS RATE', value: '3.2%', isError: true },
    { label: 'VOL. SEMANAL AVG', value: '14.2 TN' },
  ]

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
            Análisis - Mapa de Consistencia
          </h1>
          <span className="font-label-caps text-[10px] text-on-surface-variant">
            Tu actividad reciente
          </span>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex items-center border-b border-outline-variant px-md">
        {([
          { key: 'fuerza', label: 'Fuerza', path: '/analysis/strength' },
          { key: 'carga', label: 'Carga de Combate', path: '/analysis/combat' },
          { key: 'consistencia', label: 'Consistencia', path: '/analysis/consistency' },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => navigate(tab.path)}
            className={`pb-sm px-md font-label-caps text-label-caps transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
              tab.key === 'consistencia'
                ? 'text-primary-fixed border-b-2 border-primary-fixed'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-md space-y-lg">
        {/* Period Selectors */}
        <div className="flex gap-xs">
          {([
            { key: '1w', label: '1 Semana' },
            { key: '1m', label: '1 Mes' },
            { key: '3m', label: '3 Meses' },
          ] as const).map((p) => (
            <button
              key={p.key}
              onClick={() => setActivePeriod(p.key)}
              className={`px-md py-xs font-label-caps text-label-caps border transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                activePeriod === p.key
                  ? 'bg-primary-fixed text-on-primary border-primary-fixed font-bold'
                  : 'border-outline-variant text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Current Period Info */}
        <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">
          Período actual: {activePeriod === '1w' ? 'Última semana' : activePeriod === '1m' ? 'Último mes' : 'Últimos 3 meses'}
        </p>

        {/* Heatmap */}
        <div className="bg-surface-container-low border border-outline-variant p-md">
          <div className="flex items-center justify-between mb-md">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary-fixed">calendar_view_month</span>
              <h3 className="font-label-caps text-on-surface">VOLUMEN DE ENTRENAMIENTO</h3>
            </div>
            <div className="flex items-center gap-xs">
              <span className="font-label-caps text-[8px] text-on-surface-variant mr-xs">MENOS</span>
              {[
                'bg-surface-container-highest',
                'bg-primary-container',
                'bg-primary-fixed-dim',
                'bg-primary-fixed',
                'bg-primary-fixed',
              ].map((color, i) => (
                <div key={i} className={`w-2.5 h-2.5 ${color}`} />
              ))}
              <span className="font-label-caps text-[8px] text-on-surface-variant ml-xs">MÁS</span>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin pb-sm">
            <div className="min-w-[600px]">
              <div className="grid gap-[2px]" style={{ gridTemplateColumns: 'auto 1fr' }}>
                {/* Day labels */}
                <div className="grid gap-[2px]" style={{ gridTemplateRows: 'repeat(7, 1fr)' }}>
                  {dayLabels.map((label, i) => (
                    <div
                      key={label}
                      className="h-3 flex items-center text-[8px] font-label-caps text-on-surface-variant"
                    >
                      {i % 2 === 0 ? label : ''}
                    </div>
                  ))}
                </div>

                {/* Heatmap Grid */}
                <div
                  className="grid gap-[2px]"
                  style={{
                    gridTemplateColumns: `repeat(${heatmapData.length}, 1fr)`,
                    gridTemplateRows: 'repeat(7, 1fr)',
                  }}
                >
                  {heatmapData[0].map((_, dayIndex) =>
                    heatmapData.map((week, weekIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`aspect-square ${getHeatColor(week[dayIndex])} transition-all hover:scale-125 cursor-pointer`}
                        title={`Sem ${weekIndex + 1}, ${dayLabels[dayIndex]}: Nivel ${week[dayIndex]}`}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Streak Cards */}
        <div className="grid grid-cols-2 gap-sm">
          <div className="bg-surface-container border border-outline-variant p-md flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-sm opacity-20 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-primary-fixed text-[32px]">local_fire_department</span>
            </div>
            <span className="font-label-caps text-on-surface-variant mb-xs">RACHA ACTUAL</span>
            <div className="flex items-baseline gap-xs">
              <span className="font-data-display text-[36px] text-primary-fixed leading-none">14</span>
              <span className="font-headline-md text-on-surface">DÍAS</span>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-xs">
              Nivel: <span className="text-primary-fixed">Alto</span>
            </p>
          </div>

          <div className="bg-surface-container border border-outline-variant border-l-4 border-l-primary-fixed p-md flex flex-col justify-center">
            <span className="font-label-caps text-on-surface-variant mb-xs">MEJOR MARCA</span>
            <div className="flex items-baseline gap-xs">
              <span className="font-data-display text-[36px] text-on-surface leading-none">42</span>
              <span className="font-headline-md text-on-surface-variant">DÍAS</span>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-xs">Octubre 2025</p>
          </div>
        </div>

        {/* Compliance Gauge */}
        <div className="bg-surface-container border border-outline-variant p-md">
          <div className="flex justify-between items-center mb-md">
            <span className="font-label-caps text-on-surface-variant">CUMPLIMIENTO (4 SEMANAS)</span>
            <span className="material-symbols-outlined text-primary-fixed">track_changes</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 flex items-center justify-center" role="progressbar" aria-valuenow={92} aria-valuemin={0} aria-valuemax={100} aria-label="Cumplimiento: 92%">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-surface-container-highest"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="68"
                  stroke="currentColor"
                  strokeWidth="10"
                />
                <circle
                  className="text-primary-fixed transition-all duration-1000 ease-out"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="68"
                  stroke="currentColor"
                  strokeDasharray={2 * Math.PI * 68}
                  strokeDashoffset={2 * Math.PI * 68 * (1 - 0.92)}
                  strokeLinecap="square"
                  strokeWidth="10"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-data-display text-[36px] text-on-surface leading-none">
                  92<span className="text-headline-md">%</span>
                </span>
                <span className="font-label-caps text-[9px] text-on-surface-variant mt-xs">
                  META ALCANZADA
                </span>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-sm mt-md">
              <div className="bg-surface-container-low p-sm border border-outline-variant">
                <p className="font-label-caps text-[8px] text-on-surface-variant">PROX. SESIÓN</p>
                <p className="font-data-display text-sm">MAÑANA</p>
              </div>
              <div className="bg-surface-container-low p-sm border border-outline-variant">
                <p className="font-label-caps text-[8px] text-on-surface-variant">TENDENCIA</p>
                <p className="font-data-display text-sm text-primary-fixed">▲ 4%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Card */}
        <div className="bg-primary-fixed text-on-primary p-md relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined text-[100px]">psychology</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-sm mb-md">
              <span className="material-symbols-outlined">lightbulb</span>
              <h3 className="font-label-caps font-bold">ANALYSIS_INSIGHT</h3>
            </div>
            <p className="font-headline-md mb-md italic leading-tight">
              "Llevas un 92% de consistencia en el bloque intensivo."
            </p>
            <p className="text-sm font-medium opacity-80 border-t border-on-primary/20 pt-md">
              Estás superando el promedio de tu categoría por un 12.4%. Mantener este ritmo durante 6 días más activará el multiplicador de rendimiento.
            </p>
          </div>
        </div>

        {/* Discipline Distribution */}
        <div className="bg-surface-container border border-outline-variant p-md">
          <h4 className="font-label-caps text-on-surface mb-md">DISTRIBUCIÓN DE DISCIPLINA</h4>
          <div className="space-y-sm">
            {[
              { label: 'STRIKING', pct: 45, color: 'bg-primary-fixed' },
              { label: 'GRAPPLING', pct: 35, color: 'bg-secondary-fixed' },
              { label: 'FUERZA', pct: 20, color: 'bg-tertiary-fixed' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-[10px] font-label-caps mb-xs">
                  <span>{item.label}</span>
                  <span>{item.pct}%</span>
                </div>
                <div className="h-1 w-full bg-surface-container-highest overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="grid grid-cols-2 gap-sm pt-md border-t border-outline-variant">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-label-caps text-[9px] text-on-surface-variant">{stat.label}</p>
              <p className={`font-data-display text-headline-md ${stat.isError ? 'text-error' : 'text-on-surface'}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
