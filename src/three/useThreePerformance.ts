import { useEffect, useRef, useState } from 'react'

function checkWebGlSupport(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

/**
 * Hook to optimize Three.js canvas performance:
 * - Detects WebGL capability
 * - Pauses rendering when canvas is outside the viewport (IntersectionObserver)
 * - Pauses rendering when browser tab is inactive (document.hidden)
 * - Returns whether rendering is currently active
 */
export function useThreePerformance(containerRef: React.RefObject<HTMLElement | null>) {
  const [isInViewport, setIsInViewport] = useState(true)
  const [isTabVisible, setIsTabVisible] = useState(true)
  const [hasWebGl] = useState(() => checkWebGlSupport())
  const observerRef = useRef<IntersectionObserver | null>(null)

  // 1. Tab visibility tracking to pause GPU loops when tab is hidden
  useEffect(() => {
    if (typeof document === 'undefined') return

    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // 2. Viewport tracking to pause rendering when scrolled away
  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting)
      },
      { threshold: 0.05 }
    )

    observerRef.current.observe(el)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [containerRef])

  return {
    shouldRender: isInViewport && isTabVisible && hasWebGl,
    hasWebGl,
  }
}
