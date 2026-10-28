import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { ScrollToTop } from './ScrollToTop'
import { LanguageProvider } from '@/context'

describe('ScrollToTop Component', () => {
  beforeEach(() => {
    window.scrollY = 0
  })

  it('is hidden when scroll position is near top', () => {
    const { container } = render(
      <LanguageProvider>
        <ScrollToTop />
      </LanguageProvider>
    )

    expect(container.querySelector('button')).toBeNull()
  })

  it('appears when window is scrolled beyond 400px threshold', async () => {
    render(
      <LanguageProvider>
        <ScrollToTop />
      </LanguageProvider>
    )

    window.scrollY = 500
    act(() => {
      fireEvent.scroll(window)
    })

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /cuộn lên|scroll to top/i })
      expect(button).toBeDefined()
      expect(button).not.toBeNull()
    })
  })

  it('triggers window.scrollTo when clicked', async () => {
    const scrollToMock = vi.fn()
    window.scrollTo = scrollToMock

    render(
      <LanguageProvider>
        <ScrollToTop />
      </LanguageProvider>
    )

    window.scrollY = 600
    act(() => {
      fireEvent.scroll(window)
    })

    let button: HTMLElement | null = null
    await waitFor(() => {
      button = screen.getByRole('button', { name: /cuộn lên|scroll to top/i })
      expect(button).toBeDefined()
    })

    if (button) {
      fireEvent.click(button)
      expect(scrollToMock).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      })
    }
  })
})
