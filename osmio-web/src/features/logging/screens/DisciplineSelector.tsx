import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GreenCard } from '../../../design-system/components/GreenCard'
import { GreenButton } from '../../../design-system/components/GreenButton'
import { GreenTag } from '../../../design-system/components/GreenTag'

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
    const state = { discipline: selectedDiscipline, trainingType }
    if (selectedDiscipline === 'fuerza') {
      navigate('/logging/strength', { state })
    } else {
      navigate('/logging/combat', { state })
    }
  }

  return (
    <div className="min-h-screen pb-32">
      <main className="px-5 pt-6 space-y-6">
        <div className="space-y-2">
          <p className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-text-muted flex items-center gap-1">
            <span className="w-1 h-3 bg-green inline-block" />
            SISTEMA DE PREPARACIÓN DE COMBATE
          </p>
          <div className="flex items-center gap-3">
            <GreenButton
              onClick={() => navigate(-1)}
              variant="ghost"
              size="md"
              effects={true}
              aria-label="Volver"
              className="flex items-center justify-center w-10 h-10"
            >
              <span className="material-symbols-outlined text-text-muted">arrow_back</span>
            </GreenButton>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-text-green uppercase tracking-tight">
              Nueva Sesión
            </h1>
          </div>
        </div>

        <p className="font-body-lg text-text-muted">¿Qué vas a entrenar?</p>

        {/* Discipline Cards */}
        <div className="grid grid-cols-3 gap-3">
          {disciplines.map((d) => {
            const isSelected = selectedDiscipline === d.id
            return (
              <GreenCard
                key={d.id}
                onClick={() => setSelectedDiscipline(d.id)}
                variant={isSelected ? 'glass' : 'default'}
                padding="md"
                effects={true}
                className="flex flex-col items-center justify-center gap-3 cursor-pointer"
              >
                <span
                  className={`material-symbols-outlined text-[32px] ${
                    isSelected ? 'text-green' : 'text-text-muted'
                  }`}
                >
                  {d.icon}
                </span>
                <div className="text-center">
                  <span
                    className={`font-label-caps text-[12px] leading-none tracking-[0.1em] uppercase ${
                      isSelected ? 'text-text-green' : 'text-text-muted'
                    }`}
                  >
                    {d.label}
                  </span>
                  <p className="font-label-sm text-[11px] leading-none text-text-muted mt-1 opacity-70">
                    {d.subtitle}
                  </p>
                </div>
              </GreenCard>
            )
          })}
        </div>

        {/* Training Type Section */}
        <div className="space-y-3">
          <p className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-text-muted uppercase">
            Tipo de Entrenamiento
          </p>
          <div className="grid grid-cols-3 gap-3">
            {trainingTypes.map((t) => {
              const isSelected = trainingType === t.id
              return (
                <GreenButton
                  key={t.id}
                  onClick={() => setTrainingType(isSelected ? null : t.id)}
                  variant={isSelected ? 'primary' : 'default'}
                  size="sm"
                  fullWidth
                  effects={true}
                  className="flex flex-col items-center justify-center gap-1 h-auto py-3"
                >
                  <span className="material-symbols-outlined text-[24px]">{t.icon}</span>
                  <span>{t.label}</span>
                </GreenButton>
              )
            })}
          </div>
        </div>

        {/* Equipment Required */}
        <GreenCard variant="glass" padding="md" effects={true}>
          <div className="space-y-3">
            <p className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-text-muted uppercase">
              Material Requerido
            </p>
            <div className="flex flex-wrap gap-2">
              {equipmentMap[selectedDiscipline].map((item) => (
                <GreenTag key={item.label} color="green" variant="outlined" effects={true}>
                  <span className="material-symbols-outlined text-[12px]">{item.icon}</span>
                  {item.label}
                </GreenTag>
              ))}
            </div>
          </div>
        </GreenCard>

        {/* Selection hint */}
        {!trainingType && (
          <p className="text-center font-label-sm text-[11px] leading-none text-text-muted opacity-50">
            Selecciona tu disciplina y tipo para comenzar
          </p>
        )}

        {/* Start CTA */}
        <GreenButton
          onClick={handleStart}
          disabled={!trainingType}
          variant="primary"
          fullWidth
          size="lg"
          effects={true}
          className="h-14"
        >
          INICIAR SESIÓN
          <span className="material-symbols-outlined text-[20px]">play_arrow</span>
        </GreenButton>
      </main>
    </div>
  )
}
