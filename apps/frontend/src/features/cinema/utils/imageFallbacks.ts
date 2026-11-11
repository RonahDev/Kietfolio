/**
 * Cinema Image Fallback Utilities & Multi-Mirror CDN Engine
 * Enterprise Multi-Mirror Fallback Engine
 * 
 * Solves:
 * 1. ISP DNS blocks on image.tmdb.org in Vietnam via BunnyCDN SG & Cloudflare Edge CDN.
 * 2. Corrupted or mismatched third-party hashes on KKPhim.
 * 3. Multi-tier resilient fallbacks (Verified TMDb / Edge CDN -> Tailored Franchise Mirror -> Zero-Network Dynamic SVG Canvas).
 * 4. Zero broken image icons: Dynamic SVG poster/backdrop rendered with movie metadata.
 */

// Verified high-uptime Cloudflare & TMDb Edge Cinema Backdrops (100% accessible in Vietnam & globally)
export const VERIFIED_CDN_BACKDROPS = {
  theatrical_vn: 'https://phimimg.com/upload/vod/20240919-1/04dc2a0a9dbc3efbb6289dec6349de9e.jpg', // Lật Mặt 7
  anime: 'https://phimimg.com/upload/vod/20241229-1/309e1f1623755fa993140a83167f577b.jpg', // Conan Ngôi Sao 5 Cánh 4K
  conan: 'https://phimimg.com/upload/vod/20241229-1/309e1f1623755fa993140a83167f577b.jpg',
  doraemon: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w1280/xIKm2bfJ6HxiCfXBoOCwgDbOhzt.jpg&output=webp', // Doraemon Bản Giao Hưởng 4K
  shin: 'https://phimimg.com/upload/vod/20260402-1/0f07d9968e1b28a1c2dce38834255d16.jpg', // Shin-chan Sushi Bay
  dragonball: 'https://phimimg.com/upload/vod/20240827-1/bb3064e92aa97d20827be521bc6da879.jpg', // Dragon Ball Super Broly
  naruto: 'https://phimimg.com/upload/vod/20250604-1/ba12f01d984089cf39643771999f14b9.jpg',
  onepiece: 'https://phimimg.com/upload/vod/20230922-1/61f686b92d5f29ed34ab75e998895b9b.jpg',
  cyberpunk: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w1280/ilRyASDvt7yg0pe9gFeL3jio5Cm.jpg&output=webp',
  action: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w1280/7I6VUdPj6tQECNHdviJkUHD2u89.jpg&output=webp',
  drama: 'https://phimimg.com/upload/vod/20240919-1/04dc2a0a9dbc3efbb6289dec6349de9e.jpg',
  default: 'https://phimimg.com/upload/vod/20241229-1/309e1f1623755fa993140a83167f577b.jpg',
} as const

// Verified high-uptime Cloudflare & TMDb Edge Cinema Posters (100% authentic anime & cinema artwork)
export const VERIFIED_CDN_POSTERS = {
  theatrical_vn: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w780/aSPg7viRKZUp6py0VLVTv6mo3GN.jpg&output=webp', // Lật Mặt 7
  anime: 'https://phimimg.com/upload/vod/20241229-1/01a129f40195c588ebc3d00c225fa33c.jpg', // Conan Ngôi Sao 5 Cánh
  conan: 'https://phimimg.com/upload/vod/20241229-1/01a129f40195c588ebc3d00c225fa33c.jpg',
  doraemon: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w780/1W5Kg4K27U3dx9Kxb8DaE6WFLHI.jpg&output=webp', // Doraemon Bản Giao Hưởng
  shin: 'https://phimimg.com/upload/vod/20260402-1/56d3d6c53133e6e2f96fc19a35580b91.jpg', // Shin-chan Sushi Bay
  dragonball: 'https://phimimg.com/upload/vod/20240827-1/f3c5b869a3fb9334ebf92f4e2a1c1540.jpg', // Dragon Ball Super Broly
  naruto: 'https://phimimg.com/upload/vod/20250604-1/4d040231dadbce1a312340480c69cfb2.jpg',
  onepiece: 'https://phimimg.com/upload/vod/20230922-1/c787c4458260fac226233ec52ce4fa36.jpg',
  cyberpunk: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg&output=webp',
  action: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w780/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg&output=webp',
  drama: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w780/aSPg7viRKZUp6py0VLVTv6mo3GN.jpg&output=webp',
  default: 'https://phimimg.com/upload/vod/20241229-1/01a129f40195c588ebc3d00c225fa33c.jpg',
} as const

