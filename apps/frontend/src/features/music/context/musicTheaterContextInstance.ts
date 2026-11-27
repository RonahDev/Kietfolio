import { createContext } from 'react'
import type {
  ImportProgressItem,
  MusicAlbum,
  MusicArtist,
  MusicCategory,
  MusicHistoryEntry,
  MusicNavTab,
  MusicPlaylist,
  MusicSettings,
  MusicSortOption,
  MusicTrack,
  PlaylistDraftInput,
  RepeatMode,
} from '../types/music'

export interface ImportBatchSummary {
  imported: MusicTrack[]
  failed: Array<{ fileName: string; error: string }>
}

export interface MusicTheaterContextValue {
  // Navigation & Intro
  activeTab: MusicNavTab
  setActiveTab: (tab: MusicNavTab) => void
  selectedPlaylistId: string | null
  setSelectedPlaylistId: (id: string | null) => void
  selectedAlbumId: string | null
  setSelectedAlbumId: (id: string | null) => void
  selectedArtistId: string | null
  setSelectedArtistId: (id: string | null) => void
  introCompleted: boolean
  completeIntro: () => void
  replayIntro: () => void

  // Library Data
  curatedTracks: MusicTrack[]
  importedTracks: MusicTrack[]
  allTracks: MusicTrack[]
  albums: MusicAlbum[]
  artists: MusicArtist[]
  categories: MusicCategory[]
  playlists: MusicPlaylist[]
  favoriteIds: string[]
  historyEntries: MusicHistoryEntry[]
  isHydrated: boolean

  // Search / Filter / Sort
  searchQuery: string
  setSearchQuery: (query: string) => void
  sortBy: MusicSortOption
  setSortBy: (sort: MusicSortOption) => void
  sourceFilter: 'all' | 'curated' | 'local'
  setSourceFilter: (filter: 'all' | 'curated' | 'local') => void

  // Playback State
  currentTrack: MusicTrack | null
  queue: string[]
  isPlaying: boolean
  isLoadingAudio: boolean
  audioError: string | null
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isShuffle: boolean
  repeatMode: RepeatMode

  // Playback Actions
  playTrack: (track: MusicTrack, contextTracks?: MusicTrack[]) => Promise<void>
  playQueue: (tracks: MusicTrack[], startIndex?: number) => Promise<void>
  togglePlayPause: () => Promise<void>
  playNext: () => Promise<void>
  playPrevious: () => Promise<void>
  seekTo: (timeSeconds: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  toggleShuffle: () => void
  cycleRepeatMode: () => void
  stopPlayback: () => void

  // Favorites & History Actions
  toggleFavorite: (trackId: string) => Promise<void>
  isFavorite: (trackId: string) => boolean
  clearHistory: () => Promise<void>

  // Playlists & Local Collection Actions
  createPlaylist: (input: PlaylistDraftInput) => Promise<MusicPlaylist>
  updatePlaylist: (id: string, updates: Partial<PlaylistDraftInput>) => Promise<void>
  deletePlaylist: (id: string) => Promise<void>
  addTrackToPlaylist: (playlistId: string, trackId: string) => Promise<void>
  setTrackPlaylists: (trackId: string, playlistIds: string[]) => Promise<void>
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => Promise<void>
  reorderPlaylistTracks: (playlistId: string, fromIndex: number, toIndex: number) => Promise<void>
  updateTrackMetadata: (
    trackId: string,
    updates: Partial<Pick<MusicTrack, 'title' | 'artist' | 'album' | 'genre'>>
  ) => Promise<void>
  deleteImportedTrack: (trackId: string) => Promise<void>

  // Import Pipeline
  importItems: ImportProgressItem[]
  isImporting: boolean
  importFiles: (files: FileList | File[], targetPlaylistId?: string) => Promise<ImportBatchSummary>
  clearImportItems: () => void

  // Settings & Data Management
  settings: MusicSettings
  updateSettings: (partial: Partial<MusicSettings>) => void
  clearAllLocalData: () => Promise<void>
}

export const MusicTheaterContext = createContext<MusicTheaterContextValue | null>(null)
