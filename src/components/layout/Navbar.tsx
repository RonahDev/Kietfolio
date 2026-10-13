import React, { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import {
  Menu,
  X,
  Globe,
  Terminal,
  ArrowUpRight,
  Shield,
  LogOut,
  ChevronDown,
  LogIn,
  UserPlus,
} from 'lucide-react'

export const Navbar: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage()
  const { user, isAdmin, openAuthModal, openAdminModal, signOutUser } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const dropdownRef = useRef<HTMLDivElement>(null)

  const navLinks = [
    { id: 'hero', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'experience', label: t.nav.experience },
    { id: 'skills', label: t.nav.skills },
    { id: 'principles', label: t.nav.principles },
    { id: 'guestbook', label: language === 'vi' ? 'Sổ lưu bút' : 'Guestbook' },
    { id: 'contact', label: t.nav.contact },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)

      // Active section spy
      const sections = ['hero', 'about', 'experience', 'skills', 'principles', 'guestbook', 'contact']
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050a14]/90 backdrop-blur-md border-b border-[#172847] shadow-lg shadow-[#02050a]/40 py-3'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Monogram */}
          <a
            href="#hero"
            className="group flex items-center gap-2.5 text-[#f1f5f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2ff]"
            aria-label="Mai Anh Kiệt — Home"
          >
            <div className="w-8 h-8 rounded-sm bg-[#0a1224] border border-[#172847] flex items-center justify-center text-[#00d2ff] group-hover:border-[#00d2ff] transition-colors shadow-[0_0_10px_rgba(0,210,255,0.15)]">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold tracking-tight text-[#f1f5f9] group-hover:text-[#00d2ff] transition-colors">
                KIỆT.DEV
              </span>
              <span className="font-mono text-[10px] text-[#64748b] tracking-widest uppercase">
                FPT.SE // 2005
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-1 bg-[#0a1224]/85 border border-[#172847] px-3 py-1.5 rounded-full backdrop-blur-md shadow-inner shadow-[#00d2ff]/5"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`px-3.5 py-1 text-xs font-mono tracking-wider transition-all rounded-full relative ${
                    isActive
                      ? 'text-[#050a14] bg-[#00d2ff] font-bold shadow-[0_0_14px_rgba(0,210,255,0.4)]'
                      : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0f1b33]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </a>
              )
            })}
          </nav>

          {/* Right Actions: Google Auth, Language Switch & Contact CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Google Authentication Button / User Profile Menu */}
            {!user ? (
              <div className="flex items-center gap-2">
                <span className="hidden xl:inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono rounded-xs bg-[#0a1224] border border-[#172847] text-[#64748b]">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" />
                  <span>{t.nav.guest}</span>
                </span>
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#172847] bg-[#0a1224] hover:border-[#00d2ff] text-[#f1f5f9] hover:text-[#00d2ff] rounded-sm transition-all shadow-[0_0_12px_rgba(0,210,255,0.08)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2ff]"
                  title={t.nav.signIn}
                >
                  <LogIn className="w-3.5 h-3.5 text-[#00d2ff]" />
                  <span className="font-bold">{t.nav.signIn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#00d2ff]/60 bg-[#0c182e] hover:bg-[#00d2ff] text-[#00d2ff] hover:text-[#050a14] rounded-sm transition-all shadow-[0_0_15px_rgba(0,210,255,0.2)] cursor-pointer font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2ff]"
                  title={t.nav.signUp}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{t.nav.signUp}</span>
                </button>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono border rounded-sm transition-all cursor-pointer ${
                    isAdmin
                      ? 'border-[#00d2ff]/60 bg-[#0c182e] text-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.25)]'
                      : 'border-[#172847] bg-[#0a1224] text-[#f1f5f9] hover:border-[#00d2ff]/40'
                  }`}
                >
                  <img
                    src={user.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=Visitor'}
                    alt={user.displayName || 'User'}
                    className="w-5 h-5 rounded-full border border-[#00d2ff]/40 shrink-0 object-cover"
                  />
                  <span className="font-bold max-w-[90px] truncate">
                    {user.displayName?.split(' ')[0] || 'User'}
                  </span>
                  <span
                    className={`text-[9px] px-1 rounded-xs font-bold ${
                      isAdmin ? 'bg-[#00d2ff] text-[#050a14]' : 'bg-[#172847] text-[#94a3b8]'
                    }`}
                  >
                    {isAdmin ? 'ADMIN' : 'USER'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#94a3b8]" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-sm bg-[#0a1224] border border-[#172847] shadow-2xl p-2.5 font-mono z-50 text-xs">
                    <div className="p-2 border-b border-[#172847] mb-1">
                      <div className="font-bold text-[#f1f5f9] truncate">
                        {user.displayName}
                      </div>
                      <div className="text-[11px] text-[#00d2ff] truncate">
                        {user.email}
                      </div>
                      <div className="mt-1 text-[9px] text-[#64748b]">
                        {isAdmin ? 'CLEARANCE: ADMIN (63BDG02)' : 'ROLE: VERIFIED VISITOR'}
                      </div>
                    </div>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          openAdminModal()
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-left rounded-sm text-[#00d2ff] hover:bg-[#0f1b33] transition-colors cursor-pointer"
                      >
                        <Shield className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.nav.adminDashboard}</span>
                      </button>
                    )}

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

            {/* Language Switch Button */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono border border-[#172847] bg-[#0a1224] hover:border-[#00d2ff] text-[#94a3b8] hover:text-[#00d2ff] rounded-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2ff] cursor-pointer"
              aria-label={`Switch language. Current: ${language.toUpperCase()}`}
              title="Toggle English / Vietnamese"
            >
              <Globe className="w-3.5 h-3.5 text-[#00d2ff]" />
              <span className="font-bold">{language.toUpperCase()}</span>
            </button>

            {/* Contact CTA */}
            <Button
              href="#contact"
              variant="primary"
              size="sm"
              className="font-mono text-xs uppercase tracking-wider"
            >
              <span>{t.nav.contact}</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            {!user ? (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="px-2 py-1 border border-[#172847] bg-[#0a1224] text-[11px] font-mono text-[#f1f5f9] hover:text-[#00d2ff] rounded-sm cursor-pointer"
                  title={t.nav.signIn}
                >
                  {t.nav.signIn}
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="px-2 py-1 border border-[#00d2ff]/50 bg-[#0c182e] text-[11px] font-mono text-[#00d2ff] rounded-sm cursor-pointer font-bold"
                  title={t.nav.signUp}
                >
                  {t.nav.signUp}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={isAdmin ? openAdminModal : () => openAuthModal('signin')}
                className="p-1 border border-[#00d2ff]/40 bg-[#0a1224] rounded-sm cursor-pointer"
              >
                <img
                  src={user.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=Visitor'}
                  alt="User"
                  className="w-5 h-5 rounded-full"
                />
              </button>
            )}

            <button
              onClick={toggleLanguage}
              type="button"
              className="p-2 border border-[#172847] bg-[#0a1224] text-xs font-mono text-[#00d2ff] rounded-sm cursor-pointer"
              aria-label="Toggle language"
            >
              {language.toUpperCase()}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-sm border border-[#172847] bg-[#0a1224] text-[#f1f5f9] hover:text-[#00d2ff] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2ff] cursor-pointer"
              aria-label={mobileMenuOpen ? t.nav.close : t.nav.menu}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-x-0 top-[60px] bg-[#050a14]/98 border-b border-[#172847] backdrop-blur-xl px-6 py-6 transition-all shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
        >
          <div className="flex flex-col space-y-3 font-mono">
            {/* User status card in mobile drawer */}
            {user ? (
              <div className="p-3 mb-2 rounded-sm bg-[#0a1224] border border-[#172847] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={user.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=Visitor'}
                    alt="User"
                    className="w-7 h-7 rounded-full border border-[#00d2ff]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#f1f5f9]">{user.displayName}</div>
                    <div className="text-[10px] text-[#00d2ff]">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        openAdminModal()
                      }}
                      className="px-2 py-1 rounded-xs bg-[#00d2ff] text-[#050a14] text-[10px] font-bold"
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
                    className="p-1 rounded-xs text-red-400 hover:bg-red-950/40"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 mb-2 rounded-sm bg-[#0a1224] border border-[#172847] space-y-2.5">
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
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-sm border border-[#172847] bg-[#070d18] text-[#f1f5f9] text-xs font-mono font-bold cursor-pointer hover:border-[#00d2ff]"
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
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-sm border border-[#00d2ff]/60 bg-[#0c182e] text-[#00d2ff] text-xs font-mono font-bold cursor-pointer hover:bg-[#00d2ff] hover:text-[#050a14]"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{t.nav.signUp}</span>
                  </button>
                </div>
              </div>
            )}

            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 text-sm rounded-sm transition-colors ${
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

            <div className="pt-4 border-t border-[#172847] flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-[#64748b] px-3">
                <span>{t.nav.statusAvailable}</span>
              </div>
              <Button
                href="#contact"
                variant="primary"
                size="md"
                className="w-full justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{t.nav.contact}</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
