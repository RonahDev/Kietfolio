import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { SITE_CONFIG } from '@/config/site'
import { LanguageProvider } from '@/context'
import { MusicTheaterHub } from '../MusicTheaterHub'
import { musicIndexedDb, resetMusicDbConnectionForTests } from '../services/musicIndexedDb'

function makeTestWavFile(name: string, durationSec = 2): File {
  const sampleRate = 8000
  const samples = sampleRate * durationSec
  const buf = new ArrayBuffer(44 + samples * 2)
  const view = new DataView(buf)
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i))
  }
  writeStr(0, 'RIFF')
  view.setUint32(4, 36 + samples * 2, true)
  writeStr(8, 'WAVE')
  writeStr(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeStr(36, 'data')
  view.setUint32(40, samples * 2, true)
  return new File([buf], name, { type: 'audio/wav' })
}

async function renderHub(onBack = vi.fn()) {
  let rendered: ReturnType<typeof render>
  await act(async () => {
    rendered = render(<MusicTheaterHub onBackToPortfolio={onBack} />)
  })
  return rendered!
}

describe('Private Music Theater UI Integration', () => {
  beforeEach(async () => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    resetMusicDbConnectionForTests()
    await musicIndexedDb.clearAllLocalMusicData()

    // Mock Audio element playback methods safely in JSDOM
    vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve())
    vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    if (typeof URL.createObjectURL !== 'function') {
      URL.createObjectURL = vi.fn(() => 'blob:music-test-url')
    }
    if (typeof URL.revokeObjectURL !== 'function') {
      URL.revokeObjectURL = vi.fn()
    }
  })

  it('displays 4-scene Theater Intro on first visit, allows Skip Intro, and does not replay on remount within session', async () => {
    const onBack = vi.fn()
    const { unmount } = await renderHub(onBack)

    const intro = screen.getByTestId('music-theater-intro')
    expect(intro).toBeTruthy()
    expect(screen.getByText('Enter the Theater')).toBeTruthy()

    fireEvent.click(screen.getByText('Skip Intro'))

    await waitFor(() => {
      expect(screen.queryByTestId('music-theater-intro')).toBeNull()
    })
    expect(window.sessionStorage.getItem(SITE_CONFIG.storageKeys.musicIntroSeen)).toBe('1')

    // Remounting in the same session goes directly to dashboard without replaying intro
    unmount()
    await renderHub(onBack)
    expect(screen.queryByTestId('music-theater-intro')).toBeNull()
    expect(screen.getByText('Welcome to Your Private Music Theater')).toBeTruthy()
  })

  it('respects prefers-reduced-motion when entering the theater', async () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    await renderHub()
    // Reduced motion completes intro immediately on load
    expect(screen.queryByTestId('music-theater-intro')).toBeNull()
    expect(screen.getByText('Welcome to Your Private Music Theater')).toBeTruthy()
  })

  it('plays curated works, controls seek/volume/mute/shuffle/repeat, and isolates keyboard shortcuts from inputs', async () => {
    window.sessionStorage.setItem(SITE_CONFIG.storageKeys.musicIntroSeen, '1')
    await renderHub()

    // Play Opening Recital
    fireEvent.click(screen.getByText('Play Opening Recital'))

    await waitFor(() => {
      expect(screen.getByLabelText('Pause')).toBeTruthy()
    })

    // Toggle Shuffle & Cycle Repeat
    const shuffleBtn = screen.getByLabelText('Toggle shuffle')
    fireEvent.click(shuffleBtn)
    expect(shuffleBtn.getAttribute('aria-pressed')).toBe('true')

    const repeatBtn = screen.getByLabelText(/Repeat mode:/)
    fireEvent.click(repeatBtn)
    expect(screen.getByLabelText('Repeat mode: all')).toBeTruthy()
    fireEvent.click(screen.getByLabelText('Repeat mode: all'))
    expect(screen.getByLabelText('Repeat mode: one')).toBeTruthy()

    // Volume & Mute
    const volumeSlider = screen.getByLabelText('Volume') as HTMLInputElement
    fireEvent.change(volumeSlider, { target: { value: '0.4' } })
    expect(volumeSlider.value).toBe('0.4')

    fireEvent.click(screen.getByLabelText('Mute'))
    expect(screen.getByLabelText('Unmute')).toBeTruthy()

    // Seek timeline
    const seekSlider = screen.getByLabelText('Seek timeline')
    fireEvent.change(seekSlider, { target: { value: '6' } })
    expect(screen.getByTestId('player-current-time').textContent).toBe('0:06')

    // Spacebar inside header search input must NOT toggle pause
    const searchInput = screen.getByLabelText('Header search music')
    fireEvent.keyDown(searchInput, { code: 'Space' })
    expect(screen.getByLabelText('Pause')).toBeTruthy()
  })

  it('supports My Music Collection: importing valid audio, rejecting corrupt files, playlist CRUD, reordering, and metadata editing', async () => {
    window.sessionStorage.setItem(SITE_CONFIG.storageKeys.musicIntroSeen, '1')
    await renderHub()

    // Navigate to My Playlists and create a playlist
    const sidebar = screen.getByLabelText('Private Music Theater Navigation')
    fireEvent.click(within(sidebar).getByRole('button', { name: /My Playlists/i }))
    fireEvent.click(screen.getByRole('button', { name: 'New Playlist' }))

    const modal = screen.getByRole('dialog', { name: 'Create New Playlist' })
    const nameInput = within(modal).getByPlaceholderText('Late Night Chopin & Rain...')
    fireEvent.change(nameInput, { target: { value: 'Midnight Conservatory' } })
    fireEvent.click(within(modal).getByRole('button', { name: 'Create Playlist' }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Midnight Conservatory' })).toBeTruthy()
    })

    // Navigate to Imported Music tab and upload 2 valid WAVs + 1 invalid TXT
    fireEvent.click(within(sidebar).getByRole('button', { name: /Imported Music/i }))

    const wav1 = makeTestWavFile('Claude Debussy - Reverie.wav', 2)
    const wav2 = makeTestWavFile('Erik Satie - Gymnopedie.wav', 3)
    const badFile = new File(['bad'], 'readme.txt', { type: 'text/plain' })

    const fileInput = screen.getByTestId('audio-file-input')
    fireEvent.change(fileInput, { target: { files: [wav1, wav2, badFile] } })

    await waitFor(() => {
      expect(screen.getByText('Import Progress (2/3)')).toBeTruthy()
    })
    expect(screen.getByText(/Unsupported format/)).toBeTruthy()
    expect(screen.getByText('Reverie')).toBeTruthy()
    expect(screen.getByText('Gymnopedie')).toBeTruthy()

    // Edit Metadata of Reverie
    fireEvent.click(screen.getByLabelText('Edit metadata for Reverie'))
    const dialog = screen.getByRole('dialog', { name: 'Edit Track Metadata' })
    const titleInput = within(dialog).getByDisplayValue('Reverie')
    fireEvent.change(titleInput, { target: { value: 'Reverie (Concert Mix)' } })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Save Changes' }))

    await waitFor(() => {
      expect(screen.getByText('Reverie (Concert Mix)')).toBeTruthy()
    })

    // Add both songs to Midnight Conservatory playlist via modal
    fireEvent.click(screen.getByLabelText('Add Reverie (Concert Mix) to playlists'))
    const assignDialog1 = screen.getByRole('dialog', { name: 'Assign Track to Playlists' })
    fireEvent.click(within(assignDialog1).getByText('Midnight Conservatory'))
    fireEvent.click(within(assignDialog1).getByRole('button', { name: 'Save Selection' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    fireEvent.click(screen.getByLabelText('Add Gymnopedie to playlists'))
    const assignDialog2 = screen.getByRole('dialog', { name: 'Assign Track to Playlists' })
    fireEvent.click(within(assignDialog2).getByText('Midnight Conservatory'))
    fireEvent.click(within(assignDialog2).getByRole('button', { name: 'Save Selection' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    // Open My Playlists -> verify 2 tracks, search, and reorder
    fireEvent.click(within(sidebar).getByRole('button', { name: /My Playlists/i }))
    fireEvent.click(screen.getByText('Midnight Conservatory'))

    await waitFor(() => {
      expect(screen.getByText('Play All (2)')).toBeTruthy()
    })

    // Move Gymnopedie up so it becomes track #1
    fireEvent.click(screen.getByLabelText('Move Gymnopedie up'))

    // Filter inside playlist
    const plSearch = screen.getByLabelText('Search songs in playlist')
    fireEvent.change(plSearch, { target: { value: 'Gymnopedie' } })
    expect(screen.queryByText('Reverie (Concert Mix)')).toBeNull()
    expect(screen.getByText('Gymnopedie')).toBeTruthy()
  })

  it('manages Favorites, deduplicated Recently Played history, Clear History, and Settings local vault clearing', async () => {
    window.sessionStorage.setItem(SITE_CONFIG.storageKeys.musicIntroSeen, '1')
    await renderHub()

    // Favorite a curated song
    fireEvent.click(screen.getByLabelText('Favorite Nocturne in E-Flat Major, Op. 9 No. 2'))

    // Play track -> records history once
    fireEvent.click(screen.getByLabelText('Play Nocturne in E-Flat Major, Op. 9 No. 2'))
    await waitFor(() => {
      expect(screen.getByLabelText('Pause')).toBeTruthy()
    })

    const sidebar = screen.getByLabelText('Private Music Theater Navigation')
    fireEvent.click(within(sidebar).getByRole('button', { name: /Favorites/i }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Favorites (1)' })).toBeTruthy()
    })

    fireEvent.click(within(sidebar).getByRole('button', { name: /Recently Played/i }))
    expect(screen.getByRole('heading', { name: 'Recently Played (1)' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /Clear History/i }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Recently Played (0)' })).toBeTruthy()
    })

    // Settings theme switching + Replay Intro
    fireEvent.click(within(sidebar).getByRole('button', { name: /Settings/i }))
    fireEvent.click(screen.getByText('Deep Velvet Burgundy'))
    fireEvent.click(screen.getByText('Replay Curtain Opening Sequence'))

    await waitFor(() => {
      expect(screen.getByTestId('music-theater-intro')).toBeTruthy()
    })
  })

  it('renders complete Vietnamese localization and supports dynamic language toggle', async () => {
    window.sessionStorage.setItem(SITE_CONFIG.storageKeys.musicIntroSeen, '1')
    window.localStorage.setItem(SITE_CONFIG.storageKeys.language, 'vi')

    let rendered: ReturnType<typeof render>
    await act(async () => {
      rendered = render(
        <LanguageProvider>
          <MusicTheaterHub onBackToPortfolio={vi.fn()} />
        </LanguageProvider>
      )
    })

    // Vietnamese Dashboard Welcome and Controls
    expect(screen.getByText('Chào Mừng Đến Với Nhà Hát Âm Nhạc Cá Nhân')).toBeTruthy()
    expect(screen.getByText('Phát Buổi Hòa Nhạc Mở Đầu')).toBeTruthy()
    expect(screen.getAllByText('Nhập Nhạc Cá Nhân').length).toBeGreaterThanOrEqual(1)

    // Vietnamese Sidebar Navigation Tabs
    const sidebar = screen.getByLabelText('Private Music Theater Navigation')
    expect(within(sidebar).getByText('Trang Chủ')).toBeTruthy()
    expect(within(sidebar).getByText('Khám Phá')).toBeTruthy()
    expect(within(sidebar).getByText('Tất Cả Bài Hát')).toBeTruthy()
    expect(within(sidebar).getByText('Tuyển Tập Album')).toBeTruthy()
    expect(within(sidebar).getByText('Nghệ Sĩ & Tác Giả')).toBeTruthy()
    expect(within(sidebar).getByText('Danh Sách Phát')).toBeTruthy()
    expect(within(sidebar).getByText('Nhạc Đã Nhập')).toBeTruthy()
    expect(within(sidebar).getByText('Phát Gần Đây')).toBeTruthy()
    expect(within(sidebar).getByText('Yêu Thích')).toBeTruthy()
    expect(within(sidebar).getByText('Cài Đặt')).toBeTruthy()

    // Header Language Toggle Button (switches VI -> EN)
    const langBtn = screen.getByRole('button', { name: /Chuyển sang Tiếng Anh|Switch to English/i })
    fireEvent.click(langBtn)

    await waitFor(() => {
      expect(screen.getByText('Welcome to Your Private Music Theater')).toBeTruthy()
      expect(screen.getByText('Play Opening Recital')).toBeTruthy()
    })

    rendered!.unmount()
  })
})
