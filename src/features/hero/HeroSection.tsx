import React, { useEffect, useRef, Suspense, lazy } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../../hooks/useLanguage'
import { profileData } from '../../data/profile'
import { Button } from '../../components/ui/Button'
import { isReducedMotion } from '../../animations/gsapUtils'
import { ArrowDown, ArrowUpRight, Terminal, MapPin, GraduationCap, Package } from 'lucide-react'

// Lazy-load Three.js 3D kinetic canvas to optimize critical path rendering
const KineticNetworkScene = lazy(() =>
  import('../../three/KineticNetworkScene').then((m) => ({
    default: m.KineticNetworkScene,
  }))
)

export const HeroSection: React.FC = () => {
  const { t, language } = useLanguage()
  const heroRootRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isReducedMotion()) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('.hero-badge-elem', {
        opacity: 0,
        y: -15,
        duration: 0.6,
        delay: 0.2,
      })
        .from(
          '.hero-title-line',
          {
            opacity: 0,
            y: 40,
            duration: 0.9,
            stagger: 0.12,
          },
          '-=0.3'
        )
        .from(
          '.hero-desc-elem',
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
          },
          '-=0.5'
        )
        .from(
          '.hero-cta-elem',
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          '-=0.4'
        )
        .from(
          '.hero-telemetry-elem',
          {
            opacity: 0,
            scale: 0.96,
            duration: 0.7,
            stagger: 0.08,
          },
          '-=0.4'
        )
    }, heroRootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      ref={heroRootRef}
      className="relative min-h-[100svh] pt-28 pb-16 flex flex-col justify-center overflow-hidden border-b border-[#172847] bg-[#050a14]"
      aria-label="Hero Section"
    >
      {/* Background Subtle Technical Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-35 pointer-events-none" />

      {/* Background Atmospheric Storm Glows */}
      <div className="absolute top-1/4 right-1/4 w-[28rem] h-[28rem] bg-[#00d2ff]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-[#0284c7]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Typographic Powerhouse & Narratives */}
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

            {/* Giant Architectural Typographic Display with comfortable modern font */}
            <div ref={titleRef} className="space-y-1">
              <h1 className="hero-title-line text-4xl sm:text-6xl md:text-7xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] tracking-tight text-[#f1f5f9] leading-[1.08]">
                {profileData.fullName.toUpperCase()}
              </h1>
              <div className="hero-title-line flex items-center gap-3 pt-2">
                <span className="h-[2px] w-8 sm:w-12 bg-[#00d2ff] shadow-[0_0_8px_#00d2ff]" />
                <span className="font-mono text-sm sm:text-base font-bold text-[#00d2ff] uppercase tracking-wider">
                  {profileData.roleTitle[language]}
                </span>
              </div>
            </div>

            {/* Core Narrative / Tagline with eye-comfortable Be Vietnam Pro */}
            <div className="hero-desc-elem space-y-3 max-w-2xl">
              <p className="text-xl sm:text-2xl font-semibold text-[#f1f5f9] font-['Plus_Jakarta_Sans',sans-serif] leading-snug">
                {profileData.tagline[language]}
              </p>
              <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed font-['Be_Vietnam_Pro',sans-serif]">
                {profileData.bio[language]}
              </p>
            </div>

            {/* Action Buttons */}
            <div ref={ctaRef} className="hero-cta-elem flex flex-wrap items-center gap-4 pt-2">
              <Button
                href="#experience"
                variant="primary"
                size="lg"
                className="font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(0,210,255,0.25)]"
              >
                <span>{t.hero.primaryCta}</span>
                <ArrowDown className="w-4 h-4 ml-1.5" />
              </Button>

              <Button
                href="#contact"
                variant="secondary"
                size="lg"
                className="font-mono uppercase tracking-wider"
              >
                <span>{t.hero.secondaryCta}</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

            {/* Live Operational Telemetry Strip */}
            <div
              ref={metaRef}
              className="pt-6 border-t border-[#172847] grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              <div className="hero-telemetry-elem p-3 rounded-sm bg-[#0a1224]/70 border border-[#172847] flex items-start gap-2.5 transition-colors hover:border-[#00d2ff]/40">
                <MapPin className="w-4 h-4 text-[#00d2ff] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#64748b] tracking-wider">
                    Location
                  </div>
                  <div className="text-xs font-mono font-medium text-[#f1f5f9]">
                    {t.hero.telemetryLocation}
                  </div>
                </div>
              </div>

              <div className="hero-telemetry-elem p-3 rounded-sm bg-[#0a1224]/70 border border-[#172847] flex items-start gap-2.5 transition-colors hover:border-[#00d2ff]/40">
                <GraduationCap className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#646c7f] tracking-wider">
                    Education
                  </div>
                  <div className="text-xs font-mono font-medium text-[#f1f5f9]">
                    {profileData.education.institution}
                  </div>
                </div>
              </div>

              <div className="hero-telemetry-elem p-3 rounded-sm bg-[#0a1224]/70 border border-[#172847] flex items-start gap-2.5 transition-colors hover:border-[#00d2ff]/40">
                <Package className="w-4 h-4 text-[#00d2ff] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#646c7f] tracking-wider">
                    Operations
                  </div>
                  <div className="text-xs font-mono font-medium text-[#f1f5f9]">
                    SPX Express (Senior Analyst)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Three.js Interactive Kinetic Network Sculpture */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            {/* Visual Viewport Container */}
            <div className="w-full relative rounded-sm border border-[#172847] bg-[#081020]/80 backdrop-blur-sm overflow-hidden p-2 group transition-all duration-300 hover:border-[#00d2ff]/50 hover:shadow-[0_0_30px_rgba(0,210,255,0.12)]">
              {/* Corner Engineering Bracket Marks */}
              <span className="absolute top-2 left-2 text-[10px] font-mono text-[#64748b]">
                SYS.NODE_01
              </span>
              <span className="absolute top-2 right-2 text-[10px] font-mono text-[#00d2ff] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-pulse" />
                ACTIVE // 60FPS
              </span>

              {/* Three.js Interactive WebGL Canvas with Suspense fallback */}
              <Suspense
                fallback={
                  <div className="w-full h-[380px] sm:h-[440px] flex items-center justify-center bg-[#050a14]/60 border border-[#172847]/60 rounded-sm">
                    <div className="text-center space-y-2">
                      <div className="w-6 h-6 border-2 border-[#00d2ff] border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_10px_#00d2ff]" />
                      <p className="font-mono text-[11px] text-[#94a3b8]">
                        INITIALIZING_LIGHTNING_BUFFER...
                      </p>
                    </div>
                  </div>
                }
              >
                <KineticNetworkScene className="w-full h-[380px] sm:h-[440px]" />
              </Suspense>

              {/* Bottom Canvas Telemetry Bar */}
              <div className="mt-2 py-1.5 px-3 border-t border-[#172847] bg-[#050a14]/90 flex items-center justify-between text-[11px] font-mono text-[#94a3b8]">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#00d2ff]" />
                  <span>{t.hero.canvasNote}</span>
                </div>
                <span className="text-[#64748b]">WebGL 2.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="w-full text-center mt-8 relative z-10">
        <a
          href="#about"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#64748b] hover:text-[#00d2ff] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2ff]"
          aria-label="Scroll down to About section"
        >
          <span>{t.hero.scrollDown}</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#00d2ff]" />
        </a>
      </div>
    </section>
  )
}
