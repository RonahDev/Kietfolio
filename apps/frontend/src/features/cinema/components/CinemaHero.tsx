import React, { useState, useEffect } from 'react'
import { useCinema } from '../hooks/useCinema'
import {
  Play,
  Info,
  Plus,
  Check,
  Star,
  Sparkles,
  Volume2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { getOptimizedImageUrl, getFallbackBackdrop, generateSvgBackdrop } from '../utils/imageFallbacks'
import { getGenreLabel } from '../utils/genreUtils'

export const CinemaHero: React.FC = () => {
  const { movies, openMovieDetail, playMovie, toggleWatchlist, isInWatchlist } = useCinema()

  // Featured movies for hero slider
  const featuredMovies = movies.filter((m) => m.isFeaturedHero || m.isTrending)
  const [activeIndex, setActiveIndex] = useState(0)

  const activeMovie = featuredMovies[activeIndex] || featuredMovies[0]

  // Auto-cycle hero every 9 seconds
  useEffect(() => {
    if (featuredMovies.length <= 1) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredMovies.length)
    }, 9000)
    return () => clearInterval(timer)
  }, [featuredMovies.length])

  const initialBackdrop = activeMovie
    ? getOptimizedImageUrl(activeMovie.backdropUrl, 'backdrop', activeMovie.genres, activeMovie.franchise)
    : ''

  const [currentBackdrop, setCurrentBackdrop] = useState(initialBackdrop)
  const [isBackdropLoaded, setIsBackdropLoaded] = useState(false)
  const [hasBackdropError, setHasBackdropError] = useState(false)

  useEffect(() => {
    if (activeMovie) {
      setCurrentBackdrop(
        getOptimizedImageUrl(activeMovie.backdropUrl, 'backdrop', activeMovie.genres, activeMovie.franchise)
      )
      setIsBackdropLoaded(false)
      setHasBackdropError(false)
    }
  }, [activeMovie])

  const handleHeroBackdropError = () => {
    if (!activeMovie) return
    const fallback = getFallbackBackdrop(activeMovie.genres, activeMovie.franchise)
    if (currentBackdrop !== fallback) {
      setCurrentBackdrop(fallback)
    } else {
      // Stage 2: Fallback to dynamic SVG Canvas with movie title and tagline so it NEVER turns pitch black
      const svgFallback = generateSvgBackdrop(activeMovie.title, activeMovie.tagline || '4K ULTRA HD THEATER')
      if (currentBackdrop !== svgFallback) {
        setCurrentBackdrop(svgFallback)
      } else {
        setHasBackdropError(true)
      }
    }
  }

  if (!activeMovie) return null

  const isSaved = isInWatchlist(activeMovie.id)

  const hasTrailer = Boolean(
    activeMovie.youtubeKey ||
    (activeMovie.trailerUrl && activeMovie.trailerUrl.includes('youtu'))
  )

  return (
    <section className="relative w-full min-h-[82vh] sm:min-h-[88vh] lg:min-h-[92vh] flex flex-col justify-end pb-16 sm:pb-20 pt-28 sm:pt-36 lg:pt-40 select-none overflow-hidden">
      {/* Cinematic Animated Backdrop Artwork with Resilient Gradient Aura */}
      <div className="absolute inset-0 z-0 bg-[#08090d] overflow-hidden">
        {/* Ambient Cinema Aura (glows behind backdrop image even before loading) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#a51d35]/35 via-[#181b24] to-[#08090d]" />

        {!hasBackdropError && currentBackdrop && (
          <img
            key={activeMovie.id + currentBackdrop}
            src={currentBackdrop}
            referrerPolicy="no-referrer"
            onLoad={() => setIsBackdropLoaded(true)}
            onError={handleHeroBackdropError}
            alt={activeMovie.title}
            className={`relative z-0 w-full h-full object-cover object-center scale-105 animate-[kenburns_24s_ease-out_infinite_alternate] will-change-transform transform-gpu transition-opacity duration-700 ${
              isBackdropLoaded || currentBackdrop.startsWith('data:') ? 'opacity-95' : 'opacity-70'
            }`}
          />
        )}

        {/* Targeted Cinematic Vignette Overlays - Leaves artwork vibrant on right and center */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-3/4 md:w-3/5 lg:w-1/2 z-[2] bg-gradient-to-r from-[#08090d]/95 via-[#08090d]/70 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 sm:h-52 z-[2] bg-gradient-to-t from-[#08090d] via-[#08090d]/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-28 sm:h-36 z-[2] bg-gradient-to-b from-[#08090d]/90 via-[#08090d]/40 to-transparent pointer-events-none" />
      </div>

      {/* Hero Content Container with Responsive Spacing */}
      <div className="mt-auto relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl sm:max-w-3xl lg:max-w-4xl space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Metadata Badges Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-xs bg-[#a51d35] text-white font-bold tracking-wider uppercase text-[10px] shadow-[0_0_12px_rgba(165,29,53,0.5)]">
              <Sparkles className="w-3 h-3 text-[#d4af70]" />
              {activeMovie.isTheatrical ? 'CHIẾU RẠP PREMIERE' : 'ĐỘC QUYỀN PREMIERE'}
            </span>

            <span className="flex items-center gap-1 px-2 py-0.5 rounded-xs bg-black/60 border border-[#d4af70]/50 text-[#d4af70] font-bold text-[11px]">
              <Star className="w-3 h-3 fill-[#d4af70]" />
              {activeMovie.rating}
            </span>

            <span className="px-2 py-0.5 rounded-xs bg-[#181b24]/80 text-[#f5f5f5] text-[11px] font-bold">
              {activeMovie.quality}
            </span>

            <span className="px-1.5 py-0.5 rounded-xs border border-[#a1a1aa]/40 text-[#a1a1aa] text-[10px]">
              {activeMovie.maturityRating}
            </span>

            <span className="text-[#a1a1aa] text-xs font-mono">{activeMovie.duration}</span>

            <span className="flex items-center gap-1 text-[#d4af70] text-xs font-mono">
              <Volume2 className="w-3.5 h-3.5" />
              {activeMovie.audio}
            </span>
          </div>

          {/* Blockbuster Title with Fluid Typography & Safe Line Wrapping */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-[#f5f5f5] leading-[1.12] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] max-w-4xl break-words">
            {activeMovie.title}
          </h1>

          {/* Tagline / Subtitle */}
          {activeMovie.tagline && (
            <p className="text-sm sm:text-base font-mono italic text-[#d4af70] drop-shadow-sm line-clamp-2">
              "{activeMovie.tagline}"
            </p>
          )}

          {/* Synopsis */}
          <p className="text-xs sm:text-sm md:text-base text-[#a1a1aa] line-clamp-2 sm:line-clamp-3 leading-relaxed font-sans max-w-2xl">
            {activeMovie.synopsis}
          </p>

          {/* Genre Badges */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {activeMovie.genres.slice(0, 4).map((g, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-xs bg-[#11131a]/90 border border-[#d4af70]/30 text-[10px] sm:text-[11px] font-mono text-[#f5d061] font-medium shadow-xs"
              >
                {getGenreLabel(g)}
              </span>
            ))}
          </div>

          {/* CTA Buttons Row - Responsive Layout */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={() => playMovie(activeMovie)}
              className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#a51d35] to-[#781224] text-white font-mono font-bold text-xs sm:text-sm hover:from-[#c22240] hover:to-[#8c152a] hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(165,29,53,0.6)] transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>XEM NGAY</span>
            </button>

            {hasTrailer && (
              <button
                type="button"
                onClick={() => playMovie(activeMovie, { isTrailer: true })}
                className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#181b24]/90 border border-[#d4af70]/60 text-[#d4af70] hover:text-white hover:bg-[#252a36] hover:border-[#d4af70] font-mono font-bold text-xs sm:text-sm backdrop-blur-md transition-all cursor-pointer shadow-[0_0_15px_rgba(212,175,112,0.2)] active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-[#d4af70]" />
                <span className="hidden xs:inline">XEM TRAILER TRONG WEB</span>
                <span className="xs:hidden">TRAILER</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => openMovieDetail(activeMovie)}
              className="flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#181b24]/80 border border-[#2d3139] text-[#f5f5f5] font-mono font-bold text-xs sm:text-sm backdrop-blur-md hover:bg-[#252a36] hover:border-[#a1a1aa] transition-all cursor-pointer active:scale-95"
            >
              <Info className="w-4 h-4 text-[#a1a1aa]" />
              <span>CHI TIẾT</span>
            </button>

            <button
              type="button"
              onClick={() => toggleWatchlist(activeMovie.id)}
              className={`flex items-center justify-center p-2.5 sm:p-3 rounded-full border transition-all cursor-pointer active:scale-95 ${
                isSaved
                  ? 'bg-[#d4af70]/20 border-[#d4af70] text-[#d4af70]'
                  : 'bg-[#181b24]/80 border-[#2d3139] text-[#f5f5f5] hover:border-[#d4af70]'
              }`}
              title={isSaved ? 'Đã thêm vào danh sách' : 'Thêm vào danh sách của tôi'}
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Carousel Navigation Dots & Controls */}
      <div className="absolute bottom-6 right-6 sm:right-12 z-20 flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            setActiveIndex(
              (prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length
            )
          }
          className="p-2 rounded-full bg-black/60 border border-[#181b24] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
          aria-label="Previous movie"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {featuredMovies.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === activeIndex
                  ? 'w-7 bg-[#a51d35] shadow-[0_0_8px_rgba(165,29,53,0.8)]'
                  : 'w-2 bg-[#181b24] hover:bg-[#a1a1aa]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setActiveIndex((prev) => (prev + 1) % featuredMovies.length)}
          className="p-2 rounded-full bg-black/60 border border-[#181b24] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
          aria-label="Next movie"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  )
}
