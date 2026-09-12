import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GreenCard } from '../../../design-system/components/GreenCard'
import { GreenButton } from '../../../design-system/components/GreenButton'
import { GreenTag } from '../../../design-system/components/GreenTag'
import { PageBackdrop } from '../../../design-system/components/PageBackdrop'
import { PageHeader } from '../../../design-system/components/PageHeader'
import { SectionHeader } from '../../../design-system/components/SectionHeader'

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
    <div className="relative min-h-screen pb-32">
      <PageBackdrop />
      <main className="relative z-10 px-5 pt-6 space-y-8 max-w-4xl mx-auto">
        <PageHeader
          kicker="SISTEMA DE PREPARACIÓN DE COMBATE"
          title="Nueva"
          titleAccent="Sesión"
          subtitle="Selecciona la modalidad y el tipo de entrenamiento para calibrar el registro."
          onBack={() => navigate(-1)}
          status={
            <span className="status-pill">
              <span className="status-dot bg-green" />
              READY
            </span>
          }
        />

        <section className="space-y-4">
          <SectionHeader kicker="01 · Disciplina" title="Qué vas a entrenar" />
          <div className="grid grid-cols-3 gap-3">
            {disciplines.map((d) => {
              const isSelected = selectedDiscipline === d.id
              return (
                <GreenCard
                  key={d.id}
                  onClick={() => setSelectedDiscipline(d.id)}
                  padding="md"
                  effects
                  className="relative flex flex-col items-center justify-center gap-3 cursor-pointer"
                  style={
                    isSelected
                      ? {
                          boxShadow:
                            '0 0 0 1px color-mix(in srgb, var(--green) 45%, transparent), 0 0 30px color-mix(in srgb, var(--green) 22%, transparent)',
                        }
                      : undefined
                  }
                >
                  {isSelected && <span className="gradient-hairline" />}
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-xl border transition-all duration-300 ${
                      isSelected
                        ? 'bg-green/10 border-green/40 text-green shadow-[0_0_18px_color-mix(in_srgb,var(--green)_30%,transparent)]'
                        : 'bg-surface-container-high/60 border-outline-variant/40 text-text-muted'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[26px]"
                      style={isSelected ? { fontVariationSettings: '"FILL" 1' } : undefined}
                    >
                      {d.icon}
                    </span>
                  </div>
                  <div className="text-center">
                    <span
                      className={`font-label-caps text-[12px] leading-none tracking-[0.1em] uppercase ${
                        isSelected ? 'text-text-green' : 'text-text-muted'
                      }`}
                    >
                      {d.label}
                    </span>
                    <p className="font-label-sm text-[11px] leading-none text-text-muted mt-1.5 opacity-70">
                      {d.subtitle}
                    </p>
                  </div>
                </GreenCard>
              )
            })}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader kicker="02 · Intensidad" title="Tipo de Entrenamiento" />
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
                  effects
                  className="flex flex-col items-center justify-center gap-1.5 h-auto py-4"
                >
                  <span className="material-symbols-outlined text-[22px]">{t.icon}</span>
                  <span>{t.label}</span>
                </GreenButton>
              )
            })}
          </div>
        </section>

        <GreenCard variant="glass" padding="md" effects>
          <div className="space-y-3">
            <p className="flex items-center gap-2 font-label-caps text-[12px] leading-none tracking-[0.1em] text-text-muted uppercase">
              <span className="w-1.5 h-1.5 bg-acid inline-block rotate-45" />
              Material Requerido
            </p>
            <div className="flex flex-wrap gap-2">
              {equipmentMap[selectedDiscipline].map((item) => (
                <GreenTag key={item.label} color="green" variant="outlined" effects>
                  <span className="material-symbols-outlined text-[12px]">{item.icon}</span>
                  {item.label}
                </GreenTag>
              ))}
            </div>
          </div>
        </GreenCard>

        {!trainingType && (
          <p className="text-center font-label-sm text-[11px] leading-none text-text-muted opacity-50">
            Selecciona tu disciplina y tipo para comenzar
          </p>
        )}

        <GreenButton
          onClick={handleStart}
          disabled={!trainingType}
          variant="primary"
          fullWidth
          size="lg"
          effects
          className="h-14 rounded-xl text-sm tracking-[0.18em]"
        >
          INICIAR SESIÓN
          <span className="material-symbols-outlined text-[20px]">play_arrow</span>
        </GreenButton>
      </main>
    </div>
  )
}