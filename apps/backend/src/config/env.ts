import dotenv from 'dotenv'

dotenv.config()

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jwt: {
    secret: process.env.JWT_SECRET || 'kietfolio-secure-super-jwt-secret-key-2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'kietfolio_db',
    user: process.env.DB_USER || 'kietfolio_user',
    password: process.env.DB_PASSWORD || 'kietfolio_secure_password_2026',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  },
  databaseUrl:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER || 'kietfolio_user'}:${process.env.DB_PASSWORD || 'kietfolio_secure_password_2026'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'kietfolio_db'}?schema=public`,
  session: {
    cookieName: process.env.SESSION_COOKIE_NAME || '__Host-kietfolio_admin_session',
    secret: process.env.SESSION_SECRET || 'kietfolio-admin-session-ultra-secret-2026',
    idleTimeoutMs: 60 * 60 * 1000, // 60 minutes
    absoluteTimeoutMs: 24 * 60 * 60 * 1000, // 24 hours
  },
  admin: {
    email: (process.env.ADMIN_EMAIL || 'kietteve22102005@gmail.com').toLowerCase(),
    additionalEmails: (process.env.ADMIN_ADDITIONAL_EMAILS || 'kiet.maianh@gmail.com')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
  vnpay: {
    tmnCode: process.env.VNP_TMN_CODE || 'CGXZLS0Z',
    hashSecret: process.env.VNP_HASH_SECRET || 'XNBCJFAKAZQSGTARRLGCHVZWCIOIGSHN',
    url: process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    returnUrl: process.env.VNP_RETURN_URL || 'http://localhost:5173',
  },
  cinema: {
    tmdbApiKey: process.env.TMDB_API_KEY || '',
    tmdbBaseUrl: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
    tmdbImageBaseUrl: process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p',
    kkphimApiBaseUrl: process.env.KKPHIM_API_BASE_URL || 'https://phimapi.com',
    syncIntervalMinutes: parseInt(process.env.MOVIE_SYNC_INTERVAL_MINUTES || '60', 10),
    autoSyncEnabled: process.env.MOVIE_AUTO_SYNC_ENABLED !== 'false',
  },
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
  },
} as const

