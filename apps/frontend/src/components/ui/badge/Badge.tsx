import React from 'react'
import { cn } from '@/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'accent' | 'default' | 'cyan' | 'outline' | 'subtle'
  hasDot?: boolean
}

export const Badge: React.FC<BadgeProps> = React.memo(({
  className,
  variant = 'default',
  hasDot = false,
  children,
  ...props
}) => {
  const variantStyles = {
    accent: 'bg-[#00d2ff]/10 text-[#00d2ff] border-[#00d2ff]/35',
    cyan: 'bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/40',
    default: 'bg-[#0a1224] text-[#94a3b8] border-[#172847]',
    outline: 'bg-transparent text-[#94a3b8] border-[#172847]',
    subtle: 'bg-[#0a1224]/60 text-[#64748b] border-transparent',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono tracking-wider uppercase border rounded-sm transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {hasDot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            variant === 'accent' || variant === 'cyan'
              ? 'bg-[#00d2ff] animate-pulse shadow-[0_0_8px_#00d2ff]'
              : 'bg-[#94a3b8]'
          )}
        />
      )}
      {children}
    </span>
  )
})
