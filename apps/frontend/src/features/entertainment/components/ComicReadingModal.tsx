import React, { useState } from 'react'
import {
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Bookmark,
  Share2,
  Sparkles,
  Check,
} from 'lucide-react'
import { useLanguage } from '@/hooks'

export interface MangaSeries {
  id: string
  title: string
  originalTitle: string
  author: string
  genre: string[]
  rating: number
  status: string
  coverUrl: string
  description: string
  totalChapters: number
  currentChapter: number
  chapterTitle: string
  pages: {
    pageNumber: number
    imageUrl: string
    caption: string
  }[]
}

const MANGA_CATALOG: MangaSeries[] = [
  {
    id: 'one-piece',
    title: 'One Piece - Đảo Hải Tặc',
    originalTitle: 'ONE PIECE (ワンピース)',
    author: 'Eiichiro Oda',
    genre: ['Shonen', 'Hành Động', 'Phiêu Lưu', 'Hài Hước'],
    rating: 4.95,
    status: 'Đang tiến hành',
    coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    description:
      'Hành trình phiêu lưu vĩ đại của Monkey D. Luffy và băng Mũ Rơm trên Đại Hải Trình để tìm kiếm kho báu huyền thoại One Piece và trở thành Vua Hải Tặc.',
    totalChapters: 1115,
    currentChapter: 1100,
    chapterTitle: 'Chương 1100: Kỷ Nguyên Của Những Vị Vua Mới',
    pages: [
      {
        pageNumber: 1,
        imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=900&auto=format&fit=crop&q=80',
        caption: 'Bình minh trên biển cả. Cánh buồm Thousand Sunny lướt trên những con sóng dữ của Tân Thế Giới.',
      },
      {
        pageNumber: 2,
        imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&auto=format&fit=crop&q=80',
        caption: 'Luffy đứng trên mũi tàu, nụ cười rạng rỡ đón ngọn gió tự do: "Tất cả mọi người, chuẩn bị tiến lên!"',
      },
      {
        pageNumber: 3,
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80',
        caption: 'Hào quang Haki Bá Vương bùng nổ thắp sáng bầu trời đêm, khẳng định ý chí không thể lay chuyển.',
      },
    ],
  },
  {
    id: 'solo-leveling',
    title: 'Solo Leveling - Tôi Thăng Cấp Một Mình',
    originalTitle: '나 혼자만 레벨업',
    author: 'Chugong / DUBU (REDICE)',
    genre: ['Action', 'Fantasy', 'Hầm Ngục', 'Siêu Năng'],
    rating: 4.98,
    status: 'Trọn bộ',
    coverUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    description:
      'Sung Jin-woo từ thợ săn yếu nhất thế giới thức tỉnh hệ thống Quest bí ẩn, một mình đối đầu với hoàng đế bóng tối và bảo vệ nhân loại.',
    totalChapters: 179,
    currentChapter: 179,
    chapterTitle: 'Chương 179: Trận Chiến Hoàng Gia Của Quân Đoàn Bóng Tối',
    pages: [
      {
        pageNumber: 1,
        imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80',
        caption: 'Cánh cổng S-Rank mở ra giữa bầu trời đêm. Năng lượng ma thuật tràn ngập không gian đô thị.',
      },
      {
        pageNumber: 2,
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80',
        caption: '"ARISE!" — Lời hiệu triệu vang lên, hàng triệu chiến binh bóng tối trỗi dậy từ lòng đất.',
      },
      {
        pageNumber: 3,
        imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=900&auto=format&fit=crop&q=80',
        caption: 'Ánh mắt rực sắc xanh huyền bí của Chúa Tể Bóng Tối làm rung chuyển chiều không gian hư vô.',
      },
    ],
  },
  {
    id: 'kimetsu-no-yaiba',
    title: 'Thanh Gươm Diệt Quỷ - Demon Slayer',
    originalTitle: '鬼滅の刃',
    author: 'Koyoharu Gotouge',
    genre: ['Shonen', 'Kiếm Hiệp', 'Siêu Nhiên', 'Cảm Động'],
    rating: 4.92,
    status: 'Trọn bộ',
    coverUrl: 'https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=600&auto=format&fit=crop&q=80',
    description:
      'Tanjiro Kamado dấn thân vào con đường diệt quỷ đầy gian nan để tìm phương thuốc giải lời nguyền cho em gái Nezuko và trả thù cho gia đình.',
    totalChapters: 205,
    currentChapter: 200,
    chapterTitle: 'Chương 200: Khát Vọng Ngày Bình Minh',
    pages: [
      {
        pageNumber: 1,
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80',
        caption: 'Ánh rạng đông đầu tiên xuyên qua làn sương tuyết. Nhật Luân Kiếm rực đỏ hơi thở Mặt Trời.',
      },
      {
        pageNumber: 2,
        imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=900&auto=format&fit=crop&q=80',
        caption: 'Nezuko đưa bàn tay ấm áp nắm lấy anh trai. Lời nguyền ngàn năm chính thức tan biến.',
      },
    ],
  },
  {
    id: 'doraemon',
    title: 'Doraemon - Chú Mèo Máy Đến Từ Tương Lai',
    originalTitle: 'ドラえもん',
    author: 'Fujiko F. Fujio',
    genre: ['Khoa Học Viễn Tưởng', 'Thiếu Nhi', 'Hài Hước', 'Tình Bạn'],
    rating: 4.99,
    status: 'Kinh điển',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    description:
      'Những chuyến phiêu lưu kỳ thú vượt thời gian và không gian của nhóm bạn Nobita cùng chú mèo máy thông minh Doraemon và chiếc túi thần kỳ.',
    totalChapters: 821,
    currentChapter: 120,
    chapterTitle: 'Chương Đặc Biệt: Cỗ Máy Thời Gian & Chuyến Thám Hiểm Đáy Biển',
    pages: [
      {
        pageNumber: 1,
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&auto=format&fit=crop&q=80',
        caption: 'Cánh cửa thần kỳ mở ra đáy đại dương lung linh huyền ảo với những rạn san hô phát sáng.',
      },
      {
        pageNumber: 2,
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80',
        caption: 'Nobita và Doraemon mỉm cười: "Tình bạn là chuyến phiêu lưu đẹp nhất mà chúng ta từng có."',
      },
    ],
  },
]

