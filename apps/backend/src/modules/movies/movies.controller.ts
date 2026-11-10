import { Response } from 'express'
import { prisma } from '../../config/prisma'
import { AuthenticatedRequest } from '../../types'
import { AuditLogService } from '../../services/auditLog.service'
import { inMemoryCache } from '../../resilience/inMemoryCache'

export class MoviesController {
  /**
   * List Movies with enterprise server-side pagination, searching & filtering
   */
  public static async listMovies(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const page = Math.max(1, parseInt((req.query.page as string) || '1', 10))
      const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) || '15', 10)))
      const skip = (page - 1) * limit

      const rawSearch = (req.query.search as string)?.trim() || ''
      const search = rawSearch.substring(0, 100).replace(/[\0\x08\x09\x1a\n\r"'\\]/g, '')
      const type = (req.query.type as string)?.trim() || ''
      const status = (req.query.status as string)?.trim() || ''
      const genre = (req.query.genre as string)?.trim() || ''
      const isTheatrical = req.query.isTheatrical === 'true'

      const where: any = { deletedAt: null }

      if (search) {
        where.OR = [
          { titleVi: { contains: search, mode: 'insensitive' } },
          { titleOrigin: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
        ]
      }

      if (type && type !== 'all') where.type = type
      if (status && status !== 'all') where.status = status
      if (isTheatrical) where.isTheatrical = true
      if (genre && genre !== 'all') {
        where.genres = {
          some: {
            genreId: genre,
          },
        }
      }

      const [movies, total] = await Promise.all([
        prisma.movie.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            genres: {
              include: { genre: true },
            },
            categories: {
              include: { category: true },
            },
            _count: {
              select: { episodes: true, comments: true },
            },
          },
        }),
        prisma.movie.count({ where }),
      ])

      res.status(200).json({
        success: true,
        data: {
          movies: movies.map((m) => ({
            ...m,
            viewCount: Number(m.viewCount),
            genres: m.genres.map((g) => g.genre),
            categories: m.categories.map((c) => c.category),
            episodeCount: m._count.episodes,
            commentCount: m._count.comments,
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
      console.error('[MoviesController listMovies Error]:', error)
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  /**
   * Get single movie details by ID
   */
  public static async getMovieById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params

      const movie = await prisma.movie.findUnique({
        where: { id },
        include: {
          genres: { include: { genre: true } },
          categories: { include: { category: true } },
          seasons: {
            include: {
              episodes: {
                include: { sources: true },
                orderBy: { episodeNumber: 'asc' },
              },
            },
            orderBy: { seasonNumber: 'asc' },
          },
          episodes: {
            where: { seasonId: null },
            include: { sources: true },
            orderBy: { episodeNumber: 'asc' },
          },
        },
      })

      if (!movie || movie.deletedAt) {
        res.status(404).json({ success: false, error: 'Không tìm thấy bộ phim được yêu cầu' })
        return
      }

      res.status(200).json({
        success: true,
        data: {
          movie: {
            ...movie,
            viewCount: Number(movie.viewCount),
            genres: movie.genres.map((g) => g.genre),
            categories: movie.categories.map((c) => c.category),
          },
        },
      })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  /**
   * Create new Movie
   */
  public static async createMovie(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        titleVi,
        titleOrigin,
        slug,
        type,
        synopsis,
        posterUrl,
        backdropUrl,
        trailerUrl,
        youtubeKey,
        videoStreamUrl,
        streamSource,
        releaseYear,
        duration,
        rating,
        ageRating,
        quality,
        audio,
        director,
        castData,
        tmdbId,
        status,
        isTheatrical,
        isFeatured,
        genreIds,
        categoryIds,
      } = req.body

      if (!titleVi || !slug || !posterUrl || !backdropUrl) {
        res.status(400).json({
          success: false,
          error: 'Thiếu các thông tin bắt buộc: Tên phim, Slug, Poster và Backdrop URL.',
        })
        return
      }

      // Check slug uniqueness
      const existingSlug = await prisma.movie.findUnique({ where: { slug } })
      if (existingSlug) {
        res.status(400).json({ success: false, error: 'Đường dẫn Slug đã tồn tại trong hệ thống' })
        return
      }

      const movie = await prisma.movie.create({
        data: {
          titleVi,
          titleOrigin: titleOrigin || null,
          slug,
          type: type || 'movie',
          synopsis: synopsis || null,
          posterUrl,
          backdropUrl,
          trailerUrl: trailerUrl || null,
          youtubeKey: youtubeKey || null,
          videoStreamUrl: videoStreamUrl || null,
          streamSource: streamSource || 'hls',
          releaseYear: Number(releaseYear) || new Date().getFullYear(),
          duration: duration || '120 min',
          rating: Number(rating) || 8.5,
          ageRating: ageRating || 'PG-13',
          quality: quality || '4K ULTRA HD',
          audio: audio || 'DOLBY ATMOS',
          director: director || null,
          castData: castData || null,
          tmdbId: tmdbId ? Number(tmdbId) : null,
          status: status || 'published',
          isTheatrical: Boolean(isTheatrical),
          isFeatured: Boolean(isFeatured),
          genres: genreIds && Array.isArray(genreIds)
            ? {
                create: genreIds.map((gid: string) => ({ genreId: gid })),
              }
            : undefined,
          categories: categoryIds && Array.isArray(categoryIds)
            ? {
                create: categoryIds.map((cid: string) => ({ categoryId: cid })),
              }
            : undefined,
        },
      })

      if (req.adminUser) {
        await AuditLogService.record({
          actorId: req.adminUser.id,
          actorRole: req.adminUser.role,
          action: 'movie.create',
          entityType: 'Movie',
          entityId: movie.id,
          detailsAfter: { titleVi: movie.titleVi, slug: movie.slug },
        })
      }

      inMemoryCache.invalidatePrefix('movies')

      res.status(201).json({ success: true, data: { movie } })
    } catch (error) {
      console.error('[MoviesController createMovie Error]:', error)
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  /**
   * Update existing Movie
   */
  public static async updateMovie(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const updateData = { ...req.body }

      delete updateData.id
      delete updateData.createdAt
      delete updateData.updatedAt
      delete updateData.viewCount

      const genreIds = updateData.genreIds
      const categoryIds = updateData.categoryIds
      delete updateData.genreIds
      delete updateData.categoryIds

      const existing = await prisma.movie.findUnique({ where: { id } })
      if (!existing || existing.deletedAt) {
        res.status(404).json({ success: false, error: 'Không tìm thấy bộ phim' })
        return
      }

      // If genres are provided, reset connections
      if (genreIds && Array.isArray(genreIds)) {
        await prisma.movieGenre.deleteMany({ where: { movieId: id } })
        await prisma.movieGenre.createMany({
          data: genreIds.map((gid: string) => ({ movieId: id, genreId: gid })),
        })
      }

      // If categories are provided, reset connections
      if (categoryIds && Array.isArray(categoryIds)) {
        await prisma.movieCategory.deleteMany({ where: { movieId: id } })
        await prisma.movieCategory.createMany({
          data: categoryIds.map((cid: string) => ({ movieId: id, categoryId: cid })),
        })
      }

      const updatedMovie = await prisma.movie.update({
        where: { id },
        data: updateData,
      })

      if (req.adminUser) {
        await AuditLogService.record({
          actorId: req.adminUser.id,
          actorRole: req.adminUser.role,
          action: 'movie.update',
          entityType: 'Movie',
          entityId: id,
          detailsBefore: { titleVi: existing.titleVi, status: existing.status },
          detailsAfter: { titleVi: updatedMovie.titleVi, status: updatedMovie.status },
        })
      }

      inMemoryCache.invalidatePrefix('movies')

      res.status(200).json({ success: true, data: { movie: updatedMovie } })
    } catch (error) {
      console.error('[MoviesController updateMovie Error]:', error)
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  /**
   * Delete movie (Soft delete with audit trail)
   */
  public static async deleteMovie(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params

      const movie = await prisma.movie.findUnique({ where: { id } })
      if (!movie) {
        res.status(404).json({ success: false, error: 'Không tìm thấy bộ phim cần xóa' })
        return
      }

      await prisma.movie.update({
        where: { id },
        data: { deletedAt: new Date(), status: 'hidden' },
      })

      if (req.adminUser) {
        await AuditLogService.record({
          actorId: req.adminUser.id,
          actorRole: req.adminUser.role,
          action: 'movie.delete',
          entityType: 'Movie',
          entityId: id,
          detailsBefore: { titleVi: movie.titleVi, slug: movie.slug },
        })
      }

      inMemoryCache.invalidatePrefix('movies')

      res.status(200).json({ success: true, message: 'Đã xóa bộ phim thành công' })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  /**
   * Bulk update status for multiple movies
   */
  public static async bulkUpdateStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { movieIds, status } = req.body

      if (!Array.isArray(movieIds) || !movieIds.length || !status) {
        res.status(400).json({ success: false, error: 'movieIds và status hợp lệ là bắt buộc' })
        return
      }

      const result = await prisma.movie.updateMany({
        where: { id: { in: movieIds } },
        data: { status },
      })

      inMemoryCache.invalidatePrefix('movies')

      if (req.adminUser) {
        await AuditLogService.record({
          actorId: req.adminUser.id,
          actorRole: req.adminUser.role,
          action: 'movie.bulk_status',
          entityType: 'Movie',
          detailsAfter: { count: result.count, status },
        })
      }

      res.status(200).json({
        success: true,
        message: `Đã cập nhật trạng thái [${status}] cho ${result.count} bộ phim.`,
      })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }
}
