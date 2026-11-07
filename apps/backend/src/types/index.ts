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

export type ErrorLogSource = 'system' | 'client'
export type ErrorLogLevel = 'error' | 'critical' | 'warn'

export interface ClientDeviceContext {
  userAgent?: string
  language?: string
  platform?: string
  screenResolution?: string
  viewport?: string
  cores?: number
  memoryGb?: number
  effectiveTier?: string
  online?: boolean
}

export interface ErrorLogItem {
  id: string
  timestamp: string
  source: ErrorLogSource
  level: ErrorLogLevel
  message: string
  stack?: string
  name?: string
  path?: string
  method?: string
  statusCode?: number
  userId?: string
  userEmail?: string
  userRole?: string
  ip?: string
  clientContext?: ClientDeviceContext
  meta?: Record<string, unknown>
}

export interface CreateErrorLogDto {
  message: string
  stack?: string
  name?: string
  path?: string
  level?: ErrorLogLevel
  userId?: string
  userEmail?: string
  userRole?: string
  clientContext?: ClientDeviceContext
  meta?: Record<string, unknown>
}

