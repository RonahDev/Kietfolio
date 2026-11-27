import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { isReducedMotion } from '@/animations'
import { SITE_CONFIG } from '@/config/site'
import {
  CURATED_ALBUMS,
  CURATED_ARTISTS,
  CURATED_CATEGORIES,
  CURATED_TRACKS,
} from '../data/musicCatalog'
import { parseImportedAudioFile } from '../services/audioMetadataParser'
import { musicIndexedDb } from '../services/musicIndexedDb'
import { generateTheaterCoverDataUri, getOrCreateSynthWavUrl, revokeAllSynthUrls } from '../services/wavSynthEngine'
import type {
  ImportProgressItem,
  MusicHistoryEntry,
  MusicNavTab,
  MusicPlaylist,
  MusicSettings,
  MusicSortOption,
  MusicTrack,
  PlaylistDraftInput,
  RepeatMode,
} from '../types/music'
import {
  MusicTheaterContext,
  type ImportBatchSummary,
  type MusicTheaterContextValue,
} from './musicTheaterContextInstance'

const DEFAULT_SETTINGS: MusicSettings = {
  themePreset: 'concert-hall',
  defaultVolume: 0.78,
  autoplayNext: true,
  enableVisualizer: true,
  enableIntroSequence: true,
  reduceMotionOverride: false,
}

