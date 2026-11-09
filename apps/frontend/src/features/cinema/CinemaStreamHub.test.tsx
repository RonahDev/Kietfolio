import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CinemaStreamHub } from './CinemaStreamHub'
import { LanguageProvider, AuthProvider, WhaleCinematicProvider, PerformanceProvider } from '@/context'
import React from 'react'

// Mock Three.js scene to avoid WebGL context errors in JSDOM headless environment
vi.mock('./scenes/CurtainScene', () => ({
  CurtainScene: () => <div data-testid="mock-curtain-scene" />,
}))

describe('CinemaStreamHub Component Suite', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.setItem('kietfolio_cinema_curtain_seen', 'true') // skip intro by default in tests
    vi.clearAllMocks()
  })

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <LanguageProvider>
        <AuthProvider>
          <WhaleCinematicProvider>
            <PerformanceProvider>{ui}</PerformanceProvider>
          </WhaleCinematicProvider>
        </AuthProvider>
      </LanguageProvider>
    )
  }

  it('renders CinemaStreamHub with brand logo and navigation bar', () => {
    const onBack = vi.fn()
    renderWithProviders(<CinemaStreamHub onBackToPortfolio={onBack} />)

    expect(screen.getAllByText(/CINEMA/i)[0]).toBeDefined()
    expect(screen.getAllByText(/STREAM/i)[0]).toBeDefined()
    expect(screen.getAllByText(/Portfolio/i)[0]).toBeDefined()
  })

  it('invokes onBackToPortfolio callback when clicking back button', () => {
    const onBack = vi.fn()
    renderWithProviders(<CinemaStreamHub onBackToPortfolio={onBack} />)

    const backBtn = screen.getByTitle('Quay lại Portfolio chính của Mai Anh Kiệt')
    fireEvent.click(backBtn)
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('displays movie category rows such as Trending and Top Rated', () => {
    const onBack = vi.fn()
    renderWithProviders(<CinemaStreamHub onBackToPortfolio={onBack} />)

    expect(screen.getByText(/Thịnh Hành & Đang Sốt/i)).toBeDefined()
    expect(screen.getByText(/Tuyệt Tác Điện Ảnh & Giải Thưởng/i)).toBeDefined()
    expect(screen.getByText(/Vũ Trụ Cyberpunk/i)).toBeDefined()
    expect(screen.getByText(/Kỹ Thuật Hệ Thống & Logistics/i)).toBeDefined()
  })

  it('filters movies when typing into the search input', () => {
    const onBack = vi.fn()
    renderWithProviders(<CinemaStreamHub onBackToPortfolio={onBack} />)

    // Click search icon
    const searchBtn = screen.getByTitle('Tìm kiếm phim')
    fireEvent.click(searchBtn)

    const searchInput = screen.getByPlaceholderText(/Tìm phim, đạo diễn/i)
    fireEvent.change(searchInput, { target: { value: 'Oppenheimer' } })

    expect(screen.getByText(/Kết quả tìm kiếm cho: "Oppenheimer"/i)).toBeDefined()
    expect(screen.getAllByText(/The Quantum Horizon/i)[0]).toBeDefined()
  })

  it('switches to Watchlist view tab properly', () => {
    const onBack = vi.fn()
    renderWithProviders(<CinemaStreamHub onBackToPortfolio={onBack} />)

    const watchlistTab = screen.getByText(/Danh Sách Của Tôi/i)
    fireEvent.click(watchlistTab)

    expect(screen.getByText(/Danh Sách Phim Yêu Thích Của Tôi/i)).toBeDefined()
  })

  it('switches to Theatrical view tab properly', () => {
    const onBack = vi.fn()
    renderWithProviders(<CinemaStreamHub onBackToPortfolio={onBack} />)

    const theatricalTabs = screen.getAllByText(/Chiếu Rạp/i)
    fireEvent.click(theatricalTabs[0])

    expect(screen.getByText(/Tác Phẩm Điện Ảnh Chiếu Rạp Mới Nhất/i)).toBeDefined()
  })
})
