import React, { useEffect } from 'react'
import { useCinema } from '../hooks/useCinema'
import {
  X,
  Play,
  Plus,
  Check,
  Star,
  Volume2,
} from 'lucide-react'

export const CinemaDetailModal: React.FC = () => {
  const { activeMovie, closeMovieDetail, playMovie, toggleWatchlist, isInWatchlist, movies } =
    useCinema()

  // ESC key to close modal
  useEffect(() => {
    if (!activeMovie) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMovieDetail()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeMovie, closeMovieDetail])

  if (!activeMovie) return null

  const isSaved = isInWatchlist(activeMovie.id)

  // Find similar movies
  const similarMovies = activeMovie.similarMovieIds
    ? movies.filter((m) => activeMovie.similarMovieIds?.includes(m.id))
    : movies.filter((m) => m.id !== activeMovie.id).slice(0, 3)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="movie-detail-title"
    >
      <div className="relative w-full max-w-4xl rounded-sm bg-[#0c0e14] border border-[#181b24] shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(165,29,53,0.25)] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeMovieDetail}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/70 border border-[#181b24] text-[#a1a1aa] hover:text-white hover:bg-[#a51d35] transition-all cursor-pointer"
          aria-label="Đóng chi tiết phim"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Banner with Backdrop Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden flex-none">
          <img
            src={activeMovie.backdropUrl}
            alt={activeMovie.title}
            className="w-full h-full object-cover object-center"
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-[#0c0e14]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0e14]/90 via-transparent to-transparent" />

          {/* Quick Play Action Floating on Backdrop */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 rounded-xs bg-[#a51d35] text-white font-bold text-[10px]">
                  {activeMovie.streamSource === 'kkphim' ? 'KKPHIM HLS' : activeMovie.quality}
                </span>
                <span className="flex items-center gap-1 text-[#d4af70] font-bold">
                  <Star className="w-3.5 h-3.5 fill-[#d4af70]" />
                  {activeMovie.rating}
                </span>
                <span className="text-[#a1a1aa]">{activeMovie.year}</span>
                <span className="text-[#a1a1aa]">{activeMovie.duration}</span>
              </div>

              <h2
                id="movie-detail-title"
                className="text-2xl sm:text-4xl font-black font-['Plus_Jakarta_Sans',sans-serif] text-white leading-tight drop-shadow-lg"
              >
                {activeMovie.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  closeMovieDetail()
                  playMovie(activeMovie)
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#a51d35] hover:bg-[#c22240] text-white font-mono font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(165,29,53,0.6)] transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>PHÁT NGAY</span>
              </button>

              {activeMovie.trailerUrl && (
                <a
                  href={activeMovie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#181b24] hover:bg-[#252a36] border border-[#2d3139] text-[#f5f5f5] font-mono text-xs transition-colors"
                >
                  <span>TRAILER</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => toggleWatchlist(activeMovie.id)}
                className={`flex items-center justify-center p-2.5 rounded-full border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-[#d4af70]/20 border-[#d4af70] text-[#d4af70]'
                    : 'bg-[#181b24] border-[#2d3139] text-white hover:border-[#d4af70]'
                }`}
                title={isSaved ? 'Đã lưu vào danh sách' : 'Lưu vào danh sách'}
              >
                {isSaved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Body Information */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Synopsis & Tagline */}
          <div className="space-y-2">
            <p className="text-sm font-mono italic text-[#d4af70]">"{activeMovie.tagline}"</p>
            <p className="text-sm text-[#cbd5e1] leading-relaxed font-sans">
              {activeMovie.synopsis}
            </p>
          </div>

          {/* Technical Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-sm bg-[#11131a] border border-[#181b24] text-xs font-mono">
            <div>
              <span className="text-[#a1a1aa] block text-[10px] uppercase">Đạo Diễn</span>
              <span className="text-[#f5f5f5] font-semibold">{activeMovie.director}</span>
            </div>
            <div>
              <span className="text-[#a1a1aa] block text-[10px] uppercase">Âm Thanh</span>
              <span className="text-[#d4af70] font-semibold flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" />
                {activeMovie.audio}
              </span>
            </div>
            <div>
              <span className="text-[#a1a1aa] block text-[10px] uppercase">Độ Phân Giải</span>
              <span className="text-[#f5f5f5] font-semibold">{activeMovie.quality}</span>
            </div>
            <div>
              <span className="text-[#a1a1aa] block text-[10px] uppercase">Phân Loại Tuổi</span>
              <span className="text-rose-400 font-semibold">{activeMovie.maturityRating}</span>
            </div>
          </div>

          {/* Cast & Crew Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa] font-bold">
              Diễn Viên & Vai Diễn
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {activeMovie.cast.map((actor, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-sm bg-[#11131a] border border-[#181b24] flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-[#181b24] border border-[#d4af70]/40 flex items-center justify-center text-[#d4af70] text-xs font-mono font-bold">
                    {actor.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#f5f5f5] block">{actor.name}</span>
                    <span className="text-[11px] font-mono text-[#a1a1aa]">{actor.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Similar Recommended Movies */}
          {similarMovies.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa] font-bold">
                Phim Tương Tự Có Thể Bạn Thích
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {similarMovies.map((similar) => (
                  <div
                    key={similar.id}
                    onClick={() => {
                      closeMovieDetail()
                      playMovie(similar)
                    }}
                    className="group p-2.5 rounded-sm bg-[#11131a] border border-[#181b24] hover:border-[#a51d35] transition-all cursor-pointer flex gap-3"
                  >
                    <img
                      src={similar.posterUrl}
                      alt={similar.title}
                      className="w-14 h-20 object-cover rounded-xs"
                    />
                    <div className="flex-1 space-y-1">
                      <span className="text-xs font-bold text-[#f5f5f5] line-clamp-1 group-hover:text-[#d4af70] transition-colors">
                        {similar.title}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-mono text-[#a1a1aa]">
                        <Star className="w-3 h-3 fill-[#d4af70] text-[#d4af70]" />
                        <span>{similar.rating}</span>
                        <span>•</span>
                        <span>{similar.year}</span>
                      </div>
                      <p className="text-[10px] text-[#a1a1aa] line-clamp-2">{similar.synopsis}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
