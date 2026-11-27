import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/hooks'
import { Terminal, Film, Music, BookOpen, Sparkles } from 'lucide-react'

export const PlatformNavDock: React.FC = () => {
  const { language } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 80)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigateTo = (view: 'cinema' | 'music') => {
    window.location.hash = view
    window.dispatchEvent(
      new CustomEvent('kietfolio:navigate-view', { detail: { view } })
    )
  }

  return (
    <aside
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 pointer-events-auto ${
        isScrolled
          ? 'translate-y-0 opacity-100 scale-100 shadow-[0_12px_45px_rgba(0,0,0,0.9)]'
          : 'translate-y-4 opacity-0 pointer-events-none md:translate-y-0 md:opacity-85 md:pointer-events-auto md:scale-95 shadow-[0_8px_32px_rgba(0,0,0,0.7)]'
      }`}
      aria-label={
        language === 'vi'
          ? 'Thanh điều hướng chuyển đổi nền tảng trải nghiệm'
          : 'Platform switcher navigation bar'
      }
    >
      <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-full bg-[#0a1224]/95 border border-[#172847] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] font-mono text-xs">
        {/* Hub indicator badge */}
        <div className="hidden lg:flex items-center gap-1.5 pl-3 pr-2.5 py-1 text-[11px] text-[#64748b] tracking-wider uppercase border-r border-[#172847]/80">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>{language === 'vi' ? 'SÂN GIẢI TRÍ' : 'LOUNGE'}</span>
        </div>

        {/* Option 1: Portfolio (Current Active View) */}
        <a
          href="#hero"
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#00d2ff] text-[#050a14] font-bold shadow-[0_0_14px_rgba(0,210,255,0.45)] select-none hover:bg-[#33dbff] transition-colors"
          title={
            language === 'vi'
              ? 'Trang Portfolio Kỹ Sư Phần Mềm (Đang mở)'
              : 'Software Engineer Portfolio (Active)'
          }
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="text-xs sm:text-sm tracking-tight">Portfolio</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#050a14] animate-pulse" />
        </a>

        {/* Option 2: Cinema 3D Stream */}
        <button
          type="button"
          onClick={() => navigateTo('cinema')}
          className="group flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-rose-200 hover:text-white bg-[#a51d35]/35 hover:bg-[#a51d35] border border-[#a51d35]/60 hover:border-[#a51d35] transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(165,29,53,0.5)]"
          title={
            language === 'vi'
              ? 'Chuyển sang Rạp Phim 3D CinemaStream (4K Three.js Velvet Theater)'
              : 'Switch to Cinema 3D Stream (4K Three.js Velvet Theater)'
          }
          aria-label={
            language === 'vi' ? 'Mở Rạp Phim 3D CinemaStream' : 'Open Cinema 3D Stream'
          }
        >
          <Film className="w-3.5 h-3.5 text-[#d4af70] group-hover:scale-110 transition-transform" />
          <span className="text-xs sm:text-sm font-semibold">
            {language === 'vi' ? 'Rạp Phim 3D' : 'Cinema 3D'}
          </span>
          <span className="px-1.5 py-0.2 rounded-xs bg-[#d4af70]/20 text-[#d4af70] group-hover:bg-white/20 group-hover:text-white text-[9px] font-bold">
            4K
          </span>
        </button>

        {/* Option 3: Private Music Theater (Nghe Nhạc) */}
        <button
          type="button"
          onClick={() => navigateTo('music')}
          className="group flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-amber-200 hover:text-white bg-gradient-to-r from-amber-500/30 via-[#542C35]/50 to-amber-500/30 hover:from-amber-500/50 hover:to-[#542C35] border border-amber-400/70 hover:border-amber-300 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_22px_rgba(245,158,11,0.55)]"
          title={
            language === 'vi'
              ? 'Chuyển sang Nhà Hát Nghe Nhạc (Private Music Theater & Bộ sưu tập cá nhân)'
              : 'Switch to Private Music Theater & Personal Collection'
          }
          aria-label={
            language === 'vi' ? 'Mở Nhà Hát Nghe Nhạc' : 'Open Private Music Theater'
          }
        >
          <Music className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform animate-pulse" />
          <span className="text-xs sm:text-sm font-bold tracking-tight text-amber-200 group-hover:text-white">
            {language === 'vi' ? 'Nghe Nhạc' : 'Music Theater'}
          </span>
          <span className="px-1.5 py-0.5 rounded-xs bg-amber-400/30 text-amber-300 group-hover:bg-amber-400 group-hover:text-[#050a14] text-[9px] font-bold">
            MỚI
          </span>
        </button>

        {/* Option 4: Comic Lounge */}
        <a
          href="#entertainment"
          className="group hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#94a3b8] hover:text-[#00d2ff] hover:bg-[#00d2ff]/10 border border-transparent hover:border-[#00d2ff]/40 transition-all cursor-pointer"
          title={
            language === 'vi'
              ? 'Đọc truyện tranh Manga, Webtoon & Sách điện tử'
              : 'Manga & Comic Reading Lounge'
          }
        >
          <BookOpen className="w-3.5 h-3.5 text-[#00d2ff] group-hover:scale-110 transition-transform" />
          <span className="text-xs sm:text-sm font-semibold">
            {language === 'vi' ? 'Đọc Truyện' : 'Comics'}
          </span>
        </a>
      </div>
    </aside>
  )
}
