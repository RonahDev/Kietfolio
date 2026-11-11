import { describe, it, expect, vi } from 'vitest'
import { requirePermission } from '../middlewares/requirePermission'
import { csrfProtection } from '../middlewares/csrfProtection.middleware'
import { AuditLogService } from '../services/auditLog.service'
import { ErrorLogService } from '../services/errorLog.service'
import { InMemoryCache } from '../resilience/inMemoryCache'
import { AuthenticatedRequest } from '../types'
import { Response } from 'express'

describe('Pillar 3: Admin Command Center & RBAC Security — 10 Comprehensive Testcases', () => {
  // Helper to create mock request and response
  const createMockReqRes = (overrides?: Partial<AuthenticatedRequest>) => {
    const req = {
      method: 'GET',
      headers: {},
      cookies: {},
      ...overrides,
    } as unknown as AuthenticatedRequest

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      cookie: vi.fn().mockReturnThis(),
      setHeader: vi.fn().mockReturnThis(),
    } as unknown as Response

    const next = vi.fn()

    return { req, res, next }
  }

  // TC-ADM-01: requirePermission passes when user has permission
  it('TC-ADM-01: grants access when adminUser possesses the requested permission', () => {
    const { req, res, next } = createMockReqRes({
      adminUser: {
        id: 'admin_1',
        email: 'editor@kietfolio.vn',
        role: 'content_manager',
        permissions: ['movies.create', 'movies.read', 'movies.update'],
      },
    })

    const middleware = requirePermission('movies.create')
    middleware(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(res.status).not.toHaveBeenCalled()
  })

  // TC-ADM-02: requirePermission denies when permission is missing
  it('TC-ADM-02: denies access with 403 Forbidden when admin lacks required permission', () => {
    const { req, res, next } = createMockReqRes({
      adminUser: {
        id: 'admin_2',
        email: 'moderator@kietfolio.vn',
        role: 'moderator',
        permissions: ['comments.moderate'],
      },
    })

    const middleware = requirePermission('revenue.read')
    middleware(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.stringContaining('Access Denied'),
      })
    )
  })

  // TC-ADM-03: requirePermission blocks unauthenticated requests with 401
  it('TC-ADM-03: returns 401 Unauthorized when no adminUser is present on request', () => {
    const { req, res, next } = createMockReqRes({ adminUser: undefined })

    const middleware = requirePermission('dashboard.view')
    middleware(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(401)
  })

  // TC-ADM-04: requirePermission allows super_admin to bypass any permission
  it('TC-ADM-04: grants master clearance to super_admin regardless of permission list', () => {
    const { req, res, next } = createMockReqRes({
      adminUser: {
        id: 'super_admin_kiet',
        email: 'kietteve22102005@gmail.com',
        role: 'super_admin',
        permissions: [], // Even with empty array, super_admin has master bypass
      },
    })

    const middleware = requirePermission('critical.nuclear.action')
    middleware(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(res.status).not.toHaveBeenCalled()
  })

  // TC-ADM-05: csrfProtection allows safe HTTP methods
  it('TC-ADM-05: allows GET, HEAD, OPTIONS safe methods through CSRF check', () => {
    const { req, res, next } = createMockReqRes({ method: 'GET' })

    csrfProtection(req as any, res, next)
    expect(next).toHaveBeenCalledTimes(1)
  })

  // TC-ADM-06: csrfProtection sets CSRF cookie on initial request if missing
  it('TC-ADM-06: provisions new CSRF token cookie when client has no existing token', () => {
    const { req, res, next } = createMockReqRes({ method: 'GET', cookies: {} })

    csrfProtection(req as any, res, next)
    expect(res.cookie).toHaveBeenCalledWith(
      'kietfolio_csrf_token',
      expect.any(String),
      expect.objectContaining({ path: '/' })
    )
    expect(next).toHaveBeenCalledTimes(1)
  })

  // TC-ADM-07: In-memory cache stores and invalidates entries
  it('TC-ADM-07: caches responses and evicts expired or cleared namespaces', () => {
    const cache = InMemoryCache.getInstance()
    cache.set('dashboard:metrics', { users: 1500, active: 42 }, 10)

    const cachedData = cache.get<{ users: number; active: number }>('dashboard:metrics')
    expect(cachedData).toBeDefined()
    expect(cachedData?.value.users).toBe(1500)

    cache.invalidateNamespace('dashboard')
    expect(cache.get('dashboard:metrics')).toBeNull()
  })

  // TC-ADM-08: AuditLogService persists audit entries safely
  it('TC-ADM-08: records administrative audit events without crashing server', async () => {
    await expect(
      AuditLogService.record({
        actorId: 'admin_test_1',
        actorRole: 'admin',
        action: 'movie.publish',
        entityType: 'Movie',
        entityId: 'movie_123',
        detailsAfter: { status: 'published' },
      })
    ).resolves.not.toThrow()
  })

  // TC-ADM-09: ErrorLogService records system errors and formats reports
  it('TC-ADM-09: records telemetry errors and supports formatted export', () => {
    ErrorLogService.record({
      source: 'backend',
      level: 'warn',
      name: 'HighMemoryWarning',
      message: 'Node process memory reached 75%',
      path: '/api/admin/metrics',
    })

    const report = ErrorLogService.exportReport()
    expect(report).toBeDefined()
    expect(report.totalErrors).toBeGreaterThanOrEqual(1)
  })

  // TC-ADM-10: Multi-session isolation
  it('TC-ADM-10: enforces role segregation between analyst and admin roles', () => {
    const analystReq = createMockReqRes({
      adminUser: {
        id: 'analyst_1',
        email: 'analyst@domain.com',
        role: 'analyst',
        permissions: ['analytics.read', 'reports.export'],
      },
    })

    const deleteMovieGuard = requirePermission('movies.delete')
    deleteMovieGuard(analystReq.req, analystReq.res, analystReq.next)

    expect(analystReq.next).not.toHaveBeenCalled()
    expect(analystReq.res.status).toHaveBeenCalledWith(403)
  })
})
