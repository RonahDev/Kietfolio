import { adminApi } from './adminApiClient'
import type {
  AdminUser,
  AdminSessionItem,
  DashboardMetricsResponse,
  AdminMovieItem,
  AdminUserItem,
  VideoServerItem,
  BrokenLinkItem,
} from '../types/admin'

export const adminService = {
  // ---------------------------------------------------------------------------
  // AUTHENTICATION & SESSION MANAGEMENT
  // ---------------------------------------------------------------------------
  async login(email: string, password: string) {
    const res = await adminApi.post<{ success: boolean; data: { user: AdminUser } }>(
      'auth/admin-login',
      { email, password }
    )
    return res.data.user
  },

  async logout() {
    return adminApi.post<{ success: boolean; message: string }>('auth/logout')
  },

  async getMe() {
    const res = await adminApi.get<{ success: boolean; data: { adminUser: AdminUser } }>('auth/me')
    return res.data.adminUser
  },

  async getSessions() {
    const res = await adminApi.get<{ success: boolean; data: { sessions: AdminSessionItem[] } }>(
      'auth/sessions'
    )
    return res.data.sessions
  },

  async revokeSession(sessionId: string) {
    return adminApi.delete(`auth/sessions/${sessionId}`)
  },

  async revokeOtherSessions() {
    return adminApi.post('auth/sessions/revoke-others')
  },

  // ---------------------------------------------------------------------------
  // DASHBOARD METRICS
  // ---------------------------------------------------------------------------
  async getDashboardMetrics(): Promise<DashboardMetricsResponse> {
    const res = await adminApi.get<{ success: boolean; data: DashboardMetricsResponse }>(
      'admin/dashboard/metrics'
    )
    return res.data
  },

  // ---------------------------------------------------------------------------
  // MOVIE MANAGEMENT
  // ---------------------------------------------------------------------------
  async getMovies(params: {
    page?: number
    limit?: number
    search?: string
    type?: string
    status?: string
    genre?: string
    isTheatrical?: boolean
  }) {
    const query = new URLSearchParams()
    if (params.page) query.set('page', params.page.toString())
    if (params.limit) query.set('limit', params.limit.toString())
    if (params.search) query.set('search', params.search)
    if (params.type) query.set('type', params.type)
    if (params.status) query.set('status', params.status)
    if (params.genre) query.set('genre', params.genre)
    if (params.isTheatrical) query.set('isTheatrical', 'true')

    const res = await adminApi.get<{
      success: boolean
      data: {
        movies: AdminMovieItem[]
        pagination: { total: number; page: number; limit: number; totalPages: number }
      }
    }>(`admin/movies?${query.toString()}`)
    return res.data
  },

  async getMovieById(id: string) {
    const res = await adminApi.get<{ success: boolean; data: { movie: AdminMovieItem } }>(
      `admin/movies/${id}`
    )
    return res.data.movie
  },

  async createMovie(data: Partial<AdminMovieItem> & { genreIds?: string[]; categoryIds?: string[] }) {
    return adminApi.post<{ success: boolean; data: { movie: AdminMovieItem } }>('admin/movies', data)
  },

  async updateMovie(
    id: string,
    data: Partial<AdminMovieItem> & { genreIds?: string[]; categoryIds?: string[] }
  ) {
    return adminApi.put<{ success: boolean; data: { movie: AdminMovieItem } }>(`admin/movies/${id}`, data)
  },

  async deleteMovie(id: string) {
    return adminApi.delete(`admin/movies/${id}`)
  },

  async bulkUpdateStatus(movieIds: string[], status: string) {
    return adminApi.patch('admin/movies/bulk-status', { movieIds, status })
  },

  // ---------------------------------------------------------------------------
  // TAXONOMIES: GENRES, CATEGORIES, BANNERS
  // ---------------------------------------------------------------------------
  async getGenres() {
    const res = await adminApi.get<{
      success: boolean
      data: { genres: Array<{ id: string; nameVi: string; nameEn: string; slug: string; movieCount: number }> }
    }>('admin/genres')
    return res.data.genres
  },

  async createGenre(data: { id: string; nameVi: string; nameEn?: string; slug: string }) {
    return adminApi.post('admin/genres', data)
  },

  async deleteGenre(id: string) {
    return adminApi.delete(`admin/genres/${id}`)
  },

  async getCategories() {
    const res = await adminApi.get<{
      success: boolean
      data: {
        categories: Array<{
          id: string
          nameVi: string
          nameEn: string
          slug: string
          displayOrder: number
          isActive: boolean
          movieCount: number
        }>
      }
    }>('admin/categories')
    return res.data.categories
  },

  async createCategory(data: { id: string; nameVi: string; nameEn?: string; slug: string; displayOrder?: number }) {
    return adminApi.post('admin/categories', data)
  },

  async deleteCategory(id: string) {
    return adminApi.delete(`admin/categories/${id}`)
  },

  async getBanners() {
    const res = await adminApi.get<{ success: boolean; data: { banners: any[] } }>('admin/banners')
    return res.data.banners
  },

  async createBanner(data: any) {
    return adminApi.post('admin/banners', data)
  },

  async deleteBanner(id: string) {
    return adminApi.delete(`admin/banners/${id}`)
  },

  // ---------------------------------------------------------------------------
  // USER & RBAC MANAGEMENT
  // ---------------------------------------------------------------------------
  async getUsers(params: { page?: number; limit?: number; search?: string; role?: string; status?: string }) {
    const query = new URLSearchParams()
    if (params.page) query.set('page', params.page.toString())
    if (params.limit) query.set('limit', params.limit.toString())
    if (params.search) query.set('search', params.search)
    if (params.role) query.set('role', params.role)
    if (params.status) query.set('status', params.status)

    const res = await adminApi.get<{
      success: boolean
      data: {
        users: AdminUserItem[]
        pagination: { total: number; page: number; limit: number; totalPages: number }
      }
    }>(`admin/users?${query.toString()}`)
    return res.data
  },

  async getUserDetail(id: string) {
    const res = await adminApi.get<{ success: boolean; data: { user: any } }>(`admin/users/${id}`)
    return res.data.user
  },

  async updateUserStatus(id: string, status: string) {
    return adminApi.patch(`admin/users/${id}/status`, { status })
  },

  async updateUserRole(id: string, role: string) {
    return adminApi.patch(`admin/users/${id}/role`, { role })
  },

  async getRbacMatrix() {
    const res = await adminApi.get<{ success: boolean; data: { roles: any[]; permissions: any[] } }>(
      'admin/roles/matrix'
    )
    return res.data
  },

  // ---------------------------------------------------------------------------
  // ANALYTICS & REVENUE
  // ---------------------------------------------------------------------------
  async getTrafficAnalytics(range: '7d' | '30d' | '90d' = '30d') {
    const res = await adminApi.get<{ success: boolean; data: any }>(`admin/analytics/traffic?range=${range}`)
    return res.data
  },

  async getRevenueAnalytics() {
    const res = await adminApi.get<{ success: boolean; data: any }>('admin/revenue/overview')
    return res.data
  },

  // ---------------------------------------------------------------------------
  // SYSTEM & MONITORING
  // ---------------------------------------------------------------------------
  async getAuditLogs(params: { page?: number; limit?: number; action?: string; actorId?: string }) {
    const query = new URLSearchParams()
    if (params.page) query.set('page', params.page.toString())
    if (params.limit) query.set('limit', params.limit.toString())
    if (params.action) query.set('action', params.action)
    if (params.actorId) query.set('actorId', params.actorId)

    const res = await adminApi.get<{
      success: boolean
      data: { logs: any[]; total: number; page: number; totalPages: number }
    }>(`admin/audit-logs?${query.toString()}`)
    return res.data
  },

  async getVideoServers(): Promise<VideoServerItem[]> {
    const res = await adminApi.get<{ success: boolean; data: { servers: VideoServerItem[] } }>(
      'admin/video-servers'
    )
    return res.data.servers
  },

  async getBrokenLinks(): Promise<BrokenLinkItem[]> {
    const res = await adminApi.get<{ success: boolean; data: { brokenLinks: BrokenLinkItem[] } }>(
      'admin/broken-links'
    )
    return res.data.brokenLinks
  },

  async getSettings() {
    const res = await adminApi.get<{ success: boolean; data: { settings: any } }>('admin/settings')
    return res.data.settings
  },

  async updateSettings(settings: any) {
    return adminApi.put('admin/settings', { settings })
  },
}
