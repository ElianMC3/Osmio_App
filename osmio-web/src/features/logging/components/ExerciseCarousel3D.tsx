import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, ChevronLeft, ChevronRight, History, Loader2, Plus } from 'lucide-react'
import { GreenButton } from '@/design-system/components/GreenButton'
import { GreenTag } from '@/design-system/components/GreenTag'
import { exerciseImageUrl } from '@/shared/lib/media'
import { Observer } from '@/shared/lib/gsap'
import type { Exercise } from '@/shared/types/session.types'

interface ExerciseCarousel3DProps {
  exercises: Exercise[]
  addingId: number | null
  onOpen: (exercise: Exercise, source: HTMLElement | null) => void
  onAdd: (exercise: Exercise) => void
  onHistory: (exercise: Exercise) => void
}

/** Configuración del helix 3D. */
const ANGLE_STEP = 24 // grados entre tarjetas vecinas en el círculo
const VISIBLE_RANGE = 4 // tarjetas visibles a cada lado de la activa
const WHEEL_COOLDOWN = 340

const clampIndex = (value: number, count: number) =>
  Math.max(0, Math.min(count - 1, Math.round(value)))

/**
 * Galería helix 3D del picker (estilo Motion gallery showcase / A24).
 *
 * Las tarjetas se disponen sobre un círculo 3D. La tarjeta activa queda al
 * frente (rotateY = 0, escala 1, opacidad 1); las demás se reparten a ambos
 * lados girando sobre Y y retrocediendo en Z, creando la curva en hélice.
 *
 * - Motion: anima rotateY, translateZ, scale, opacity de cada tarjeta.
 * - GSAP Observer: detecta rueda horizontal y swipe táctil (input only).
 * - Teclado: ← → para navegar.
 * - Reduced motion: pista plana con scroll nativo y snap.
 */
