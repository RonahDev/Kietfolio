import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { MovieItem, CinemaViewTab } from '../types/cinema'
import { CINEMA_MOVIES } from '../data/moviesData'
import {
  fetchTMDbTrendingMovies,
  fetchKKPhimVietnameseMovies,
  fetchKKPhimStreamDetails,
  fetchTheatricalMovies,
  fetchTMDbNowPlayingVietnam,
} from '../services/cinemaService'
import { SITE_CONFIG } from '@/config'

const WATCHLIST_STORAGE_KEY = SITE_CONFIG.storageKeys.cinemaWatchlist || 'kietfolio_cinema_watchlist'
const CURTAIN_SEEN_SESSION_KEY = SITE_CONFIG.storageKeys.cinemaCurtainSeen || 'kietfolio_cinema_curtain_seen'

interface CinemaContextValue {
  movies: MovieItem[]
  activeMovie: MovieItem | null
  playingMovie: MovieItem | null
  watchlist: string[]
  searchQuery: string
  selectedGenre: string
  activeTab: CinemaViewTab
  isCurtainIntroActive: boolean
  hasSeenCurtainIntro: boolean
  isLoadingRemoteMovies: boolean
  isConnectingStream: boolean
  openMovieDetail: (movie: MovieItem) => void
  closeMovieDetail: () => void
  playMovie: (movie: MovieItem) => Promise<void> | void
  closePlayer: () => void
  toggleWatchlist: (movieId: string) => void
  isInWatchlist: (movieId: string) => boolean
  setSearchQuery: (query: string) => void
  setSelectedGenre: (genre: string) => void
  setActiveTab: (tab: CinemaViewTab) => void
  triggerCurtainReplay: () => void
  skipCurtainIntro: () => void
  finishCurtainIntro: () => void
}

const CinemaContext = createContext<CinemaContextValue | undefined>(undefined)

