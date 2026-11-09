import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { MovieItem, CinemaViewTab } from '../types/cinema'
import { CINEMA_MOVIES } from '../data/moviesData'

const WATCHLIST_STORAGE_KEY = 'kietfolio_cinema_watchlist'
const CURTAIN_SEEN_SESSION_KEY = 'kietfolio_cinema_curtain_seen'

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
  openMovieDetail: (movie: MovieItem) => void
  closeMovieDetail: () => void
  playMovie: (movie: MovieItem) => void
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
  const [movies] = useState<MovieItem[]>(CINEMA_MOVIES)
  const [activeMovie, setActiveMovie] = useState<MovieItem | null>(null)
  const [playingMovie, setPlayingMovie] = useState<MovieItem | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<CinemaViewTab>('all')

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

  const openMovieDetail = useCallback((movie: MovieItem) => {
    setActiveMovie(movie)
  }, [])

  const closeMovieDetail = useCallback(() => {
    setActiveMovie(null)
  }, [])

  const playMovie = useCallback((movie: MovieItem) => {
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
