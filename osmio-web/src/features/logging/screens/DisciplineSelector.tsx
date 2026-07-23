import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Discipline = 'fuerza' | 'striking' | 'grappling'
type TrainingType = 'tecnica' | 'fisica' | 'sparring'

const disciplines: {
  id: Discipline
  label: string
  icon: string
  subtitle: string
}[] = [
  { id: 'striking', label: 'Striking', icon: 'sports_mma', subtitle: 'Boxeo, Muay Thai, Kickboxing' },
  { id: 'fuerza', label: 'Mixed', icon: 'swords', subtitle: 'Fuerza + Combate integrado' },
  { id: 'grappling', label: 'Grappling', icon: 'front_hand', subtitle: 'BJJ, Lucha, Submission' },
]

const trainingTypes: {
  id: TrainingType
  label: string
  icon: string
}[] = [
  { id: 'tecnica', label: 'Técnica', icon: 'precision_manufacturing' },
  { id: 'fisica', label: 'Física', icon: 'monitor_heart' },
  { id: 'sparring', label: 'Sparring', icon: 'swords' },
]

const equipmentMap: Record<Discipline, { icon: string; label: string }[]> = {
  fuerza: [
    { icon: 'fitness_center', label: 'POWER RACK' },
    { icon: 'spa', label: 'MAGNESIO' },
    { icon: 'shield', label: 'CINTURÓN' },
  ],
  striking: [
    { icon: 'sports_mma', label: 'GUANTES 16OZ' },
    { icon: 'shield', label: 'PROTECTOR BUCAL' },
    { icon: 'timer', label: 'CRONÓMETRO RONDAS' },
  ],
  grappling: [
    { icon: 'checkroom', label: 'GI / NO-GI GEAR' },
    { icon: 'layers', label: 'TAPETE HIGIENIZADO' },
    { icon: 'shield', label: 'RODILLERAS' },
  ],
}

export default function DisciplineSelector() {
  const navigate = useNavigate()
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>('striking')
  const [trainingType, setTrainingType] = useState<TrainingType | null>(null)

  const handleStart = () => {
    if (!trainingType) return
    if (selectedDiscipline === 'fuerza') {
      navigate('/logging/strength')
    } else {
      navigate('/logging/combat')
    }
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <main className="px-5 pt-6 space-y-6">
        <div className="space-y-2">
          <p className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-on-surface-variant flex items-center gap-1">
            <span className="w-1 h-3 bg-primary-fixed inline-block" />
            SISTEMA DE PREPARACIÓN DE COMBATE
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              aria-label="Volver"
              className="w-10 h-10 flex items-center justify-center border border-outline-variant/20 hover:bg-surface-container-high transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
            >
              <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
            </button>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface uppercase tracking-tight">
              Nueva Sesión
            </h1>
          </div>
        </div>

        <p className="font-body-lg text-on-surface-variant">¿Qué vas a entrenar?</p>

        {/* Discipline Cards */}
        <div className="grid grid-cols-3 gap-3">
          {disciplines.map((d) => {
            const isSelected = selectedDiscipline === d.id
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDiscipline(d.id)}
                className={`
                  flex flex-col items-center justify-center gap-3 p-4 border transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer
                  ${
                    isSelected
                      ? 'border-primary bg-surface-container-high shadow-[0_0_12px_rgba(212,240,0,0.15)]'
                      : 'border-outline-variant/20 bg-surface-container hover:border-outline/30'
                  }
                `}
              >
                <span
                  className={`material-symbols-outlined text-[32px] ${
                    isSelected ? 'text-primary-fixed' : 'text-on-surface-variant'
                  }`}
                >
                  {d.icon}
                </span>
                <div className="text-center">
                  <span
                    className={`font-label-caps text-[12px] leading-none tracking-[0.1em] uppercase ${
                      isSelected ? 'text-on-surface' : 'text-on-surface-variant'
                    }`}
                  >
                    {d.label}
                  </span>
                  <p className="font-label-sm text-[11px] leading-none text-on-surface-variant mt-1 opacity-70">
                    {d.subtitle}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Training Type Section */}
        <div className="space-y-3">
          <p className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-on-surface-variant uppercase">
            Tipo de Entrenamiento
          </p>
          <div className="grid grid-cols-3 gap-3">
            {trainingTypes.map((t) => {
              const isSelected = trainingType === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTrainingType(isSelected ? null : t.id)}
                  className={`
                    flex flex-col items-center justify-center gap-2 p-3 border transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer
                    ${
                      isSelected
                        ? 'border-primary bg-primary-fixed/10 text-primary-fixed'
                        : 'border-outline-variant/20 bg-surface-container text-on-surface-variant hover:border-outline/30'
                    }
                  `}
                >
                  <span className="material-symbols-outlined text-[24px]">{t.icon}</span>
                  <span className="font-label-caps text-[10px] leading-none tracking-[0.1em] uppercase">
                    {t.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Equipment Required */}
        <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-4 space-y-3">
          <p className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-on-surface-variant uppercase">
            Material Requerido
          </p>
          <div className="flex flex-wrap gap-2">
            {equipmentMap[selectedDiscipline].map((item) => (
              <span
                key={item.label}
                className="px-3 py-2 bg-surface-container-high border border-outline-variant/20 font-label-sm text-[11px] leading-none flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </div>
        </div>

        {/* Selection hint */}
        {!trainingType && (
          <p className="text-center font-label-sm text-[11px] leading-none text-on-surface-variant opacity-50">
            Selecciona tu disciplina y tipo para comenzar
          </p>
        )}

        {/* Start CTA */}
        <button
          onClick={handleStart}
          disabled={!trainingType}
          className={`
            w-full h-14 flex items-center justify-center gap-2 font-label-caps text-[12px] leading-none tracking-[0.1em] uppercase transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer
            ${
              trainingType
                ? 'bg-primary-fixed text-on-primary hover:opacity-90 active:scale-[0.98] hover:shadow-[0_0_30px_rgba(212,240,0,0.4)]'
                : 'bg-surface-container-high text-on-surface-variant opacity-40 cursor-not-allowed'
            }
          `}
        >
          INICIAR SESIÓN
          <span className="material-symbols-outlined text-[20px]">play_arrow</span>
        </button>
      </main>
    </div>
  )
}
