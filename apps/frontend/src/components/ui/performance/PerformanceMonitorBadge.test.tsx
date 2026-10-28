import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PerformanceMonitorBadge } from './PerformanceMonitorBadge'
import { PerformanceProvider, LanguageProvider } from '@/context'

describe('PerformanceMonitorBadge Component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const renderBadge = () =>
    render(
      <LanguageProvider>
        <PerformanceProvider>
          <PerformanceMonitorBadge />
        </PerformanceProvider>
      </LanguageProvider>
    )

  it('renders the floating FPS badge trigger', () => {
    renderBadge()

    const triggerBtn = screen.getByRole('button', { name: /fps/i })
    expect(triggerBtn).toBeDefined()
    expect(triggerBtn.textContent).toContain('FPS')
  })

  it('opens telemetry pop-up on click and displays hardware stats', () => {
    renderBadge()

    const triggerBtn = screen.getByRole('button', { name: /fps/i })
    fireEvent.click(triggerBtn)

    expect(screen.getByText(/điều hòa hiệu năng|performance engine/i)).toBeDefined()
    expect(screen.getByText(/cpu/i)).toBeDefined()
    expect(screen.getByText(/tự động|auto/i)).toBeDefined()
  })

  it('allows switching quality mode to Eco Mode (low power)', () => {
    renderBadge()

    const triggerBtn = screen.getByRole('button', { name: /fps/i })
    fireEvent.click(triggerBtn)

    const ecoButton = screen.getByText(/tiết kiệm pin|power saver/i)
    fireEvent.click(ecoButton)

    expect(localStorage.getItem('kietfolio_perf_quality_mode')).toBe('low')
  })
})
