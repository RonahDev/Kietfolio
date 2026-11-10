import { Response } from 'express'
import { prisma } from '../../config/prisma'
import { AuthenticatedRequest } from '../../types'
import { AuditLogService } from '../../services/auditLog.service'

export class EpisodesController {
  /**
   * List episodes for a movie / season
   */
  public static async listEpisodes(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { movieId } = req.params
      const episodes = await prisma.episode.findMany({
        where: { movieId },
        include: { sources: true },
        orderBy: { episodeNumber: 'asc' },
      })

      res.status(200).json({ success: true, data: { episodes } })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  /**
   * Create new episode with streaming sources
   */
  public static async createEpisode(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { movieId, seasonId, episodeNumber, name, slug, synopsis, duration, thumbnailUrl, sources } = req.body

      if (!movieId || !episodeNumber || !name || !slug) {
        res.status(400).json({ success: false, error: 'movieId, episodeNumber, name và slug là bắt buộc' })
        return
      }

      const episode = await prisma.episode.create({
        data: {
          movieId,
          seasonId: seasonId || null,
          episodeNumber: Number(episodeNumber),
          name,
          slug,
          synopsis: synopsis || null,
          duration: duration || null,
          thumbnailUrl: thumbnailUrl || null,
          sources: sources && Array.isArray(sources)
            ? {
                create: sources.map((s: { serverName?: string; videoUrl: string; quality?: string }) => ({
                  serverName: s.serverName || 'VIP HLS 4K',
                  videoUrl: s.videoUrl,
                  quality: s.quality || '4K',
                  status: 'active',
                })),
              }
            : undefined,
        },
        include: { sources: true },
      })

      if (req.adminUser) {
        await AuditLogService.record({
          actorId: req.adminUser.id,
          actorRole: req.adminUser.role,
          action: 'episode.create',
          entityType: 'Episode',
          entityId: episode.id,
          detailsAfter: { movieId, episodeNumber, name },
        })
      }

      res.status(201).json({ success: true, data: { episode } })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  /**
   * Update episode
   */
  public static async updateEpisode(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const { name, slug, synopsis, duration, thumbnailUrl, sources } = req.body

      if (sources && Array.isArray(sources)) {
        await prisma.episodeSource.deleteMany({ where: { episodeId: id } })
        await prisma.episodeSource.createMany({
          data: sources.map((s: { serverName?: string; videoUrl: string; quality?: string }) => ({
            episodeId: id,
            serverName: s.serverName || 'VIP HLS 4K',
            videoUrl: s.videoUrl,
            quality: s.quality || '4K',
            status: 'active',
          })),
        })
      }

      const updated = await prisma.episode.update({
        where: { id },
        data: {
          name,
          slug,
          synopsis,
          duration,
          thumbnailUrl,
        },
        include: { sources: true },
      })

      res.status(200).json({ success: true, data: { episode: updated } })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  /**
   * Delete episode
   */
  public static async deleteEpisode(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params

      await prisma.episode.delete({ where: { id } })

      if (req.adminUser) {
        await AuditLogService.record({
          actorId: req.adminUser.id,
          actorRole: req.adminUser.role,
          action: 'episode.delete',
          entityType: 'Episode',
          entityId: id,
        })
      }

      res.status(200).json({ success: true, message: 'Đã xóa tập phim thành công' })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }
}
