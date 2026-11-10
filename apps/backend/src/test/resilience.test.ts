import { describe, it, expect, vi } from 'vitest'
import { TaskQueue } from '../resilience/taskQueue'
import { CircuitBreaker } from '../resilience/circuitBreaker'
import { retryWithBackoff } from '../resilience/retryWithBackoff'
import { InMemoryCache } from '../resilience/inMemoryCache'

describe('Backend Resilience Engineering Test Suite', () => {
  describe('TaskQueue & Dead-Letter Queue (DLQ)', () => {
    it('successfully processes enqueued tasks asynchronously', async () => {
      const queue = new TaskQueue(2)
      let processed = false

      queue.enqueue('test-job', { data: 123 }, async (payload) => {
        expect(payload.data).toBe(123)
        processed = true
      })

      // Allow microtask cycle
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(processed).toBe(true)
      expect(queue.getMetrics().deadLetterQueueCount).toBe(0)
    })

    it('routes permanently failing tasks to Dead-Letter Queue (DLQ) after maxRetries', async () => {
      const queue = new TaskQueue(1)
      let attempts = 0

      queue.enqueue(
        'failing-job',
        { attemptData: true },
        async () => {
          attempts++
          throw new Error('Database write failure')
        },
        2 // maxRetries = 2
      )

      // Wait for exponential backoff retries to exhaust
      await new Promise((resolve) => setTimeout(resolve, 3500))

      const metrics = queue.getMetrics()
      expect(metrics.deadLetterQueueCount).toBe(1)
      expect(metrics.recentDlqEntries[0].name).toBe('failing-job')
      expect(metrics.recentDlqEntries[0].error).toBe('Database write failure')
      expect(attempts).toBeGreaterThanOrEqual(3) // 1 initial + 2 retries
    })
  })

  describe('CircuitBreaker State Machine', () => {
    it('remains in CLOSED state during normal successful execution', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 3, recoveryTimeoutMs: 500, name: 'TestService' })
      expect(breaker.currentState).toBe('CLOSED')

      const result = await breaker.execute(async () => 'OK')
      expect(result).toBe('OK')
      expect(breaker.currentState).toBe('CLOSED')
    })

    it('transitions to OPEN state when failure threshold is reached and fast-fails', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 2, recoveryTimeoutMs: 200, name: 'VnpayGateway' })

      // 1st failure
      await expect(
        breaker.execute(async () => {
          throw new Error('Connection timeout')
        })
      ).rejects.toThrow('Connection timeout')
      expect(breaker.currentState).toBe('CLOSED')

      // 2nd failure -> Tripped to OPEN
      await expect(
        breaker.execute(async () => {
          throw new Error('Connection timeout')
        })
      ).rejects.toThrow('Connection timeout')
      expect(breaker.currentState).toBe('OPEN')

      // 3rd call: Should fast-fail instantly with CircuitBreakerError without invoking target function
      const probeFn = vi.fn()
      await expect(breaker.execute(probeFn)).rejects.toThrow(/circuit is OPEN/)
      expect(probeFn).not.toHaveBeenCalled()
    })

    it('transitions to HALF_OPEN after recovery timeout and recovers to CLOSED on successful probe', async () => {
      const breaker = new CircuitBreaker({ failureThreshold: 1, recoveryTimeoutMs: 100, name: 'RecoveryService' })

      // Trip to OPEN
      await expect(
        breaker.execute(async () => {
          throw new Error('Fatal')
        })
      ).rejects.toThrow('Fatal')
      expect(breaker.currentState).toBe('OPEN')

      // Wait for recovery timeout
      await new Promise((resolve) => setTimeout(resolve, 150))
      expect(breaker.currentState).toBe('HALF_OPEN')

      // Successful probe in HALF_OPEN restores circuit to CLOSED
      const res = await breaker.execute(async () => 'RESTORED')
      expect(res).toBe('RESTORED')
      expect(breaker.currentState).toBe('CLOSED')
    })
  })

  describe('retryWithBackoff with Jitter', () => {
    it('resolves on initial attempt when operation succeeds', async () => {
      const fn = vi.fn().mockResolvedValue('SUCCESS')
      const result = await retryWithBackoff(fn, { maxRetries: 3, baseDelayMs: 20 })

      expect(result).toBe('SUCCESS')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('retries on failure and succeeds on subsequent attempt', async () => {
      let callCount = 0
      const fn = vi.fn().mockImplementation(async () => {
        callCount++
        if (callCount < 3) {
          throw new Error('Temporary 503')
        }
        return 'RECOVERED'
      })

      const result = await retryWithBackoff(fn, { maxRetries: 4, baseDelayMs: 30 })
      expect(result).toBe('RECOVERED')
      expect(callCount).toBe(3)
    })

    it('throws error when all retries are exhausted', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('Persistent Database Deadlock'))

      await expect(
        retryWithBackoff(fn, { maxRetries: 2, baseDelayMs: 20 })
      ).rejects.toThrow('Persistent Database Deadlock')

      expect(fn).toHaveBeenCalledTimes(3) // 1 initial + 2 retries
    })
  })

  describe('High-Performance L1 InMemoryCache & LRU Eviction', () => {
    it('stores and retrieves cached items with valid ETag', () => {
      const cache = new InMemoryCache(100)
      cache.set('movie:conan', { title: 'Conan Movie 27' }, 60)

      const cached = cache.get<{ title: string }>('movie:conan')
      expect(cached).not.toBeNull()
      expect(cached?.value.title).toBe('Conan Movie 27')
      expect(cached?.etag).toMatch(/^W\/"[a-f0-9]{16}"$/)
    })

    it('evicts oldest items when maxEntries capacity is reached', () => {
      const cache = new InMemoryCache(2)
      cache.set('key1', 'val1', 60)
      cache.set('key2', 'val2', 60)
      cache.set('key3', 'val3', 60) // Evicts key1

      expect(cache.get('key1')).toBeNull()
      expect(cache.get('key2')?.value).toBe('val2')
      expect(cache.get('key3')?.value).toBe('val3')
      expect(cache.getTelemetry().evictions).toBe(1)
    })

    it('invalidates cache keys by prefix correctly', () => {
      const cache = new InMemoryCache(100)
      cache.set('movies:list:page1', [1, 2], 60)
      cache.set('movies:detail:mai', { id: 'mai' }, 60)
      cache.set('banners:hero', [{ id: 1 }], 60)

      const removed = cache.invalidatePrefix('movies')
      expect(removed).toBe(2)
      expect(cache.get('movies:list:page1')).toBeNull()
      expect(cache.get('movies:detail:mai')).toBeNull()
      expect(cache.get('banners:hero')).not.toBeNull()
    })

    it('calculates telemetry hitRate accurately', () => {
      const cache = new InMemoryCache(100)
      cache.set('hitKey', 42, 60)

      cache.get('hitKey') // Hit
      cache.get('hitKey') // Hit
      cache.get('missingKey') // Miss

      const telemetry = cache.getTelemetry()
      expect(telemetry.hits).toBe(2)
      expect(telemetry.misses).toBe(1)
      expect(telemetry.hitRate).toBe('66.7%')
    })
  })
})

