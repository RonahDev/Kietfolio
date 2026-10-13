import { useRef, useEffect } from 'react'
import { isReducedMotion } from './gsapUtils'

interface TiltOptions {
  maxTilt?: number // Maximum tilt in degrees
  perspective?: number
  scale?: number
  speed?: number
}

export function useTiltCard<T extends HTMLElement = HTMLDivElement>(options: TiltOptions = {}) {
  const ref = useRef<T>(null)
  const { maxTilt = 7, perspective = 1000, scale = 1.015 } = options

  useEffect(() => {
    const el = ref.current
    if (!el || isReducedMotion()) return

    let currentTiltX = 0
    let currentTiltY = 0
    let targetTiltX = 0
    let targetTiltY = 0
    let animId: number
    let isHovering = false

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height

      // -maxTilt to +maxTilt
      targetTiltY = (x - 0.5) * maxTilt * 2
      targetTiltX = -(y - 0.5) * maxTilt * 2

      // Set CSS variables for holographic glare highlight
      el.style.setProperty('--mouse-x', `${Math.round(x * 100)}%`)
      el.style.setProperty('--mouse-y', `${Math.round(y * 100)}%`)
    }

    const onMouseEnter = () => {
      isHovering = true
    }

    const onMouseLeave = () => {
      isHovering = false
      targetTiltX = 0
      targetTiltY = 0
      el.style.removeProperty('--mouse-x')
      el.style.removeProperty('--mouse-y')
    }

    const update = () => {
      currentTiltX += (targetTiltX - currentTiltX) * 0.1
      currentTiltY += (targetTiltY - currentTiltY) * 0.1

      const currentScale = isHovering ? scale : 1

      el.style.transform = `perspective(${perspective}px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg) scale3d(${currentScale}, ${currentScale}, 1)`

      animId = requestAnimationFrame(update)
    }

    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseenter', onMouseEnter)
    el.addEventListener('mouseleave', onMouseLeave)
    animId = requestAnimationFrame(update)

    return () => {
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseenter', onMouseEnter)
      el.removeEventListener('mouseleave', onMouseLeave)
      cancelAnimationFrame(animId)
      if (el) el.style.transform = ''
    }
  }, [maxTilt, perspective, scale])

  return ref
}
