import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register plugins safely in client environments
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Check whether user prefers reduced motion for accessibility compliance
 */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
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
  },
}

