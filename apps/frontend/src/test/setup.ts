import '@testing-library/jest-dom'

// Mock HTMLCanvasElement.getContext to suppress jsdom warnings in WebGL / 2D canvas tests
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = (() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext
}
