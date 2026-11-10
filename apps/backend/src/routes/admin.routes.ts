import { Router } from 'express'
import { sessionAuth } from '../middlewares/sessionAuth.middleware'
import { requirePermission } from '../middlewares/requirePermission'
import { csrfProtection } from '../middlewares/csrfProtection.middleware'
import { cacheResponse } from '../resilience/inMemoryCache'

// Controllers
import { DashboardController } from '../modules/admin/dashboard.controller'
import { MoviesController } from '../modules/movies/movies.controller'
import { EpisodesController } from '../modules/movies/episodes.controller'
import { TaxonomiesController } from '../modules/taxonomies/taxonomies.controller'
import { UsersAdminController } from '../modules/users/usersAdmin.controller'
import { AnalyticsAdminController } from '../modules/analytics/analyticsAdmin.controller'
import { SystemAdminController } from '../modules/system/systemAdmin.controller'

export const adminRouter = Router()

// Apply Session Authentication & CSRF Protection across all /api/admin routes
adminRouter.use(sessionAuth)
adminRouter.use(csrfProtection)

// -----------------------------------------------------------------------------
// 1. DASHBOARD OVERVIEW
// -----------------------------------------------------------------------------
adminRouter.get('/dashboard/metrics', requirePermission('dashboard.view'), cacheResponse(15, 'dashboard'), DashboardController.getMetrics)

// -----------------------------------------------------------------------------
// 2. MOVIES & TV SERIES
// -----------------------------------------------------------------------------
adminRouter.get('/movies', requirePermission('movies.read'), cacheResponse(30, 'movies'), MoviesController.listMovies)
adminRouter.post('/movies', requirePermission('movies.create'), MoviesController.createMovie)
adminRouter.get('/movies/:id', requirePermission('movies.read'), cacheResponse(30, 'movies'), MoviesController.getMovieById)
adminRouter.put('/movies/:id', requirePermission('movies.update'), MoviesController.updateMovie)
adminRouter.delete('/movies/:id', requirePermission('movies.delete'), MoviesController.deleteMovie)
adminRouter.patch('/movies/bulk-status', requirePermission('movies.publish'), MoviesController.bulkUpdateStatus)

// -----------------------------------------------------------------------------
// 3. EPISODES
// -----------------------------------------------------------------------------
adminRouter.get('/movies/:movieId/episodes', requirePermission('movies.read'), cacheResponse(30, 'episodes'), EpisodesController.listEpisodes)
adminRouter.post('/episodes', requirePermission('episodes.manage'), EpisodesController.createEpisode)
adminRouter.put('/episodes/:id', requirePermission('episodes.manage'), EpisodesController.updateEpisode)
adminRouter.delete('/episodes/:id', requirePermission('episodes.manage'), EpisodesController.deleteEpisode)

// -----------------------------------------------------------------------------
// 4. TAXONOMIES: GENRES, CATEGORIES, BANNERS
// -----------------------------------------------------------------------------
adminRouter.get('/genres', requirePermission('taxonomies.manage'), cacheResponse(60, 'taxonomies'), TaxonomiesController.listGenres)
adminRouter.post('/genres', requirePermission('taxonomies.manage'), TaxonomiesController.createGenre)
adminRouter.delete('/genres/:id', requirePermission('taxonomies.manage'), TaxonomiesController.deleteGenre)

adminRouter.get('/categories', requirePermission('taxonomies.manage'), cacheResponse(60, 'taxonomies'), TaxonomiesController.listCategories)
adminRouter.post('/categories', requirePermission('taxonomies.manage'), TaxonomiesController.createCategory)
adminRouter.put('/categories/:id', requirePermission('taxonomies.manage'), TaxonomiesController.updateCategory)
adminRouter.delete('/categories/:id', requirePermission('taxonomies.manage'), TaxonomiesController.deleteCategory)

adminRouter.get('/banners', requirePermission('taxonomies.manage'), cacheResponse(60, 'banners'), TaxonomiesController.listBanners)
adminRouter.post('/banners', requirePermission('taxonomies.manage'), TaxonomiesController.createBanner)
adminRouter.delete('/banners/:id', requirePermission('taxonomies.manage'), TaxonomiesController.deleteBanner)

// -----------------------------------------------------------------------------
// 5. USERS & RBAC
// -----------------------------------------------------------------------------
adminRouter.get('/users', requirePermission('users.read'), UsersAdminController.listUsers)
adminRouter.get('/users/:id', requirePermission('users.read'), UsersAdminController.getUserDetail)
adminRouter.patch('/users/:id/status', requirePermission('users.suspend'), UsersAdminController.updateUserStatus)
adminRouter.patch('/users/:id/role', requirePermission('users.update'), UsersAdminController.updateUserRole)
adminRouter.get('/roles/matrix', requirePermission('roles.manage'), UsersAdminController.getRbacMatrix)

// -----------------------------------------------------------------------------
// 6. ANALYTICS & REVENUE
// -----------------------------------------------------------------------------
adminRouter.get('/analytics/traffic', requirePermission('analytics.read'), AnalyticsAdminController.getTrafficAnalytics)
adminRouter.get('/revenue/overview', requirePermission('revenue.read'), AnalyticsAdminController.getRevenueAnalytics)
adminRouter.get('/reports/export', requirePermission('reports.export'), AnalyticsAdminController.exportReport)

// -----------------------------------------------------------------------------
// 7. SYSTEM, AUDIT LOGS & MONITORING
// -----------------------------------------------------------------------------
adminRouter.get('/audit-logs', requirePermission('audit_logs.read'), SystemAdminController.getAuditLogs)
adminRouter.get('/video-servers', requirePermission('system.video_monitor'), SystemAdminController.getVideoServers)
adminRouter.get('/broken-links', requirePermission('system.video_monitor'), SystemAdminController.getBrokenLinksReport)
adminRouter.get('/settings', requirePermission('system.settings'), SystemAdminController.getSettings)
adminRouter.put('/settings', requirePermission('system.settings'), SystemAdminController.updateSettings)
