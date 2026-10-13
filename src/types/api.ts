/**
 * Standard API Response envelope
 */
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  timestamp: string
}

/**
 * Standard API error structure
 */
export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: unknown
}

/**
 * Common async query state returned by hooks
 */
export interface QueryState<T> {
  data: T
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}
