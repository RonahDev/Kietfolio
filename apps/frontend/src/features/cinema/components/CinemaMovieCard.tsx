import React, { useState } from 'react'
import type { MovieItem } from '../types/cinema'
import { useCinema } from '../hooks/useCinema'
import { Play, Plus, Check, Info, Star } from 'lucide-react'

interface CinemaMovieCardProps {
  movie: MovieItem
}

export const CinemaMovieCard: React.FC<CinemaMovieCardProps> = ({ movie }) => {
  const { openMovieDetail, playMovie, toggleWatchlist, isInWatchlist } = useCinema()
  const [isHovered, setIsHovered] = useState(false)
  const isSaved = isInWatchlist(movie.id)

  return (
    <div
      className="group relative flex-none w-[170px] sm:w-[220px] md:w-[250px] aspect-[2/3] rounded-sm overflow-hidden bg-[#11131a] border border-[#181b24] transition-transform duration-200 ease-out hover:scale-105 hover:z-20 hover:border-[#a51d35]/60 hover:shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(165,29,53,0.3)] cursor-pointer will-change-transform transform-gpu"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => openMovieDetail(movie)}
    >
      {/* Movie Poster Image */}
      <img
        src={movie.posterUrl}
        alt={movie.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110 will-change-transform transform-gpu"
      />

      {/* Top Badges (Quality & Rating) */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
        <span className="px-1.5 py-0.5 rounded-xs bg-black/75 backdrop-blur-md text-[9px] font-mono font-bold text-[#d4af70] border border-[#d4af70]/30">
          {movie.streamSource === 'kkphim' ? 'HLS VIETSUB' : movie.quality === '4K ULTRA HD' ? '4K' : 'HD'}
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
          <span className="capitalize">{movie.genres[0]}</span>
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
            {movie.genres.slice(0, 2).map((g, idx) => (
              <span
                key={idx}
                className="text-[9px] font-mono px-1.5 py-0.2 rounded-xs bg-[#181b24] text-[#a1a1aa]"
              >
                {g}
              </span>
            ))}
          </div>

          <p className="text-[11px] text-[#a1a1aa] line-clamp-3 leading-relaxed pt-1 font-sans">
            {movie.synopsis}
          </p>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center justify-between pt-2 border-t border-[#181b24]/80">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              playMovie(movie)
            }}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#a51d35] hover:bg-[#c22240] text-white shadow-[0_0_12px_rgba(165,29,53,0.6)] hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer"
            title="Xem ngay"
          >
            <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
          </button>

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
