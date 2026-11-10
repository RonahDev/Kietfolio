import React, { useState, useEffect, useRef } from 'react'
import { useCinema } from '../hooks/useCinema'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { CINEMA_GENRES, CINEMA_GENRE_GROUPS } from '../data/moviesData'
import type { CinemaViewTab } from '../types/cinema'
import {
  Film,
  Search,
  X,
  ChevronDown,
  Bookmark,
  TrendingUp,
  RotateCcw,
  ArrowLeft,
  Menu,
  Crown,
  Shield,
  Sparkles,
} from 'lucide-react'

interface CinemaNavbarProps {
  onBackToPortfolio: () => void
}

export const CinemaNavbar: React.FC<CinemaNavbarProps> = ({ onBackToPortfolio }) => {
  const {
    activeTab,
    setActiveTab,
    selectedGenre,
    setSelectedGenre,
    searchQuery,
    setSearchQuery,
    watchlist,
    triggerCurtainReplay,
  } = useCinema()

  const { user, isVip, isAdmin, openVipModal } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isGenreOpen, setIsGenreOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileGenreOpen, setIsMobileGenreOpen] = useState(false)
  const genreDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target as Node)) {
        setIsGenreOpen(false)
      }
    }
    if (isGenreOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isGenreOpen])

  const handleTabClick = (tab: CinemaViewTab) => {
    setActiveTab(tab)
    if (tab !== 'all') {
      setSelectedGenre('all')
    }
    setIsMobileMenuOpen(false)
  }

  const handleGenreSelect = (genreId: string) => {
    setSelectedGenre(genreId)
    setActiveTab('all')
    setSearchQuery('')
    setIsGenreOpen(false)
    setIsMobileMenuOpen(false)
    setIsMobileGenreOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-sans ${
        isScrolled
          ? 'bg-[#08090d]/95 backdrop-blur-md border-b border-[#181b24] shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-3'
          : 'bg-gradient-to-b from-[#08090d]/90 via-[#08090d]/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand Identity & Back to Portfolio */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onBackToPortfolio}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#11131a] border border-[#181b24] text-xs font-mono text-[#a1a1aa] hover:text-[#f5f5f5] hover:border-[#a51d35] transition-all cursor-pointer"
            title="Quay lại Portfolio chính của Mai Anh Kiệt"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Portfolio</span>
          </button>

          <div
            onClick={() => handleTabClick('all')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-[#a51d35] to-[#5a0f1d] border border-[#d4af70]/40 flex items-center justify-center text-[#d4af70] shadow-[0_0_15px_rgba(165,29,53,0.5)] group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-wider text-[#f5f5f5] font-mono">
                  CINEMA<span className="text-[#a51d35]">STREAM</span>
                </span>
                <span className="px-1.5 py-0.2 rounded-xs bg-[#d4af70]/20 text-[#d4af70] text-[9px] font-mono font-bold tracking-widest uppercase">
                  4K
                </span>
              </div>
              <span className="hidden sm:block text-[10px] font-mono text-[#a1a1aa] tracking-widest uppercase">
                BY MAI ANH KIỆT
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 pl-4">
            <button
              type="button"
              onClick={() => handleTabClick('all')}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono tracking-wide transition-colors cursor-pointer ${
                activeTab === 'all' && selectedGenre === 'all'
                  ? 'text-[#f5f5f5] font-bold border-b-2 border-[#a51d35]'
                  : 'text-[#a1a1aa] hover:text-[#f5f5f5]'
              }`}
            >
              Trang Chủ
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('theatrical')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono tracking-wide transition-colors cursor-pointer ${
                activeTab === 'theatrical'
                  ? 'text-[#f5f5f5] font-bold border-b-2 border-[#a51d35]'
                  : 'text-[#a1a1aa] hover:text-[#f5f5f5]'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-[#d4af70]" />
              <span>Chiếu Rạp</span>
              <span className="px-1 py-0.2 rounded-xs bg-[#a51d35] text-[9px] text-white font-bold animate-pulse">
                HOT
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('movies')}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono tracking-wide transition-colors cursor-pointer ${
                activeTab === 'movies'
                  ? 'text-[#f5f5f5] font-bold border-b-2 border-[#a51d35]'
                  : 'text-[#a1a1aa] hover:text-[#f5f5f5]'
              }`}
            >
              Phim Lẻ
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('series')}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono tracking-wide transition-colors cursor-pointer ${
                activeTab === 'series'
                  ? 'text-[#f5f5f5] font-bold border-b-2 border-[#a51d35]'
                  : 'text-[#a1a1aa] hover:text-[#f5f5f5]'
              }`}
            >
              Phim Bộ & Doc
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('trending')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono tracking-wide transition-colors cursor-pointer ${
                activeTab === 'trending'
                  ? 'text-[#f5f5f5] font-bold border-b-2 border-[#a51d35]'
                  : 'text-[#a1a1aa] hover:text-[#f5f5f5]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#a51d35]" />
              <span>Thịnh Hành</span>
            </button>

            {/* Genres Dropdown */}
            <div className="relative" ref={genreDropdownRef}>
              <button
                type="button"
                onClick={() => setIsGenreOpen(!isGenreOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono tracking-wide transition-colors cursor-pointer ${
                  selectedGenre !== 'all'
                    ? 'text-[#d4af70] font-bold bg-[#a51d35]/15 border border-[#a51d35]/40'
                    : 'text-[#a1a1aa] hover:text-[#f5f5f5]'
                }`}
              >
                <span>
                  {selectedGenre === 'all'
                    ? 'Thể Loại'
                    : CINEMA_GENRES.find((g) => g.id === selectedGenre)?.labelVi || 'Thể Loại'}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isGenreOpen ? 'rotate-180 text-[#d4af70]' : ''
                  }`}
                />
              </button>

              {isGenreOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 max-h-[28rem] overflow-y-auto rounded-md bg-[#0f1118]/98 backdrop-blur-xl border border-[#232734] shadow-[0_12px_40px_rgba(0,0,0,0.85)] py-2.5 z-50 divide-y divide-[#181b24] animate-in fade-in zoom-in-95 duration-150">
                  {CINEMA_GENRE_GROUPS.map((group) => (
                    <div key={group.id} className="py-2 first:pt-0 last:pb-0.5">
                      {/* Section Title Header */}
                      <div className="px-3.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[#d4af70] font-bold select-none flex items-center justify-between">
                        <span>{group.labelVi}</span>
                        <span className="text-[9px] text-[#71717a] font-normal lowercase">({group.genres.length})</span>
                      </div>

                      {/* Items in this group */}
                      <div className="space-y-0.5 mt-0.5">
                        {group.genres.map((g) => {
                          const isSelected = selectedGenre === g.id
                          return (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => handleGenreSelect(g.id)}
                              className={`w-full text-left px-3.5 py-1.5 text-xs font-mono flex items-center justify-between transition-colors cursor-pointer rounded-xs ${
                                isSelected
                                  ? 'bg-[#a51d35]/25 text-[#d4af70] font-bold border-l-2 border-[#d4af70]'
                                  : 'text-[#a1a1aa] hover:bg-[#181b24] hover:text-[#f5f5f5]'
                              }`}
                            >
                              <span className="truncate pr-2">{g.labelVi}</span>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                {g.badge && (
                                  <span className="px-1.5 py-0.2 rounded-xs bg-[#a51d35] text-[9px] font-bold text-white uppercase">
                                    {g.badge}
                                  </span>
                                )}
                                {isSelected && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af70]" />
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My List / Watchlist */}
            <button
              type="button"
              onClick={() => handleTabClick('watchlist')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono tracking-wide transition-colors cursor-pointer ${
                activeTab === 'watchlist'
                  ? 'text-[#f5f5f5] font-bold border-b-2 border-[#a51d35]'
                  : 'text-[#a1a1aa] hover:text-[#f5f5f5]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-[#d4af70]" />
              <span>Danh Sách Của Tôi</span>
              {watchlist.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#a51d35] text-[10px] font-bold text-white">
                  {watchlist.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Right: Search, Replay Curtain, User Profile */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center bg-[#11131a] border border-[#a51d35] rounded-full px-3 py-1.5 shadow-lg animate-in fade-in duration-200">
                <Search className="w-3.5 h-3.5 text-[#a1a1aa] mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm phim, đạo diễn, diễn viên..."
                  className="bg-transparent text-xs text-[#f5f5f5] placeholder-[#a1a1aa]/60 focus:outline-none w-44 sm:w-60 font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setIsSearchOpen(false)
                  }}
                  className="text-[#a1a1aa] hover:text-white ml-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full text-[#a1a1aa] hover:text-[#f5f5f5] hover:bg-[#11131a] transition-colors cursor-pointer"
                title="Tìm kiếm phim"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Replay Curtain Intro Button */}
          <button
            type="button"
            onClick={triggerCurtainReplay}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#11131a] border border-[#181b24] text-xs font-mono text-[#d4af70] hover:border-[#d4af70] transition-colors cursor-pointer"
            title="Mở lại màn rạp chiếu Three.js"
          >
            <RotateCcw className="w-3 h-3 text-[#d4af70]" />
            <span className="text-[11px]">Mở Rạp</span>
          </button>

          {/* User Tier Status Badge & VIP Upsell */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#181b24]">
              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => {
                    window.location.hash = '#admin'
                    window.dispatchEvent(
                      new CustomEvent('kietfolio:navigate-view', { detail: { view: 'admin' } })
                    )
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-xs bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold hover:bg-amber-400/30 transition-colors cursor-pointer"
                  title="Truy cập Bảng điều khiển Quản trị Movie Hub (Admin Dashboard)"
                >
                  <Shield className="w-3 h-3 text-amber-400" />
                  ADMIN
                </button>
              ) : isVip ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-xs bg-[#d4af70]/20 border border-[#d4af70]/40 text-[#d4af70] text-[10px] font-mono font-bold">
                  <Crown className="w-3 h-3" />
                  VIP 4K
                </span>
              ) : (
                <button
                  type="button"
                  onClick={openVipModal}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-xs bg-[#a51d35]/20 border border-[#a51d35]/40 text-rose-300 text-[10px] font-mono font-bold hover:bg-[#a51d35]/40 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  NÂNG VIP
                </button>
              )}
              <img
                src={user.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=Kietteve'}
                alt={user.displayName || 'User Avatar'}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full border border-[#d4af70]/50 object-cover"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={openVipModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#a51d35] to-[#701022] text-white text-xs font-mono font-bold hover:opacity-95 shadow-[0_0_15px_rgba(165,29,53,0.4)] transition-all cursor-pointer"
            >
              <Crown className="w-3 h-3 text-[#d4af70]" />
              <span>Hội Viên VIP</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-sm text-[#a1a1aa] hover:text-white cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#08090d]/98 border-b border-[#181b24] p-4 space-y-3 font-mono text-xs">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleTabClick('all')}
              className={`p-2 rounded-sm text-left ${
                activeTab === 'all' ? 'bg-[#a51d35]/20 text-white font-bold' : 'text-[#a1a1aa]'
              }`}
            >
              Trang Chủ
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('theatrical')}
              className={`p-2 rounded-sm text-left flex items-center justify-between ${
                activeTab === 'theatrical' ? 'bg-[#a51d35]/20 text-white font-bold' : 'text-[#a1a1aa]'
              }`}
            >
              <span>Phim Chiếu Rạp</span>
              <span className="px-1.5 py-0.2 rounded-xs bg-[#a51d35] text-[9px] text-white font-bold">
                HOT
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('movies')}
              className={`p-2 rounded-sm text-left ${
                activeTab === 'movies' ? 'bg-[#a51d35]/20 text-white font-bold' : 'text-[#a1a1aa]'
              }`}
            >
              Phim Lẻ (Movies)
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('series')}
              className={`p-2 rounded-sm text-left ${
                activeTab === 'series' ? 'bg-[#a51d35]/20 text-white font-bold' : 'text-[#a1a1aa]'
              }`}
            >
              Phim Bộ & Doc
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('trending')}
              className={`p-2 rounded-sm text-left ${
                activeTab === 'trending' ? 'bg-[#a51d35]/20 text-white font-bold' : 'text-[#a1a1aa]'
              }`}
            >
              Thịnh Hành
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('watchlist')}
              className={`p-2 rounded-sm text-left ${
                activeTab === 'watchlist' ? 'bg-[#a51d35]/20 text-white font-bold' : 'text-[#a1a1aa]'
              }`}
            >
              Danh Sách Của Tôi ({watchlist.length})
            </button>

            {/* Mobile Categorized Genre Accordion */}
            <div className="border-t border-[#181b24] pt-2">
              <button
                type="button"
                onClick={() => setIsMobileGenreOpen(!isMobileGenreOpen)}
                className="w-full p-2 rounded-sm text-left flex items-center justify-between text-[#a1a1aa] hover:text-white transition-colors"
              >
                <span className="font-bold">
                  {selectedGenre === 'all'
                    ? '📁 Chọn Thể Loại Phim'
                    : `📁 ${CINEMA_GENRES.find((g) => g.id === selectedGenre)?.labelVi || 'Thể Loại'}`}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isMobileGenreOpen ? 'rotate-180 text-[#d4af70]' : ''
                  }`}
                />
              </button>

              {isMobileGenreOpen && (
                <div className="pl-1 pr-1 py-2 space-y-3 max-h-72 overflow-y-auto bg-[#0b0d13] rounded-sm mt-1 border border-[#1b1f2b]">
                  {CINEMA_GENRE_GROUPS.map((group) => (
                    <div key={group.id} className="space-y-1">
                      <div className="text-[10px] font-mono uppercase text-[#d4af70] font-bold px-2 flex items-center justify-between">
                        <span>{group.labelVi}</span>
                        <span className="text-[9px] text-[#71717a] lowercase">({group.genres.length})</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 px-1">
                        {group.genres.map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => {
                              handleGenreSelect(g.id)
                              setIsMobileMenuOpen(false)
                            }}
                            className={`p-1.5 text-[11px] rounded-xs text-left truncate transition-colors ${
                              selectedGenre === g.id
                                ? 'bg-[#a51d35] text-white font-bold'
                                : 'text-[#a1a1aa] hover:bg-[#181b24] hover:text-white'
                            }`}
                          >
                            {g.labelVi}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-[#181b24] flex items-center justify-between">
            <button
              type="button"
              onClick={triggerCurtainReplay}
              className="flex items-center gap-1.5 text-[#d4af70]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xem lại Mở Màn Rạp</span>
            </button>
            <button
              type="button"
              onClick={onBackToPortfolio}
              className="flex items-center gap-1.5 text-[#a1a1aa]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Trở về Portfolio</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
