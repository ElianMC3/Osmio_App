import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GreenCard } from '../../../design-system/components/GreenCard'
import { GreenButton } from '../../../design-system/components/GreenButton'
import { GreenTag } from '../../../design-system/components/GreenTag'
import { PageBackdrop } from '../../../design-system/components/PageBackdrop'
import { PageHeader } from '../../../design-system/components/PageHeader'
import { SectionHeader } from '../../../design-system/components/SectionHeader'
import { Gallery3D } from '../../../design-system/components/Gallery3D'

type Discipline = 'fuerza' | 'striking' | 'grappling'
type TrainingType = 'tecnica' | 'fisica' | 'sparring'

const disciplines: {
  id: Discipline
  label: string
  icon: string
  subtitle: string
  image: string
}[] = [
  {
    id: 'striking',
    label: 'Striking',
    icon: 'sports_mma',
    subtitle: 'Boxeo, Muay Thai, Kickboxing',
    image: '/backgrounds/discipline-striking.jpeg',
  },
  {
    id: 'fuerza',
    label: 'Mixed',
    icon: 'swords',
    subtitle: 'Fuerza + Combate integrado',
    image: '/backgrounds/discipline-fuerza.jpeg',
  },
  {
    id: 'grappling',
    label: 'Grappling',
    icon: 'front_hand',
    subtitle: 'BJJ, Lucha, Submission',
    image: '/backgrounds/discipline-grappling.jpeg',
  },
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
    <div className="relative min-h-dvh pb-[calc(9rem+env(safe-area-inset-bottom,0px))]">
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
          <Gallery3D
            items={disciplines}
            getKey={(discipline) => discipline.id}
            getLabel={(discipline) => `Seleccionar ${discipline.label}`}
            ariaLabel="Galería de disciplinas"
            hint="Desliza o usa ← → para elegir modalidad"
            selectionMode
            selectedKey={selectedDiscipline}
            onSelect={(discipline) => setSelectedDiscipline(discipline.id)}
            cardWidthClassName="w-[268px] sm:w-[300px]"
            viewportClassName="h-[300px] sm:h-[320px]"
            cardClassName={(_, { selected }) =>
              `h-[236px] transition-[border-color,box-shadow] duration-300 sm:h-[252px] ${
                selected
                  ? 'border-green/50 ring-green/30 shadow-[0_0_0_1px_color-mix(in_srgb,var(--green)_45%,transparent),0_0_40px_color-mix(in_srgb,var(--green)_22%,transparent)]'
                  : ''
              }`
            }
            renderCard={(discipline, { index, selected }) => (
              <>
                {/* Fallback si la imagen no existe: degradado del diseño original */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-surface-container-high via-panel to-black/60" />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${discipline.image}')` }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/15" />
                <div
                  className={`pointer-events-none absolute inset-0 transition-colors duration-300 ${
                    selected ? 'bg-green/20' : 'bg-transparent'
                  }`}
                />

                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-8 -top-10 material-symbols-outlined text-[168px] leading-none transition-colors duration-300 ${
                    selected ? 'text-green/15' : 'text-white/[0.06]'
                  }`}
                >
                  {discipline.icon}
                </span>

                <span className="pointer-events-none absolute left-5 top-3 font-mono text-[11px] tracking-[0.25em] text-white/50">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {selected && (
                  <span
                    aria-hidden="true"
                    className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/55 text-green ring-1 ring-green/40"
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      check_circle
                    </span>
                  </span>
                )}

                <div className="relative flex h-full flex-col p-5">
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-xl border transition-all duration-300 ${
                      selected
                        ? 'bg-green/15 border-green/50 text-green shadow-[0_0_18px_color-mix(in_srgb,var(--green)_30%,transparent)]'
                        : 'bg-black/45 border-white/15 text-white/75'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[26px]"
                      style={selected ? { fontVariationSettings: '"FILL" 1' } : undefined}
                    >
                      {discipline.icon}
                    </span>
                  </div>

                  <div className="mt-auto">
                    <span
                      className={`font-label-caps text-[13px] leading-none tracking-[0.12em] uppercase transition-colors duration-300 ${
                        selected ? 'text-text-green' : 'text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]'
                      }`}
                    >
                      {discipline.label}
                    </span>
                    <p
                      className={`mt-2 font-label-sm text-[11px] leading-snug ${
                        selected ? 'text-white/80' : 'text-white/65'
                      }`}
                    >
                      {discipline.subtitle}
                    </p>
                  </div>
                </div>
              </>
            )}
          />
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

        <GreenCard variant="glass" padding="md">
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