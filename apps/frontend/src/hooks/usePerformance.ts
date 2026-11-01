import { useContext } from 'react'
import { PerformanceContext, type PerformanceContextValue } from '@/context/performanceTypes'

export const fallbackPerformanceContext: PerformanceContextValue = {
  fps: 60,
  tier: 'high',
  qualityMode: 'auto',
  setQualityMode: () => {},
  device: {
    isMobile: false,
    cores: 4,
    pixelRatio: 1,
    supportsWebGl: true,
    saveData: false,
  },
  isLowPower: false,
  isFpsStable: true,
}

export function usePerformance(): PerformanceContextValue {
  const context = useContext(PerformanceContext)
  if (!context) {
    return fallbackPerformanceContext
  }
  return context
}

