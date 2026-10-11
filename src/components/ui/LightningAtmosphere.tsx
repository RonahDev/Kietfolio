import React, { useEffect, useState, useRef } from 'react'

export const LightningAtmosphere: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const auraRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 1. Optimized Scroll Progress Indicator (passive listener)
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // 2. Ultra-smooth GPU-accelerated Pointer Lightning Aura
    let mouseX = -1000
    let mouseY = -1000
    let currentX = -1000
    let currentY = -1000
    let animFrameId: number

    const handlePointerMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener('mousemove', handlePointerMove, { passive: true })

    const updateAura = () => {
      // Damped lerp for silky smooth tracking without lag
      currentX += (mouseX - currentX) * 0.12
      currentY += (mouseY - currentY) * 0.12

      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${currentX - 250}px, ${currentY - 250}px, 0)`
      }

      animFrameId = requestAnimationFrame(updateAura)
    }

    animFrameId = requestAnimationFrame(updateAura)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handlePointerMove)
      cancelAnimationFrame(animFrameId)
    }
  }, [])

  return (
    <>
      {/* Top Interactive Lightning Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-transparent"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-[#0284c7] via-[#00d2ff] to-[#38bdf8] shadow-[0_0_12px_#00d2ff] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Ambient Interactive Lightning Cursor Follower (Zero Layout Cost, Pure GPU translation) */}
      <div
        ref={auraRef}
        className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none z-30 opacity-70 blur-3xl transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(0, 210, 255, 0.08) 0%, rgba(2, 132, 199, 0.03) 45%, transparent 70%)',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />
    </>
  )
}

