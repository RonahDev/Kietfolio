import { SITE_CONFIG } from '../../config/site'
import type { ApiResponse, ApiError } from '../../types/api'

interface CacheEntry<T> {
  data: ApiResponse<T>
  expiresAt: number
}

interface RequestOptions extends RequestInit {
  cacheTtlMs?: number
}

/**
 * Universal High-Performance API Client with automatic JSON parsing,
 * in-flight request deduplication, memory caching, and timeout resilience.
 */
class ApiClient {
  private baseUrl: string
  private cache = new Map<string, CacheEntry<unknown>>()
  private inFlightRequests = new Map<string, Promise<ApiResponse<unknown>>>()

  constructor(baseUrl: string = SITE_CONFIG.apiBaseUrl) {
    this.baseUrl = baseUrl
  }

  get isRemoteEnabled(): boolean {
    return Boolean(this.baseUrl && this.baseUrl.trim().length > 0)
  }

  /**
   * Clears in-memory cache, optionally for a specific endpoint prefix
   */
  clearCache(prefix?: string): void {
    if (!prefix) {
      this.cache.clear()
      return
    }
    const normalizedPrefix = prefix.replace(/^\//, '')
    for (const key of this.cache.keys()) {
      if (key.startsWith(normalizedPrefix)) {
        this.cache.delete(key)
      }
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    if (!this.isRemoteEnabled) {
      throw new Error('Remote API endpoint is not configured. Falling back to local service.')
    }

    const { cacheTtlMs, ...fetchOptions } = options
    const normalizedEndpoint = endpoint.replace(/^\//, '')
    const method = (fetchOptions.method || 'GET').toUpperCase()

    // 1. Check in-memory cache for GET requests
    if (method === 'GET' && cacheTtlMs && cacheTtlMs > 0) {
      const cached = this.cache.get(normalizedEndpoint) as CacheEntry<T> | undefined
      if (cached && Date.now() < cached.expiresAt) {
        return cached.data
      }
    }

    // 2. In-flight request deduplication for concurrent GET requests
    if (method === 'GET') {
      const pendingPromise = this.inFlightRequests.get(normalizedEndpoint) as
        | Promise<ApiResponse<T>>
        | undefined
      if (pendingPromise) {
        return pendingPromise
      }
    }

    const controller = new AbortController()
    const timeout = setTimeout(
      () => controller.abort(),
      SITE_CONFIG.timeouts.apiDefaultMs
    )

    const executeRequest = async (): Promise<ApiResponse<T>> => {
      try {
        const url = `${this.baseUrl.replace(/\/$/, '')}/${normalizedEndpoint}`
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...fetchOptions.headers,
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const apiError: ApiError = {
            message: errorData.message || `HTTP ${response.status}: Request failed`,
            status: response.status,
            code: errorData.code,
          }
          throw apiError
        }

        const json = await response.json()
        const result: ApiResponse<T> = {
          data: json.data !== undefined ? json.data : json,
          success: true,
          message: json.message,
          timestamp: new Date().toISOString(),
        }

        // Store in cache if TTL requested
        if (method === 'GET' && cacheTtlMs && cacheTtlMs > 0) {
          this.cache.set(normalizedEndpoint, {
            data: result,
            expiresAt: Date.now() + cacheTtlMs,
          })
        }

        return result
      } finally {
        clearTimeout(timeout)
      }
    }

    if (method === 'GET') {
      const requestPromise = executeRequest().finally(() => {
        this.inFlightRequests.delete(normalizedEndpoint)
      })
      this.inFlightRequests.set(normalizedEndpoint, requestPromise as Promise<ApiResponse<unknown>>)
      return requestPromise
    }

    const result = await executeRequest()

    // Mutations invalidate relevant cache entries
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const resourcePrefix = normalizedEndpoint.split('/')[0]
      this.clearCache(resourcePrefix)
    }

    return result
  }

  async get<T>(
    endpoint: string,
    options?: { cacheTtlMs?: number }
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', cacheTtlMs: options?.cacheTtlMs ?? 15000 })
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()

