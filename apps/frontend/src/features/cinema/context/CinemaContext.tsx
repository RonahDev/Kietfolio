import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { MovieItem, CinemaViewTab } from '../types/cinema'
import { CINEMA_MOVIES } from '../data/moviesData'
import {
  OFFICIAL_VIETNAMESE_THEATRICAL_MOVIES,
  OFFICIAL_ACTION_THRILLER_MOVIES,
  OFFICIAL_THEATRICAL_ANIME_MOVIES,
  fetchDynamicOfficialTheatrical,
} from '../services/officialMovieService'
import {
  fetchTMDbTrendingMovies,
  fetchKKPhimVietnameseMovies,
  fetchKKPhimStreamDetails,
  fetchTheatricalMovies,
  fetchTMDbNowPlayingVietnam,
  fetchBackendLiveMovies,
  fetchTMDbTrailerKey,
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
  isPlayingTrailer: boolean
  refreshCatalog: () => Promise<void>
  openMovieDetail: (movie: MovieItem) => void
  closeMovieDetail: () => void
  playMovie: (movie: MovieItem, options?: { isTrailer?: boolean }) => Promise<void> | void
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
  const [movies, setMovies] = useState<MovieItem[]>(() => [
    ...OFFICIAL_VIETNAMESE_THEATRICAL_MOVIES,
    ...OFFICIAL_ACTION_THRILLER_MOVIES,
    ...OFFICIAL_THEATRICAL_ANIME_MOVIES,
    ...CINEMA_MOVIES,
  ])
  const [activeMovie, setActiveMovie] = useState<MovieItem | null>(null)
  const [playingMovie, setPlayingMovie] = useState<MovieItem | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<CinemaViewTab>('all')
  const [isLoadingRemoteMovies, setIsLoadingRemoteMovies] = useState<boolean>(false)
  const [isConnectingStream, setIsConnectingStream] = useState<boolean>(false)
  const [isPlayingTrailer, setIsPlayingTrailer] = useState<boolean>(false)

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
  // HYBRID DATA LOADER: TMDb API 4K Metadata + KKPhim Stream + PostgreSQL Backend
  // =========================================================================
  const refreshCatalog = useCallback(async () => {
    setIsLoadingRemoteMovies(true)
    try {
      const [
        tmdbTrending,
        kkphimVietnamese,
        theatricalKk,
        tmdbTheatrical,
        officialVnTheatrical,
        backendLive,
      ] = await Promise.allSettled([
        fetchTMDbTrendingMovies(),
        fetchKKPhimVietnameseMovies(),
        fetchTheatricalMovies(),
        fetchTMDbNowPlayingVietnam(),
        fetchDynamicOfficialTheatrical(),
        fetchBackendLiveMovies(),
      ])

      const freshTmdbMovies = tmdbTrending.status === 'fulfilled' ? tmdbTrending.value : []
      const freshKkphimMovies = kkphimVietnamese.status === 'fulfilled' ? kkphimVietnamese.value : []
      const freshTheatricalMovies = theatricalKk.status === 'fulfilled' ? theatricalKk.value : []
      const freshTmdbTheatrical = tmdbTheatrical.status === 'fulfilled' ? tmdbTheatrical.value : []
      const freshOfficialVn = officialVnTheatrical.status === 'fulfilled' ? officialVnTheatrical.value : []
      const freshBackendMovies = backendLive.status === 'fulfilled' ? backendLive.value : []

      // Merge with resilient deduplication based on ID, Slug, and Title
      setMovies((prev) => {
        const map = new Map<string, MovieItem>()
        const slugToId = new Map<string, string>()
        const titleToId = new Map<string, string>()

        const addMovie = (m: MovieItem) => {
          if (!m || !m.title) return
          const normSlug = (m.slug || '').toLowerCase().trim()
          const normTitle = (m.title || '').toLowerCase().trim()

          // Check if movie already registered by slug, title or ID
          const existingId =
            (normSlug && slugToId.get(normSlug)) ||
            (normTitle && titleToId.get(normTitle)) ||
            (map.has(m.id) ? m.id : null)

          if (existingId) {
            const existing = map.get(existingId)
            if (existing) {
              // If existing is official, keep official verified assets (posters, backdrops, metadata)
              // but enrich with live video stream URL if existing lacks one
              if (!existing.videoStreamUrl && m.videoStreamUrl) {
                existing.videoStreamUrl = m.videoStreamUrl
              }
              if (!existing.trailerUrl && m.trailerUrl) {
                existing.trailerUrl = m.trailerUrl
              }
            }
            return
          }

          map.set(m.id, m)
          if (normSlug) slugToId.set(normSlug, m.id)
          if (normTitle) titleToId.set(normTitle, m.id)
        }

        // 1. Official Curated & Theatrical Anime Movies (Absolute Priority for Anime Artwork)
        for (const m of OFFICIAL_THEATRICAL_ANIME_MOVIES) {
          addMovie(m)
        }

        // 2. Official Action & Thriller Blockbusters (Absolute Priority for Action Artwork)
        for (const m of OFFICIAL_ACTION_THRILLER_MOVIES) {
          addMovie(m)
        }

        // 3. Official Vietnamese Theatrical Releases (Absolute Priority for VN Cinema)
        for (const m of freshOfficialVn) {
          addMovie(m)
        }
        for (const m of OFFICIAL_VIETNAMESE_THEATRICAL_MOVIES) {
          addMovie(m)
        }

        // 4. Live Synchronized Movies from PostgreSQL Backend
        for (const m of freshBackendMovies) {
          addMovie(m)
        }

        // 5. Theatrical release movies from KKPhim
        for (const m of freshTheatricalMovies) {
          addMovie(m)
        }

        // 6. TMDb Vietnam Now Playing
        for (const m of freshTmdbTheatrical) {
          addMovie(m)
        }

        // 7. TMDb trending movies (Priority for hero & trending)
        for (const m of freshTmdbMovies) {
          addMovie(m)
        }

        // 8. KKPhim Vietnamese movies
        for (const m of freshKkphimMovies) {
          addMovie(m)
        }

        // 9. Keep existing curated showcase movies
        for (const m of prev) {
          addMovie(m)
        }

        return Array.from(map.values())
      })
    } catch (err) {
      console.warn('[CinemaProvider]: Error fetching remote cinema catalog:', err)
    } finally {
      setIsLoadingRemoteMovies(false)
    }
  }, [])

  // Initial fetch and automatic background synchronization
  useEffect(() => {
    refreshCatalog()

    // Periodically check for newly ingested movies every 15 minutes
    const AUTO_REFRESH_INTERVAL_MS = 15 * 60 * 1000
    const timer = setInterval(() => {
      refreshCatalog()
    }, AUTO_REFRESH_INTERVAL_MS)

    // Window visibility listener: silently refresh when user returns to tab after >5 mins
    let lastRefreshTime = Date.now()
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastRefreshTime > 5 * 60 * 1000) {
        lastRefreshTime = Date.now()
        refreshCatalog()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [refreshCatalog])

  const openMovieDetail = useCallback((movie: MovieItem) => {
    setActiveMovie(movie)
  }, [])

  const closeMovieDetail = useCallback(() => {
    setActiveMovie(null)
  }, [])

  /**
   * Hybrid In-Web Player Launcher:
   * - Immediately sets playingMovie for instantaneous player opening without latency
   * - If movie has a KKPhim slug, asynchronously enriches with m3u8 playlist & episodes
   */
  const playMovie = useCallback((movie: MovieItem, options?: { isTrailer?: boolean }) => {
    // 1. Immediately open player with base movie data and record trailer mode
    setIsPlayingTrailer(Boolean(options?.isTrailer))
    setPlayingMovie(movie)

    // 2. If movie has a slug and user is playing full movie, enrich stream asynchronously
    if (movie.slug && !options?.isTrailer && (!movie.episodes || movie.episodes.length === 0)) {
      setIsConnectingStream(true)
      fetchKKPhimStreamDetails(movie.slug)
        .then((details) => {
          if (details && details.videoStreamUrl) {
            const enrichedMovie: MovieItem = {
              ...movie,
              videoStreamUrl: details.videoStreamUrl,
              episodes: details.episodes,
              streamSource: 'kkphim',
            }
            setMovies((prev) =>
              prev.map((m) => (m.id === movie.id ? enrichedMovie : m))
            )
            setPlayingMovie((current) => (current?.id === movie.id ? enrichedMovie : current))
          }
        })
        .catch((err) => {
          console.warn('[CinemaProvider]: Could not fetch KKPhim stream details, using in-web fallback:', err)
        })
        .finally(() => {
          setIsConnectingStream(false)
        })
    }

    // 3. If movie has a tmdbId and lacks an 11-char youtubeKey, enrich trailer key from TMDb
    if (movie.tmdbId && !movie.youtubeKey) {
      fetchTMDbTrailerKey(movie.tmdbId)
        .then((key) => {
          if (key) {
            const enrichedMovie: MovieItem = {
              ...movie,
              youtubeKey: key,
              trailerUrl: `https://www.youtube.com/watch?v=${key}`,
            }
            setMovies((prev) =>
              prev.map((m) => (m.id === movie.id ? enrichedMovie : m))
            )
            setPlayingMovie((current) => (current?.id === movie.id ? enrichedMovie : current))
          }
        })
        .catch(() => {})
    }
  }, [])

  const closePlayer = useCallback(() => {
    setPlayingMovie(null)
    setIsPlayingTrailer(false)
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
      isPlayingTrailer,
      refreshCatalog,
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
      isPlayingTrailer,
      refreshCatalog,
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
