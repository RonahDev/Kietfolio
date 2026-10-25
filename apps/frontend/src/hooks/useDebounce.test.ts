import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from './useDebounce'

describe('useDebounce Hook QA Test Suite', () => {
  it('returns initial value immediately without delay', () => {
    const { result } = renderHook(() => useDebounce('initial-query', 300))
    expect(result.current).toBe('initial-query')
  })

  it('debounces rapid sequential updates and emits only the final value after delay', () => {
    vi.useFakeTimers()

    let value = 'query-1'
    const { result, rerender } = renderHook(() => useDebounce(value, 300))
    expect(result.current).toBe('query-1')

    // Rapid update 1
    value = 'query-2'
    rerender()
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe('query-1') // Has not emitted yet

    // Rapid update 2
    value = 'query-final'
    rerender()
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('query-1') // Timer reset by second change

    // Complete the remaining 100ms
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe('query-final')

    vi.useRealTimers()
  })
})

