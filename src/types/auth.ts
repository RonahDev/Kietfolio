export const ADMIN_EMAIL = 'kietteve22102005@gmail.com'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  role: 'admin' | 'visitor'
  provider: 'google' | 'demo'
  lastLoginAt: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  timestamp: string
  isVerifiedUser: boolean
  read: boolean
}

export interface GuestbookEntry {
  id: string
  uid: string
  name: string
  email: string
  avatarUrl?: string
  message: string
  role: 'admin' | 'visitor'
  timestamp: string
  isVerifiedGoogle: boolean
}

