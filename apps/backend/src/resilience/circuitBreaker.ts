import { logger } from './logger'

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

export interface CircuitBreakerOptions {
  failureThreshold?: number // Number of failures to trigger OPEN state
  recoveryTimeoutMs?: number // Cooldown duration in OPEN state before testing HALF_OPEN
  name?: string
}

/**
 * Circuit Breaker pattern implementation to prevent cascading socket starvation
 * when remote dependencies or external APIs are unavailable or degraded.
 */
export class CircuitBreaker {
  private state: CircuitState = 'CLOSED'
  private failureCount = 0
  private lastFailureTime = 0
  private readonly failureThreshold: number
  private readonly recoveryTimeoutMs: number
  private readonly name: string

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 5
    this.recoveryTimeoutMs = options.recoveryTimeoutMs ?? 10000
    this.name = options.name ?? 'ExternalService'
  }

  get currentState(): CircuitState {
    // If OPEN and recovery timeout has passed, transition to HALF_OPEN
    if (this.state === 'OPEN' && Date.now() - this.lastFailureTime > this.recoveryTimeoutMs) {
      this.state = 'HALF_OPEN'
      logger.info(`[Circuit Breaker]: ${this.name} transitioned from OPEN to HALF_OPEN (probing...)`)
    }
    return this.state
  }

  async execute<T>(fn: () => Promise<T>, fallback?: () => Promise<T>): Promise<T> {
    const currentState = this.currentState

    if (currentState === 'OPEN') {
      logger.warn(`[Circuit Breaker Fast-Fail]: ${this.name} circuit is OPEN. Request blocked.`)
      if (fallback) {
        return await fallback()
      }
      throw new Error(`CircuitBreakerError: ${this.name} is currently unavailable (circuit is OPEN).`)
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure(error)
      if (fallback) {
        logger.info(`[Circuit Breaker Fallback]: Executing graceful degradation fallback for ${this.name}`)
        return await fallback()
      }
      throw error
    }
  }

  private onSuccess() {
    if (this.state === 'HALF_OPEN') {
      logger.info(`[Circuit Breaker Restored]: Probe succeeded. ${this.name} transitioned to CLOSED.`)
    }
    this.failureCount = 0
    this.state = 'CLOSED'
  }

  private onFailure(error: unknown) {
    this.failureCount++
    this.lastFailureTime = Date.now()

    logger.warn(`[Circuit Breaker Failure]: ${this.name} recorded failure #${this.failureCount}`, undefined, error)

    if (this.state === 'HALF_OPEN' || this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN'
      logger.error(`[Circuit Breaker Tripped]: ${this.name} circuit tripped to OPEN state for ${this.recoveryTimeoutMs}ms.`)
    }
  }

  getStatus() {
    return {
      name: this.name,
      state: this.currentState,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime ? new Date(this.lastFailureTime).toISOString() : null,
    }
  }
}

