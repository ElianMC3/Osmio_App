import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'motion/react'

const CARD_GAP = 20
const WAVE_PHASE = 0.9
const MAX_WAVE_OFFSET = 26
const MAX_WAVE_TILT = 5
const VELOCITY_RANGE = 1000
const REVEAL_PADDING = 24

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export interface Gallery3DCardState {
  index: number
  hovered: boolean
  selected: boolean
}

export interface Gallery3DProps<T> {
  items: T[]
  getKey: (item: T) => string | number
  getLabel: (item: T) => string
  renderCard: (item: T, state: Gallery3DCardState) => ReactNode
  onSelect?: (item: T) => void
  isBusy?: (item: T) => boolean
  selectedKey?: string | number | null
  selectionMode?: boolean
  ariaLabel: string
  hint?: string
  className?: string
  viewportClassName?: string
  cardWidthClassName?: string
  cardClassName?: string | ((item: T, state: Gallery3DCardState) => string)
}

interface Gallery3DCardProps<T> {
  item: T
  index: number
  label: string
  velocity: MotionValue<number>
  selected: boolean
  busy: boolean
  selectionMode: boolean
  cardWidthClassName: string
  cardClassName?: string | ((item: T, state: Gallery3DCardState) => string)
  renderCard: (item: T, state: Gallery3DCardState) => ReactNode
  onSelect: (item: T) => void
  onFocusCard: (index: number) => void
}

