/**
 * Centralized Site Configuration & Application Constants
 * Production-ready enterprise configuration loaded dynamically from environment variables
 * with robust, type-safe fallbacks. Eliminates all hardcoding across client applications.
 */

const getEnvString = (key: string, fallback: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env[key] === 'string') {
    const val = import.meta.env[key].trim()
    if (val.length > 0) return val
  }
  return fallback
}

const getEnvNumber = (key: string, fallback: number): number => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    const parsed = Number(import.meta.env[key])
    if (!Number.isNaN(parsed) && parsed > 0) return parsed
  }
  return fallback
}

const getEnvStringArray = (key: string, fallback: string[]): string[] => {
  if (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env[key] === 'string') {
    const val = import.meta.env[key].trim()
    if (val.length > 0) {
      return val.split(',').map((s) => s.trim()).filter(Boolean)
    }
  }
  return fallback
}

export const SITE_CONFIG = {
  name: getEnvString('VITE_SITE_NAME', 'Mai Anh Kiệt'),
  title: getEnvString('VITE_SITE_TITLE', 'Kietfolio — Software Engineering & Systems Architecture'),
  version: getEnvString('VITE_SITE_VERSION', '2.5.0'),
  apiBaseUrl: getEnvString('VITE_API_URL', '/api'),
  author: {
    name: getEnvString('VITE_AUTHOR_NAME', 'Mai Anh Kiệt'),
    email: getEnvString('VITE_AUTHOR_EMAIL', 'kietteve22102005@gmail.com'),
    github: getEnvString('VITE_AUTHOR_GITHUB', 'https://github.com/RonahDev'),
    linkedin: getEnvString('VITE_AUTHOR_LINKEDIN', 'https://linkedin.com/in/maianhkiet'),
    stationCode: getEnvString('VITE_STATION_CODE', '63BDG02'),
    stationName: getEnvString('VITE_STATION_NAME', 'Hub Thủ Dầu Một'),
  },
  admin: {
    email: getEnvString('VITE_ADMIN_EMAIL', 'kietteve22102005@gmail.com'),
    additionalEmails: getEnvStringArray('VITE_ADMIN_ADDITIONAL_EMAILS', [
      'kiet.maianh@gmail.com',
      'admin@kietfolio.dev',
    ]),
    defaultPassword: getEnvString('VITE_ADMIN_PASSWORD', 'SecretAdminKey@2005'),
  },
  vip: {
    priceMonthly: getEnvNumber('VITE_VIP_PRICE_MONTHLY', 99000),
    priceLifetime: getEnvNumber('VITE_VIP_PRICE_LIFETIME', 499000),
    promoCodes: getEnvStringArray('VITE_VIP_PROMO_CODES', [
      'KIETVIP2025',
      'CYBERVIP',
      'FOUNDER',
      'VIP2025',
      'RONAHVIP',
      'FPT2025',
    ]),
  },
  storageKeys: {
    session: 'kietfolio_auth_active_session',
    usersDb: 'kietfolio_registered_users_db',
    jwtToken: 'kietfolio_auth_jwt_token',
    clientLogs: 'kietfolio_client_error_logs',
    guestbook: 'kietfolio_guestbook_entries',
    inbox: 'kietfolio_inbox_messages',
    language: 'kietfolio_lang_preference',
    theme: 'kietfolio_theme',
    introSeen: 'kietfolio_intro_seen',
    performanceQuality: 'kietfolio_perf_quality_mode',
    cinemaWatchlist: 'kietfolio_cinema_watchlist',
    cinemaCurtainSeen: 'kietfolio_cinema_curtain_seen',
  },
  cinema: {
    tmdbApiKey: getEnvString('VITE_TMDB_API_KEY', ''),
    tmdbBaseUrl: getEnvString('VITE_TMDB_BASE_URL', 'https://api.themoviedb.org/3'),
    tmdbImageBaseUrl: getEnvString('VITE_TMDB_IMAGE_BASE_URL', 'https://image.tmdb.org/t/p'),
    kkphimApiBaseUrl: getEnvString('VITE_KKPHIM_API_BASE_URL', 'https://phimapi.com'),
    kkphimImageBaseUrl: getEnvString('VITE_KKPHIM_IMAGE_BASE_URL', 'https://phimimg.com'),
  },
  timeouts: {
    apiDefaultMs: getEnvNumber('VITE_API_TIMEOUT_MS', 8000),
    toastDismissMs: 3000,
    clipboardFeedbackMs: 2500,
  },
  donation: {
    recipientName: getEnvString('VITE_PAYMENT_RECIPIENT_NAME', 'MAI ANH KIET'),
    momo: {
      phone: getEnvString('VITE_MOMO_PHONE', '0963463831'),
      name: getEnvString('VITE_PAYMENT_RECIPIENT_NAME', 'MAI ANH KIET'),
    },
    vietcombank: {
      accountNumber: getEnvString('VITE_VCB_ACCOUNT_NUMBER', '1034777451'),
      bankName: getEnvString('VITE_VCB_BANK_NAME', 'Vietcombank'),
      bankCode: getEnvString('VITE_VCB_BANK_CODE', 'vietcombank'),
      name: getEnvString('VITE_PAYMENT_RECIPIENT_NAME', 'MAI ANH KIET'),
    },
  },
} as const
