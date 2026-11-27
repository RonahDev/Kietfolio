import React, { useState } from 'react'
import { useLanguage } from '@/hooks'
import {
  Film,
  Music,
  ArrowRight,
  Sparkles,
  Layers,
  HardDrive,
  Sliders,
  Tv,
  BookOpen,
  Bookmark,
  Smartphone,
  Eye,
} from 'lucide-react'
import { ComicReadingModal } from './ComicReadingModal'

export const EntertainmentHubSection: React.FC = () => {
  const { language } = useLanguage()
  const [isComicModalOpen, setIsComicModalOpen] = useState(false)

  const openCinema = () => {
    window.location.hash = 'cinema'
    window.dispatchEvent(
      new CustomEvent('kietfolio:navigate-view', { detail: { view: 'cinema' } })
    )
  }

  const openMusic = () => {
    window.location.hash = 'music'
    window.dispatchEvent(
      new CustomEvent('kietfolio:navigate-view', { detail: { view: 'music' } })
    )
  }

  return (
    <section
      id="entertainment"
      className="relative py-20 px-4 sm:px-6 lg:px-8 border-b border-[#172847] bg-gradient-to-b from-[#050a14] via-[#080e1c] to-[#050a14] overflow-hidden"
      aria-label={language === 'vi' ? 'Sân chơi giải trí tích hợp 3-in-1' : 'Integrated 3-in-1 Entertainment Lounge'}
    >
      {/* Background Ambient Decorative Lights */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-96 h-96 bg-[#a51d35]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-[#C6A878]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00d2ff]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#172847]/70 pb-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a1224] border border-[#172847] text-xs font-mono text-[#00d2ff]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="uppercase tracking-widest font-bold">
                {language === 'vi' ? 'SÂN CHƠI GIẢI TRÍ TÍCH HỢP · 3-IN-1' : 'INTEGRATED 3-IN-1 ENTERTAINMENT LOUNGE'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#f1f5f9] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              {language === 'vi'
                ? 'Không Gian Điện Ảnh 4K, Thính Phòng Nhạc & Phòng Đọc Truyện'
                : '3D Cinema Hall, Classical Music & Manga Lounge'}
            </h2>

            <p className="text-sm sm:text-base text-[#94a3b8] font-['Be_Vietnam_Pro',sans-serif] leading-relaxed">
              {language === 'vi'
                ? 'Không cần phải nhảy qua lại nhiều website khác nhau: Kietfolio tích hợp sẵn hệ sinh thái giải trí trực tiếp gồm Rạp phim 3D Three.js, Nhà hát nghe nhạc V-Pop & lossless, cùng Phòng đọc truyện tranh Manga không quảng cáo.'
                : 'Enjoy an all-in-one entertainment ecosystem directly on Kietfolio without external redirects: 3D Three.js Cinema, V-Pop & Lossless Music Theater, and ad-free Manga & Comic Reading Lounge.'}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[#64748b]">
            <span className="hidden sm:inline">// ENTERTAINMENT_HUB_V3.0_ALL_IN_ONE</span>
          </div>
        </div>

        {/* 3-Column Responsive Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: CinemaStream 3D */}
          <div className="group relative rounded-2xl bg-gradient-to-b from-[#120a0f] via-[#0e090f] to-[#08080a] border border-[#a51d35]/35 hover:border-[#a51d35]/80 p-6 sm:p-7 transition-all duration-300 hover:shadow-[0_0_35px_rgba(165,29,53,0.35)] flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#a51d35] to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />

            <div className="space-y-5">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#a51d35] to-[#5a0f1d] border border-[#d4af70]/40 flex items-center justify-center text-[#d4af70] shadow-[0_0_20px_rgba(165,29,53,0.6)] group-hover:scale-105 transition-transform">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#d4af70] font-bold block">
                      CINEMA 3D STREAM
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white font-mono tracking-tight">
                      Cinema<span className="text-[#a51d35]">Stream</span> 4K
                    </h3>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-[#a51d35]/25 border border-[#a51d35]/50 text-[#d4af70] text-[10px] font-mono font-bold">
                  4K ULTRA HD
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                {language === 'vi'
                  ? 'Rạp chiếu phim điện ảnh 4K với hiệu ứng mở màn rèm nhung WebGL chân thực bằng Three.js. Thưởng thức 78+ phim chiếu rạp, phim bộ và anime bom tấn cùng trình phát video tùy chỉnh cao cấp.'
                  : 'Cinematic streaming platform featuring realistic Three.js WebGL velvet drapery physics. Discover 78+ curated master films, series, and anime with adaptive 4K playback.'}
              </p>

              {/* Feature Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs font-mono text-[#a1a1aa]">
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#181116] border border-[#261720]">
                  <Layers className="w-3.5 h-3.5 text-[#d4af70] shrink-0" />
                  <span className="text-[11px]">{language === 'vi' ? 'Rèm nhung 3D Three.js' : 'Three.js 3D Curtains'}</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#181116] border border-[#261720]">
                  <Tv className="w-3.5 h-3.5 text-[#a51d35] shrink-0" />
                  <span className="text-[11px]">{language === 'vi' ? '78+ Phim rạp & Anime' : '78+ Films & Anime'}</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#181116] border border-[#261720]">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af70] shrink-0" />
                  <span className="text-[11px]">{language === 'vi' ? 'Trailer 4K & Phụ đề' : '4K Trailers'}</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#181116] border border-[#261720]">
                  <Sliders className="w-3.5 h-3.5 text-[#a51d35] shrink-0" />
                  <span className="text-[11px]">{language === 'vi' ? 'Bộ lọc thể loại & Watchlist' : 'Genre Filter'}</span>
                </div>
              </div>
            </div>

            {/* Action Bottom */}
            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={openCinema}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#a51d35] to-[#7f1326] hover:from-[#ba213c] hover:to-[#8f152b] text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(165,29,53,0.45)] hover:shadow-[0_0_30px_rgba(165,29,53,0.65)] transition-all cursor-pointer group/btn"
              >
                <span>{language === 'vi' ? 'VÀO RẠP CHIẾU 4K' : 'ENTER 3D THEATER'}</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 2: Private Music Theater */}
          <div className="group relative rounded-2xl bg-gradient-to-b from-[#131010] via-[#100d0e] to-[#0a0909] border border-[#C6A878]/35 hover:border-[#C6A878]/80 p-6 sm:p-7 transition-all duration-300 hover:shadow-[0_0_35px_rgba(198,168,120,0.3)] flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C6A878] to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />

            <div className="space-y-5">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#542C35] to-[#321B22] border border-[#C6A878]/50 flex items-center justify-center text-[#C6A878] shadow-[0_0_20px_rgba(198,168,120,0.4)] group-hover:scale-105 transition-transform">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#C6A878] font-bold block">
                      PRIVATE MUSIC THEATER
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white font-mono tracking-tight">
                      Classical <span className="text-[#C6A878]">Theater</span>
                    </h3>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-[#C6A878]/20 border border-[#C6A878]/40 text-[#D6AD73] text-[10px] font-mono font-bold">
                  HI-RES LOSSLESS
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                {language === 'vi'
                  ? 'Thính phòng âm nhạc cổ điển sang trọng với kịch bản mở rèm & tắt đèn 4 màn GSAP. Tích hợp 20+ ca khúc hot V-Pop (Sơn Tùng, Đen Vâu, Vũ...) và kho nhạc lossless cá nhân lưu trữ an toàn bằng IndexedDB.'
                  : 'Luxurious concert hall experience with 4-scene GSAP lighting reveal. Enjoy 20+ Vietnamese trending hits and import personal lossless audio via client IndexedDB.'}
              </p>

              {/* Feature Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs font-mono text-[#a1a1aa]">
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#181615] border border-[#28221f]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C6A878] shrink-0" />
                  <span className="text-[11px]">{language === 'vi' ? 'BXH Hot V-Pop 2024' : 'Hot V-Pop Charts'}</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#181615] border border-[#28221f]">
                  <HardDrive className="w-3.5 h-3.5 text-[#D6AD73] shrink-0" />
                  <span className="text-[11px]">{language === 'vi' ? 'Nhập FLAC, MP3, WAV' : 'Lossless Audio Import'}</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#181615] border border-[#28221f]">
                  <Layers className="w-3.5 h-3.5 text-[#C6A878] shrink-0" />
                  <span className="text-[11px]">{language === 'vi' ? 'Lưu trữ IndexedDB cục bộ' : 'Private Local Vault'}</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#181615] border border-[#28221f]">
                  <Sliders className="w-3.5 h-3.5 text-[#D6AD73] shrink-0" />
                  <span className="text-[11px]">{language === 'vi' ? 'Quản lý Playlist & Phím tắt' : 'Playlist & Hotkeys'}</span>
                </div>
              </div>
            </div>

            {/* Action Bottom */}
            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={openMusic}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#542C35] to-[#3a1d24] hover:from-[#663540] hover:to-[#4a262f] text-[#F1EDE6] hover:text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(198,168,120,0.35)] hover:shadow-[0_0_30px_rgba(198,168,120,0.55)] transition-all cursor-pointer group/btn"
              >
                <span>{language === 'vi' ? 'VÀO NHÀ HÁT NHẠC' : 'ENTER MUSIC THEATER'}</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-[#C6A878]" />
              </button>
            </div>
          </div>

          {/* Card 3: Comic & Manga Lounge */}
          <div className="group relative rounded-2xl bg-gradient-to-b from-[#0a1526] via-[#091122] to-[#060b17] border border-[#00d2ff]/35 hover:border-[#00d2ff]/80 p-6 sm:p-7 transition-all duration-300 hover:shadow-[0_0_35px_rgba(0,210,255,0.3)] flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />

            <div className="space-y-5">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0c2847] to-[#06182c] border border-[#00d2ff]/50 flex items-center justify-center text-[#00d2ff] shadow-[0_0_20px_rgba(0,210,255,0.4)] group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#00d2ff] font-bold block">
                      MANGA & WEBTOON
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white font-mono tracking-tight">
                      Comic <span className="text-[#00d2ff]">Lounge</span>
                    </h3>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-[#00d2ff]/20 border border-[#00d2ff]/40 text-[#00d2ff] text-[10px] font-mono font-bold">
                  WEBTOON HD
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                {language === 'vi'
                  ? 'Thư viện đọc truyện tranh Manga & Webtoon tích hợp trực tiếp. Đọc One Piece, Solo Leveling, Doraemon, Kimetsu no Yaiba với chế độ cuộn dọc cinematic, thu phóng HD và lưu bookmark yêu thích.'
                  : 'Integrated Manga & Webtoon reading lounge. Enjoy One Piece, Solo Leveling, Doraemon, Demon Slayer with vertical webtoon scroll, HD zoom, and bookmarks.'}
              </p>

              {/* Feature Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs font-mono text-[#a1a1aa]">
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#0e1b33] border border-[#172c54]">
                  <Smartphone className="w-3.5 h-3.5 text-[#00d2ff] shrink-0" />
                  <span className="text-[11px]">{language === 'vi' ? 'Cuộn Webtoon dọc mượt mà' : 'Vertical Webtoon Scroll'}</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#0e1b33] border border-[#172c54]">
                  <Eye className="w-3.5 h-3.5 text-[#00d2ff] shrink-0" />
                  <span className="text-[11px]">{language === 'vi' ? 'Không quảng cáo nhảy tab' : 'No External Ads'}</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#0e1b33] border border-[#172c54]">
                  <Bookmark className="w-3.5 h-3.5 text-[#00d2ff] shrink-0" />
                  <span className="text-[11px]">{language === 'vi' ? 'Đánh dấu chương & Yêu thích' : 'Chapter Bookmarks'}</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#0e1b33] border border-[#172c54]">
                  <Sparkles className="w-3.5 h-3.5 text-[#00d2ff] shrink-0" />
                  <span className="text-[11px]">{language === 'vi' ? 'Truyện hot Shonen & Fantasy' : 'Top Shonen & Fantasy'}</span>
                </div>
              </div>
            </div>

            {/* Action Bottom */}
            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsComicModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#008db3] to-[#006080] hover:from-[#00b0dd] hover:to-[#007a99] text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(0,210,255,0.35)] hover:shadow-[0_0_30px_rgba(0,210,255,0.55)] transition-all cursor-pointer group/btn"
              >
                <span>{language === 'vi' ? 'MỞ PHÒNG ĐỌC TRUYỆN' : 'ENTER COMIC LOUNGE'}</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-[#00d2ff]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comic Reader Modal */}
      <ComicReadingModal
        isOpen={isComicModalOpen}
        onClose={() => setIsComicModalOpen(false)}
      />
    </section>
  )
}
