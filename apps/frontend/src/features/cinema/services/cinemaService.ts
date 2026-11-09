import { SITE_CONFIG } from '@/config'
import type { MovieItem } from '../types/cinema'
import { CINEMA_MOVIES } from '../data/moviesData'

// TMDb Response Data Contracts
interface TMDbMovieDto {
  id: number
  title: string
  original_title?: string
  overview?: string
  backdrop_path?: string | null
  poster_path?: string | null
  release_date?: string
  vote_average: number
  genre_ids?: number[]
}

interface TMDbVideoDto {
  key: string
  site: string
  type: string
}

// KKPhim Response Data Contracts
interface KKPhimItemDto {
  _id?: string
  name: string
  slug: string
  origin_name?: string
  poster_url: string
  thumb_url: string
  year?: number
}

interface KKPhimEpisodeServerDto {
  server_name: string
  server_data: Array<{
    name: string
    slug: string
    filename?: string
    link_embed?: string
    link_m3u8?: string
  }>
}

interface KKPhimDetailDto {
  status: boolean
  msg?: string
  movie: {
    _id: string
    name: string
    slug: string
    origin_name: string
    content: string
    type: string
    status: string
    thumb_url: string
    poster_url: string
    time: string
    episode_current: string
    episode_total: string
    quality: string
    lang: string
    year: number
    actor?: string[]
    director?: string[]
    category?: Array<{ id: string; name: string; slug: string }>
    country?: Array<{ id: string; name: string; slug: string }>
  }
  episodes?: KKPhimEpisodeServerDto[]
}

const TMDB_GENRES_MAP: Record<number, string> = {
  28: 'action',
  12: 'adventure',
  16: 'cyberpunk',
  35: 'comedy',
  80: 'action',
  99: 'logistics',
  18: 'drama',
  10751: 'adventure',
  14: 'fantasy',
  36: 'history',
  27: 'horror',
  10402: 'music',
  9648: 'mystery',
  10749: 'romance',
  878: 'cyberpunk',
  10770: 'tv',
  53: 'thriller',
  10752: 'war',
  37: 'western',
}

// Sample 4K Showcase HLS Stream for International Blockbusters
const SHOWCASE_HLS_STREAM =
  'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'

/**
 * Fetch Trending Blockbusters from TMDb API
 * Retrieves 4K backdrops, posters, ratings, and Vietnamese metadata
 */
