import { Response } from 'express'
import { prisma } from '../../config/prisma'
import { AuthenticatedRequest } from '../../types'
import { AuditLogService } from '../../services/auditLog.service'

export class UsersAdminController {
  /**
   * List users with search, role and status filtering
   */
  public static async listUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const page = Math.max(1, parseInt((req.query.page as string) || '1', 10))
      const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) || '15', 10)))
      const skip = (page - 1) * limit

      const search = (req.query.search as string)?.trim() || ''
      const role = (req.query.role as string)?.trim() || ''
      const status = (req.query.status as string)?.trim() || ''

      const where: any = {}

      if (search) {
        where.OR = [
          { email: { contains: search, mode: 'insensitive' } },
          { displayName: { contains: search, mode: 'insensitive' } },
        ]
      }

      if (role && role !== 'all') where.role = role
      if (status && status !== 'all') where.status = status

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            displayName: true,
            photoUrl: true,
            role: true,
            status: true,
            provider: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                watchHistory: true,
                comments: true,
                payments: true,
                sessions: true,
              },
            },
          },
        }),
        prisma.user.count({ where }),
      ])

      res.status(200).json({
        success: true,
        data: {
          users: users.map((u) => ({
            ...u,
            watchCount: u._count.watchHistory,
            commentCount: u._count.comments,
            transactionCount: u._count.payments,
            activeSessionCount: u._count.sessions,
          })),
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  /**
   * Get comprehensive User Profile Details
   */
  public static async getUserDetail(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params

      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          watchHistory: {
            include: { movie: true },
            orderBy: { lastWatchedAt: 'desc' },
            take: 10,
          },
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          sessions: {
            where: { revokedAt: null, expiresAt: { gt: new Date() } },
            orderBy: { lastActivityAt: 'desc' },
          },
          userRoles: {
            include: { role: true },
          },
        },
      })

      if (!user) {
        res.status(404).json({ success: false, error: 'Không tìm thấy người dùng' })
        return
      }

      const { passwordHash: _, ...safeUser } = user

      res.status(200).json({ success: true, data: { user: safeUser } })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  /**
   * Update User Status (Suspend or Reactivate)
   */
  public static async updateUserStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const { status } = req.body

      if (!['active', 'suspended', 'pending'].includes(status)) {
        res.status(400).json({ success: false, error: 'Trạng thái người dùng không hợp lệ' })
        return
      }

      const existing = await prisma.user.findUnique({ where: { id } })
      if (!existing) {
        res.status(404).json({ success: false, error: 'Không tìm thấy người dùng' })
        return
      }

      // Security check: cannot suspend super_admin
      if (existing.role === 'super_admin' && status === 'suspended') {
        res.status(403).json({ success: false, error: 'Không thể đình chỉ tài khoản Super Admin' })
        return
      }

      const updated = await prisma.user.update({
        where: { id },
        data: { status },
      })

      // If suspended, revoke all active sessions immediately
      if (status === 'suspended') {
        await prisma.adminSession.updateMany({
          where: { userId: id, revokedAt: null },
          data: { revokedAt: new Date() },
        })
      }

      if (req.adminUser) {
        await AuditLogService.record({
          actorId: req.adminUser.id,
          actorRole: req.adminUser.role,
          action: 'user.update_status',
          entityType: 'User',
          entityId: id,
          detailsBefore: { status: existing.status },
          detailsAfter: { status },
        })
      }

      res.status(200).json({ success: true, data: { user: updated } })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  /**
   * Update User Role (RBAC)
   */
  public static async updateUserRole(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const { role } = req.body

      const allowedRoles = ['super_admin', 'admin', 'content_manager', 'moderator', 'analyst', 'vip', 'user']
      if (!allowedRoles.includes(role)) {
        res.status(400).json({ success: false, error: 'Vai trò người dùng không hợp lệ' })
        return
      }

      const existing = await prisma.user.findUnique({ where: { id } })
      if (!existing) {
        res.status(404).json({ success: false, error: 'Không tìm thấy người dùng' })
        return
      }

      // Security: only super_admin can grant or revoke super_admin role
      if ((role === 'super_admin' || existing.role === 'super_admin') && req.adminUser?.role !== 'super_admin') {
        res.status(403).json({ success: false, error: 'Chỉ Super Admin mới có quyền thao tác vai trò Super Admin.' })
        return
      }

      const updated = await prisma.user.update({
        where: { id },
        data: { role },
      })

      if (req.adminUser) {
        await AuditLogService.record({
          actorId: req.adminUser.id,
          actorRole: req.adminUser.role,
          action: 'user.update_role',
          entityType: 'User',
          entityId: id,
          detailsBefore: { role: existing.role },
          detailsAfter: { role },
        })
      }

      res.status(200).json({ success: true, data: { user: updated } })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  /**
   * Get Roles & Permissions Matrix
   */
  public static async getRbacMatrix(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const [roles, permissions] = await Promise.all([
        prisma.role.findMany({
          include: {
            rolePermissions: {
              include: { permission: true },
            },
          },
        }),
        prisma.permission.findMany({
          orderBy: { module: 'asc' },
        }),
      ])

      res.status(200).json({
        success: true,
        data: {
          roles: roles.map((r) => ({
            id: r.id,
            name: r.name,
            description: r.description,
            permissions: r.rolePermissions.map((rp) => rp.permissionId),
          })),
          permissions,
        },
      })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }
}
