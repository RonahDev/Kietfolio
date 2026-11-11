export interface AdminUser {
  id: string
  email: string
  displayName?: string
  photoUrl?: string
  role: 'super_admin' | 'admin' | 'content_manager' | 'moderator' | 'analyst' | string
  status?: 'active' | 'suspended' | 'locked' | string
  permissions: string[]
}

export interface AdminSessionItem {
  id: string
  deviceName: string
  ipAddress: string
  userAgent: string
  createdAt: string
  lastActivityAt: string
  expiresAt: string
  isCurrent?: boolean
  device?: string
  browser?: string
  os?: string
  lastActiveAt?: string
}

export interface KpiMetricCardData {
  title: string
  value: string | number
  changePercent: number
  changePeriod: string
  isPositive: boolean
  sparklineData: number[]
  tooltip: string
}

export interface DashboardMetricsResponse {
  content: {
    totalMovies: number
    totalTvSeries: number
    totalEpisodes: number
    totalGenres: number
    totalCategories: number
  }
  users: {
    totalUsers: number
    todayUsers: number
    activeSessions: number
  }
  traffic: {
    todayVisits: number
    uniqueVisitors: number
    pageViews: number
    movieViews: number
    growthPercentage: number
  }
  revenue: {
    totalRevenue: number
    todayRevenue: number
    completedTransactions: number
    currency: string
    growthPercentage: number
  }
  recentActivities: Array<{
    id: string
    actorId?: string
    actorRole?: string
    action: string
    entityType: string
    entityId?: string
    createdAt: string
    actor?: {
      displayName?: string
      email: string
      photoUrl?: string
    }
  }>
}

export interface AdminMovieItem {
  id: string
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
  status: 'draft' | 'published' | 'hidden' | 'scheduled'
  isTheatrical: boolean
  isFeatured: boolean
  viewCount: number
  episodeCount?: number
  commentCount?: number
  genres: Array<{ id: string; nameVi: string }>
  categories: Array<{ id: string; nameVi: string }>
  createdAt: string
  updatedAt: string
}

export interface AdminUserItem {
  id: string
  email: string
  displayName?: string
  photoUrl?: string
  role: string
  status: 'active' | 'suspended' | 'pending'
  provider: string
  createdAt: string
  watchCount: number
  commentCount: number
  transactionCount: number
  activeSessionCount: number
}

export interface VideoServerItem {
  id: string
  name: string
  serverName?: string
  provider: string
  baseUrl: string
  baseStreamUrl?: string
  location?: string
  status: 'online' | 'degraded' | 'offline'
  latencyMs: number
  responseTimeMs?: number
  loadPercent: number
  lastCheckedAt?: string
}

export interface BrokenLinkItem {
  id: string
  targetName?: string
  movieId?: string
  movieTitle?: string
  streamUrl?: string
  issue?: string
  errorCode?: number | string
  errorMessage?: string
  severity?: 'high' | 'medium' | 'low'
  detectedAt?: string
  lastCheckedAt?: string
}
