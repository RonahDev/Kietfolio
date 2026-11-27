import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/hooks'
import { Terminal, Film, Music, Compass, Sparkles } from 'lucide-react'

export const PlatformNavDock: React.FC = () => {
  const { language } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 120)
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
      className={`fixed top-20 sm:top-22 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-auto ${
        isScrolled
          ? 'scale-95 opacity-95 hover:opacity-100 hover:scale-100 shadow-[0_10px_40px_rgba(0,0,0,0.85)]'
          : 'scale-100 opacity-100 shadow-[0_10px_35px_rgba(0,0,0,0.7)]'
      }`}
      aria-label={
        language === 'vi'
          ? 'Thanh điều hướng chuyển đổi nền tảng trải nghiệm'
          : 'Platform switcher navigation bar'
      }
    >
      <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-full bg-[#0a1224]/95 border border-[#172847] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] font-mono text-xs">
        {/* Hub indicator label (desktop only) */}
        <div className="hidden lg:flex items-center gap-1.5 pl-3 pr-2.5 py-1 text-[11px] text-[#64748b] tracking-wider uppercase border-r border-[#172847]/80">
          <Compass className="w-3.5 h-3.5 text-[#00d2ff] animate-spin" style={{ animationDuration: '12s' }} />
          <span>{language === 'vi' ? 'NỀN TẢNG' : 'PLATFORMS'}</span>
        </div>

        {/* Option 1: Portfolio (Current Active View) */}
        <div
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#00d2ff] text-[#050a14] font-bold shadow-[0_0_14px_rgba(0,210,255,0.45)] select-none"
          title={
            language === 'vi'
              ? 'Trang Portfolio Kỹ Sư Phần Mềm (Đang mở)'
              : 'Software Engineer Portfolio (Active)'
          }
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="text-xs sm:text-sm tracking-tight">Portfolio</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#050a14] animate-pulse" />
        </div>

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
          <Sparkles className="w-3 h-3 text-amber-400 group-hover:rotate-45 transition-transform hidden sm:inline" />
        </button>
      </div>
    </aside>
  )
}
