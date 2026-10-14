import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { WhaleCinematicProvider } from './WhaleCinematicContext'
import { useWhaleCinematic } from '../hooks/useWhaleCinematic'

const TestConsumer: React.FC = () => {
  const { isCinematicActive, triggerWhaleCinematic, skipWhaleCinematic } = useWhaleCinematic()
  return (
    <div>
      <span data-testid="cinematic-status">{isCinematicActive ? 'ACTIVE' : 'IDLE'}</span>
      <button onClick={triggerWhaleCinematic} data-testid="trigger-btn">
        Trigger
      </button>
      <button onClick={skipWhaleCinematic} data-testid="skip-btn">
        Skip
      </button>
    </div>
  )
}

describe('WhaleCinematicContext', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('provides default IDLE state and activates on trigger', () => {
    render(
      <WhaleCinematicProvider>
        <TestConsumer />
      </WhaleCinematicProvider>
    )

    expect(screen.getByTestId('cinematic-status').textContent).toBe('IDLE')

    act(() => {
      fireEvent.click(screen.getByTestId('trigger-btn'))
    })

    expect(screen.getByTestId('cinematic-status').textContent).toBe('ACTIVE')

    // Fast forward timer by 4500ms
    act(() => {
      vi.advanceTimersByTime(4500)
    })

    expect(screen.getByTestId('cinematic-status').textContent).toBe('IDLE')
  })

  it('allows premature skipping of cinematic animation', () => {
    render(
      <WhaleCinematicProvider>
        <TestConsumer />
      </WhaleCinematicProvider>
    )

    act(() => {
      fireEvent.click(screen.getByTestId('trigger-btn'))
    })
    expect(screen.getByTestId('cinematic-status').textContent).toBe('ACTIVE')

    // Premature skip button click
    act(() => {
      fireEvent.click(screen.getByTestId('skip-btn'))
    })
    expect(screen.getByTestId('cinematic-status').textContent).toBe('IDLE')
  })

  it('responds to global summon-whale window event and ESC key', () => {
    render(
      <WhaleCinematicProvider>
        <TestConsumer />
      </WhaleCinematicProvider>
    )

    // Dispatch global summon event
    act(() => {
      window.dispatchEvent(new CustomEvent('kietfolio:summon-whale'))
    })
    expect(screen.getByTestId('cinematic-status').textContent).toBe('ACTIVE')

    // Press Escape key
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    })
    expect(screen.getByTestId('cinematic-status').textContent).toBe('IDLE')
  })
})

