import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { PerformanceProvider } from './PerformanceContext'
import { usePerformance } from '@/hooks'

describe('PerformanceContext & Adaptive FPS Engine', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <PerformanceProvider>{children}</PerformanceProvider>
  )

  it('initializes with default auto quality mode and valid device specs', () => {
    const { result } = renderHook(() => usePerformance(), { wrapper })

    expect(result.current.qualityMode).toBe('auto')
    expect(['high', 'medium', 'low']).toContain(result.current.tier)
    expect(result.current.fps).toBeGreaterThanOrEqual(1)
    expect(result.current.device).toBeDefined()
    expect(result.current.device.cores).toBeGreaterThanOrEqual(1)
  })

  it('allows manual switching of quality mode', () => {
    const { result } = renderHook(() => usePerformance(), { wrapper })

    act(() => {
      result.current.setQualityMode('low')
    })

    expect(result.current.qualityMode).toBe('low')
    expect(result.current.tier).toBe('low')
    expect(result.current.isLowPower).toBe(true)

    act(() => {
      result.current.setQualityMode('high')
    })

    expect(result.current.qualityMode).toBe('high')
    expect(result.current.tier).toBe('high')
    expect(result.current.isLowPower).toBe(false)
  })

  it('persists user selected quality mode in localStorage', () => {
    const { result } = renderHook(() => usePerformance(), { wrapper })

    act(() => {
      result.current.setQualityMode('medium')
    })

    expect(localStorage.getItem('kietfolio_perf_quality_mode')).toBe('medium')
  })
})

