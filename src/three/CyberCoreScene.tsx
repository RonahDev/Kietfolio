import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { isReducedMotion } from '../animations/gsapUtils'

interface CyberCoreSceneProps {
  className?: string
  interactive?: boolean
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

export const CyberCoreScene: React.FC<CyberCoreSceneProps> = ({
  className = '',
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasWebGlError] = useState(() => !checkWebGlSupport())
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (hasWebGlError) return
    const container = containerRef.current
    if (!container) return

    const reducedMotion = isReducedMotion()

    // 1. Scene, Camera & Lighting
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 22

    // 2. High-Performance Renderer
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
      container.appendChild(renderer.domElement)
    } catch {
      return
    }

    // 3. System Hierarchy
    const systemGroup = new THREE.Group()
    scene.add(systemGroup)

    // A. Outer Holographic Icosahedron Core
    const outerGeo = new THREE.IcosahedronGeometry(4.5, 1)
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    })
    const outerMesh = new THREE.Mesh(outerGeo, outerMat)
    systemGroup.add(outerMesh)

    // B. Inner Quantum Core (Dodecahedron)
    const innerGeo = new THREE.DodecahedronGeometry(2.5, 0)
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    })
    const innerMesh = new THREE.Mesh(innerGeo, innerMat)
    systemGroup.add(innerMesh)

    // C. Glowing Center Nucleus Point
    const nucleusGeo = new THREE.SphereGeometry(0.55, 16, 16)
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    })
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat)
    systemGroup.add(nucleusMesh)

    // D. Orbiting Gyroscope Hologram Rings
    const ring1Geo = new THREE.TorusGeometry(6.8, 0.035, 16, 100)
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      transparent: true,
      opacity: 0.4,
    })
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat)
    ring1Mesh.rotation.x = Math.PI / 3
    systemGroup.add(ring1Mesh)

    const ring2Geo = new THREE.TorusGeometry(8.2, 0.025, 16, 100)
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.35,
    })
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat)
    ring2Mesh.rotation.y = Math.PI / 4
    systemGroup.add(ring2Mesh)

    // E. Constellation Satellite Nodes & Lines
    const nodeCount = 38
    const nodePositions: THREE.Vector3[] = []
    const nodeGeo = new THREE.SphereGeometry(0.12, 8, 8)
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00d2ff })
    const nodesGroup = new THREE.Group()

    for (let i = 0; i < nodeCount; i++) {
      const radius = 6.2 + (Math.random() - 0.5) * 2.8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      const pos = new THREE.Vector3(x, y, z)
      nodePositions.push(pos)

      const nMesh = new THREE.Mesh(nodeGeo, nodeMat)
      nMesh.position.copy(pos)
      nodesGroup.add(nMesh)
    }
    systemGroup.add(nodesGroup)

    // Constellation connecting lines
    const lineCoords: number[] = []
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 3.6) {
          lineCoords.push(
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

    const linesGeo = new THREE.BufferGeometry()
    linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineCoords, 3))
    const linesMat = new THREE.LineBasicMaterial({
      color: 0x172847,
      transparent: true,
      opacity: 0.7,
    })
    const linesMesh = new THREE.LineSegments(linesGeo, linesMat)
    systemGroup.add(linesMesh)

    // 4. Mouse Tracking & Interactivity
    let targetRotationX = 0
    let targetRotationY = 0
    let impulse = 0
    let isIntersecting = true
    let isDocumentVisible = !document.hidden

    const onPointerMove = (e: MouseEvent) => {
      if (!interactive) return
      const rect = container.getBoundingClientRect()
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetRotationY = mouseX * 0.65
      targetRotationX = -mouseY * 0.45
      impulse = 0.008
    }

    const onPointerEnter = () => setIsHovered(true)
    const onPointerLeave = () => {
      setIsHovered(false)
      targetRotationX = 0
      targetRotationY = 0
    }

    window.addEventListener('mousemove', onPointerMove, { passive: true })
    container.addEventListener('mouseenter', onPointerEnter)
    container.addEventListener('mouseleave', onPointerLeave)

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

    // IntersectionObserver to auto-pause when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting
      },
      { threshold: 0.05 }
    )
    observer.observe(container)

    // VisibilityChange to pause when tab is inactive
    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 5. Optimized Animation Loop
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)

      // Only calculate & render when in viewport and active
      if (!isIntersecting || !isDocumentVisible) return

      if (!reducedMotion) {
        const time = clock.getElapsedTime()
        impulse *= 0.95

        const speed = 0.0035 + impulse
        systemGroup.rotation.y += speed
        systemGroup.rotation.x += speed * 0.35

        innerMesh.rotation.y -= speed * 1.5
        innerMesh.rotation.z += speed * 0.8

        ring1Mesh.rotation.z += 0.005
        ring2Mesh.rotation.x += 0.004

        // Breathing pulse effect
        const pulse = 1 + Math.sin(time * 2) * 0.03
        outerMesh.scale.set(pulse, pulse, pulse)

        const innerPulse = 1 + Math.cos(time * 2.5) * 0.04
        innerMesh.scale.set(innerPulse, innerPulse, innerPulse)

        // Interpolate toward mouse rotation
        systemGroup.rotation.x += (targetRotationX - systemGroup.rotation.x) * 0.06
        systemGroup.rotation.y += (targetRotationY - systemGroup.rotation.y) * 0.06
      }

      renderer.render(scene, camera)
    }

    animate()

    // 6. Complete Resource Cleanup
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onPointerMove)
      container.removeEventListener('mouseenter', onPointerEnter)
      container.removeEventListener('mouseleave', onPointerLeave)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      observer.disconnect()

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }

      outerGeo.dispose()
      outerMat.dispose()
      innerGeo.dispose()
      innerMat.dispose()
      nucleusGeo.dispose()
      nucleusMat.dispose()
      ring1Geo.dispose()
      ring1Mat.dispose()
      ring2Geo.dispose()
      ring2Mat.dispose()
      nodeGeo.dispose()
      nodeMat.dispose()
      linesGeo.dispose()
      linesMat.dispose()
      renderer.dispose()
    }
  }, [hasWebGlError, interactive])

  if (hasWebGlError) {
    return (
      <div
        className={`flex items-center justify-center border border-[#172847] bg-[#0a1224]/80 p-8 rounded-lg text-center ${className}`}
        role="region"
        aria-label="3D Cyber Core Fallback"
      >
        <div className="space-y-3">
          <div className="inline-flex p-3 rounded-full bg-[#172847]/60 text-[#00d2ff]">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20M2 12a14.5 14.5 0 0 0 20 0" />
            </svg>
          </div>
          <p className="font-mono text-xs text-[#00d2ff] tracking-wider uppercase">
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
    <div className={`relative w-full h-full min-h-[380px] md:min-h-[480px] overflow-hidden ${className}`}>
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full" aria-hidden="true" />

      {/* Cyberpunk HUD Frame Accents */}
      <div className="absolute top-3 left-3 pointer-events-none font-mono text-[10px] text-[#00d2ff]/80 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-ping" />
        <span>CYBER_CORE // LIVE_SIM</span>
      </div>

      <div className="absolute bottom-3 right-3 pointer-events-none font-mono text-[9px] text-[#64748b] tracking-wider">
        {isHovered ? 'STATUS: FLUID_INTERACTION' : 'STATUS: PASSIVE_ORBIT'}
      </div>

      {/* Corner crosshair accents */}
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#00d2ff]/40 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#00d2ff]/40 pointer-events-none" />
    </div>
  )
}
