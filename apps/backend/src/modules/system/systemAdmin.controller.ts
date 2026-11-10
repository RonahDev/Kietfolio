import { Response } from 'express'
import { prisma } from '../../config/prisma'
import { AuthenticatedRequest } from '../../types'
import { AuditLogService } from '../../services/auditLog.service'

export class SystemAdminController {
  /**
   * List Audit Logs
   */
  public static async getAuditLogs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const page = Math.max(1, parseInt((req.query.page as string) || '1', 10))
      const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) || '20', 10)))
      const action = req.query.action as string
      const actorId = req.query.actorId as string
      const entityType = req.query.entityType as string

      const result = await AuditLogService.listLogs({
        page,
        limit,
        action,
        actorId,
        entityType,
      })

      res.status(200).json({ success: true, data: result })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  /**
   * Video Servers Monitoring
   */
  public static async getVideoServers(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      let servers = await prisma.videoServer.findMany({
        orderBy: { serverName: 'asc' },
      })

      // If empty, seed default servers
      if (servers.length === 0) {
        await prisma.videoServer.createMany({
          data: [
            {
              serverName: 'KKPhim VIP HLS Cluster 01',
              provider: 'KKPhim CDN Vietnam',
              baseStreamUrl: 'https://phimapi.com',
              status: 'online',
              responseTimeMs: 38,
              lastCheckedAt: new Date(),
            },
            {
              serverName: 'Cloudflare Stream Edge Backup',
              provider: 'Cloudflare CDN',
              baseStreamUrl: 'https://cloudflarestream.com',
              status: 'online',
              responseTimeMs: 24,
              lastCheckedAt: new Date(),
            },
            {
              serverName: 'YouTube Embed HLS Proxy',
              provider: 'Google Video Infrastructure',
              baseStreamUrl: 'https://www.youtube-nocookie.com',
              status: 'online',
              responseTimeMs: 19,
              lastCheckedAt: new Date(),
            },
          ],
        })
        servers = await prisma.videoServer.findMany({ orderBy: { serverName: 'asc' } })
      }

      res.status(200).json({ success: true, data: { servers } })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  /**
   * Broken link checker report
   */
  public static async getBrokenLinksReport(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Find movies with missing poster or backdrop
      const brokenMovies = await prisma.movie.findMany({
        where: {
          OR: [
            { posterUrl: '' },
            { backdropUrl: '' },
            { videoStreamUrl: null, type: 'movie' },
          ],
          deletedAt: null,
        },
        select: {
          id: true,
          titleVi: true,
          slug: true,
          posterUrl: true,
          backdropUrl: true,
          videoStreamUrl: true,
          createdAt: true,
        },
      })

      res.status(200).json({
        success: true,
        data: {
          brokenLinks: brokenMovies.map((m) => ({
            id: m.id,
            targetName: m.titleVi,
            issue: !m.posterUrl
              ? 'Thiếu ảnh Poster'
              : !m.backdropUrl
              ? 'Thiếu ảnh Backdrop 4K'
              : 'Thiếu đường dẫn luồng phát video (.m3u8)',
            severity: !m.videoStreamUrl ? 'high' : 'medium',
            lastCheckedAt: new Date().toISOString(),
          })),
        },
      })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  /**
   * System Settings
   */
  public static async getSettings(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const settings = await prisma.systemSetting.findMany()
      const settingsMap: Record<string, any> = {}
      for (const s of settings) {
        settingsMap[s.key] = s.value
      }

      // Default settings if empty
      const defaultSettings = {
        websiteName: 'Kietfolio Cinema Hub',
        defaultLanguage: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        currency: 'VND',
        maintenanceMode: false,
        sessionIdleTimeoutMinutes: 60,
        maxLoginAttempts: 5,
        allowedImageFormats: ['jpg', 'png', 'webp', 'avif'],
        tmdbAutoSync: true,
        ...settingsMap,
      }

      res.status(200).json({ success: true, data: { settings: defaultSettings } })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  public static async updateSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { settings } = req.body

      if (!settings || typeof settings !== 'object') {
        res.status(400).json({ success: false, error: 'Dữ liệu cấu hình không hợp lệ' })
        return
      }

      for (const [key, value] of Object.entries(settings)) {
        await prisma.systemSetting.upsert({
          where: { key },
          update: { value: value as any },
          create: { key, value: value as any },
        })
      }

      if (req.adminUser) {
        await AuditLogService.record({
          actorId: req.adminUser.id,
          actorRole: req.adminUser.role,
          action: 'settings.update',
          entityType: 'SystemSetting',
          detailsAfter: settings,
        })
      }

      res.status(200).json({ success: true, message: 'Đã cập nhật cấu hình hệ thống thành công.' })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }
}
