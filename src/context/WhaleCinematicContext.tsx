import React, { useState, useEffect, useCallback, useRef } from 'react'
import { isReducedMotion } from '../animations/gsapUtils'
import { WhaleCinematicContext, type WhaleCinematicContextType } from './whaleCinematicTypes'

const CINEMATIC_DURATION_MS = 4500

export const WhaleCinematicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCinematicActive, setIsCinematicActive] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const skipWhaleCinematic = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setIsCinematicActive(false)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kietfolio:whale-cinematic-end'))
    }
  }, [])

  const triggerWhaleCinematic = useCallback(() => {
    if (typeof window === 'undefined' || isReducedMotion()) return

    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    setIsCinematicActive(true)
    window.dispatchEvent(
      new CustomEvent('kietfolio:whale-cinematic-start', {
        detail: { duration: CINEMATIC_DURATION_MS },
      })
    )

    timerRef.current = setTimeout(() => {
      skipWhaleCinematic()
    }, CINEMATIC_DURATION_MS)
  }, [skipWhaleCinematic])

  // Clean up timer on unmount only
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  // Window event & key listeners
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleSummon = () => {
      triggerWhaleCinematic()
    }

    const handleSkip = () => {
      skipWhaleCinematic()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        skipWhaleCinematic()
      }
    }

    window.addEventListener('kietfolio:summon-whale', handleSummon)
    window.addEventListener('kietfolio:skip-whale', handleSkip)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('kietfolio:summon-whale', handleSummon)
      window.removeEventListener('kietfolio:skip-whale', handleSkip)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [triggerWhaleCinematic, skipWhaleCinematic])

  const contextValue: WhaleCinematicContextType = {
    isCinematicActive,
    triggerWhaleCinematic,
    skipWhaleCinematic,
  }

  return (
    <WhaleCinematicContext.Provider value={contextValue}>
      {children}
    </WhaleCinematicContext.Provider>
  )
}
