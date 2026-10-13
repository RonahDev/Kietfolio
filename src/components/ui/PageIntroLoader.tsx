import React, { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { isReducedMotion } from '../../animations/gsapUtils'
import { profileData } from '../../data/profile'
import { SITE_CONFIG } from '../../config/site'
import { useLanguage } from '../../hooks/useLanguage'
import { Terminal, Shield, Sparkles } from 'lucide-react'

const BOOT_STAGES_VI: readonly string[] = [
  'SYS.INIT: Khởi động hệ thống Kietfolio v' + SITE_CONFIG.version,
  'ENGINE: Tải kết cấu Three.js & động lực hạt Cyber',
  'DISPATCH: Đồng bộ tư duy vận hành điều phối SPX Hub',
  'ACCESS: Phê duyệt truy cập — Chào mừng bạn!',
] as const

const BOOT_STAGES_EN: readonly string[] = [
  'SYS.INIT: Initializing Kietfolio Architecture v' + SITE_CONFIG.version,
  'ENGINE: Calibrating Three.js & GSAP animation matrix',
  'DISPATCH: Bridging SPX Logistics operational telemetry',
  'ACCESS: Authorization verified — Welcome explorer',
] as const

interface PageIntroLoaderProps {
  onComplete: () => void
}

export const PageIntroLoader: React.FC<PageIntroLoaderProps> = ({ onComplete }) => {
  const { language } = useLanguage()
  const bootStages = language === 'vi' ? BOOT_STAGES_VI : BOOT_STAGES_EN
  const containerRef = useRef<HTMLDivElement>(null)
  const progressLineRef = useRef<HTMLDivElement>(null)
  const percentTextRef = useRef<HTMLSpanElement>(null)
  const statusTextRef = useRef<HTMLParagraphElement>(null)
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    return isReducedMotion()
  })

  const finishIntro = useCallback(() => {
    if (isDismissed) return
    setIsDismissed(true)

    if (!containerRef.current) {
      onComplete()
      return
    }

    gsap.to(containerRef.current, {
      yPercent: -100,
      duration: 0.85,
      ease: 'expo.inOut',
      onStart: () => {
        onComplete()
      },
      onComplete: () => {
        setIsDismissed(true)
      },
    })
  }, [isDismissed, onComplete])

  useEffect(() => {
    if (isDismissed) {
      onComplete()
      return
    }

    const ctx = gsap.context(() => {
      const progressObj = { value: 0 }

      const tl = gsap.timeline({
        onComplete: finishIntro,
      })

      // Stage 1: Entrance of HUD elements
      tl.from('.intro-hud-element', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
      })

      // Stage 2: Smooth progress bar & counter tween
      tl.to(
        progressObj,
        {
          value: 100,
          duration: 1.1,
          ease: 'power2.inOut',
          onUpdate: () => {
            const current = Math.round(progressObj.value)
            if (percentTextRef.current) {
              percentTextRef.current.textContent = `${current}%`
            }
            if (progressLineRef.current) {
              progressLineRef.current.style.width = `${current}%`
            }
            if (statusTextRef.current) {
              const stageIdx = Math.min(
                Math.floor((current / 100) * bootStages.length),
                bootStages.length - 1
              )
              statusTextRef.current.textContent = bootStages[stageIdx]
            }
          },
        },
        '-=0.2'
      )

      // Stage 3: Hold 100% briefly for visual clarity
      tl.to({}, { duration: 0.15 })
    }, containerRef)

    // Keyboard shortcut to skip intro
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        finishIntro()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      ctx.revert()
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDismissed, bootStages, finishIntro, onComplete])

  if (isDismissed) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#050a14] flex flex-col justify-between items-center p-6 select-none overflow-hidden"
      aria-label="Loading Intro"
      role="dialog"
      aria-modal="true"
    >
      {/* Background Ambience & Scanline */}
      <div className="absolute inset-0 bg-tech-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-[#00d2ff]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Status */}
      <div className="w-full max-w-5xl flex items-center justify-between text-xs font-mono text-[#64748b] relative z-10 intro-hud-element">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#00d2ff]" />
          <span className="tracking-widest uppercase text-[#00d2ff]">
            BOOT://{SITE_CONFIG.name.toUpperCase().replace(/\s+/g, '_')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span className="text-[11px] text-[#94a3b8]">SYS_INTEGRITY: 100%</span>
        </div>
      </div>

      {/* Center Stage: Name & Progress Bar */}
      <div className="w-full max-w-md my-auto space-y-6 text-center relative z-10">
        <div className="space-y-2 intro-hud-element">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a1224] border border-[#172847] text-[11px] font-mono text-[#00d2ff]">
            <Sparkles className="w-3 h-3 animate-spin" />
            <span className="tracking-widest uppercase">
              {language === 'vi' ? 'KHỞI ĐỘNG HỆ THỐNG' : 'SYSTEM BOOT SEQUENCE'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] tracking-tight text-[#f1f5f9]">
            {profileData.fullName}
          </h1>
          <p className="font-mono text-xs text-[#64748b] tracking-wider uppercase">
            {profileData.roleTitle[language]}
          </p>
        </div>

        {/* Cyber Progress Track */}
        <div className="space-y-2 intro-hud-element">
          <div className="flex items-center justify-between font-mono text-xs">
            <span
              ref={statusTextRef}
              className="text-[#94a3b8] text-left truncate max-w-[280px]"
            >
              {bootStages[0]}
            </span>
            <span
              ref={percentTextRef}
              className="text-[#00d2ff] font-bold ml-2"
            >
              0%
            </span>
          </div>

          <div className="w-full h-1.5 bg-[#0f1b33] rounded-full overflow-hidden border border-[#172847] relative">
            <div
              ref={progressLineRef}
              className="h-full w-0 bg-gradient-to-r from-[#0284c7] via-[#00d2ff] to-[#38bdf8] shadow-[0_0_12px_#00d2ff] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Bottom Footer & Skip Trigger */}
      <div className="w-full max-w-5xl flex items-center justify-between text-xs font-mono text-[#64748b] relative z-10 intro-hud-element">
        <span className="hidden sm:inline">
          SPX Express Lead &bull; FPT Software Engineering
        </span>
        <button
          type="button"
          onClick={finishIntro}
          className="text-[#00d2ff] hover:text-[#38bdf8] transition-colors cursor-pointer underline underline-offset-4 font-mono text-xs"
        >
          {language === 'vi' ? 'Bỏ qua [ESC]' : 'Skip Intro [ESC]'} &rarr;
        </button>
      </div>

      {/* Trailing Cyber Accent Laser Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent shadow-[0_0_15px_#00d2ff]" />
    </div>
  )
}
