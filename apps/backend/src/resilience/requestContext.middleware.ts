import { Request, Response, NextFunction } from 'express'
import crypto from 'node:crypto'
import { logger } from './logger'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      id: string
      startTime: number
    }
  }
}

export function requestContextMiddleware(req: Request, res: Response, next: NextFunction): void {
  // 1. Assign or preserve unique correlation/request ID
  const incomingId = req.headers['x-request-id'] as string | undefined
  const requestId = incomingId || crypto.randomUUID()
  req.id = requestId
  req.startTime = Date.now()

  res.setHeader('X-Request-Id', requestId)

  // 2. Log when response finishes
  res.on('finish', () => {
    const durationMs = Date.now() - req.startTime
    const statusCode = res.statusCode

    const logPayload = {
      requestId,
      method: req.method,
      path: req.originalUrl,
      status: statusCode,
      durationMs,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    }

    if (statusCode >= 500) {
      logger.error(`HTTP Server Error ${statusCode} on ${req.method} ${req.originalUrl}`, undefined, logPayload)
    } else if (statusCode >= 400) {
      logger.warn(`HTTP Client Warning ${statusCode} on ${req.method} ${req.originalUrl}`, logPayload)
    } else {
      logger.info(`HTTP ${statusCode} ${req.method} ${req.originalUrl} (${durationMs}ms)`, logPayload)
    }
  })

  next()
}
