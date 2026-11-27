import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { CinemaStreamHub } from '../CinemaStreamHub'
import { CinemaVideoPlayer } from '../components/CinemaVideoPlayer'
import { CinemaMovieCard } from '../components/CinemaMovieCard'
import { CinemaDetailModal } from '../components/CinemaDetailModal'
import { CinemaProvider } from '../context/CinemaContext'
import { useCinema } from '../hooks/useCinema'
import { fetchBackendLiveMovies, fetchKKPhimVietnameseMovies } from '../services/cinemaService'
import { LanguageProvider, AuthProvider, WhaleCinematicProvider, PerformanceProvider } from '@/context'
import type { MovieItem } from '../types/cinema'

vi.mock('../scenes/CurtainScene', () => ({
  CurtainScene: () => <div data-testid="mock-curtain-scene" />,
}))

const mockMovieA: MovieItem = {
  id: 'bugfix-movie-a',
  title: 'Phim A Multi Episode',
  tagline: 'Tagline A',
  synopsis: 'Synopsis A',
  backdropUrl: 'https://phimimg.com/upload/vod/a-bg.jpg',
  posterUrl: 'https://phimimg.com/upload/vod/a-poster.jpg',
  trailerUrl: '',
  videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  year: 2025,
  rating: 9.0,
  matchPercentage: 95,
  maturityRating: 'PG-13',
  duration: '1h 45m',
  quality: '4K ULTRA HD',
  audio: 'DOLBY ATMOS',
  genres: ['action'],
  director: 'Director A',
  cast: [{ name: 'Actor A', role: 'Lead' }],
  streamSource: 'kkphim',
  episodes: [
    { name: '1', slug: 'ep-1', linkM3u8: 'https://stream.example.com/a-1.m3u8' },
    { name: '2', slug: 'ep-2', linkM3u8: 'https://stream.example.com/a-2.m3u8' },
    { name: '3', slug: 'ep-3', linkM3u8: 'https://stream.example.com/a-3.m3u8' },
  ],
}

const mockMovieB: MovieItem = {
  ...mockMovieA,
  id: 'bugfix-movie-b',
  title: 'Phim B Single Stream',
  trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  youtubeKey: 'dQw4w9WgXcQ',
  episodes: [{ name: 'Full', slug: 'full', linkM3u8: 'https://stream.example.com/b-full.m3u8' }],
}

const renderWithAppProviders = async (ui: React.ReactElement) => {
  let result: ReturnType<typeof render>
  await act(async () => {
    result = render(
      <LanguageProvider>
        <AuthProvider>
          <WhaleCinematicProvider>
            <PerformanceProvider>{ui}</PerformanceProvider>
          </WhaleCinematicProvider>
        </AuthProvider>
      </LanguageProvider>
    )
  })
  return result!
}

