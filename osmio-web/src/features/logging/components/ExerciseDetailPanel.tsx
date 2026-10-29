import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { History, Loader2, Plus, X } from 'lucide-react'
import { useLenis } from 'lenis/react'
import { useReducedMotion } from 'motion/react'
import { GreenButton } from '@/design-system/components/GreenButton'
import { GreenCard } from '@/design-system/components/GreenCard'
import { GreenTag } from '@/design-system/components/GreenTag'
import { PageHeader } from '@/design-system/components/PageHeader'
import ExerciseInfoCard from '@/features/strength/components/ExerciseInfoCard'
import { EASES, Flip, Observer, gsap } from '@/shared/lib/gsap'
import { SessionCardSkeleton, StatusPillBone } from '@/design-system/skeletons/fixtures'
import { sessionsApi } from '@/services/api/sessions.api'
import type { Exercise, StrengthSession } from '@/shared/types/session.types'

interface ExerciseDetailPanelProps {
  exercise: Exercise
  /** Placa del reel desde la que se abrió: destino del morph Flip. */
  sourceEl: HTMLElement | null
  adding: boolean
  onAdd: () => void
  onHistory: () => void
  onClose: () => void
}

/**
 * Detalle del ejercicio en formato hoja (sheet) con el mismo contenido que la
 * pantalla de historial: info card + sesiones + CTAs.
 *
 * - Flip: la imagen entra y sale morphando desde la placa del reel.
 * - Observer: arrastre vertical desde la barra superior para descartar.
 * - InertiaPlugin: el descarte continúa con la velocidad del gesto.
 */
