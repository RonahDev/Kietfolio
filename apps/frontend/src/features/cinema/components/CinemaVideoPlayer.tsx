import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useCinema } from '../hooks/useCinema'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  X,
  Settings,
  Subtitles,
  Sparkles,
} from 'lucide-react'

export const CinemaVideoPlayer: React.FC = () => {
  const { playingMovie, closePlayer } = useCinema()
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.85)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedQuality, setSelectedQuality] = useState('4K UHD')
  const [selectedSubtitle, setSelectedSubtitle] = useState('Tiếng Việt')

  // Auto-hide controls during playback after 3.5s of inactivity
  const handleMouseMove = useCallback(() => {
    setShowControls(true)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    if (isPlaying) {
      hideTimerRef.current = setTimeout(() => {
        setShowControls(false)
        setShowSettings(false)
      }, 3500)
    }
  }, [isPlaying])

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  // Volume change
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol)
    setIsMuted(newVol === 0)
    if (videoRef.current) {
      videoRef.current.volume = newVol
      videoRef.current.muted = newVol === 0
    }
  }

  // Mute toggle
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return
    setIsMuted((prev) => {
      const nextMute = !prev
      if (videoRef.current) {
        videoRef.current.muted = nextMute
      }
      return nextMute
    })
  }, [])

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value)
    setCurrentTime(targetTime)
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime
    }
  }

  // Skip seconds
  const skipTime = useCallback((seconds: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = Math.max(
      0,
      Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + seconds)
    )
  }, [])

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true))
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false))
    }
  }, [])

  // Keyboard shortcuts (Space, F, M, ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        togglePlay()
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault()
        toggleFullscreen()
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault()
        toggleMute()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        skipTime(10)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        skipTime(-10)
      } else if (e.key === 'Escape') {
        if (!document.fullscreenElement) {
          closePlayer()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, toggleFullscreen, toggleMute, skipTime, closePlayer])

  // Sync video time updates
  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    setCurrentTime(videoRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return
    setDuration(videoRef.current.duration)
  }

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackSpeed(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
    setShowSettings(false)
  }

  if (!playingMovie) return null

  // Format time (hh:mm:ss)
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* Video Stream Element */}
      <video
        ref={videoRef}
        src={playingMovie.videoStreamUrl}
        poster={playingMovie.backdropUrl}
        autoPlay
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Center Big Play Indicator when paused */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs cursor-pointer z-10"
        >
          <div className="w-20 h-20 rounded-full bg-[#a51d35]/90 border border-[#d4af70] flex items-center justify-center text-white shadow-[0_0_40px_rgba(165,29,53,0.8)] scale-100 hover:scale-110 transition-transform">
            <Play className="w-10 h-10 fill-white ml-1.5" />
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div
        className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between z-30 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-1.5 py-0.2 rounded-xs bg-[#a51d35] text-white font-bold text-[10px]">
              {selectedQuality}
            </span>
            <span className="text-[#d4af70] font-bold">{playingMovie.audio}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-white">
            {playingMovie.title}
          </h3>
        </div>

        <button
          type="button"
          onClick={closePlayer}
          className="p-2.5 rounded-full bg-black/60 border border-[#181b24] text-white hover:bg-[#a51d35] transition-colors cursor-pointer"
          title="Thoát trình phát (Phím ESC)"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Control Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-30 space-y-3 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scrubber / Seek Bar with buffer indication */}
        <div className="relative group/seek flex items-center w-full">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-[#222733] accent-[#a51d35] rounded-lg appearance-none cursor-pointer group-hover/seek:h-2.5 transition-all"
          />
        </div>

        {/* Lower Controls Row */}
        <div className="flex items-center justify-between text-white font-mono text-xs">
          {/* Left Controls: Play/Pause, Skip, Volume, Time */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={togglePlay}
              className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label={isPlaying ? 'Tạm dừng' : 'Phát tiếp'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
            </button>

            <button
              type="button"
              onClick={() => skipTime(-10)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title="Lùi 10 giây (←)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => skipTime(10)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title="Tua 10 giây (→)"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                title="Tắt/Bật âm lượng (M)"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-red-400" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 sm:w-20 h-1 bg-[#222733] accent-[#a51d35] cursor-pointer"
              />
            </div>

            {/* Time Display */}
            <span className="text-[#a1a1aa] text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Controls: Subtitles, Settings, Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Subtitle Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setSelectedSubtitle((prev) =>
                    prev === 'Tiếng Việt' ? 'English [CC]' : prev === 'English [CC]' ? 'Tắt' : 'Tiếng Việt'
                  )
                }
                className="flex items-center gap-1 px-2.5 py-1 rounded-sm bg-white/10 hover:bg-white/20 text-[11px] transition-colors cursor-pointer"
                title="Chuyển đổi phụ đề"
              >
                <Subtitles className="w-3.5 h-3.5 text-[#d4af70]" />
                <span className="hidden sm:inline">{selectedSubtitle}</span>
              </button>
            </div>

            {/* Quality & Speed Settings */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                title="Cài đặt phát lại"
              >
                <Settings className="w-5 h-5" />
              </button>

              {showSettings && (
                <div className="absolute bottom-full right-0 mb-3 w-48 rounded-sm bg-[#11131a] border border-[#181b24] shadow-2xl p-3 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div>
                    <span className="text-[10px] text-[#a1a1aa] block uppercase mb-1">
                      Tốc Độ Phát
                    </span>
                    <div className="grid grid-cols-4 gap-1 text-[10px]">
                      {[0.75, 1, 1.25, 1.5].map((speed) => (
                        <button
                          key={speed}
                          type="button"
                          onClick={() => handlePlaybackRateChange(speed)}
                          className={`py-1 rounded-xs ${
                            playbackSpeed === speed
                              ? 'bg-[#a51d35] text-white font-bold'
                              : 'bg-[#181b24] text-[#a1a1aa]'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#a1a1aa] block uppercase mb-1">
                      Chất Lượng
                    </span>
                    <div className="space-y-1 text-[11px]">
                      {['4K UHD', '1080p FHD', '720p HD'].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => {
                            setSelectedQuality(q)
                            setShowSettings(false)
                          }}
                          className={`w-full text-left px-2 py-1 rounded-xs flex items-center justify-between ${
                            selectedQuality === q
                              ? 'bg-[#a51d35]/20 text-[#d4af70] font-bold'
                              : 'text-[#a1a1aa] hover:bg-[#181b24]'
                          }`}
                        >
                          <span>{q}</span>
                          {selectedQuality === q && <Sparkles className="w-3 h-3 text-[#d4af70]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title="Toàn màn hình (F)"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
