import type { CinemaGenreGroup } from '../types/cinema'

/**
 * Cinema Genre Management & Intelligent Mapping Utilities
 * Provides comprehensive translation, normalization, and smart genre labels
 */

export interface GenreMeta {
  id: string
  labelVi: string
  labelEn: string
  isMeta?: boolean // e.g. theatrical_vn, anime_theatrical (used for classification, not content genre)
}

/**
 * Master Registry of all Cinema Genres in the Movie Hub
 */
export const GENRE_REGISTRY: Record<string, GenreMeta> = {
  // Content Genres
  action: { id: 'action', labelVi: 'Hành Động & Kịch Tính', labelEn: 'Action & Thriller' },
  romance: { id: 'romance', labelVi: 'Tình Cảm & Lãng Mạn', labelEn: 'Romance' },
  drama: { id: 'drama', labelVi: 'Tâm Lý & Chính Kịch', labelEn: 'Drama' },
  comedy: { id: 'comedy', labelVi: 'Hài Hước & Vui Nhộn', labelEn: 'Comedy' },
  horror: { id: 'horror', labelVi: 'Kinh Dị & Rùng Rợn', labelEn: 'Horror' },
  animation: { id: 'animation', labelVi: 'Hoạt Hình & Anime', labelEn: 'Animation' },
  adventure: { id: 'adventure', labelVi: 'Phiêu Lưu & Kỳ Ảo', labelEn: 'Adventure' },
  family: { id: 'family', labelVi: 'Gia Đình & Tuổi Trẻ', labelEn: 'Family' },
  mystery: { id: 'mystery', labelVi: 'Trinh Thám & Bí Ẩn', labelEn: 'Mystery' },
  'sci-fi': { id: 'sci-fi', labelVi: 'Khoa Học Viễn Tưởng', labelEn: 'Sci-Fi' },
  history: { id: 'history', labelVi: 'Lịch Sử & Cổ Trang', labelEn: 'History' },
  music: { id: 'music', labelVi: 'Âm Nhạc', labelEn: 'Music' },
  cyberpunk: { id: 'cyberpunk', labelVi: 'Công Nghệ & AI Cyberpunk', labelEn: 'Cyberpunk & Tech' },
  logistics: { id: 'logistics', labelVi: 'Kỹ Thuật Hệ Thống & Logistics', labelEn: 'Logistics Doc' },

  // Theatrical & Collection Categories
  theatrical_vn: { id: 'theatrical_vn', labelVi: 'Phim Chiếu Rạp Việt Nam', labelEn: 'VN Theaters', isMeta: true },
  anime_theatrical: { id: 'anime_theatrical', labelVi: 'Anime Chiếu Rạp Bản Quyền', labelEn: 'Theatrical Anime', isMeta: true },

  // Major Anime Franchises
  conan: { id: 'conan', labelVi: 'Thám Tử Conan', labelEn: 'Detective Conan', isMeta: true },
  doraemon: { id: 'doraemon', labelVi: 'Doraemon Movie', labelEn: 'Doraemon', isMeta: true },
  shin: { id: 'shin', labelVi: 'Cậu Bé Bút Chì Shin', labelEn: 'Shin-chan', isMeta: true },
  dragonball: { id: 'dragonball', labelVi: 'Dragon Ball Movie', labelEn: 'Dragon Ball', isMeta: true },
  naruto: { id: 'naruto', labelVi: 'Naruto & Boruto', labelEn: 'Naruto', isMeta: true },
  onepiece: { id: 'onepiece', labelVi: 'One Piece: Vua Hải Tặc', labelEn: 'One Piece', isMeta: true },
}

/**
 * Structured Genre Groups for Navbar, Drawer, and Filtering Navigation
 * Arranges flat genres into clear, professional, user-friendly categories ("các mục")
 */
