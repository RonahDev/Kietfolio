import React, { useRef, useState, useEffect, useCallback } from 'react'
import type { MovieItem } from '../types/cinema'
import { CinemaMovieCard } from './CinemaMovieCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CinemaCarouselRowProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  movies: MovieItem[]
}

export const CinemaCarouselRow: React.FC<CinemaCarouselRowProps> = ({
  title,
  subtitle,
  icon,
  movies,
}) => {
  const rowRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const rafIdRef = useRef<number | null>(null)

  const checkScroll = useCallback(() => {
    if (!rowRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current
    const newCanScrollLeft = scrollLeft > 10
    const newCanScrollRight = scrollLeft + clientWidth < scrollWidth - 10

    setCanScrollLeft((prev) => (prev !== newCanScrollLeft ? newCanScrollLeft : prev))
    setCanScrollRight((prev) => (prev !== newCanScrollRight ? newCanScrollRight : prev))
  }, [])

  useEffect(() => {
    checkScroll()
    const current = rowRef.current
    if (!current) return

    const handleScroll = () => {
      if (rafIdRef.current) return
      rafIdRef.current = requestAnimationFrame(() => {
        checkScroll()
        rafIdRef.current = null
      })
    }

    current.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      current.removeEventListener('scroll', handleScroll)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [checkScroll, movies])

  const scrollBy = (direction: 'left' | 'right') => {
    if (!rowRef.current) return
    const scrollAmount = rowRef.current.clientWidth * 0.75
    rowRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  if (movies.length === 0) return null

  return (
    <section className="relative my-8 sm:my-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto group/row">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-[#a51d35]">{icon}</span>}
          <div>
            <h3 className="text-lg sm:text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-[#f5f5f5]">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs font-mono text-[#a1a1aa] mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        <span className="text-xs font-mono text-[#a1a1aa]">{movies.length} tiêu đề</span>
      </div>

      {/* Horizontal Carousel Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollBy('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-20 bg-gradient-to-r from-[#08090d]/90 to-transparent flex items-center justify-start pl-1 text-[#f5f5f5] hover:text-[#d4af70] transition-colors cursor-pointer"
            aria-label="Cuộn sang trái"
          >
            <div className="p-1.5 rounded-full bg-black/70 border border-[#181b24] shadow-lg">
              <ChevronLeft className="w-5 h-5" />
            </div>
          </button>
        )}

        {/* Scrollable Track with GPU Containment */}
        <div
          ref={rowRef}
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none py-4 px-1 overscroll-x-contain"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            contain: 'content',
          }}
        >
          {movies.map((movie) => (
            <CinemaMovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollBy('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-20 bg-gradient-to-l from-[#08090d]/90 to-transparent flex items-center justify-end pr-1 text-[#f5f5f5] hover:text-[#d4af70] transition-colors cursor-pointer"
            aria-label="Cuộn sang phải"
          >
            <div className="p-1.5 rounded-full bg-black/70 border border-[#181b24] shadow-lg">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        )}
      </div>
    </section>
  )
}
