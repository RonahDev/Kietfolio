import { useContext } from 'react'
import {
  MusicTheaterContext,
  type MusicTheaterContextValue,
} from '../context/musicTheaterContextInstance'

export function useMusicTheater(): MusicTheaterContextValue {
  const ctx = useContext(MusicTheaterContext)
  if (!ctx) {
    throw new Error('useMusicTheater must be used within MusicTheaterProvider')
  }
  return ctx
}

export function formatMusicTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const totalSec = Math.floor(seconds)
  const mins = Math.floor(totalSec / 60)
  const secs = totalSec % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
