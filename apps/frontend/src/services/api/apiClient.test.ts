import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiClient } from './apiClient'

describe('Universal ApiClient Performance & Resilience Test Suite', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    apiClient.clearCache()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('deduplicates concurrent in-flight GET requests and makes only 1 network fetch', async () => {
    let fetchCount = 0
    globalThis.fetch = vi.fn().mockImplementation(async () => {
      fetchCount++
      await new Promise((resolve) => setTimeout(resolve, 50))
      return {
        ok: true,
        json: async () => ({ success: true, data: [{ id: 1, title: 'Item 1' }] }),
      } as unknown as Response
    })

    // Fire 3 concurrent GET requests to the exact same endpoint
    const [res1, res2, res3] = await Promise.all([
      apiClient.get('projects'),
      apiClient.get('projects'),
      apiClient.get('projects'),
    ])

    expect(fetchCount).toBe(1)
    expect(res1.data).toEqual(res2.data)
    expect(res2.data).toEqual(res3.data)
  })

  it('serves repeated GET calls within TTL directly from cache (0 network requests)', async () => {
    let fetchCount = 0
    globalThis.fetch = vi.fn().mockImplementation(async () => {
      fetchCount++
      return {
        ok: true,
        json: async () => ({ success: true, data: 'CachedData' }),
      } as unknown as Response
    })

    // 1st request -> Fetch network
    const firstCall = await apiClient.get('guestbook', { cacheTtlMs: 5000 })
    expect(firstCall.data).toBe('CachedData')
    expect(fetchCount).toBe(1)

    // 2nd request -> Cached hit immediately
    const secondCall = await apiClient.get('guestbook', { cacheTtlMs: 5000 })
    expect(secondCall.data).toBe('CachedData')
    expect(fetchCount).toBe(1) // Still 1 fetch!
  })

  it('invalidates resource cache on mutation POST or DELETE operations', async () => {
    let fetchCount = 0
    globalThis.fetch = vi.fn().mockImplementation(async () => {
      fetchCount++
      return {
        ok: true,
        json: async () => ({ success: true, data: 'FreshData' }),
      } as unknown as Response
    })

    // 1. Populate cache
    await apiClient.get('guestbook', { cacheTtlMs: 10000 })
    expect(fetchCount).toBe(1)

    // 2. Perform POST mutation
    await apiClient.post('guestbook', { message: 'Hello!' })
    expect(fetchCount).toBe(2)

    // 3. Next GET request should trigger a fresh fetch because cache was invalidated
    await apiClient.get('guestbook', { cacheTtlMs: 10000 })
    expect(fetchCount).toBe(3)
  })
})