export const CinemaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<MovieItem[]>(CINEMA_MOVIES)
  const [activeMovie, setActiveMovie] = useState<MovieItem | null>(null)
  const [playingMovie, setPlayingMovie] = useState<MovieItem | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<CinemaViewTab>('all')
  const [isLoadingRemoteMovies, setIsLoadingRemoteMovies] = useState<boolean>(false)
  const [isConnectingStream, setIsConnectingStream] = useState<boolean>(false)

  // Check session storage for curtain animation flag
  const [hasSeenCurtainIntro, setHasSeenCurtainIntro] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    try {
      return sessionStorage.getItem(CURTAIN_SEEN_SESSION_KEY) === 'true'
    } catch {
      return false
    }
  })

  // Start with curtain active only if not seen in current session
  const [isCurtainIntroActive, setIsCurtainIntroActive] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    try {
      return sessionStorage.getItem(CURTAIN_SEEN_SESSION_KEY) !== 'true'
    } catch {
      return true
    }
  })

  // Watchlist persisted in localStorage
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY)
      return stored ? JSON.parse(stored) : ['cybernetic-odyssey', 'interstellar-logistics']
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist))
    } catch {
      // Ignore storage write errors
    }
  }, [watchlist])

  // =========================================================================
  // HYBRID DATA LOADER: TMDb API 4K Metadata + KKPhim Vietnamese Stream API
  // =========================================================================
  useEffect(() => {
    let isMounted = true

    async function loadHybridMovieCatalog() {
      setIsLoadingRemoteMovies(true)
      try {
        const [tmdbTrending, kkphimVietnamese, theatricalKk, tmdbTheatrical] = await Promise.allSettled([
          fetchTMDbTrendingMovies(),
          fetchKKPhimVietnameseMovies(),
          fetchTheatricalMovies(),
          fetchTMDbNowPlayingVietnam(),
        ])

        if (!isMounted) return

        const freshTmdbMovies = tmdbTrending.status === 'fulfilled' ? tmdbTrending.value : []
        const freshKkphimMovies = kkphimVietnamese.status === 'fulfilled' ? kkphimVietnamese.value : []
        const freshTheatricalMovies = theatricalKk.status === 'fulfilled' ? theatricalKk.value : []
        const freshTmdbTheatrical = tmdbTheatrical.status === 'fulfilled' ? tmdbTheatrical.value : []

        // Merge with deduplication based on ID and Title
        setMovies((prev) => {
          const map = new Map<string, MovieItem>()

          // 1. Add Theatrical release movies (Hot cinema titles)
          for (const m of freshTheatricalMovies) {
            map.set(m.id, m)
          }

          // 2. Add TMDb Vietnam Now Playing (if API key active)
          for (const m of freshTmdbTheatrical) {
            map.set(m.id, m)
          }

          // 3. Add TMDb trending movies (Priority for hero & trending)
          for (const m of freshTmdbMovies) {
            map.set(m.id, m)
          }

          // 4. Add KKPhim Vietnamese movies
          for (const m of freshKkphimMovies) {
            map.set(m.id, m)
          }

          // 5. Keep existing curated showcase movies as rock-solid fallback
          for (const m of prev) {
            if (!map.has(m.id)) {
              map.set(m.id, m)
            }
          }

          return Array.from(map.values())
        })
      } catch (err) {
        console.warn('[CinemaProvider]: Error fetching remote cinema catalog:', err)
      } finally {
        if (isMounted) {
          setIsLoadingRemoteMovies(false)
        }
      }
    }

    loadHybridMovieCatalog()

    return () => {
      isMounted = false
    }
  }, [])

  const openMovieDetail = useCallback((movie: MovieItem) => {
    setActiveMovie(movie)
  }, [])

  const closeMovieDetail = useCallback(() => {
    setActiveMovie(null)
  }, [])

  /**
   * Hybrid Player Launcher:
   * - If KKPhim title: on-demand resolves m3u8 playlist and episodes
   * - If TMDb / Blockbuster: plays 4K stream or trailer
   */
  const playMovie = useCallback(async (movie: MovieItem) => {
    if (movie.streamSource === 'kkphim' && movie.slug && !movie.videoStreamUrl) {
      setIsConnectingStream(true)
      try {
        const details = await fetchKKPhimStreamDetails(movie.slug)
        if (details) {
          const enrichedMovie: MovieItem = {
            ...movie,
            videoStreamUrl: details.videoStreamUrl,
            episodes: details.episodes,
          }
          setMovies((prev) =>
            prev.map((m) => (m.id === movie.id ? enrichedMovie : m))
          )
          setPlayingMovie(enrichedMovie)
          return
        }
      } catch (err) {
        console.warn('[CinemaProvider]: Could not fetch KKPhim stream details, playing default:', err)
      } finally {
        setIsConnectingStream(false)
      }
    }

    setPlayingMovie(movie)
  }, [])

  const closePlayer = useCallback(() => {
    setPlayingMovie(null)
  }, [])

  const toggleWatchlist = useCallback((movieId: string) => {
    setWatchlist((prev) =>
      prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
    )
  }, [])

  const isInWatchlist = useCallback(
    (movieId: string) => {
      return watchlist.includes(movieId)
    },
    [watchlist]
  )

  const triggerCurtainReplay = useCallback(() => {
    setIsCurtainIntroActive(true)
  }, [])

  const skipCurtainIntro = useCallback(() => {
    setIsCurtainIntroActive(false)
    setHasSeenCurtainIntro(true)
    try {
      sessionStorage.setItem(CURTAIN_SEEN_SESSION_KEY, 'true')
    } catch {
      // ignore
    }
  }, [])

  const finishCurtainIntro = useCallback(() => {
    setIsCurtainIntroActive(false)
    setHasSeenCurtainIntro(true)
    try {
      sessionStorage.setItem(CURTAIN_SEEN_SESSION_KEY, 'true')
    } catch {
      // ignore
    }
  }, [])

  const contextValue = useMemo<CinemaContextValue>(
    () => ({
      movies,
      activeMovie,
      playingMovie,
      watchlist,
      searchQuery,
      selectedGenre,
      activeTab,
      isCurtainIntroActive,
      hasSeenCurtainIntro,
      isLoadingRemoteMovies,
      isConnectingStream,
      openMovieDetail,
      closeMovieDetail,
      playMovie,
      closePlayer,
      toggleWatchlist,
      isInWatchlist,
      setSearchQuery,
      setSelectedGenre,
      setActiveTab,
      triggerCurtainReplay,
      skipCurtainIntro,
      finishCurtainIntro,
    }),
    [
      movies,
      activeMovie,
      playingMovie,
      watchlist,
      searchQuery,
      selectedGenre,
      activeTab,
      isCurtainIntroActive,
      hasSeenCurtainIntro,
      isLoadingRemoteMovies,
      isConnectingStream,
      openMovieDetail,
      closeMovieDetail,
      playMovie,
      closePlayer,
      toggleWatchlist,
      isInWatchlist,
      triggerCurtainReplay,
      skipCurtainIntro,
      finishCurtainIntro,
    ]
  )

  return <CinemaContext.Provider value={contextValue}>{children}</CinemaContext.Provider>
}

export { CinemaContext }
export type { CinemaContextValue }
