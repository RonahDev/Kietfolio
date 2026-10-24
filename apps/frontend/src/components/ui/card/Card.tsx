import React from 'react'
import { cn } from '@/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean
  withCornerTicks?: boolean
}

export const Card: React.FC<CardProps> = React.memo(({
  children,
  className,
  hoverEffect = true,
  withCornerTicks = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative bg-[#0a1224]/85 backdrop-blur-md border border-[#172847] p-6 sm:p-8 rounded-sm transition-all duration-300 gpu-accelerated group overflow-hidden',
        hoverEffect &&
          'hover:border-[#00d2ff]/50 hover:bg-[#0c162c] hover:-translate-y-1 hover:shadow-[0_14px_38px_rgba(0,210,255,0.12),0_0_15px_rgba(0,210,255,0.06)]',
        className
      )}
      {...props}
    >
      {/* Subtle top ambient sheen line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00d2ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {withCornerTicks && (
        <>
          <span className="absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t-2 border-l-2 border-[#00d2ff]/70 pointer-events-none transition-colors group-hover:border-[#00d2ff] group-hover:shadow-[0_0_6px_#00d2ff]" />
          <span className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b-2 border-r-2 border-[#00d2ff]/70 pointer-events-none transition-colors group-hover:border-[#00d2ff] group-hover:shadow-[0_0_6px_#00d2ff]" />
        </>
      )}
      {children}
    </div>
  )
})
