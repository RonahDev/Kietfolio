import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isReducedMotion } from '../animations/gsapUtils'

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Custom hook for smooth GSAP ScrollTrigger section reveals
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>() {
  const sectionRef = useRef<T>(null)

  useEffect(() => {
    if (isReducedMotion() || !sectionRef.current) return

    const el = sectionRef.current
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return sectionRef
}
