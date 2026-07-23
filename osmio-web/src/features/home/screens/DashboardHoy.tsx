
const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const WEEKDAY_LABELS = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM']
const MONTH_DAYS = [
  [0, 0, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31, 0, 0],
]

const LOGGED_DAYS = [1, 2, 3, 6, 7, 8, 10, 13, 14, 15]

const HEATMAP_DATA = [
  [0.1, 0.3, 0.2, 1, 0.5, 0.1, 0.4, 0.2, 0.1, 0, 0, 0],
  [0.2, 0.6, 0.4, 0.8, 0.3, 0.2, 0.5, 0.3, 0.2, 0.1, 0, 0],
  [0.3, 0.7, 0.5, 0.9, 0.6, 0.3, 0.6, 0.4, 0.3, 0.2, 0.1, 0],
  [0.4, 0.8, 0.6, 1, 0.7, 0.4, 0.7, 0.5, 0.4, 0.3, 0.2, 0.1],
  [0.2, 0.5, 0.3, 0.7, 0.4, 0.2, 0.3, 0.2, 0.1, 0, 0, 0],
]

const STRIKING_BARS = [1, 1, 1, 0.4, 0, 0, 0]
const GRAPPLING_BARS = [1, 1, 0, 0, 0, 0, 0]

const GRAPH_PATH = 'M0,80 L50,75 L100,85 L150,60 L200,65 L250,55 L300,50 L350,45 L400,30'
const GRAPH_FILL = 'M0,80 L50,75 L100,85 L150,60 L200,65 L250,55 L300,50 L350,45 L400,30 L400,100 L0,100 Z'

