import { Request, Response, NextFunction } from 'express'
import { config } from '../config/env'
import { ErrorLogService } from '../services/errorLog.service'

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // eslint-disable-next-line no-console
  console.error('[Unhandled Error Intercepted]:', err)

  // Automatically record to Central System Error Logging Engine
  try {
    ErrorLogService.record({
      source: 'system',
      level: 'error',
      name: err.name || 'InternalServerError',
      message: err.message || 'An unhandled exception occurred in request pipeline.',
      stack: err.stack,
      path: req.originalUrl || req.url,
      method: req.method,
      statusCode: 500,
      ip: (req.headers['x-forwarded-for'] as string) || req.ip || req.socket?.remoteAddress,
    })
  } catch {
    // Non-blocking log recording
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error occurred',
    message: config.env === 'development' ? err.message : undefined,
  })
}
