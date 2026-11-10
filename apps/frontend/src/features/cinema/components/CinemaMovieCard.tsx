import React, { useState, useEffect } from 'react'
import type { MovieItem } from '../types/cinema'
import { useCinema } from '../hooks/useCinema'
import { Play, Plus, Check, Info, Star, Film, Sparkles } from 'lucide-react'
import { getOptimizedImageUrl, getFallbackPoster, generateSvgPoster } from '../utils/imageFallbacks'
import { getMoviePrimaryGenreLabel, getGenreLabel } from '../utils/genreUtils'

interface CinemaMovieCardProps {
  movie: MovieItem
}

export const CinemaMovieCard: React.FC<CinemaMovieCardProps> = ({ movie }) => {
  const { openMovieDetail, playMovie, toggleWatchlist, isInWatchlist } = useCinema()
  const [isHovered, setIsHovered] = useState(false)
  const isSaved = isInWatchlist(movie.id)

  const initialPoster = getOptimizedImageUrl(
    movie.posterUrl,
    'poster',
    movie.genres,
    movie.franchise
  )

  const [currentPoster, setCurrentPoster] = useState(initialPoster)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasImageError, setHasImageError] = useState(false)

  // Synchronize poster state when movie updates
  useEffect(() => {
    setCurrentPoster(
      getOptimizedImageUrl(movie.posterUrl, 'poster', movie.genres, movie.franchise)
    )
    setIsLoaded(false)
    setHasImageError(false)
  }, [movie.id, movie.posterUrl])

  const handleCardImageError = () => {
    const fallback = getFallbackPoster(movie.genres, movie.franchise)
    if (currentPoster !== fallback) {
      setCurrentPoster(fallback)
    } else {
      // Stage 2: Fallback to tailored dynamic SVG Poster with title, year and rating
      const svgFallback = generateSvgPoster(movie.title, movie.year, movie.rating)
      if (currentPoster !== svgFallback) {
        setCurrentPoster(svgFallback)
      } else {
        setHasImageError(true)
      }
    }
  }

  const hasTrailer = Boolean(movie.youtubeKey || (movie.trailerUrl && movie.trailerUrl.includes('youtu')))

  return (
    <div
      className="group relative flex-none w-[170px] sm:w-[220px] md:w-[250px] aspect-[2/3] rounded-sm overflow-hidden bg-[#11131a] border border-[#181b24] transition-transform duration-200 ease-out hover:scale-105 hover:z-20 hover:border-[#a51d35]/60 hover:shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(165,29,53,0.3)] cursor-pointer will-change-transform transform-gpu"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => openMovieDetail(movie)}
    >
      {/* Stylized Ambient Underlay (Prevents black empty cards during loading or offline) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#181b24] via-[#11131a] to-[#0c0e14] flex flex-col items-center justify-center p-4 text-center pointer-events-none">
        <div className="w-12 h-12 rounded-full bg-[#a51d35]/25 border border-[#d4af70]/40 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(165,29,53,0.3)]">
          <Film className="w-6 h-6 text-[#d4af70]" />
        </div>
        <span className="text-xs font-bold text-[#f5f5f5] line-clamp-2 px-2 drop-shadow-sm">{movie.title}</span>
        <span className="text-[10px] font-mono text-[#d4af70] mt-1.5 font-semibold">★ {movie.rating} • {movie.year}</span>
        <span className="text-[9px] font-mono text-[#a1a1aa] mt-1">{getMoviePrimaryGenreLabel(movie.genres)}</span>
      </div>

      {/* Movie Poster Image with Resilient Cloudflare CDN Proxy & Multi-Stage Fallback */}
      {!hasImageError && currentPoster && (
        <img
          src={currentPoster}
          alt={movie.title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={handleCardImageError}
          className={`relative z-[1] w-full h-full object-cover transition-all duration-300 ease-out group-hover:scale-110 will-change-transform transform-gpu ${
            isLoaded || currentPoster.startsWith('data:') ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Top Badges (Quality & Rating) */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
        <span className="px-1.5 py-0.5 rounded-xs bg-black/75 backdrop-blur-md text-[9px] font-mono font-bold text-[#d4af70] border border-[#d4af70]/30">
          {movie.isTheatrical
            ? 'CHIẾU RẠP'
            : movie.streamSource === 'kkphim'
            ? 'HLS VIETSUB'
            : movie.quality === '4K ULTRA HD'
            ? '4K'
            : 'HD'}
        </span>

        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-xs bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-[#f5f5f5]">
          <Star className="w-2.5 h-2.5 fill-[#d4af70] text-[#d4af70]" />
          {movie.rating}
        </span>
      </div>

      {/* Continue Watching Progress Bar */}
      {movie.progressPercentage !== undefined && movie.progressPercentage > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#181b24] z-10">
          <div
            className="h-full bg-[#a51d35] shadow-[0_0_8px_rgba(165,29,53,0.8)]"
            style={{ width: `${movie.progressPercentage}%` }}
          />
        </div>
      )}

      {/* Default Bottom Vignette (When not hovered) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-transparent to-transparent opacity-90 group-hover:opacity-0 transition-opacity" />

      {/* Default Bottom Title Bar */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 group-hover:opacity-0 transition-opacity z-10">
        <h4 className="text-xs sm:text-sm font-bold text-[#f5f5f5] line-clamp-1 drop-shadow-md">
          {movie.title}
        </h4>
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#a1a1aa] mt-0.5">
          <span>{movie.year}</span>
          <span>•</span>
          <span className="text-[#d4af70] font-medium truncate">{getMoviePrimaryGenreLabel(movie.genres)}</span>
        </div>
      </div>

      {/* Rich Hover Overlay with Quick Action Buttons */}
      <div
        className={`absolute inset-0 bg-[#0c0e14]/92 backdrop-blur-xs p-3.5 flex flex-col justify-between transition-opacity duration-200 z-20 will-change-opacity ${
          isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top Hover Info */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-emerald-400 font-bold">{movie.matchPercentage}% Phù hợp</span>
            <span className="text-[#a1a1aa]">{movie.duration}</span>
          </div>

          <h4 className="text-sm font-bold text-[#f5f5f5] line-clamp-2 leading-snug">
            {movie.title}
          </h4>

          <div className="flex flex-wrap gap-1 pt-1">
            {movie.genres.slice(0, 3).map((g, idx) => (
              <span
                key={idx}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded-xs bg-[#181b24] border border-[#2d3139] text-[#cbd5e1] font-medium"
              >
                {getGenreLabel(g)}
              </span>
            ))}
          </div>

          <p className="text-[11px] text-[#a1a1aa] line-clamp-3 leading-relaxed pt-1 font-sans">
            {movie.synopsis}
          </p>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center justify-between pt-2 border-t border-[#181b24]/80">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                playMovie(movie)
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#a51d35] hover:bg-[#c22240] text-white shadow-[0_0_12px_rgba(165,29,53,0.6)] hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer"
              title="Xem ngay trên web"
            >
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            </button>

            {hasTrailer && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  playMovie(movie, { isTrailer: true })
                }}
                className="flex items-center justify-center px-2 py-1 rounded-full bg-[#181b24] hover:bg-[#252a36] border border-[#d4af70]/40 text-[#d4af70] hover:text-white text-[10px] font-mono font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Xem trailer trực tiếp trong web"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                TRAILER
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                toggleWatchlist(movie.id)
              }}
              className={`flex items-center justify-center w-7 h-7 rounded-full border hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer ${
                isSaved
                  ? 'bg-[#d4af70]/20 border-[#d4af70] text-[#d4af70]'
                  : 'bg-[#181b24] border-[#2d3139] text-[#a1a1aa] hover:text-white hover:border-[#a1a1aa]'
              }`}
              title={isSaved ? 'Đã thêm vào danh sách' : 'Thêm vào danh sách'}
            >
              {isSaved ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                openMovieDetail(movie)
              }}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-[#181b24] border border-[#2d3139] text-[#a1a1aa] hover:text-white hover:border-[#a1a1aa] hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer"
              title="Thông tin chi tiết"
            >
              <Info className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