export default function DashboardHoy() {

  return (
    <div className="min-h-screen bg-surface relative">
      <style>{`
        .grid-pattern {
          background-image: linear-gradient(var(--color-surface-dim) 1px, transparent 1px), linear-gradient(90deg, var(--color-surface-dim) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>

      {/* Top AppBar */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-surface/80 border-b border-outline-variant/20 h-16 flex justify-between items-center px-5 md:px-6 max-w-[1440px] left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-on-surface tracking-tighter uppercase">OSMIO</span>
        </div>
        <div className="flex items-center gap-4">
          <button aria-label="Calendario" className="text-on-surface-variant hover:text-on-surface transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <span className="material-symbols-outlined">calendar_today</span>
          </button>
          <button aria-label="Configuración" className="text-on-surface-variant hover:text-on-surface transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/20 bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              person
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 lg:pl-64 lg:pb-8 min-h-screen grid-pattern">
        <div className="max-w-[1100px] mx-auto px-5 lg:px-10 space-y-10">
          {/* Hero: Qué toca hoy */}
          <section>
            <div className="relative overflow-hidden bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6 lg:p-10 animate-fade-in">
              {/* Background decoration */}
                <div className="absolute -right-12 -top-12 opacity-10 rotate-12">
                <span className="material-symbols-outlined text-[240px] text-on-surface">
                  sports_kabaddi
                </span>
              </div>

              <header className="mb-6 flex justify-between items-start relative z-10">
                <div>
                  <span className="font-mono text-xs text-primary-fixed uppercase tracking-widest">
                    Hoy • 10 Jul
                  </span>
                  <h2 className="text-[24px] leading-[1.2] font-bold text-on-surface mt-1 uppercase">
                    QUÉ TOCA HOY
                  </h2>
                </div>
                <div className="bg-primary-fixed/10 border border-primary-fixed/20 px-2 py-1">
                  <span className="font-mono text-xs text-primary-fixed">INTENSIDAD: ALTA</span>
                </div>
              </header>

              <div className="grid md:grid-cols-2 gap-6 items-end relative z-10">
                <div className="space-y-4">
                  <div className="flex gap-4 items-center group cursor-pointer">
                    <div className="w-12 h-12 bg-surface-container-highest flex items-center justify-center border border-outline-variant/20 group-hover:border-primary-fixed transition-colors">
                      <span className="material-symbols-outlined text-on-surface">fitness_center</span>
                    </div>
                    <div>
                      <h3 className="text-[20px] leading-[1.4] font-semibold text-on-surface">
                        Striking Technical
                      </h3>
                      <p className="text-[11px] text-on-surface-variant">
                        09:30 - 11:00 • Black House Gym
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center group cursor-pointer">
                    <div className="w-12 h-12 bg-surface-container-highest flex items-center justify-center border border-outline-variant/20 group-hover:border-primary-fixed transition-colors">
                      <span className="material-symbols-outlined text-on-surface">pending</span>
                    </div>
                    <div>
                      <h3 className="text-[20px] leading-[1.4] font-semibold text-on-surface">
                        Strength & Power
                      </h3>
                      <p className="text-[11px] text-on-surface-variant">
                        17:00 - 18:30 • High Performance Zone
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-on-surface-variant">Fatiga Acumulada</span>
                    <span className="text-primary-fixed">68%</span>
                  </div>
                  <div className="h-1 bg-surface-variant w-full">
                    <div className="h-full bg-primary-fixed w-[68%]" />
                  </div>
                  <button className="mt-4 bg-transparent border border-outline-variant/30 text-on-surface py-2 font-mono text-xs hover:bg-surface-container-high hover:text-on-surface transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary uppercase">
                    VER DETALLE SESIÓN
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Alert/Insight */}
          <section className="flex items-center gap-4 p-4 bg-error-container/20 border-l-4 border-error">
            <span className="material-symbols-outlined text-error">warning</span>
            <p className="text-[11px] md:text-base text-on-error-container">
              INSIGHT: Llevas 2 días sin grappling. Tu volumen proyectado de suelo está un 12% por
              debajo del objetivo semanal.
            </p>
          </section>

          {/* Bento Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Resumen Semanal */}
            <div className="md:col-span-8 bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-mono text-xs text-on-surface uppercase tracking-widest">
                  RESUMEN SEMANAL
                </h3>
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                  more_horiz
                </span>
              </div>
              <div className="space-y-6">
                {/* Striking */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="font-mono text-[10px] uppercase tracking-widest">STRIKING</span>
                    <span className="text-[11px] text-on-surface-variant">4.5 / 6.0 hrs</span>
                  </div>
                  <div className="flex gap-1 h-8">
                    {STRIKING_BARS.map((v, i) => (
                      <div
                        key={i}
                        className={`flex-1 ${
                          v === 1
                            ? 'bg-primary-fixed'
                            : v > 0
                              ? 'bg-primary-fixed/40'
                              : 'bg-surface-container-highest'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Grappling */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="font-mono text-[10px] uppercase tracking-widest">
                      GRAPPLING
                    </span>
                    <span className="text-[11px] text-on-surface-variant">2.0 / 5.0 hrs</span>
                  </div>
                  <div className="flex gap-1 h-8">
                    {GRAPPLING_BARS.map((v, i) => (
                      <div
                        key={i}
                        className={`flex-1 ${
                          v === 1 ? 'bg-secondary' : 'bg-surface-container-highest'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Heatmap */}
                <div className="pt-4">
                  <span className="font-mono text-[10px] text-on-surface-variant block mb-2 uppercase tracking-widest">
                    ACTIVIDAD ANUAL
                  </span>
                  <div className="grid grid-cols-12 gap-1 h-12">
                    {HEATMAP_DATA.flat().map((opacity, i) => (
                      <div
                        key={i}
                        className={`bg-primary-fixed ${opacity === 0 ? 'border border-outline-variant/30' : ''}`}
                        style={{ opacity }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Nutrition + Hydration */}
            <div className="md:col-span-4 flex flex-col gap-6">
              {/* Nutrición */}
              <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6 flex-1">
                <h3 className="font-mono text-xs text-on-surface uppercase tracking-widest mb-6">
                  NUTRICIÓN
                </h3>
                <div className="text-center mb-6">
                  <span className="font-mono text-[32px] text-on-surface">1,840</span>
                  <span className="text-[11px] text-on-surface-variant block uppercase">
                    Kcal Restantes
                  </span>
                </div>
                <div className="space-y-4">
                  <MacroRow label="Proteína" current="120g" target="210g" pct={57} color="bg-white" />
                  <MacroRow
                    label="Carbos"
                    current="180g"
                    target="400g"
                    pct={45}
                    color="bg-tertiary-fixed-dim"
                  />
                  <MacroRow
                    label="Grasas"
                    current="55g"
                    target="85g"
                    pct={64}
                    color="bg-secondary-fixed-dim"
                  />
                </div>
              </div>

              {/* Hidratación */}
              <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/20 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary-fixed">water_drop</span>
                  <div>
                    <span className="block font-mono text-xs text-on-surface uppercase tracking-widest">
                      HIDRATACIÓN
                    </span>
                    <span className="text-base">2.5L / 4.0L</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recovery Trend */}
          <section className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-mono text-xs text-on-surface uppercase tracking-widest">
                TENDENCIA RECUPERACIÓN (VFC)
              </h3>
              <div className="flex gap-2">
                <span className="px-2 py-1 border border-primary-fixed/20 text-[10px] text-primary-fixed uppercase font-mono">
                  OPTIMAL ZONE
                </span>
              </div>
            </div>
            <div className="relative h-48 w-full border-b border-l border-surface-variant flex items-end">
              <svg
                className="w-full h-full absolute inset-0"
                preserveAspectRatio="none"
                viewBox="0 0 400 100"
              >
                <defs>
                  <linearGradient id="graphGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary-fixed)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path d={GRAPH_PATH} fill="none" stroke="var(--color-primary-fixed)" strokeWidth="1.5" />
                <path d={GRAPH_FILL} fill="url(#graphGradient)" opacity="0.2" />
                <rect fill="#fff" height="4" width="4" x="-2" y="78" />
                <rect fill="#fff" height="4" width="4" x="148" y="58" />
                <rect fill="var(--color-primary-fixed)" height="4" width="4" x="398" y="28" />
              </svg>
              <div className="flex w-full justify-between px-2 pb-2 text-[10px] text-on-surface-variant font-mono relative z-10">
                {WEEKDAY_LABELS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>
          </section>

          {/* Monthly Calendar */}
          <section className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-mono text-xs text-on-surface uppercase tracking-widest">
                JULIO 2026
              </h3>
              <div className="flex gap-2 items-center">
                <span className="text-[11px] text-on-surface-variant">
                  {LOGGED_DAYS.length} días registrados
                </span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="text-center font-mono text-[10px] text-on-surface-variant uppercase pb-2"
                >
                  {d}
                </div>
              ))}
              {MONTH_DAYS.flat().map((day, i) => (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center text-sm ${
                    day === 0
                      ? ''
                      : LOGGED_DAYS.includes(day)
                        ? 'bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/30'
                        : 'text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200 cursor-pointer'
                  }`}
                >
                  {day > 0 ? day : ''}
                </div>
              ))}
            </div>
          </section>

          {/* Training Streak */}
          <section className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary-fixed text-4xl">
                local_fire_department
              </span>
              <div className="flex-1">
                <h3 className="font-mono text-xs text-on-surface uppercase tracking-widest">
                  RACHA DE ENTRENAMIENTO
                </h3>
                <div className="flex gap-6 mt-2">
                  <div>
                    <span className="font-mono text-2xl text-on-surface">12</span>
                    <span className="text-[11px] text-on-surface-variant block">días actual</span>
                  </div>
                  <div>
                    <span className="font-mono text-2xl text-primary-fixed">21</span>
                    <span className="text-[11px] text-on-surface-variant block">mejor racha</span>
                  </div>
                  <div>
                    <span className="font-mono text-2xl text-on-surface">87%</span>
                    <span className="text-[11px] text-on-surface-variant block">consistencia</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FAB */}
      <button aria-label="Agregar nueva sesión" className="fixed right-5 bottom-24 lg:bottom-10 bg-primary-fixed text-on-primary w-14 h-14 rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary z-50">
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>
    </div>
  )
}

function MacroRow({
  label,
  current,
  target,
  pct,
  color,
}: {
  label: string
  current: string
  target: string
  pct: number
  color: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-on-surface-variant uppercase">{label}</span>
        <span>
          {current} / {target}
        </span>
      </div>
      <div className="h-1 bg-surface-variant rounded-full overflow-hidden">
        <div className={`h-full ${color} w-[${pct}%]`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
