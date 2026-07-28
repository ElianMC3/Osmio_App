import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GreenCard } from '../../../design-system/components/GreenCard'
import { GreenButton } from '../../../design-system/components/GreenButton'
import { GreenProgress } from '../../../design-system/components/GreenProgress'

type CombatType = 'competencia' | 'sparring' | 'clase'
type Duration = '3:00' | '5:00' | 'personalizado'
type Result = 'victoria' | 'derrota' | 'empate'

export default function CombatLogForm() {
  const navigate = useNavigate()
  const [combatType, setCombatType] = useState<CombatType>('sparring')
  const [rounds, setRounds] = useState(3)
  const [duration, setDuration] = useState<Duration>('3:00')
  const [result, setResult] = useState<Result>('victoria')
  const [notes, setNotes] = useState('')

  const maxRounds = 12

  return (
    <div className="min-h-screen bg-[#050705] pb-32">
      <main className="px-5 pt-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
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
              Combate - Formulario de Registro
            </h1>
          </div>
          <p className="text-text-muted font-label-caps text-[12px] leading-none tracking-[0.1em]">
            Intel ID: #LOG-2024-8842
          </p>
        </div>

        {/* Detalles del Combate */}
        <GreenCard variant="glass" padding="lg" effects={true}>
          <div className="space-y-5">
            <h3 className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-text-muted uppercase flex items-center gap-2">
              <span className="w-1 h-3 bg-green inline-block" />
              Detalles del Combate
            </h3>

            {/* Tipo de Combate */}
            <div className="space-y-2">
              <label className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-text-muted uppercase block">
                Tipo de Combate
              </label>
              <div className="relative">
                <select
                  value={combatType}
                  onChange={(e) => setCombatType(e.target.value as CombatType)}
                  className="w-full bg-black/40 border border-green/25 text-text-green font-body-lg text-[16px] px-4 py-3 appearance-none cursor-pointer focus:border-green focus:ring-0 outline-none transition-all"
                >
                  <option value="competencia">Competencia</option>
                  <option value="sparring">Sparring</option>
                  <option value="clase">Clase</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Número de Rounds */}
            <div className="space-y-2">
              <label className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-text-muted uppercase block">
                Número de Rounds
              </label>
              <div className="flex items-center gap-3">
                <GreenButton
                  onClick={() => setRounds(Math.max(1, rounds - 1))}
                  aria-label="Reducir rounds"
                  variant="default"
                  size="md"
                  effects={true}
                  className="w-12 h-12 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-text-green">remove</span>
                </GreenButton>
                <div className="flex-1 text-center">
                  <span className="font-data-display text-[32px] leading-none text-green">
                    {rounds.toString().padStart(2, '0')}
                  </span>
                  <span className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-text-muted opacity-40 ml-1">
                    / {maxRounds} MAX
                  </span>
                </div>
                <GreenButton
                  onClick={() => setRounds(Math.min(maxRounds, rounds + 1))}
                  aria-label="Aumentar rounds"
                  variant="primary"
                  size="md"
                  effects={true}
                  className="w-12 h-12 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined">add</span>
                </GreenButton>
              </div>
              {/* Visual stepper replaced with GreenProgress */}
              <GreenProgress
                value={(rounds / maxRounds) * 100}
                size="sm"
                effects={true}
              />
            </div>

            {/* Duración del Round */}
            <div className="space-y-2">
              <label className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-text-muted uppercase block">
                Duración del Round
              </label>
              <div className="relative">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as Duration)}
                  className="w-full bg-black/40 border border-green/25 text-text-green font-body-lg text-[16px] px-4 py-3 appearance-none cursor-pointer focus:border-green focus:ring-0 outline-none transition-all"
                >
                  <option value="3:00">3:00 min</option>
                  <option value="5:00">5:00 min</option>
                  <option value="personalizado">Personalizado</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Resultado */}
            <div className="space-y-2">
              <label className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-text-muted uppercase block">
                Resultado
              </label>
              <div className="relative">
                <select
                  value={result}
                  onChange={(e) => setResult(e.target.value as Result)}
                  className="w-full bg-black/40 border border-green/25 text-text-green font-body-lg text-[16px] px-4 py-3 appearance-none cursor-pointer focus:border-green focus:ring-0 outline-none transition-all"
                >
                  <option value="victoria">Victoria</option>
                  <option value="derrota">Derrota</option>
                  <option value="empate">Empate</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </GreenCard>

        {/* Notes */}
        <GreenCard variant="glass" padding="lg" effects={true}>
          <div className="space-y-3">
            <h3 className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-text-muted uppercase flex items-center gap-2">
              <span className="w-1 h-3 bg-green inline-block" />
              Feedback del Coach
            </h3>
            <div className="relative">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Correcciones tácticas y puntos de mejora..."
                className="w-full bg-black/40 border border-green/25 p-4 font-body-lg text-[16px] text-text-green focus:border-green focus:ring-0 outline-none resize-none h-32 transition-all placeholder:text-text-muted placeholder:opacity-30"
              />
              <div className="absolute bottom-3 right-3 pointer-events-none opacity-20">
                <span className="material-symbols-outlined text-[24px]">edit_note</span>
              </div>
            </div>
          </div>
        </GreenCard>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <GreenButton
            onClick={() => navigate(-1)}
            variant="ghost"
            size="md"
            effects={true}
          >
            Descartar
          </GreenButton>
          <GreenButton
            onClick={() => navigate(-1)}
            variant="primary"
            size="lg"
            effects={true}
          >
            Guardar Registro
          </GreenButton>
        </div>
      </main>
    </div>
  )
}
