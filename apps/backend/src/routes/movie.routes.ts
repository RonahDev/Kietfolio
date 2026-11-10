import { Router, Request, Response } from 'express'
import { prisma } from '../config/prisma'
import { cacheResponse } from '../resilience/inMemoryCache'
import { publicReadLimiter } from '../middlewares/rateLimiter.middleware'

export const movieRouter = Router()

// Apply high-concurrency public read rate limiting (15,000 req/15m)
movieRouter.use(publicReadLimiter)

/**
 * GET /api/movies
 * High-performance public movie catalog with L1 LRU Cache & ETag 304 support
 */
movieRouter.get('/', cacheResponse(60, 'movies'), async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt((req.query.limit as string) || '20', 10)))
    const skip = (page - 1) * limit

    const rawSearch = (req.query.search as string)?.trim() || ''
    const search = rawSearch.substring(0, 100).replace(/[\0\x08\x09\x1a\n\r"'\\]/g, '')
    const genre = (req.query.genre as string)?.trim() || ''
    const type = (req.query.type as string)?.trim() || ''
    const isTheatrical = req.query.isTheatrical === 'true'

    const where: any = {
      deletedAt: null,
      status: 'published',
    }

    if (search) {
      where.OR = [
        { titleVi: { contains: search, mode: 'insensitive' } },
        { titleOrigin: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (type && type !== 'all') where.type = type
    if (isTheatrical) where.isTheatrical = true
    if (genre && genre !== 'all') {
      where.genres = {
        some: {
          genre: {
            slug: genre,
          },
        },
      }
    }

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { releaseYear: 'desc' }, { createdAt: 'desc' }],
        include: {
          genres: { include: { genre: true } },
          categories: { include: { category: true } },
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
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message })
  }
})

/**
 * GET /api/movies/banners
 * Active cinematic banners for hero slider with 120s L1 Cache
 */
movieRouter.get('/banners', cacheResponse(120, 'banners'), async (_req: Request, res: Response) => {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    })
    res.status(200).json({ success: true, data: banners })
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message })
  }
})

/**
 * GET /api/movies/:slug
 * Single movie details with episode list
 */
movieRouter.get('/:slug', cacheResponse(60, 'movies'), async (req: Request, res: Response) => {
  try {
    const { slug } = req.params

    const movie = await prisma.movie.findUnique({
      where: { slug },
      include: {
        genres: { include: { genre: true } },
        categories: { include: { category: true } },
        episodes: {
          include: { sources: true },
          orderBy: { episodeNumber: 'asc' },
        },
      },
    })

    if (!movie || movie.deletedAt || movie.status !== 'published') {
      res.status(404).json({ success: false, error: 'Phim không tồn tại hoặc đã ngừng chiếu' })
      return
    }

    res.status(200).json({
      success: true,
      data: {
        ...movie,
        viewCount: Number(movie.viewCount),
        genres: movie.genres.map((g) => g.genre),
        categories: movie.categories.map((c) => c.category),
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message })
  }
})
