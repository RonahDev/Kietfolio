import { Request } from 'express'

export interface UserPayload {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  role: 'admin' | 'user'
  provider: 'google' | 'password'
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload
}

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

export interface PaymentRecord {
  id: string
  orderId: string
  userUid?: string
  donorName: string
  donorMessage?: string
  amount: number
  orderType: 'coffee' | 'mentorship' | 'custom'
  status: 'pending' | 'success' | 'failed'
  vnpTransactionNo?: string
  bankCode?: string
  responseCode?: string
  createdAt: string
  updatedAt: string
}

export interface CreatePaymentUrlPayload {
  amount: number
  donorName: string
  donorMessage?: string
  orderType?: 'coffee' | 'mentorship' | 'custom'
  bankCode?: string
  language?: 'vn' | 'en'
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

