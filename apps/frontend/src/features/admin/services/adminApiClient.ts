import { SITE_CONFIG } from '@/config'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

export class AdminApiClient {
  private baseUrl: string

  constructor(baseUrl: string = SITE_CONFIG.apiBaseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const cleanEndpoint = endpoint.replace(/^\//, '')
    const url = `${this.baseUrl}/${cleanEndpoint}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    }

    // Attach CSRF Token for state mutations
    const csrfToken = getCookie('kietfolio_csrf_token')
    if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method?.toUpperCase() || '')) {
      headers['X-CSRF-Token'] = csrfToken
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Guarantees HttpOnly session cookie transmission
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      const errorMsg = data?.error || `Request failed with status ${response.status}`
      throw new Error(errorMsg)
    }

    return data
  }

  public get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers })
  }

  public post<T>(endpoint: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    })
  }

  public put<T>(endpoint: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    })
  }

  public patch<T>(endpoint: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    })
  }

  public delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers })
  }
}

export const adminApi = new AdminApiClient()
