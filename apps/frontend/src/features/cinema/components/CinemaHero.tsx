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
import { handleImageFallback, getFallbackBackdrop } from '../utils/imageFallbacks'

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

  if (!activeMovie) return null

  const isSaved = isInWatchlist(activeMovie.id)

  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[92vh] flex items-end pb-16 sm:pb-24 pt-28 overflow-hidden select-none">
      {/* Ken Burns Animated Backdrop Artwork */}
      <div className="absolute inset-0 z-0 bg-[#08090d]">
        {/* Ambient Cinema Aura (glows behind backdrop image) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#a51d35]/25 via-[#11131a] to-[#08090d]" />

        <img
          key={activeMovie.id}
          src={activeMovie.backdropUrl}
          referrerPolicy="no-referrer"
          onError={(e) => handleImageFallback(e, getFallbackBackdrop(activeMovie.genres, activeMovie.franchise), 'backdrop')}
          alt={activeMovie.title}
          className="relative z-1 w-full h-full object-cover object-center scale-105 animate-[kenburns_18s_ease-out_infinite_alternate] will-change-transform transform-gpu"
        />
        {/* Cinematic Vignette Overlays */}
        <div className="absolute inset-0 z-2 bg-gradient-to-t from-[#08090d] via-[#08090d]/60 to-transparent" />
        <div className="absolute inset-0 z-2 bg-gradient-to-r from-[#08090d] via-[#08090d]/70 to-transparent" />
        <div className="absolute inset-0 z-2 bg-[radial-gradient(ellipse_at_bottom,transparent_40%,#08090d_100%)] opacity-80" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Metadata Badges Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-xs bg-[#a51d35] text-white font-bold tracking-wider uppercase text-[10px] shadow-[0_0_12px_rgba(165,29,53,0.5)]">
              <Sparkles className="w-3 h-3 text-[#d4af70]" />
              ĐỘC QUYỀN PREMIERE
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

          {/* Blockbuster Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-[#f5f5f5] leading-tight tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            {activeMovie.title}
          </h1>

          {/* Tagline / Subtitle */}
          <p className="text-sm sm:text-base font-mono italic text-[#d4af70] drop-shadow-sm">
            "{activeMovie.tagline}"
          </p>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-[#a1a1aa] line-clamp-3 sm:line-clamp-4 leading-relaxed font-sans max-w-xl">
            {activeMovie.synopsis}
          </p>

          {/* Genre Badges */}
          <div className="flex flex-wrap gap-2 pt-1">
            {activeMovie.genres.map((g, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-xs bg-[#11131a]/80 border border-[#181b24] text-[11px] font-mono text-[#cbd5e1]"
              >
                #{g}
              </span>
            ))}
          </div>

          {/* CTA Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => playMovie(activeMovie)}
              className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#a51d35] to-[#781224] text-white font-mono font-bold text-sm hover:from-[#c22240] hover:to-[#8c152a] hover:scale-105 shadow-[0_0_30px_rgba(165,29,53,0.6)] transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>XEM NGAY</span>
            </button>

            <button
              type="button"
              onClick={() => openMovieDetail(activeMovie)}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#181b24]/80 border border-[#2d3139] text-[#f5f5f5] font-mono font-bold text-sm backdrop-blur-md hover:bg-[#252a36] hover:border-[#a1a1aa] transition-all cursor-pointer"
            >
              <Info className="w-4 h-4 text-[#a1a1aa]" />
              <span>CHI TIẾT</span>
            </button>

            <button
              type="button"
              onClick={() => toggleWatchlist(activeMovie.id)}
              className={`flex items-center justify-center p-3 rounded-full border transition-all cursor-pointer ${
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
