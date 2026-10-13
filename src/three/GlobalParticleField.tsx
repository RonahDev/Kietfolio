import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { isReducedMotion } from '../animations/gsapUtils'

export const GlobalParticleField: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const container = containerRef.current
    if (!container) return

    const reducedMotion = isReducedMotion()
    if (reducedMotion) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 30

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'low-power',
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      container.appendChild(renderer.domElement)
    } catch {
      return
    }

    // 100 Ambient Floating Cyber Dust Particles
    const particleCount = 100
    const positions = new Float32Array(particleCount * 3)
    const speeds = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 55
      positions[i * 3 + 1] = (Math.random() - 0.5) * 55
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40
      speeds[i] = 0.02 + Math.random() * 0.04
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // Canvas particle texture to avoid external assets
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 16
      canvas.height = 16
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
        gradient.addColorStop(0, 'rgba(0, 210, 255, 1)')
        gradient.addColorStop(0.5, 'rgba(0, 210, 255, 0.4)')
        gradient.addColorStop(1, 'rgba(0, 210, 255, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 16, 16)
      }
      return new THREE.CanvasTexture(canvas)
    }

    const particleTexture = createCircleTexture()
    const material = new THREE.PointsMaterial({
      color: 0x00d2ff,
      size: 0.65,
      map: particleTexture,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Gentle mouse parallax
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // Resize handler
    const onResize = () => {
      if (!renderer) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', onResize)

    // Visibility change handler to save power
    let isVisible = true
    const onVisibilityChange = () => {
      isVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    // Animation loop
    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (!isVisible) return

      targetX += (mouseX - targetX) * 0.03
      targetY += (mouseY - targetY) * 0.03

      particles.rotation.y = targetX * 0.15
      particles.rotation.x = -targetY * 0.15

      // Drift upward slowly
      const posArray = geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += speeds[i] * 0.15
        if (posArray[i * 3 + 1] > 28) {
          posArray[i * 3 + 1] = -28
        }
      }
      geometry.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibilityChange)

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }

      geometry.dispose()
      material.dispose()
      particleTexture.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 transition-opacity duration-700"
      aria-hidden="true"
    />
  )
}
