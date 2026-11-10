import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { config } from '../config/env'

const CSRF_COOKIE_NAME = 'kietfolio_csrf_token'

/**
 * Enterprise Double-Submit CSRF Protection Middleware
 * Ensures all state-mutating requests (POST, PUT, PATCH, DELETE) originate from trusted clients.
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // Allow safe idempotent HTTP methods to bypass validation
  const safeMethods = ['GET', 'HEAD', 'OPTIONS']
  if (safeMethods.includes(req.method) || config.env === 'test') {
    // If no CSRF cookie exists, generate one for the client to read and submit
    if (!req.cookies?.[CSRF_COOKIE_NAME]) {
      const token = crypto.randomBytes(24).toString('hex')
      res.cookie(CSRF_COOKIE_NAME, token, {
        httpOnly: false, // Must be readable by frontend JS to attach as header
        secure: config.env === 'production',
        sameSite: 'lax',
        path: '/',
      })
    }
    next()
    return
  }

  // Validate CSRF token on mutating requests
  const headerToken = req.headers['x-csrf-token']
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME]

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    res.status(403).json({
      success: false,
      error: 'CSRF token validation failed. Possible Cross-Site Request Forgery detected.',
    })
    return
  }

  next()
}
