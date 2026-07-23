import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


const TOTAL_STEPS = 4

const STEP_LABELS = [
  'PASO 1: DATOS BÁSICOS',
  'PASO 2: OBJETIVO PRINCIPAL',
  'PASO 3: TUS DISCIPLINAS',
  'PASO 4: PLANIFICACIÓN',
]

const GOALS = [
  { id: 'goal-1', icon: 'fitness_center', title: 'Ganar Músculo', sub: 'Hipertrofia & Fuerza' },
  { id: 'goal-2', icon: 'bolt', title: 'Mantener', sub: 'Acondicionamiento Técnico' },
  { id: 'goal-3', icon: 'local_fire_department', title: 'Bajar Grasa', sub: 'Definición & Resistencia' },
]

const DISCIPLINES = [
  { id: 'discipline-fuerza', icon: 'weight', label: 'Fuerza' },
  { id: 'discipline-striking', icon: 'sports_kabaddi', label: 'Striking' },
  { id: 'discipline-grappling', icon: 'settings_accessibility', label: 'Grappling' },
]

export default function InitialSetupWizard() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isFinalizing, setIsFinalizing] = useState(false)

  // Form state
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [edad, setEdad] = useState('')
  const [sexo, setSexo] = useState('Masculino')
  const [goal, setGoal] = useState('goal-1')
  const [disciplines, setDisciplines] = useState<Record<string, boolean>>({})
  const [sessions, setSessions] = useState(4)
  const [bloque, setBloque] = useState<'AM' | 'PM'>('PM')

  const toggleDiscipline = (id: string) => {
    setDisciplines((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsFinalizing(true)
      setTimeout(() => navigate('/dashboard'), 1200)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen grid-bg relative">
      <style>{`
        .grid-bg {
          background-image:
            linear-gradient(rgba(var(--color-primary-fixed) / 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--color-primary-fixed) / 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          background-color: var(--color-surface-dim);
        }
        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          background: var(--color-surface-variant);
          height: 4px;
          border-radius: 2px;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 2px;
          background: var(--color-primary-fixed);
          cursor: pointer;
        }
        .neo-checkbox:checked + label {
          border-color: var(--color-primary-fixed);
          background: rgba(var(--color-primary-fixed) / 0.1);
        }
        .step-transition {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* Top AppBar */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-surface/80 border-b border-surface-variant h-16 flex items-center px-5">
        <div className="flex justify-between items-center w-full max-w-[1440px] mx-auto">
          <h1 className="font-mono text-sm text-white tracking-tighter uppercase">OSMIO</h1>
          <div className="flex items-center gap-4">
            <button
              aria-label="Ayuda"
              className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary text-[24px]"
            >
              help
            </button>
            <div className="w-8 h-8 rounded-full border border-white/20 bg-surface-container-high overflow-hidden flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                person
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-5 max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-10">
          <div className="flex justify-between items-end mb-2">
            <span className="font-mono text-xs text-white uppercase tracking-widest">
              {STEP_LABELS[currentStep - 1]}
            </span>
            <span className="font-mono text-sm text-white/50">
              0{currentStep} / 0{TOTAL_STEPS}
            </span>
          </div>
          <div
            className="flex gap-1 h-1 w-full bg-surface-variant"
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={TOTAL_STEPS}
            aria-label={`Paso ${currentStep} de ${TOTAL_STEPS}`}
          >
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className={`h-full w-1/4 transition-all duration-500 ${
                  i + 1 <= currentStep ? 'bg-primary-fixed' : 'bg-surface-container'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative">
          {/* Step 1: Datos Básicos */}
          {currentStep === 1 && (
            <section className="step-transition">
              <div className="mb-6">
                <h2 className="text-[24px] leading-[1.2] font-bold text-white mb-1">
                  Bienvenido, Recluta
                </h2>
                <p className="text-on-surface-variant text-base leading-relaxed">
                  Configura tu perfil biológico para calibrar los algoritmos de rendimiento.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1 space-y-1">
                  <label className="font-mono text-xs text-on-surface-variant block uppercase tracking-widest">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="75.0"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    className="w-full bg-surface-container border border-surface-variant p-4 focus:border-primary-fixed focus:ring-0 text-white font-mono text-sm outline-none"
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <label className="font-mono text-xs text-on-surface-variant block uppercase tracking-widest">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    placeholder="180"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                    className="w-full bg-surface-container border border-surface-variant p-4 focus:border-primary-fixed focus:ring-0 text-white font-mono text-sm outline-none"
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <label className="font-mono text-xs text-on-surface-variant block uppercase tracking-widest">
                    Edad
                  </label>
                  <input
                    type="number"
                    placeholder="28"
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                    className="w-full bg-surface-container border border-surface-variant p-4 focus:border-primary-fixed focus:ring-0 text-white font-mono text-sm outline-none"
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <label className="font-mono text-xs text-on-surface-variant block uppercase tracking-widest">
                    Sexo
                  </label>
                  <select
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value)}
                    className="w-full bg-surface-container border border-surface-variant p-4 focus:border-primary-fixed focus:ring-0 text-white appearance-none outline-none"
                  >
                    <option>Masculino</option>
                    <option>Femenino</option>
                    <option>Otro</option>
                  </select>
                </div>
              </div>
            </section>
          )}

          {/* Step 2: Objetivo */}
          {currentStep === 2 && (
            <section className="step-transition">
              <div className="mb-6">
                <h2 className="text-[24px] leading-[1.2] font-bold text-white mb-1">
                  Objetivo Principal
                </h2>
                <p className="text-on-surface-variant text-base leading-relaxed">
                  Define el vector de tu evolución física actual.
                </p>
              </div>
              <div className="space-y-4">
                {GOALS.map((g) => (
                  <label
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setGoal(g.id) }}
                    className={`flex items-center gap-4 p-6 bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl cursor-pointer transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      goal === g.id
                        ? 'border-primary-fixed bg-primary-fixed/5'
                        : 'border-outline-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-primary-fixed text-4xl">
                      {g.icon}
                    </span>
                    <div>
                      <span className="text-[20px] leading-[1.4] font-semibold block text-white">
                        {g.title}
                      </span>
                      <span className="text-[11px] text-on-surface-variant uppercase tracking-widest">
                        {g.sub}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          )}

          {/* Step 3: Disciplinas */}
          {currentStep === 3 && (
            <section className="step-transition">
              <div className="mb-6">
                <h2 className="text-[24px] leading-[1.2] font-bold text-white mb-1">
                  Tus Disciplinas
                </h2>
                <p className="text-on-surface-variant text-base leading-relaxed">
                  Selecciona las áreas de combate que integras en tu régimen.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {DISCIPLINES.map((d) => {
                  const selected = !!disciplines[d.id]
                  return (
                    <div key={d.id}>
                      <button
                        type="button"
                        onClick={() => toggleDiscipline(d.id)}
                        aria-pressed={selected}
                        className={`flex flex-col items-center justify-center p-10 bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl cursor-pointer transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aspect-square text-center w-full ${
                          selected
                            ? 'border-primary-fixed bg-primary-fixed/10'
                            : 'border-outline-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined text-3xl mb-4">
                          {d.icon}
                        </span>
                        <span className="font-mono text-xs uppercase tracking-widest">
                          {d.label}
                        </span>
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Step 4: Planificación */}
          {currentStep === 4 && (
            <section className="step-transition">
              <div className="mb-6">
                <h2 className="text-[24px] leading-[1.2] font-bold text-white mb-1">
                  Planificación
                </h2>
                <p className="text-on-surface-variant text-base leading-relaxed">
                  Establece el volumen de fuego semanal y tu bloque de enfoque.
                </p>
              </div>
              <div className="space-y-10">
                {/* Sessions slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-xs text-white uppercase tracking-widest">
                      Sesiones por semana
                    </label>
                    <span className="font-mono text-xl text-primary-fixed">{sessions}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={7}
                    value={sessions}
                    onChange={(e) => setSessions(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-[11px] text-on-surface-variant px-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <span key={n}>{n}</span>
                    ))}
                  </div>
                </div>

                {/* Bloque Intensivo */}
                <div className="space-y-4">
                  <label className="font-mono text-xs text-white uppercase tracking-widest block">
                    Bloque Intensivo
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBloque('AM')}
                      aria-pressed={bloque === 'AM'}
                      className={`p-4 border font-mono text-xs text-left transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        bloque === 'AM'
                          ? 'bg-primary-fixed/5 border-primary-fixed text-white'
                          : 'bg-surface-container border-outline-variant text-white/40'
                      }`}
                    >
                      AM <br />
                      <span className={bloque === 'AM' ? 'text-primary-fixed/60' : 'text-white/40'}>
                        05:00 - 09:00
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBloque('PM')}
                      aria-pressed={bloque === 'PM'}
                      className={`p-4 border font-mono text-xs text-left transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        bloque === 'PM'
                          ? 'bg-primary-fixed/5 border-primary-fixed text-white'
                          : 'bg-surface-container border-outline-variant text-white/40'
                      }`}
                    >
                      PM <br />
                      <span className={bloque === 'PM' ? 'text-primary-fixed/60' : 'text-white/40'}>
                        17:00 - 21:00
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 flex gap-4">
            {currentStep > 1 && (
              <button
                onClick={handlePrev}
                className="flex-1 border border-primary-fixed py-4 font-mono text-xs text-primary-fixed uppercase tracking-widest hover:bg-primary-fixed/10 transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                ATRÁS
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isFinalizing}
              className={`flex-[2] py-4 font-mono text-xs uppercase tracking-widest transition-all duration-200 active:scale-[0.98] disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                currentStep === TOTAL_STEPS
                  ? 'bg-primary-fixed text-on-primary hover:opacity-90'
                  : 'bg-primary-fixed text-on-primary hover:opacity-90'
              }`}
            >
              {isFinalizing
                ? 'SINCRONIZANDO...'
                : currentStep === TOTAL_STEPS
                  ? 'FINALIZAR SETUP'
                  : 'SIGUIENTE'}
            </button>
          </div>
        </div>
      </main>

      {/* Footer loading line */}
      <div className="fixed bottom-0 left-0 w-full h-1 overflow-hidden">
        <div className="h-full bg-primary-fixed/20">
          <div
            className="h-full bg-primary-fixed transition-all duration-700"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
