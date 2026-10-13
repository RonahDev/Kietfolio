import React, { useEffect, useState } from 'react'

export const LightningAtmosphere: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top Cybernetic Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none bg-transparent"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-[#0284c7] via-[#00d2ff] to-[#38bdf8] shadow-[0_0_12px_#00d2ff] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Atmospheric Cinematic Aurora Glows (Pure CSS, Zero Mouse Tracking, Zero GPU Lag) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Glow 1: Electric Cyan Top-Right Aurora */}
        <div className="absolute -top-32 -right-32 w-[38rem] h-[38rem] rounded-full bg-radial from-[#00d2ff]/12 via-[#0284c7]/5 to-transparent blur-3xl animate-aurora-1" />

        {/* Glow 2: Deep Indigo Mid-Left Aurora */}
        <div className="absolute top-1/3 -left-40 w-[42rem] h-[42rem] rounded-full bg-radial from-[#6366f1]/9 via-[#0f172a]/5 to-transparent blur-3xl animate-aurora-2" />

        {/* Glow 3: Ocean Teal Bottom Aurora */}
        <div className="absolute bottom-10 right-1/4 w-[36rem] h-[36rem] rounded-full bg-radial from-[#00d2ff]/8 via-transparent to-transparent blur-3xl animate-aurora-1" />
      </div>
    </>
  )
}
