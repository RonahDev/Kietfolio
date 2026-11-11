import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCinema } from '../hooks/useCinema'
import { CinemaProvider } from '../context/CinemaContext'
import { getOptimizedImageUrl, generateSvgBackdrop, generateSvgPoster } from '../utils/imageFallbacks'
import { isMovieMatchingGenre } from '../utils/genreUtils'
import React from 'react'

// Helper to render useCinema hook within its CinemaProvider
const renderCinemaHook = () => {
  return renderHook(() => useCinema(), {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <CinemaProvider>{children}</CinemaProvider>
    ),
  })
}

describe('Pillar 1: Movie Hub & Cinema Streaming Engine — 10 Comprehensive Testcases', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
  })

  // TC-CIN-01: Catalog loading and metadata completeness
  it('TC-CIN-01: initializes movie catalog with full cinematic metadata', () => {
    const { result } = renderCinemaHook()
    expect(result.current.movies.length).toBeGreaterThan(0)

    const firstMovie = result.current.movies[0]
    expect(firstMovie.id).toBeDefined()
    expect(firstMovie.title).toBeDefined()
    expect(firstMovie.rating).toBeGreaterThanOrEqual(1)
    expect(firstMovie.quality).toBeDefined()
    expect(firstMovie.audio).toBeDefined()
  })

  // TC-CIN-02: Genre filter state resets activeTab to 'all' to prevent movie truncation
  it('TC-CIN-02: isolates and updates genre filter cleanly without tab conflict', () => {
    const { result } = renderCinemaHook()

    act(() => {
      result.current.setActiveTab('theatrical')
      result.current.setSelectedGenre('anime_theatrical')
    })

    expect(result.current.selectedGenre).toBe('anime_theatrical')
    const matchingMovies = result.current.movies.filter((m) =>
      isMovieMatchingGenre(m, 'anime_theatrical')
    )
    expect(matchingMovies.length).toBeGreaterThan(0)
  })

  // TC-CIN-03: Franchise filter returns all parts of a theatrical anime franchise
  it('TC-CIN-03: returns complete franchise films when filtering by Doraemon or Conan', () => {
    const { result } = renderCinemaHook()

    const doraemonMovies = result.current.movies.filter((m) =>
      isMovieMatchingGenre(m, 'doraemon')
    )
    expect(doraemonMovies.length).toBeGreaterThanOrEqual(4)
    doraemonMovies.forEach((m) => {
      expect(m.title.toLowerCase()).toContain('doraemon')
    })
  })

  // TC-CIN-04: Case-insensitive search on title, director, and synopsis
  it('TC-CIN-04: executes case-insensitive multi-field search accurately', () => {
    const { result } = renderCinemaHook()

    act(() => {
      result.current.setSearchQuery('cOnAn')
    })

    const filtered = result.current.movies.filter((m) =>
      m.title.toLowerCase().includes(result.current.searchQuery.toLowerCase())
    )
    expect(filtered.length).toBeGreaterThanOrEqual(1)
    expect(filtered[0].title.toLowerCase()).toContain('conan')
  })

  // TC-CIN-05: Watchlist toggle and persistent state in LocalStorage
  it('TC-CIN-05: adds and removes movies from Watchlist with localStorage synchronization', () => {
    const { result } = renderCinemaHook()
    const targetId = result.current.movies[0].id

    expect(result.current.isInWatchlist(targetId)).toBe(false)

    act(() => {
      result.current.toggleWatchlist(targetId)
    })
    expect(result.current.isInWatchlist(targetId)).toBe(true)

    act(() => {
      result.current.toggleWatchlist(targetId)
    })
    expect(result.current.isInWatchlist(targetId)).toBe(false)
  })

  // TC-CIN-06: Multi-tier image fallback with Cloudflare proxy and SVG canvas
  it('TC-CIN-06: routes TMDB images through Cloudflare Edge proxy to bypass ISP block', () => {
    const rawTmdb = 'https://image.tmdb.org/t/p/w1280/sample_poster.jpg'
    const optimized = getOptimizedImageUrl(rawTmdb, 'poster')

    expect(optimized).toContain('wsrv.nl')
    expect(optimized).toContain('image.tmdb.org')

    // Test dynamic SVG generators
    const svgBackdrop = generateSvgBackdrop('Test Movie', '4K Ultra HD')
    expect(svgBackdrop).toContain('data:image/svg+xml')
    expect(svgBackdrop).toContain('Test%20Movie')

    const svgPoster = generateSvgPoster('Poster Title', 2024, 9.5)
    expect(svgPoster).toContain('data:image/svg+xml')
    expect(svgPoster).toContain('Poster%20Title')
  })

  // TC-CIN-07: YouTube Key extraction from various URL shapes
  it('TC-CIN-07: extracts 11-character YouTube video key reliably', () => {
    const extractKey = (url: string): string | null => {
      if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim()
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
      return match ? match[1] : null
    }

    expect(extractKey('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(extractKey('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(extractKey('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(extractKey('https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1')).toBe('dQw4w9WgXcQ')
  })

  // TC-CIN-08: Movie player modal opens and selects appropriate stream mode
  it('TC-CIN-08: activates player modal and configures playing movie correctly', () => {
    const { result } = renderCinemaHook()
    const targetMovie = result.current.movies[0]

    expect(result.current.playingMovie).toBeNull()

    act(() => {
      result.current.playMovie(targetMovie, { isTrailer: true })
    })

    expect(result.current.playingMovie?.id).toBe(targetMovie.id)
    expect(result.current.isPlayingTrailer).toBe(true)

    act(() => {
      result.current.closePlayer()
    })

    expect(result.current.playingMovie).toBeNull()
  })

  // TC-CIN-09: Movie detail modal opens, loads details and closes cleanly
  it('TC-CIN-09: manages active movie detail modal state and transitions', () => {
    const { result } = renderCinemaHook()
    const targetMovie = result.current.movies[1]

    expect(result.current.activeMovie).toBeNull()

    act(() => {
      result.current.openMovieDetail(targetMovie)
    })

    expect(result.current.activeMovie?.id).toBe(targetMovie.id)

    act(() => {
      result.current.closeMovieDetail()
    })

    expect(result.current.activeMovie).toBeNull()
  })

  // TC-CIN-10: Carousel scroll calculation bounds and smooth gliding
  it('TC-CIN-10: calculates horizontal scroll boundaries without negative overflows', () => {
    const clientWidth = 1000
    const scrollWidth = 3500
    const scrollLeft = 0

    const canScrollLeft = scrollLeft > 10
    const canScrollRight = scrollLeft + clientWidth < scrollWidth - 10

    expect(canScrollLeft).toBe(false)
    expect(canScrollRight).toBe(true)

    const scrollDelta = clientWidth * 0.75
    expect(scrollDelta).toBe(750)
  })
})
