import React, { useEffect, useState, useRef } from 'react'
import { isReducedMotion } from '../../animations/gsapUtils'

export const LightningAtmosphere: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isPointerDevice] = useState(() => {
    if (typeof window === 'undefined') return false
    return !window.matchMedia('(pointer: coarse)').matches
  })
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false)
  const [isMouseDown, setIsMouseDown] = useState(false)

  const auraRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Scroll Progress
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    if (!isPointerDevice || isReducedMotion()) {
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }

    // 2. Cursor and Ambient Aura Tracking
    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let auraX = -500
    let auraY = -500
    let animFrameId: number

    const handlePointerMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }

      // Check if hovering an interactive element
      const target = e.target as HTMLElement | null
      const isInteractive = Boolean(
        target?.closest('button, a, input, textarea, select, [role="button"], .interactive')
      )
      setIsHoveringInteractive(isInteractive)
    }

    const handleMouseDown = () => setIsMouseDown(true)
    const handleMouseUp = () => setIsMouseDown(false)

    window.addEventListener('mousemove', handlePointerMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    const updateFollowers = () => {
      // Ring smooth lerp
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18

      // Aura smooth lerp
      auraX += (mouseX - auraX) * 0.08
      auraY += (mouseY - auraY) * 0.08

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      }

      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${auraX - 250}px, ${auraY - 250}px, 0)`
      }

      animFrameId = requestAnimationFrame(updateFollowers)
    }

    animFrameId = requestAnimationFrame(updateFollowers)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      cancelAnimationFrame(animFrameId)
    }
  }, [isPointerDevice])

  return (
    <>
      {/* Top Cybernetic Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-transparent"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-[#0284c7] via-[#00d2ff] to-[#38bdf8] shadow-[0_0_12px_#00d2ff] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Ambient Lightning Cursor Aura */}
      <div
        ref={auraRef}
        className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none z-20 opacity-60 blur-3xl transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 210, 255, 0.09) 0%, rgba(2, 132, 199, 0.03) 45%, transparent 70%)',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />

      {/* Cyber Cursor Ring & Dot for Desktop Pointer */}
      {isPointerDevice && (
        <>
          {/* Subtle Outer Cyber Ring */}
          <div
            ref={cursorRingRef}
            className={`fixed top-0 left-0 pointer-events-none z-50 -ml-4 -mt-4 rounded-full border transition-all duration-150 ease-out ${
              isMouseDown
                ? 'w-6 h-6 border-[#38bdf8] bg-[#00d2ff]/20 scale-90'
                : isHoveringInteractive
                ? 'w-10 h-10 border-[#00d2ff] bg-[#00d2ff]/10 scale-125 shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                : 'w-8 h-8 border-[#00d2ff]/40 bg-transparent'
            }`}
            style={{ willChange: 'transform' }}
            aria-hidden="true"
          />

          {/* Sharp Center Pointer Dot */}
          <div
            ref={cursorDotRef}
            className={`fixed top-0 left-0 pointer-events-none z-50 -ml-1 -mt-1 rounded-full transition-transform duration-75 ${
              isHoveringInteractive
                ? 'w-2 h-2 bg-[#00d2ff] scale-150 shadow-[0_0_8px_#00d2ff]'
                : 'w-2 h-2 bg-white scale-100 shadow-[0_0_4px_#ffffff]'
            }`}
            style={{ willChange: 'transform' }}
            aria-hidden="true"
          />
        </>
      )}
    </>
  )
}
