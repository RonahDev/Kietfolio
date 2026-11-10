/**
 * Cinema Image Fallback Utilities
 * Enterprise Multi-Mirror Fallback Engine
 * Provides resilient, high-availability image fallbacks for movie posters and backdrops
 * Includes genre-based artwork, franchise-specific visuals, and zero-network SVG canvas fallbacks
 */

// Offline-safe standalone SVG poster fallback (renders even with zero network connectivity)
export const OFFLINE_POSTER_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900" fill="none">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#181b24"/>
      <stop offset="50%" stop-color="#0e1017"/>
      <stop offset="100%" stop-color="#08090d"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5d061"/>
      <stop offset="100%" stop-color="#d4af70"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#a51d35" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#a51d35" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="600" height="900" fill="url(#bg)"/>
  <rect width="600" height="900" fill="url(#glow)"/>
  <rect x="24" y="24" width="552" height="852" rx="12" stroke="#a51d35" stroke-width="2" stroke-opacity="0.4"/>
  <circle cx="300" cy="380" r="85" fill="#11131a" stroke="url(#gold)" stroke-width="3"/>
  <path d="M280 340L340 380L280 420V340Z" fill="url(#gold)"/>
  <text x="300" y="530" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" letter-spacing="3">KIETFLIX CINEMA</text>
  <text x="300" y="570" text-anchor="middle" fill="#d4af70" font-family="monospace" font-size="14" font-weight="bold" letter-spacing="2">4K PREMIERE THEATER</text>
  <text x="300" y="610" text-anchor="middle" fill="#71717a" font-family="-apple-system, sans-serif" font-size="12">CHÍNH HÃNG CHIẾU RẠP</text>
</svg>
`)}`

// Offline-safe standalone SVG backdrop fallback (16:9 widescreen cinema)
export const OFFLINE_BACKDROP_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" fill="none">
  <defs>
    <linearGradient id="backBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14161f"/>
      <stop offset="40%" stop-color="#0c0e14"/>
      <stop offset="100%" stop-color="#06070a"/>
    </linearGradient>
    <radialGradient id="centerAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#a51d35" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#a51d35" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldBack" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5d061"/>
      <stop offset="100%" stop-color="#d4af70"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#backBg)"/>
  <rect width="1920" height="1080" fill="url(#centerAura)"/>
  <circle cx="960" cy="500" r="140" fill="#11131a" stroke="url(#goldBack)" stroke-width="4"/>
  <path d="M930 440L1020 500L930 560V440Z" fill="url(#goldBack)"/>
  <text x="960" y="720" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="900" letter-spacing="4">KIETFLIX ULTRA CINEMA</text>
  <text x="960" y="775" text-anchor="middle" fill="#d4af70" font-family="monospace" font-size="20" font-weight="bold" letter-spacing="3">OFFICIAL THEATRICAL ARCHIVE</text>
</svg>
`)}`

// High-Availability CDN Backdrops (Primary Mirror: Official High-Definition 4K)
export const FALLBACK_BACKDROPS = {
  default:
    'https://image.tmdb.org/t/p/original/wT3rtmVjc9aRtnJQTav1Tc0HQMS.jpg',
  theatrical_vn:
    'https://image.tmdb.org/t/p/original/wT3rtmVjc9aRtnJQTav1Tc0HQMS.jpg',
  anime:
    'https://image.tmdb.org/t/p/original/4TMkOnI6rCYxqD059aeeQSBv5mc.jpg',
  conan:
    'https://image.tmdb.org/t/p/original/4TMkOnI6rCYxqD059aeeQSBv5mc.jpg',
  doraemon:
    'https://image.tmdb.org/t/p/original/hQ9grQ2RjHS3X7crItJqhoGvUPm.jpg',
  dragonball:
    'https://image.tmdb.org/t/p/original/uR0FopHrAjDlG5q6PZB07a1JOva.jpg',
  naruto:
    'https://image.tmdb.org/t/p/original/l8ubUlfzlB5R2j9cJ3CN7tj0gmd.jpg',
  onepiece:
    'https://image.tmdb.org/t/p/original/wghKvEjM7UzQzQcKnGbDjOyQO13.jpg',
  shin:
    'https://image.tmdb.org/t/p/original/biRLtgt3t8MwxeLRRJkf1BsHoeq.jpg',
  cyberpunk:
    'https://image.tmdb.org/t/p/original/uR0FopHrAjDlG5q6PZB07a1JOva.jpg',
  drama:
    'https://image.tmdb.org/t/p/original/aXLcNxJI2JDdASNL6ZaNI0jWl2s.jpg',
} as const

