import { Request, Response, NextFunction } from 'express'
import crypto from 'node:crypto'

interface CacheEntry<T> {
  value: T
  expiresAt: number
  etag: string
  tags?: string[]
}

export class InMemoryCache {
  private static instance: InMemoryCache
  private cache = new Map<string, CacheEntry<unknown>>()
  private maxEntries: number
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
  }

  constructor(maxEntries = 2000) {
    this.maxEntries = maxEntries
  }

  public static getInstance(): InMemoryCache {
    if (!InMemoryCache.instance) {
      InMemoryCache.instance = new InMemoryCache()
    }
    return InMemoryCache.instance
  }

  /**
   * Set item in cache with TTL and optional tags
   */
  public set<T>(key: string, value: T, ttlSeconds = 60, tags?: string[]): void {
    if (this.cache.size >= this.maxEntries) {
      // LRU eviction: remove the oldest inserted key
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
        this.stats.evictions++
      }
    }

    const payload = JSON.stringify(value)
    const etag = `W/"${crypto.createHash('md5').update(payload).digest('hex').substring(0, 16)}"`

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
      etag,
      tags,
    })
  }

  /**
   * Get item from cache if not expired
   */
  public get<T>(key: string): { value: T; etag: string } | null {
    const entry = this.cache.get(key)
    if (!entry) {
      this.stats.misses++
      return null
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      this.stats.misses++
      return null
    }

    this.stats.hits++
    return { value: entry.value as T, etag: entry.etag }
  }

  /**
   * Invalidate by key prefix or tag (e.g., 'movies', 'banners')
   */
  public invalidatePrefix(prefix: string): number {
    let count = 0
    for (const [key, entry] of this.cache.entries()) {
      if (key.startsWith(prefix) || entry.tags?.includes(prefix)) {
        this.cache.delete(key)
        count++
      }
    }
    return count
  }

  /**
   * Clear entire cache
   */
  public clear(): void {
    this.cache.clear()
  }

  /**
   * Get telemetry stats
   */
  public getTelemetry(): {
    size: number
    maxEntries: number
    hits: number
    misses: number
    evictions: number
    hitRate: string
  } {
    const total = this.stats.hits + this.stats.misses
    const hitRate = total > 0 ? `${((this.stats.hits / total) * 100).toFixed(1)}%` : '0.0%'
    return {
      size: this.cache.size,
      maxEntries: this.maxEntries,
      hits: this.stats.hits,
      misses: this.stats.misses,
      evictions: this.stats.evictions,
      hitRate,
    }
  }
}

export const inMemoryCache = InMemoryCache.getInstance()

/**
 * Express Middleware for High-Speed HTTP Caching with ETag & 304 Support
 */
export function cacheResponse(ttlSeconds = 60, tag?: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Only cache GET or HEAD requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next()
    }

    // Cache key incorporates URL, query params, and auth role if relevant
    const cacheKey = `${req.baseUrl}${req.path}?${new URLSearchParams(req.query as Record<string, string>).toString()}`
    const cached = inMemoryCache.get(cacheKey)

    if (cached) {
      // Check ETag for 304 Not Modified
      const ifNoneMatch = req.header('If-None-Match')
      if (ifNoneMatch && ifNoneMatch === cached.etag) {
        res.setHeader('ETag', cached.etag)
        res.setHeader('Cache-Control', `public, max-age=${ttlSeconds}, stale-while-revalidate=${ttlSeconds * 2}`)
        res.setHeader('X-Cache-Status', 'HIT-304')
        res.status(304).end()
        return
      }

      res.setHeader('ETag', cached.etag)
      res.setHeader('Cache-Control', `public, max-age=${ttlSeconds}, stale-while-revalidate=${ttlSeconds * 2}`)
      res.setHeader('X-Cache-Status', 'HIT')
      res.status(200).json(cached.value)
      return
    }

    res.setHeader('X-Cache-Status', 'MISS')

    // Intercept res.json to capture response payload
    const originalJson = res.json.bind(res)
    res.json = (body: unknown) => {
      // Only cache successful 200 responses
      if (res.statusCode === 200 && body !== undefined && body !== null) {
        inMemoryCache.set(cacheKey, body, ttlSeconds, tag ? [tag] : undefined)
        const entry = inMemoryCache.get(cacheKey)
        if (entry) {
          res.setHeader('ETag', entry.etag)
          res.setHeader('Cache-Control', `public, max-age=${ttlSeconds}, stale-while-revalidate=${ttlSeconds * 2}`)
        }
      }
      return originalJson(body)
    }

    next()
  }
}
