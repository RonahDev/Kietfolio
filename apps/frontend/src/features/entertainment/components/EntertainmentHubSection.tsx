import React from 'react'
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
} from 'lucide-react'

export const EntertainmentHubSection: React.FC = () => {
  const { language } = useLanguage()

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
      aria-label={language === 'vi' ? 'Trung tâm giải trí đa phương tiện' : 'Multimedia Platform Hub'}
    >
      {/* Background Ambient Decorative Lights */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-96 h-96 bg-[#a51d35]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-[#C6A878]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#172847]/70 pb-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a1224] border border-[#172847] text-xs font-mono text-[#00d2ff]">
              <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-ping" />
              <span className="uppercase tracking-widest font-bold">
                {language === 'vi' ? 'TRUNG TÂM NỀN TẢNG TRẢI NGHIỆM' : 'MULTIMEDIA PLATFORM ECOSYSTEM'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#f1f5f9] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              {language === 'vi'
                ? 'Không Gian Điện Ảnh 4K & Thính Phòng Âm Nhạc'
                : '3D Cinema Hall & Classical Music Theater'}
            </h2>

            <p className="text-sm sm:text-base text-[#94a3b8] font-['Be_Vietnam_Pro',sans-serif] leading-relaxed">
              {language === 'vi'
                ? 'Hai nền tảng web ứng dụng nghệ thuật được phát triển độc lập trên Kietfolio: Rạp chiếu phim 3D Three.js và Nhà hát âm nhạc số cá nhân hỗ trợ nhập nhạc lossless.'
                : 'Explore two distinct immersive web applications engineered on Kietfolio: Three.js WebGL 3D Cinema Theater and Private Music Hall with personal lossless audio management.'}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[#64748b]">
            <span className="hidden sm:inline">// MULTIMEDIA_STREAM_V2.0</span>
          </div>
        </div>

        {/* 2-Column Responsive Platform Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: CinemaStream 3D */}
          <div className="group relative rounded-2xl bg-gradient-to-b from-[#120a0f] via-[#0e090f] to-[#08080a] border border-[#a51d35]/35 hover:border-[#a51d35]/80 p-6 sm:p-8 transition-all duration-300 hover:shadow-[0_0_35px_rgba(165,29,53,0.35)] flex flex-col justify-between overflow-hidden">
            {/* Top Glow Accent Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#a51d35] to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />

            <div className="space-y-6">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#a51d35] to-[#5a0f1d] border border-[#d4af70]/40 flex items-center justify-center text-[#d4af70] shadow-[0_0_20px_rgba(165,29,53,0.6)] group-hover:scale-105 transition-transform">
                    <Film className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-[#d4af70] font-bold block">
                      CINEMA 3D STREAM
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                      Cinema<span className="text-[#a51d35]">Stream</span> 4K
                    </h3>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-[#a51d35]/25 border border-[#a51d35]/50 text-[#d4af70] text-[11px] font-mono font-bold">
                  4K ULTRA HD
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#cbd5e1] leading-relaxed">
                {language === 'vi'
                  ? 'Rạp chiếu phim điện ảnh 4K với hiệu ứng mở màn rèm nhung WebGL chân thực bằng Three.js & GLSL Shaders. Thưởng thức kho tàng 78+ phim chiếu rạp, phim bộ và anime bom tấn cùng trình phát video tùy chỉnh cao cấp.'
                  : 'Cinematic streaming platform featuring realistic Three.js WebGL velvet drapery physics and custom GLSL shaders. Discover 78+ curated master films, series, and anime with adaptive 4K playback.'}
              </p>

              {/* Feature Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-mono text-[#a1a1aa]">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#181116] border border-[#261720]">
                  <Layers className="w-4 h-4 text-[#d4af70] shrink-0" />
                  <span>{language === 'vi' ? 'Rèm nhung 3D Three.js' : 'Three.js 3D Velvet Curtain'}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#181116] border border-[#261720]">
                  <Tv className="w-4 h-4 text-[#a51d35] shrink-0" />
                  <span>{language === 'vi' ? '78+ Phim rạp & Anime' : '78+ Master Films & Anime'}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#181116] border border-[#261720]">
                  <Sparkles className="w-4 h-4 text-[#d4af70] shrink-0" />
                  <span>{language === 'vi' ? 'Trailer 4K & Phụ đề' : '4K Trailers & Subtitles'}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#181116] border border-[#261720]">
                  <Sliders className="w-4 h-4 text-[#a51d35] shrink-0" />
                  <span>{language === 'vi' ? 'Bộ lọc thể loại điện ảnh' : 'Genre Filter & Watchlist'}</span>
                </div>
              </div>
            </div>

            {/* Action Bottom */}
            <div className="pt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={openCinema}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#a51d35] to-[#7f1326] hover:from-[#ba213c] hover:to-[#8f152b] text-white font-mono text-sm font-bold shadow-[0_0_20px_rgba(165,29,53,0.45)] hover:shadow-[0_0_30px_rgba(165,29,53,0.65)] transition-all cursor-pointer group/btn"
              >
                <span>{language === 'vi' ? 'VÀO RẠP CHIẾU 4K' : 'ENTER 3D THEATER'}</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>

              <span className="hidden sm:inline font-mono text-[11px] text-[#71717a]">
                #cinema
              </span>
            </div>
          </div>

          {/* Card 2: Private Music Theater */}
          <div className="group relative rounded-2xl bg-gradient-to-b from-[#131010] via-[#100d0e] to-[#0a0909] border border-[#C6A878]/35 hover:border-[#C6A878]/80 p-6 sm:p-8 transition-all duration-300 hover:shadow-[0_0_35px_rgba(198,168,120,0.3)] flex flex-col justify-between overflow-hidden">
            {/* Top Glow Accent Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C6A878] to-transparent opacity-75 group-hover:opacity-100 transition-opacity" />

            <div className="space-y-6">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#542C35] to-[#321B22] border border-[#C6A878]/50 flex items-center justify-center text-[#C6A878] shadow-[0_0_20px_rgba(198,168,120,0.4)] group-hover:scale-105 transition-transform">
                    <Music className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-[#C6A878] font-bold block">
                      PRIVATE MUSIC THEATER
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                      Classical <span className="text-[#C6A878]">Theater</span>
                    </h3>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-[#C6A878]/20 border border-[#C6A878]/40 text-[#D6AD73] text-[11px] font-mono font-bold">
                  HI-RES LOSSLESS
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#cbd5e1] leading-relaxed">
                {language === 'vi'
                  ? 'Thính phòng âm nhạc cổ điển sang trọng với kịch bản mở rèm nhung & tắt đèn sân khấu 4 màn GSAP Timeline. Thưởng thức tác phẩm giao hưởng kiệt tác và tự do nhập nhạc lossless cá nhân (MP3, WAV, FLAC, M4A) lưu trữ an toàn bằng IndexedDB.'
                  : 'Luxurious classical concert hall music experience with 4-scene GSAP curtain draw and stage lighting choreography. Stream classical masterworks and privately import your personal lossless audio via client IndexedDB.'}
              </p>

              {/* Feature Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-mono text-[#a1a1aa]">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#181615] border border-[#28221f]">
                  <Sparkles className="w-4 h-4 text-[#C6A878] shrink-0" />
                  <span>{language === 'vi' ? 'Tắt đèn sân khấu 4 màn GSAP' : '4-Scene GSAP Lighting Reveal'}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#181615] border border-[#28221f]">
                  <HardDrive className="w-4 h-4 text-[#D6AD73] shrink-0" />
                  <span>{language === 'vi' ? 'Nhập nhạc lossless (FLAC, MP3...)' : 'Import Local Audio (Lossless)'}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#181615] border border-[#28221f]">
                  <Layers className="w-4 h-4 text-[#C6A878] shrink-0" />
                  <span>{language === 'vi' ? 'Lưu trữ IndexedDB nội bộ' : 'Private IndexedDB Local Storage'}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#181615] border border-[#28221f]">
                  <Sliders className="w-4 h-4 text-[#D6AD73] shrink-0" />
                  <span>{language === 'vi' ? 'Quản lý Playlist & Phím tắt' : 'Playlist Manager & Hotkeys'}</span>
                </div>
              </div>
            </div>

            {/* Action Bottom */}
            <div className="pt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={openMusic}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#542C35] to-[#3a1d24] hover:from-[#663540] hover:to-[#4a262f] text-[#F1EDE6] hover:text-white font-mono text-sm font-bold shadow-[0_0_20px_rgba(198,168,120,0.35)] hover:shadow-[0_0_30px_rgba(198,168,120,0.55)] transition-all cursor-pointer group/btn"
              >
                <span>{language === 'vi' ? 'VÀO NHÀ HÁT NHẠC' : 'ENTER MUSIC THEATER'}</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-[#C6A878]" />
              </button>

              <span className="hidden sm:inline font-mono text-[11px] text-[#71717a]">
                #music
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
