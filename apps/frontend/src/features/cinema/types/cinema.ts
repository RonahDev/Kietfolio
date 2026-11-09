export type MaturityRating = 'G' | 'PG' | 'PG-13' | 'R' | 'TV-MA'
export type VideoQuality = '4K ULTRA HD' | '1080P FULL HD' | '720P HD'
export type AudioFormat = 'DOLBY ATMOS' | 'DOLBY 5.1' | 'STEREO'

export interface MovieCastMember {
  name: string
  role: string
  avatarUrl?: string
}

export interface MovieItem {
  id: string
  title: string
  tagline: string
  synopsis: string
  backdropUrl: string
  posterUrl: string
  trailerUrl: string
  videoStreamUrl: string
  year: number
  rating: number
  matchPercentage: number
  maturityRating: MaturityRating
  duration: string
  quality: VideoQuality
  audio: AudioFormat
  genres: string[]
  director: string
  cast: MovieCastMember[]
  isTrending?: boolean
  isFeaturedHero?: boolean
  isAwardWinning?: boolean
  isComingSoon?: boolean
  progressPercentage?: number
  similarMovieIds?: string[]
  // Hybrid TMDb + KKPhim extended properties
  tmdbId?: number
  slug?: string
  originTitle?: string
  isVietnamese?: boolean
  youtubeKey?: string
  streamSource?: 'hls' | 'youtube' | 'kkphim'
  episodes?: Array<{ name: string; slug: string; linkM3u8: string }>
  currentEpisodeIndex?: number
}

export interface CinemaGenre {
  id: string
  labelVi: string
  labelEn: string
}

export type CinemaViewTab = 'all' | 'movies' | 'series' | 'trending' | 'watchlist'

export interface CinemaPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  playbackRate: number
  isFullscreen: boolean
  selectedSubtitle: string
  selectedQuality: string
}
