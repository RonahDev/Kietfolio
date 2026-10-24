import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/env'
import { AuthenticatedRequest, UserPayload } from '../types'

export function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Authorization header missing or invalid format' })
    return
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as UserPayload
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' })
  }
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' })
    return
  }

  const adminEmails = [
    config.admin.email.toLowerCase(),
    'kietteve22102005@gmail.com',
    'kiet.maianh@gmail.com',
  ]

  const isVerifiedAdmin =
    req.user.role === 'admin' && adminEmails.includes(req.user.email.toLowerCase())

  if (!isVerifiedAdmin) {
    res.status(403).json({ success: false, error: 'Access forbidden: Admin clearance required' })
    return
  }

  next()
}

