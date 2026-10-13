import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { isReducedMotion } from '../animations/gsapUtils'

/**
 * 3D Cyber Ocean & Celestial Flying Whale Scene
 * Features:
 * 1. Undulating bioluminescent 3D ocean wave mesh with compound sine swell physics
 * 2. Majestic articulated Cyber Whale with flapping pectoral fins, oscillating tail fluke, and particle wake
 * 3. Cinematic trajectory soaring from the deep ocean straight into the center of the viewer's screen
 * 4. Responsive canvas, reduced motion guard, and event-based whale summoning
 */
export const OceanWhaleScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const container = containerRef.current
    if (!container) return

    if (isReducedMotion()) return

    // Scene & Perspective Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    )
    camera.position.set(0, 3, 26)
    camera.lookAt(0, 0, 0)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      container.appendChild(renderer.domElement)
    } catch {
      return
    }

    // Ambient & Directional Cyber Lights
    const ambientLight = new THREE.AmbientLight(0x0a192f, 1.8)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0x00d2ff, 3.5)
    keyLight.position.set(15, 25, 20)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.5)
    rimLight.position.set(-20, 10, -25)
    scene.add(rimLight)

    // ==========================================
    // 1. UNDULATING 3D OCEAN WAVE SYSTEM
    // ==========================================
    const waveWidth = 140
    const waveHeight = 140
    const waveSegments = 60

    const waveGeometry = new THREE.PlaneGeometry(
      waveWidth,
      waveHeight,
      waveSegments,
      waveSegments
    )
    // Tilted slightly toward camera to form infinite ocean horizon
    waveGeometry.rotateX(-Math.PI / 2.3)

    // Dual-layer material: Deep ocean surface + Glowing wireframe crests
    const oceanMaterial = new THREE.MeshStandardMaterial({
      color: 0x051329,
      roughness: 0.35,
      metalness: 0.75,
      transparent: true,
      opacity: 0.82,
      flatShading: true,
    })

    const oceanMesh = new THREE.Mesh(waveGeometry, oceanMaterial)
    oceanMesh.position.set(0, -9.5, -12)
    scene.add(oceanMesh)

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    })
    const wireframeMesh = new THREE.Mesh(waveGeometry, wireframeMaterial)
    wireframeMesh.position.copy(oceanMesh.position)
    scene.add(wireframeMesh)

    // Ocean Bioluminescent Foam / Mist Particles
    const foamCount = 100
    const foamPositions = new Float32Array(foamCount * 3)
    for (let i = 0; i < foamCount; i++) {
      foamPositions[i * 3] = (Math.random() - 0.5) * 110
      foamPositions[i * 3 + 1] = -7 + (Math.random() - 0.5) * 2.5
      foamPositions[i * 3 + 2] = (Math.random() - 0.5) * 80 - 10
    }
    const foamGeometry = new THREE.BufferGeometry()
    foamGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(foamPositions, 3)
    )

    const createGlowTexture = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 32
      canvas.height = 32
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
        gradient.addColorStop(0, 'rgba(0, 210, 255, 1)')
        gradient.addColorStop(0.3, 'rgba(56, 189, 248, 0.7)')
        gradient.addColorStop(1, 'rgba(0, 210, 255, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 32, 32)
      }
      return new THREE.CanvasTexture(canvas)
    }

    const glowTexture = createGlowTexture()
    const foamMaterial = new THREE.PointsMaterial({
      size: 1.2,
      map: glowTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const foamPoints = new THREE.Points(foamGeometry, foamMaterial)
    scene.add(foamPoints)

    // Store base vertex positions for wave calculations
    const basePositions = waveGeometry.attributes.position.array.slice()

    // ==========================================
    // 2. PROCEDURAL 3D CYBER WHALE (CÁ VOI VŨ TRỤ)
    // ==========================================
    const whaleGroup = new THREE.Group()

    // Materials
    const whaleSkinMaterial = new THREE.MeshStandardMaterial({
      color: 0x071b34,
      roughness: 0.25,
      metalness: 0.85,
      transparent: true,
      opacity: 0.92,
    })

    const neonAccentMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    })

    const ventralBellyMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x0077aa,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.9,
    })

    // Whale Torso / Main Spindle
    // Built using elongated smooth capsule/ellipsoid geometry
    const bodyGeometry = new THREE.ConeGeometry(2.4, 9.5, 16, 8)
    bodyGeometry.rotateX(Math.PI / 2)
    bodyGeometry.scale(1.15, 0.95, 1.0)
    const bodyMesh = new THREE.Mesh(bodyGeometry, whaleSkinMaterial)
    bodyMesh.position.set(0, 0, 1.2)
    whaleGroup.add(bodyMesh)

    // Wireframe overlay for cyber aesthetic
    const bodyWireMesh = new THREE.Mesh(bodyGeometry, neonAccentMaterial)
    bodyWireMesh.position.copy(bodyMesh.position)
    bodyWireMesh.scale.set(1.02, 1.02, 1.02)
    whaleGroup.add(bodyWireMesh)

    // Whale Head & Rostrum (Front Dome)
    const headGeometry = new THREE.SphereGeometry(2.2, 16, 12)
    headGeometry.scale(0.9, 0.8, 1.4)
    const headMesh = new THREE.Mesh(headGeometry, whaleSkinMaterial)
    headMesh.position.set(0, -0.15, 4.8)
    whaleGroup.add(headMesh)

    const headWireMesh = new THREE.Mesh(headGeometry, neonAccentMaterial)
    headWireMesh.position.copy(headMesh.position)
    headWireMesh.scale.set(1.02, 1.02, 1.02)
    whaleGroup.add(headWireMesh)

    // Ventral Grooves (Rãnh bụng phát sáng đặc trưng của cá voi)
    const ventralGeometry = new THREE.CylinderGeometry(1.6, 2.0, 5.5, 12, 1, true, 0, Math.PI)
    ventralGeometry.rotateX(Math.PI / 2)
    ventralGeometry.rotateZ(Math.PI)
    const ventralMesh = new THREE.Mesh(ventralGeometry, ventralBellyMaterial)
    ventralMesh.position.set(0, -0.65, 2.4)
    whaleGroup.add(ventralMesh)

    // Glowing Cyber Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.2, 8, 8)
    const eyeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
    })
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    leftEye.position.set(1.4, 0.35, 4.2)
    whaleGroup.add(leftEye)

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    rightEye.position.set(-1.4, 0.35, 4.2)
    whaleGroup.add(rightEye)

    // Dorsal Fin (Vây lưng cong)
    const dorsalFinGeometry = new THREE.ConeGeometry(0.45, 1.6, 4)
    dorsalFinGeometry.rotateX(-Math.PI / 3)
    dorsalFinGeometry.scale(0.3, 1.0, 1.4)
    const dorsalFin = new THREE.Mesh(dorsalFinGeometry, whaleSkinMaterial)
    dorsalFin.position.set(0, 1.6, -1.8)
    whaleGroup.add(dorsalFin)

    // Pectoral Flippers (Vây bơi hai bên - có khớp xoay)
    const flipperGeometry = new THREE.ConeGeometry(0.85, 4.8, 4)
    flipperGeometry.scale(0.2, 1.0, 0.8)
    flipperGeometry.rotateZ(Math.PI / 2.2)

    // Left Flipper
    const leftFlipperPivot = new THREE.Group()
    leftFlipperPivot.position.set(1.8, -0.4, 2.8)
    const leftFlipper = new THREE.Mesh(flipperGeometry, whaleSkinMaterial)
    leftFlipper.position.set(1.8, 0, -0.6)
    leftFlipperPivot.add(leftFlipper)
    whaleGroup.add(leftFlipperPivot)

    // Right Flipper
    const rightFlipperPivot = new THREE.Group()
    rightFlipperPivot.position.set(-1.8, -0.4, 2.8)
    const rightFlipper = new THREE.Mesh(flipperGeometry, whaleSkinMaterial)
    rightFlipper.rotation.y = Math.PI
    rightFlipper.position.set(-1.8, 0, -0.6)
    rightFlipperPivot.add(rightFlipper)
    whaleGroup.add(rightFlipperPivot)

    // Tail Peduncle & Fluke (Đuôi và vây đuôi cá voi chuyển động nhịp nhàng)
    const tailPedunclePivot = new THREE.Group()
    tailPedunclePivot.position.set(0, 0, -3.2)

    const tailSegmentGeometry = new THREE.CylinderGeometry(0.55, 1.4, 4.5, 8)
    tailSegmentGeometry.rotateX(Math.PI / 2)
    const tailSegment = new THREE.Mesh(tailSegmentGeometry, whaleSkinMaterial)
    tailSegment.position.set(0, 0, -2.0)
    tailPedunclePivot.add(tailSegment)

    // Tail Fluke (Cánh vây đuôi nằm ngang xòe rộng)
    const flukeGeometry = new THREE.ConeGeometry(1.2, 5.2, 4)
    flukeGeometry.scale(0.18, 1.0, 0.7)
    flukeGeometry.rotateZ(Math.PI / 2)
    flukeGeometry.rotateX(-Math.PI / 10)
    const flukeMesh = new THREE.Mesh(flukeGeometry, whaleSkinMaterial)
    flukeMesh.position.set(0, 0.1, -4.2)
    tailPedunclePivot.add(flukeMesh)

    const flukeWireMesh = new THREE.Mesh(flukeGeometry, neonAccentMaterial)
    flukeWireMesh.position.copy(flukeMesh.position)
    flukeWireMesh.scale.set(1.05, 1.05, 1.05)
    tailPedunclePivot.add(flukeWireMesh)

    whaleGroup.add(tailPedunclePivot)

    // Bioluminescent Particle Wake (Vệt hạt sáng sau đuôi và lỗ thở)
    const wakeParticleCount = 60
    const wakePositions = new Float32Array(wakeParticleCount * 3)
    for (let i = 0; i < wakeParticleCount; i++) {
      wakePositions[i * 3] = (Math.random() - 0.5) * 1.5
      wakePositions[i * 3 + 1] = (Math.random() - 0.5) * 1.5
      wakePositions[i * 3 + 2] = -5 - Math.random() * 8
    }
    const wakeGeometry = new THREE.BufferGeometry()
    wakeGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(wakePositions, 3)
    )
    const wakeMaterial = new THREE.PointsMaterial({
      size: 0.9,
      map: glowTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const wakePoints = new THREE.Points(wakeGeometry, wakeMaterial)
    whaleGroup.add(wakePoints)

    // Initial scale & position
    whaleGroup.scale.set(0.9, 0.9, 0.9)
    scene.add(whaleGroup)

    // ==========================================
    // 3. CINEMATIC FLIGHT PATH INTO CENTER SCREEN
    // ==========================================
    // Flight Path Curve: Breaches out of waves, soars directly into center of viewer's screen (0, 0.5, 7.5), then dives smoothly
    const flightPoints = [
      new THREE.Vector3(-38, -14, -60), // Deep in distant ocean
      new THREE.Vector3(-22, -6, -38),  // Surfacing through ocean waves
      new THREE.Vector3(-8, 0, -18),    // Climbing into atmosphere
      new THREE.Vector3(0, 0.6, 7.5),   // EXACT CENTER OF VIEWER'S SCREEN
      new THREE.Vector3(7, -0.2, 4.0),  // Banking glide in viewer foreground
      new THREE.Vector3(22, 3, -15),    // Sweeping right arc
      new THREE.Vector3(28, -8, -42),   // Diving back toward ocean
      new THREE.Vector3(0, -16, -65),   // Submerged deep loop back
    ]

    const flightCurve = new THREE.CatmullRomCurve3(flightPoints, true)

    // Flight progress state: 0 to 1 along curve
    let flightProgress = 0.38 // Start near center screen for immediate impact
    const normalFlightSpeed = 0.024
    let currentSpeed = normalFlightSpeed

    // Method to trigger instantaneous heroic center breach
    const triggerCenterBreach = () => {
      flightProgress = 0.28 // Breaching upward toward center
      currentSpeed = normalFlightSpeed * 1.6
      setTimeout(() => {
        currentSpeed = normalFlightSpeed
      }, 3500)
    }

    const handleSummonEvent = () => {
      triggerCenterBreach()
    }
    window.addEventListener('kietfolio:summon-whale', handleSummonEvent)

    // Window Resize Handler
    const onResize = () => {
      if (!renderer) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // Visibility Listener to preserve battery & CPU
    let isVisible = true
    const onVisibilityChange = () => {
      isVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    // ==========================================
    // 4. ANIMATION LOOP (60 FPS)
    // ==========================================
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (!isVisible) return

      const delta = clock.getDelta()
      const time = clock.getElapsedTime()

      // 4A. Undulate 3D Ocean Waves with compound sine equations
      const wavePos = waveGeometry.attributes.position
      const count = wavePos.count

      for (let i = 0; i < count; i++) {
        const u = basePositions[i * 3]
        const v = basePositions[i * 3 + 1]

        // Natural turbulent ocean swell equation
        const elevation =
          Math.sin(u * 0.08 + time * 1.6) * 1.7 +
          Math.cos(v * 0.09 + time * 1.3) * 1.5 +
          Math.sin((u + v) * 0.06 + time * 2.1) * 0.75

        wavePos.setZ(i, elevation)
      }
      wavePos.needsUpdate = true

      // Gently rotate ocean wireframe grid for parallax ocean movement
      wireframeMesh.rotation.z = Math.sin(time * 0.2) * 0.03

      // 4B. Advance Whale along flight path
      flightProgress = (flightProgress + currentSpeed * delta) % 1.0

      const positionOnCurve = flightCurve.getPointAt(flightProgress)
      const lookAtTarget = flightCurve.getPointAt((flightProgress + 0.03) % 1.0)

      whaleGroup.position.copy(positionOnCurve)

      // Smooth orientation banking along the trajectory
      const lookMatrix = new THREE.Matrix4().lookAt(
        whaleGroup.position,
        lookAtTarget,
        new THREE.Vector3(0, 1, 0)
      )
      const targetQuat = new THREE.Quaternion().setFromRotationMatrix(lookMatrix)
      whaleGroup.quaternion.slerp(targetQuat, 0.08)

      // 4C. Organic Whale Swimming Articulation
      const swimCycle = time * 3.8

      // Tail peduncle vertical oscillation (flapping up & down like real cetaceans)
      tailPedunclePivot.rotation.x = Math.sin(swimCycle) * 0.32
      tailPedunclePivot.rotation.y = Math.cos(swimCycle * 0.5) * 0.08

      // Pectoral flippers gentle wave
      leftFlipperPivot.rotation.z = Math.sin(swimCycle - 0.5) * 0.18
      rightFlipperPivot.rotation.z = -Math.sin(swimCycle - 0.5) * 0.18
      leftFlipperPivot.rotation.x = Math.cos(swimCycle) * 0.12
      rightFlipperPivot.rotation.x = Math.cos(swimCycle) * 0.12

      // Gentle body roll
      bodyMesh.rotation.z = Math.sin(swimCycle * 0.5) * 0.05

      // 4D. Animated Particle Wake
      const wakePosAttr = wakeGeometry.attributes.position
      for (let j = 0; j < wakeParticleCount; j++) {
        let pz = wakePosAttr.getZ(j)
        pz -= 0.15
        if (pz < -14) {
          pz = -4
        }
        wakePosAttr.setZ(j, pz)
      }
      wakePosAttr.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup resources on unmount
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('kietfolio:summon-whale', handleSummonEvent)

      waveGeometry.dispose()
      oceanMaterial.dispose()
      wireframeMaterial.dispose()
      foamGeometry.dispose()
      foamMaterial.dispose()
      glowTexture.dispose()

      bodyGeometry.dispose()
      whaleSkinMaterial.dispose()
      neonAccentMaterial.dispose()
      ventralBellyMaterial.dispose()
      ventralGeometry.dispose()
      headGeometry.dispose()
      eyeGeometry.dispose()
      eyeMaterial.dispose()
      dorsalFinGeometry.dispose()
      flipperGeometry.dispose()
      tailSegmentGeometry.dispose()
      flukeGeometry.dispose()
      wakeGeometry.dispose()
      wakeMaterial.dispose()

      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    />
  )
}