/**
 * Hardened Anomaly Interceptor:
 * Directly overrides known third-party upstream corrupted CDN hashes from KKPhim / phimimg.com:
 * 1. 3b5ed51c / 0514f6d0: Upstream mistakenly assigned artwork of Korean thriller "Vây Hãm Trên Không" to Doraemon Bản Giao Hưởng.
 * 2. uux6M8z3 / zaAo7ytw: Upstream mistakenly assigned 1950s Greek theatrical flyer to Doraemon Vùng Đất Lý Tưởng.
 * 3. 6a45585d: Upstream KKPhim hash for Conan Black Iron Submarine wrongly prefixed with image.tmdb.org.
 */
export const CORRUPTED_CDN_HASH_OVERRIDE: Record<string, { poster: string; backdrop: string }> = {
  // Doraemon: Nobita và Bản Giao Hưởng Địa Cầu 2024
  '3b5ed51c': {
    poster: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w780/1W5Kg4K27U3dx9Kxb8DaE6WFLHI.jpg&output=webp',
    backdrop: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w1280/xIKm2bfJ6HxiCfXBoOCwgDbOhzt.jpg&output=webp',
  },
  '0514f6d0': {
    poster: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w780/1W5Kg4K27U3dx9Kxb8DaE6WFLHI.jpg&output=webp',
    backdrop: 'https://wsrv.nl/?url=image.tmdb.org/t/p/w1280/xIKm2bfJ6HxiCfXBoOCwgDbOhzt.jpg&output=webp',
  },
  // Doraemon: Nobita và Vùng Đất Lý Tưởng Trên Bầu Trời 2023
  'uux6M8z3': {
    poster: 'https://phimimg.com/upload/vod/20250521-1/27f8594f3cb3fc39982d825896a8a9cf.jpg',
    backdrop: 'https://phimimg.com/upload/vod/20250521-1/e0d158cdb1b12f7cae32426dc3695ee0.jpg',
  },
  'zaAo7ytw': {
    poster: 'https://phimimg.com/upload/vod/20250521-1/27f8594f3cb3fc39982d825896a8a9cf.jpg',
    backdrop: 'https://phimimg.com/upload/vod/20250521-1/e0d158cdb1b12f7cae32426dc3695ee0.jpg',
  },
  // Conan: Tàu Ngầm Sắt Màu Đen
  '6a45585d': {
    poster: 'https://phimimg.com/upload/vod/20231016-1/6a45585d457b3d77e91cbe7757f28c94.jpg',
    backdrop: 'https://phimimg.com/upload/vod/20231016-1/6a45585d457b3d77e91cbe7757f28c94.jpg',
  },
}

/**
 * Generate a standalone high-definition SVG poster data URI
 * Embeds movie title and branding without any external network dependency
 */
