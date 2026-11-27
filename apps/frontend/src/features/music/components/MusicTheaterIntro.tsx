import React, { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Sparkles, Volume2 } from 'lucide-react'
import { isReducedMotion } from '@/animations'

interface MusicTheaterIntroProps {
  reduceMotionOverride?: boolean
  onComplete: () => void
}

type IntroPhase = 'closed' | 'opening' | 'lights-out' | 'stage-reveal'

const CHANDELIER_COUNT = 7

export const MusicTheaterIntro: React.FC<MusicTheaterIntroProps> = ({
  reduceMotionOverride = false,
  onComplete,
}) => {
  const [phase, setPhase] = useState<IntroPhase>('closed')
  const containerRef = useRef<HTMLDivElement>(null)
  const foyerCrestRef = useRef<HTMLDivElement>(null)
  const leftCurtainRef = useRef<HTMLDivElement>(null)
  const rightCurtainRef = useRef<HTMLDivElement>(null)
  const hallBackdropRef = useRef<HTMLDivElement>(null)
  const lightsRowRef = useRef<HTMLDivElement>(null)
  const stageRevealRef = useRef<HTMLDivElement>(null)
  const spotlightsRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const finishedRef = useRef(false)

  const finishIntro = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    timelineRef.current?.kill()
    timelineRef.current = null
    onComplete()
  }, [onComplete])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        finishIntro()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      timelineRef.current?.kill()
      timelineRef.current = null
    }
  }, [finishIntro])

  const handleEnterTheater = useCallback(() => {
    if (phase !== 'closed') return

    if (reduceMotionOverride || isReducedMotion()) {
      finishIntro()
      return
    }

    const leftCurtain = leftCurtainRef.current
    const rightCurtain = rightCurtainRef.current
    const foyerCrest = foyerCrestRef.current
    const hallBackdrop = hallBackdropRef.current
    const lightsRow = lightsRowRef.current
    const stageReveal = stageRevealRef.current
    const spotlights = spotlightsRef.current
    const container = containerRef.current

    if (
      !leftCurtain ||
      !rightCurtain ||
      !foyerCrest ||
      !hallBackdrop ||
      !lightsRow ||
      !stageReveal ||
      !spotlights ||
      !container
    ) {
      finishIntro()
      return
    }

    setPhase('opening')
    const chandeliers = lightsRow.querySelectorAll('[data-chandelier="true"]')

    const tl = gsap.timeline({
      onComplete: finishIntro,
    })
    timelineRef.current = tl

    // Scene 2: Curtain Opening (smooth parted velvet curtains)
    tl.to(foyerCrest, {
      opacity: 0,
      y: -18,
      duration: 0.55,
      ease: 'power2.inOut',
    })
      .to(
        leftCurtain,
        {
          xPercent: -102,
          duration: 1.45,
          ease: 'power3.inOut',
        },
        0.15
      )
      .to(
        rightCurtain,
        {
          xPercent: 102,
          duration: 1.45,
          ease: 'power3.inOut',
        },
        0.15
      )
      .fromTo(
        hallBackdrop,
        { opacity: 0.25, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 1.3, ease: 'power2.out' },
        0.25
      )
      // Scene 3: Theater Lights Shutdown via sequential stagger
      .call(() => setPhase('lights-out'))
      .to(chandeliers, {
        opacity: 0.14,
        scale: 0.88,
        filter: 'brightness(0.35)',
        duration: 0.45,
        stagger: { each: 0.14, from: 'edges' },
        ease: 'power2.inOut',
      })
      .to(
        hallBackdrop,
        {
          filter: 'brightness(0.68)',
          duration: 0.75,
          ease: 'power2.out',
        },
        '-=0.45'
      )
      // Scene 4: Orchestra Stage Reveal with warm amber spotlights
      .call(() => setPhase('stage-reveal'))
      .fromTo(
        spotlights,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.95, ease: 'power2.out' }
      )
      .fromTo(
        stageReveal,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
        '-=0.65'
      )
      .to(container, {
        opacity: 0,
        duration: 0.7,
        delay: 0.45,
        ease: 'power2.inOut',
      })
  }, [finishIntro, phase, reduceMotionOverride])

  return (
    <div
      ref={containerRef}
      data-testid="music-theater-intro"
      data-phase={phase}
      className="fixed inset-0 z-50 overflow-hidden bg-[#101010] text-[#F1EDE6] select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Private Music Theater Opening Sequence"
    >
      {/* Hall & Stage Environment Behind Curtains */}
      <div
        ref={hallBackdropRef}
        className="absolute inset-0 flex flex-col justify-between bg-[#101010]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% 25%, rgba(84,44,53,0.42) 0%, rgba(24,23,22,0.92) 55%, #101010 100%)',
        }}
      >
        {/* Warm Architectural Ceiling & Chandelier Row (Scene 3) */}
        <div className="pt-12 sm:pt-16 px-6 flex flex-col items-center">
          <div className="w-full max-w-4xl border-b border-[#C6A878]/15 pb-3 mb-5 text-center">
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#C6A878]/75">
              Grand Symphony Hall
            </span>
          </div>
          <div
            ref={lightsRowRef}
            className="flex items-center justify-center gap-4 sm:gap-8"
            aria-hidden="true"
          >
            {Array.from({ length: CHANDELIER_COUNT }).map((_, index) => (
              <div
                key={index}
                data-chandelier="true"
                className="flex flex-col items-center transition-transform"
              >
                <div className="w-px h-6 bg-[#C6A878]/40" />
                <div
                  className="w-5 h-5 sm:w-7 sm:h-7 rounded-full border border-[#D6AD73]/70 bg-[#D6AD73]/25 flex items-center justify-center"
                  style={{
                    boxShadow: '0 0 28px 8px rgba(214, 173, 115, 0.36)',
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-[#F1EDE6]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orchestra Stage Spotlights & Architectural Silhouette (Scene 4) */}
        <div className="relative flex-1 flex flex-col items-center justify-center px-6">
          <div
            ref={spotlightsRef}
            className="pointer-events-none absolute inset-0 opacity-0"
            style={{
              background:
                'radial-gradient(circle at 50% 48%, rgba(214,173,115,0.22) 0%, rgba(198,168,120,0.08) 32%, transparent 65%)',
            }}
          />

          <div
            ref={stageRevealRef}
            className="relative z-10 max-w-2xl text-center opacity-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C6A878]/35 bg-[#22201E]/85 text-[#D6AD73] text-xs tracking-[0.2em] uppercase mb-4">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Stage Spotlights Ready</span>
            </div>
            <h2
              className="text-3xl sm:text-5xl font-semibold text-[#F1EDE6] tracking-wide mb-3"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Every Song Becomes a Performance
            </h2>
            <p className="text-sm sm:text-base text-[#A49C92] max-w-lg mx-auto">
              Orchestral chamber acoustics and your private vinyl & lossless archive await.
            </p>
          </div>
        </div>

        {/* Stage Floor Tier Arcs */}
        <div className="pb-12 px-6 flex justify-center" aria-hidden="true">
          <div className="w-full max-w-3xl flex flex-col items-center gap-2 opacity-60">
            <div className="w-3/5 h-3 rounded-t-full border-t border-[#C6A878]/40 bg-gradient-to-b from-[#22201E]/80 to-transparent" />
            <div className="w-4/5 h-4 rounded-t-full border-t border-[#C6A878]/25 bg-gradient-to-b from-[#181716]/90 to-transparent" />
            <div className="w-full h-5 rounded-t-full border-t border-[#542C35]/50 bg-[#181716]" />
          </div>
        </div>
      </div>

      {/* Left Burgundy Velvet Curtain */}
      <div
        ref={leftCurtainRef}
        className="absolute inset-y-0 left-0 w-1/2 z-20 border-r border-[#C6A878]/25"
        style={{
          backgroundColor: '#321B22',
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(16,16,16,0.48) 0px, rgba(84,44,53,0.92) 22px, rgba(50,27,34,0.98) 44px, rgba(16,16,16,0.55) 64px)',
          boxShadow: 'inset -30px 0 60px rgba(16,16,16,0.65)',
        }}
      />

      {/* Right Burgundy Velvet Curtain */}
      <div
        ref={rightCurtainRef}
        className="absolute inset-y-0 right-0 w-1/2 z-20 border-l border-[#C6A878]/25"
        style={{
          backgroundColor: '#321B22',
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(16,16,16,0.55) 0px, rgba(50,27,34,0.98) 22px, rgba(84,44,53,0.92) 44px, rgba(16,16,16,0.48) 64px)',
          boxShadow: 'inset 30px 0 60px rgba(16,16,16,0.65)',
        }}
      />

      {/* Scene 1 Crest & Enter Interaction */}
      <div
        ref={foyerCrestRef}
        className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
      >
        <div className="pointer-events-auto max-w-xl rounded-2xl border border-[#C6A878]/30 bg-[#101010]/75 backdrop-blur-md px-8 py-10 sm:px-12 sm:py-12 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#C6A878]/35 bg-[#22201E]/90 text-[#C6A878] text-[11px] uppercase tracking-[0.26em] mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Residence Recital</span>
          </div>

          <h1
            className="text-4xl sm:text-6xl font-semibold text-[#F1EDE6] tracking-wide mb-3"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Private Music Theater
          </h1>

          <p className="text-sm sm:text-base text-[#A49C92] mb-8 leading-relaxed">
            An intimate classical concert hall designed for unhurried listening and your personal lossless collection.
          </p>

          <button
            type="button"
            onClick={handleEnterTheater}
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] font-semibold text-sm tracking-wide transition-colors cursor-pointer shadow-lg"
          >
            <span>Enter the Theater</span>
          </button>
        </div>
      </div>

      {/* Persistent Skip Intro Control */}
      <div className="absolute top-5 right-5 z-40">
        <button
          type="button"
          onClick={finishIntro}
          className="px-4 py-2 rounded-full border border-[#C6A878]/35 bg-[#181716]/85 hover:bg-[#22201E] text-[#F1EDE6] text-xs tracking-wider uppercase transition-colors cursor-pointer"
        >
          Skip Intro
        </button>
      </div>
    </div>
  )
}