export const CINEMA_GENRE_GROUPS: CinemaGenreGroup[] = [
  {
    id: 'collections',
    labelVi: 'Bộ Sưu Tập Chiếu Rạp',
    labelEn: 'Theatrical Collections',
    icon: 'Sparkles',
    genres: [
      { id: 'all', labelVi: 'Tất cả thể loại', labelEn: 'All Genres', groupId: 'collections' },
      { id: 'theatrical_vn', labelVi: 'Phim Chiếu Rạp Việt Nam', labelEn: 'VN Theaters', groupId: 'collections', badge: 'HOT' },
      { id: 'anime_theatrical', labelVi: 'Anime Chiếu Rạp Bản Quyền', labelEn: 'Theatrical Anime', groupId: 'collections', badge: '4K' },
    ],
  },
  {
    id: 'cinema_genres',
    labelVi: 'Thể Loại Điện Ảnh Phổ Biến',
    labelEn: 'Cinema Genres',
    icon: 'Film',
    genres: [
      { id: 'action', labelVi: 'Hành Động & Kịch Tính', labelEn: 'Action & Thriller', groupId: 'cinema_genres' },
      { id: 'romance', labelVi: 'Tình Cảm & Lãng Mạn', labelEn: 'Romance', groupId: 'cinema_genres' },
      { id: 'comedy', labelVi: 'Hài Hước & Vui Nhộn', labelEn: 'Comedy', groupId: 'cinema_genres' },
      { id: 'drama', labelVi: 'Tâm Lý & Chính Kịch', labelEn: 'Drama', groupId: 'cinema_genres' },
      { id: 'horror', labelVi: 'Kinh Dị & Rùng Rợn', labelEn: 'Horror', groupId: 'cinema_genres' },
      { id: 'family', labelVi: 'Gia Đình & Tuổi Trẻ', labelEn: 'Family', groupId: 'cinema_genres' },
      { id: 'animation', labelVi: 'Hoạt Hình & Anime', labelEn: 'Animation', groupId: 'cinema_genres' },
      { id: 'adventure', labelVi: 'Phiêu Lưu & Kỳ Ảo', labelEn: 'Adventure', groupId: 'cinema_genres' },
      { id: 'mystery', labelVi: 'Trinh Thám & Bí Ẩn', labelEn: 'Mystery & Detective', groupId: 'cinema_genres' },
      { id: 'sci-fi', labelVi: 'Khoa Học Viễn Tưởng', labelEn: 'Sci-Fi', groupId: 'cinema_genres' },
      { id: 'history', labelVi: 'Lịch Sử & Cổ Trang', labelEn: 'History & Epic', groupId: 'cinema_genres' },
    ],
  },
  {
    id: 'anime_franchises',
    labelVi: 'Vũ Trụ Anime Chiếu Rạp',
    labelEn: 'Theatrical Anime Franchises',
    icon: 'Clapperboard',
    genres: [
      { id: 'doraemon', labelVi: 'Doraemon Movie', labelEn: 'Doraemon', groupId: 'anime_franchises' },
      { id: 'conan', labelVi: 'Thám Tử Conan', labelEn: 'Detective Conan', groupId: 'anime_franchises' },
      { id: 'shin', labelVi: 'Cậu Bé Bút Chì Shin', labelEn: 'Shin-chan', groupId: 'anime_franchises' },
      { id: 'dragonball', labelVi: 'Dragon Ball Movie', labelEn: 'Dragon Ball', groupId: 'anime_franchises' },
      { id: 'naruto', labelVi: 'Naruto & Boruto', labelEn: 'Naruto & Boruto', groupId: 'anime_franchises' },
      { id: 'onepiece', labelVi: 'One Piece: Vua Hải Tặc', labelEn: 'One Piece Movie', groupId: 'anime_franchises' },
    ],
  },
  {
    id: 'tech_and_docs',
    labelVi: 'Công Nghệ & Tài Liệu Kỹ Thuật',
    labelEn: 'Tech & System Docs',
    icon: 'Cpu',
    genres: [
      { id: 'cyberpunk', labelVi: 'Công Nghệ & AI Cyberpunk', labelEn: 'Cyberpunk & Tech', groupId: 'tech_and_docs' },
      { id: 'logistics', labelVi: 'Kỹ Thuật Hệ Thống & Logistics', labelEn: 'Logistics Doc', groupId: 'tech_and_docs' },
    ],
  },
]

/**
 * Vietnamese slug aliases mapping to canonical genre IDs
 * Supports KKPhim, TMDB, and common variations
 */
export const GENRE_ALIAS_MAP: Record<string, string> = {
  // KKPhim Vietnamese slugs
  'chinh-kich': 'drama',
  'tam-ly': 'drama',
  'tinh-cam': 'romance',
  'lang-man': 'romance',
  'hanh-dong': 'action',
  'vo-thuat': 'action',
  'kich-tinh': 'action',
  'hanh-dong-kich-tinh': 'action',
  'hoi-hop': 'action',
  'action-thriller': 'action',
  'hai-huoc': 'comedy',
  'kinh-di': 'horror',
  'ma-quy': 'horror',
  'hoat-hinh': 'animation',
  'gia-dinh': 'family',
  'phieu-luu': 'adventure',
  'bi-an': 'mystery',
  'trinh-tham': 'mystery',
  'khoa-hoc': 'sci-fi',
  'vien-tuong': 'sci-fi',
  'khoa-hoc-vien-tuong': 'sci-fi',
  'co-trang': 'history',
  'lich-su': 'history',
  'chien-tranh': 'history',
  'am-nhac': 'music',
  'tai-lieu': 'logistics',
  'hoc-duong': 'family',

  // Raw English variations
  scifi: 'sci-fi',
  science_fiction: 'sci-fi',
  thriller: 'action',
  crime: 'action',
  fantasy: 'adventure',
  war: 'history',
  documentary: 'logistics',
}

