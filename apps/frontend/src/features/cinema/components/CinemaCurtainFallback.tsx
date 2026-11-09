import React from 'react'

interface CinemaCurtainFallbackProps {
  openProgress: number
}

export const CinemaCurtainFallback: React.FC<CinemaCurtainFallbackProps> = ({ openProgress }) => {
  const leftTranslate = -openProgress * 100
  const rightTranslate = openProgress * 100

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-40 bg-[#050608]">
      {/* Top Golden Valence Trim */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-r from-[#997722] via-[#e6ca65] to-[#997722] shadow-[0_4px_20px_rgba(0,0,0,0.8)] z-50 flex items-center justify-center border-b border-[#ffd700]/50">
        <div className="w-full flex justify-around px-4">
          {Array.from({ length: 24 }).map((_, idx) => (
            <span
              key={idx}
              className="w-2.5 h-2.5 rounded-full bg-[#ffd700] shadow-[0_0_8px_rgba(255,215,0,0.6)]"
            />
          ))}
        </div>
      </div>

      {/* Left Velvet Curtain */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1/2 transition-transform duration-75 ease-out"
        style={{
          transform: `translateX(${leftTranslate}%)`,
          background: `
            repeating-linear-gradient(
              90deg,
              #4a0612 0px,
              #911228 20px,
              #a51d35 35px,
              #610817 55px,
              #3d040e 70px
            )
          `,
          boxShadow: 'inset -20px 0 50px rgba(0, 0, 0, 0.9), 10px 0 30px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div className="w-full h-full bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Right Velvet Curtain */}
      <div
        className="absolute top-0 bottom-0 right-0 w-1/2 transition-transform duration-75 ease-out"
        style={{
          transform: `translateX(${rightTranslate}%)`,
          background: `
            repeating-linear-gradient(
              90deg,
              #3d040e 0px,
              #610817 15px,
              #a51d35 35px,
              #911228 50px,
              #4a0612 70px
            )
          `,
          boxShadow: 'inset 20px 0 50px rgba(0, 0, 0, 0.9), -10px 0 30px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div className="w-full h-full bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Ambient Theater Spotlight Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(255,230,190,0.18)_0%,transparent_60%)]" />
    </div>
  )
}
