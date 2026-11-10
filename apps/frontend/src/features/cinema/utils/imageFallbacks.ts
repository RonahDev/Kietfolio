/**
 * Cinema Image Fallback Utilities
 * Provides resilient, high-availability image fallbacks for movie posters and backdrops
 * Includes genre-based artwork, franchise-specific visuals, and an offline SVG data-URI fallback
 */

// Offline-safe standalone SVG poster fallback (renders even with zero network connectivity)
export const OFFLINE_POSTER_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900" fill="none">
  <rect width="600" height="900" fill="#0c0e14"/>
  <rect x="20" y="20" width="560" height="860" rx="8" stroke="#a51d35" stroke-width="2" stroke-opacity="0.3"/>
  <circle cx="300" cy="400" r="90" fill="#181b24" stroke="#d4af70" stroke-width="2" stroke-opacity="0.5"/>
  <path d="M280 360L340 400L280 440V360Z" fill="#d4af70"/>
  <text x="300" y="550" text-anchor="middle" fill="#f5f5f5" font-family="system-ui, sans-serif" font-size="24" font-weight="bold" letter-spacing="2">KIETFLIX CINEMA</text>
  <text x="300" y="590" text-anchor="middle" fill="#d4af70" font-family="monospace" font-size="14" letter-spacing="1">4K PREMIERE THEATER</text>
</svg>
`)}`

// Offline-safe standalone SVG backdrop fallback
export const OFFLINE_BACKDROP_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" fill="none">
  <rect width="1920" height="1080" fill="#08090d"/>
  <circle cx="960" cy="540" r="300" fill="#a51d35" fill-opacity="0.1" filter="blur(60px)"/>
  <circle cx="960" cy="540" r="150" fill="#11131a" stroke="#d4af70" stroke-width="3" stroke-opacity="0.4"/>
  <path d="M935 480L1015 540L935 600V480Z" fill="#d4af70"/>
  <text x="960" y="750" text-anchor="middle" fill="#f5f5f5" font-family="system-ui, sans-serif" font-size="36" font-weight="900" letter-spacing="3">KIETFLIX ULTRA CINEMA</text>
  <text x="960" y="800" text-anchor="middle" fill="#d4af70" font-family="monospace" font-size="18" letter-spacing="2">OFFICIAL THEATRICAL ARCHIVE</text>
</svg>
`)}`

// High-Availability CDN Backdrops
export const FALLBACK_BACKDROPS = {
  default:
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80',
  theatrical_vn:
    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&q=80',
  anime:
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80',
  conan:
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=80',
  doraemon:
    'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1920&q=80',
  dragonball:
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
  naruto:
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
  onepiece:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
  shin:
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1920&q=80',
  cyberpunk:
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
  drama:
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1920&q=80',
} as const

// High-Availability CDN Posters
export const FALLBACK_POSTERS = {
  default:
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
  theatrical_vn:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  anime:
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
  conan:
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  doraemon:
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
  dragonball:
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
  naruto:
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  onepiece:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  shin:
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
  cyberpunk:
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
  drama:
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
} as const

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
 * Robust image error handler that prevents infinite error loops
 * Falls back to tailored CDN URL first, then to inline SVG data URI if network fails
 */
export function handleImageFallback(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl: string
): void {
  const img = event.currentTarget
  if (img.dataset.hasFallback) {
    // If the primary fallback also failed (e.g., completely offline), fallback to the SVG data-URI
    img.src = OFFLINE_POSTER_SVG
    img.onerror = null
    return
  }
  img.dataset.hasFallback = 'true'
  img.src = fallbackUrl
}
