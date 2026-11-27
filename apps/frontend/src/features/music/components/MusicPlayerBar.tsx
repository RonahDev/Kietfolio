import React, { useEffect, useState } from 'react'
import {
  Heart,
  ListMusic,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { formatMusicTime, useMusicTheater } from '../hooks/useMusicTheater'
import { useMusicI18n } from '../hooks/useMusicI18n'

export const MusicPlayerBar: React.FC = () => {
  const {
    currentTrack,
    queue,
    allTracks,
    isPlaying,
    isLoadingAudio,
    audioError,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    settings,
    playTrack,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    toggleFavorite,
    isFavorite,
  } = useMusicTheater()
  const { language, t } = useMusicI18n()

  const [queueOpen, setQueueOpen] = useState(false)

  // Scoped keyboard shortcuts for active player controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentTrack) return
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return
      }

      if (e.code === 'Space') {
        e.preventDefault()
        void togglePlayPause()
      } else if (e.key === 'ArrowRight' && e.altKey) {
        e.preventDefault()
        seekTo(Math.min(duration || 0, currentTime + 5))
      } else if (e.key === 'ArrowLeft' && e.altKey) {
        e.preventDefault()
        seekTo(Math.max(0, currentTime - 5))
      } else if (e.key.toLowerCase() === 'm') {
        toggleMute()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentTime, currentTrack, duration, seekTo, toggleMute, togglePlayPause])

  const effectiveDuration = duration > 0 ? duration : currentTrack?.duration || 0
  const trackById = new Map(allTracks.map((t) => [t.id, t]))
  const queueTracks = queue
    .map((id) => trackById.get(id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))

  const fav = currentTrack ? isFavorite(currentTrack.id) : false

  return (
    <div
      data-testid="music-player-bar"
      className="fixed bottom-14 md:bottom-0 inset-x-0 z-30 bg-[#181716]/95 backdrop-blur-md border-t border-[#C6A878]/20 px-4 py-3 text-[#F1EDE6]"
    >
      {/* Queue Drawer */}
      {queueOpen && (
        <div className="absolute bottom-full right-4 mb-2 w-80 max-h-80 overflow-y-auto rounded-2xl border border-[#C6A878]/25 bg-[#181716] shadow-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C6A878] font-semibold">
              {language === 'vi'
                ? `Hàng Đợi Trình Diễn (${queueTracks.length})`
                : `Performance Queue (${queueTracks.length})`}
            </h4>
            <button
              type="button"
              onClick={() => setQueueOpen(false)}
              aria-label="Close queue"
              className="p-1 rounded-lg text-[#A49C92] hover:text-[#F1EDE6]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {queueTracks.length === 0 ? (
            <p className="text-xs text-[#A49C92]">
              {language === 'vi' ? 'Chưa có bài hát trong hàng đợi.' : 'No tracks queued.'}
            </p>
          ) : (
            <div className="space-y-1.5">
              {queueTracks.map((track) => {
                const active = track.id === currentTrack?.id
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => void playTrack(track)}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#321B22] border border-[#C6A878]/30'
                        : 'hover:bg-[#22201E]'
                    }`}
                  >
                    <img
                      src={track.artworkUrl}
                      alt={track.title}
                      className="w-8 h-8 rounded object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[#F1EDE6] truncate">{track.title}</p>
                      <p className="text-[11px] text-[#A49C92] truncate">{track.artist}</p>
                    </div>
                    <span className="text-[10px] text-[#A49C92] shrink-0">
                      {formatMusicTime(track.duration)}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {audioError && (
        <div
          role="alert"
          className="mb-2 px-3 py-1.5 rounded-lg bg-[#542C35]/70 border border-[#C6A878]/30 text-xs text-[#F1EDE6] flex items-center justify-between"
        >
          <span>{audioError}</span>
        </div>
      )}

      <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center gap-3 lg:gap-6">
        {/* Track Identity & Artwork */}
        <div className="w-full lg:w-72 flex items-center gap-3 min-w-0">
          {currentTrack ? (
            <>
              <img
                src={currentTrack.artworkUrl}
                alt={currentTrack.title}
                className="w-11 h-11 rounded-lg object-cover border border-[#C6A878]/25 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#F1EDE6] truncate">
                    {currentTrack.title}
                  </p>
                  {settings.enableVisualizer && isPlaying && (
                    <span className="inline-flex items-end gap-0.5 h-3" aria-hidden="true">
                      <span className="w-0.5 h-2 bg-[#D6AD73] animate-pulse" />
                      <span className="w-0.5 h-3 bg-[#C6A878] animate-pulse" />
                      <span className="w-0.5 h-1.5 bg-[#D6AD73] animate-pulse" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#A49C92] truncate">
                  {currentTrack.artist} •{' '}
                  {currentTrack.sourceType === 'local'
                    ? currentTrack.format.toUpperCase()
                    : language === 'vi'
                      ? 'Thính Phòng'
                      : 'Concert Hall'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void toggleFavorite(currentTrack.id)}
                aria-label={fav ? 'Remove current track from favorites' : 'Add current track to favorites'}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  fav ? 'text-[#D6AD73]' : 'text-[#A49C92] hover:text-[#F1EDE6]'
                }`}
              >
                <Heart className={`w-4 h-4 ${fav ? 'fill-[#D6AD73]' : ''}`} />
              </button>
            </>
          ) : (
            <p className="text-xs text-[#A49C92]">{t.noTrackSelected}</p>
          )}
        </div>

        {/* Center Transport & Seek Bar */}
        <div className="w-full flex-1 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleShuffle}
              aria-label="Toggle shuffle"
              aria-pressed={isShuffle}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isShuffle ? 'text-[#D6AD73] bg-[#321B22]' : 'text-[#A49C92] hover:text-[#F1EDE6]'
              }`}
              title={t.shuffle}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => void playPrevious()}
              aria-label="Previous song"
              className="p-1.5 text-[#F1EDE6] hover:text-[#C6A878] transition-colors cursor-pointer"
              title={t.previous}
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => void togglePlayPause()}
              disabled={!currentTrack || isLoadingAudio}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="w-9 h-9 rounded-full bg-[#C6A878] hover:bg-[#D6AD73] text-[#101010] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
              title={isPlaying ? `${t.pause} (Space)` : `${t.play} (Space)`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={() => void playNext()}
              aria-label="Next song"
              className="p-1.5 text-[#F1EDE6] hover:text-[#C6A878] transition-colors cursor-pointer"
              title={t.next}
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={cycleRepeatMode}
              aria-label={`Repeat mode: ${repeatMode}`}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                repeatMode !== 'off'
                  ? 'text-[#D6AD73] bg-[#321B22]'
                  : 'text-[#A49C92] hover:text-[#F1EDE6]'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="w-full max-w-xl flex items-center gap-2.5 text-[11px] text-[#A49C92]">
            <span className="w-9 text-right tabular-nums" data-testid="player-current-time">
              {formatMusicTime(currentTime)}
            </span>
            <input
              type="range"
              aria-label="Seek timeline"
              min={0}
              max={effectiveDuration > 0 ? effectiveDuration : 100}
              step={0.5}
              value={Math.min(currentTime, effectiveDuration > 0 ? effectiveDuration : 100)}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="flex-1 h-1.5 accent-[#C6A878] bg-[#22201E] rounded-lg cursor-pointer"
            />
            <span className="w-9 tabular-nums" data-testid="player-total-duration">
              {formatMusicTime(effectiveDuration)}
            </span>
          </div>
        </div>

        {/* Right Volume & Queue */}
        <div className="hidden sm:flex items-center gap-3 w-56 justify-end">
          <button
            type="button"
            onClick={() => setQueueOpen((v) => !v)}
            aria-label="Toggle queue"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              queueOpen ? 'text-[#C6A878] bg-[#321B22]' : 'text-[#A49C92] hover:text-[#F1EDE6]'
            }`}
            title="Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="p-2 text-[#A49C92] hover:text-[#F1EDE6] transition-colors cursor-pointer"
            title="Mute / Unmute (M)"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-[#D6AD73]" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <input
            type="range"
            aria-label="Volume"
            min={0}
            max={1}
            step={0.02}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 h-1.5 accent-[#C6A878] bg-[#22201E] rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
