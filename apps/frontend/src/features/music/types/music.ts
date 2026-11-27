export const SUPPORTED_AUDIO_EXTENSIONS = [
  'mp3',
  'wav',
  'flac',
  'm4a',
  'ogg',
  'aac',
] as const

export type SupportedAudioFormat = (typeof SUPPORTED_AUDIO_EXTENSIONS)[number]

export type MusicSourceType = 'curated' | 'local'

export type RepeatMode = 'off' | 'all' | 'one'

export type MusicNavTab =
  | 'home'
  | 'discover'
  | 'all-songs'
  | 'albums'
  | 'artists'
  | 'my-playlists'
  | 'imported-music'
  | 'recently-played'
  | 'favorites'
  | 'settings'

export type MusicSortOption =
  | 'recent-added'
  | 'recent-played'
  | 'alphabetical'
  | 'duration-asc'
  | 'duration-desc'

export type MusicThemePreset = 'concert-hall' | 'warm-amber' | 'deep-velvet'

export interface MusicTrack {
  id: string
  title: string
  artist: string
  album: string
  genre: string
  duration: number // seconds
  format: SupportedAudioFormat | 'synth-wav'
  sourceType: MusicSourceType
  artworkUrl: string
  /** Optional synth recipe identifier for built-in curated concert pieces */
  synthPresetId?: string
  /** Optional key/movement subtitle for classical theater aesthetics */
  movementLabel?: string
  /** Optional direct audio streaming URL (e.g. CDN or remote audio stream) */
  audioUrl?: string
  fileSize?: number
  fileName?: string
  addedAt: number
  lastPlayedAt?: number
  playCount: number
}

export interface MusicPlaylist {
  id: string
  name: string
  description: string
  coverUrl: string
  trackIds: string[]
  createdAt: number
  updatedAt: number
  isSystem?: boolean
}

export interface MusicAlbum {
  id: string
  title: string
  artist: string
  year: number
  genre: string
  description: string
  coverUrl: string
  trackIds: string[]
}

export interface MusicArtist {
  id: string
  name: string
  eraOrRole: string
  bio: string
  portraitUrl: string
  featuredTrackIds: string[]
}

export interface MusicCategory {
  id: string
  name: string
  subtitle: string
  accentTone: 'gold' | 'burgundy' | 'amber'
  trackIds: string[]
}

export interface MusicHistoryEntry {
  trackId: string
  playedAt: number
}

export interface MusicSettings {
  themePreset: MusicThemePreset
  defaultVolume: number
  autoplayNext: boolean
  enableVisualizer: boolean
  enableIntroSequence: boolean
  reduceMotionOverride: boolean
}

export interface ImportProgressItem {
  id: string
  fileName: string
  size: number
  status: 'queued' | 'parsing' | 'saving' | 'done' | 'error'
  progress: number
  error?: string
  trackId?: string
}

export interface PlaylistDraftInput {
  name: string
  description: string
  coverUrl?: string
}
