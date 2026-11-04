import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Automatically unmount and cleanup DOM after each test to prevent document.body pollution
afterEach(() => {
  cleanup()
})

// Mock window.scrollTo in JSDOM
if (typeof window !== 'undefined') {
  window.scrollTo = vi.fn()
}

// Mock HTMLCanvasElement.getContext to suppress jsdom warnings in WebGL / 2D canvas tests
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = (() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext
}
