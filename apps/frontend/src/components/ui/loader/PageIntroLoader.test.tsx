import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PageIntroLoader } from './PageIntroLoader'
import { LanguageProvider } from '@/context'

describe('PageIntroLoader Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('renders loading HUD and branding elements for users', () => {
    const handleComplete = vi.fn()

    render(
      <LanguageProvider>
        <PageIntroLoader onComplete={handleComplete} />
      </LanguageProvider>
    )

    expect(screen.getByText(/Mai Anh Kiệt/i)).toBeTruthy()
    expect(screen.getByText(/^0%$/)).toBeTruthy()
  })

  it('triggers onComplete when skip intro button is clicked', () => {
    const handleComplete = vi.fn()

    render(
      <LanguageProvider>
        <PageIntroLoader onComplete={handleComplete} />
      </LanguageProvider>
    )

    const skipBtn = screen.getByRole('button', { name: /bỏ qua|skip intro/i })
    fireEvent.click(skipBtn)

    expect(handleComplete).toHaveBeenCalledTimes(1)
  })

  it('triggers onComplete when Escape key is pressed', () => {
    const handleComplete = vi.fn()

    render(
      <LanguageProvider>
        <PageIntroLoader onComplete={handleComplete} />
      </LanguageProvider>
    )

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(handleComplete).toHaveBeenCalledTimes(1)
  })
})
