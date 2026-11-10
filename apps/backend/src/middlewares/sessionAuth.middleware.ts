import { Response, NextFunction } from 'express'
import { prisma } from '../config/prisma'
import { config } from '../config/env'
import { AuthenticatedRequest } from '../types'

/**
 * Enterprise Server-Side Session Authentication Middleware
 * Validates HttpOnly session cookies with idle timeout & absolute expiration checks.
 */
export async function sessionAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // 1. Extract session token from Signed Cookies or standard Cookies or Authorization header fallback
    const cookieToken =
      req.signedCookies?.[config.session.cookieName] ||
      req.cookies?.[config.session.cookieName] ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.substring(7)
        : null)

    if (!cookieToken || typeof cookieToken !== 'string') {
      res.status(401).json({
        success: false,
        error: 'Authentication required. No valid administrative session token provided.',
      })
      return
    }

    // 2. Query session from database with user, roles and permissions
    const session = await prisma.adminSession.findUnique({
      where: { id: cookieToken },
      include: {
        user: {
          include: {
            userRoles: {
              include: {
                role: {
                  include: {
                    rolePermissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!session || session.revokedAt) {
      res.status(401).json({
        success: false,
        error: 'Session has been revoked or is invalid. Please log in again.',
      })
      return
    }

    // 3. Absolute expiration check
    const now = new Date()
    if (session.expiresAt <= now) {
      // Mark as revoked
      await prisma.adminSession.update({
        where: { id: session.id },
        data: { revokedAt: now },
      })
      res.status(401).json({
        success: false,
        error: 'Session has reached its maximum lifespan. Please log in again.',
      })
      return
    }

    // 4. Inactivity idle timeout check
    const idleElapsedMs = now.getTime() - session.lastActivityAt.getTime()
    if (idleElapsedMs > config.session.idleTimeoutMs) {
      await prisma.adminSession.update({
        where: { id: session.id },
        data: { revokedAt: now },
      })
      res.status(401).json({
        success: false,
        error: 'Session timed out due to 60 minutes of inactivity.',
      })
      return
    }

    // 5. Update last activity timestamp asynchronously
    prisma.adminSession
      .update({
        where: { id: session.id },
        data: { lastActivityAt: now },
      })
      .catch((err) => {
        console.warn('[SessionActivity]: Failed to update lastActivityAt:', err.message)
      })

    // 6. Aggregate user role and granular permissions
    const primaryRole =
      session.user.userRoles[0]?.roleId || session.user.role || 'user'
    const permissionsSet = new Set<string>()

    for (const ur of session.user.userRoles) {
      for (const rp of ur.role.rolePermissions) {
        if (rp.permission?.id) {
          permissionsSet.add(rp.permission.id)
        }
      }
    }

    // 7. Attach validated admin user context to request
    req.sessionId = session.id
    req.adminUser = {
      id: session.user.id,
      email: session.user.email,
      displayName: session.user.displayName || undefined,
      photoUrl: session.user.photoUrl || undefined,
      role: primaryRole,
      permissions: Array.from(permissionsSet),
    }

    next()
  } catch (error) {
    console.error('[SessionAuthMiddleware Error]:', error)
    res.status(500).json({
      success: false,
      error: 'Internal authentication server error during session verification.',
    })
  }
}
