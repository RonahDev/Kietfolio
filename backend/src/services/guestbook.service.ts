import { pool } from '../db/pool'
import { GuestbookEntry } from '../types'

const initialGuestbookEntries: GuestbookEntry[] = [
  {
    id: 'gb-init-1',
    name: 'Mai Anh Kiệt',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    roleTitle: 'Creator & Software Engineer',
    message: 'Welcome to Kietfolio! Feel free to leave a note, exchange thoughts, or connect.',
    timestamp: '2026-10-11T08:00:00.000Z',
    isGoogleVerified: true,
    isPinned: true,
  },
  {
    id: 'gb-init-2',
    name: 'SPX Operations Team',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    roleTitle: 'Logistics Operations Lead',
    message: 'Great operational leadership at Hub Thủ Dầu Một! Very proud to see the engineering mindset.',
    timestamp: '2026-10-12T10:15:00.000Z',
    isGoogleVerified: true,
  },
]

let memoryGuestbook: GuestbookEntry[] = [...initialGuestbookEntries]

export class GuestbookService {
  public static async getAll(): Promise<GuestbookEntry[]> {
    try {
      const res = await pool.query(
        `SELECT id, name, avatar, role_title as "roleTitle", message, 
                created_at as timestamp, is_google_verified as "isGoogleVerified", is_pinned as "isPinned"
         FROM guestbook_entries
         WHERE is_approved = true
         ORDER BY is_pinned DESC, created_at DESC`
      )
      if (res.rows.length > 0) {
        return res.rows
      }
      return memoryGuestbook
    } catch {
      return memoryGuestbook
    }
  }

  public static async create(entry: {
    name: string
    avatar?: string
    roleTitle?: string
    message: string
    isGoogleVerified?: boolean
    userUid?: string
  }): Promise<GuestbookEntry> {
    const id = `gb-${Date.now()}`
    const timestamp = new Date().toISOString()
    const newEntry: GuestbookEntry = {
      id,
      name: entry.name,
      avatar: entry.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      roleTitle: entry.roleTitle || 'Developer / Explorer',
      message: entry.message,
      timestamp,
      isGoogleVerified: Boolean(entry.isGoogleVerified),
      isPinned: false,
    }

    try {
      await pool.query(
        `INSERT INTO guestbook_entries (id, user_uid, name, avatar, role_title, message, is_google_verified, is_pinned, is_approved, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, false, true, $8)`,
        [id, entry.userUid || null, newEntry.name, newEntry.avatar, newEntry.roleTitle, newEntry.message, newEntry.isGoogleVerified, timestamp]
      )
    } catch {
      // Memory fallback
    }

    memoryGuestbook = [newEntry, ...memoryGuestbook]
    return newEntry
  }

  public static async delete(id: string): Promise<boolean> {
    try {
      await pool.query('DELETE FROM guestbook_entries WHERE id = $1', [id])
    } catch {
      // Memory fallback
    }
    memoryGuestbook = memoryGuestbook.filter((e) => e.id !== id)
    return true
  }
}
