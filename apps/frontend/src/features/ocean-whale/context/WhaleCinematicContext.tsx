import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
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

  const triggerWhaleCinematic = useCallback((force: boolean | unknown = false) => {
    const isForce = force === true
    // Only runs ONCE automatically per page load; does not repeat unless reloaded or explicitly forced (e.g. login/summon)
    if (typeof window === 'undefined') return
    if (!isForce && hasPlayed) return

    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    setHasPlayed(true)
    setIsCinematicActive(true)
    window.dispatchEvent(
      new CustomEvent('kietfolio:whale-cinematic-start', {
        detail: { duration: CINEMATIC_DURATION_MS, force: isForce },
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

    const handleSummon = (e: Event) => {
      const customEvent = e as CustomEvent<{ force?: boolean }> | undefined
      triggerWhaleCinematic(customEvent?.detail?.force === true)
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
