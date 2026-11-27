import { SITE_CONFIG } from '@/config/site'
import type { MusicHistoryEntry, MusicPlaylist, MusicTrack } from '../types/music'

const DB_NAME = SITE_CONFIG.storageKeys.musicDbName
const DB_VERSION = 1

const STORES = {
  tracks: 'tracks',
  audioBlobs: 'audioBlobs',
  playlists: 'playlists',
  favorites: 'favorites',
  history: 'history',
} as const

interface AudioBlobRecord {
  id: string
  blob: Blob
}

interface FavoritesRecord {
  id: 'user_favorites'
  trackIds: string[]
}

/**
 * In-memory fallback store used only if IndexedDB is unavailable (SSR / private-mode restrictions).
 */
const memoryFallback = {
  tracks: new Map<string, MusicTrack>(),
  audioBlobs: new Map<string, Blob>(),
  playlists: new Map<string, MusicPlaylist>(),
  favorites: [] as string[],
  history: [] as MusicHistoryEntry[],
}

function hasIndexedDb(): boolean {
  return typeof indexedDB !== 'undefined'
}

let openDbPromise: Promise<IDBDatabase> | null = null

export function resetMusicDbConnectionForTests(): void {
  if (openDbPromise) {
    void openDbPromise.then((db) => db.close()).catch(() => {})
    openDbPromise = null
  }
  memoryFallback.tracks.clear()
  memoryFallback.audioBlobs.clear()
  memoryFallback.playlists.clear()
  memoryFallback.favorites = []
  memoryFallback.history = []
}

function getDb(): Promise<IDBDatabase> {
  if (!hasIndexedDb()) {
    return Promise.reject(new Error('IndexedDB unavailable'))
  }
  if (openDbPromise) {
    return openDbPromise
  }

  openDbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORES.tracks)) {
        db.createObjectStore(STORES.tracks, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(STORES.audioBlobs)) {
        db.createObjectStore(STORES.audioBlobs, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(STORES.playlists)) {
        db.createObjectStore(STORES.playlists, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(STORES.favorites)) {
        db.createObjectStore(STORES.favorites, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(STORES.history)) {
        db.createObjectStore(STORES.history, { keyPath: 'trackId' })
      }
    }

    request.onsuccess = () => {
      const db = request.result
      db.onversionchange = () => {
        db.close()
        openDbPromise = null
      }
      resolve(db)
    }

    request.onerror = () => {
      openDbPromise = null
      reject(request.error ?? new Error('Failed to open Music Theater IndexedDB'))
    }
  })

  return openDbPromise
}

function wrapRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'))
  })
}

function wrapTransaction(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'))
    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'))
  })
}

