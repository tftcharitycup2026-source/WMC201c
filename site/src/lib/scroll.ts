import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'

let lenis: Lenis | null = null

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return () => {}
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.95 })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

/** Cuộn mượt đến một phần tử (#id) hoặc vị trí số. */
export function scrollToTarget(target: string | number) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}
