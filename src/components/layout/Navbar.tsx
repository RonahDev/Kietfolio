import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { Button } from '../ui/Button'
import { Menu, X, Globe, Terminal, ArrowUpRight } from 'lucide-react'

export const Navbar: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const navLinks = [
    { id: 'hero', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'experience', label: t.nav.experience },
    { id: 'skills', label: t.nav.skills },
    { id: 'projects', label: t.nav.projects },
    { id: 'principles', label: t.nav.principles },
    { id: 'contact', label: t.nav.contact },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)

      // Active section spy
      const sections = ['hero', 'about', 'experience', 'skills', 'projects', 'principles', 'contact']
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

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

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

          {/* Right Actions: Language Switch & CTA */}
          <div className="hidden sm:flex items-center gap-3">
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
