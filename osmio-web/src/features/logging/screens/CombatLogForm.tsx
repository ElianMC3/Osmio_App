import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { GreenCard } from '../../../design-system/components/GreenCard'
import { GreenButton } from '../../../design-system/components/GreenButton'
import { GreenProgress } from '../../../design-system/components/GreenProgress'
import { PageBackdrop } from '../../../design-system/components/PageBackdrop'
import { PageHeader } from '../../../design-system/components/PageHeader'
import { sessionsApi } from '@/services/api/sessions.api'

type CombatType = 'competencia' | 'sparring' | 'clase'
type Duration = '3:00' | '5:00' | 'personalizado'
type Result = 'victoria' | 'derrota' | 'empate'

interface SessionState {
  discipline?: 'striking' | 'grappling'
  trainingType?: string
}

const fieldClass =
  'w-full bg-panel/40 border border-outline-variant/40 text-text-green font-body-lg text-[16px] px-4 py-3 rounded-xl appearance-none cursor-pointer focus:border-green focus:ring-0 outline-none transition-all'

export default function CombatLogForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { discipline, trainingType } = (location.state ?? {}) as SessionState
  const [combatType, setCombatType] = useState<CombatType>('sparring')
  const [rounds, setRounds] = useState(3)
  const [duration, setDuration] = useState<Duration>('3:00')
  const [result, setResult] = useState<Result>('victoria')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const maxRounds = 12

  const handleSave = async () => {
    setSaving(true)
    try {
      const durationMinutes = duration === '3:00' ? 3 : duration === '5:00' ? 5 : 5
      const trainingTag = (trainingType ?? '').toUpperCase()
      await sessionsApi.createCombatSession({
        date: new Date().toISOString().split('T')[0],
        type: discipline ?? (combatType === 'competencia' ? 'striking' : 'grappling'),
        rounds,
        durationMinutes,
        rpe: result === 'victoria' ? 8 : result === 'derrota' ? 6 : 7,
        positions: [],
        notes: `${trainingTag ? `[${trainingTag}] ` : ''}${notes || `Resultado: ${result}`}`,
      })
      navigate(-1)
    } catch (e) {
      console.error('Error saving combat session:', e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="relative min-h-screen pb-32">
      <PageBackdrop />
      <main className="relative z-10 px-5 pt-6 space-y-6 max-w-4xl mx-auto">
        <PageHeader
          kicker={`SISTEMA DE PREPARACIÓN DE COMBATE · ${discipline?.toUpperCase() ?? 'COMBATE'}`}
          title="Combate"
          titleAccent="Campo de Batalla"
          subtitle={`Intel ID: #LOG-${new Date().getFullYear()}-8842 · Registro de volumen táctico y resultado.`}
          onBack={() => navigate(-1)}
          status={
            <span className="status-pill">
              <span className="status-dot bg-green" />
              {trainingType?.toUpperCase() ?? 'SPARRING'}
            </span>
          }
        />

        <GreenCard variant="glass" padding="lg" effects>
          <div className="space-y-6">
            <p className="flex items-center gap-2 font-label-caps text-[12px] leading-none tracking-[0.1em] text-text-muted uppercase">
              <span className="w-1.5 h-1.5 bg-green inline-block rotate-45" />
              Detalles del Combate
            </p>

            <div className="space-y-2">
              <label className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-text-muted uppercase block">
                Tipo de Combate
              </label>
              <div className="relative">
                <select
                  value={combatType}
                  onChange={(e) => setCombatType(e.target.value as CombatType)}
                  className={fieldClass}
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
                  effects
                  className="w-12 h-12 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-text-green">remove</span>
                </GreenButton>
                <div className="flex-1 text-center">
                  <span className="font-data-display text-gradient-green text-[38px] leading-none">
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
                  effects
                  className="w-12 h-12 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined">add</span>
                </GreenButton>
              </div>
              <GreenProgress value={(rounds / maxRounds) * 100} size="sm" effects />
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-text-muted uppercase block">
                Duración del Round
              </label>
              <div className="relative">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as Duration)}
                  className={fieldClass}
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

            <div className="space-y-2">
              <label className="font-label-caps text-[12px] leading-none tracking-[0.1em] text-text-muted uppercase block">
                Resultado
              </label>
              <div className="relative">
                <select
                  value={result}
                  onChange={(e) => setResult(e.target.value as Result)}
                  className={fieldClass}
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

        <GreenCard variant="glass" padding="lg" effects>
          <div className="space-y-3">
            <p className="flex items-center gap-2 font-label-caps text-[12px] leading-none tracking-[0.1em] text-text-muted uppercase">
              <span className="w-1.5 h-1.5 bg-acid inline-block rotate-45" />
              Feedback del Coach
            </p>
            <div className="relative">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Correcciones tácticas y puntos de mejora..."
                className="w-full bg-panel/40 border border-outline-variant/40 p-4 rounded-xl font-body-lg text-[16px] text-text-green focus:border-green focus:ring-0 outline-none resize-none h-32 transition-all placeholder:text-text-muted placeholder:opacity-30"
              />
              <div className="absolute bottom-3 right-3 pointer-events-none opacity-20">
                <span className="material-symbols-outlined text-[24px]">edit_note</span>
              </div>
            </div>
          </div>
        </GreenCard>

        <div className="flex justify-end gap-3">
          <GreenButton
            onClick={() => navigate(-1)}
            variant="ghost"
            size="lg"
            effects
          >
            Descartar
          </GreenButton>
          <GreenButton
            onClick={handleSave}
            variant="primary"
            size="lg"
            effects
            disabled={saving}
          >
            {saving ? 'GUARDANDO…' : 'Guardar Registro'}
          </GreenButton>
        </div>
      </main>
    </div>
  )
}