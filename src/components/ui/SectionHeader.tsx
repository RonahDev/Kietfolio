import React from 'react'
import { cn } from '../../utils/cn'
import { useTextScramble } from '../../animations/useTextScramble'

interface SectionHeaderProps {
  badge: string
  title: string
  subtitle?: string
  className?: string
  align?: 'left' | 'center'
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  className,
  align = 'left',
}) => {
  const { displayText: scrambledBadge } = useTextScramble(badge)

  return (
    <div
      className={cn(
        'relative mb-12 md:mb-16',
        align === 'center' ? 'text-center mx-auto max-w-3xl' : 'text-left max-w-4xl',
        className
      )}
    >
      {/* Technical annotation badge with cyber text scramble */}
      <div
        className={cn(
          'inline-flex items-center gap-2 mb-3.5 px-3 py-1 text-xs font-mono tracking-widest uppercase border border-[#172847] bg-[#0a1224]/90 text-[#00d2ff] rounded-sm shadow-[0_0_14px_rgba(0,210,255,0.14)] backdrop-blur-sm',
          align === 'center' && 'justify-center'
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-pulse shadow-[0_0_6px_#00d2ff]" />
        <span>{scrambledBadge}</span>
      </div>

      {/* Main section title with comfortable modern display font */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Plus_Jakarta_Sans',sans-serif] tracking-tight text-[#f1f5f9] leading-[1.2]">
        {title}
      </h2>

      {/* Supporting subtitle with eye-pleasing body font */}
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-[#94a3b8] font-normal leading-relaxed font-['Be_Vietnam_Pro',sans-serif]">
          {subtitle}
        </p>
      )}

      {/* Electric lightning technical baseline rule */}
      <div
        className={cn(
          'mt-6 flex items-center gap-2.5',
          align === 'center' ? 'justify-center' : 'justify-start'
        )}
      >
        <div className="w-16 h-[2px] bg-gradient-to-r from-[#00d2ff] to-[#38bdf8] rounded-full shadow-[0_0_12px_rgba(0,210,255,0.7)]" />
        <div className="w-4 h-[2px] bg-[#0284c7]/60 rounded-full" />
        <div className="w-1.5 h-[2px] bg-[#172847] rounded-full" />
      </div>
    </div>
  )
}