/**
 * Normalize any genre slug to its canonical identifier
 */
export function normalizeGenreSlug(slug: string): string {
  if (!slug) return 'drama'
  const clean = slug.toLowerCase().trim()
  if (clean in GENRE_REGISTRY) return clean
  if (clean in GENRE_ALIAS_MAP) return GENRE_ALIAS_MAP[clean]
  return clean
}

/**
 * Get human-readable Vietnamese label for any genre identifier
 */
export function getGenreLabel(slugOrId: string): string {
  const canonical = normalizeGenreSlug(slugOrId)
  if (canonical in GENRE_REGISTRY) {
    return GENRE_REGISTRY[canonical].labelVi
  }
  // Fallback for custom or unmapped slugs: replace dash/underscore and capitalize
  return slugOrId
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Get primary display genre label for movie cards and subtitles
 * E.g., for Mai -> "Tâm Lý • Tình Cảm"
 * E.g., for Lật Mặt 7 -> "Gia Đình • Tâm Lý"
 * E.g., for Conan -> "Trinh Thám • Hoạt Hình"
 * Avoids showing raw meta categories like "theatrical_vn" as the main genre
 */
export function getMoviePrimaryGenreLabel(genres?: string[]): string {
  if (!genres || genres.length === 0) {
    return 'Điện Ảnh'
  }

  // Filter out meta-only tags (theatrical_vn, anime_theatrical, etc.) if content genres exist
  const contentGenres = genres
    .map(normalizeGenreSlug)
    .filter((g) => !GENRE_REGISTRY[g]?.isMeta)

  const selected = contentGenres.length > 0 ? contentGenres : genres.map(normalizeGenreSlug)

  const topTwo = selected.slice(0, 2).map((g) => getGenreLabel(g))
  return topTwo.join(' • ')
}

/**
 * Check if a movie matches a given selected genre filter
 * Supports both canonical IDs, aliases, and special collections
 */
export function isMovieMatchingGenre(
  movie: { genres?: string[]; franchise?: string; isTheatrical?: boolean; isVietnamese?: boolean; isAnimeTheatrical?: boolean },
  selectedGenreId: string
): boolean {
  if (!selectedGenreId || selectedGenreId === 'all') {
    return true
  }

  const target = normalizeGenreSlug(selectedGenreId)

  // 1. Phim Chiếu Rạp Việt Nam filter
  if (target === 'theatrical_vn') {
    return Boolean(
      (movie.isTheatrical && movie.isVietnamese) ||
      movie.genres?.some((g) => normalizeGenreSlug(g) === 'theatrical_vn')
    )
  }

  // 2. Anime Chiếu Rạp filter
  if (target === 'anime_theatrical') {
    return Boolean(
      movie.isAnimeTheatrical ||
      Boolean(movie.franchise) ||
      movie.genres?.some((g) => normalizeGenreSlug(g) === 'anime_theatrical' || normalizeGenreSlug(g) === 'animation')
    )
  }

  // 3. Franchise filters (Conan, Doraemon, Shin, Dragon Ball, Naruto, One Piece)
  if (['conan', 'doraemon', 'shin', 'dragonball', 'naruto', 'onepiece'].includes(target)) {
    if (movie.franchise === target) return true
    return Boolean(movie.genres?.some((g) => normalizeGenreSlug(g) === target))
  }

  // 4. Animation general filter (Anime / Hoạt Hình)
  if (target === 'animation') {
    return Boolean(
      movie.isAnimeTheatrical ||
      Boolean(movie.franchise) ||
      movie.genres?.some((g) => {
        const norm = normalizeGenreSlug(g)
        return norm === 'animation' || norm === 'hoat-hinh' || norm === 'anime_theatrical'
      })
    )
  }

  // 5. Standard Content Genre filters (Action, Romance, Drama, Comedy, Horror, etc.)
  if (!movie.genres || movie.genres.length === 0) return false

  return movie.genres.some((g) => normalizeGenreSlug(g) === target)
}
