import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * Universal helper to extract standard 11-char YouTube video ID from various URL formats
 */
function extractYoutubeKey(keyOrUrl?: string | null): string | null {
  if (!keyOrUrl) return null
  const trimmed = keyOrUrl.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
  return match ? match[1] : null
}

/**
 * Time formatting utility for media players
 */
function formatPlayerTime(seconds: number): string {
  const safeSec = Math.max(0, Math.floor(seconds))
  const hrs = Math.floor(safeSec / 3600)
  const mins = Math.floor((safeSec % 3600) / 60)
  const secs = safeSec % 60

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

describe('Cinema Video Player & Streaming Watch Engine — 10 Comprehensive Testcases', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // TC-PLY-01: YouTube ID extraction
  it('TC-PLY-01: extracts authentic 11-char YouTube video ID from various link formats', () => {
    expect(extractYoutubeKey('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(extractYoutubeKey('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(extractYoutubeKey('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s')).toBe('dQw4w9WgXcQ')
    expect(extractYoutubeKey('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(extractYoutubeKey('invalid-link-without-id')).toBeNull()
    expect(extractYoutubeKey(null)).toBeNull()
  })

  // TC-PLY-02: Quality Tier Initialization
  it('TC-PLY-02: initializes default stream quality based on user clearance (FHD for members, 4K for VIP)', () => {
    const getInitialQuality = (isVip: boolean, isAdmin: boolean) =>
      isVip || isAdmin ? '4K UHD' : '1080p FHD'

    expect(getInitialQuality(false, false)).toBe('1080p FHD')
    expect(getInitialQuality(true, false)).toBe('4K UHD')
    expect(getInitialQuality(false, true)).toBe('4K UHD')
  })

  // TC-PLY-03: Volume clamping and auto-mute
  it('TC-PLY-03: clamps audio volume cleanly between 0 and 1 and sets mute when 0', () => {
    const applyVolume = (val: number) => {
      const clamped = Math.max(0, Math.min(1, val))
      return { volume: clamped, isMuted: clamped === 0 }
    }

    expect(applyVolume(0.85)).toEqual({ volume: 0.85, isMuted: false })
    expect(applyVolume(0)).toEqual({ volume: 0, isMuted: true })
    expect(applyVolume(-0.5)).toEqual({ volume: 0, isMuted: true })
    expect(applyVolume(1.5)).toEqual({ volume: 1, isMuted: false })
  })

  // TC-PLY-04: Mute Toggle
  it('TC-PLY-04: toggles mute state while preserving underlying volume level', () => {
    let volume = 0.75
    let isMuted = false

    const toggleMute = () => {
      isMuted = !isMuted
      return { volume, isMuted }
    }

    expect(toggleMute()).toEqual({ volume: 0.75, isMuted: true })
    expect(toggleMute()).toEqual({ volume: 0.75, isMuted: false })
  })

  // TC-PLY-05: Time seek & skip bounds
  it('TC-PLY-05: clamps time seeking and skipping strictly within [0, duration]', () => {
    const duration = 7200 // 2 hours
    const calculateSkip = (current: number, delta: number) =>
      Math.max(0, Math.min(duration, current + delta))

    expect(calculateSkip(100, 10)).toBe(110)
    expect(calculateSkip(5, -10)).toBe(0)
    expect(calculateSkip(7195, 10)).toBe(7200)
  })

  // TC-PLY-06: Keyboard shortcuts isolation from input fields
  it('TC-PLY-06: ignores global shortcut keys when user focus is inside an input, textarea or editable field', () => {
    const shouldIgnoreKeyboard = (target: { tagName: string; isContentEditable?: boolean }) => {
      return (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        Boolean(target.isContentEditable)
      )
    }

    expect(shouldIgnoreKeyboard({ tagName: 'INPUT' })).toBe(true)
    expect(shouldIgnoreKeyboard({ tagName: 'TEXTAREA' })).toBe(true)
    expect(shouldIgnoreKeyboard({ tagName: 'DIV', isContentEditable: true })).toBe(true)
    expect(shouldIgnoreKeyboard({ tagName: 'DIV', isContentEditable: false })).toBe(false)
    expect(shouldIgnoreKeyboard({ tagName: 'BUTTON' })).toBe(false)
  })

  // TC-PLY-07: Multi-episode switching
  it('TC-PLY-07: switches active episode index and derives correct m3u8 stream URL', () => {
    const episodes = [
      { name: 'Tập 1', linkM3u8: 'https://stream.com/ep1.m3u8' },
      { name: 'Tập 2', linkM3u8: 'https://stream.com/ep2.m3u8' },
      { name: 'Tập 3', linkM3u8: 'https://stream.com/ep3.m3u8' },
    ]

    const getEpisodeStream = (index: number) => {
      const ep = episodes[index]
      return ep ? ep.linkM3u8 : 'fallback.mp4'
    }

    expect(getEpisodeStream(0)).toBe('https://stream.com/ep1.m3u8')
    expect(getEpisodeStream(1)).toBe('https://stream.com/ep2.m3u8')
    expect(getEpisodeStream(2)).toBe('https://stream.com/ep3.m3u8')
    expect(getEpisodeStream(99)).toBe('fallback.mp4')
  })

  // TC-PLY-08: Subtitle cycling
  it('TC-PLY-08: cycles subtitle options systematically through Vietnamese, English CC, and Off', () => {
    const cycleSubtitle = (current: string) => {
      if (current === 'Tiếng Việt') return 'English [CC]'
      if (current === 'English [CC]') return 'Tắt'
      return 'Tiếng Việt'
    }

    expect(cycleSubtitle('Tiếng Việt')).toBe('English [CC]')
    expect(cycleSubtitle('English [CC]')).toBe('Tắt')
    expect(cycleSubtitle('Tắt')).toBe('Tiếng Việt')
  })

  // TC-PLY-09: Theatrical mode fallback to trailer
  it('TC-PLY-09: detects theatrical movie without direct episodes and routes to YouTube trailer mode', () => {
    const resolveViewMode = (movie: { isTheatrical: boolean; episodes?: any[]; youtubeKey?: string }) => {
      if (movie.isTheatrical && (!movie.episodes || movie.episodes.length === 0) && movie.youtubeKey) {
        return 'youtube'
      }
      return 'video'
    }

    expect(resolveViewMode({ isTheatrical: true, episodes: [], youtubeKey: 'abc12345678' })).toBe('youtube')
    expect(resolveViewMode({ isTheatrical: false, episodes: [{ name: '1' }], youtubeKey: 'abc12345678' })).toBe('video')
  })

  // TC-PLY-10: Player time formatting
  it('TC-PLY-10: formats player time accurately in mm:ss or hh:mm:ss for cinematic durations', () => {
    expect(formatPlayerTime(0)).toBe('00:00')
    expect(formatPlayerTime(75)).toBe('01:15')
    expect(formatPlayerTime(3600)).toBe('01:00:00')
    expect(formatPlayerTime(5445)).toBe('01:30:45')
  })
})
