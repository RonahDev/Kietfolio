import React, { useState, useRef, useEffect, useCallback } from 'react'
import Hls from 'hls.js'
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
  Layers,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { getFallbackBackdrop } from '../utils/imageFallbacks'

export const CinemaVideoPlayer: React.FC = () => {
  const { playingMovie, closePlayer } = useCinema()
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hlsRef = useRef<Hls | null>(null)

  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.85)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [showSettings, setShowSettings] = useState(false)
  const [showEpisodes, setShowEpisodes] = useState(false)
  const [selectedQuality, setSelectedQuality] = useState('4K UHD')
  const [selectedSubtitle, setSelectedSubtitle] = useState('Tiếng Việt')
  const [currentEpIndex, setCurrentEpIndex] = useState<number>(0)
  const [streamError, setStreamError] = useState<string | null>(null)
  const [isBuffering, setIsBuffering] = useState(true)
  const [viewMode, setViewMode] = useState<'video' | 'youtube'>(() => {
    if (!playingMovie?.videoStreamUrl && playingMovie?.youtubeKey) return 'youtube'
    if (playingMovie?.streamSource === 'youtube') return 'youtube'
    return 'video'
  })

  useEffect(() => {
    if (!playingMovie?.videoStreamUrl && playingMovie?.youtubeKey) {
      setViewMode('youtube')
    } else if (playingMovie?.streamSource === 'youtube') {
      setViewMode('youtube')
    } else if (playingMovie?.videoStreamUrl) {
      setViewMode('video')
    }
  }, [playingMovie])

  // Derive active stream URL (either chosen episode or movie default)
  const activeStreamUrl =
    playingMovie?.episodes && playingMovie.episodes.length > 0
      ? playingMovie.episodes[currentEpIndex]?.linkM3u8 || playingMovie.videoStreamUrl
      : playingMovie?.videoStreamUrl || ''

  // Auto-hide controls during playback after 3.5s of inactivity
  const handleMouseMove = useCallback(() => {
    setShowControls(true)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    if (isPlaying) {
      hideTimerRef.current = setTimeout(() => {
        setShowControls(false)
        setShowSettings(false)
        setShowEpisodes(false)
      }, 3500)
    }
  }, [isPlaying])

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => setIsPlaying(false))
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
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
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

  // ========================================================
  // HLS.JS STREAM ATTACHMENT & ADAPTIVE PLAYBACK
  // ========================================================
  useEffect(() => {
    const video = videoRef.current
    if (!video || !activeStreamUrl || viewMode === 'youtube') return

    setStreamError(null)
    setIsBuffering(true)

    // Destroy existing Hls instance if any
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    const isM3U8 = activeStreamUrl.includes('.m3u8')

    if (isM3U8 && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      })
      hlsRef.current = hls

      hls.loadSource(activeStreamUrl)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsBuffering(false)
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
      })

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError()
              break
            default:
              hls.destroy()
              setStreamError('Không thể kết nối luồng phát m3u8. Bạn có thể xem trailer hoặc luồng dự phòng.')
              setIsBuffering(false)
              break
          }
        }
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari HLS
      video.src = activeStreamUrl
      video.addEventListener('loadedmetadata', () => {
        setIsBuffering(false)
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
      })
    } else {
      // Standard MP4 stream fallback
      video.src = activeStreamUrl
      video.addEventListener('loadedmetadata', () => {
        setIsBuffering(false)
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
      })
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [activeStreamUrl, viewMode])

  if (!playingMovie) return null

  // Format time (hh:mm:ss)
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const hasMultipleEpisodes = Boolean(playingMovie.episodes && playingMovie.episodes.length > 1)

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* View Mode: YouTube Embed Player */}
      {viewMode === 'youtube' && playingMovie.youtubeKey ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black p-2 sm:p-6 relative">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${playingMovie.youtubeKey}?autoplay=1&controls=1&rel=0&modestbranding=1`}
            title={playingMovie.title}
            className="w-full h-full max-w-6xl aspect-video border-0 shadow-2xl rounded-sm"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="origin-when-cross-origin"
            allowFullScreen
          />
          {/* Quick External Link & Fallback Action Bar for YouTube */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#181b24] text-[11px] font-mono text-[#a1a1aa] z-30">
            <span>Video không tự chạy?</span>
            <a
              href={playingMovie.trailerUrl || `https://www.youtube.com/watch?v=${playingMovie.youtubeKey}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#d4af70] hover:underline font-bold flex items-center gap-1"
            >
              Mở trực tiếp trên YouTube <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      ) : (
        /* View Mode: High-Performance HTML5 / HLS.js Video Element */
        <video
          ref={videoRef}
          poster={playingMovie.backdropUrl || getFallbackBackdrop(playingMovie.genres, playingMovie.franchise)}
          autoPlay
          playsInline
          onTimeUpdate={() => {
            if (videoRef.current) setCurrentTime(videoRef.current.currentTime)
          }}
          onLoadedMetadata={() => {
            if (videoRef.current) setDuration(videoRef.current.duration)
          }}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          onClick={togglePlay}
          className="w-full h-full object-contain cursor-pointer"
        />
      )}

      {/* Buffering Spinner */}
      {isBuffering && viewMode === 'video' && !streamError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-xs pointer-events-none z-20">
          <div className="w-14 h-14 rounded-full border-3 border-[#a51d35] border-t-[#d4af70] animate-spin" />
          <span className="mt-3 text-xs font-mono text-[#d4af70] tracking-wider uppercase">
            ĐANG TẢI LUỒNG HLS 4K...
          </span>
        </div>
      )}

      {/* Stream Error Alert Card with Fallback Options */}
      {streamError && viewMode === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-30 p-6">
          <div className="max-w-md w-full bg-[#11131a] border border-[#a51d35]/60 rounded-sm p-6 space-y-4 text-center shadow-[0_0_50px_rgba(165,29,53,0.5)]">
            <AlertCircle className="w-12 h-12 text-[#a51d35] mx-auto animate-pulse" />
            <h4 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Không Thể Tải Luồng Phim Trực Tiếp
            </h4>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              {streamError}
            </p>
            <div className="flex flex-col gap-2 pt-2">
              {playingMovie.trailerUrl && (
                <a
                  href={playingMovie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#a51d35] hover:bg-[#c22240] text-white text-xs font-mono font-bold transition-all"
                >
                  <span>MỞ TRAILER TRÊN YOUTUBE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                type="button"
                onClick={closePlayer}
                className="px-4 py-2 rounded-full bg-[#181b24] hover:bg-[#252a36] text-[#f5f5f5] text-xs font-mono transition-colors"
              >
                Đóng Trình Phát
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Center Big Play Indicator when paused */}
      {!isPlaying && viewMode === 'video' && !isBuffering && !streamError && (
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
        className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/95 via-black/60 to-transparent flex items-center justify-between z-30 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded-xs bg-[#a51d35] text-white font-bold text-[10px] tracking-wider uppercase">
              {playingMovie.streamSource === 'kkphim' ? 'KKPHIM HLS STREAM' : '4K ULTRA HD'}
            </span>
            <span className="text-[#d4af70] font-bold">{playingMovie.audio}</span>
            {hasMultipleEpisodes && (
              <span className="text-emerald-400 font-bold">
                TẬP {playingMovie.episodes?.[currentEpIndex]?.name || currentEpIndex + 1}
              </span>
            )}
          </div>
          <h3 className="text-lg sm:text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif] text-white">
            {playingMovie.title}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Official Watch Provider Shortcut */}
          {playingMovie.watchProviders && playingMovie.watchProviders.length > 0 && (
            <a
              href={playingMovie.watchProviders[0]?.streamUrl || 'https://www.netflix.com/vn/'}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/50 text-xs font-mono font-bold text-emerald-300 hover:bg-emerald-900 transition-all cursor-pointer"
              title={`Xem bản quyền chính thức trên ${playingMovie.watchProviders[0]?.providerName}`}
            >
              <img
                src={playingMovie.watchProviders[0]?.logoPath}
                alt={playingMovie.watchProviders[0]?.providerName}
                className="w-4 h-4 rounded-xs object-cover"
              />
              <span>XEM TRÊN {playingMovie.watchProviders[0]?.providerName.toUpperCase()}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* Switch between HLS Stream and YouTube Trailer */}
          {Boolean(playingMovie.youtubeKey) && (
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'video' ? 'youtube' : 'video')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-[#a51d35]/60 text-xs font-mono font-bold text-white hover:bg-[#a51d35] transition-all cursor-pointer"
            >
              <span>{viewMode === 'video' ? 'XEM TRAILER' : 'BẢN PHIM'}</span>
            </button>
          )}

          {/* Episode Switcher Button (For KKPhim multi-episode titles) */}
          {hasMultipleEpisodes && (
            <button
              type="button"
              onClick={() => setShowEpisodes(!showEpisodes)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-[#d4af70]/50 text-xs font-mono font-bold text-[#d4af70] hover:bg-[#d4af70] hover:text-black transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>CHỌN TẬP ({playingMovie.episodes?.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={closePlayer}
            className="p-2.5 rounded-full bg-black/60 border border-[#181b24] text-white hover:bg-[#a51d35] transition-colors cursor-pointer"
            title="Thoát trình phát (Phím ESC)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Episode Selection Drawer Modal */}
      {showEpisodes && hasMultipleEpisodes && (
        <div className="absolute top-20 right-6 z-40 max-w-sm w-full bg-[#0c0e14]/95 border border-[#181b24] rounded-sm p-4 backdrop-blur-md shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-[#181b24] pb-2">
            <span className="text-xs font-mono font-bold text-[#d4af70] uppercase">
              DANH SÁCH TẬP PHIM
            </span>
            <button
              type="button"
              onClick={() => setShowEpisodes(false)}
              className="text-[#a1a1aa] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto grid grid-cols-4 gap-2 pr-1">
            {playingMovie.episodes?.map((ep, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentEpIndex(idx)
                  setShowEpisodes(false)
                }}
                className={`p-2 rounded-xs text-xs font-mono transition-all ${
                  currentEpIndex === idx
                    ? 'bg-[#a51d35] text-white font-bold shadow-[0_0_12px_rgba(165,29,53,0.6)]'
                    : 'bg-[#181b24] text-[#a1a1aa] hover:text-white hover:bg-[#252a36]'
                }`}
              >
                Tập {ep.name}
              </button>
            ))}
          </div>
        </div>
      )}

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
                          onClick={() => {
                            setPlaybackSpeed(speed)
                            if (videoRef.current) videoRef.current.playbackRate = speed
                            setShowSettings(false)
                          }}
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
