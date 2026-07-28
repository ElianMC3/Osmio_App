import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { GreenCard } from '@/design-system/components/GreenCard'
import { GreenButton } from '@/design-system/components/GreenButton'
import { GreenProgress } from '@/design-system/components/GreenProgress'
import { GreenTag } from '@/design-system/components/GreenTag'
type Period = '1w' | '1m' | '3m'

const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function getHeatColor(level: number): string {
  switch (level) {
    case 0: return 'bg-panel'
    case 1: return 'bg-green/20'
    case 2: return 'bg-green-dim'
    case 3: return 'bg-green'
    default: return 'bg-panel'
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
            Análisis - Mapa de Consistencia
          </h1>
          <span className="font-label-caps text-[10px] text-text-muted">
            Tu actividad reciente
          </span>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex items-center border-b border-green/20 px-md">
        {([
          { key: 'fuerza', label: 'Fuerza', path: '/analysis/strength' },
          { key: 'carga', label: 'Carga de Combate', path: '/analysis/combat' },
          { key: 'consistencia', label: 'Consistencia', path: '/analysis/consistency' },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => navigate(tab.path)}
            className={`pb-sm px-md font-label-caps text-label-caps transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green cursor-pointer ${
              tab.key === 'consistencia'
                ? 'text-green border-b-2 border-green'
                : 'text-text-muted hover:text-text-green'
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
            <GreenButton
              key={p.key}
              variant={activePeriod === p.key ? 'primary' : 'default'}
              size="sm"
              effects
              onClick={() => setActivePeriod(p.key)}
            >
              {p.label}
            </GreenButton>
          ))}
        </div>

        {/* Current Period Info */}
        <p className="font-label-caps text-[10px] text-text-muted uppercase tracking-widest">
          Período actual: {activePeriod === '1w' ? 'Última semana' : activePeriod === '1m' ? 'Último mes' : 'Últimos 3 meses'}
        </p>

        {/* Heatmap */}
        <GreenCard padding="md" effects>
          <div className="flex items-center justify-between mb-md">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-green">calendar_view_month</span>
              <h3 className="font-label-caps text-text-green">VOLUMEN DE ENTRENAMIENTO</h3>
            </div>
            <div className="flex items-center gap-xs">
              <span className="font-label-caps text-[8px] text-text-muted mr-xs">MENOS</span>
              {[
                'bg-panel',
                'bg-green/20',
                'bg-green-dim',
                'bg-green',
                'bg-green',
              ].map((color, i) => (
                <div key={i} className={`w-2.5 h-2.5 ${color}`} />
              ))}
              <span className="font-label-caps text-[8px] text-text-muted ml-xs">MÁS</span>
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
                      className="h-3 flex items-center text-[8px] font-label-caps text-text-muted"
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
        </GreenCard>

        {/* Streak Cards */}
        <div className="grid grid-cols-2 gap-sm">
          <GreenCard variant="default" padding="md" effects>
            <div className="flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-sm opacity-20 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-green text-[32px]">local_fire_department</span>
              </div>
              <span className="font-label-caps text-text-muted mb-xs">RACHA ACTUAL</span>
              <div className="flex items-baseline gap-xs">
                <span className="font-label-caps text-[36px] text-green leading-none">14</span>
                <span className="font-headline-md text-text-green">DÍAS</span>
              </div>
              <p className="text-[10px] text-text-muted mt-xs">
                Nivel: <span className="text-green">Alto</span>
              </p>
            </div>
          </GreenCard>

          <GreenCard variant="default" padding="md" effects className="border-l-4 border-l-green">
            <div className="flex flex-col justify-center">
              <span className="font-label-caps text-text-muted mb-xs">MEJOR MARCA</span>
              <div className="flex items-baseline gap-xs">
                <span className="font-label-caps text-[36px] text-text-green leading-none">42</span>
                <span className="font-headline-md text-text-muted">DÍAS</span>
              </div>
              <p className="text-[10px] text-text-muted mt-xs">Octubre 2025</p>
            </div>
          </GreenCard>
        </div>

        {/* Compliance Gauge */}
        <GreenCard padding="md" effects>
          <div className="flex justify-between items-center mb-md">
            <span className="font-label-caps text-text-muted">CUMPLIMIENTO (4 SEMANAS)</span>
            <span className="material-symbols-outlined text-green">track_changes</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 flex items-center justify-center" role="progressbar" aria-valuenow={92} aria-valuemin={0} aria-valuemax={100} aria-label="Cumplimiento: 92%">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-panel"
                  cx="80"
                  cy="80"
                  fill="transparent"
                  r="68"
                  stroke="currentColor"
                  strokeWidth="10"
                />
                <circle
                  className="text-green transition-all duration-1000 ease-out"
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
                <span className="font-label-caps text-[36px] text-text-green leading-none">
                  92<span className="text-headline-md">%</span>
                </span>
                <span className="font-label-caps text-[9px] text-text-muted mt-xs">
                  META ALCANZADA
                </span>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-sm mt-md">
              <GreenCard variant="default" padding="sm" effects>
                <p className="font-label-caps text-[8px] text-text-muted">PROX. SESIÓN</p>
                <p className="font-label-caps text-sm text-text-green">MAÑANA</p>
              </GreenCard>
              <GreenCard variant="default" padding="sm" effects>
                <p className="font-label-caps text-[8px] text-text-muted">TENDENCIA</p>
                <p className="font-label-caps text-sm text-green">▲ 4%</p>
              </GreenCard>
            </div>
          </div>
        </GreenCard>

        {/* Insights Card */}
        <GreenCard variant="glass" padding="md" effects>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined text-[100px]">psychology</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-sm mb-md">
              <span className="material-symbols-outlined text-green">lightbulb</span>
              <h3 className="font-label-caps font-bold text-green">ANALYSIS_INSIGHT</h3>
            </div>
            <p className="font-headline-md mb-md italic leading-tight text-text-green">
              "Llevas un 92% de consistencia en el bloque intensivo."
            </p>
            <p className="text-sm font-medium opacity-80 border-t border-green/20 pt-md text-text-muted">
              Estás superando el promedio de tu categoría por un 12.4%. Mantener este ritmo durante 6 días más activará el multiplicador de rendimiento.
            </p>
          </div>
        </GreenCard>

        {/* Discipline Distribution */}
        <GreenCard padding="md" effects>
          <h4 className="font-label-caps text-text-green mb-md">DISTRIBUCIÓN DE DISCIPLINA</h4>
          <div className="space-y-sm">
            {[
              { label: 'STRIKING', pct: 45 },
              { label: 'GRAPPLING', pct: 35 },
              { label: 'FUERZA', pct: 20 },
            ].map((item) => (
              <GreenProgress key={item.label} value={item.pct} label={item.label} showValue size="sm" effects />
            ))}
          </div>
        </GreenCard>

        {/* Footer Stats */}
        <div className="grid grid-cols-2 gap-sm pt-md border-t border-green/20">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-label-caps text-[9px] text-text-muted">{stat.label}</p>
              <p className={`font-label-caps text-headline-md ${stat.isError ? 'text-error' : 'text-text-green'}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