export default function ExerciseCarousel3D({
  exercises,
  addingId,
  onOpen,
  onAdd,
  onHistory,
}: ExerciseCarousel3DProps) {
  const count = exercises.length
  const [activeIndex, setActiveIndex] = useState(0)
  const reducedMotion = useReducedMotion() ?? false

  const sectionRef = useRef<HTMLDivElement | null>(null)
  const cardsRef = useRef<(HTMLButtonElement | null)[]>([])
  const flatTrackRef = useRef<HTMLDivElement | null>(null)

  const goTo = useCallback(
    (target: number) => {
      setActiveIndex((previous) => {
        const next = clampIndex(target, count)
        return next === previous ? previous : next
      })
    },
    [count]
  )

  // Recoloca el índice si la lista se acorta (filtros/búsqueda).
  useEffect(() => {
    if (count > 0 && activeIndex > count - 1) setActiveIndex(count - 1)
  }, [activeIndex, count])

  // Rueda horizontal + swipe táctil (input solo; Motion anima el resultado).
  useEffect(() => {
    if (reducedMotion || count <= 1) return
    const section = sectionRef.current
    if (!section) return

    let accumulatedX = 0
    let lastNav = 0

    const step = (direction: number) =>
      setActiveIndex((previous) => clampIndex(previous + direction, count))

    const wheelObserver = Observer.create({
      target: window,
      type: 'wheel',
      tolerance: 8,
      onWheel: (self) => {
        if (document.querySelector('[role="dialog"][aria-modal="true"]')) return
        const rect = section.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > window.innerHeight) return
        if (Math.abs(self.deltaX) <= Math.abs(self.deltaY) * 0.9) return
        if (performance.now() - lastNav < WHEEL_COOLDOWN) return

        accumulatedX += self.deltaX
        if (Math.abs(accumulatedX) < 36) return

        const direction = accumulatedX > 0 ? 1 : -1
        accumulatedX = 0
        lastNav = performance.now()
        step(direction)
      },
    })

    const touchObserver = Observer.create({
      target: section,
      type: 'touch',
      tolerance: 28,
      onLeft: () => step(1),
      onRight: () => step(-1),
    })

    return () => {
      wheelObserver.kill()
      touchObserver.kill()
    }
  }, [count, reducedMotion])

  // Teclado.
  useEffect(() => {
    if (count <= 1) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return
      const target = event.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setActiveIndex((previous) => clampIndex(previous + 1, count))
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setActiveIndex((previous) => clampIndex(previous - 1, count))
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [count])

  // Modo plano: scroll nativo, la tarjeta centrada pasa a ser la activa.
  useEffect(() => {
    if (!reducedMotion) return
    const track = flatTrackRef.current
    if (!track) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const trackRect = track.getBoundingClientRect()
        const center = trackRect.left + trackRect.width / 2
        let best = 0
        let bestDistance = Infinity
        Array.from(track.children).forEach((child, index) => {
          const rect = child.getBoundingClientRect()
          const distance = Math.abs(rect.left + rect.width / 2 - center)
          if (distance < bestDistance) {
            bestDistance = distance
            best = index
          }
        })
        setActiveIndex((previous) => (previous === best ? previous : best))
      })
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [count, reducedMotion])

  // Modo plano: centrar la activa al navegar con botones.
  useEffect(() => {
    if (!reducedMotion) return
    const track = flatTrackRef.current
    const card = track?.children[activeIndex] as HTMLElement | undefined
    if (!track || !card) return

    const trackRect = track.getBoundingClientRect()
    const cardRect = card.getBoundingClientRect()
    const delta =
      cardRect.left - trackRect.left + (cardRect.width - track.clientWidth) / 2
    if (Math.abs(delta) > 4) {
      track.scrollTo({ left: track.scrollLeft + delta, behavior: 'auto' })
    }
  }, [activeIndex, reducedMotion])

  if (count === 0) return null

  const active = exercises[activeIndex]
  const isAdding = addingId === active.id

  const openActiveDetail = () => {
    const card = cardsRef.current[activeIndex]
    const flatCard = flatTrackRef.current?.children[activeIndex] as
      | HTMLElement
      | undefined
    const plate =
      card?.querySelector<HTMLElement>('[data-plate]') ??
      flatCard?.querySelector<HTMLElement>('[data-plate]') ??
      null
    onOpen(active, plate)
  }

  const renderPlate = (exercise: Exercise, index: number, isActive: boolean) => {
    const image = exerciseImageUrl(exercise.image)
    return (
      <div
        data-plate
        className="relative aspect-square overflow-hidden rounded-2xl border border-outline-variant/40 bg-panel"
      >
        {image ? (
          <img
            src={image}
            alt=""
            draggable={false}
            loading={Math.abs(index - activeIndex) < 6 ? 'eager' : 'lazy'}
            decoding="async"
            className="h-full w-full select-none object-cover"
          />
        ) : (
          <span className="grid h-full w-full place-items-center font-mono text-[10px] tracking-[0.3em] text-text-muted">
            SIN IMAGEN
          </span>
        )}

        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-2 py-0.5 font-mono text-[9px] tracking-[0.18em] text-white/70 backdrop-blur-sm">
          {String(index + 1).padStart(2, '0')}
        </span>

        <span
          className={`pointer-events-none absolute bottom-3 left-1/2 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full border border-white/25 bg-black/35 text-white/90 backdrop-blur-md transition-all duration-300 ${
            isActive
              ? 'opacity-100 group-hover:scale-110 group-hover:border-green group-hover:bg-green group-hover:text-on-green'
              : 'opacity-0'
          }`}
        >
          <ArrowUpRight size={16} strokeWidth={2} />
        </span>
      </div>
    )
  }

  return (
    <div
      ref={sectionRef}
      className="exercise-carousel-3d relative -mx-4 sm:-mx-6 lg:-mx-8"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Ejercicios disponibles"
    >
      {reducedMotion ? (
        <div ref={flatTrackRef} className="carousel-flat">
          {exercises.map((exercise, index) => (
            <button
              key={exercise.id}
              type="button"
              tabIndex={0}
              aria-label={`${exercise.name} · abrir detalle`}
              onClick={(event) => {
                setActiveIndex(index)
                onOpen(
                  exercise,
                  event.currentTarget.querySelector<HTMLElement>('[data-plate]')
                )
              }}
              className="carousel-flat-card group rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-green/70 focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
            >
              {renderPlate(exercise, index, true)}
            </button>
          ))}
        </div>
      ) : (
        <div className="carousel-helix-container h-[clamp(380px,56vh,560px)] flex items-center justify-center">
          {exercises.map((exercise, index) => {
            const offset = index - activeIndex
            const distance = Math.abs(offset)
            const visible = distance <= VISIBLE_RANGE

            // Posición en el círculo: cada tarjeta gira sobre Y según su offset.
            // Las de la izquierda apuntan hacia la derecha y viceversa.
            const rotateY = offset * ANGLE_STEP
            // Cuanto más lejos del centro, más retrocede en Z y más se escala abajo.
            const translateZ = -Math.pow(distance, 1.4) * 100
            const scale = visible ? Math.max(0.6, 1 - distance * 0.18) : 0.55
            const opacity = visible ? Math.max(0.15, 1 - distance * 0.22) : 0

            return (
              <motion.button
                key={exercise.id}
                ref={(element) => {
                  cardsRef.current[index] = element
                }}
                type="button"
                data-active={distance === 0 ? 'true' : 'false'}
                tabIndex={distance === 0 ? 0 : -1}
                aria-current={distance === 0 ? 'true' : undefined}
                aria-label={`${exercise.name}${
                  distance === 0 ? ' · abrir detalle' : ' · centrar'
                }`}
                onClick={(event) => {
                  if (distance !== 0) {
                    goTo(index)
                    return
                  }
                  onOpen(
                    exercise,
                    event.currentTarget.querySelector<HTMLElement>('[data-plate]')
                  )
                }}
                initial={false}
                animate={{
                  rotateY,
                  translateZ,
                  scale,
                  opacity,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 22,
                  mass: 0.9,
                }}
                style={{
                  visibility: visible ? 'visible' : 'hidden',
                  pointerEvents: distance <= 2 ? 'auto' : 'none',
                  zIndex: 100 - distance,
                }}
                className="carousel-card-helix group outline-none focus-visible:ring-2 focus-visible:ring-green/70 focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
              >
                {renderPlate(exercise, index, distance === 0)}
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Info del movimiento activo */}
      <div className="mx-auto mt-6 w-full max-w-2xl px-5 text-center">
        <p className="font-label-caps text-[10px] uppercase tracking-[0.34em] text-green/90">
          {active.category.replace(/-/g, ' ')}
          {active.equipment ? ` · ${active.equipment}` : ''}
        </p>
        <h2
          aria-live="polite"
          className="mx-auto mt-1.5 max-w-[36rem] font-headline-lg text-[20px] font-extrabold leading-[1.1] tracking-wide text-gradient-green sm:text-3xl md:text-4xl"
          style={{ overflowWrap: 'anywhere' }}
        >
          {active.name}
        </h2>

        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
          {active.target && (
            <GreenTag color="green" variant="outlined" effects={false}>
              {active.target}
            </GreenTag>
          )}
          {active.bodyPart && active.bodyPart !== active.target && (
            <GreenTag color="muted" variant="ghost" effects={false}>
              {active.bodyPart}
            </GreenTag>
          )}
          {active.secondaryMuscles && active.secondaryMuscles.length > 0 && (
            <GreenTag color="muted" variant="ghost" effects={false}>
              {active.secondaryMuscles.slice(0, 2).join(' · ')}
            </GreenTag>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <GreenButton
            type="button"
            variant="primary"
            size="md"
            effects={false}
            disabled={addingId !== null}
            onClick={() => onAdd(active)}
            className="min-w-[9.5rem]"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {isAdding ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Plus size={14} strokeWidth={2.5} />
              )}
              {isAdding ? 'AÑADIENDO…' : 'AÑADIR A RUTINA'}
            </span>
          </GreenButton>

          <GreenButton
            type="button"
            variant="default"
            size="md"
            effects={false}
            onClick={openActiveDetail}
          >
            DETALLE
          </GreenButton>

          <GreenButton
            type="button"
            variant="ghost"
            size="md"
            effects={false}
            aria-label={`Ver historial de ${active.name}`}
            onClick={() => onHistory(active)}
            className="px-2.5"
          >
            <History size={15} />
          </GreenButton>
        </div>
      </div>

      {/* Controles */}
      <div className="mx-auto mt-8 flex w-full max-w-[36rem] items-center gap-3 px-5 sm:gap-4">
        <button
          type="button"
          aria-label="Ejercicio anterior"
          disabled={activeIndex <= 0}
          onClick={() => goTo(activeIndex - 1)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-outline-variant/40 text-text-muted transition-colors hover:border-green/60 hover:text-green disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-end justify-between gap-3 font-label-caps text-[9px] uppercase tracking-[0.24em] text-text-muted">
            <span className="text-text-green/90">
              {String(activeIndex + 1).padStart(2, '0')}
              <span className="mx-1 text-text-muted/60">/</span>
              {String(count).padStart(2, '0')}
            </span>
            <span className="truncate opacity-70">
              {reducedMotion ? 'Desliza' : 'Scroll · swipe · ← →'}
            </span>
          </div>
          <div className="relative mt-2 h-px overflow-hidden bg-outline-variant/35">
            <span
              className="absolute inset-y-0 left-0 bg-green transition-[width] duration-500 ease-out motion-reduce:transition-none"
              style={{
                width: `${count > 1 ? (activeIndex / (count - 1)) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <button
          type="button"
          aria-label="Ejercicio siguiente"
          disabled={activeIndex >= count - 1}
          onClick={() => goTo(activeIndex + 1)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-outline-variant/40 text-text-muted transition-colors hover:border-green/60 hover:text-green disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