export default function ExerciseDetailPanel({
  exercise,
  sourceEl,
  adding,
  onAdd,
  onHistory,
  onClose,
}: ExerciseDetailPanelProps) {
  const [sessions, setSessions] = useState<StrengthSession[]>([])
  const [loading, setLoading] = useState(true)
  const reducedMotion = useReducedMotion() ?? false
  const lenis = useLenis()

  const backdropRef = useRef<HTMLDivElement | null>(null)
  const sheetRef = useRef<HTMLDivElement | null>(null)
  const handleRef = useRef<HTMLDivElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const closingRef = useRef(false)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const sourceElRef = useRef(sourceEl)
  sourceElRef.current = sourceEl

  useEffect(() => {
    let active = true
    setLoading(true)
    sessionsApi
      .getSessionsByExercise(exercise.id)
      .then((list) => {
        if (active) setSessions(list)
      })
      .catch(console.error)
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [exercise.id])

  // Bloqueo de scroll + foco inicial/restaurado.
  useEffect(() => {
    const html = document.documentElement
    const previousOverflow = html.style.overflow
    const previousFocus = document.activeElement as HTMLElement | null

    lenis?.stop()
    html.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      html.style.overflow = previousOverflow
      lenis?.start()
      // Devuelve el foco a la placa de origen; si el click no enfocó nada,
      // el foco quedaría en <body> y se perdería la posición del teclado.
      const target =
        previousFocus && previousFocus !== document.body && previousFocus.isConnected
          ? previousFocus
          : sourceElRef.current
      target?.focus?.({ preventScroll: true })
    }
  }, [lenis])

  const requestClose = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true

    const finish = () => onCloseRef.current()
    const sheet = sheetRef.current
    const backdrop = backdropRef.current
    const image = imageRef.current

    if (reducedMotion || !sheet) {
      finish()
      return
    }

    const timeline = gsap.timeline({ onComplete: finish })

    if (sourceEl?.isConnected && image) {
      Flip.fit(image, sourceEl, { duration: 0.5, ease: EASES.exit, scale: true })
      timeline.to(image, { borderRadius: '50%', duration: 0.5, ease: EASES.exit }, 0)
    }

    if (backdrop) {
      timeline.to(backdrop, { opacity: 0, duration: 0.42, ease: EASES.exit }, 0)
    }
    timeline.to(sheet, { opacity: 0, duration: 0.24, ease: EASES.exit }, 0.3)
  }, [reducedMotion, sourceEl])

  // Entrada: fade del backdrop + fade de la hoja + morph de la imagen.
  useLayoutEffect(() => {
    const sheet = sheetRef.current
    const backdrop = backdropRef.current
    const image = imageRef.current
    const context = gsap.context(() => {
      if (backdrop) {
        gsap.fromTo(
          backdrop,
          { opacity: 0 },
          { opacity: 1, duration: reducedMotion ? 0 : 0.3, ease: 'power2.out' }
        )
      }
      if (sheet && !reducedMotion) {
        gsap.fromTo(sheet, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' })
      }
      if (!reducedMotion && sourceEl?.isConnected && image) {
        // Flip.fit con `getVars` calcula el estado "encajado en la placa"; luego
        // animamos a identidad para que la imagen ocupe su hueco en la ficha.
        const fitVars = Flip.fit(image, sourceEl, {
          scale: true,
          getVars: true,
        }) as gsap.TweenVars | null
        if (fitVars) {
          gsap.fromTo(image, fitVars, {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            skewX: 0,
            duration: 0.8,
            ease: EASES.glide,
            clearProps: 'transform',
          })
        }
        gsap.fromTo(
          image,
          { borderRadius: '50%' },
          { borderRadius: '0.75rem', duration: 0.8, ease: EASES.glide }
        )
      }
    })

    return () => context.revert()
    // Solo en el montaje: el morph no debe repetirse al cargar las sesiones.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Arrastre para descartar.
  useEffect(() => {
    const handle = handleRef.current
    const sheet = sheetRef.current
    if (!handle || !sheet || reducedMotion) return

    let dragY = 0

    const observer = Observer.create({
      target: handle,
      type: 'touch,pointer',
      dragMinimum: 6,
      onDragStart: () => {
        gsap.killTweensOf(sheet)
      },
      onDrag: (self) => {
        dragY = Math.max(0, (self.y ?? 0) - (self.startY ?? 0))
        gsap.set(sheet, { y: dragY })
        if (backdropRef.current) {
          gsap.set(backdropRef.current, { opacity: Math.max(0.3, 1 - dragY / 560) })
        }
      },
      onDragEnd: (self) => {
        const velocity = Math.max(0, self.velocityY)
        if (dragY > 120 || velocity > 650) {
          closingRef.current = true
          gsap.to(sheet, {
            inertia: {
              y: { velocity: Math.max(velocity, 1000), end: window.innerHeight },
              // Sin tope, un gesto rápido puede alargar el cierre varios segundos.
              duration: { min: 0.45, max: 0.8 },
            },
            onComplete: () => onCloseRef.current(),
          })
          if (backdropRef.current) {
            gsap.to(backdropRef.current, { opacity: 0, duration: 0.3, ease: EASES.exit })
          }
          return
        }

        dragY = 0
        gsap.to(sheet, { y: 0, duration: 0.6, ease: EASES.settle })
        if (backdropRef.current) {
          gsap.to(backdropRef.current, { opacity: 1, duration: 0.4, ease: EASES.settle })
        }
        // Un drag con ratón saca el foco del diálogo: lo devolvemos a la hoja.
        closeRef.current?.focus({ preventScroll: true })
      },
    })

    return () => observer.kill()
  }, [reducedMotion])

  // Escape + trampa de foco básica dentro de la hoja.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        requestClose()
        return
      }
      if (event.key !== 'Tab') return

      const sheet = sheetRef.current
      if (!sheet) return
      const focusable = Array.from(
        sheet.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.offsetParent !== null)
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (!active || !sheet.contains(active)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
        return
      }
      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [requestClose])

  const content = (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
      <div
        ref={backdropRef}
        onClick={requestClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        aria-hidden
      />

      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle de ${exercise.name}`}
        className="relative flex h-[calc(100dvh-0.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-outline-variant/30 bg-surface-container shadow-[0_-30px_120px_-30px_rgba(0,0,0,0.95)] sm:h-[min(92dvh,900px)] sm:rounded-3xl"
      >
        <div
          ref={handleRef}
          className="shrink-0 touch-none select-none border-b border-outline-variant/20 bg-surface-container/95 px-4 pb-3 pt-2.5"
        >
          <div className="mx-auto mb-2.5 h-1 w-10 rounded-full bg-outline-variant/70" />
          <div className="flex items-center justify-between gap-3">
            <span className="font-label-caps text-[9px] uppercase tracking-[0.32em] text-text-muted">
              Detalle del movimiento
            </span>
            <div className="flex items-center gap-2">
              <span className="hidden font-label-caps text-[9px] uppercase tracking-[0.18em] text-text-muted/70 sm:inline">
                Arrastra hacia abajo para cerrar
              </span>
              <button
                ref={closeRef}
                type="button"
                aria-label="Cerrar detalle"
                onClick={requestClose}
                className="grid h-8 w-8 place-items-center rounded-full border border-outline-variant/40 text-text-muted transition-colors hover:border-green/50 hover:text-green"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-32 pt-4 sm:px-6">
          <PageHeader
            kicker="Registro de movimiento"
            title={exercise.name}
            titleAccent="Detalle"
            subtitle={
              exercise.category
                ? `${exercise.category.replace(/-/g, ' ')} · ${exercise.equipment ?? 'sin equipo'}`
                : 'Ficha y sesiones registradas de este ejercicio'
            }
            onBack={requestClose}
            status={
              loading ? (
                <StatusPillBone />
              ) : (
                <span className="status-pill">
                  <span className="status-dot bg-green" />
                  {sessions.length} SESIONES
                </span>
              )
            }
          />

          <div className="mt-4 space-y-3">
            <ExerciseInfoCard exercise={exercise} imageRef={imageRef} />

            {loading ? (
              <SessionCardSkeleton />
            ) : sessions.length === 0 ? (
              <p className="py-8 text-center font-label-caps text-sm text-text-muted opacity-60">
                Sin sesiones registradas para {exercise.name}.
              </p>
            ) : (
              <SessionHistory sessions={sessions} />
            )}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-outline-variant/20 bg-surface-container/90 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <GreenButton
              type="button"
              variant="primary"
              size="md"
              effects={false}
              disabled={adding}
              onClick={onAdd}
              className="flex-1"
            >
              <span className="inline-flex items-center justify-center gap-2">
                {adding ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Plus size={14} strokeWidth={2.5} />
                )}
                {adding ? 'AÑADIENDO…' : 'AÑADIR A RUTINA'}
              </span>
            </GreenButton>
            <GreenButton
              type="button"
              variant="default"
              size="md"
              effects={false}
              onClick={onHistory}
              className="inline-flex items-center gap-2"
            >
              <History size={14} />
              HISTORIAL
            </GreenButton>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

/** Misma presentación de sesiones que `ExerciseHistory`, extraída aquí para la hoja. */
function SessionHistory({ sessions }: { sessions: StrengthSession[] }) {
  return (
    <>
      {sessions.map((session) => {
        const sets = session.sets.filter((set) => set.weight > 0 || set.reps > 0)
        const topWeight = sets.length > 0 ? Math.max(...sets.map((set) => set.weight)) : 0
        const topReps = sets.length > 0 ? Math.max(...sets.map((set) => set.reps)) : 0
        const avgRpe =
          sets.length > 0
            ? Math.round(
                (sets.reduce((acc, set) => acc + (set.rpe ?? 0), 0) / sets.length) * 10
              ) / 10
            : 0

        return (
          <GreenCard
            key={session.id}
            variant="default"
            padding="md"
            className="relative overflow-hidden"
          >
            <span className="gradient-hairline" />
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-2 font-label-caps text-xs text-text-muted">
                <span className="material-symbols-outlined text-[16px] text-green">
                  calendar_month
                </span>
                {new Date(session.date)
                  .toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                  .toUpperCase()}
              </span>
              <div className="flex items-center gap-2">
                {avgRpe > 0 && (
                  <GreenTag color="green" variant="outlined" effects={false}>
                    RPE {avgRpe}
                  </GreenTag>
                )}
                <GreenTag color="muted" variant="ghost" effects={false}>
                  {sets.length} SERIES
                </GreenTag>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-label-sm text-xs text-text-muted">MEJOR SET</span>
              <span className="font-data-display text-[22px] leading-none text-gradient-green">
                {topWeight} KG × {topReps}
              </span>
            </div>
            <div className="mt-3 space-y-1">
              {sets.map((set, index) => (
                <div
                  key={index}
                  className="flex justify-between border-t border-outline-variant/20 pt-1.5 font-label-sm text-xs text-text-muted"
                >
                  <span>Serie {index + 1}</span>
                  <span className="text-text-green">
                    {set.reps} reps × {set.weight} kg
                  </span>
                  {set.rpe ? <span>RPE {set.rpe}</span> : null}
                </div>
              ))}
            </div>
          </GreenCard>
        )
      })}
    </>
  )
}
