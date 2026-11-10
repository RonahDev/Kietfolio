import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../types'

/**
 * Enterprise RBAC Permission Guard Middleware Factory
 * Verifies that the authenticated admin possesses the specific granular permission.
 * Super Admins bypass permission checks automatically.
 */
export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const admin = req.adminUser

    if (!admin) {
      res.status(401).json({
        success: false,
        error: 'Authentication required. No admin identity verified.',
      })
      return
    }

    // Super Admin has master clearance over every permission
    if (admin.role === 'super_admin') {
      next()
      return
    }

    // Check if the permission exists in the user's aggregated permission list
    if (admin.permissions && admin.permissions.includes(permission)) {
      next()
      return
    }

    res.status(403).json({
      success: false,
      error: `Access Denied: Your account role [${admin.role}] does not have the required permission [${permission}].`,
    })
  }
}
