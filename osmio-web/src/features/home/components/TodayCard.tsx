import { GreenCard } from '@/design-system/components/GreenCard'
import { GreenButton } from '@/design-system/components/GreenButton'
import type { CombatSession, StrengthSession } from '@/shared/types/session.types'

type Session = StrengthSession | CombatSession

function strengthVolume(session: StrengthSession): number {
  return session.sets.reduce((sum, set) => sum + set.weight * set.reps, 0)
}

interface TodayCardProps {
  /** Sesiones registradas hoy (fuerza o combate). */
  sessions: Session[]
  /** Línea resumen calculada por el contenedor (series · rounds · volumen). */
  summary: string
  /** Acción primaria: llevar al registro de entrenamiento. */
  onRegister: () => void
}

/**
 * Card hero del dashboard: la sesión de hoy. Componente de presentación
 * puro (los datos vienen por props del dashboard); autocontenida — estado,
 * lista de sesiones, estado vacío y CTA primario viven aquí.
 */
export function TodayCard({ sessions, summary, onRegister }: TodayCardProps) {
  const trained = sessions.length > 0

  return (
    <GreenCard variant="default" padding="lg" className="relative overflow-hidden">
      {/* La luz del vidrio: borde luminoso superior, eco de la tab bar */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <header className="flex items-center justify-between gap-sm mb-5">
        <h2 className="text-base font-semibold text-on-surface">Sesión de hoy</h2>
        <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
          <span
            aria-hidden="true"
            className={`w-1.5 h-1.5 rounded-full ${trained ? 'bg-green' : 'bg-on-surface-variant/40'}`}
          />
          {trained ? 'Registrada' : 'Pendiente'}
        </span>
      </header>

      {trained ? (
        <ul className="divide-y divide-outline-variant/20">
          {sessions.map((session) => (
            <SessionRow key={session.id} session={session} />
          ))}
        </ul>
      ) : (
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-surface-container-high/60 flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
              fitness_center
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-on-surface">Sin sesiones registradas</p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Registra tu primer entrenamiento del día.
            </p>
          </div>
        </div>
      )}

      <footer className="mt-5 flex items-center justify-between gap-sm">
        <p
          aria-live="polite"
          className="text-xs text-on-surface-variant truncate"
        >
          {summary || 'Aún no hay actividad hoy'}
        </p>
        <GreenButton variant="primary" size="sm" onClick={onRegister}>
          Registrar sesión
        </GreenButton>
      </footer>
    </GreenCard>
  )
}

function SessionRow({ session }: { session: Session }) {
  const isStrength = 'exerciseName' in session
  const title = isStrength ? session.exerciseName : `${session.type} training`
  const detail = isStrength
    ? `${session.sets.length} ${session.sets.length === 1 ? 'serie' : 'series'} · ${strengthVolume(session).toLocaleString()} kg`
    : `${session.rounds} rounds · ${session.durationMinutes} min`

  return (
    <li className="flex items-center gap-sm py-3 first:pt-0 last:pb-0">
      <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
        <span
          className="material-symbols-outlined text-primary text-[20px]"
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          {isStrength ? 'fitness_center' : 'sports_kabaddi'}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-on-surface truncate">{title}</p>
        <p className="text-xs text-on-surface-variant truncate mt-0.5">{detail}</p>
      </div>
      <span className="font-label-caps text-[9px] tracking-[0.12em] text-on-surface-variant/80 shrink-0">
        {isStrength ? 'FUERZA' : session.type.toUpperCase()}
      </span>
    </li>
  )
}