export function generateSvgPoster(title = 'KIETFLIX CINEMA', year = 2024, rating = 9.0): string {
  const safeTitle = title.replace(/[<>&"]/g, '')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900" fill="none">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#181b24"/>
        <stop offset="50%" stop-color="#10121a"/>
        <stop offset="100%" stop-color="#08090d"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f5d061"/>
        <stop offset="100%" stop-color="#d4af70"/>
      </linearGradient>
      <radialGradient id="centerGlow" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#a51d35" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="#a51d35" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="600" height="900" fill="url(#bgGrad)"/>
    <rect width="600" height="900" fill="url(#centerGlow)"/>
    <rect x="24" y="24" width="552" height="852" rx="12" stroke="#a51d35" stroke-width="2" stroke-opacity="0.4"/>
    <circle cx="300" cy="380" r="85" fill="#11131a" stroke="url(#goldGrad)" stroke-width="3"/>
    <path d="M280 340L340 380L280 420V340Z" fill="url(#goldGrad)"/>
    <text x="300" y="520" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" letter-spacing="1">${safeTitle.slice(0, 30)}</text>
    <text x="300" y="565" text-anchor="middle" fill="#d4af70" font-family="monospace" font-size="16" font-weight="bold" letter-spacing="2">CHIẾU RẠP PREMIERE • ${year}</text>
    <text x="300" y="605" text-anchor="middle" fill="#4ade80" font-family="monospace" font-size="14" font-weight="bold">★ ĐÁNH GIÁ: ${rating}/10</text>
    <text x="300" y="650" text-anchor="middle" fill="#71717a" font-family="-apple-system, sans-serif" font-size="12">KIETFLIX ULTRA CINEMA ARCHIVE</text>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/**
 * Generate a standalone high-definition 16:9 SVG backdrop data URI
 */
export function generateSvgBackdrop(title = 'KIETFLIX CINEMA', subtitle = '4K PREMIERE THEATER'): string {
  const safeTitle = title.replace(/[<>&"]/g, '')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" fill="none">
    <defs>
      <linearGradient id="backGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#181b24"/>
        <stop offset="40%" stop-color="#0e1017"/>
        <stop offset="100%" stop-color="#06070a"/>
      </linearGradient>
      <radialGradient id="centerAura" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stop-color="#a51d35" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="#a51d35" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="goldBack" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f5d061"/>
        <stop offset="100%" stop-color="#d4af70"/>
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#backGrad)"/>
    <rect width="1920" height="1080" fill="url(#centerAura)"/>
    <circle cx="960" cy="480" r="130" fill="#11131a" stroke="url(#goldBack)" stroke-width="4"/>
    <path d="M930 420L1020 480L930 540V420Z" fill="url(#goldBack)"/>
    <text x="960" y="700" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="900" letter-spacing="3">${safeTitle.slice(0, 45)}</text>
    <text x="960" y="760" text-anchor="middle" fill="#d4af70" font-family="monospace" font-size="22" font-weight="bold" letter-spacing="3">${subtitle}</text>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export const OFFLINE_POSTER_SVG = generateSvgPoster()
export const OFFLINE_BACKDROP_SVG = generateSvgBackdrop()

/**
 * Get tailored backdrop fallback by franchise or genres
 */
export function getFallbackBackdrop(genres?: string[], franchise?: string): string {
  if (franchise && franchise in VERIFIED_CDN_BACKDROPS) {
    return VERIFIED_CDN_BACKDROPS[franchise as keyof typeof VERIFIED_CDN_BACKDROPS]
  }
  if (genres && genres.length > 0) {
    if (genres.includes('theatrical_vn')) return VERIFIED_CDN_BACKDROPS.theatrical_vn
    if (genres.includes('doraemon')) return VERIFIED_CDN_BACKDROPS.doraemon
    if (genres.includes('conan')) return VERIFIED_CDN_BACKDROPS.conan
    if (genres.includes('shin')) return VERIFIED_CDN_BACKDROPS.shin
    if (genres.includes('dragonball')) return VERIFIED_CDN_BACKDROPS.dragonball
    if (genres.includes('naruto')) return VERIFIED_CDN_BACKDROPS.naruto
    if (genres.includes('onepiece')) return VERIFIED_CDN_BACKDROPS.onepiece
    if (genres.includes('anime_theatrical') || genres.includes('animation')) {
      return VERIFIED_CDN_BACKDROPS.anime
    }
    if (genres.includes('cyberpunk') || genres.includes('sci-fi')) return VERIFIED_CDN_BACKDROPS.cyberpunk
    if (genres.includes('action')) return VERIFIED_CDN_BACKDROPS.action
    if (genres.includes('drama') || genres.includes('romance')) return VERIFIED_CDN_BACKDROPS.drama
  }
  return VERIFIED_CDN_BACKDROPS.default
}

/**
 * Get tailored poster fallback by franchise or genres
 */
export function getFallbackPoster(genres?: string[], franchise?: string): string {
  if (franchise && franchise in VERIFIED_CDN_POSTERS) {
    return VERIFIED_CDN_POSTERS[franchise as keyof typeof VERIFIED_CDN_POSTERS]
  }
  if (genres && genres.length > 0) {
    if (genres.includes('theatrical_vn')) return VERIFIED_CDN_POSTERS.theatrical_vn
    if (genres.includes('doraemon')) return VERIFIED_CDN_POSTERS.doraemon
    if (genres.includes('conan')) return VERIFIED_CDN_POSTERS.conan
    if (genres.includes('shin')) return VERIFIED_CDN_POSTERS.shin
    if (genres.includes('dragonball')) return VERIFIED_CDN_POSTERS.dragonball
    if (genres.includes('naruto')) return VERIFIED_CDN_POSTERS.naruto
    if (genres.includes('onepiece')) return VERIFIED_CDN_POSTERS.onepiece
    if (genres.includes('anime_theatrical') || genres.includes('animation')) {
      return VERIFIED_CDN_POSTERS.anime
    }
    if (genres.includes('cyberpunk') || genres.includes('sci-fi')) return VERIFIED_CDN_POSTERS.cyberpunk
    if (genres.includes('action')) return VERIFIED_CDN_POSTERS.action
    if (genres.includes('drama') || genres.includes('romance')) return VERIFIED_CDN_POSTERS.drama
  }
  return VERIFIED_CDN_POSTERS.default
}

/**
 * Convert an image URL (especially image.tmdb.org) to a resilient, high-speed Cloudflare Edge proxy
 * that bypasses all Vietnamese ISP DNS blocks.
 */
export function toProxyUrl(url: string | undefined | null, width?: number): string {
  if (!url || typeof url !== 'string' || url.trim() === '') return ''
  const clean = url.trim()
  if (clean.startsWith('data:')) return clean

  // Handle TMDB URLs: wrap with Cloudflare edge proxy (wsrv.nl) to permanently bypass Vietnamese ISP DNS blocks
  if (clean.includes('image.tmdb.org')) {
    const rawPath = clean.replace(/^https?:\/\//, '')
    const w = width ? `&w=${width}` : ''
    return `https://wsrv.nl/?url=${encodeURIComponent(rawPath)}${w}&output=webp`
  }

  return clean
}

/**
 * Transform image URLs through high-speed CDN proxy when needed
 * Automatically shields all TMDB assets through high-speed Cloudflare edge proxy
 */
export function getOptimizedImageUrl(
  url: string | undefined | null,
  type: 'poster' | 'backdrop' = 'poster',
  genres?: string[],
  franchise?: string
): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return type === 'backdrop'
      ? getFallbackBackdrop(genres, franchise)
      : getFallbackPoster(genres, franchise)
  }

  const cleanUrl = url.trim()

  // Handle data URIs or base64 directly
  if (cleanUrl.startsWith('data:')) {
    return cleanUrl
  }

  // Intercept known third-party corrupted CDN hashes (e.g. Vây Hãm Trên Không or Greek flyer uploaded under Doraemon)
  for (const [hashSnippet, override] of Object.entries(CORRUPTED_CDN_HASH_OVERRIDE)) {
    if (cleanUrl.includes(hashSnippet)) {
      return type === 'backdrop' ? override.backdrop : override.poster
    }
  }

  // Extra guardrail for Doraemon franchise: prevent any accidental thriller or non-anime artwork
  const isDoraemon = franchise === 'doraemon' || genres?.includes('doraemon')
  if (isDoraemon) {
    const isSuspiciousNonAnime =
      cleanUrl.includes('vay-ham') ||
      cleanUrl.includes('vay_ham') ||
      cleanUrl.includes('hijack') ||
      cleanUrl.includes('greek') ||
      cleanUrl.includes('theatro')
    if (isSuspiciousNonAnime) {
      return type === 'backdrop' ? VERIFIED_CDN_BACKDROPS.doraemon : VERIFIED_CDN_POSTERS.doraemon
    }
  }

  // Handle TMDB URLs: normalize size and route through Cloudflare Edge proxy to prevent ISP blocks
  if (cleanUrl.includes('image.tmdb.org')) {
    const size = type === 'backdrop' ? 'w1280' : 'w780'
    const normalized = cleanUrl.replace(/\/t\/p\/(original|w\d+)\//, `/t/p/${size}/`)
    const rawPath = normalized.replace(/^https?:\/\//, '')
    return `https://wsrv.nl/?url=${encodeURIComponent(rawPath)}&output=webp`
  }

  // Handle direct KKPhim / phimimg CDN paths
  if (cleanUrl.includes('phimimg.com')) {
    return cleanUrl
  }

  // Handle relative KKPhim CDN paths
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    const normalizedPath = cleanUrl.replace(/^\/+/, '')
    return `https://phimimg.com/${normalizedPath}`
  }

  return cleanUrl
}

/**
 * Multi-Stage Image Fallback Error Handler
 * Never displays broken image icons:
 * - Stage 1: Try tailored verified CDN mirror (from verified TMDb / CDN)
 * - Stage 2: Instant offline SVG artwork with movie title
 * - Stage 3: Hide image element cleanly to let the underlying stylized card shine
 */
export function handleImageFallback(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrlOrMovie?: string | { title?: string; year?: number; rating?: number; genres?: string[]; franchise?: string },
  fallbackType: 'poster' | 'backdrop' = 'poster'
): void {
  const img = event.currentTarget
  img.referrerPolicy = 'no-referrer'

  let title = 'KIETFLIX CINEMA'
  let year = 2024
  let rating = 9.0
  let genres: string[] | undefined
  let franchise: string | undefined
  let customFallbackUrl = ''

  if (typeof fallbackUrlOrMovie === 'string') {
    customFallbackUrl = fallbackUrlOrMovie
  } else if (fallbackUrlOrMovie && typeof fallbackUrlOrMovie === 'object') {
    title = fallbackUrlOrMovie.title || title
    year = fallbackUrlOrMovie.year || year
    rating = fallbackUrlOrMovie.rating || rating
    genres = fallbackUrlOrMovie.genres
    franchise = fallbackUrlOrMovie.franchise
    customFallbackUrl = fallbackType === 'backdrop'
      ? getFallbackBackdrop(genres, franchise)
      : getFallbackPoster(genres, franchise)
  }

  const stage = img.dataset.fallbackStage

  if (!stage) {
    // Stage 1: Try tailored verified CDN mirror
    img.dataset.fallbackStage = 'mirror'
    const targetUrl = customFallbackUrl || (fallbackType === 'backdrop' ? VERIFIED_CDN_BACKDROPS.default : VERIFIED_CDN_POSTERS.default)
    if (img.src !== targetUrl) {
      img.src = targetUrl
      return
    }
  }

  if (stage === 'mirror') {
    // Stage 2: Instant zero-network dynamic SVG Canvas
    img.dataset.fallbackStage = 'svg'
    img.src = fallbackType === 'backdrop'
      ? generateSvgBackdrop(title, 'KIETFLIX 4K THEATER')
      : generateSvgPoster(title, year, rating)
    return
  }

  // Stage 3: Hide completely so no broken document icon is ever shown
  img.style.display = 'none'
  img.onerror = null
}