export const musicIndexedDb = {
  async saveImportedTrack(track: MusicTrack, blob: Blob): Promise<void> {
    if (!hasIndexedDb()) {
      memoryFallback.tracks.set(track.id, track)
      memoryFallback.audioBlobs.set(track.id, blob)
      return
    }
    const db = await getDb()
    // Keep track metadata and heavy binary blob in separate stores so listing tracks never hydrates Blobs into RAM.
    const tx = db.transaction([STORES.tracks, STORES.audioBlobs], 'readwrite')
    tx.objectStore(STORES.tracks).put(track)
    tx.objectStore(STORES.audioBlobs).put({ id: track.id, blob } satisfies AudioBlobRecord)
    await wrapTransaction(tx)
  },

  async updateTrackMetadata(track: MusicTrack): Promise<void> {
    if (!hasIndexedDb()) {
      memoryFallback.tracks.set(track.id, track)
      return
    }
    const db = await getDb()
    const tx = db.transaction(STORES.tracks, 'readwrite')
    tx.objectStore(STORES.tracks).put(track)
    await wrapTransaction(tx)
  },

  async getAllImportedTracks(): Promise<MusicTrack[]> {
    if (!hasIndexedDb()) {
      return Array.from(memoryFallback.tracks.values())
    }
    const db = await getDb()
    const tx = db.transaction(STORES.tracks, 'readonly')
    const results = await wrapRequest<MusicTrack[]>(tx.objectStore(STORES.tracks).getAll())
    return Array.isArray(results) ? results : []
  },

  async getAudioBlob(trackId: string): Promise<Blob | null> {
    if (!hasIndexedDb()) {
      return memoryFallback.audioBlobs.get(trackId) ?? null
    }
    const db = await getDb()
    const tx = db.transaction(STORES.audioBlobs, 'readonly')
    const record = await wrapRequest<AudioBlobRecord | undefined>(
      tx.objectStore(STORES.audioBlobs).get(trackId)
    )
    return record?.blob ?? null
  },

  async deleteImportedTrack(trackId: string): Promise<void> {
    if (!hasIndexedDb()) {
      memoryFallback.tracks.delete(trackId)
      memoryFallback.audioBlobs.delete(trackId)
      return
    }
    const db = await getDb()
    const tx = db.transaction([STORES.tracks, STORES.audioBlobs], 'readwrite')
    tx.objectStore(STORES.tracks).delete(trackId)
    tx.objectStore(STORES.audioBlobs).delete(trackId)
    await wrapTransaction(tx)
  },

  async putPlaylist(playlist: MusicPlaylist): Promise<void> {
    if (!hasIndexedDb()) {
      memoryFallback.playlists.set(playlist.id, playlist)
      return
    }
    const db = await getDb()
    const tx = db.transaction(STORES.playlists, 'readwrite')
    tx.objectStore(STORES.playlists).put(playlist)
    await wrapTransaction(tx)
  },

  async getAllPlaylists(): Promise<MusicPlaylist[]> {
    if (!hasIndexedDb()) {
      return Array.from(memoryFallback.playlists.values())
    }
    const db = await getDb()
    const tx = db.transaction(STORES.playlists, 'readonly')
    const results = await wrapRequest<MusicPlaylist[]>(tx.objectStore(STORES.playlists).getAll())
    return Array.isArray(results) ? results : []
  },

  async deletePlaylist(playlistId: string): Promise<void> {
    if (!hasIndexedDb()) {
      memoryFallback.playlists.delete(playlistId)
      return
    }
    const db = await getDb()
    const tx = db.transaction(STORES.playlists, 'readwrite')
    tx.objectStore(STORES.playlists).delete(playlistId)
    await wrapTransaction(tx)
  },

  async saveFavorites(trackIds: string[]): Promise<void> {
    if (!hasIndexedDb()) {
      memoryFallback.favorites = [...trackIds]
      return
    }
    const db = await getDb()
    const tx = db.transaction(STORES.favorites, 'readwrite')
    tx.objectStore(STORES.favorites).put({
      id: 'user_favorites',
      trackIds: [...trackIds],
    } satisfies FavoritesRecord)
    await wrapTransaction(tx)
  },

  async getFavorites(): Promise<string[]> {
    if (!hasIndexedDb()) {
      return [...memoryFallback.favorites]
    }
    const db = await getDb()
    const tx = db.transaction(STORES.favorites, 'readonly')
    const record = await wrapRequest<FavoritesRecord | undefined>(
      tx.objectStore(STORES.favorites).get('user_favorites')
    )
    return Array.isArray(record?.trackIds) ? record.trackIds : []
  },

  async upsertHistoryEntry(entry: MusicHistoryEntry): Promise<void> {
    if (!hasIndexedDb()) {
      const filtered = memoryFallback.history.filter((item) => item.trackId !== entry.trackId)
      memoryFallback.history = [entry, ...filtered].slice(0, 60)
      return
    }
    const db = await getDb()
    const tx = db.transaction(STORES.history, 'readwrite')
    tx.objectStore(STORES.history).put(entry)
    await wrapTransaction(tx)
  },

  async getHistory(): Promise<MusicHistoryEntry[]> {
    if (!hasIndexedDb()) {
      return [...memoryFallback.history].sort((a, b) => b.playedAt - a.playedAt)
    }
    const db = await getDb()
    const tx = db.transaction(STORES.history, 'readonly')
    const results = await wrapRequest<MusicHistoryEntry[]>(tx.objectStore(STORES.history).getAll())
    return Array.isArray(results) ? results.sort((a, b) => b.playedAt - a.playedAt) : []
  },

  async clearHistory(): Promise<void> {
    if (!hasIndexedDb()) {
      memoryFallback.history = []
      return
    }
    const db = await getDb()
    const tx = db.transaction(STORES.history, 'readwrite')
    tx.objectStore(STORES.history).clear()
    await wrapTransaction(tx)
  },

  async clearAllLocalMusicData(): Promise<void> {
    if (!hasIndexedDb()) {
      memoryFallback.tracks.clear()
      memoryFallback.audioBlobs.clear()
      memoryFallback.playlists.clear()
      memoryFallback.favorites = []
      memoryFallback.history = []
      return
    }
    const db = await getDb()
    const tx = db.transaction(
      [STORES.tracks, STORES.audioBlobs, STORES.playlists, STORES.favorites, STORES.history],
      'readwrite'
    )
    tx.objectStore(STORES.tracks).clear()
    tx.objectStore(STORES.audioBlobs).clear()
    tx.objectStore(STORES.playlists).clear()
    tx.objectStore(STORES.favorites).clear()
    tx.objectStore(STORES.history).clear()
    await wrapTransaction(tx)
  },
}
