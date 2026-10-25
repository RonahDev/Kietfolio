import { createContext } from 'react'

export type PerformanceTier = 'high' | 'medium' | 'low'
export type QualityMode = 'auto' | 'high' | 'medium' | 'low'

export interface DeviceProfile {
  isMobile: boolean
  cores: number
  memoryGb?: number
  pixelRatio: number
  supportsWebGl: boolean
  saveData: boolean
}

export interface PerformanceContextValue {
  fps: number
  tier: PerformanceTier
  qualityMode: QualityMode
  setQualityMode: (mode: QualityMode) => void
  device: DeviceProfile
  isLowPower: boolean
  isFpsStable: boolean
}

export const PerformanceContext = createContext<PerformanceContextValue | null>(null)


