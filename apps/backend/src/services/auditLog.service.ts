import { prisma } from '../config/prisma'
import { Prisma } from '@prisma/client'

export interface CreateAuditLogParams {
  actorId?: string
  actorRole?: string
  action: string
  entityType: string
  entityId?: string
  ipAddress?: string
  userAgent?: string
  detailsBefore?: Record<string, unknown> | null
  detailsAfter?: Record<string, unknown> | null
}

export class AuditLogService {
  /**
   * Persists an immutable administrative audit trail record
   */
  public static async record(params: CreateAuditLogParams): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          actorId: params.actorId || null,
          actorRole: params.actorRole || 'system',
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId || null,
          ipAddress: params.ipAddress || null,
          userAgent: params.userAgent || null,
          detailsBefore: (params.detailsBefore as Prisma.InputJsonValue) || Prisma.JsonNull,
          detailsAfter: (params.detailsAfter as Prisma.InputJsonValue) || Prisma.JsonNull,
        },
      })
    } catch (err) {
      console.error('[AuditLogService]: Failed to write audit log:', err)
    }
  }

  /**
   * Retrieves audit logs with pagination and filters
   */
  public static async listLogs(options: {
    page?: number
    limit?: number
    action?: string
    actorId?: string
    entityType?: string
  }) {
    const page = Math.max(1, options.page || 1)
    const limit = Math.min(100, Math.max(1, options.limit || 20))
    const skip = (page - 1) * limit

    const where: Prisma.AuditLogWhereInput = {}
    if (options.action) where.action = { contains: options.action, mode: 'insensitive' }
    if (options.actorId) where.actorId = options.actorId
    if (options.entityType) where.entityType = options.entityType

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          actor: {
            select: {
              id: true,
              email: true,
              displayName: true,
              photoUrl: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ])

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }
}
