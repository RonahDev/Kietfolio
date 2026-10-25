import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  PerformanceContext,
  type PerformanceTier,
  type QualityMode,
  type DeviceProfile,
  type PerformanceContextValue,
} from './performanceTypes'

const STORAGE_QUALITY_KEY = 'kietfolio_perf_quality_mode'

function getInitialDeviceProfile(): DeviceProfile {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      cores: 4,
      pixelRatio: 1,
      supportsWebGl: true,
      saveData: false,
    }
  }

  const nav = navigator as Navigator & {
    deviceMemory?: number
    connection?: { saveData?: boolean }
  }

  const isMobile =
    (typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 768px)').matches) ||
    'ontouchstart' in window ||
    (typeof navigator !== 'undefined' && (navigator.maxTouchPoints || 0) > 0)

  let supportsWebGl = true
  try {
    const canvas = document.createElement('canvas')
    supportsWebGl = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    supportsWebGl = false
  }

  return {
    isMobile,
    cores: nav.hardwareConcurrency || 4,
    memoryGb: nav.deviceMemory,
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    supportsWebGl,
    saveData: Boolean(nav.connection?.saveData),
  }
}

function calculateInitialTier(profile: DeviceProfile): PerformanceTier {
  if (!profile.supportsWebGl || profile.saveData || profile.cores <= 2) {
    return 'low'
  }
  if (profile.isMobile && (profile.cores <= 4 || (profile.memoryGb && profile.memoryGb <= 4))) {
    return 'medium'
  }
  return 'high'
}

export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const device = useMemo(() => getInitialDeviceProfile(), [])

  const [qualityMode, setQualityModeState] = useState<QualityMode>(() => {
    if (typeof window === 'undefined') return 'auto'
    try {
      const saved = localStorage.getItem(STORAGE_QUALITY_KEY)
      if (saved === 'high' || saved === 'medium' || saved === 'low' || saved === 'auto') {
        return saved
      }
    } catch {
      // Ignore storage error
    }
    return 'auto'
  })

  const [fps, setFps] = useState<number>(60)
  const [tier, setTier] = useState<PerformanceTier>(() => calculateInitialTier(device))
  const [isFpsStable, setIsFpsStable] = useState<boolean>(true)

  const consecutiveLowRef = useRef<number>(0)
  const consecutiveHighRef = useRef<number>(0)
  const isDocumentVisibleRef = useRef<boolean>(true)

  // Quality override handler
  const setQualityMode = useCallback((mode: QualityMode) => {
    setQualityModeState(mode)
    try {
      localStorage.setItem(STORAGE_QUALITY_KEY, mode)
    } catch {
      // Ignore storage error
    }

    if (mode !== 'auto') {
      setTier(mode)
    }
  }, [])

  // 1. Synchronize HTML class for CSS styling overrides based on tier
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.classList.remove('perf-high', 'perf-medium', 'perf-low')
    root.classList.add(`perf-${tier}`)

    window.dispatchEvent(
      new CustomEvent('kietfolio:perf-tier-changed', {
        detail: { tier, fps },
      })
    )
  }, [tier, fps])

  // 2. High-Resolution FPS Measurement Engine (Zero Overkill, Lightweight)
  useEffect(() => {
    if (typeof window === 'undefined') return

    let animId: number
    let frameCount = 0
    let lastTime = performance.now()
    let lastFpsCalculationTime = lastTime

    const handleVisibility = () => {
      isDocumentVisibleRef.current = !document.hidden
      if (isDocumentVisibleRef.current) {
        lastTime = performance.now()
        lastFpsCalculationTime = lastTime
        frameCount = 0
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    const measureLoop = (currentTime: number) => {
      animId = requestAnimationFrame(measureLoop)

      if (!isDocumentVisibleRef.current) return

      frameCount++
      const elapsedSinceCalculation = currentTime - lastFpsCalculationTime

      // Calculate every 800ms
      if (elapsedSinceCalculation >= 800) {
        const measuredFps = Math.round((frameCount * 1000) / elapsedSinceCalculation)
        const clampedFps = Math.min(Math.max(measuredFps, 1), 144)

        setFps(clampedFps)
        frameCount = 0
        lastFpsCalculationTime = currentTime

        // Dynamic Tier Adaptation with Hysteresis (Anti-Jittering)
        if (qualityMode === 'auto') {
          if (clampedFps < 32) {
            consecutiveLowRef.current++
            consecutiveHighRef.current = 0

            // If FPS is critically low for ~2.4 seconds, downgrade tier
            if (consecutiveLowRef.current >= 3) {
              setTier((prev) => {
                if (prev === 'high') return 'medium'
                if (prev === 'medium') return 'low'
                return prev
              })
              setIsFpsStable(false)
              consecutiveLowRef.current = 0
            }
          } else if (clampedFps >= 55) {
            consecutiveHighRef.current++
            consecutiveLowRef.current = 0

            // If FPS is consistently silky smooth for ~4 seconds, upgrade tier
            if (consecutiveHighRef.current >= 5) {
              setTier((prev) => {
                if (prev === 'low') return 'medium'
                if (prev === 'medium') return 'high'
                return prev
              })
              setIsFpsStable(true)
              consecutiveHighRef.current = 0
            }
          } else {
            // Stable 35-54 FPS (medium sweet spot)
            consecutiveLowRef.current = 0
            consecutiveHighRef.current = 0
            setIsFpsStable(true)
          }
        }
      }

      lastTime = currentTime
    }

    animId = requestAnimationFrame(measureLoop)

    return () => {
      cancelAnimationFrame(animId)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [qualityMode])

  const contextValue: PerformanceContextValue = useMemo(
    () => ({
      fps,
      tier: qualityMode === 'auto' ? tier : qualityMode,
      qualityMode,
      setQualityMode,
      device,
      isLowPower: tier === 'low',
      isFpsStable,
    }),
    [fps, tier, qualityMode, setQualityMode, device, isFpsStable]
  )

  return <PerformanceContext.Provider value={contextValue}>{children}</PerformanceContext.Provider>
}