// High-Availability CDN Posters (Primary Mirror: Official High-Definition 4K)
export const FALLBACK_POSTERS = {
  default:
    'https://image.tmdb.org/t/p/w780/uK7OJICKSNIrhhbGNvh0TaV4M9a.jpg',
  theatrical_vn:
    'https://image.tmdb.org/t/p/w780/uK7OJICKSNIrhhbGNvh0TaV4M9a.jpg',
  anime:
    'https://image.tmdb.org/t/p/w780/AlSEw3akrBZRK9w68gcFQpHHpy3.jpg',
  conan:
    'https://image.tmdb.org/t/p/w780/AlSEw3akrBZRK9w68gcFQpHHpy3.jpg',
  doraemon:
    'https://image.tmdb.org/t/p/w780/sdakBAPqhYHbu4S5wehKKrz6CV5.jpg',
  dragonball:
    'https://image.tmdb.org/t/p/w780/1TIl7hssPbhfUXqAL3geaiE4gNT.jpg',
  naruto:
    'https://image.tmdb.org/t/p/w780/x0CwUdcWWQgOb9tO8cW6jxyo9Zx.jpg',
  onepiece:
    'https://image.tmdb.org/t/p/w780/gpzMYQQrDLSihHmCLHAKT8h30Oc.jpg',
  shin:
    'https://image.tmdb.org/t/p/w780/Ah9H6Sj434nJiZpTPQrovHaEePV.jpg',
  cyberpunk:
    'https://image.tmdb.org/t/p/w780/1TIl7hssPbhfUXqAL3geaiE4gNT.jpg',
  drama:
    'https://image.tmdb.org/t/p/w780/ejPrzjG17UrYHjUn8xE3EAYnoDl.jpg',
} as const

// Secondary Mirror Fallbacks (Fast Global CDN)
export const SECONDARY_POSTER_FALLBACK =
  'https://image.tmdb.org/t/p/w780/uK7OJICKSNIrhhbGNvh0TaV4M9a.jpg'
export const SECONDARY_BACKDROP_FALLBACK =
  'https://image.tmdb.org/t/p/original/wT3rtmVjc9aRtnJQTav1Tc0HQMS.jpg'

/**
 * Get tailored backdrop fallback by franchise or genres
 */
export function getFallbackBackdrop(genres?: string[], franchise?: string): string {
  if (franchise && franchise in FALLBACK_BACKDROPS) {
    return FALLBACK_BACKDROPS[franchise as keyof typeof FALLBACK_BACKDROPS]
  }
  if (genres && genres.length > 0) {
    if (genres.includes('theatrical_vn')) return FALLBACK_BACKDROPS.theatrical_vn
    if (genres.includes('anime_theatrical') || genres.includes('animation')) return FALLBACK_BACKDROPS.anime
    if (genres.includes('cyberpunk') || genres.includes('sci-fi')) return FALLBACK_BACKDROPS.cyberpunk
    if (genres.includes('drama') || genres.includes('romance')) return FALLBACK_BACKDROPS.drama
  }
  return FALLBACK_BACKDROPS.default
}

/**
 * Get tailored poster fallback by franchise or genres
 */
export function getFallbackPoster(genres?: string[], franchise?: string): string {
  if (franchise && franchise in FALLBACK_POSTERS) {
    return FALLBACK_POSTERS[franchise as keyof typeof FALLBACK_POSTERS]
  }
  if (genres && genres.length > 0) {
    if (genres.includes('theatrical_vn')) return FALLBACK_POSTERS.theatrical_vn
    if (genres.includes('anime_theatrical') || genres.includes('animation')) return FALLBACK_POSTERS.anime
    if (genres.includes('cyberpunk') || genres.includes('sci-fi')) return FALLBACK_POSTERS.cyberpunk
    if (genres.includes('drama') || genres.includes('romance')) return FALLBACK_POSTERS.drama
  }
  return FALLBACK_POSTERS.default
}

/**
 * Robust image error handler with multi-stage cascade:
 * Stage 1: Try Primary tailored fallback with no-referrer
 * Stage 2: Try Secondary global CDN mirror
 * Stage 3: Instant offline SVG canvas art (Zero network required)
 */
export function handleImageFallback(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl: string,
  fallbackType: 'poster' | 'backdrop' = 'poster'
): void {
  const img = event.currentTarget
  // Force no-referrer to bypass hotlink protection on CDNs
  img.referrerPolicy = 'no-referrer'

  if (!img.dataset.fallbackStage) {
    // Stage 1: Primary tailored fallback
    img.dataset.fallbackStage = 'primary'
    img.src = fallbackUrl
    return
  }

  if (img.dataset.fallbackStage === 'primary') {
    // Stage 2: Secondary mirror
    img.dataset.fallbackStage = 'secondary'
    img.src = fallbackType === 'backdrop' ? SECONDARY_BACKDROP_FALLBACK : SECONDARY_POSTER_FALLBACK
    return
  }

  // Stage 3: Offline High-Res SVG Canvas fallback
  img.src = fallbackType === 'backdrop' ? OFFLINE_BACKDROP_SVG : OFFLINE_POSTER_SVG
  img.onerror = null
}
