import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { isReducedMotion } from '../animations/gsapUtils'

interface KineticNetworkSceneProps {
  className?: string
}

function checkWebGlSupport(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const testCanvas = document.createElement('canvas')
    return !!(testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

export const KineticNetworkScene: React.FC<KineticNetworkSceneProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasWebGlError] = useState(() => !checkWebGlSupport())

  useEffect(() => {
    if (hasWebGlError) return
    const container = containerRef.current
    if (!container) return

    const reducedMotion = isReducedMotion()

    // Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 24

    // Optimized WebGL Renderer
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setSize(container.clientWidth, container.clientHeight)
      // Cap pixel ratio at 1.75 for buttery smooth rendering and zero lag
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
      container.appendChild(renderer.domElement)
    } catch {
      return
    }

    // Geometry Group
    const systemGroup = new THREE.Group()
    scene.add(systemGroup)

    // 1. Central Icosahedron Wireframe Core (Electric Lightning Core)
    const coreGeometry = new THREE.IcosahedronGeometry(4.8, 1)
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d2ff, // Electric lightning cyan-blue
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    })
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial)
    systemGroup.add(coreMesh)

    // 2. Inner Nested Dodecahedron (Deep Storm Ocean Unit)
    const innerGeometry = new THREE.DodecahedronGeometry(2.6, 0)
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x0284c7, // Deep storm sapphire
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    })
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial)
    systemGroup.add(innerMesh)

    // 3. Network Satellite Nodes (Electric Nodes)
    const nodeCount = 34
    const nodeGeometry = new THREE.SphereGeometry(0.13, 8, 8)
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    const nodesGroup = new THREE.Group()

    const nodePositions: THREE.Vector3[] = []
    for (let i = 0; i < nodeCount; i++) {
      const radius = 6.8 + (Math.random() - 0.5) * 2.8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      const nodePos = new THREE.Vector3(x, y, z)
      nodePositions.push(nodePos)

      const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial)
      nodeMesh.position.copy(nodePos)
      nodesGroup.add(nodeMesh)
    }
    systemGroup.add(nodesGroup)

    // 4. Connecting Constellation Lines (Data Transit Grid)
    const linePositions: number[] = []
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j])
        if (dist < 3.8) {
          linePositions.push(
            nodePositions[i].x,
            nodePositions[i].y,
            nodePositions[i].z,
            nodePositions[j].x,
            nodePositions[j].y,
            nodePositions[j].z
          )
        }
      }
    }

    const linesGeometry = new THREE.BufferGeometry()
    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0x1e3a66, // Storm oceanic grid lines
      transparent: true,
      opacity: 0.65,
    })
    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial)
    systemGroup.add(linesMesh)

    // 5. Orbiting Gyroscope Ring (Electric Transit Ring)
    const ringGeometry = new THREE.TorusGeometry(8.2, 0.035, 16, 90)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      transparent: true,
      opacity: 0.35,
    })
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial)
    ringMesh.rotation.x = Math.PI / 3
    systemGroup.add(ringMesh)

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Animation Loop with delta time
    let animationFrameId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      if (!reducedMotion) {
        const elapsedTime = clock.getElapsedTime()

        // Continuous kinetic rotation
        systemGroup.rotation.y += 0.0035
        systemGroup.rotation.x += 0.0015
        innerMesh.rotation.y -= 0.005
        ringMesh.rotation.z += 0.004

        // Subtle electric breathing effect & glow
        const scaleWave = 1 + Math.sin(elapsedTime * 1.8) * 0.02
        coreMesh.scale.set(scaleWave, scaleWave, scaleWave)
      }

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup & Resource Disposal
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }

      coreGeometry.dispose()
      coreMaterial.dispose()
      innerGeometry.dispose()
      innerMaterial.dispose()
      nodeGeometry.dispose()
      nodeMaterial.dispose()
      linesGeometry.dispose()
      linesMaterial.dispose()
      ringGeometry.dispose()
      ringMaterial.dispose()
      renderer.dispose()
    }
  }, [hasWebGlError])

  if (hasWebGlError) {
    return (
      <div
        className={`flex items-center justify-center border border-[#172847] bg-[#0a1224]/80 p-8 rounded-lg text-center ${className}`}
        role="region"
        aria-label="3D System Schematic Fallback"
      >
        <div className="space-y-3">
          <div className="inline-flex p-3 rounded-full bg-[#172847]/60 text-[#00d2ff]">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20M2 12a14.5 14.5 0 0 0 20 0" />
            </svg>
          </div>
          <p className="font-mono text-xs text-[#94a3b8] tracking-wider uppercase">
            [SYS_MODE: 2D_SCHEMATIC_ACTIVE]
          </p>
          <p className="text-xs text-[#64748b]">
            Hardware acceleration fallback engaged. System structure maintained.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[360px] md:min-h-[460px] overflow-hidden ${className}`}
      aria-hidden="true"
    />
  )
}
