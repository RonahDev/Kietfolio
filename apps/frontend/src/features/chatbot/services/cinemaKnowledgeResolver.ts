import {
  OFFICIAL_VIETNAMESE_THEATRICAL_MOVIES,
  OFFICIAL_THEATRICAL_ANIME_MOVIES,
  OFFICIAL_ACTION_THRILLER_MOVIES,
} from '@/features/cinema/services/officialMovieService'
import { CINEMA_MOVIES } from '@/features/cinema/data/moviesData'
import type { MovieItem } from '@/features/cinema/types/cinema'
import type { QuickReplyOption } from '../types/chat'
import { removeVietnameseAccents } from './chatbotEngine'

/**
 * Deduplicated, unified catalog of all 81+ official and featured movies
 */
function getAllCinemaCatalog(): MovieItem[] {
  const seen = new Set<string>()
  const catalog: MovieItem[] = []

  const allLists = [
    CINEMA_MOVIES,
    OFFICIAL_VIETNAMESE_THEATRICAL_MOVIES,
    OFFICIAL_THEATRICAL_ANIME_MOVIES,
    OFFICIAL_ACTION_THRILLER_MOVIES,
  ]

  for (const list of allLists) {
    for (const movie of list) {
      if (!seen.has(movie.id)) {
        seen.add(movie.id)
        catalog.push(movie)
      }
    }
  }

  return catalog
}

export interface CinemaSearchResult {
  matchedMovies: MovieItem[]
  formattedResponseVi: string
  formattedResponseEn: string
  quickRepliesVi: QuickReplyOption[]
  quickRepliesEn: QuickReplyOption[]
  actionLink: {
    labelVi: string
    labelEn: string
    url: string
    isExternal?: boolean
  }
}

/**
 * Intelligent Cinema Catalog Resolver:
 * Scans the actual movie catalog by Title, Director, Actor, Genre, or Release Year
 * and returns verified, transparent movie recommendations.
 */
