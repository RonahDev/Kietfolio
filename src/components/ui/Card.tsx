import React from 'react'
import { cn } from '../../utils/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean
  withCornerTicks?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = true,
  withCornerTicks = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative bg-[#0a1224] border border-[#172847] p-6 sm:p-8 rounded-sm transition-all duration-300 gpu-accelerated',
        hoverEffect &&
          'hover:border-[#00d2ff]/40 hover:bg-[#0d172e] hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,210,255,0.08)]',
        className
      )}
      {...props}
    >
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