interface ComicReadingModalProps {
  isOpen: boolean
  onClose: () => void
  initialSeriesId?: string
}

export const ComicReadingModal: React.FC<ComicReadingModalProps> = ({
  isOpen,
  onClose,
  initialSeriesId = 'one-piece',
}) => {
  const { language } = useLanguage()
  const [selectedSeriesId, setSelectedSeriesId] = useState(initialSeriesId)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [zoomLevel, setZoomLevel] = useState<number>(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showCopied, setShowCopied] = useState(false)

  if (!isOpen) return null

  const currentSeries =
    MANGA_CATALOG.find((m) => m.id === selectedSeriesId) || MANGA_CATALOG[0]
  const currentPage = currentSeries.pages[currentPageIndex] || currentSeries.pages[0]

  const handleNextPage = () => {
    if (currentPageIndex < currentSeries.pages.length - 1) {
      setCurrentPageIndex((prev) => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1)
    }
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(window.location.href)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050a14]/90 backdrop-blur-xl p-2 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Phòng Đọc Truyện Manga & Comic Lounge"
    >
      <div
        className={`relative w-full ${
          isFullscreen ? 'h-full max-w-none' : 'max-w-6xl max-h-[92vh]'
        } flex flex-col rounded-3xl bg-[#0a1224] border border-[#172847] shadow-2xl overflow-hidden transition-all duration-300 font-mono`}
      >
        {/* Top Header Bar */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#172847] bg-[#0c182e]/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#00d2ff]/15 border border-[#00d2ff]/40 flex items-center justify-center text-[#00d2ff] shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#f1f5f9] truncate">
                  {currentSeries.title}
                </h3>
                <span className="px-2 py-0.2 rounded-full bg-[#00d2ff]/20 text-[#00d2ff] text-[10px] font-bold shrink-0 hidden sm:inline">
                  {currentSeries.chapterTitle.split(':')[0]}
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8] truncate">
                {currentSeries.author} • {currentSeries.chapterTitle}
              </p>
            </div>
          </div>

          {/* Controls: Zoom, Bookmark, Fullscreen, Close */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Zoom Controls */}
            <div className="hidden md:flex items-center gap-1 bg-[#12213d] border border-[#1e345e] rounded-lg px-2 py-1 text-xs text-[#94a3b8]">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(70, z - 15))}
                className="hover:text-white cursor-pointer p-0.5"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="min-w-[40px] text-center font-bold text-[#00d2ff]">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(160, z + 15))}
                className="hover:text-white cursor-pointer p-0.5"
                title="Phóng to"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bookmark button */}
            <button
              type="button"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isBookmarked
                  ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                  : 'border-[#172847] bg-[#12213d]/60 text-[#94a3b8] hover:text-[#00d2ff]'
              }`}
              title={isBookmarked ? 'Đã lưu vào danh sách yêu thích' : 'Lưu truyện yêu thích'}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Share link button */}
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl border border-[#172847] bg-[#12213d]/60 text-[#94a3b8] hover:text-[#00d2ff] transition-all cursor-pointer relative"
              title="Chia sẻ link"
            >
              {showCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl border border-[#172847] bg-[#12213d]/60 text-[#94a3b8] hover:text-white transition-all cursor-pointer hidden sm:flex"
              title={isFullscreen ? 'Thu nhỏ giao diện' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/30 hover:text-white transition-all cursor-pointer ml-1"
              title="Đóng phòng đọc truyện"
              aria-label="Đóng phòng đọc truyện"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Body: Series Switcher Sidebar + Interactive Reader Canvas */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Shelf: Series Selector */}
          <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#172847] bg-[#070e1c] p-3 overflow-y-auto shrink-0 flex md:flex-col gap-2">
            <div className="text-[11px] text-[#64748b] uppercase tracking-wider font-bold px-2 py-1 hidden md:block">
              {language === 'vi' ? 'DANH MỤC TRUYỆN HOT' : 'FEATURED MANGA'}
            </div>

            {MANGA_CATALOG.map((series) => {
              const isSelected = series.id === selectedSeriesId
              return (
                <button
                  key={series.id}
                  type="button"
                  onClick={() => {
                    setSelectedSeriesId(series.id)
                    setCurrentPageIndex(0)
                  }}
                  className={`flex items-center gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer shrink-0 md:shrink md:w-full border ${
                    isSelected
                      ? 'bg-[#00d2ff]/15 border-[#00d2ff]/60 text-[#f1f5f9] shadow-sm'
                      : 'border-transparent hover:bg-[#101b33] text-[#94a3b8] hover:text-[#f1f5f9]'
                  }`}
                >
                  <img
                    src={series.coverUrl}
                    alt={series.title}
                    className="w-10 h-12 rounded-lg object-cover border border-[#172847] shrink-0"
                  />
                  <div className="min-w-0 pr-1">
                    <p className="text-xs font-bold truncate">{series.title}</p>
                    <p className="text-[10px] text-[#64748b] truncate">{series.author}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] text-[#00d2ff] font-bold">★ {series.rating}</span>
                      <span className="text-[9px] text-[#64748b]">• {series.totalChapters} ch</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </aside>

          {/* Right Area: Active Reader Display */}
          <main className="flex-1 flex flex-col min-h-0 bg-[#050a14] overflow-hidden relative">
            {/* Scrollable Reader Canvas */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-center">
              <div
                className="relative max-w-3xl w-full rounded-2xl overflow-hidden border border-[#172847] shadow-[0_0_40px_rgba(0,0,0,0.85)] bg-[#091122] transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              >
                {/* Manga Page Image */}
                <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full overflow-hidden bg-[#0c182e] flex items-center justify-center">
                  <img
                    src={currentPage.imageUrl}
                    alt={`Trang ${currentPage.pageNumber}`}
                    className="w-full h-full object-cover select-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050a14]/90 via-transparent to-transparent pointer-events-none" />

                  {/* Narrative Caption */}
                  <div className="absolute bottom-4 inset-x-4 p-3 rounded-xl bg-[#0a1224]/90 border border-[#172847]/80 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-[#00d2ff] text-[11px] font-bold mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{currentSeries.chapterTitle}</span>
                    </div>
                    <p className="text-xs text-[#cbd5e1] leading-relaxed font-sans">
                      {currentPage.caption}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Floating Control Bar */}
            <footer className="px-4 py-3 border-t border-[#172847] bg-[#0c182e]/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
              {/* Prev Page Button */}
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPageIndex === 0}
                className="inline-flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl border border-[#172847] bg-[#12213d] hover:bg-[#1a2f57] text-[#f1f5f9] text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Trang Trước</span>
              </button>

              {/* Page Indicator & Direct Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#94a3b8]">Trang</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#00d2ff]/20 border border-[#00d2ff]/40 text-[#00d2ff] font-bold">
                  {currentPageIndex + 1} / {currentSeries.pages.length}
                </span>
                <span className="text-[#64748b] hidden sm:inline">
                  ({currentSeries.totalChapters} Chương bản quyền)
                </span>
              </div>

              {/* Next Page Button */}
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPageIndex === currentSeries.pages.length - 1}
                className="inline-flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl border border-[#00d2ff]/50 bg-[#00d2ff]/20 hover:bg-[#00d2ff]/35 text-[#00d2ff] hover:text-white text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <span className="hidden sm:inline">Trang Tiếp</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </footer>
          </main>
        </div>
      </div>
    </div>
  )
}
