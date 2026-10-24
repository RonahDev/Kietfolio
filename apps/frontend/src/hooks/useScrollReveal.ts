import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isReducedMotion } from '../animations/gsapUtils'

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger)
}

export interface ScrollRevealOptions {
  distance?: number
  duration?: number
  stagger?: number
  staggerSelector?: string
}

/**
 * Custom hook for smooth, eye-pleasing GSAP ScrollTrigger section & item reveals
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const {
    distance = 25,
    duration = 0.7,
    stagger = 0.08,
    staggerSelector = '.group, .card-reveal, [data-reveal]',
  } = options
  const sectionRef = useRef<T>(null)

  useEffect(() => {
    if (isReducedMotion() || !sectionRef.current) return

    const el = sectionRef.current

    const ctx = gsap.context(() => {
      // 1. Gentle fade & rise for the section container or section header
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: distance,
        },
        {
          opacity: 1,
          y: 0,
          duration,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      )

      // 2. Subtle staggered reveal for child cards/elements to create a delightful, gentle scroll cascade
      const childItems = el.querySelectorAll(staggerSelector)
      if (childItems.length > 0) {
        gsap.fromTo(
          childItems,
          {
            opacity: 0,
            y: distance * 0.75,
          },
          {
            opacity: 1,
            y: 0,
            duration: duration * 0.85,
            stagger,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: childItems[0] || el,
              start: 'top 88%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        )
      }
    }, el)

    return () => ctx.revert()
  }, [distance, duration, stagger, staggerSelector])

  return sectionRef
}
