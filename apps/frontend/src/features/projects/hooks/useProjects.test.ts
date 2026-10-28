import { describe, it, expect } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useProjects } from './useProjects'

describe('useProjects Hook', () => {
  it('loads all projects by default', async () => {
    const { result } = renderHook(() => useProjects('all'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.projects.length).toBeGreaterThan(0)
    expect(result.current.activeCategory).toBe('all')
    expect(result.current.error).toBeNull()
  })

  it('filters projects by category', async () => {
    const { result } = renderHook(() => useProjects('all'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const totalCount = result.current.projects.length

    act(() => {
      result.current.setActiveCategory('fullstack')
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.activeCategory).toBe('fullstack')
    })

    expect(result.current.projects.every((p) => p.category === 'fullstack')).toBe(true)
    expect(result.current.projects.length).toBeLessThanOrEqual(totalCount)
  })

  it('filters creative category projects accurately', async () => {
    const { result } = renderHook(() => useProjects('creative'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.activeCategory).toBe('creative')
    expect(result.current.projects.every((p) => p.category === 'creative')).toBe(true)
  })
})

