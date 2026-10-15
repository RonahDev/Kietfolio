import { SITE_CONFIG } from '../../config/site'
import type { ApiResponse, ApiError } from '../../types/api'

/**
 * Universal API Client with automatic JSON parsing, timeout handling,
 * and seamless fallback between local persistence and remote REST endpoints.
 */
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = SITE_CONFIG.apiBaseUrl) {
    this.baseUrl = baseUrl
  }

  get isRemoteEnabled(): boolean {
    return Boolean(this.baseUrl && this.baseUrl.trim().length > 0)
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    if (!this.isRemoteEnabled) {
      throw new Error('Remote API endpoint is not configured. Falling back to local service.')
    }

    const controller = new AbortController()
    const timeout = setTimeout(
      () => controller.abort(),
      SITE_CONFIG.timeouts.apiDefaultMs
    )

    try {
      const url = `${this.baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...options.headers,
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
      return {
        data: json.data !== undefined ? json.data : json,
        success: true,
        message: json.message,
        timestamp: new Date().toISOString(),
      }
    } finally {
      clearTimeout(timeout)
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
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

