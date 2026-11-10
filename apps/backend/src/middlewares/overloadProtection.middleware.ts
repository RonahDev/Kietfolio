import { Request, Response, NextFunction } from 'express'

// Track event loop latency (lag)
let lastCheck = Date.now()
let eventLoopLag = 0

// Sample event loop delay every 500ms
const interval = setInterval(() => {
  const now = Date.now()
  eventLoopLag = Math.max(0, now - lastCheck - 500)
  lastCheck = now
}, 500)

if (interval.unref) {
  interval.unref() // Do not prevent process exit
}

/**
 * Enterprise Overload Protection & Client Abort Middleware
 * Prevents cascading thread lockups under high-concurrency traffic bursts.
 */
export function overloadProtectionMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Always allow health checks to pass through for load balancers
  if (req.path === '/api/health' || req.path === '/') {
    return next()
  }

  // If event loop lag is critically high (> 200ms), shed non-essential traffic to preserve process integrity
  if (eventLoopLag > 200) {
    res.setHeader('Retry-After', '2')
    res.status(503).json({
      success: false,
      error: 'Server is experiencing high concurrency load. Please retry in a few seconds.',
      retryAfterSeconds: 2,
    })
    return
  }

  // Client abort tracking using native destroyed state or cleanup listener
  let clientAborted = false
  const onClose = () => {
    if (!res.writableEnded) {
      clientAborted = true
    }
  }

  req.once('close', onClose)
  res.once('finish', () => {
    req.removeListener('close', onClose)
  })

  // Attach aborted accessor to request
  Object.defineProperty(req, 'isAborted', {
    get: () => clientAborted || req.destroyed,
    configurable: true,
  })

  next()
}
