import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PlatformNavDock } from '@/components/layout/PlatformNavDock'
import { EntertainmentHubSection } from '@/features/entertainment/components/EntertainmentHubSection'
import { Navbar } from '@/components/layout/Navbar'
import { LanguageProvider } from '@/context'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { WhaleCinematicProvider } from '@/features/ocean-whale'
import { projectsData } from '@/features/projects/data/projects'
import { ProjectCard } from '@/features/projects/components/ProjectCard'

describe('Portfolio Platform Navigation System Suite', () => {
  beforeEach(() => {
    window.location.hash = ''
    vi.clearAllMocks()
  })

  it('renders PlatformNavDock with active Portfolio and buttons for Cinema 3D and Music Theater', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent')

    render(
      <LanguageProvider>
        <PlatformNavDock />
      </LanguageProvider>
    )

    expect(screen.getByText('Portfolio')).toBeTruthy()
    expect(screen.getByText(/Cinema 3D|Rạp Phim/i)).toBeTruthy()
    expect(screen.getByText(/Music Theater|Nghe Nhạc/i)).toBeTruthy()

    // Click Cinema button
    const cinemaBtn = screen.getByRole('button', { name: /Cinema 3D|Rạp Phim/i })
    fireEvent.click(cinemaBtn)

    expect(window.location.hash).toBe('#cinema')
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'kietfolio:navigate-view',
        detail: { view: 'cinema' },
      })
    )

    // Click Music button
    const musicBtn = screen.getByRole('button', { name: /Music Theater|Nhà Hát Nhạc|Nghe Nhạc/i })
    fireEvent.click(musicBtn)

    expect(window.location.hash).toBe('#music')
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'kietfolio:navigate-view',
        detail: { view: 'music' },
      })
    )
  })

  it('renders EntertainmentHubSection with CinemaStream 4K and Private Music Theater cards', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent')

    render(
      <LanguageProvider>
        <EntertainmentHubSection />
      </LanguageProvider>
    )

    // Card titles and headings
    expect(screen.getByRole('heading', { name: /CinemaStream 4K/i })).toBeTruthy()
    expect(screen.getByRole('heading', { name: /Classical Theater/i })).toBeTruthy()

    // Click Enter 3D Theater button
    const enterCinemaBtn = screen.getByRole('button', { name: /ENTER 3D THEATER|VÀO RẠP CHIẾU 4K/i })
    fireEvent.click(enterCinemaBtn)

    expect(window.location.hash).toBe('#cinema')
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'kietfolio:navigate-view',
        detail: { view: 'cinema' },
      })
    )

    // Click Enter Music Theater button
    const enterMusicBtn = screen.getByRole('button', { name: /ENTER MUSIC THEATER|VÀO NHÀ HÁT NHẠC/i })
    fireEvent.click(enterMusicBtn)

    expect(window.location.hash).toBe('#music')
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'kietfolio:navigate-view',
        detail: { view: 'music' },
      })
    )
  })

  it('renders Navbar with direct buttons for Cinema 3D and Music Theater', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent')

    render(
      <LanguageProvider>
        <AuthProvider>
          <WhaleCinematicProvider>
            <Navbar />
          </WhaleCinematicProvider>
        </AuthProvider>
      </LanguageProvider>
    )

    // Central nav pill & header action buttons
    const cinemaBtns = screen.getAllByRole('button', { name: /Cinema 3D|Rạp Phim 3D/i })
    expect(cinemaBtns.length).toBeGreaterThan(0)
    fireEvent.click(cinemaBtns[0])

    expect(window.location.hash).toBe('#cinema')
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'kietfolio:navigate-view',
        detail: { view: 'cinema' },
      })
    )

    const musicBtns = screen.getAllByRole('button', { name: /Music|Nhà Hát Nhạc|Nghe Nhạc/i })
    expect(musicBtns.length).toBeGreaterThan(0)
    fireEvent.click(musicBtns[0])

    expect(window.location.hash).toBe('#music')
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'kietfolio:navigate-view',
        detail: { view: 'music' },
      })
    )
  })

  it('includes Private Music Theater in projects catalog and supports live demo navigation', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent')
    const musicProject = projectsData.find((p) => p.id === 'private-music-theater')
    expect(musicProject).toBeDefined()
    expect(musicProject?.liveUrl).toBe('#music')

    if (!musicProject) return

    render(
      <LanguageProvider>
        <AuthProvider>
          <ProjectCard project={musicProject} />
        </AuthProvider>
      </LanguageProvider>
    )

    const liveDemoLink = screen.getByRole('link', { name: /Interactive Preview|Xem Trực Tiếp/i })
    fireEvent.click(liveDemoLink)

    expect(window.location.hash).toBe('#music')
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'kietfolio:navigate-view',
        detail: { view: 'music' },
      })
    )
  })
})
