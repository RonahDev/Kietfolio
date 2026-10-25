import { useContext } from 'react'
import { PerformanceContext, type PerformanceContextValue } from '@/context/performanceTypes'

export function usePerformance(): PerformanceContextValue {
  const context = useContext(PerformanceContext)
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider')
  }
  return context
}

