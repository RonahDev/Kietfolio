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
  path?: string // Route or URL
  method?: string // For backend API (GET, POST, etc.)
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