function Gallery3DCard<T>({
  item,
  index,
  label,
  velocity,
  selected,
  busy,
  selectionMode,
  cardWidthClassName,
  cardClassName,
  renderCard,
  onSelect,
  onFocusCard,
}: Gallery3DCardProps<T>) {
  const prefersReducedMotion = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const phase = Math.sin((index + 1) * WAVE_PHASE)
  const y = useTransform(velocity, (v) =>
    prefersReducedMotion ? 0 : phase * v * MAX_WAVE_OFFSET,
  )
  const rotateX = useTransform(velocity, (v) =>
    prefersReducedMotion ? 0 : phase * v * MAX_WAVE_TILT,
  )

  const state: Gallery3DCardState = { index, hovered, selected }
  const extraClassName =
    typeof cardClassName === 'function' ? cardClassName(item, state) : cardClassName ?? ''

  const activate = () => {
    if (busy) return
    onSelect(item)
  }

  return (
    <motion.div
      className={`relative shrink-0 ${cardWidthClassName}`}
      style={{ y, rotateX, rotateY: -12, transformStyle: 'preserve-3d' }}
    >
      <motion.div
        className="h-full will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
        whileHover={prefersReducedMotion ? undefined : { z: 56, scale: 1.03 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          role="button"
          tabIndex={0}
          aria-label={label}
          aria-busy={busy || undefined}
          aria-disabled={busy || undefined}
          aria-pressed={selectionMode ? selected : undefined}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest('[data-card-action]')) return
            activate()
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return
            event.preventDefault()
            if ((event.target as HTMLElement).closest('[data-card-action]')) return
            activate()
          }}
          onFocus={() => onFocusCard(index)}
          className={`group relative cursor-grab overflow-hidden rounded-2xl border border-outline-variant/40 bg-panel text-left shadow-[0_30px_70px_-30px_rgba(0,0,0,0.75)] ring-1 ring-white/5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-fixed active:cursor-grabbing ${extraClassName}`}
        >
          {renderCard(item, state)}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Gallery3D<T>({
  items,
  getKey,
  getLabel,
  renderCard,
  onSelect,
  isBusy,
  selectedKey,
  selectionMode = false,
  ariaLabel,
  hint,
  className = '',
  viewportClassName = '',
  cardWidthClassName = 'w-[232px] sm:w-[264px]',
  cardClassName,
}: Gallery3DProps<T>) {
  const prefersReducedMotion = useReducedMotion()
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragged = useRef(false)
  const x = useMotionValue(0)
  const [maxDrag, setMaxDrag] = useState(0)

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const measure = () => {
      const nextMax = Math.max(0, track.scrollWidth - viewport.clientWidth)
      setMaxDrag(nextMax)
      x.set(clamp(x.get(), -nextMax, 0))
    }

    x.set(0)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(track)
    return () => observer.disconnect()
  }, [items, x])

  const scrollVelocity = useVelocity(x)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocity = useTransform(
    smoothVelocity,
    [-VELOCITY_RANGE, 0, VELOCITY_RANGE],
    [-1, 0, 1],
    { clamp: true },
  )

  const stepByCard = (direction: -1 | 1) => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const firstCard = track.firstElementChild as HTMLElement | null
    const max = Math.max(0, track.scrollWidth - viewport.clientWidth)
    const step = (firstCard?.offsetWidth ?? 264) + CARD_GAP
    animate(x, clamp(x.get() - direction * step, -max, 0), {
      type: 'spring',
      stiffness: 300,
      damping: 34,
      mass: 0.9,
    })
  }

  const revealCard = (index: number) => {
    const viewport = viewportRef.current
    const track = trackRef.current
    const card = track?.children[index] as HTMLElement | undefined
    if (!viewport || !track || !card) return

    const max = Math.max(0, track.scrollWidth - viewport.clientWidth)
    const viewWidth = viewport.clientWidth
    const left = card.offsetLeft
    const right = left + card.offsetWidth
    const current = x.get()
    const viewLeft = -current
    const viewRight = viewLeft + viewWidth

    let target = current
    if (left < viewLeft) target = -left + REVEAL_PADDING
    else if (right > viewRight) target = viewWidth - right - REVEAL_PADDING

    animate(x, clamp(target, -max, 0), {
      type: 'spring',
      stiffness: 320,
      damping: 36,
    })
  }

  const handleSelect = (item: T) => {
    if (dragged.current) return
    onSelect?.(item)
  }

  return (
    <div className={className}>
      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carrusel"
        aria-label={ariaLabel}
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            stepByCard(1)
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault()
            stepByCard(-1)
          }
        }}
        className={`relative overflow-hidden ${viewportClassName}`}
        style={{ perspective: '1200px', perspectiveOrigin: '50% 50%', overflow: 'clip' }}
        onScroll={(event) => {
          // overflow:hidden sigue siendo un contenedor scrolleable: al enfocar
          // una tarjeta el navegador lo desplaza y descuadra el drag. `clip`
          // lo evita; esto cubre navegadores que aún no lo soportan.
          if (event.currentTarget.scrollLeft !== 0) event.currentTarget.scrollLeft = 0
        }}
      >
        <motion.div
          ref={trackRef}
          drag={maxDrag > 0 ? 'x' : false}
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0.08}
          dragMomentum={!prefersReducedMotion}
          dragTransition={{
            power: 0.28,
            timeConstant: 320,
            bounceStiffness: 260,
            bounceDamping: 32,
          }}
          onPointerDown={() => {
            dragged.current = false
          }}
          onDragStart={() => {
            dragged.current = true
          }}
          onDragEnd={() => {
            // El click se dispara justo después del pointerup: se libera en el
            // siguiente tick para no bloquear un click normal posterior.
            window.setTimeout(() => {
              dragged.current = false
            }, 0)
          }}
          style={{ x, transformStyle: 'preserve-3d' }}
          className={`flex h-full w-max items-center gap-5 px-6 ${maxDrag === 0 ? 'mx-auto' : ''}`}
        >
          {items.map((item, index) => (
            <Gallery3DCard
              key={getKey(item)}
              item={item}
              index={index}
              label={getLabel(item)}
              velocity={velocity}
              selected={selectedKey != null && selectedKey === getKey(item)}
              busy={isBusy?.(item) ?? false}
              selectionMode={selectionMode}
              cardWidthClassName={cardWidthClassName}
              cardClassName={cardClassName}
              renderCard={renderCard}
              onSelect={handleSelect}
              onFocusCard={revealCard}
            />
          ))}
        </motion.div>

        {maxDrag > 0 && (
          <>
            <button
              type="button"
              onClick={() => stepByCard(-1)}
              aria-label="Ver elementos anteriores"
              className="absolute left-2 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-outline-variant/40 bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-fixed"
            >
              <span className="material-symbols-outlined text-[22px]">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={() => stepByCard(1)}
              aria-label="Ver elementos siguientes"
              className="absolute right-2 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-outline-variant/40 bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-fixed"
            >
              <span className="material-symbols-outlined text-[22px]">chevron_right</span>
            </button>
          </>
        )}
      </div>

      {hint && (
        <p className="mt-1 text-center font-label-caps text-[10px] uppercase tracking-[2.5px] text-text-muted/60">
          {hint}
        </p>
      )}
    </div>
  )
}
