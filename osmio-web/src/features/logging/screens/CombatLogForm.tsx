import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
    <div className="min-h-screen bg-background pb-32">
      <main className="px-5 pt-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              aria-label="Volver"
              className="w-10 h-10 flex items-center justify-center border border-outline-variant hover:bg-surface-container-high transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
            >
              <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
            </button>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface uppercase tracking-tight">
              Combate - Formulario de Registro
            </h1>
          </div>
          <p className="text-on-surface-variant font-label-caps text-[12px] leading-none tracking-[0.1em]">
            Intel ID: #LOG-2024-8842
          </p>
        </div>

        {/* Detalles del Combate */}
        <section className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-5 space-y-5">
          <h3 className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-on-surface-variant uppercase flex items-center gap-2">
            <span className="w-1 h-3 bg-primary-fixed inline-block" />
            Detalles del Combate
          </h3>

          {/* Tipo de Combate */}
          <div className="space-y-2">
            <label className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-on-surface-variant uppercase block">
              Tipo de Combate
            </label>
            <div className="relative">
              <select
                value={combatType}
                onChange={(e) => setCombatType(e.target.value as CombatType)}
                className="w-full bg-surface-dim border border-outline-variant text-on-surface font-body-lg text-[16px] px-4 py-3 appearance-none cursor-pointer focus:border-primary focus:ring-0 outline-none transition-all"
              >
                <option value="competencia">Competencia</option>
                <option value="sparring">Sparring</option>
                <option value="clase">Clase</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Número de Rounds */}
          <div className="space-y-2">
            <label className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-on-surface-variant uppercase block">
              Número de Rounds
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setRounds(Math.max(1, rounds - 1))}
                aria-label="Reducir rounds"
                className="w-12 h-12 flex items-center justify-center border border-outline-variant hover:bg-surface-bright active:scale-[0.98] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
              >
                <span className="material-symbols-outlined text-on-surface">remove</span>
              </button>
              <div className="flex-1 text-center">
                <span className="font-data-display text-[32px] leading-none text-primary-fixed">
                  {rounds.toString().padStart(2, '0')}
                </span>
                <span className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-on-surface-variant opacity-40 ml-1">
                  / {maxRounds} MAX
                </span>
              </div>
              <button
                onClick={() => setRounds(Math.min(maxRounds, rounds + 1))}
                aria-label="Aumentar rounds"
                className="w-12 h-12 flex items-center justify-center bg-primary-fixed text-on-primary hover:opacity-90 active:scale-[0.98] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
            {/* Visual stepper */}
            <div className="flex gap-1 h-4 items-end">
              {Array.from({ length: maxRounds }, (_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 transition-all duration-300 ${
                    i < rounds ? 'bg-primary-fixed' : 'bg-surface-variant'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Duración del Round */}
          <div className="space-y-2">
            <label className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-on-surface-variant uppercase block">
              Duración del Round
            </label>
            <div className="relative">
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as Duration)}
                className="w-full bg-surface-dim border border-outline-variant text-on-surface font-body-lg text-[16px] px-4 py-3 appearance-none cursor-pointer focus:border-primary focus:ring-0 outline-none transition-all"
              >
                <option value="3:00">3:00 min</option>
                <option value="5:00">5:00 min</option>
                <option value="personalizado">Personalizado</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Resultado */}
          <div className="space-y-2">
            <label className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-on-surface-variant uppercase block">
              Resultado
            </label>
            <div className="relative">
              <select
                value={result}
                onChange={(e) => setResult(e.target.value as Result)}
                className="w-full bg-surface-dim border border-outline-variant text-on-surface font-body-lg text-[16px] px-4 py-3 appearance-none cursor-pointer focus:border-primary focus:ring-0 outline-none transition-all"
              >
                <option value="victoria">Victoria</option>
                <option value="derrota">Derrota</option>
                <option value="empate">Empate</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>
        </section>

        {/* Notes */}
        <section className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-5 space-y-3">
          <h3 className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-on-surface-variant uppercase flex items-center gap-2">
            <span className="w-1 h-3 bg-primary-fixed inline-block" />
            Feedback del Coach
          </h3>
          <div className="relative">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Correcciones tácticas y puntos de mejora..."
              className="w-full bg-surface-container-lowest border border-outline-variant p-4 font-body-lg text-[16px] text-on-surface focus:border-primary focus:ring-0 outline-none resize-none h-32 transition-all placeholder:text-on-surface-variant placeholder:opacity-30"
            />
            <div className="absolute bottom-3 right-3 pointer-events-none opacity-20">
              <span className="material-symbols-outlined text-[24px]">edit_note</span>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 font-label-caps text-[12px] leading-none tracking-[0.1em] border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-on-surface transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary uppercase cursor-pointer"
          >
            Descartar
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-10 py-3 font-label-caps text-[12px] leading-none tracking-[0.1em] bg-primary-fixed text-on-primary font-bold hover:opacity-90 active:scale-[0.98] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary uppercase cursor-pointer"
          >
            Guardar Registro
          </button>
        </div>
      </main>
    </div>
  )
}
