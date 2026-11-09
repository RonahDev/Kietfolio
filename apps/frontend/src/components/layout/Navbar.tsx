import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { isReducedMotion } from '@/animations'
import { useLanguage, useAuth, useWhaleCinematic } from '@/hooks'
import {
  Menu,
  X,
  Globe,
  Terminal,
  Shield,
  LogOut,
  ChevronDown,
  LogIn,
  UserPlus,
  Coffee,
  Crown,
  Sparkles,
  Film,
} from 'lucide-react'

export const Navbar: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage()
  const { user, isAdmin, isVip, openAuthModal, openAdminModal, openVipModal, signOutUser } = useAuth()
  const { triggerWhaleCinematic } = useWhaleCinematic()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const headerRef = useRef<HTMLElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const navLinks = [
    { id: 'about', label: t.nav.about },
    { id: 'projects', label: t.nav.projects },
    { id: 'experience', label: t.nav.experience },
    { id: 'skills', label: t.nav.skills },
    { id: 'guestbook', label: language === 'vi' ? 'Lưu bút' : 'Guestbook' },
    { id: 'contact', label: t.nav.contact },
  ]

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30)

          const sections = ['hero', 'about', 'projects', 'experience', 'skills', 'guestbook', 'contact']
          const scrollPosition = window.scrollY + 200

          for (const sectionId of sections) {
            const el = document.getElementById(sectionId)
            if (el) {
              const top = el.offsetTop
              const height = el.offsetHeight
              if (scrollPosition >= top && scrollPosition < top + height) {
                setActiveSection(sectionId)
                break
              }
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) setMobileMenuOpen(false)
        if (userDropdownOpen) setUserDropdownOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen, userDropdownOpen])

  useEffect(() => {
    if (isReducedMotion() || !headerRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        yPercent: -100,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050a14]/85 backdrop-blur-md border-b border-[#172847]/80 shadow-lg shadow-[#02050a]/40 py-2.5'
          : 'bg-transparent py-4 border-b border-transparent'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo / Monogram */}
          <a
            href="#hero"
            className="group flex items-center gap-2.5 text-[#f1f5f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2ff] shrink-0"
            aria-label="Mai Anh Kiệt — Home"
          >
            <div className="w-8 h-8 rounded-sm bg-[#0a1224] border border-[#172847] flex items-center justify-center text-[#00d2ff] group-hover:border-[#00d2ff] transition-colors shadow-[0_0_10px_rgba(0,210,255,0.15)]">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold tracking-tight text-[#f1f5f9] group-hover:text-[#00d2ff] transition-colors flex items-center gap-1.5">
                KIỆT.DEV
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-pulse" />
              </span>
              <span className="font-mono text-[9px] text-[#64748b] tracking-wider uppercase">
                FPT.SE // 2005
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links (Clean Floating Pill) */}
          <nav
            className="hidden lg:flex items-center gap-0.5 bg-[#0a1224]/80 border border-[#172847] px-2.5 py-1 rounded-full backdrop-blur-md shadow-inner shadow-[#00d2ff]/5"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`px-3 py-1 text-xs font-mono tracking-wide transition-all rounded-full ${
                    isActive
                      ? 'text-[#050a14] bg-[#00d2ff] font-bold shadow-[0_0_12px_rgba(0,210,255,0.35)]'
                      : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0f1b33]/60'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </a>
              )
            })}
          </nav>

          {/* Right Actions for Desktop / Tablet: Auth, VIP, Donate, Language */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {/* Upgrade to VIP button (prominently displayed when not VIP and not Admin) */}
            {(!user || (!isVip && !isAdmin)) && (
              <button
                type="button"
                onClick={openVipModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-amber-500/40 bg-gradient-to-r from-amber-500/15 to-amber-500/25 hover:from-amber-500/25 hover:to-amber-500/35 text-amber-300 rounded-full transition-all cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.2)] hover:shadow-[0_0_18px_rgba(245,158,11,0.35)] hover:border-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                title={language === 'vi' ? 'Nâng cấp lên Tài Khoản VIP' : 'Upgrade to VIP Partner'}
              >
                <Crown className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="font-bold">{language === 'vi' ? 'Nâng Cấp VIP' : 'Upgrade VIP'}</span>
              </button>
            )}

            {/* Authentication Button / User Profile Menu */}
            {!user ? (
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#172847] bg-[#0a1224]/80 hover:border-[#00d2ff]/60 text-[#f1f5f9] hover:text-[#00d2ff] rounded-full transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(0,210,255,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2ff]"
                title={t.nav.signIn}
              >
                <LogIn className="w-3.5 h-3.5 text-[#00d2ff]" />
                <span className="font-semibold">{t.nav.signIn}</span>
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono border rounded-full transition-all cursor-pointer ${
                    isAdmin
                      ? 'border-[#00d2ff]/60 bg-[#0c182e] text-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.25)]'
                      : isVip
                      ? 'border-amber-400/80 bg-amber-950/30 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : 'border-[#172847] bg-[#0a1224] text-[#f1f5f9] hover:border-[#00d2ff]/40'
                  }`}
                >
                  <img
                    src={user.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=Visitor'}
                    alt={user.displayName || 'User'}
                    className={`w-5 h-5 rounded-full border shrink-0 object-cover ${
                      isVip ? 'border-amber-400' : 'border-[#00d2ff]/40'
                    }`}
                  />
                  <span className="font-semibold max-w-[80px] truncate flex items-center gap-1">
                    {user.displayName?.split(' ')[0] || 'User'}
                    {isVip && !isAdmin && <Crown className="w-3 h-3 text-amber-400 shrink-0" />}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#94a3b8]" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg bg-[#0a1224]/95 border border-[#172847] shadow-2xl p-2.5 font-mono z-50 text-xs backdrop-blur-md">
                    <div className="p-2 border-b border-[#172847] mb-1">
                      <div className="font-bold text-[#f1f5f9] truncate flex items-center gap-1.5">
                        <span>{user.displayName}</span>
                        {isVip && <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </div>
                      <div className="text-[11px] text-[#00d2ff] truncate">
                        {user.email}
                      </div>
                      <div className="mt-1 text-[9px]">
                        {isAdmin ? (
                          <span className="text-[#00d2ff] font-bold">CLEARANCE: ROOT_ADMIN (63BDG02)</span>
                        ) : isVip ? (
                          <span className="text-amber-300 font-bold flex items-center gap-1">
                            <Crown className="w-3 h-3 text-amber-400" />
                            CLEARANCE: VIP PARTNER (PREMIUM)
                          </span>
                        ) : (
                          <span className="text-slate-400">ROLE: THÀNH VIÊN TIÊU CHUẨN (MEMBER)</span>
                        )}
                      </div>
                    </div>

                    {/* Action 1: Upgrade to VIP (for normal members) */}
                    {!isVip && !isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          openVipModal()
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-left rounded-sm text-amber-300 hover:bg-amber-950/30 transition-colors cursor-pointer border border-amber-500/20 mb-1"
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-bold">Nâng Cấp Lên Tài Khoản VIP</span>
                      </button>
                    )}

                    {/* Action 2: Trigger VIP Whale (for VIP members) */}
                    {isVip && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          triggerWhaleCinematic()
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-left rounded-sm text-amber-300 hover:bg-amber-950/20 transition-colors cursor-pointer mb-1"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Vũ Điệu Cá Voi VIP (Theo yêu cầu)</span>
                      </button>
                    )}

                    {/* Action 3: Admin Dashboard (Strictly for Admin only) */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          openAdminModal()
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-left rounded-sm text-[#00d2ff] hover:bg-[#0f1b33] transition-colors cursor-pointer mb-1"
                      >
                        <Shield className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.nav.adminDashboard}</span>
                      </button>
                    )}

                    {/* Sign out */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false)
                        signOutUser()
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-left rounded-sm text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 shrink-0" />
                      <span>{t.nav.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Cinema Stream Platform Direct Entry */}
            <button
              type="button"
              onClick={() => {
                window.location.hash = 'cinema'
                window.dispatchEvent(
                  new CustomEvent('kietfolio:navigate-view', { detail: { view: 'cinema' } })
                )
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#a51d35]/60 bg-gradient-to-r from-[#a51d35]/25 via-[#6e0d1f]/40 to-[#a51d35]/25 hover:from-[#a51d35] hover:to-[#8c1228] text-rose-200 hover:text-white rounded-full transition-all shadow-sm hover:shadow-[0_0_15px_rgba(165,29,53,0.5)] cursor-pointer group"
              title={language === 'vi' ? 'Mở Rạp Phim 3D Cinema Stream' : 'Open 3D Cinema Stream'}
            >
              <Film className="w-3.5 h-3.5 text-[#d4af70] group-hover:scale-110 transition-transform" />
              <span className="font-bold text-[11px]">{language === 'vi' ? 'Rạp Phim 3D' : 'Cinema 3D'}</span>
              <span className="px-1 py-0.2 rounded-xs bg-[#d4af70]/20 text-[#d4af70] text-[9px] font-bold">
                4K
              </span>
            </button>

            {/* Donate VNPay QR Button */}
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent('kietfolio:open-donate-modal', { detail: { type: 'coffee' } })
                )
              }
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-full transition-all shadow-sm hover:shadow-[0_0_12px_rgba(245,158,11,0.2)] cursor-pointer"
              title={language === 'vi' ? 'Ủng hộ tách cà phê (VietQR / MoMo)' : 'Donate / Buy me a coffee'}
            >
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xl:inline font-semibold">{language === 'vi' ? 'Ủng Hộ' : 'Donate'}</span>
            </button>

            {/* Language Switch Button */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono border border-[#172847] bg-[#0a1224]/80 hover:border-[#00d2ff]/50 text-[#94a3b8] hover:text-[#00d2ff] rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2ff] cursor-pointer"
              aria-label={`Switch language. Current: ${language.toUpperCase()}`}
              title="Chuyển đổi Ngôn ngữ / Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#00d2ff]" />
              <span className="font-bold text-[11px]">{language.toUpperCase()}</span>
            </button>
          </div>

          {/* Mobile & Small Screen Action Bar (< md) */}
          <div className="flex md:hidden items-center gap-2">
            {/* Quick Language Toggle */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="px-2.5 py-1 border border-[#172847] bg-[#0a1224] text-xs font-mono text-[#00d2ff] rounded-full cursor-pointer"
              aria-label="Toggle language"
            >
              {language.toUpperCase()}
            </button>

            {/* Quick Donate Icon */}
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent('kietfolio:open-donate-modal', { detail: { type: 'coffee' } })
                )
              }
              className="p-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 cursor-pointer"
              title={language === 'vi' ? 'Ủng hộ cà phê' : 'Donate'}
            >
              <Coffee className="w-4 h-4 text-amber-400" />
            </button>

            {/* Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-1.5 rounded-full border border-[#172847] bg-[#0a1224] text-[#f1f5f9] hover:text-[#00d2ff] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2ff] cursor-pointer"
              aria-label={mobileMenuOpen ? t.nav.close : t.nav.menu}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Slide-down with generous spacing) */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-x-0 top-[54px] bg-[#050a14]/98 border-b border-[#172847] backdrop-blur-xl px-6 py-6 transition-all shadow-2xl z-50 max-h-[calc(100vh-60px)] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
        >
          <div className="flex flex-col space-y-3 font-mono">
            {/* User status card in mobile drawer */}
            {user ? (
              <div className="p-3 mb-2 rounded-lg bg-[#0a1224] border border-[#172847] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={user.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=Visitor'}
                    alt="User"
                    className={`w-8 h-8 rounded-full border ${
                      isVip ? 'border-amber-400' : 'border-[#00d2ff]'
                    }`}
                  />
                  <div>
                    <div className="text-xs font-bold text-[#f1f5f9] flex items-center gap-1">
                      <span>{user.displayName}</span>
                      {isVip && <Crown className="w-3 h-3 text-amber-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-[#00d2ff]">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {!isVip && !isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        openVipModal()
                      }}
                      className="px-2 py-1 rounded-sm bg-amber-400 text-[#050a14] text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                    >
                      <Crown className="w-3 h-3" />
                      <span>VIP</span>
                    </button>
                  )}
                  {isVip && !isAdmin && (
                    <span className="px-1.5 py-0.5 rounded-sm bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/40">
                      VIP
                    </span>
                  )}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        openAdminModal()
                      }}
                      className="px-2 py-1 rounded-sm bg-[#00d2ff] text-[#050a14] text-[10px] font-bold cursor-pointer"
                    >
                      ADMIN
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      signOutUser()
                    }}
                    className="p-1 rounded-sm text-red-400 hover:bg-red-950/40 cursor-pointer"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 mb-2 rounded-lg bg-[#0a1224] border border-[#172847] space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" />
                    <span className="font-mono">{t.nav.guest}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#64748b]">
                    {language === 'vi' ? 'Chưa đăng nhập' : 'Not logged in'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      openAuthModal('signin')
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#172847] bg-[#070d18] text-[#f1f5f9] text-xs font-mono font-bold cursor-pointer hover:border-[#00d2ff]"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#00d2ff]" />
                    <span>{t.nav.signIn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      openAuthModal('signup')
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#00d2ff]/60 bg-[#0c182e] text-[#00d2ff] text-xs font-mono font-bold cursor-pointer hover:bg-[#00d2ff] hover:text-[#050a14]"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{t.nav.signUp}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    openVipModal()
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-mono font-bold cursor-pointer hover:bg-amber-500/20"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Nâng Cấp Lên Tài Khoản VIP</span>
                </button>
              </div>
            )}

            {/* Mobile Cinema Stream Button */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false)
                window.location.hash = 'cinema'
                window.dispatchEvent(
                  new CustomEvent('kietfolio:navigate-view', { detail: { view: 'cinema' } })
                )
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-[#a51d35]/60 bg-gradient-to-r from-[#a51d35]/20 to-[#6e0d1f]/30 text-rose-200 text-sm font-mono font-bold"
            >
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[#d4af70]" />
                <span>Rạp Phim 3D (Cinema Stream)</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-xs bg-[#d4af70]/20 text-[#d4af70] text-[10px]">
                4K
              </span>
            </button>

            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 text-sm rounded-lg transition-colors ${
                    isActive
                      ? 'text-[#050a14] bg-[#00d2ff] font-bold shadow-[0_0_12px_rgba(0,210,255,0.3)]'
                      : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0a1224]'
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-[10px] opacity-60">#{link.id}</span>
                </a>
              )
            })}

            <div className="pt-3 border-t border-[#172847] flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  window.dispatchEvent(
                    new CustomEvent('kietfolio:open-donate-modal', { detail: { type: 'coffee' } })
                  )
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-mono text-xs font-bold transition-all shadow-[0_0_12px_rgba(245,158,11,0.15)] cursor-pointer"
              >
                <Coffee className="w-4 h-4 text-amber-400" />
                <span>{language === 'vi' ? 'Ủng hộ tách cà phê (VietQR / MoMo)' : 'Donate / Buy Coffee'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
