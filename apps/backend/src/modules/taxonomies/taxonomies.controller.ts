import { Response } from 'express'
import { prisma } from '../../config/prisma'
import { AuthenticatedRequest } from '../../types'
import { AuditLogService } from '../../services/auditLog.service'
import { inMemoryCache } from '../../resilience/inMemoryCache'

export class TaxonomiesController {
  // ==========================================
  // 1. GENRES
  // ==========================================
  public static async listGenres(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const genres = await prisma.genre.findMany({
        include: {
          _count: { select: { movies: true } },
        },
        orderBy: { nameVi: 'asc' },
      })

      res.status(200).json({
        success: true,
        data: {
          genres: genres.map((g) => ({
            id: g.id,
            nameVi: g.nameVi,
            nameEn: g.nameEn,
            slug: g.slug,
            movieCount: g._count.movies,
          })),
        },
      })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  public static async createGenre(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id, nameVi, nameEn, slug } = req.body
      if (!id || !nameVi || !slug) {
        res.status(400).json({ success: false, error: 'id, nameVi và slug là bắt buộc' })
        return
      }

      const genre = await prisma.genre.create({
        data: {
          id: id.toLowerCase().trim(),
          nameVi,
          nameEn: nameEn || nameVi,
          slug: slug.toLowerCase().trim(),
        },
      })

      inMemoryCache.invalidatePrefix('taxonomies')

      res.status(201).json({ success: true, data: { genre } })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  public static async deleteGenre(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      await prisma.genre.delete({ where: { id } })
      inMemoryCache.invalidatePrefix('taxonomies')
      res.status(200).json({ success: true, message: 'Đã xóa thể loại thành công' })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  // ==========================================
  // 2. CATEGORIES
  // ==========================================
  public static async listCategories(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { displayOrder: 'asc' },
        include: {
          _count: { select: { movies: true } },
        },
      })

      res.status(200).json({
        success: true,
        data: {
          categories: categories.map((c) => ({
            id: c.id,
            nameVi: c.nameVi,
            nameEn: c.nameEn,
            slug: c.slug,
            displayOrder: c.displayOrder,
            isActive: c.isActive,
            movieCount: c._count.movies,
          })),
        },
      })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  public static async createCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id, nameVi, nameEn, slug, displayOrder, isActive } = req.body
      const category = await prisma.category.create({
        data: {
          id: id.toLowerCase().trim(),
          nameVi,
          nameEn: nameEn || nameVi,
          slug: slug.toLowerCase().trim(),
          displayOrder: Number(displayOrder) || 0,
          isActive: isActive !== false,
        },
      })

      inMemoryCache.invalidatePrefix('taxonomies')

      res.status(201).json({ success: true, data: { category } })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  public static async updateCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const { nameVi, nameEn, displayOrder, isActive } = req.body

      const updated = await prisma.category.update({
        where: { id },
        data: {
          nameVi,
          nameEn,
          displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
          isActive,
        },
      })

      inMemoryCache.invalidatePrefix('taxonomies')

      res.status(200).json({ success: true, data: { category: updated } })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  public static async deleteCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      await prisma.category.delete({ where: { id } })
      inMemoryCache.invalidatePrefix('taxonomies')
      res.status(200).json({ success: true, message: 'Đã xóa danh mục thành công' })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  // ==========================================
  // 3. BANNERS
  // ==========================================
  public static async listBanners(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const banners = await prisma.banner.findMany({
        orderBy: { displayOrder: 'asc' },
        include: {
          movie: {
            select: {
              id: true,
              titleVi: true,
              posterUrl: true,
            },
          },
        },
      })

      res.status(200).json({ success: true, data: { banners } })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  public static async createBanner(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { title, subtitle, imageUrl, ctaLink, movieId, displayOrder, isActive, startDate, endDate } = req.body

      if (!title || !imageUrl) {
        res.status(400).json({ success: false, error: 'Tiêu đề và Ảnh banner là bắt buộc' })
        return
      }

      const banner = await prisma.banner.create({
        data: {
          title,
          subtitle: subtitle || null,
          imageUrl,
          ctaLink: ctaLink || null,
          movieId: movieId || null,
          displayOrder: Number(displayOrder) || 0,
          isActive: isActive !== false,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
        },
      })

      if (req.adminUser) {
        await AuditLogService.record({
          actorId: req.adminUser.id,
          actorRole: req.adminUser.role,
          action: 'banner.create',
          entityType: 'Banner',
          entityId: banner.id,
          detailsAfter: { title: banner.title },
        })
      }

      inMemoryCache.invalidatePrefix('banners')

      res.status(201).json({ success: true, data: { banner } })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }

  public static async deleteBanner(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      await prisma.banner.delete({ where: { id } })
      inMemoryCache.invalidatePrefix('banners')
      res.status(200).json({ success: true, message: 'Đã xóa banner thành công' })
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message })
    }
  }
}
