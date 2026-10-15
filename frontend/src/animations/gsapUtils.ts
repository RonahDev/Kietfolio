import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register plugins safely in client environments
if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Check whether user prefers reduced motion for accessibility compliance
 */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Configure default animation timing and easing
 */
export const MOTION_CONFIG = {
  duration: {
    fast: 0.35,
    normal: 0.65,
    slow: 1.1,
  },
  ease: {
    smooth: 'power2.out',
    snappy: 'power3.out',
    technical: 'expo.out',
    bounce: 'back.out(1.7)',
  },
}

/**
 * Helper to create a smooth fade-in reveal with ScrollTrigger
 */
export function createScrollReveal(
  target: gsap.DOMTarget,
  trigger?: gsap.DOMTarget,
  vars: gsap.TweenVars = {}
) {
  if (isReducedMotion()) {
    gsap.set(target, { opacity: 1, y: 0 })
    return null
  }

  return gsap.fromTo(
    target,
    { opacity: 0, y: 35, ...vars.from },
    {
      opacity: 1,
      y: 0,
      duration: MOTION_CONFIG.duration.normal,
      ease: MOTION_CONFIG.ease.smooth,
      scrollTrigger: {
        trigger: trigger || target,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true,
      },
      ...vars,
    }
  )
}

/**
 * Helper for staggered reveals of lists/grids
 */
export function createStaggerReveal(
  targets: gsap.DOMTarget,
  trigger: gsap.DOMTarget,
  stagger: number = 0.1
) {
  if (isReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 })
    return null
  }

  return gsap.fromTo(
    targets,
    { opacity: 0, y: 30, scale: 0.98 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true,
      },
    }
  )
}

export { gsap, ScrollTrigger }
