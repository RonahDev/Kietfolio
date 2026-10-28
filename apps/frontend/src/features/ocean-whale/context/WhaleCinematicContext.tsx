import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { isReducedMotion } from '@/animations'
import { WhaleCinematicContext, type WhaleCinematicContextType } from './whaleCinematicTypes'

const CINEMATIC_DURATION_MS = 4500

export const WhaleCinematicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCinematicActive, setIsCinematicActive] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const skipWhaleCinematic = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setIsCinematicActive(false)
    setHasPlayed(true)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kietfolio:whale-cinematic-end'))
    }
  }, [])

  const triggerWhaleCinematic = useCallback(() => {
    // Only runs ONCE per page load; does not repeat unless reloaded
    if (typeof window === 'undefined' || isReducedMotion() || hasPlayed) return

    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    setHasPlayed(true)
    setIsCinematicActive(true)
    window.dispatchEvent(
      new CustomEvent('kietfolio:whale-cinematic-start', {
        detail: { duration: CINEMATIC_DURATION_MS },
      })
    )

    timerRef.current = setTimeout(() => {
      skipWhaleCinematic()
    }, CINEMATIC_DURATION_MS)
  }, [hasPlayed, skipWhaleCinematic])

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
      if (
        e.key === 'Escape' ||
        e.key === 'Esc' ||
        e.code === 'Escape' ||
        e.keyCode === 27
      ) {
        skipWhaleCinematic()
      }
    }

    window.addEventListener('kietfolio:summon-whale', handleSummon)
    window.addEventListener('kietfolio:skip-whale', handleSkip)
    window.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      window.removeEventListener('kietfolio:summon-whale', handleSummon)
      window.removeEventListener('kietfolio:skip-whale', handleSkip)
      window.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [triggerWhaleCinematic, skipWhaleCinematic])

  const contextValue: WhaleCinematicContextType = useMemo(
    () => ({
      isCinematicActive,
      hasPlayed,
      triggerWhaleCinematic,
      skipWhaleCinematic,
    }),
    [isCinematicActive, hasPlayed, triggerWhaleCinematic, skipWhaleCinematic]
  )

  return (
    <WhaleCinematicContext.Provider value={contextValue}>
      {children}
    </WhaleCinematicContext.Provider>
  )
}
