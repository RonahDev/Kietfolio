import { Response } from 'express'
import { AuthenticatedRequest } from '../../types'
import { MovieSyncScheduler } from '../../services/movieSyncScheduler.service'
import { prisma } from '../../config/prisma'

export class MovieSyncAdminController {
  /**
   * GET /api/admin/sync/status
   * Returns current scheduler state, interval, last run, and next countdown
   */
  public static async getStatus(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const status = MovieSyncScheduler.getStatus()
      res.status(200).json({ success: true, data: status })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  /**
   * POST /api/admin/sync/trigger
   * Immediately runs automated movie synchronization in background
   */
  public static async triggerSync(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const actor = req.adminUser ? `${req.adminUser.email} (${req.adminUser.role})` : 'admin'
      const result = await MovieSyncScheduler.triggerSyncNow(actor)
      res.status(200).json({
        success: true,
        message: `Đồng bộ hoàn tất: Đã thêm +${result.newInserted} phim mới, cập nhật ${result.updated} phim (${result.durationMs}ms)`,
        data: result,
      })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  /**
   * PUT /api/admin/sync/settings
   * Updates sync schedule, interval, and enabled sources
   */
  public static async updateSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { autoSyncEnabled, intervalMinutes, sources } = req.body
      const updatedStatus = await MovieSyncScheduler.updateSettings({
        autoSyncEnabled,
        intervalMinutes: intervalMinutes ? parseInt(intervalMinutes, 10) : undefined,
        sources,
      })

      res.status(200).json({
        success: true,
        message: 'Đã cập nhật cấu hình đồng bộ phim tự động thành công.',
        data: updatedStatus,
      })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  /**
   * GET /api/admin/sync/history
   * Retrieves previous sync runs from the immutable audit logs
   */
  public static async getHistory(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const logs = await prisma.auditLog.findMany({
        where: { action: 'movie.auto_sync' },
        orderBy: { createdAt: 'desc' },
        take: 30,
      })

      res.status(200).json({
        success: true,
        data: {
          history: logs.map((log) => ({
            id: log.id,
            timestamp: log.createdAt.toISOString(),
            actorRole: log.actorRole,
            details: log.detailsAfter as any,
          })),
        },
      })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }
}
