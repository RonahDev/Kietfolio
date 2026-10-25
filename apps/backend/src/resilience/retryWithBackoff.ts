import { logger } from './logger'

export interface RetryOptions {
  maxRetries?: number
  baseDelayMs?: number
  maxDelayMs?: number
  shouldRetry?: (error: unknown, attempt: number) => boolean
  operationName?: string
}

/**
 * Executes an asynchronous operation with exponential backoff and randomized jitter.
 * Prevents Thundering Herd problems during temporary network or service degradation.
 *
 * @param fn The asynchronous function to execute
 * @param options Configuration for retry attempts, backoff timing, and retry predicates
 */
export async function retryWithBackoff<T>(
  fn: (attempt: number) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelayMs = 200,
    maxDelayMs = 3000,
    shouldRetry = () => true,
    operationName = 'AsyncOperation',
  } = options

  let attempt = 0

  while (true) {
    try {
      return await fn(attempt)
    } catch (error) {
      attempt++

      if (attempt > maxRetries || !shouldRetry(error, attempt)) {
        logger.error(`[Retry Exceeded]: ${operationName} failed after ${attempt - 1} retries`, error)
        throw error
      }

      // Calculate exponential backoff with full jitter
      const exponentialDelay = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt - 1))
      const jitteredDelay = Math.round(exponentialDelay * (0.5 + Math.random() * 0.5))

      logger.warn(
        `[Retry Backoff]: ${operationName} failed (attempt ${attempt}/${maxRetries}). Retrying in ${jitteredDelay}ms...`,
        { attempt, jitteredDelay },
        error
      )

      await new Promise((resolve) => setTimeout(resolve, jitteredDelay))
    }
  }
}

