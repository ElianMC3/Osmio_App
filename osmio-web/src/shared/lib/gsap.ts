import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { Observer } from 'gsap/Observer'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, Flip, Observer, InertiaPlugin, CustomEase)

/**
 * Curvas compartidas del sistema. Se crean una sola vez (al importar este
 * módulo) para que GSAP precachee los puntos y no haya coste en cada tween.
 *
 * - glide: salida larga y suave, para morphs y cambios de estado grandes.
 * - settle: frenada rápida con cola corta, para snaps de carrusel.
 * - exit: aceleración progresiva, para descartes (swipe to dismiss).
 */
export const EASES = {
  glide: CustomEase.create('osGlide', '0.16, 1, 0.3, 1'),
  settle: CustomEase.create('osSettle', '0.22, 1, 0.36, 1'),
  exit: CustomEase.create('osExit', '0.4, 0, 1, 1'),
}

export { gsap, ScrollTrigger, Flip, Observer, InertiaPlugin, CustomEase }
