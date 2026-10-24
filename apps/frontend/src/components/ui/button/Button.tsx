import React from 'react'
import { cn } from '@/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'accent-outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  href?: string
  target?: string
  rel?: string
}

export const Button: React.FC<ButtonProps> = React.memo(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  href,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-mono font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050a14] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer shimmer-btn select-none'

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 rounded-sm',
    md: 'text-sm px-5 py-2.5 gap-2 rounded-sm',
    lg: 'text-sm md:text-base px-6 py-3.5 gap-2.5 rounded-sm',
  }

  const variantStyles = {
    primary:
      'bg-[#00d2ff] text-[#050a14] hover:bg-[#38bdf8] font-bold shadow-[0_0_20px_rgba(0,210,255,0.25)] hover:shadow-[0_0_30px_rgba(0,210,255,0.45)] hover:scale-[1.01]',
    secondary:
      'bg-[#0a1224] text-[#f1f5f9] border border-[#172847] hover:border-[#00d2ff] hover:text-[#00d2ff] hover:bg-[#0f1b33] hover:shadow-[0_0_15px_rgba(0,210,255,0.15)]',
    outline:
      'bg-transparent text-[#f1f5f9] border border-[#172847] hover:border-[#00d2ff] hover:text-[#00d2ff] hover:shadow-[0_0_15px_rgba(0,210,255,0.15)]',
    'accent-outline':
      'bg-transparent text-[#00d2ff] border border-[#00d2ff]/50 hover:border-[#00d2ff] hover:bg-[#00d2ff]/10 hover:shadow-[0_0_18px_rgba(0,210,255,0.25)]',
    ghost:
      'bg-transparent text-[#94a3b8] hover:text-[#00d2ff] hover:bg-[#0a1224]',
  }

  const combinedClasses = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  )

  if (href) {
    return (
      <a
        href={href}
        className={combinedClasses}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </a>
    )
  }

  return (
    <button
      className={combinedClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
})
