import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { isReducedMotion } from './gsapUtils'

interface MagneticOptions {
  strength?: number // Magnetic pull strength (e.g. 0.35)
  radius?: number // Radius of influence in pixels
}

export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(
  options: MagneticOptions = {}
) {
  const ref = useRef<T>(null)
  const { strength = 0.35, radius = 120 } = options

  useEffect(() => {
    const el = ref.current
    if (!el || isReducedMotion()) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY)

      if (dist < radius) {
        const deltaX = (e.clientX - centerX) * strength
        const deltaY = (e.clientY - centerY) * strength

        gsap.to(el, {
          x: deltaX,
          y: deltaY,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      } else {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto',
        })
      }
    }

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)',
        overwrite: 'auto',
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
      gsap.killTweensOf(el)
    }
  }, [strength, radius])

  return ref
}
