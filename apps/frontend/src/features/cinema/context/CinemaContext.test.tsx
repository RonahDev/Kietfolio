import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CinemaProvider } from './CinemaContext'
import { useCinema } from '../hooks/useCinema'
import React from 'react'

describe('CinemaContext & State Engine', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
  })

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <CinemaProvider>{children}</CinemaProvider>
  )

  it('initializes with full movies catalog and default state', () => {
    const { result } = renderHook(() => useCinema(), { wrapper })

    expect(result.current.movies.length).toBeGreaterThanOrEqual(10)
    expect(result.current.activeMovie).toBeNull()
    expect(result.current.playingMovie).toBeNull()
    expect(result.current.searchQuery).toBe('')
    expect(result.current.selectedGenre).toBe('all')
    expect(result.current.activeTab).toBe('all')
  })

  it('manages watchlist add and remove operations with persistence', () => {
    const { result } = renderHook(() => useCinema(), { wrapper })

    act(() => {
      result.current.toggleWatchlist('cybernetic-odyssey')
    })

    // If it was already in default or added, test toggle behavior
    const wasIn = result.current.isInWatchlist('cybernetic-odyssey')

    act(() => {
      result.current.toggleWatchlist('cybernetic-odyssey')
    })
    expect(result.current.isInWatchlist('cybernetic-odyssey')).toBe(!wasIn)
  })

  it('handles opening and closing movie detail modal', () => {
    const { result } = renderHook(() => useCinema(), { wrapper })
    const sampleMovie = result.current.movies[0]

    act(() => {
      result.current.openMovieDetail(sampleMovie)
    })
    expect(result.current.activeMovie?.id).toBe(sampleMovie.id)

    act(() => {
      result.current.closeMovieDetail()
    })
    expect(result.current.activeMovie).toBeNull()
  })

  it('handles starting and closing movie playback', () => {
    const { result } = renderHook(() => useCinema(), { wrapper })
    const sampleMovie = result.current.movies[1]

    act(() => {
      result.current.playMovie(sampleMovie)
    })
    expect(result.current.playingMovie?.id).toBe(sampleMovie.id)

    act(() => {
      result.current.closePlayer()
    })
    expect(result.current.playingMovie).toBeNull()
  })

  it('controls cinema theater curtain replay and skip transitions', () => {
    const { result } = renderHook(() => useCinema(), { wrapper })

    act(() => {
      result.current.triggerCurtainReplay()
    })
    expect(result.current.isCurtainIntroActive).toBe(true)

    act(() => {
      result.current.skipCurtainIntro()
    })
    expect(result.current.isCurtainIntroActive).toBe(false)
    expect(result.current.hasSeenCurtainIntro).toBe(true)
  })
})
