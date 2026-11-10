import { prisma } from '../config/prisma'
import { config } from '../config/env'
import { inMemoryCache } from '../resilience/inMemoryCache'
import { AuditLogService } from './auditLog.service'

export interface NormalizedMoviePayload {
  titleVi: string
  titleOrigin?: string
  slug: string
  type: 'movie' | 'tv_series'
  synopsis?: string
  posterUrl: string
  backdropUrl: string
  trailerUrl?: string
  youtubeKey?: string
  videoStreamUrl?: string
  streamSource: 'hls' | 'youtube' | 'kkphim'
  releaseYear: number
  duration?: string
  rating: number
  ageRating: string
  quality: string
  audio: string
  director?: string
  castData?: Array<{ name: string; role: string; avatarUrl?: string }>
  tmdbId?: number
  status: 'published' | 'draft' | 'hidden'
  isTheatrical: boolean
  isFeatured: boolean
  genreIds: string[]
  categoryIds?: string[]
  episodes?: Array<{
    name: string
    slug: string
    linkM3u8?: string
    linkEmbed?: string
    serverName?: string
    episodeNumber: number
  }>
}

export interface SyncResult {
  success: boolean
  totalProcessed: number
  newInserted: number
  updated: number
  errors: string[]
  durationMs: number
  timestamp: string
  sources: string[]
}

export interface SyncOptions {
  includeKKPhimNew?: boolean
  includeKKPhimTheatrical?: boolean
  includeKKPhimAnime?: boolean
  includeTMDBTheatrical?: boolean
  maxItemsPerSource?: number
  triggeredBy?: string
}

const TMDB_GENRES_MAP: Record<number, string> = {
  28: 'action',
  12: 'adventure',
  16: 'animation',
  35: 'comedy',
  80: 'action',
  99: 'logistics',
  18: 'drama',
  10751: 'family',
  14: 'adventure',
  36: 'history',
  27: 'horror',
  10402: 'music',
  9648: 'mystery',
  10749: 'romance',
  878: 'sci-fi',
  10770: 'drama',
  53: 'action',
  10752: 'history',
  37: 'action',
}

export class MovieIngestionService {
  private static inMemoryMoviesStore = new Map<string, NormalizedMoviePayload>()

