import { Request, Response, NextFunction } from 'express'
import { config } from '../config/env'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // eslint-disable-next-line no-console
  console.error('[Unhandled Error Intercepted]:', err)

  res.status(500).json({
    success: false,
    error: 'Internal server error occurred',
    message: config.env === 'development' ? err.message : undefined,
  })
}