export async function fetchTMDbTrendingMovies(): Promise<MovieItem[]> {
  const apiKey = SITE_CONFIG.cinema.tmdbApiKey
  if (!apiKey || apiKey.trim().length === 0) {
    // If TMDb API key not configured, return curated blockbuster subset
    return CINEMA_MOVIES.filter((m) => m.isTrending || m.isFeaturedHero)
  }

  try {
    const url = `${SITE_CONFIG.cinema.tmdbBaseUrl}/trending/movie/week?api_key=${apiKey}&language=vi-VN`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`TMDb API error: ${res.statusText}`)
    }

    const data: { results: TMDbMovieDto[] } = await res.json()
    if (!data.results || data.results.length === 0) {
      return CINEMA_MOVIES.filter((m) => m.isTrending)
    }

    return data.results.slice(0, 10).map((m, index) => {
      const year = m.release_date ? new Date(m.release_date).getFullYear() : 2024
      const rating = Number(m.vote_average.toFixed(1))
      const matchPercentage = Math.min(99, Math.max(80, Math.round(rating * 10)))
      const genres = (m.genre_ids || [])
        .map((id) => TMDB_GENRES_MAP[id] || 'action')
        .slice(0, 3)

      const backdropUrl = m.backdrop_path
        ? `${SITE_CONFIG.cinema.tmdbImageBaseUrl}/original${m.backdrop_path}`
        : 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=2400&q=95'

      const posterUrl = m.poster_path
        ? `${SITE_CONFIG.cinema.tmdbImageBaseUrl}/w780${m.poster_path}`
        : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=85'

      return {
        id: `tmdb-${m.id}`,
        tmdbId: m.id,
        title: m.title || m.original_title || 'Tác Phẩm Điện Ảnh',
        originTitle: m.original_title,
        tagline: 'Độc quyền trình chiếu tại CinemaStream 4K Theater',
        synopsis: m.overview && m.overview.trim().length > 0
          ? m.overview
          : 'Tác phẩm điện ảnh bom tấn được phục chế chuẩn 4K HDR Atmos.',
        backdropUrl,
        posterUrl,
        trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(m.title + ' trailer')}`,
        videoStreamUrl: SHOWCASE_HLS_STREAM,
        year,
        rating,
        matchPercentage,
        maturityRating: rating >= 8.0 ? 'R' : 'PG-13',
        duration: '2g 28p',
        quality: '4K ULTRA HD',
        audio: 'DOLBY ATMOS',
        genres: genres.length > 0 ? genres : ['action', 'cyberpunk'],
        director: 'TMDb International Studios',
        cast: [
          { name: 'Diễn viên quốc tế', role: 'Nhân vật chính' },
          { name: 'Hollywood Ensemble', role: 'Tuyến nhân vật phụ' },
        ],
        isTrending: true,
        isFeaturedHero: index === 0,
        streamSource: 'hls',
      }
    })
  } catch (err) {
    console.warn('[CinemaService]: TMDb fetch failed, using curated showcase:', err)
    return CINEMA_MOVIES.filter((m) => m.isTrending || m.isFeaturedHero)
  }
}

/**
 * Fetch Free Vietnamese & Asian Movies from KKPhim API (No API Key Required)
 */
export async function fetchKKPhimVietnameseMovies(): Promise<MovieItem[]> {
  try {
    const url = `${SITE_CONFIG.cinema.kkphimApiBaseUrl}/danh-sach/phim-moi-cap-nhat?page=1`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`KKPhim API returned status ${res.status}`)
    }

    const data: { status: boolean; items: KKPhimItemDto[] } = await res.json()
    if (!data.items || data.items.length === 0) {
      return CINEMA_MOVIES.filter((m) => m.isVietnamese)
    }

    return data.items.slice(0, 12).map((item) => {
      const posterUrl = item.poster_url?.startsWith('http')
        ? item.poster_url
        : `${SITE_CONFIG.cinema.kkphimImageBaseUrl}/${item.poster_url}`

      const backdropUrl = item.thumb_url?.startsWith('http')
        ? item.thumb_url
        : `${SITE_CONFIG.cinema.kkphimImageBaseUrl}/${item.thumb_url}`

      return {
        id: `kk-${item.slug}`,
        slug: item.slug,
        title: item.name,
        originTitle: item.origin_name || item.name,
        tagline: 'Phát trực tiếp chuẩn HLS qua KKPhim API',
        synopsis: `Phim ${item.name} (${item.origin_name || item.year}). Thưởng thức với chất lượng cao Full HD và sub Việt trực tiếp trên hệ sinh thái Kietfolio.`,
        backdropUrl: backdropUrl || posterUrl,
        posterUrl,
        trailerUrl: '',
        videoStreamUrl: '', // Loaded dynamically upon click
        year: item.year || 2024,
        rating: 8.8,
        matchPercentage: 94,
        maturityRating: 'PG-13',
        duration: 'Tập mới',
        quality: '1080P FULL HD',
        audio: 'STEREO',
        genres: ['action', 'drama'],
        director: 'Đang cập nhật',
        cast: [{ name: 'Diễn viên chính', role: 'Diễn xuất' }],
        isVietnamese: true,
        streamSource: 'kkphim',
      }
    })
  } catch (err) {
    console.warn('[CinemaService]: KKPhim fetch failed, using fallback:', err)
    return CINEMA_MOVIES.filter((m) => m.isVietnamese)
  }
}

/**
 * Fetch Full Stream Details & M3U8 link for a specific movie from KKPhim
 * Called on-demand when the user clicks "Xem Ngay" on a Vietnamese/KKPhim title
 */
export async function fetchKKPhimStreamDetails(
  slug: string
): Promise<{ videoStreamUrl: string; episodes: Array<{ name: string; slug: string; linkM3u8: string }> } | null> {
  try {
    const url = `${SITE_CONFIG.cinema.kkphimApiBaseUrl}/phim/${slug}`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Failed to load KKPhim details for ${slug}`)
    }

    const data: KKPhimDetailDto = await res.json()
    if (!data.status || !data.episodes || data.episodes.length === 0) {
      return null
    }

    const firstServer = data.episodes[0]
    const serverData = firstServer?.server_data || []

    const episodes = serverData
      .filter((ep) => ep.link_m3u8 && ep.link_m3u8.trim().length > 0)
      .map((ep) => ({
        name: ep.name,
        slug: ep.slug,
        linkM3u8: ep.link_m3u8 || '',
      }))

    if (episodes.length === 0) return null

    return {
      videoStreamUrl: episodes[0].linkM3u8,
      episodes,
    }
  } catch (err) {
    console.error('[CinemaService]: Error fetching KKPhim stream:', err)
    return null
  }
}

/**
 * Fetch TMDb Video Trailer Key
 */
export async function fetchTMDbTrailerKey(tmdbId: number): Promise<string | null> {
  const apiKey = SITE_CONFIG.cinema.tmdbApiKey
  if (!apiKey) return null

  try {
    const url = `${SITE_CONFIG.cinema.tmdbBaseUrl}/movie/${tmdbId}/videos?api_key=${apiKey}&language=vi-VN`
    let res = await fetch(url)
    let data: { results: TMDbVideoDto[] } = await res.json()

    // If no Vietnamese trailer found, fallback to English trailer
    if (!data.results || data.results.length === 0) {
      const enUrl = `${SITE_CONFIG.cinema.tmdbBaseUrl}/movie/${tmdbId}/videos?api_key=${apiKey}&language=en-US`
      res = await fetch(enUrl)
      data = await res.json()
    }

    const trailer = data.results?.find(
      (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    )
    return trailer ? trailer.key : null
  } catch {
    return null
  }
}