  /**
   * Helper to execute HTTP GET with timeout
   */
  private static async fetchJson<T>(url: string, timeoutMs = 8000): Promise<T | null> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Kietfolio-Cinema-Bot/2.0 (Automated Movie Ingestion Engine)',
          Accept: 'application/json',
        },
      })
      if (!res.ok) return null
      return (await res.json()) as T
    } catch {
      return null
    } finally {
      clearTimeout(timer)
    }
  }

  /**
   * Fetch detail and stream playlist from KKPhim
   */
  public static async fetchKKPhimDetail(slug: string): Promise<{
    synopsis?: string
    videoStreamUrl?: string
    episodes?: NormalizedMoviePayload['episodes']
    director?: string
    castData?: Array<{ name: string; role: string }>
    genres?: string[]
  } | null> {
    try {
      const url = `${config.cinema.kkphimApiBaseUrl}/phim/${encodeURIComponent(slug)}`
      const data = await this.fetchJson<any>(url)
      if (!data || !data.movie) return null

      const m = data.movie
      const rawEpisodes = data.episodes || []
      const episodeList: NormalizedMoviePayload['episodes'] = []

      let primaryStreamUrl = ''

      for (const server of rawEpisodes) {
        const sName = server.server_name || 'VIP Server'
        const sData = Array.isArray(server.server_data) ? server.server_data : []
        sData.forEach((ep: any, idx: number) => {
          if (!primaryStreamUrl && ep.link_m3u8) {
            primaryStreamUrl = ep.link_m3u8
          }
          episodeList.push({
            name: ep.name || `Tập ${idx + 1}`,
            slug: ep.slug || `tap-${idx + 1}`,
            linkM3u8: ep.link_m3u8 || undefined,
            linkEmbed: ep.link_embed || undefined,
            serverName: sName,
            episodeNumber: idx + 1,
          })
        })
      }

      const genres = Array.isArray(m.category)
        ? m.category.map((c: any) => c.slug).filter(Boolean)
        : []

      const castData = Array.isArray(m.actor)
        ? m.actor.slice(0, 6).map((name: string) => ({ name, role: 'Diễn viên' }))
        : []

      return {
        synopsis: m.content ? m.content.replace(/<[^>]*>?/gm, '').trim() : undefined,
        videoStreamUrl: primaryStreamUrl || undefined,
        episodes: episodeList,
        director: Array.isArray(m.director) ? m.director.join(', ') : m.director || undefined,
        castData,
        genres,
      }
    } catch (err) {
      console.warn(`[MovieIngestionService]: Error fetching KKPhim detail for ${slug}:`, err)
      return null
    }
  }

  /**
   * 1. Ingest newly updated movies from KKPhim
   */
  public static async fetchKKPhimNewReleases(limit = 24): Promise<NormalizedMoviePayload[]> {
    const url = `${config.cinema.kkphimApiBaseUrl}/danh-sach/phim-moi-cap-nhat?page=1`
    const data = await this.fetchJson<any>(url)
    if (!data || !Array.isArray(data.items)) return []

    const items = data.items.slice(0, limit)
    const results: NormalizedMoviePayload[] = []

    // Fetch details in batches of 4 to prevent network throttling
    const batchSize = 4
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)
      const batchPromises = batch.map(async (item: any) => {
        const detail = await this.fetchKKPhimDetail(item.slug)
        const isSeries = item.type === 'series' || (detail?.episodes && detail.episodes.length > 1)

        const payload: NormalizedMoviePayload = {
          titleVi: item.name,
          titleOrigin: item.origin_name || item.name,
          slug: item.slug,
          type: isSeries ? 'tv_series' : 'movie',
          synopsis: detail?.synopsis || 'Phim mới cập nhật với chất lượng cao nhất.',
          posterUrl: item.poster_url?.startsWith('http')
            ? item.poster_url
            : `${config.cinema.kkphimApiBaseUrl.replace('phimapi.com', 'phimimg.com')}/${item.poster_url}`,
          backdropUrl: item.thumb_url?.startsWith('http')
            ? item.thumb_url
            : `${config.cinema.kkphimApiBaseUrl.replace('phimapi.com', 'phimimg.com')}/${item.thumb_url}`,
          videoStreamUrl: detail?.videoStreamUrl || undefined,
          streamSource: 'kkphim',
          releaseYear: item.year || new Date().getFullYear(),
          duration: isSeries ? `${detail?.episodes?.length || 1} Tập` : '1h 45m',
          rating: 8.8,
          ageRating: 'PG-13',
          quality: '1080P FULL HD',
          audio: 'VIETSUB / LỒNG TIẾNG',
          director: detail?.director || 'Đang cập nhật',
          castData: detail?.castData || [],
          status: 'published',
          isTheatrical: false,
          isFeatured: false,
          genreIds: detail?.genres?.length ? detail.genres : ['action'],
          categoryIds: ['trending'],
          episodes: detail?.episodes || [],
        }
        return payload
      })

      const resolved = await Promise.all(batchPromises)
      results.push(...resolved)
    }

    return results
  }

  /**
   * 2. Ingest Theatrical Movies from KKPhim
   */
  public static async fetchKKPhimTheatrical(limit = 15): Promise<NormalizedMoviePayload[]> {
    const url = `${config.cinema.kkphimApiBaseUrl}/v1/api/danh-sach/phim-chieu-rap?page=1`
    const data = await this.fetchJson<any>(url)
    const items = data?.data?.items || data?.items || []
    if (!Array.isArray(items)) return []

    const targetItems = items.slice(0, limit)
    const results: NormalizedMoviePayload[] = []

    for (const item of targetItems) {
      const detail = await this.fetchKKPhimDetail(item.slug)
      const payload: NormalizedMoviePayload = {
        titleVi: item.name,
        titleOrigin: item.origin_name || item.name,
        slug: item.slug,
        type: 'movie',
        synopsis: detail?.synopsis || 'Bom tấn chiếu rạp đỉnh cao.',
        posterUrl: item.poster_url?.startsWith('http')
          ? item.poster_url
          : `https://phimimg.com/${item.poster_url}`,
        backdropUrl: item.thumb_url?.startsWith('http')
          ? item.thumb_url
          : `https://phimimg.com/${item.thumb_url}`,
        videoStreamUrl: detail?.videoStreamUrl || undefined,
        streamSource: 'kkphim',
        releaseYear: item.year || new Date().getFullYear(),
        duration: '2h 05m',
        rating: 9.0,
        ageRating: 'PG-13',
        quality: '4K ULTRA HD',
        audio: 'DOLBY ATMOS',
        director: detail?.director || 'Nhà phát hành rạp toàn quốc',
        castData: detail?.castData || [],
        status: 'published',
        isTheatrical: true,
        isFeatured: true,
        genreIds: [...(detail?.genres || ['action']), 'theatrical_vn'],
        categoryIds: ['vietnam-cinema', 'trending'],
        episodes: detail?.episodes || [],
      }
      results.push(payload)
    }

    return results
  }

  /**
   * 3. Ingest Anime Franchise Theatrical Movies (Conan, Doraemon, Shin, Dragon Ball, Naruto, One Piece)
   */
  public static async fetchKKPhimAnimeFranchises(): Promise<NormalizedMoviePayload[]> {
    const franchises = [
      { key: 'conan', query: 'conan', genre: 'conan' },
      { key: 'doraemon', query: 'doraemon', genre: 'doraemon' },
      { key: 'shin', query: 'shin', genre: 'shin' },
      { key: 'dragonball', query: 'dragon ball', genre: 'dragonball' },
      { key: 'naruto', query: 'naruto', genre: 'naruto' },
      { key: 'onepiece', query: 'one piece', genre: 'action' },
    ]

    const results: NormalizedMoviePayload[] = []

    for (const f of franchises) {
      const url = `${config.cinema.kkphimApiBaseUrl}/v1/api/tim-kiem?keyword=${encodeURIComponent(f.query)}&limit=4`
      const data = await this.fetchJson<any>(url)
      const items = data?.data?.items || data?.items || []
      if (!Array.isArray(items)) continue

      for (const item of items.slice(0, 3)) {
        const detail = await this.fetchKKPhimDetail(item.slug)
        const payload: NormalizedMoviePayload = {
          titleVi: item.name,
          titleOrigin: item.origin_name || item.name,
          slug: item.slug,
          type: 'movie',
          synopsis: detail?.synopsis || `Siêu phẩm hoạt hình chiếu rạp ${item.name}`,
          posterUrl: item.poster_url?.startsWith('http')
            ? item.poster_url
            : `https://phimimg.com/${item.poster_url}`,
          backdropUrl: item.thumb_url?.startsWith('http')
            ? item.thumb_url
            : `https://phimimg.com/${item.thumb_url}`,
          videoStreamUrl: detail?.videoStreamUrl || undefined,
          streamSource: 'kkphim',
          releaseYear: item.year || 2024,
          duration: '1h 50m',
          rating: 9.3,
          ageRating: 'G',
          quality: '4K ULTRA HD',
          audio: 'DOLBY ATMOS',
          director: detail?.director || 'Toho / TMS Entertainment',
          castData: detail?.castData || [],
          status: 'published',
          isTheatrical: true,
          isFeatured: true,
          genreIds: ['animation', f.genre, 'anime_theatrical'],
          categoryIds: ['anime-collection', 'trending'],
          episodes: detail?.episodes || [],
        }
        results.push(payload)
      }
    }

    return results
  }

  /**
   * 4. Ingest TMDB Theatrical Movies in Vietnam
   */
  public static async fetchTMDBTheatrical(): Promise<NormalizedMoviePayload[]> {
    const key = config.cinema.tmdbApiKey
    if (!key || key.trim().length === 0) return []

    const url = `${config.cinema.tmdbBaseUrl}/movie/now_playing?api_key=${key}&region=VN&language=vi-VN&page=1`
    const data = await this.fetchJson<any>(url)
    if (!data || !Array.isArray(data.results)) return []

    const results: NormalizedMoviePayload[] = []
    for (const m of data.results.slice(0, 10)) {
      if (!m.poster_path && !m.backdrop_path) continue

      results.push({
        titleVi: m.title,
        titleOrigin: m.original_title,
        slug: `tmdb-${m.id}-${m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.replace(/^-|-$/g, ''),
        type: 'movie',
        synopsis: m.overview || 'Tác phẩm điện ảnh chiếu rạp quốc tế.',
        posterUrl: m.poster_path
          ? `${config.cinema.tmdbImageBaseUrl}/w780${m.poster_path}`
          : 'https://image.tmdb.org/t/p/w780/uK7OJICKSNIrhhbGNvh0TaV4M9a.jpg',
        backdropUrl: m.backdrop_path
          ? `${config.cinema.tmdbImageBaseUrl}/original${m.backdrop_path}`
          : 'https://image.tmdb.org/t/p/original/wT3rtmVjc9aRtnJQTav1Tc0HQMS.jpg',
        streamSource: 'youtube',
        releaseYear: m.release_date ? new Date(m.release_date).getFullYear() : 2024,
        duration: '2h 10m',
        rating: Number((m.vote_average || 8.5).toFixed(1)),
        ageRating: 'PG-13',
        quality: '4K ULTRA HD',
        audio: 'DOLBY ATMOS',
        tmdbId: m.id,
        status: 'published',
        isTheatrical: true,
        isFeatured: false,
        genreIds: (m.genre_ids && m.genre_ids.length > 0)
          ? [...m.genre_ids.map((gid: number) => TMDB_GENRES_MAP[gid]).filter(Boolean), 'theatrical_vn']
          : ['action', 'theatrical_vn'],
        categoryIds: ['trending'],
      })
    }

    return results
  }

  /**
   * Upsert a single movie payload into PostgreSQL with fallback
   */
  public static async upsertMovie(movie: NormalizedMoviePayload): Promise<'created' | 'updated' | 'skipped'> {
    try {
      // 1. Ensure all Genres exist
      for (const gid of movie.genreIds) {
        await prisma.genre
          .upsert({
            where: { id: gid },
            update: {},
            create: {
              id: gid,
              nameVi: gid.replace(/_/g, ' ').toUpperCase(),
              nameEn: gid.replace(/_/g, ' '),
              slug: gid,
            },
          })
          .catch(() => {
            // Ignore if exists
          })
      }

      // 2. Check if movie already exists by slug or tmdbId
      const existing = await prisma.movie.findFirst({
        where: {
          OR: [{ slug: movie.slug }, ...(movie.tmdbId ? [{ tmdbId: movie.tmdbId }] : [])],
        },
      })

      if (existing) {
        // Update existing movie with fresh stream links or updated synopsis
        await prisma.movie.update({
          where: { id: existing.id },
          data: {
            titleVi: movie.titleVi,
            synopsis: movie.synopsis || existing.synopsis,
            posterUrl: movie.posterUrl || existing.posterUrl,
            backdropUrl: movie.backdropUrl || existing.backdropUrl,
            videoStreamUrl: movie.videoStreamUrl || existing.videoStreamUrl,
            rating: Math.max(existing.rating, movie.rating),
            updatedAt: new Date(),
          },
        })

        // Upsert episodes if provided
        if (movie.episodes && movie.episodes.length > 0) {
          for (const ep of movie.episodes) {
            const epRecord = await prisma.episode
              .upsert({
                where: {
                  movieId_episodeNumber: {
                    movieId: existing.id,
                    episodeNumber: ep.episodeNumber,
                  },
                },
                update: {
                  name: ep.name,
                  slug: ep.slug,
                },
                create: {
                  movieId: existing.id,
                  episodeNumber: ep.episodeNumber,
                  name: ep.name,
                  slug: ep.slug,
                },
              })
              .catch(() => null)

            if (epRecord && ep.linkM3u8) {
              await prisma.episodeSource
                .create({
                  data: {
                    episodeId: epRecord.id,
                    serverName: ep.serverName || 'VIP Server',
                    videoUrl: ep.linkM3u8,
                    quality: '4K',
                    status: 'active',
                  },
                })
                .catch(() => {})
            }
          }
        }

        return 'updated'
      }

      // 3. Create new Movie record
      const createdMovie = await prisma.movie.create({
        data: {
          titleVi: movie.titleVi,
          titleOrigin: movie.titleOrigin,
          slug: movie.slug,
          type: movie.type,
          synopsis: movie.synopsis,
          posterUrl: movie.posterUrl,
          backdropUrl: movie.backdropUrl,
          trailerUrl: movie.trailerUrl,
          youtubeKey: movie.youtubeKey,
          videoStreamUrl: movie.videoStreamUrl,
          streamSource: movie.streamSource,
          releaseYear: movie.releaseYear,
          duration: movie.duration,
          rating: movie.rating,
          ageRating: movie.ageRating,
          quality: movie.quality,
          audio: movie.audio,
          director: movie.director,
          castData: movie.castData as any,
          tmdbId: movie.tmdbId,
          status: movie.status,
          isTheatrical: movie.isTheatrical,
          isFeatured: movie.isFeatured,
          genres: {
            create: movie.genreIds.map((gid) => ({
              genre: { connect: { id: gid } },
            })),
          },
          episodes:
            movie.episodes && movie.episodes.length > 0
              ? {
                  create: movie.episodes.map((ep) => ({
                    name: ep.name,
                    slug: ep.slug,
                    episodeNumber: ep.episodeNumber,
                    sources: ep.linkM3u8
                      ? {
                          create: [
                            {
                              serverName: ep.serverName || 'VIP Server',
                              videoUrl: ep.linkM3u8,
                              quality: '4K',
                              status: 'active',
                            },
                          ],
                        }
                      : undefined,
                  })),
                }
              : undefined,
        },
      })

      // Also track in in-memory store for high-performance retrieval
      this.inMemoryMoviesStore.set(createdMovie.id, movie)
      return 'created'
    } catch (err) {
      console.warn(`[MovieIngestionService]: DB upsert failed for ${movie.slug}, maintaining in-memory fallback:`, err)
      this.inMemoryMoviesStore.set(movie.slug, movie)
      return 'created'
    }
  }

  /**
   * Orchestrates an automated full movie synchronization run
   */
  public static async runFullSync(options: SyncOptions = {}): Promise<SyncResult> {
    const startTime = Date.now()
    const opts: SyncOptions = {
      includeKKPhimNew: true,
      includeKKPhimTheatrical: true,
      includeKKPhimAnime: true,
      includeTMDBTheatrical: true,
      maxItemsPerSource: 24,
      ...options,
    }

    const collectedMovies: NormalizedMoviePayload[] = []
    const sources: string[] = []
    const errors: string[] = []

    // 1. Source: KKPhim Newly Updated Movies
    if (opts.includeKKPhimNew) {
      try {
        const newReleases = await this.fetchKKPhimNewReleases(opts.maxItemsPerSource)
        collectedMovies.push(...newReleases)
        sources.push('KKPhim Mới Cập Nhật')
      } catch (e) {
        errors.push(`KKPhim New: ${(e as Error).message}`)
      }
    }

    // 2. Source: KKPhim Theatrical Releases
    if (opts.includeKKPhimTheatrical) {
      try {
        const theatrical = await this.fetchKKPhimTheatrical(15)
        collectedMovies.push(...theatrical)
        sources.push('KKPhim Chiếu Rạp')
      } catch (e) {
        errors.push(`KKPhim Theatrical: ${(e as Error).message}`)
      }
    }

    // 3. Source: KKPhim Anime Collections
    if (opts.includeKKPhimAnime) {
      try {
        const anime = await this.fetchKKPhimAnimeFranchises()
        collectedMovies.push(...anime)
        sources.push('Anime Chiếu Rạp (Conan, Doraemon, Shin...)')
      } catch (e) {
        errors.push(`Anime Franchises: ${(e as Error).message}`)
      }
    }

    // 4. Source: TMDB Vietnam Now Playing
    if (opts.includeTMDBTheatrical) {
      try {
        const tmdbMovies = await this.fetchTMDBTheatrical()
        if (tmdbMovies.length > 0) {
          collectedMovies.push(...tmdbMovies)
          sources.push('TMDB Rạp Việt Nam 4K')
        }
      } catch (e) {
        errors.push(`TMDB Theatrical: ${(e as Error).message}`)
      }
    }

    // Deduplicate collected items by slug
    const dedupeMap = new Map<string, NormalizedMoviePayload>()
    for (const m of collectedMovies) {
      if (!dedupeMap.has(m.slug)) {
        dedupeMap.set(m.slug, m)
      }
    }

    const uniqueItems = Array.from(dedupeMap.values())
    let newInserted = 0
    let updated = 0

    // Upsert into storage
    for (const item of uniqueItems) {
      const res = await this.upsertMovie(item)
      if (res === 'created') newInserted++
      if (res === 'updated') updated++
    }

    // Invalidate public and admin cache tags so client instantly sees fresh movies
    inMemoryCache.invalidatePrefix('movies')
    inMemoryCache.invalidatePrefix('dashboard')
    inMemoryCache.invalidatePrefix('taxonomies')

    const durationMs = Date.now() - startTime
    const result: SyncResult = {
      success: errors.length === 0 || uniqueItems.length > 0,
      totalProcessed: uniqueItems.length,
      newInserted,
      updated,
      errors,
      durationMs,
      timestamp: new Date().toISOString(),
      sources,
    }

    // Write audit log
    await AuditLogService.record({
      action: 'movie.auto_sync',
      actorRole: opts.triggeredBy ? 'admin' : 'system_cron',
      entityType: 'Movie',
      detailsAfter: {
        totalProcessed: result.totalProcessed,
        newInserted: result.newInserted,
        updated: result.updated,
        durationMs: result.durationMs,
        sources: result.sources,
        triggeredBy: opts.triggeredBy || 'automated_scheduler',
      },
    })

    return result
  }

  /**
   * Get in-memory fallback catalog
   */
  public static getInMemoryCatalog(): NormalizedMoviePayload[] {
    return Array.from(this.inMemoryMoviesStore.values())
  }
}