function loadSettings(): MusicSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  try {
    const raw = window.localStorage.getItem(SITE_CONFIG.storageKeys.musicSettings)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw) as Partial<MusicSettings>
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      defaultVolume:
        typeof parsed.defaultVolume === 'number'
          ? Math.max(0, Math.min(1, parsed.defaultVolume))
          : DEFAULT_SETTINGS.defaultVolume,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveSettings(settings: MusicSettings): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(SITE_CONFIG.storageKeys.musicSettings, JSON.stringify(settings))
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export const MusicTheaterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<MusicSettings>(() => loadSettings())
  const [activeTab, setActiveTab] = useState<MusicNavTab>('home')
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null)
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null)

  const [introCompleted, setIntroCompleted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    if (!loadSettings().enableIntroSequence || loadSettings().reduceMotionOverride || isReducedMotion()) {
      return true
    }
    try {
      return window.sessionStorage.getItem(SITE_CONFIG.storageKeys.musicIntroSeen) === '1'
    } catch {
      return false
    }
  })

  const [importedTracks, setImportedTracks] = useState<MusicTrack[]>([])
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([])
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [historyEntries, setHistoryEntries] = useState<MusicHistoryEntry[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<MusicSortOption>('recent-added')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'curated' | 'local'>('all')

  // Playback State
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(CURATED_TRACKS[0] ?? null)
  const [queue, setQueue] = useState<string[]>(() => CURATED_TRACKS.map((t) => t.id))
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState<number>(CURATED_TRACKS[0]?.duration ?? 0)
  const [volume, setVolumeState] = useState<number>(() => loadSettings().defaultVolume)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off')

  const [importItems, setImportItems] = useState<ImportProgressItem[]>([])
  const [isImporting, setIsImporting] = useState(false)

  // Single centralized audio element + active local objectUrl lifecycle ref
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const activeLocalObjectUrlRef = useRef<string | null>(null)
  const activeSrcTrackIdRef = useRef<string | null>(null)
  const lastHistoryRecordRef = useRef<{ trackId: string; timestamp: number } | null>(null)

  // Latest state refs for event callbacks without stale closures
  const queueRef = useRef(queue)
  queueRef.current = queue
  const currentTrackRef = useRef(currentTrack)
  currentTrackRef.current = currentTrack
  const isShuffleRef = useRef(isShuffle)
  isShuffleRef.current = isShuffle
  const repeatModeRef = useRef(repeatMode)
  repeatModeRef.current = repeatMode
  const settingsRef = useRef(settings)
  settingsRef.current = settings
  const favoriteIdsRef = useRef(favoriteIds)
  favoriteIdsRef.current = favoriteIds
  const playlistsRef = useRef(playlists)
  playlistsRef.current = playlists
  const importedTracksRef = useRef(importedTracks)
  importedTracksRef.current = importedTracks

  const allTracks = useMemo(() => [...importedTracks, ...CURATED_TRACKS], [importedTracks])
  const trackMap = useMemo(() => {
    const map = new Map<string, MusicTrack>()
    for (const track of allTracks) {
      map.set(track.id, track)
    }
    return map
  }, [allTracks])
  const trackMapRef = useRef(trackMap)
  trackMapRef.current = trackMap

  const revokeActiveLocalObjectUrl = useCallback(() => {
    if (activeLocalObjectUrlRef.current && typeof URL.revokeObjectURL === 'function') {
      URL.revokeObjectURL(activeLocalObjectUrlRef.current)
      activeLocalObjectUrlRef.current = null
    }
  }, [])

  // Hydrate persisted IndexedDB state cleanly on mount
  useEffect(() => {
    let cancelled = false
    async function hydrate() {
      try {
        const [tracks, savedPlaylists, savedFavorites, savedHistory] = await Promise.all([
          musicIndexedDb.getAllImportedTracks(),
          musicIndexedDb.getAllPlaylists(),
          musicIndexedDb.getFavorites(),
          musicIndexedDb.getHistory(),
        ])
        if (cancelled) return
        setImportedTracks((prev) => {
          const seen = new Set(prev.map((t) => t.id))
          const merged = [...prev, ...tracks.filter((t) => !seen.has(t.id))]
          importedTracksRef.current = merged.sort((a, b) => b.addedAt - a.addedAt)
          return importedTracksRef.current
        })
        setPlaylists((prev) => {
          const seen = new Set(prev.map((p) => p.id))
          const merged = [...prev, ...savedPlaylists.filter((p) => !seen.has(p.id))]
          playlistsRef.current = merged.sort((a, b) => b.updatedAt - a.updatedAt)
          return playlistsRef.current
        })
        setFavoriteIds((prev) => {
          const merged = Array.from(new Set([...prev, ...savedFavorites]))
          favoriteIdsRef.current = merged
          return merged
        })
        setHistoryEntries((prev) => {
          const seen = new Set(prev.map((h) => h.trackId))
          return [...prev, ...savedHistory.filter((h) => !seen.has(h.trackId))].sort(
            (a, b) => b.playedAt - a.playedAt
          )
        })
      } catch {
        // Fallback already handled inside musicIndexedDb
      } finally {
        if (!cancelled) setIsHydrated(true)
      }
    }
    void hydrate()
    return () => {
      cancelled = true
    }
  }, [])

  const recordListeningHistory = useCallback(async (trackId: string) => {
    const now = Date.now()
    const prev = lastHistoryRecordRef.current
    if (prev && prev.trackId === trackId && now - prev.timestamp < 4000) {
      return
    }
    lastHistoryRecordRef.current = { trackId, timestamp: now }
    const entry: MusicHistoryEntry = { trackId, playedAt: now }

    setHistoryEntries((existing) => {
      const deduped = existing.filter((item) => item.trackId !== trackId)
      return [entry, ...deduped].slice(0, 60)
    })

    try {
      await musicIndexedDb.upsertHistoryEntry(entry)
    } catch {
      // Non-fatal history persistence error
    }
  }, [])

  const resolveAudioSourceUrl = useCallback(
    async (track: MusicTrack): Promise<string> => {
      if (track.sourceType === 'local') {
        const blob = await musicIndexedDb.getAudioBlob(track.id)
        if (!blob) {
          throw new Error(`Audio data for "${track.title}" could not be found in local storage.`)
        }
        revokeActiveLocalObjectUrl()
        if (typeof URL.createObjectURL !== 'function') {
          throw new Error('Browser cannot create Object URLs for local audio playback.')
        }
        const url = URL.createObjectURL(blob)
        activeLocalObjectUrlRef.current = url
        return url
      }
      if (track.audioUrl) {
        revokeActiveLocalObjectUrl()
        return track.audioUrl
      }
      revokeActiveLocalObjectUrl()
      return getOrCreateSynthWavUrl(track.synthPresetId || 'nocturne-eb', track.duration || 16)
    },
    [revokeActiveLocalObjectUrl]
  )

  const loadAndPlayTrack = useCallback(
    async (track: MusicTrack) => {
      const audio = audioRef.current
      setCurrentTrack(track)
      setAudioError(null)
      setCurrentTime(0)
      setDuration(track.duration || 0)

      if (!audio) return

      setIsLoadingAudio(true)
      try {
        const srcUrl = await resolveAudioSourceUrl(track)
        activeSrcTrackIdRef.current = track.id
        audio.src = srcUrl
        audio.volume = isMuted ? 0 : volume
        audio.currentTime = 0
        const playPromise = audio.play()
        if (playPromise && typeof playPromise.then === 'function') {
          await playPromise
        }
        setIsPlaying(true)
        await recordListeningHistory(track.id)
      } catch (err) {
        setIsPlaying(false)
        setAudioError(
          err instanceof Error ? err.message : 'Unable to start audio playback for this track.'
        )
      } finally {
        setIsLoadingAudio(false)
      }
    },
    [isMuted, recordListeningHistory, resolveAudioSourceUrl, volume]
  )

  const pickNextTrackId = useCallback((forceAdvance: boolean): string | null => {
    const q = queueRef.current
    if (q.length === 0) return null
    const currentId = currentTrackRef.current?.id
    const idx = currentId ? q.indexOf(currentId) : -1

    if (isShuffleRef.current && q.length > 1) {
      const candidates = q.filter((id) => id !== currentId)
      return candidates[Math.floor(Math.random() * candidates.length)] ?? q[0]
    }

    if (idx === -1) return q[0]
    if (idx + 1 < q.length) return q[idx + 1]
    if (repeatModeRef.current === 'all' || forceAdvance) return q[0]
    return null
  }, [])

  // Initialize centralized HTMLAudioElement once
  useEffect(() => {
    if (typeof Audio === 'undefined') return
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.volume = volume
    audioRef.current = audio

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0)
    }

    const onLoadedMetadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration)
      }
    }

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onError = () => {
      setIsPlaying(false)
      setIsLoadingAudio(false)
      setAudioError('Playback interrupted: audio stream could not be decoded.')
    }

    const onEnded = () => {
      if (repeatModeRef.current === 'one') {
        audio.currentTime = 0
        void audio.play().catch(() => {})
        return
      }
      if (!settingsRef.current.autoplayNext) {
        setIsPlaying(false)
        return
      }
      const nextId = pickNextTrackId(false)
      if (!nextId) {
        setIsPlaying(false)
        return
      }
      const nextTrack = trackMapRef.current.get(nextId)
      if (nextTrack) {
        void loadAndPlayTrack(nextTrack)
      }
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.pause()
      audio.src = ''
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('ended', onEnded)
      audioRef.current = null
      revokeActiveLocalObjectUrl()
      revokeAllSynthUrls()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const playTrack = useCallback(
    async (track: MusicTrack, contextTracks?: MusicTrack[]) => {
      if (contextTracks && contextTracks.length > 0) {
        setQueue(contextTracks.map((t) => t.id))
      } else if (!queueRef.current.includes(track.id)) {
        setQueue((prev) => [track.id, ...prev])
      }
      await loadAndPlayTrack(track)
    },
    [loadAndPlayTrack]
  )

  const playQueue = useCallback(
    async (tracks: MusicTrack[], startIndex = 0) => {
      if (tracks.length === 0) return
      const safeIndex = Math.max(0, Math.min(tracks.length - 1, startIndex))
      setQueue(tracks.map((t) => t.id))
      await loadAndPlayTrack(tracks[safeIndex])
    },
    [loadAndPlayTrack]
  )

  const togglePlayPause = useCallback(async () => {
    const audio = audioRef.current
    const activeTrack = currentTrackRef.current
    if (!activeTrack) return

    if (!audio) {
      setIsPlaying((prev) => !prev)
      return
    }

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    if (activeSrcTrackIdRef.current !== activeTrack.id || !audio.src) {
      await loadAndPlayTrack(activeTrack)
      return
    }

    try {
      const playPromise = audio.play()
      if (playPromise && typeof playPromise.then === 'function') {
        await playPromise
      }
      setIsPlaying(true)
      await recordListeningHistory(activeTrack.id)
    } catch (err) {
      setIsPlaying(false)
      setAudioError(err instanceof Error ? err.message : 'Unable to resume audio playback.')
    }
  }, [isPlaying, loadAndPlayTrack, recordListeningHistory])

  const playNext = useCallback(async () => {
    const nextId = pickNextTrackId(true)
    if (!nextId) return
    const nextTrack = trackMapRef.current.get(nextId)
    if (nextTrack) {
      await loadAndPlayTrack(nextTrack)
    }
  }, [loadAndPlayTrack, pickNextTrackId])

  const playPrevious = useCallback(async () => {
    const audio = audioRef.current
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
      setCurrentTime(0)
      return
    }
    const q = queueRef.current
    if (q.length === 0) return
    const currentId = currentTrackRef.current?.id
    const idx = currentId ? q.indexOf(currentId) : 0
    const prevIdx = idx > 0 ? idx - 1 : q.length - 1
    const prevTrack = trackMapRef.current.get(q[prevIdx])
    if (prevTrack) {
      await loadAndPlayTrack(prevTrack)
    }
  }, [loadAndPlayTrack])

  const seekTo = useCallback((timeSeconds: number) => {
    const clamped = Math.max(0, timeSeconds)
    setCurrentTime(clamped)
    if (audioRef.current) {
      audioRef.current.currentTime = clamped
    }
  }, [])

  const setVolume = useCallback((nextVol: number) => {
    const clamped = Math.max(0, Math.min(1, nextVol))
    setVolumeState(clamped)
    setIsMuted(clamped === 0)
    if (audioRef.current) {
      audioRef.current.volume = clamped
    }
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted((prevMuted) => {
      const nextMuted = !prevMuted
      if (audioRef.current) {
        audioRef.current.volume = nextMuted ? 0 : volume > 0 ? volume : 0.75
      }
      if (!nextMuted && volume === 0) {
        setVolumeState(0.75)
      }
      return nextMuted
    })
  }, [volume])

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev)
  }, [])

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'))
  }, [])

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.src = ''
    }
    activeSrcTrackIdRef.current = null
    revokeActiveLocalObjectUrl()
    setIsPlaying(false)
    setCurrentTime(0)
  }, [revokeActiveLocalObjectUrl])

  const completeIntro = useCallback(() => {
    setIntroCompleted(true)
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem(SITE_CONFIG.storageKeys.musicIntroSeen, '1')
      } catch {
        // Ignore session storage errors
      }
    }
  }, [])

  const replayIntro = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.removeItem(SITE_CONFIG.storageKeys.musicIntroSeen)
      } catch {
        // Ignore session storage errors
      }
    }
    setIntroCompleted(false)
  }, [])

  const toggleFavorite = useCallback(async (trackId: string) => {
    const prev = favoriteIdsRef.current
    const updated = prev.includes(trackId)
      ? prev.filter((id) => id !== trackId)
      : [trackId, ...prev]
    favoriteIdsRef.current = updated
    setFavoriteIds(updated)
    try {
      await musicIndexedDb.saveFavorites(updated)
    } catch {
      // Ignore transient write errors
    }
  }, [])

  const isFavorite = useCallback(
    (trackId: string) => favoriteIds.includes(trackId),
    [favoriteIds]
  )

  const clearHistory = useCallback(async () => {
    setHistoryEntries([])
    await musicIndexedDb.clearHistory()
  }, [])

  const createPlaylist = useCallback(async (input: PlaylistDraftInput): Promise<MusicPlaylist> => {
    const cleanName = input.name.trim() || 'Untitled Recital'
    const cleanDesc = input.description.trim()
    const now = Date.now()
    const playlist: MusicPlaylist = {
      id: `pl_${now}_${Math.random().toString(36).slice(2, 8)}`,
      name: cleanName,
      description: cleanDesc,
      coverUrl:
        input.coverUrl?.trim() || generateTheaterCoverDataUri(cleanName, 'Personal Collection', 'gold'),
      trackIds: [],
      createdAt: now,
      updatedAt: now,
    }
    const next = [playlist, ...playlistsRef.current]
    playlistsRef.current = next
    setPlaylists(next)
    await musicIndexedDb.putPlaylist(playlist)
    return playlist
  }, [])

  const updatePlaylist = useCallback(
    async (id: string, updates: Partial<PlaylistDraftInput>) => {
      let target: MusicPlaylist | undefined
      const next = playlistsRef.current.map((pl) => {
        if (pl.id !== id) return pl
        const nextName = updates.name !== undefined ? updates.name.trim() || pl.name : pl.name
        const nextPlaylist: MusicPlaylist = {
          ...pl,
          name: nextName,
          description:
            updates.description !== undefined ? updates.description.trim() : pl.description,
          coverUrl: updates.coverUrl !== undefined ? updates.coverUrl : pl.coverUrl,
          updatedAt: Date.now(),
        }
        target = nextPlaylist
        return nextPlaylist
      })
      playlistsRef.current = next
      setPlaylists(next)
      if (target) {
        await musicIndexedDb.putPlaylist(target)
      }
    },
    []
  )

  const deletePlaylist = useCallback(async (id: string) => {
    const next = playlistsRef.current.filter((pl) => pl.id !== id)
    playlistsRef.current = next
    setPlaylists(next)
    setSelectedPlaylistId((curr) => (curr === id ? null : curr))
    await musicIndexedDb.deletePlaylist(id)
  }, [])

  const addTrackToPlaylist = useCallback(async (playlistId: string, trackId: string) => {
    let updatedPlaylist: MusicPlaylist | undefined
    const next = playlistsRef.current.map((pl) => {
      if (pl.id !== playlistId || pl.trackIds.includes(trackId)) return pl
      updatedPlaylist = {
        ...pl,
        trackIds: [...pl.trackIds, trackId],
        updatedAt: Date.now(),
      }
      return updatedPlaylist
    })
    playlistsRef.current = next
    setPlaylists(next)
    if (updatedPlaylist) {
      await musicIndexedDb.putPlaylist(updatedPlaylist)
    }
  }, [])

  const setTrackPlaylists = useCallback(async (trackId: string, playlistIds: string[]) => {
    const idSet = new Set(playlistIds)
    const changed: MusicPlaylist[] = []
    const next = playlistsRef.current.map((pl) => {
      const hasTrack = pl.trackIds.includes(trackId)
      const shouldHave = idSet.has(pl.id)
      if (hasTrack === shouldHave) return pl
      const nextPlaylist: MusicPlaylist = {
        ...pl,
        trackIds: shouldHave
          ? [...pl.trackIds, trackId]
          : pl.trackIds.filter((id) => id !== trackId),
        updatedAt: Date.now(),
      }
      changed.push(nextPlaylist)
      return nextPlaylist
    })
    playlistsRef.current = next
    setPlaylists(next)
    await Promise.all(changed.map((pl) => musicIndexedDb.putPlaylist(pl)))
  }, [])

  const removeTrackFromPlaylist = useCallback(async (playlistId: string, trackId: string) => {
    let updatedPlaylist: MusicPlaylist | undefined
    const next = playlistsRef.current.map((pl) => {
      if (pl.id !== playlistId) return pl
      updatedPlaylist = {
        ...pl,
        trackIds: pl.trackIds.filter((id) => id !== trackId),
        updatedAt: Date.now(),
      }
      return updatedPlaylist
    })
    playlistsRef.current = next
    setPlaylists(next)
    if (updatedPlaylist) {
      await musicIndexedDb.putPlaylist(updatedPlaylist)
    }
  }, [])

  const reorderPlaylistTracks = useCallback(
    async (playlistId: string, fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return
      let updatedPlaylist: MusicPlaylist | undefined
      const next = playlistsRef.current.map((pl) => {
        if (pl.id !== playlistId) return pl
        if (
          fromIndex < 0 ||
          toIndex < 0 ||
          fromIndex >= pl.trackIds.length ||
          toIndex >= pl.trackIds.length
        ) {
          return pl
        }
        const nextIds = [...pl.trackIds]
        const [moved] = nextIds.splice(fromIndex, 1)
        nextIds.splice(toIndex, 0, moved)
        updatedPlaylist = {
          ...pl,
          trackIds: nextIds,
          updatedAt: Date.now(),
        }
        return updatedPlaylist
      })
      playlistsRef.current = next
      setPlaylists(next)
      if (updatedPlaylist) {
        await musicIndexedDb.putPlaylist(updatedPlaylist)
      }
    },
    []
  )

  const updateTrackMetadata = useCallback(
    async (
      trackId: string,
      updates: Partial<Pick<MusicTrack, 'title' | 'artist' | 'album' | 'genre'>>
    ) => {
      let updatedTrack: MusicTrack | undefined
      const next = importedTracksRef.current.map((t) => {
        if (t.id !== trackId) return t
        updatedTrack = {
          ...t,
          title: updates.title?.trim() || t.title,
          artist: updates.artist?.trim() || t.artist,
          album: updates.album?.trim() || t.album,
          genre: updates.genre?.trim() || t.genre,
        }
        return updatedTrack
      })
      importedTracksRef.current = next
      setImportedTracks(next)
      if (currentTrackRef.current?.id === trackId && updatedTrack) {
        setCurrentTrack(updatedTrack)
      }
      if (updatedTrack) {
        await musicIndexedDb.updateTrackMetadata(updatedTrack)
      }
    },
    []
  )

  const deleteImportedTrack = useCallback(
    async (trackId: string) => {
      if (currentTrackRef.current?.id === trackId) {
        stopPlayback()
        setCurrentTrack(CURATED_TRACKS[0] ?? null)
      }

      const nextTracks = importedTracksRef.current.filter((t) => t.id !== trackId)
      importedTracksRef.current = nextTracks
      setImportedTracks(nextTracks)
      setQueue((prev) => prev.filter((id) => id !== trackId))

      const nextFavs = favoriteIdsRef.current.filter((id) => id !== trackId)
      favoriteIdsRef.current = nextFavs
      setFavoriteIds(nextFavs)
      setHistoryEntries((prev) => prev.filter((entry) => entry.trackId !== trackId))

      const modifiedPlaylists: MusicPlaylist[] = []
      const nextPlaylists = playlistsRef.current.map((pl) => {
        if (!pl.trackIds.includes(trackId)) return pl
        const updated: MusicPlaylist = {
          ...pl,
          trackIds: pl.trackIds.filter((id) => id !== trackId),
          updatedAt: Date.now(),
        }
        modifiedPlaylists.push(updated)
        return updated
      })
      playlistsRef.current = nextPlaylists
      setPlaylists(nextPlaylists)

      await Promise.all([
        musicIndexedDb.saveFavorites(nextFavs),
        musicIndexedDb.deleteImportedTrack(trackId),
        ...modifiedPlaylists.map((pl) => musicIndexedDb.putPlaylist(pl)),
      ])
    },
    [stopPlayback]
  )

  const importFiles = useCallback(
    async (files: FileList | File[], targetPlaylistId?: string): Promise<ImportBatchSummary> => {
      const fileArray = Array.from(files)
      const initialItems: ImportProgressItem[] = fileArray.map((file, index) => ({
        id: `imp_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 6)}`,
        fileName: file.name,
        size: file.size,
        status: 'queued',
        progress: 0,
      }))

      setImportItems(initialItems)
      setIsImporting(true)

      const imported: MusicTrack[] = []
      const failed: Array<{ fileName: string; error: string }> = []

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        const itemId = initialItems[i].id

        setImportItems((prev) =>
          prev.map((it) => (it.id === itemId ? { ...it, status: 'parsing', progress: 35 } : it))
        )

        try {
          const parsed = await parseImportedAudioFile(file)
          setImportItems((prev) =>
            prev.map((it) => (it.id === itemId ? { ...it, status: 'saving', progress: 75 } : it))
          )
          await musicIndexedDb.saveImportedTrack(parsed.track, parsed.blob)
          imported.push(parsed.track)
          setImportedTracks((prev) => [parsed.track, ...prev])

          if (targetPlaylistId) {
            await addTrackToPlaylist(targetPlaylistId, parsed.track.id)
          }

          setImportItems((prev) =>
            prev.map((it) =>
              it.id === itemId
                ? { ...it, status: 'done', progress: 100, trackId: parsed.track.id }
                : it
            )
          )
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to import audio file.'
          failed.push({ fileName: file.name, error: errorMessage })
          setImportItems((prev) =>
            prev.map((it) =>
              it.id === itemId ? { ...it, status: 'error', progress: 100, error: errorMessage } : it
            )
          )
        }
      }

      setIsImporting(false)
      return { imported, failed }
    },
    [addTrackToPlaylist]
  )

  const clearImportItems = useCallback(() => {
    setImportItems([])
  }, [])

  const updateSettings = useCallback((partial: Partial<MusicSettings>) => {
    setSettings((prev) => {
      const next: MusicSettings = { ...prev, ...partial }
      saveSettings(next)
      if (partial.defaultVolume !== undefined) {
        setVolumeState(partial.defaultVolume)
        if (audioRef.current) {
          audioRef.current.volume = partial.defaultVolume
        }
      }
      return next
    })
  }, [])

  const clearAllLocalData = useCallback(async () => {
    stopPlayback()
    setImportedTracks([])
    setPlaylists([])
    setFavoriteIds([])
    setHistoryEntries([])
    setSelectedPlaylistId(null)
    setQueue(CURATED_TRACKS.map((t) => t.id))
    setCurrentTrack(CURATED_TRACKS[0] ?? null)
    await musicIndexedDb.clearAllLocalMusicData()
  }, [stopPlayback])

  const value: MusicTheaterContextValue = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      selectedPlaylistId,
      setSelectedPlaylistId,
      selectedAlbumId,
      setSelectedAlbumId,
      selectedArtistId,
      setSelectedArtistId,
      introCompleted,
      completeIntro,
      replayIntro,

      curatedTracks: CURATED_TRACKS,
      importedTracks,
      allTracks,
      albums: CURATED_ALBUMS,
      artists: CURATED_ARTISTS,
      categories: CURATED_CATEGORIES,
      playlists,
      favoriteIds,
      historyEntries,
      isHydrated,

      searchQuery,
      setSearchQuery,
      sortBy,
      setSortBy,
      sourceFilter,
      setSourceFilter,

      currentTrack,
      queue,
      isPlaying,
      isLoadingAudio,
      audioError,
      currentTime,
      duration,
      volume,
      isMuted,
      isShuffle,
      repeatMode,

      playTrack,
      playQueue,
      togglePlayPause,
      playNext,
      playPrevious,
      seekTo,
      setVolume,
      toggleMute,
      toggleShuffle,
      cycleRepeatMode,
      stopPlayback,

      toggleFavorite,
      isFavorite,
      clearHistory,

      createPlaylist,
      updatePlaylist,
      deletePlaylist,
      addTrackToPlaylist,
      setTrackPlaylists,
      removeTrackFromPlaylist,
      reorderPlaylistTracks,
      updateTrackMetadata,
      deleteImportedTrack,

      importItems,
      isImporting,
      importFiles,
      clearImportItems,

      settings,
      updateSettings,
      clearAllLocalData,
    }),
    [
      activeTab,
      selectedPlaylistId,
      selectedAlbumId,
      selectedArtistId,
      introCompleted,
      completeIntro,
      replayIntro,
      importedTracks,
      allTracks,
      playlists,
      favoriteIds,
      historyEntries,
      isHydrated,
      searchQuery,
      sortBy,
      sourceFilter,
      currentTrack,
      queue,
      isPlaying,
      isLoadingAudio,
      audioError,
      currentTime,
      duration,
      volume,
      isMuted,
      isShuffle,
      repeatMode,
      playTrack,
      playQueue,
      togglePlayPause,
      playNext,
      playPrevious,
      seekTo,
      setVolume,
      toggleMute,
      toggleShuffle,
      cycleRepeatMode,
      stopPlayback,
      toggleFavorite,
      isFavorite,
      clearHistory,
      createPlaylist,
      updatePlaylist,
      deletePlaylist,
      addTrackToPlaylist,
      setTrackPlaylists,
      removeTrackFromPlaylist,
      reorderPlaylistTracks,
      updateTrackMetadata,
      deleteImportedTrack,
      importItems,
      isImporting,
      importFiles,
      clearImportItems,
      settings,
      updateSettings,
      clearAllLocalData,
    ]
  )

  return <MusicTheaterContext.Provider value={value}>{children}</MusicTheaterContext.Provider>
}
