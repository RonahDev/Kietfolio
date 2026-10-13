import { useState, useEffect, useRef, useCallback } from 'react'
import { isReducedMotion } from './gsapUtils'

const CYBER_GLYPHS = '01<>/_#X[]{}!*~+=⚡▲'

export function useTextScramble(targetText: string, autoStart: boolean = true) {
  const [displayText, setDisplayText] = useState(targetText)
  const [isScrambling, setIsScrambling] = useState(false)
  const frameRef = useRef<number | null>(null)

  const trigger = useCallback(() => {
    if (isReducedMotion()) {
      setDisplayText(targetText)
      return
    }

    setIsScrambling(true)
    let iteration = 0
    const maxIterations = targetText.length * 3
    const startTime = performance.now()

    const update = (time: number) => {
      const elapsed = time - startTime
      iteration = Math.floor(elapsed / 24)

      const scrambled = targetText
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' '
          if (index < iteration / 3) {
            return targetText[index]
          }
          return CYBER_GLYPHS[Math.floor(Math.random() * CYBER_GLYPHS.length)]
        })
        .join('')

      setDisplayText(scrambled)

      if (iteration < maxIterations) {
        frameRef.current = requestAnimationFrame(update)
      } else {
        setDisplayText(targetText)
        setIsScrambling(false)
      }
    }

    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(update)
  }, [targetText])

  useEffect(() => {
    if (!autoStart) return

    let rafId: number | null = null
    const timer = setTimeout(() => {
      rafId = requestAnimationFrame(() => {
        trigger()
      })
    }, 50)

    return () => {
      clearTimeout(timer)
      if (rafId) cancelAnimationFrame(rafId)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [autoStart, trigger])

  return { displayText, isScrambling, trigger }
}
