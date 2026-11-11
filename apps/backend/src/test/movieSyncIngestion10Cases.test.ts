import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MovieSyncScheduler } from '../services/movieSyncScheduler.service'
import { MovieIngestionService, type NormalizedMoviePayload } from '../services/movieIngestion.service'
import { inMemoryCache } from '../resilience/inMemoryCache'
import { AuditLogService } from '../services/auditLog.service'
import { prisma } from '../config/prisma'

describe('Automated Movie Sync & Ingestion Engine — 10 Comprehensive Testcases', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    MovieSyncScheduler.stop()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    MovieSyncScheduler.stop()
  })

  // TC-SYNC-01: MovieSyncScheduler initialization, status reporting, and timer management
  it('TC-SYNC-01: initializes scheduler with default telemetry and status reporting', () => {
    const status = MovieSyncScheduler.getStatus()
    expect(status).toBeDefined()
    expect(status.isRunning).toBe(false)
    expect(typeof status.intervalMinutes).toBe('number')
    expect(status.intervalMinutes).toBeGreaterThanOrEqual(15)
    expect(status.sources).toBeDefined()
    expect(status.sources.includeKKPhimNew).toBe(true)
  })

  // TC-SYNC-02: Mutex guard prevents concurrent execution when sync is already running
  it('TC-SYNC-02: prevents concurrent sync runs with mutex lock', async () => {
    const syncSpy = vi.spyOn(MovieIngestionService, 'runFullSync').mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                success: true,
                totalProcessed: 5,
                newInserted: 2,
                updated: 3,
                errors: [],
                durationMs: 50,
                timestamp: new Date().toISOString(),
                sources: ['KKPhim Mới Cập Nhật'],
              }),
            80
          )
        })
    )

    const sync1Promise = MovieSyncScheduler.executeSync('test_concurrent_1')

    // Second call should throw mutex error
    await expect(MovieSyncScheduler.executeSync('test_concurrent_2')).rejects.toThrow(
      /Tiến trình đồng bộ phim tự động đang chạy/
    )

    await sync1Promise
    expect(MovieSyncScheduler.getStatus().isRunning).toBe(false)
    syncSpy.mockRestore()
  })

  // TC-SYNC-03: Media Sanitizer intercepts corrupted CDN hashes (Doraemon Hijack 1971 / Greek poster)
  it('TC-SYNC-03: sanitizes corrupted third-party poster and backdrop hashes', () => {
    // 1. Corrupted Doraemon poster hash 3b5ed51c (Hijack 1971)
    const sanitized1 = MovieIngestionService.sanitizeKkphimMedia(
      'doraemon-nobita-va-ban-giao-huong-dia-cau',
      '3b5ed51c_hijack.jpg',
      '0514f6d0_hijack_thumb.jpg'
    )
    expect(sanitized1.posterUrl).toContain('1W5Kg4K27U3dx9Kxb8DaE6WFLHI.jpg')
    expect(sanitized1.posterUrl).toContain('wsrv.nl')
    expect(sanitized1.backdropUrl).toContain('xIKm2bfJ6HxiCfXBoOCwgDbOhzt.jpg')

    // 2. Corrupted Doraemon Greek poster hash uux6M8z3
    const sanitized2 = MovieIngestionService.sanitizeKkphimMedia(
      'doraemon-nobita-va-vung-dat-ly-tuong-tren-bau-troi',
      'uux6M8z3_corrupted.jpg',
      'zaAo7ytw_corrupted_thumb.jpg'
    )
    expect(sanitized2.posterUrl).toContain('27f8594f3cb3fc39982d825896a8a9cf.jpg')
    expect(sanitized2.posterUrl).not.toContain('uux6M8z3')

    // 3. Normal clean movie passes through
    const normal = MovieIngestionService.sanitizeKkphimMedia(
      'avatar-the-way-of-water',
      'https://phimimg.com/avatar.jpg',
      'https://phimimg.com/avatar-thumb.jpg'
    )
    expect(normal.posterUrl).toBe('https://phimimg.com/avatar.jpg')
  })

  // TC-SYNC-04: Deduplication by slug preserves unique records and merges streams
  it('TC-SYNC-04: deduplicates collected movies by slug during full synchronization', async () => {
    const mockMovieA: NormalizedMoviePayload = {
      titleVi: 'Phim Thử Nghiệm A',
      slug: 'phim-thu-nghiem-a',
      type: 'movie',
      posterUrl: 'https://img.com/a.jpg',
      backdropUrl: 'https://img.com/a-bg.jpg',
      streamSource: 'kkphim',
      releaseYear: 2026,
      rating: 8.5,
      ageRating: 'PG-13',
      quality: '4K',
      audio: 'VIETSUB',
      status: 'published',
      isTheatrical: false,
      isFeatured: false,
      genreIds: ['action'],
      categoryIds: ['trending'],
    }

    const mockMovieADup: NormalizedMoviePayload = {
      ...mockMovieA,
      titleVi: 'Phim Thử Nghiệm A (Nguồn 2)',
      videoStreamUrl: 'https://stream.com/source2.m3u8',
    }

    vi.spyOn(MovieIngestionService, 'fetchKKPhimNewReleases').mockResolvedValue([mockMovieA, mockMovieADup])
    vi.spyOn(MovieIngestionService, 'fetchKKPhimTheatrical').mockResolvedValue([])
    vi.spyOn(MovieIngestionService, 'fetchKKPhimAnimeFranchises').mockResolvedValue([])
    vi.spyOn(MovieIngestionService, 'fetchTMDBTheatrical').mockResolvedValue([])
    vi.spyOn(MovieIngestionService, 'upsertMovie').mockResolvedValue('created')

    const result = await MovieIngestionService.runFullSync({
      includeKKPhimNew: true,
      includeKKPhimTheatrical: false,
      includeKKPhimAnime: false,
      includeTMDBTheatrical: false,
    })

    // Both items had slug 'phim-thu-nghiem-a', so totalProcessed must be exactly 1
    expect(result.totalProcessed).toBe(1)
    expect(result.newInserted).toBe(1)
  })

  // TC-SYNC-05: In-memory fallback maintains catalog when PostgreSQL is unavailable
  it('TC-SYNC-05: upsertMovie falls back to in-memory store if database throws', async () => {
    // Force prisma to throw simulating database downtime
    vi.spyOn(prisma.movie, 'findFirst').mockRejectedValue(new Error('PostgreSQL Offline'))

    const testMovie: NormalizedMoviePayload = {
      titleVi: 'Siêu Phẩm Hoạt Hình Doraemon',
      slug: 'doraemon-nobita-va-ban-giao-huong-dia-cau-test',
      type: 'movie',
      synopsis: 'Nobita và giai điệu âm nhạc cứu tinh cầu.',
      posterUrl: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w780/1W5Kg4K27U3dx9Kxb8DaE6WFLHI.jpg',
      backdropUrl: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w1280/xIKm2bfJ6HxiCfXBoOCwgDbOhzt.jpg',
      streamSource: 'kkphim',
      releaseYear: 2024,
      rating: 9.3,
      ageRating: 'G',
      quality: '4K ULTRA HD',
      audio: 'LỒNG TIẾNG',
      status: 'published',
      isTheatrical: true,
      isFeatured: true,
      genreIds: ['animation', 'doraemon'],
      categoryIds: ['anime-collection'],
    }

    const outcome = await MovieIngestionService.upsertMovie(testMovie)
    expect(outcome).toBe('created')

    const catalog = MovieIngestionService.getInMemoryCatalog()
    const found = catalog.find((m) => m.slug === testMovie.slug)
    expect(found).toBeDefined()
    expect(found?.titleVi).toBe(testMovie.titleVi)
  })

  // TC-SYNC-06: Cache invalidation across movies, dashboard, and taxonomies
  it('TC-SYNC-06: invalidates cache namespaces after completing synchronization', async () => {
    inMemoryCache.set('movies:catalog:page1', { data: [] }, 60)
    inMemoryCache.set('dashboard:overview', { data: {} }, 60)
    inMemoryCache.set('taxonomies:genres', { data: [] }, 60)

    expect(inMemoryCache.get('movies:catalog:page1')).toBeDefined()

    vi.spyOn(MovieIngestionService, 'fetchKKPhimNewReleases').mockResolvedValue([])
    vi.spyOn(MovieIngestionService, 'fetchKKPhimTheatrical').mockResolvedValue([])
    vi.spyOn(MovieIngestionService, 'fetchKKPhimAnimeFranchises').mockResolvedValue([])
    vi.spyOn(MovieIngestionService, 'fetchTMDBTheatrical').mockResolvedValue([])

    await MovieIngestionService.runFullSync({
      includeKKPhimNew: false,
      includeKKPhimTheatrical: false,
      includeKKPhimAnime: false,
      includeTMDBTheatrical: false,
    })

    expect(inMemoryCache.get('movies:catalog:page1')).toBeNull()
    expect(inMemoryCache.get('dashboard:overview')).toBeNull()
    expect(inMemoryCache.get('taxonomies:genres')).toBeNull()
  })

  // TC-SYNC-07: updateSettings dynamically updates interval and source toggles
  it('TC-SYNC-07: updates scheduler interval and source toggles with safe validation', async () => {
    const updated = await MovieSyncScheduler.updateSettings({
      autoSyncEnabled: true,
      intervalMinutes: 45,
      sources: {
        includeKKPhimNew: true,
        includeKKPhimTheatrical: false,
      },
    })

    expect(updated.intervalMinutes).toBe(45)
    expect(updated.autoSyncEnabled).toBe(true)
    expect(updated.sources.includeKKPhimTheatrical).toBe(false)
  })

  // TC-SYNC-08: Manual trigger invokes full sync and records audit log
  it('TC-SYNC-08: triggerSyncNow executes immediate full sync and records audit log', async () => {
    vi.spyOn(AuditLogService, 'record').mockResolvedValue({} as any)

    vi.spyOn(MovieIngestionService, 'runFullSync').mockResolvedValue({
      success: true,
      totalProcessed: 12,
      newInserted: 4,
      updated: 8,
      errors: [],
      durationMs: 250,
      timestamp: new Date().toISOString(),
      sources: ['KKPhim Mới Cập Nhật', 'Anime Chiếu Rạp'],
    })

    const result = await MovieSyncScheduler.triggerSyncNow('admin@kietfolio.vn')
    expect(result.success).toBe(true)
    expect(result.newInserted).toBe(4)
    expect(result.updated).toBe(8)

    const status = MovieSyncScheduler.getStatus()
    expect(status.totalRuns).toBeGreaterThanOrEqual(1)
    expect(status.lastRunAt).toBeDefined()
    expect(status.lastResult?.newInserted).toBe(4)
  })

  // TC-SYNC-09: Optional category sources (Single movies, Series, Animation)
  it('TC-SYNC-09: respects optional source flags in sync configuration', async () => {
    const catSpy = vi.spyOn(MovieIngestionService, 'fetchKKPhimCategory').mockResolvedValue([])
    vi.spyOn(MovieIngestionService, 'fetchKKPhimNewReleases').mockResolvedValue([])
    vi.spyOn(MovieIngestionService, 'fetchKKPhimTheatrical').mockResolvedValue([])
    vi.spyOn(MovieIngestionService, 'fetchKKPhimAnimeFranchises').mockResolvedValue([])
    vi.spyOn(MovieIngestionService, 'fetchTMDBTheatrical').mockResolvedValue([])

    await MovieIngestionService.runFullSync({
      includeKKPhimNew: false,
      includeKKPhimTheatrical: false,
      includeKKPhimAnime: false,
      includeTMDBTheatrical: false,
      includeKKPhimSingle: true,
      includeKKPhimSeries: true,
      includeKKPhimAnimation: true,
    })

    expect(catSpy).toHaveBeenCalledWith('phim-le', 'single-movies', 12)
    expect(catSpy).toHaveBeenCalledWith('phim-bo', 'series', 12)
    expect(catSpy).toHaveBeenCalledWith('hoat-hinh', 'animation', 12)
  })

  // TC-SYNC-10: Graceful stop clears timers cleanly
  it('TC-SYNC-10: cleanly stops scheduler and releases resources on shutdown', () => {
    MovieSyncScheduler.reschedule()
    expect(MovieSyncScheduler.getStatus()).toBeDefined()

    MovieSyncScheduler.stop()
    const status = MovieSyncScheduler.getStatus()
    expect(status.isRunning).toBe(false)
  })
})
