import { apiClient } from '@/services/api/apiClient'
import { SITE_CONFIG } from '@/config'
import type { GuestbookEntry, UserRole } from '@/features/auth'

const DEFAULT_SEED_ENTRIES: GuestbookEntry[] = [
  {
    id: 'gb-seed-1',
    uid: 'seed-uid-1',
    name: 'Nguyễn Hoàng Long (FPT Software)',
    email: 'long.nh@fpt-software.com',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=LongNH',
    message:
      'Giao diện web màu xanh sấm sét rất ấn tượng, chuyển động Three.js và GSAP mượt mà! Thích cách Kiệt liên hệ tư duy vận hành điều phối tài xế vào kỹ thuật phần mềm.',
    role: 'visitor',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    isVerifiedGoogle: true,
  },
  {
    id: 'gb-seed-2',
    uid: 'seed-uid-2',
    name: 'Đồng nghiệp Trạm SPX 63BDG02',
    email: 'team.spx.hub@gmail.com',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=SPXTeam',
    message:
      'Chúc Kiệt gặt hái nhiều thành công! Tinh thần chịu áp lực ngày sale và khả năng điều phối gần 50 shipper của Kiệt ở hub Thủ Dầu Một luôn được anh em đánh giá rất cao.',
    role: 'visitor',
    timestamp: new Date(Date.now() - 3600000 * 36).toISOString(),
    isVerifiedGoogle: true,
  },
]

export interface CreateGuestbookDto {
  uid: string
  name: string
  email: string
  avatarUrl?: string
  message: string
  role?: UserRole
  isVerifiedGoogle?: boolean
}

export const guestbookApi = {
  /**
   * Fetch all guestbook entries
   */
  async getEntries(): Promise<GuestbookEntry[]> {
    if (apiClient.isRemoteEnabled) {
      try {
        const res = await apiClient.get<GuestbookEntry[]>('guestbook')
        return res.data
      } catch (err) {
        console.warn('Failed to fetch remote guestbook, checking local storage:', err)
      }
    }

    try {
      const stored = localStorage.getItem(SITE_CONFIG.storageKeys.guestbook)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch {
      // Ignore read errors
    }
    return DEFAULT_SEED_ENTRIES
  },

  /**
   * Create a new guestbook message entry
   */
  async createEntry(dto: CreateGuestbookDto): Promise<GuestbookEntry> {
    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      uid: dto.uid,
      name: dto.name,
      email: dto.email,
      avatarUrl: dto.avatarUrl,
      message: dto.message,
      role: dto.role || 'member',
      timestamp: new Date().toISOString(),
      isVerifiedGoogle: dto.isVerifiedGoogle ?? true,
    }

    if (apiClient.isRemoteEnabled) {
      try {
        const res = await apiClient.post<GuestbookEntry>('guestbook', dto)
        return res.data
      } catch (err) {
        console.warn('Failed to post remote guestbook, persisting locally:', err)
      }
    }

    // Local persistence
    try {
      const existing = await this.getEntries()
      const updated = [newEntry, ...existing]
      localStorage.setItem(SITE_CONFIG.storageKeys.guestbook, JSON.stringify(updated))
    } catch {
      // Ignore write errors
    }

    return newEntry
  },

  /**
   * Delete an entry (allowed if user is admin or the original author)
   */
  async deleteEntry(id: string, userUid: string, isAdmin: boolean): Promise<boolean> {
    if (apiClient.isRemoteEnabled) {
      try {
        await apiClient.delete(`guestbook/${id}`)
        return true
      } catch (err) {
        console.warn('Failed to delete remote guestbook entry, updating locally:', err)
      }
    }

    try {
      const existing = await this.getEntries()
      const updated = existing.filter((item) => {
        if (item.id !== id) return true
        return !(isAdmin || item.uid === userUid)
      })
      localStorage.setItem(SITE_CONFIG.storageKeys.guestbook, JSON.stringify(updated))
      return true
    } catch {
      return false
    }
  },
}
