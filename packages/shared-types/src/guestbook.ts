export interface GuestbookEntry {
  id: string
  name: string
  avatar: string
  roleTitle: string
  message: string
  timestamp: string
  isGoogleVerified: boolean
  isPinned?: boolean
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

