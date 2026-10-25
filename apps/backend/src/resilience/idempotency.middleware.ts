import { Request, Response, NextFunction } from 'express'
import { logger } from './logger'

interface IdempotentRecord {
  status: 'processing' | 'completed'
  statusCode?: number
  headers?: Record<string, string>
  body?: unknown
  createdAt: number
}

// In-memory idempotency cache (TTL: 24 hours)
const idempotencyStore = new Map<string, IdempotentRecord>()
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000

// Periodic garbage collection for expired keys
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of idempotencyStore.entries()) {
    if (now - record.createdAt > IDEMPOTENCY_TTL_MS) {
      idempotencyStore.delete(key)
    }
  }
}, 60 * 60 * 1000)

/**
 * Idempotency Middleware for mutation endpoints (POST, PUT, PATCH).
 * Protects payments, form submissions, and database state from accidental duplicate execution.
 */
export function idempotencyMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Only apply to state-mutating HTTP methods
  if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
    return next()
  }

  const key = (req.headers['idempotency-key'] || req.headers['x-idempotency-key']) as string | undefined

  if (!key || typeof key !== 'string' || key.trim().length === 0) {
    return next()
  }

  const normalizedKey = `${req.method}:${req.baseUrl || ''}${req.path}:${key.trim()}`
  const existing = idempotencyStore.get(normalizedKey)

  if (existing) {
    if (existing.status === 'processing') {
      logger.warn(`[Idempotency Conflict]: Duplicate in-flight request detected for key: ${key}`)
      res.status(409).json({
        success: false,
        error: 'An identical request is currently being processed. Please wait.',
        code: 'IDEMPOTENCY_IN_FLIGHT',
      })
      return
    }

    if (existing.status === 'completed' && existing.statusCode) {
      logger.info(`[Idempotency Replay]: Serving idempotent response for key: ${key}`)
      res.setHeader('X-Idempotent-Replay', 'true')
      res.status(existing.statusCode).json(existing.body)
      return
    }
  }

  // Register key as processing
  idempotencyStore.set(normalizedKey, {
    status: 'processing',
    createdAt: Date.now(),
  })

  // Intercept json response to capture body and status for future replays
  const originalJson = res.json.bind(res)
  res.json = (body: unknown) => {
    // Save successful / processed response
    idempotencyStore.set(normalizedKey, {
      status: 'completed',
      statusCode: res.statusCode,
      body,
      createdAt: Date.now(),
    })
    return originalJson(body)
  }

  next()
}
