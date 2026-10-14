import React from 'react'

interface TechIconProps {
  name: string
  className?: string
}

export const TechIcon: React.FC<TechIconProps> = React.memo(({ name, className = 'w-4 h-4' }) => {
  const normalized = name.toLowerCase()

  // 1. React
  if (normalized.includes('react')) {
    return (
      <svg viewBox="-11.5 -10.23174 23 20.46348" className={className} fill="none">
        <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
        <g stroke="#61dafb" strokeWidth="1">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    )
  }

  // 2. TypeScript
  if (normalized.includes('typescript')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="4" fill="#3178c6" />
        <path d="M4.5 10.5H12M8.25 10.5V18.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 18c1.5 1 4 1 5-0.5s0-2.5-1.5-3-2.5-1.5-2.5-2.5 1-2 2.5-1.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  // 3. JavaScript
  if (normalized.includes('javascript')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="4" fill="#f7df1e" />
        <path d="M7 11.5v5c0 1.5 1 2 2.5 1.5M14 11.5c1.5-.5 3.5 0 3.5 2s-1.5 2-3 2.5 3 1.5 3 2.5-2 2-3.5 1.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  // 4. Java (Coffee cup with steam)
  if (normalized.includes('java') && !normalized.includes('javascript')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M8 2c0 2-2 3-2 5M12 2c0 2-2 3-2 5M16 2c0 2-2 3-2 5" stroke="#ea2d2e" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 11h13a1 1 0 0 1 1 1v4a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-4a1 1 0 0 1 1-1z" fill="#007396" fillOpacity="0.2" stroke="#007396" strokeWidth="1.8" />
        <path d="M18 13h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2" stroke="#ea2d2e" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M3 21h15" stroke="#007396" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  // 5. C++
  if (normalized.includes('c++')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="4" fill="#00599c" fillOpacity="0.25" stroke="#00599c" strokeWidth="1.5" />
        <path d="M9.5 8.5C8 9.5 7.5 11 7.5 12s.5 2.5 2 3.5" stroke="#00d2ff" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M13 12h3M14.5 10.5v3M18 12h3M19.5 10.5v3" stroke="#659ad2" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  // 6. Node.js
  if (normalized.includes('node')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M12 2l8.5 5v10L12 22l-8.5-5V7L12 2z" fill="#339933" fillOpacity="0.2" stroke="#5fa04e" strokeWidth="1.8" />
        <path d="M12 6.5v11M8.5 10l7 4M8.5 14l7-4" stroke="#5fa04e" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }

  // 7. Express.js
  if (normalized.includes('express')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="4" fill="#151b28" stroke="#38bdf8" strokeWidth="1.5" />
        <path d="M6 8h4M6 12h3M6 16h4M13 8l5 8M18 8l-5 8" stroke="#f1f5f9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  // 8. Tailwind CSS
  if (normalized.includes('tailwind')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M7 8c2.5-4 6-2 7 0s3 4 6 2M4 14c2.5-4 6-2 7 0s3 4 6 2" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  // 9. HTML5
  if (normalized.includes('html')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M4 3l1.5 16.5L12 22l6.5-2.5L20 3H4z" fill="#e34f26" fillOpacity="0.2" stroke="#e34f26" strokeWidth="1.8" />
        <path d="M8 8h8M8 12h7M9 16l3 1 3-1" stroke="#e34f26" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  // 10. CSS3
  if (normalized.includes('css')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M4 3l1.5 16.5L12 22l6.5-2.5L20 3H4z" fill="#1572b6" fillOpacity="0.2" stroke="#1572b6" strokeWidth="1.8" />
        <path d="M16 8H8l.5 4h7.5l-.8 4-3.2 1-3.2-1" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  // 11. PostgreSQL
  if (normalized.includes('postgres')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="4" fill="#336791" fillOpacity="0.25" stroke="#336791" strokeWidth="1.5" />
        <path d="M8 17c-2 0-3-2-3-4 0-4 3-7 7-7s7 3 7 7c0 2-1 4-3 4" stroke="#00d2ff" strokeWidth="1.8" />
        <path d="M12 6v12M9 13h6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }

  // 12. Microsoft SQL Server
  if (normalized.includes('sql') || normalized.includes('database')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <ellipse cx="12" cy="6" rx="8" ry="3" fill="#0078d4" fillOpacity="0.3" stroke="#00d2ff" strokeWidth="1.8" />
        <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke="#00d2ff" strokeWidth="1.8" />
      </svg>
    )
  }

  // 13. Docker
  if (normalized.includes('docker')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M4 13h16a3 3 0 0 1-3 3c-4 0-6 2-10 1-1.5-.5-2.5-2-3-4z" fill="#2496ed" fillOpacity="0.2" stroke="#2496ed" strokeWidth="1.8" />
        <rect x="7" y="9" width="2.5" height="2.5" fill="#2496ed" />
        <rect x="10.5" y="9" width="2.5" height="2.5" fill="#2496ed" />
        <rect x="14" y="9" width="2.5" height="2.5" fill="#2496ed" />
        <rect x="10.5" y="5.5" width="2.5" height="2.5" fill="#2496ed" />
        <circle cx="19" cy="14" r="0.8" fill="#ffffff" />
      </svg>
    )
  }

  // 14. Git
  if (normalized === 'git' || normalized.includes('git ') || normalized.includes('vcs')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect x="4" y="4" width="16" height="16" rx="3" transform="rotate(45 12 12)" fill="#f05032" fillOpacity="0.2" stroke="#f05032" strokeWidth="1.8" />
        <circle cx="9" cy="12" r="1.8" fill="#ffffff" />
        <circle cx="15" cy="9" r="1.8" fill="#ffffff" />
        <circle cx="15" cy="15" r="1.8" fill="#ffffff" />
        <path d="M9 12h3v-3M12 12v3" stroke="#ffffff" strokeWidth="1.5" />
      </svg>
    )
  }

  // 15. GitHub
  if (normalized.includes('github')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" fill="#f1f5f9" />
      </svg>
    )
  }

  // 16. Three.js / WebGL
  if (normalized.includes('three') || normalized.includes('webgl')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M12 2L3 19h18L12 2z" fill="#00d2ff" fillOpacity="0.2" stroke="#00d2ff" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 2v17M3 19l9-8M21 19l-9-8" stroke="#38bdf8" strokeWidth="1.5" />
      </svg>
    )
  }

  // 17. GSAP (GreenSock)
  if (normalized.includes('gsap') || normalized.includes('greensock')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <rect width="24" height="24" rx="4" fill="#051810" stroke="#88ce02" strokeWidth="1.5" />
        <path d="M14 3L6 14h6l-2 7 8-11h-6l2-7z" fill="#88ce02" />
      </svg>
    )
  }

  // 18. Vite
  if (normalized.includes('vite')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M3 4l9 17 9-17L12 7 3 4z" fill="#bd34fe" fillOpacity="0.25" stroke="#41d1ff" strokeWidth="1.5" />
        <path d="M13 3l-6 9h5l-2 8 8-11h-5l2-6z" fill="#ffea83" stroke="#ffea83" strokeWidth="0.8" />
      </svg>
    )
  }

  // 19. Linux
  if (normalized.includes('linux')) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M4 17l6-6-6-6M12 19h8" stroke="#fcc624" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  // Default Fallback Terminal / Code Icon
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="4" fill="#0f1b33" stroke="#172847" strokeWidth="1.5" />
      <path d="M7 9l3 3-3 3M13 15h4" stroke="#00d2ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
})

