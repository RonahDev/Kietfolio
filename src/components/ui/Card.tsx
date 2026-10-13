import React from 'react'
import { cn } from '../../utils/cn'
import { useTiltCard } from '../../animations/useTiltCard'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean
  withCornerTicks?: boolean
  tilt?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = true,
  withCornerTicks = true,
  tilt = false,
  ...props
}) => {
  const tiltRef = useTiltCard<HTMLDivElement>({ maxTilt: 6, perspective: 900 })

  return (
    <div
      ref={tilt ? tiltRef : undefined}
      className={cn(
        'relative bg-[#0a1224] border border-[#172847] p-6 sm:p-8 rounded-sm transition-colors duration-300 gpu-accelerated overflow-hidden group',
        hoverEffect &&
          !tilt &&
          'hover:border-[#00d2ff]/40 hover:bg-[#0d172e] hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,210,255,0.09)] transition-all',
        tilt && 'hover:border-[#00d2ff]/50 hover:shadow-[0_14px_40px_rgba(0,210,255,0.12)]',
        className
      )}
      {...props}
    >
      {/* Dynamic Specular Holographic Glare Sheen on hover */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-sm"
        style={{
          background:
            'radial-gradient(550px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 210, 255, 0.08), transparent 40%)',
        }}
        aria-hidden="true"
      />

      {withCornerTicks && (
        <>
          <span className="absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t-2 border-l-2 border-[#00d2ff]/70 pointer-events-none transition-colors group-hover:border-[#38bdf8]" />
          <span className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b-2 border-r-2 border-[#00d2ff]/70 pointer-events-none transition-colors group-hover:border-[#38bdf8]" />
        </>
      )}
      {children}
    </div>
  )
}
