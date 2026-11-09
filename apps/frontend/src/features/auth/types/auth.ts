import { SITE_CONFIG } from '@/config/site'

export const ADMIN_EMAIL = SITE_CONFIG.admin.email
export const ADMIN_AUTHORIZED_EMAILS = [
  SITE_CONFIG.admin.email.toLowerCase(),
  ...SITE_CONFIG.admin.additionalEmails.map((e) => e.toLowerCase()),
]

export type UserRole = 'admin' | 'vip' | 'member' | 'visitor'
export type AuthProviderType = 'google' | 'email' | 'demo'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  role: UserRole
  provider: AuthProviderType
  createdAt?: string
  lastLoginAt: string
  vipExpiresAt?: string | null
}

export interface UserRecord {
  uid: string
  name: string
  email: string
  passwordHash: string
  avatarUrl?: string
  role: UserRole
  provider: AuthProviderType
  createdAt: string
  vipExpiresAt?: string | null
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
  role: UserRole
  timestamp: string
  isVerifiedGoogle: boolean
}
