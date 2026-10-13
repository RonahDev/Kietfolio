import React, { useEffect, useRef, useState, Suspense, lazy } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../../hooks/useLanguage'
import { profileData } from '../../data/profile'
import { Button } from '../../components/ui/Button'
import { isReducedMotion } from '../../animations/gsapUtils'
import { useTextScramble } from '../../animations/useTextScramble'
import {
  ArrowDown,
  ArrowUpRight,
  Terminal,
  Cpu,
  GraduationCap,
  Boxes,
  ShieldCheck,
} from 'lucide-react'
import { HeroTerminal } from './HeroTerminal'

// Lazy-load CyberCoreScene to keep initial bundle ultra-fast
const CyberCoreScene = lazy(() =>
  import('../../three/CyberCoreScene').then((m) => ({
    default: m.CyberCoreScene,
  }))
)

export const HeroSection: React.FC = () => {
  const { t, language } = useLanguage()
  const heroRootRef = useRef<HTMLDivElement>(null)
  const [heroMode, setHeroMode] = useState<'3d' | 'terminal'>('3d')

  const { displayText: scrambledRole } = useTextScramble(profileData.roleTitle[language])

  useEffect(() => {
    if (isReducedMotion()) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('.hero-badge-elem', {
        opacity: 0,
        y: -15,
        duration: 0.6,
        delay: 0.1,
      })
        .from(
          '.hero-title-elem',
          {
            opacity: 0,
            y: 40,
            duration: 0.8,
            stagger: 0.1,
          },
          '-=0.3'
        )
        .from(
          '.hero-desc-elem',
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          '-=0.4'
        )
        .from(
          '.hero-cta-elem',
          {
            opacity: 0,
            y: 20,
            duration: 0.5,
          },
          '-=0.3'
        )
        .from(
          '.hero-bento-strip',
          {
            opacity: 0,
            y: 25,
            duration: 0.7,
            stagger: 0.08,
          },
          '-=0.3'
        )
    }, heroRootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      ref={heroRootRef}
      className="relative min-h-[100svh] pt-28 pb-14 flex flex-col justify-center overflow-hidden border-b border-[#172847] bg-[#050a14]"
      aria-label="Hero Section"
    >
      {/* Background Subtle Cyber Grid & Atmospheric Glows */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[32rem] h-[32rem] bg-[#00d2ff]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-[#0284c7]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto space-y-12">
        {/* Main 2-Column Split: Typographic Narrative vs 3D Interactive Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Typographic Narrative */}
          <div className="lg:col-span-7 space-y-6">
            {/* System Status Pill */}
            <div className="hero-badge-elem inline-flex items-center gap-2.5 px-3 py-1.5 text-xs font-mono border border-[#172847] bg-[#0a1224]/90 text-[#94a3b8] rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(0,210,255,0.08)]">
              <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-pulse shadow-[0_0_8px_#00d2ff]" />
              <span className="tracking-widest uppercase text-[#00d2ff] font-semibold">
                {t.hero.greeting}
              </span>
              <span className="text-[#64748b]">|</span>
              <span className="text-[#94a3b8] hidden sm:inline">
                {t.nav.statusAvailable}
              </span>
            </div>

            {/* Giant Typographic Architectural Display */}
            <div className="space-y-1">
              <h1 className="hero-title-elem text-4xl sm:text-6xl md:text-7xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] tracking-tight text-[#f1f5f9] leading-[1.08]">
                {profileData.fullName.toUpperCase()}
              </h1>
              <div className="hero-title-elem flex items-center gap-3 pt-2">
                <span className="h-[2px] w-8 sm:w-12 bg-[#00d2ff] shadow-[0_0_8px_#00d2ff]" />
                <span className="font-mono text-sm sm:text-base font-bold text-[#00d2ff] uppercase tracking-wider">
                  {scrambledRole}
                </span>
              </div>
            </div>

            {/* Core Narrative / Tagline */}
            <div className="hero-desc-elem space-y-3 max-w-2xl">
              <p className="text-xl sm:text-2xl font-semibold text-[#f1f5f9] font-['Plus_Jakarta_Sans',sans-serif] leading-snug">
                {profileData.tagline[language]}
              </p>
              <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed font-['Be_Vietnam_Pro',sans-serif]">
                {profileData.bio[language]}
              </p>
            </div>

            {/* Action Buttons & 3D/Terminal Mode Switcher */}
            <div className="hero-cta-elem flex flex-wrap items-center gap-4 pt-2">
              <Button
                href="#projects"
                variant="primary"
                size="lg"
                magnetic
                className="font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(0,210,255,0.25)]"
              >
                <span>{language === 'vi' ? 'Xem Dự Án & Kinh Nghiệm' : 'Explore Work & Projects'}</span>
                <ArrowDown className="w-4 h-4 ml-1.5" />
              </Button>

              <Button
                href="#contact"
                variant="secondary"
                size="lg"
                magnetic
                className="font-mono uppercase tracking-wider"
              >
                <span>{t.hero.secondaryCta}</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </Button>

              {/* High-tech View Switcher Button */}
              <div className="p-1 rounded-sm bg-[#0a1224] border border-[#172847] flex items-center gap-1 font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => setHeroMode('3d')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs transition-all cursor-pointer ${
                    heroMode === '3d'
                      ? 'bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/40 font-bold'
                      : 'text-[#64748b] hover:text-[#f1f5f9]'
                  }`}
                >
                  <Cpu className="w-3 h-3" />
                  <span>3D CORE</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHeroMode('terminal')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs transition-all cursor-pointer ${
                    heroMode === 'terminal'
                      ? 'bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/40 font-bold'
                      : 'text-[#64748b] hover:text-[#f1f5f9]'
                  }`}
                >
                  <Terminal className="w-3 h-3" />
                  <span>CLI SHELL</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Cyber Core Canvas or Terminal Shell */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-square rounded-sm bg-[#0a1224]/50 border border-[#172847] shadow-[0_0_50px_rgba(0,210,255,0.12)] overflow-hidden">
              {heroMode === '3d' ? (
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center font-mono text-xs text-[#00d2ff] animate-pulse">
                      [LOADING_3D_CYBER_CORE...]
                    </div>
                  }
                >
                  <CyberCoreScene />
                </Suspense>
              ) : (
                <HeroTerminal />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bento Telemetry Strip */}
        <div className="hero-bento-strip grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-4">
          {/* Card 1: Education */}
          <div className="p-4 rounded-sm bg-[#0a1224]/80 border border-[#172847] hover:border-[#00d2ff]/40 transition-colors group">
            <div className="flex items-center gap-2 text-[#00d2ff] mb-1">
              <GraduationCap className="w-4 h-4" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#64748b] group-hover:text-[#00d2ff] transition-colors">
                ACADEMICS
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#f1f5f9] font-mono">
              FPT University
            </p>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">
              BSc Software Engineering
            </p>
          </div>

          {/* Card 2: Operations */}
          <div className="p-4 rounded-sm bg-[#0a1224]/80 border border-[#172847] hover:border-[#00d2ff]/40 transition-colors group">
            <div className="flex items-center gap-2 text-[#38bdf8] mb-1">
              <Boxes className="w-4 h-4" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#64748b] group-hover:text-[#38bdf8] transition-colors">
                OPERATIONS
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#f1f5f9] font-mono">
              SPX Express Lead
            </p>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">
              High-Velocity Sorting Hub
            </p>
          </div>

          {/* Card 3: Stack */}
          <div className="p-4 rounded-sm bg-[#0a1224]/80 border border-[#172847] hover:border-[#00d2ff]/40 transition-colors group">
            <div className="flex items-center gap-2 text-[#00d2ff] mb-1">
              <Cpu className="w-4 h-4" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#64748b] group-hover:text-[#00d2ff] transition-colors">
                TECH CORE
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#f1f5f9] font-mono">
              TypeScript & React 19
            </p>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">
              Three.js, Node.js, Docker
            </p>
          </div>

          {/* Card 4: System Integrity */}
          <div className="p-4 rounded-sm bg-[#0a1224]/80 border border-[#172847] hover:border-[#00d2ff]/40 transition-colors group">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#64748b] group-hover:text-emerald-400 transition-colors">
                RELIABILITY
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#f1f5f9] font-mono">
              100% Type-Safe
            </p>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">
              Zero Production Defects
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
