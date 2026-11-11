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

    // Check VIP expiration timestamp in token
    if (decoded.role === 'vip' && decoded.vipExpiresAt) {
      const expiry = new Date(decoded.vipExpiresAt)
      if (expiry.getTime() < Date.now()) {
        decoded.role = 'user'
      }
    }

    req.user = decoded
    next()
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' })
  }
}

/**
 * Require specific user role or roles (e.g. 'admin', 'vip', 'user')
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' })
      return
    }

    const userRole = (req.user.role || '').toLowerCase()

    // Super Admin and Admin bypass all role checks
    if (userRole === 'super_admin' || userRole === 'admin') {
      next()
      return
    }

    if (!allowedRoles.map((r) => r.toLowerCase()).includes(userRole)) {
      res.status(403).json({
        success: false,
        error: `Yêu cầu phân quyền tối thiểu: [${allowedRoles.join(' hoặc ')}]. Tài khoản của bạn hiện là: [${userRole}].`,
      })
      return
    }

    next()
  }
}

/**
 * Require VIP membership clearance (or Admin)
 * Automatically checks VIP expiration timestamp
 */
export function requireVip(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Yêu cầu đăng nhập để trải nghiệm nội dung VIP.' })
    return
  }

  const userRole = (req.user.role || '').toLowerCase()

  // Admin / Super Admin always have VIP privileges
  if (userRole === 'admin' || userRole === 'super_admin') {
    next()
    return
  }

  if (userRole !== 'vip') {
    res.status(403).json({
      success: false,
      code: 'VIP_UPGRADE_REQUIRED',
      error: 'Nội dung này dành riêng cho hội viên VIP. Vui lòng nâng cấp gói VIP để tiếp tục thưởng thức!',
    })
    return
  }

  // Check VIP expiration if applicable
  if (req.user.vipExpiresAt) {
    const expiresAt = new Date(req.user.vipExpiresAt)
    if (expiresAt.getTime() < Date.now()) {
      res.status(403).json({
        success: false,
        code: 'VIP_EXPIRED',
        error: 'Thời hạn gói VIP của bạn đã kết thúc. Vui lòng gia hạn để tiếp tục xem phim chất lượng 4K Ultra HD!',
      })
      return
    }
  }

  next()
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' })
    return
  }

  const adminEmails = [
    config.admin.email.toLowerCase(),
    ...config.admin.additionalEmails,
  ]

  const userRole = (req.user.role || '').toLowerCase()
  const isVerifiedAdmin =
    (userRole === 'admin' || userRole === 'super_admin') &&
    (adminEmails.includes(req.user.email.toLowerCase()) || userRole === 'super_admin')

  if (!isVerifiedAdmin) {
    res.status(403).json({ success: false, error: 'Access forbidden: Admin clearance required' })
    return
  }

  next()
}