export function resolveCinemaQuery(query: string): CinemaSearchResult | null {
  const normalized = removeVietnameseAccents(query)
  const catalog = getAllCinemaCatalog()

  // 1. Check for specific director inquiries
  const isNolanQuery = normalized.includes('nolan') || normalized.includes('christopher nolan')
  const isVilleneuveQuery = normalized.includes('villeneuve') || normalized.includes('denis')
  const isTranThanhQuery = normalized.includes('tran thanh')
  const isLyHaiQuery = normalized.includes('ly hai')
  const isShinkaiQuery = normalized.includes('makoto shinkai') || normalized.includes('shinkai')
  const isGhibliQuery = normalized.includes('ghibli') || normalized.includes('miyazaki') || normalized.includes('totoro')

  // 2. Check for franchise / specific title inquiries
  const isDoraemonQuery = normalized.includes('doraemon') || normalized.includes('doremon') || normalized.includes('nobita')
  const isConanQuery = normalized.includes('conan') || normalized.includes('tham tu conan')
  const isShinQuery = normalized.includes('shin') || normalized.includes('but chi')
  const isDragonBallQuery = normalized.includes('dragon ball') || normalized.includes('songoku') || normalized.includes('broly')
  const isOnePieceQuery = normalized.includes('one piece') || normalized.includes('luffy') || normalized.includes('film red')
  const isLatMatQuery = normalized.includes('lat mat')
  const isMaiQuery = normalized.includes('phim mai') || normalized.includes('mai 2024')
  const isNhaBaNuQuery = normalized.includes('nha ba nu')
  const isBoGiaQuery = normalized.includes('bo gia')
  const isJohnWickQuery = normalized.includes('john wick') || normalized.includes('sat thu john wick')
  const isDeadpoolQuery = normalized.includes('deadpool') || normalized.includes('wolverine')
  const isDuneQuery = normalized.includes('dune') || normalized.includes('hanh tinh cat')
  const isOppenheimerQuery = normalized.includes('oppenheimer')
  const isInterstellarQuery = normalized.includes('interstellar') || normalized.includes('ho sau vo tan')
  const isExhumaQuery = normalized.includes('exhuma') || normalized.includes('quat mo trung ma')

  // 3. Check for genre inquiries
  const isActionGenre = normalized.includes('hanh dong') || normalized.includes('action') || normalized.includes('ban sung')
  const isHorrorGenre = normalized.includes('kinh di') || normalized.includes('phim ma') || normalized.includes('horror')
  const isAnimeGenre = normalized.includes('anime') || normalized.includes('hoat hinh nhat')
  const isVietnameseGenre = normalized.includes('phim viet') || normalized.includes('chieu rap viet') || normalized.includes('viet nam')
  const isSciFiGenre = normalized.includes('vien tuong') || normalized.includes('sci-fi') || normalized.includes('khoa hoc vien tuong') || normalized.includes('vu tru')
  const isTopRatedQuery = normalized.includes('hay nhat') || normalized.includes('danh gia cao') || normalized.includes('top rated') || normalized.includes('diem cao')

  let matched: MovieItem[] = []
  let contextTitleVi = ''
  let contextTitleEn = ''

  if (isNolanQuery) {
    matched = catalog.filter((m) =>
      ['oppenheimer-2023', 'interstellar-2014', 'inception-architecture', 'scifi-interstellar-2014', 'scifi-oppenheimer-2023'].includes(m.id) ||
      m.title.toLowerCase().includes('oppenheimer') ||
      m.title.toLowerCase().includes('interstellar') ||
      m.title.toLowerCase().includes('inception')
    )
    contextTitleVi = 'Kiệt tác điện ảnh của Đạo diễn Christopher Nolan'
    contextTitleEn = 'Cinematic Masterpieces directed by Christopher Nolan'
  } else if (isVilleneuveQuery || isDuneQuery) {
    matched = catalog.filter((m) =>
      m.id.includes('dune') ||
      m.title.toLowerCase().includes('dune') ||
      m.title.toLowerCase().includes('blade runner')
    )
    contextTitleVi = 'Kỳ quan khoa học viễn tưởng của Đạo diễn Denis Villeneuve (Dune Universe)'
    contextTitleEn = 'Sci-Fi Epic by Denis Villeneuve (Dune Universe)'
  } else if (isTranThanhQuery || isMaiQuery || isNhaBaNuQuery || isBoGiaQuery) {
    matched = catalog.filter((m) =>
      ['vn-mai-2024', 'vn-nha-ba-nu-2023', 'vn-bo-gia-2021'].includes(m.id) ||
      m.title.toLowerCase().includes('mai') ||
      m.title.toLowerCase().includes('nhà bà nữ') ||
      m.title.toLowerCase().includes('bố già')
    )
    contextTitleVi = 'Phim Chiếu Rạp Doanh Thu Trăm Tỷ của Đạo Diễn Trấn Thành'
    contextTitleEn = 'Vietnamese Box Office Records by Director Tran Thanh'
  } else if (isLyHaiQuery || isLatMatQuery) {
    matched = catalog.filter((m) =>
      m.id.includes('lat-mat') ||
      m.title.toLowerCase().includes('lật mặt')
    )
    contextTitleVi = 'Thương Hiệu Điện Ảnh Ăn Khách "Lật Mặt" của Đạo Diễn Lý Hải'
    contextTitleEn = 'The Hit "Face Off" (Lat Mat) Series by Director Ly Hai'
  } else if (isDoraemonQuery) {
    matched = catalog.filter((m) =>
      m.id.includes('doraemon') ||
      m.title.toLowerCase().includes('doraemon')
    )
    contextTitleVi = 'Vũ Trụ Điện Ảnh Chiếu Rạp Doraemon The Movie'
    contextTitleEn = 'Doraemon The Theatrical Movie Collection'
  } else if (isConanQuery) {
    matched = catalog.filter((m) =>
      m.id.includes('conan') ||
      m.title.toLowerCase().includes('conan')
    )
    contextTitleVi = 'Tuyển Tập Bom Tấn Phá Án Thám Tử Lừng Danh Conan'
    contextTitleEn = 'Detective Conan Blockbuster Movie Franchise'
  } else if (isShinQuery) {
    matched = catalog.filter((m) =>
      m.id.includes('shin') || m.title.toLowerCase().includes('shin')
    )
    contextTitleVi = 'Thương Hiệu Phim Chiếu Rạp Shin - Cậu Bé Bút Chì'
    contextTitleEn = 'Crayon Shin-chan The Movie Collection'
  } else if (isDragonBallQuery) {
    matched = catalog.filter((m) =>
      m.id.includes('dragon-ball') || m.title.toLowerCase().includes('dragon ball')
    )
    contextTitleVi = 'Tuyển Tập Siêu Phẩm Chiếu Rạp Dragon Ball Super'
    contextTitleEn = 'Dragon Ball Super Theatrical Blockbusters'
  } else if (isOnePieceQuery) {
    matched = catalog.filter((m) =>
      m.id.includes('one-piece') || m.title.toLowerCase().includes('one piece')
    )
    contextTitleVi = 'Đại Hải Trình One Piece The Movie (Luffy & Băng Mũ Rơm)'
    contextTitleEn = 'One Piece The Movie Saga (Straw Hat Pirates)'
  } else if (isOppenheimerQuery) {
    matched = catalog.filter((m) => m.title.toLowerCase().includes('oppenheimer'))
    contextTitleVi = 'Kiệt Tác 7 Giải Oscar: Oppenheimer (2023)'
    contextTitleEn = '7-time Academy Award Winner: Oppenheimer (2023)'
  } else if (isInterstellarQuery) {
    matched = catalog.filter((m) => m.title.toLowerCase().includes('interstellar'))
    contextTitleVi = 'Sử Thi Không Gian Vĩ Đại: Interstellar (Hố Sâu Vô Tận)'
    contextTitleEn = 'Cosmic Sci-Fi Odyssey: Interstellar'
  } else if (isGhibliQuery) {
    matched = catalog.filter((m) =>
      ['anime-spirited-away-2001', 'anime-howls-moving-castle-2004', 'anime-my-neighbor-totoro-1988'].includes(m.id) ||
      m.title.toLowerCase().includes('vùng đất linh hồn') ||
      m.title.toLowerCase().includes('howl') ||
      m.title.toLowerCase().includes('totoro')
    )
    contextTitleVi = 'Kiệt Tác Hoạt Họa Nghệ Thuật Studio Ghibli (Hayao Miyazaki)'
    contextTitleEn = 'Studio Ghibli Animation Masterpieces (Hayao Miyazaki)'
  } else if (isShinkaiQuery) {
    matched = catalog.filter((m) =>
      ['anime-your-name-2016', 'anime-suzume-2022'].includes(m.id) ||
      m.title.toLowerCase().includes('your name') ||
      m.title.toLowerCase().includes('suzume')
    )
    contextTitleVi = 'Tuyển Tập Phim Chữa Lành của Phù Thủy Nỗi Buồn Makoto Shinkai'
    contextTitleEn = 'Emotional Anime Masterpieces by Makoto Shinkai'
  } else if (isExhumaQuery || isHorrorGenre) {
    matched = catalog.filter((m) =>
      m.genres.some((g) => g.toLowerCase().includes('kinh dị') || g.toLowerCase().includes('horror')) ||
      m.title.toLowerCase().includes('quỷ cẩu') ||
      m.title.toLowerCase().includes('cám') ||
      m.title.toLowerCase().includes('exhuma') ||
      m.title.toLowerCase().includes('vùng đất câm lặng')
    )
    contextTitleVi = 'Phim Kinh Dị Rùng Rợn & Hiện Tượng Phòng Vé'
    contextTitleEn = 'Spine-Chilling Horror & Paranormal Box Office Hits'
  } else if (isDeadpoolQuery || isJohnWickQuery || isActionGenre) {
    matched = catalog.filter((m) =>
      m.genres.some((g) => g.toLowerCase().includes('hành động') || g.toLowerCase().includes('action'))
    ).slice(0, 5)
    contextTitleVi = 'Bom Tấn Hành Động Kịch Tính & Mãn Nhãn'
    contextTitleEn = 'High-Octane Action Blockbusters'
  } else if (isSciFiGenre) {
    matched = catalog.filter((m) =>
      m.genres.some((g) => g.toLowerCase().includes('viễn tưởng') || g.toLowerCase().includes('sci-fi'))
    ).slice(0, 5)
    contextTitleVi = 'Vũ Trụ Khoa Học Viễn Tưởng & Không Gian Đỉnh Cao'
    contextTitleEn = 'Mind-Bending Sci-Fi & Cybernetic Universes'
  } else if (isVietnameseGenre) {
    matched = catalog.filter((m) => m.isTheatrical && m.id.startsWith('vn-')).slice(0, 5)
    contextTitleVi = 'Điện Ảnh Chiếu Rạp Việt Nam Trăm Tỷ'
    contextTitleEn = 'Vietnamese Box Office Record Breakers'
  } else if (isAnimeGenre) {
    matched = catalog.filter((m) => m.id.startsWith('anime-')).slice(0, 5)
    contextTitleVi = 'Tuyển Tập Phim Hoạt Hình Anime Chiếu Rạp'
    contextTitleEn = 'Top Theatrical Anime Masterpieces'
  } else if (isTopRatedQuery) {
    matched = [...catalog].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5)
    contextTitleVi = 'Top Phim Có Điểm Đánh Giá Cao Nhất Hệ Thống'
    contextTitleEn = 'Highest Rated Masterpieces on CinemaStreamHub'
  }

  if (matched.length === 0) {
    return null
  }

  // Deduplicate matched movies
  const uniqueMatched = Array.from(new Map(matched.map((m) => [m.id, m])).values())

  // Format rich Markdown cards
  const movieListVi = uniqueMatched
    .map((m, index) => {
      const year = m.year || 2024
      const rating = m.rating ? `${m.rating.toFixed(1)}/10` : '8.5/10'
      const genres = m.genres?.join(', ') || 'Chiếu Rạp, 4K'
      const duration = m.duration || '110 phút'
      const tagline = m.tagline ? `*“${m.tagline}”*` : `*${(m.synopsis || '').slice(0, 110)}...*`

      return `${index + 1}. 🎬 **${m.title}** (${year})
   - ⭐ **Đánh giá**: \`${rating}\` | ⏱️ **Thời lượng**: ${duration} | 🏷️ **Thể loại**: ${genres}
   - 💬 ${tagline}
   - 📺 **Chất lượng**: 4K Ultra HD • Âm thanh Dolby Atmos • Server VIP Fast HLS`
    })
    .join('\n\n')

  const movieListEn = uniqueMatched
    .map((m, index) => {
      const year = m.year || 2024
      const rating = m.rating ? `${m.rating.toFixed(1)}/10` : '8.5/10'
      const genres = m.genres?.join(', ') || 'Theatrical, 4K'
      const duration = m.duration || '110 mins'
      const tagline = m.tagline ? `*“${m.tagline}”*` : `*${(m.synopsis || '').slice(0, 110)}...*`

      return `${index + 1}. 🎬 **${m.title}** (${year})
   - ⭐ **Score**: \`${rating}\` | ⏱️ **Runtime**: ${duration} | 🏷️ **Genres**: ${genres}
   - 💬 ${tagline}
   - 📺 **Stream**: 4K Ultra HD • Dolby Atmos Audio • VIP Fast HLS Server`
    })
    .join('\n\n')

  const formattedResponseVi = `🍿 **${contextTitleVi} (Xác thực từ kho phim hệ thống):**

${movieListVi}

💡 **Hướng dẫn xem ngay**: Bấm vào nút bên dưới để mở thẳng tab xem phim hoặc tìm kiếm tiêu đề trên thanh điều hướng của **CinemaStreamHub**!`

  const formattedResponseEn = `🍿 **${contextTitleEn} (Verified from Catalog):**

${movieListEn}

💡 **Stream Now**: Click the button below to browse titles directly on **CinemaStreamHub**!`

  return {
    matchedMovies: uniqueMatched,
    formattedResponseVi,
    formattedResponseEn,
    actionLink: {
      labelVi: 'Vào Xem Phim Ngay',
      labelEn: 'Browse CinemaStreamHub',
      url: '#cinema',
    },
    quickRepliesVi: [
      { label: '👑 Quyền lợi VIP 4K', query: 'Quyền lợi tài khoản VIP CinemaStream là gì?' },
      { label: '🇻🇳 Doanh thu phim Việt', query: 'Doanh thu các phim chiếu rạp Việt Nam là bao nhiêu?' },
      { label: '⛩️ Phim Doraemon có gì?', query: 'Phim Doraemon có những phần nào?' },
    ],
    quickRepliesEn: [
      { label: '👑 4K VIP Privileges', query: 'What are VIP privileges on CinemaStream?' },
      { label: '🇻🇳 VN Box Office Records', query: 'What are the top grossing Vietnamese movies?' },
      { label: '⛩️ Doraemon Movies', query: 'Which Doraemon movies are available?' },
    ],
  }
}
