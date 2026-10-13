export const ADMIN_EMAIL = 'kietteve22102005@gmail.com'

export type UserRole = 'admin' | 'member' | 'visitor'
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
