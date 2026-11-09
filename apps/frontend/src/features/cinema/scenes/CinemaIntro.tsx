import React, { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { isReducedMotion } from '@/animations'
import { CurtainScene } from './CurtainScene'
import { CinemaCurtainFallback } from '../components/CinemaCurtainFallback'
import { Film, FastForward } from 'lucide-react'

interface CinemaIntroProps {
  onComplete: () => void
  onProgress?: (progress: number) => void
}

export const CinemaIntro: React.FC<CinemaIntroProps> = ({ onComplete, onProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const centerBadgeRef = useRef<HTMLDivElement>(null)
  const [useFallback, setUseFallback] = useState(false)
  const [fallbackProgress, setFallbackProgress] = useState(0)
  const [isIntroFinished, setIsIntroFinished] = useState(() => isReducedMotion())
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const animStateRef = useRef({ progress: 0, light: 0.1 })

  const handleSkip = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill()
    }
    animStateRef.current.progress = 1
    animStateRef.current.light = 1
    setIsIntroFinished(true)
    onProgress?.(1)
    onComplete()
  }, [onComplete, onProgress])

  // Global ESC key listener to skip intro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc' || e.code === 'Escape') {
        e.preventDefault()
        handleSkip()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSkip])

  // Zero-render GSAP Opening Sequence
  useEffect(() => {
    if (isReducedMotion()) {
      onProgress?.(1)
      onComplete()
      return
    }

    const state = animStateRef.current
    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onUpdate: () => {
        // Only update fallback state if CSS fallback is active
        if (useFallback) {
          setFallbackProgress(state.progress)
        }
      },
      onComplete: () => {
        setIsIntroFinished(true)
        onProgress?.(1)
        onComplete()
      },
    })
    timelineRef.current = tl

    // Fade out center monogram emblem quickly once curtains start opening
    if (centerBadgeRef.current) {
      tl.to(centerBadgeRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        delay: 0.8,
      }, 0)
    }

    // STEP 1 — CINEMATIC INTRO: Spotlight illuminates velvet curtain
    tl.to(state, {
      light: 1.0,
      duration: 1.0,
      ease: 'power2.inOut',
    }, 0)

    // STEP 2 — CURTAIN OPENING: Left & right curtains draw open simultaneously
    tl.to(
      state,
      {
        progress: 1.0,
        duration: 2.3,
        ease: 'power3.inOut',
      },
      0.9
    )

    // Fade out the entire black mask container smoothly right before finishing
    if (containerRef.current) {
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.45,
          ease: 'power2.out',
        },
        '-=0.45'
      )
    }

    return () => {
      tl.kill()
    }
  }, [onComplete, onProgress, useFallback])

  if (isIntroFinished) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden bg-[#050608] select-none pointer-events-auto will-change-opacity"
      role="region"
      aria-label="Cinema Curtain Opening Sequence"
    >
      {/* 3D WebGL Scene with zero-render animStateRef or High-Fidelity CSS Fallback */}
      {useFallback ? (
        <CinemaCurtainFallback openProgress={fallbackProgress} />
      ) : (
        <CurtainScene
          animStateRef={animStateRef}
          onWebGLUnsupported={() => setUseFallback(true)}
        />
      )}

      {/* Atmospheric Theater Ambient Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)]" />

      {/* Center Cinema Monogram Seam Indicator */}
      <div
        ref={centerBadgeRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center gap-3 text-center transition-opacity duration-300 will-change-transform will-change-opacity"
      >
        <div className="w-14 h-14 rounded-full border border-[#d4af70]/40 bg-black/60 backdrop-blur-md flex items-center justify-center text-[#d4af70] shadow-[0_0_25px_rgba(212,175,112,0.35)] animate-pulse">
          <Film className="w-7 h-7" />
        </div>
        <span className="text-[11px] font-mono tracking-[0.25em] text-[#d4af70] uppercase font-bold drop-shadow-md">
          KIET STREAM // THEATER SYSTEM
        </span>
      </div>

      {/* Interactive Skip Button */}
      <div className="absolute bottom-8 right-8 z-50">
        <button
          type="button"
          onClick={handleSkip}
          className="group flex items-center gap-2 px-4 py-2 rounded-full bg-[#11131a]/85 border border-[#a51d35]/50 text-xs font-mono font-bold text-[#f5f5f5] backdrop-blur-md hover:bg-[#a51d35] hover:border-[#d4af70] hover:text-white transition-all shadow-[0_0_20px_rgba(0,0,0,0.8)] cursor-pointer"
          title="Bỏ qua màn mở rạp (Phím ESC)"
        >
          <span>BỎ QUA MÀN MỞ RẠP [ESC]</span>
          <FastForward className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}
