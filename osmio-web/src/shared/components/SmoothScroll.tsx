import { useEffect, useRef, type ReactNode } from 'react'
import { cancelFrame, frame, useReducedMotion } from 'motion/react'
import { ReactLenis, type LenisRef } from 'lenis/react'

interface SmoothScrollProps {
  children: ReactNode
}

/**
 * Inertial, wheel-based smooth scrolling powered by Lenis and driven by
 * Motion's frame loop so it stays in sync with the rest of the animations.
 *
 * When the user prefers reduced motion we skip Lenis entirely and fall back
 * to native browser scrolling.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const prefersReducedMotion = useReducedMotion()
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    if (prefersReducedMotion) return

    const update = ({ timestamp }: { timestamp: number }) => {
      lenisRef.current?.lenis?.raf(timestamp)
    }

    frame.update(update, true)
    return () => cancelFrame(update)
  }, [prefersReducedMotion])

  if (prefersReducedMotion) {
    return <>{children}</>
  }

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  )
}
