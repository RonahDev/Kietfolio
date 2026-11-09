import React, { useMemo } from 'react'
import { CinemaProvider } from './context/CinemaContext'
import { useCinema } from './hooks/useCinema'
import { CinemaIntro } from './scenes/CinemaIntro'
import { CinemaNavbar } from './components/CinemaNavbar'
import { CinemaHero } from './components/CinemaHero'
import { CinemaCarouselRow } from './components/CinemaCarouselRow'
import { CinemaMovieCard } from './components/CinemaMovieCard'
import { CinemaDetailModal } from './components/CinemaDetailModal'
import { CinemaVideoPlayer } from './components/CinemaVideoPlayer'
import { CinemaFooter } from './components/CinemaFooter'
import {
  Flame,
  Award,
  Cpu,
  Layers,
  Clock,
  Sparkles,
  Search,
  Bookmark,
} from 'lucide-react'

interface CinemaStreamHubProps {
  onBackToPortfolio: () => void
}

const CinemaMainContent: React.FC<CinemaStreamHubProps> = ({ onBackToPortfolio }) => {
  const {
    movies,
    isCurtainIntroActive,
    finishCurtainIntro,
    activeTab,
    selectedGenre,
    searchQuery,
    watchlist,
  } = useCinema()

  // Filtered movies based on genre and search
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      // Genre filter
      if (selectedGenre !== 'all' && !movie.genres.includes(selectedGenre)) {
        return false
      }
      // Search query filter
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim()
        const matchesTitle = movie.title.toLowerCase().includes(query)
        const matchesSynopsis = movie.synopsis.toLowerCase().includes(query)
        const matchesDirector = movie.director.toLowerCase().includes(query)
        const matchesCast = movie.cast.some(
          (c) => c.name.toLowerCase().includes(query) || c.role.toLowerCase().includes(query)
        )
        return matchesTitle || matchesSynopsis || matchesDirector || matchesCast
      }
      // Tab filter
      if (activeTab === 'trending') return Boolean(movie.isTrending)
      if (activeTab === 'movies') return !movie.genres.includes('logistics')
      if (activeTab === 'series') return movie.genres.includes('logistics') || movie.genres.includes('cyberpunk')
      if (activeTab === 'watchlist') return watchlist.includes(movie.id)

      return true
    })
  }, [movies, selectedGenre, searchQuery, activeTab, watchlist])

  // Category subsets for 'all' tab
  const trendingMovies = useMemo(() => movies.filter((m) => m.isTrending), [movies])
  const awardMovies = useMemo(() => movies.filter((m) => m.isAwardWinning), [movies])
  const cyberpunkMovies = useMemo(() => movies.filter((m) => m.genres.includes('cyberpunk')), [movies])
  const logisticsMovies = useMemo(() => movies.filter((m) => m.genres.includes('logistics')), [movies])
  const continueWatching = useMemo(
    () => movies.filter((m) => (m.progressPercentage || 0) > 0),
    [movies]
  )
  const comingSoonMovies = useMemo(() => movies.filter((m) => m.isComingSoon), [movies])

  const isBrowsingAll = activeTab === 'all' && selectedGenre === 'all' && searchQuery.trim() === ''

  return (
    <div className="min-h-screen bg-[#08090d] text-[#f5f5f5] flex flex-col font-sans selection:bg-[#a51d35] selection:text-white relative overflow-x-hidden">
      {/* 3D Realistic Cinema Theater Curtain Opening Sequence */}
      {isCurtainIntroActive && <CinemaIntro onComplete={finishCurtainIntro} />}

      {/* Floating Cinema Header */}
      <CinemaNavbar onBackToPortfolio={onBackToPortfolio} />

      {/* Main Streaming Experience Stream */}
      <main className="flex-1">
        {/* If user is on default home with no filters, show Hero + Categorized Rows */}
        {isBrowsingAll ? (
          <>
            <CinemaHero />

            {/* Trending Now Row */}
            <CinemaCarouselRow
              title="Thịnh Hành & Đang Sốt"
              subtitle="Những bộ phim được xem nhiều nhất tuần qua trên CinemaStream"
              icon={<Flame className="w-5 h-5 text-[#a51d35]" />}
              movies={trendingMovies}
            />

            {/* Top Rated & Award-Winning Row */}
            <CinemaCarouselRow
              title="Tuyệt Tác Điện Ảnh & Giải Thưởng"
              subtitle="Điểm đánh giá từ 9.0+ với tiêu chuẩn chất lượng hình ảnh 4K HDR"
              icon={<Award className="w-5 h-5 text-[#d4af70]" />}
              movies={awardMovies}
            />

            {/* Cyberpunk & Tech Realm Row */}
            <CinemaCarouselRow
              title="Vũ Trụ Cyberpunk & Mạng Lưới AI"
              subtitle="Tương lai kỹ thuật số, trí tuệ nhân tạo và thực tại ảo"
              icon={<Cpu className="w-5 h-5 text-cyan-400" />}
              movies={cyberpunkMovies}
            />

            {/* Logistics & Engineering Documentary Series (Connecting to Kiệt's real domain) */}
            <CinemaCarouselRow
              title="Kỹ Thuật Hệ Thống & Logistics Thực Chiến"
              subtitle="Tài liệu chuyên sâu về điều phối kho bãi, chuỗi cung ứng và điểm nghẽn ngày Sale"
              icon={<Layers className="w-5 h-5 text-amber-400" />}
              movies={logisticsMovies}
            />

            {/* Continue Watching Row */}
            {continueWatching.length > 0 && (
              <CinemaCarouselRow
                title="Tiếp Tục Xem"
                subtitle="Xem tiếp ngay tại thời điểm bạn đã dừng lại"
                icon={<Clock className="w-5 h-5 text-emerald-400" />}
                movies={continueWatching}
              />
            )}

            {/* Coming Soon Row */}
            {comingSoonMovies.length > 0 && (
              <CinemaCarouselRow
                title="Sắp Ra Mắt"
                subtitle="Những tác phẩm bom tấn độc quyền sắp công chiếu"
                icon={<Sparkles className="w-5 h-5 text-[#d4af70]" />}
                movies={comingSoonMovies}
              />
            )}
          </>
        ) : (
          /* Filtered Grid View (Search, Genre selection, Watchlist, or Tab navigation) */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#181b24]">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-white">
                  {searchQuery.trim()
                    ? `Kết quả tìm kiếm cho: "${searchQuery}"`
                    : activeTab === 'watchlist'
                    ? 'Danh Sách Phim Yêu Thích Của Tôi'
                    : activeTab === 'trending'
                    ? 'Phim Thịnh Hành Trên Toàn Cầu'
                    : activeTab === 'series'
                    ? 'Phim Bộ & Tài Liệu Kỹ Thuật'
                    : selectedGenre !== 'all'
                    ? `Thể Loại: ${selectedGenre.toUpperCase()}`
                    : 'Bộ Sưu Tập Phim Điện Ảnh'}
                </h2>
                <p className="text-xs font-mono text-[#a1a1aa] mt-1">
                  Tìm thấy {filteredMovies.length} kết quả phù hợp
                </p>
              </div>
            </div>

            {filteredMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {filteredMovies.map((movie) => (
                  <div key={movie.id} className="flex justify-center">
                    <CinemaMovieCard movie={movie} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#11131a] border border-[#181b24] flex items-center justify-center mx-auto text-[#a1a1aa]">
                  {activeTab === 'watchlist' ? (
                    <Bookmark className="w-8 h-8 text-[#d4af70]" />
                  ) : (
                    <Search className="w-8 h-8 text-[#a51d35]" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-white font-mono">
                  {activeTab === 'watchlist'
                    ? 'Danh sách của bạn đang trống'
                    : 'Không tìm thấy bộ phim phù hợp'}
                </h3>
                <p className="text-xs font-mono text-[#a1a1aa] max-w-md mx-auto">
                  {activeTab === 'watchlist'
                    ? 'Hãy khám phá các bộ phim và bấm dấu cộng (+) trên poster để lưu vào danh sách xem sau.'
                    : 'Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc thể loại hiện tại.'}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Movie Details Modal */}
      <CinemaDetailModal />

      {/* Video Player Modal */}
      <CinemaVideoPlayer />

      {/* Cinema Minimal Footer */}
      <CinemaFooter />
    </div>
  )
}

export const CinemaStreamHub: React.FC<CinemaStreamHubProps> = ({ onBackToPortfolio }) => {
  return (
    <CinemaProvider>
      <CinemaMainContent onBackToPortfolio={onBackToPortfolio} />
    </CinemaProvider>
  )
}