describe('Cinema Page Bug Fixes Regression Suite', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.setItem('kietfolio_cinema_curtain_seen', 'true')
    vi.restoreAllMocks()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({}),
    } as Response)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('FIX-01: fetchBackendLiveMovies calls /api/movies without duplicate /api/api prefix', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { movies: [] } }),
    } as Response)

    await fetchBackendLiveMovies()

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const calledUrl = String(fetchSpy.mock.calls[0][0])
    expect(calledUrl).toBe('/api/movies?limit=50')
    expect(calledUrl).not.toContain('/api/api/')
  })

  it('FIX-02: KKPhim phimimg.com artwork is served directly over HTTPS without wsrv.nl wrapping', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        status: true,
        items: [
          {
            name: 'Phim Test',
            slug: 'phim-test',
            poster_url: 'upload/vod/2025/poster.jpg',
            thumb_url: 'https://phimimg.com/upload/vod/2025/thumb.jpg',
            year: 2025,
          },
        ],
      }),
    } as Response)

    const items = await fetchKKPhimVietnameseMovies()
    expect(items).toHaveLength(1)
    expect(items[0].posterUrl).toBe('https://phimimg.com/upload/vod/2025/poster.jpg')
    expect(items[0].backdropUrl).toBe('https://phimimg.com/upload/vod/2025/thumb.jpg')
    expect(items[0].posterUrl).not.toContain('wsrv.nl')
  })

  it('FIX-03: clicking a CinemaNavbar tab clears active searchQuery and shows that tab', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response)

    await renderWithAppProviders(<CinemaStreamHub onBackToPortfolio={vi.fn()} />)

    // Search for a movie first
    await act(async () => {
      fireEvent.click(screen.getByTitle('Tìm kiếm phim'))
    })
    const input = screen.getByPlaceholderText(/Tìm phim, đạo diễn/i)
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Oppenheimer' } })
    })
    expect(screen.getByText(/Kết quả tìm kiếm cho: "Oppenheimer"/i)).toBeDefined()

    // Click Watchlist tab in navbar -> should clear search and show watchlist view
    await act(async () => {
      fireEvent.click(screen.getByText(/Danh Sách Của Tôi/i))
    })
    expect(screen.getByText(/Danh Sách Phim Yêu Thích Của Tôi/i)).toBeDefined()
    expect(screen.queryByText(/Kết quả tìm kiếm cho:/i)).toBeNull()
  })

  it('FIX-04: CinemaVideoPlayer does NOT intercept Spacebar when player is closed', async () => {
    await renderWithAppProviders(
      <CinemaProvider>
        <CinemaVideoPlayer />
      </CinemaProvider>
    )

    const spaceEvent = new KeyboardEvent('keydown', {
      key: ' ',
      code: 'Space',
      cancelable: true,
      bubbles: true,
    })
    window.dispatchEvent(spaceEvent)

    expect(spaceEvent.defaultPrevented).toBe(false)
  })

  it('FIX-05: switching to another movie resets currentEpIndex and surfaces video error recovery UI', async () => {
    const PlayerHarness: React.FC = () => {
      const { playMovie, playingMovie } = useCinema()
      return (
        <div>
          <button type="button" onClick={() => playMovie(mockMovieA)}>
            Play A
          </button>
          <button type="button" onClick={() => playMovie(mockMovieB)}>
            Play B
          </button>
          <span data-testid="playing-id">{playingMovie?.id || 'none'}</span>
          <CinemaVideoPlayer />
        </div>
      )
    }

    const { container } = await renderWithAppProviders(
      <CinemaProvider>
        <PlayerHarness />
      </CinemaProvider>
    )

    // Open Movie A and select Episode 3
    await act(async () => {
      fireEvent.click(screen.getByText('Play A'))
    })
    await act(async () => {
      fireEvent.click(screen.getByText(/CHỌN TẬP \(3\)/i))
    })
    await act(async () => {
      fireEvent.click(screen.getByText('Tập 3'))
    })
    expect(screen.getByText('TẬP 3')).toBeDefined()

    // Switch to Movie B -> episode index resets to 0 (not stale index 2)
    await act(async () => {
      fireEvent.click(screen.getByText('Play B'))
    })
    expect(screen.queryByText('TẬP 3')).toBeNull()

    // Simulate HTML5 <video> load failure -> buffering stops and fallback recovery UI appears
    const videoEl = container.querySelector('video')
    expect(videoEl).not.toBeNull()
    await act(async () => {
      fireEvent(videoEl!, new Event('error'))
    })
    expect(screen.getByText(/CHẠY LUỒNG DỰ PHÒNG 4K TRÊN WEB/i)).toBeDefined()
  })

  it('FIX-06: CinemaMovieCard keeps loaded opacity-100 when parent re-renders with identical poster URL', async () => {
    let rerenderFn!: (ui: React.ReactElement) => void

    await act(async () => {
      const rendered = render(
        <LanguageProvider>
          <AuthProvider>
            <WhaleCinematicProvider>
              <PerformanceProvider>
                <CinemaProvider>
                  <CinemaMovieCard movie={mockMovieA} />
                </CinemaProvider>
              </PerformanceProvider>
            </WhaleCinematicProvider>
          </AuthProvider>
        </LanguageProvider>
      )
      rerenderFn = rendered.rerender
    })

    const img = screen.getByAltText(mockMovieA.title) as HTMLImageElement
    await act(async () => {
      fireEvent.load(img)
    })
    expect(img.className).toContain('opacity-100')

    // Re-render with a cloned movie object (new genres array ref, same posterUrl)
    const clonedMovie = { ...mockMovieA, genres: [...mockMovieA.genres] }
    await act(async () => {
      rerenderFn(
        <LanguageProvider>
          <AuthProvider>
            <WhaleCinematicProvider>
              <PerformanceProvider>
                <CinemaProvider>
                  <CinemaMovieCard movie={clonedMovie} />
                </CinemaProvider>
              </PerformanceProvider>
            </WhaleCinematicProvider>
          </AuthProvider>
        </LanguageProvider>
      )
    })

    expect(screen.getByAltText(mockMovieA.title).className).toContain('opacity-100')
  })

  it('FIX-07: CinemaDetailModal hides trailer button when movie has no YouTube key/URL', async () => {
    const ModalHarness: React.FC = () => {
      const { openMovieDetail } = useCinema()
      return (
        <div>
          <button type="button" onClick={() => openMovieDetail(mockMovieA)}>
            Open A
          </button>
          <button type="button" onClick={() => openMovieDetail(mockMovieB)}>
            Open B
          </button>
          <CinemaDetailModal />
        </div>
      )
    }

    await renderWithAppProviders(
      <CinemaProvider>
        <ModalHarness />
      </CinemaProvider>
    )

    await act(async () => {
      fireEvent.click(screen.getByText('Open A'))
    })
    expect(screen.queryByTitle('Xem trailer 4K trực tiếp trên web')).toBeNull()

    await act(async () => {
      fireEvent.click(screen.getByText('Open B'))
    })
    expect(screen.getByTitle('Xem trailer 4K trực tiếp trên web')).toBeDefined()
  })
})
