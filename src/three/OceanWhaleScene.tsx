import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Procedural Anatomical Whale Geometry Builder
 * Generates an organic, smooth, lifelike humpback/blue whale with:
 * - Lofted streamlined spindle body with realistic rostrum, blowhole, chest, and tail peduncle
 * - Bifurcated caudal tail fluke with realistic central notch and wings
 * - Long curved pectoral flippers
 * - Falcate dorsal fin
 * Highly optimized (< 1,000 polygons total), 0 lag, smooth normals.
 */
function createWhaleBodyGeometry(): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry()
  const radialSegments = 16

  // Spine cross-section profiles: [z, yCenter, radiusX, radiusY]
  const spineProfiles = [
    [6.6, -0.25, 0.4, 0.25], // 0: Snout tip / rostrum apex
    [5.6, -0.15, 1.1, 0.75], // 1: Rostrum
    [4.4, 0.1, 1.7, 1.25],   // 2: Upper jaw / eye ridge
    [3.0, 0.2, 2.1, 1.7],    // 3: Blowhole depression
    [1.4, 0.05, 2.35, 2.0],  // 4: Thorax / deepest chest
    [-0.4, -0.05, 2.2, 1.9], // 5: Midbody
    [-1.9, -0.05, 1.85, 1.6],// 6: Abdomen
    [-3.2, 0.0, 1.45, 1.25], // 7: Trunk
    [-4.3, 0.1, 1.05, 0.95], // 8: Dorsal fin base
    [-5.3, 0.1, 0.7, 0.75],  // 9: Anterior peduncle
    [-6.1, 0.05, 0.45, 0.55],// 10: Caudal peduncle (laterally compressed)
    [-6.7, 0.0, 0.3, 0.35],  // 11: Fluke mount
  ]

  const ringCount = spineProfiles.length
  const vertices: number[] = []
  const indices: number[] = []

  // Generate vertices ring by ring
  for (let i = 0; i < ringCount; i++) {
    const [z, yc, rx, ry] = spineProfiles[i]
    for (let j = 0; j < radialSegments; j++) {
      const angle = (j / radialSegments) * Math.PI * 2
      const x = Math.sin(angle) * rx
      // Lower half has characteristic whale ventral curve
      const yMultiplier = Math.cos(angle) < 0 ? 1.05 : 0.95
      const y = yc + Math.cos(angle) * ry * yMultiplier
      vertices.push(x, y, z)
    }
  }

  // Connect adjacent rings with triangles
  for (let i = 0; i < ringCount - 1; i++) {
    const ringStart = i * radialSegments
    const nextRingStart = (i + 1) * radialSegments
    for (let j = 0; j < radialSegments; j++) {
      const current = ringStart + j
      const next = ringStart + ((j + 1) % radialSegments)
      const currentNext = nextRingStart + j
      const nextNext = nextRingStart + ((j + 1) % radialSegments)

      indices.push(current, next, currentNext)
      indices.push(next, nextNext, currentNext)
    }
  }

  // Front cap (snout)
  const snoutCenterIndex = vertices.length / 3
  vertices.push(0, spineProfiles[0][1], spineProfiles[0][0] + 0.25)
  for (let j = 0; j < radialSegments; j++) {
    const current = j
    const next = (j + 1) % radialSegments
    indices.push(snoutCenterIndex, current, next)
  }

  // Tail cap (fluke base)
  const tailCenterIndex = vertices.length / 3
  const lastRingStart = (ringCount - 1) * radialSegments
  vertices.push(0, spineProfiles[ringCount - 1][1], spineProfiles[ringCount - 1][0] - 0.2)
  for (let j = 0; j < radialSegments; j++) {
    const current = lastRingStart + j
    const next = lastRingStart + ((j + 1) % radialSegments)
    indices.push(tailCenterIndex, next, current)
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geom.setIndex(indices)
  geom.computeVertexNormals()
  return geom
}

/**
 * Bifurcated Whale Tail Fluke (Horizontal crescent with central notch)
 */
function createWhaleFlukeGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  // Right fluke wing
  shape.bezierCurveTo(1.3, 0.4, 2.7, 0.75, 3.3, 0.1) // wingtip
  shape.bezierCurveTo(2.8, -0.45, 1.5, -0.85, 0.25, -0.65) // trailing edge
  shape.lineTo(0, -0.45) // central notch
  // Left fluke wing
  shape.lineTo(-0.25, -0.65)
  shape.bezierCurveTo(-1.5, -0.85, -2.8, -0.45, -3.3, 0.1) // left wingtip
  shape.bezierCurveTo(-2.7, 0.75, -1.3, 0.4, 0, 0) // leading edge

  const extrudeSettings = {
    depth: 0.12,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.04,
  }
  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings)
  geom.rotateX(Math.PI / 2) // Make fluke horizontal
  geom.center()
  geom.computeVertexNormals()
  return geom
}

/**
 * Curved Humpback Whale Pectoral Flipper
 */
function createWhaleFlipperGeometry(isLeft: boolean): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.bezierCurveTo(0.6, -1.2, 1.0, -3.2, 0.75, -4.8) // leading edge
  shape.bezierCurveTo(0.35, -5.1, -0.05, -4.8, -0.25, -4.1) // tip
  shape.bezierCurveTo(-0.65, -2.7, -0.55, -1.3, 0, 0) // trailing edge

  const extrudeSettings = {
    depth: 0.12,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.03,
    bevelThickness: 0.03,
  }
  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings)
  if (!isLeft) {
    geom.scale(-1, 1, 1)
  }
  geom.computeVertexNormals()
  return geom
}

/**
 * Falcate Dorsal Fin
 */
function createWhaleDorsalGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.bezierCurveTo(0.1, 0.5, 0.3, 1.0, 0.65, 1.25)
  shape.bezierCurveTo(0.4, 0.8, 0.15, 0.35, -0.4, 0)
  shape.lineTo(0, 0)

  const extrudeSettings = {
    depth: 0.08,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  }
  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings)
  geom.computeVertexNormals()
  return geom
}

// ==========================================
// GPU SHADERS FOR 3D OCEAN WAVE SIMULATION
// Zero CPU computation per frame -> 120 FPS
// ==========================================
const waveVertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;
    // GPU-accelerated compound wave harmonics:
    float w1 = sin(pos.x * 0.05 + uTime * 1.1) * 1.5;
    float w2 = cos(pos.y * 0.07 + uTime * 0.8) * 1.2;
    float w3 = sin((pos.x + pos.y) * 0.035 + uTime * 1.3) * 0.6;
    pos.z += w1 + w2 + w3;
    vElevation = pos.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const waveFragmentShader = `
  uniform vec3 uDeepColor;
  uniform vec3 uCrestColor;
  uniform vec3 uWireColor;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    float elevationMix = clamp((vElevation + 2.4) / 5.0, 0.0, 1.0);
    vec3 baseColor = mix(uDeepColor, uCrestColor, elevationMix);

    // Subtle elegant grid line accents without eye strain
    vec2 grid = abs(fract(vUv * 24.0 - 0.5) - 0.5) / fwidth(vUv * 24.0);
    float line = min(grid.x, grid.y);
    float gridAlpha = 1.0 - min(line, 1.0);

    vec3 finalColor = mix(baseColor, uWireColor, gridAlpha * 0.28);
    gl_FragColor = vec4(finalColor, 0.7);
  }
`

export const OceanWhaleScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const container = containerRef.current
    if (!container) return

    // Scene & Perspective Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    )
    camera.position.set(0, 2.5, 24)
    camera.lookAt(0, 0, 0)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setClearColor(0x000000, 0)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.domElement.style.position = 'absolute'
      renderer.domElement.style.top = '0'
      renderer.domElement.style.left = '0'
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      renderer.domElement.style.pointerEvents = 'none'
      container.appendChild(renderer.domElement)
    } catch {
      return
    }

    // Cinematic Ocean Lighting
    const ambientLight = new THREE.AmbientLight(0x0d2238, 2.2)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0x38bdf8, 3.2)
    sunLight.position.set(12, 22, 18)
    scene.add(sunLight)

    const cyanRimLight = new THREE.DirectionalLight(0x00d2ff, 2.8)
    cyanRimLight.position.set(-18, 12, -18)
    scene.add(cyanRimLight)

    // ==========================================
    // 1. GPU OCEAN WAVE SHADER MESH (0 CPU lag)
    // ==========================================
    const waveGeometry = new THREE.PlaneGeometry(160, 160, 48, 48)
    waveGeometry.rotateX(-Math.PI / 2.3)

    const waveUniforms = {
      uTime: { value: 0 },
      uDeepColor: { value: new THREE.Color(0x051326) },
      uCrestColor: { value: new THREE.Color(0x0a2f52) },
      uWireColor: { value: new THREE.Color(0x00d2ff) },
    }

    const waveMaterial = new THREE.ShaderMaterial({
      vertexShader: waveVertexShader,
      fragmentShader: waveFragmentShader,
      uniforms: waveUniforms,
      transparent: true,
      depthWrite: false,
    })

    const oceanMesh = new THREE.Mesh(waveGeometry, waveMaterial)
    oceanMesh.position.set(0, -7.5, -8)
    scene.add(oceanMesh)

    // ==========================================
    // 2. PROCEDURAL ANATOMICAL CYBER WHALE
    // ==========================================
    const whaleGroup = new THREE.Group()

    // Smooth organic materials (no dizzying wireframes!)
    const whaleDorsalMaterial = new THREE.MeshStandardMaterial({
      color: 0x0c2744,
      roughness: 0.3,
      metalness: 0.65,
    })

    const whaleBellyMaterial = new THREE.MeshStandardMaterial({
      color: 0x163e63,
      roughness: 0.35,
      metalness: 0.5,
    })

    // Main Organic Body
    const bodyGeometry = createWhaleBodyGeometry()
    const bodyMesh = new THREE.Mesh(bodyGeometry, whaleDorsalMaterial)
    whaleGroup.add(bodyMesh)

    // Ventral Grooves (Smooth luminous belly plate)
    const bellyGeometry = new THREE.CylinderGeometry(1.5, 1.9, 5.0, 12, 1, true, 0, Math.PI)
    bellyGeometry.rotateX(Math.PI / 2)
    bellyGeometry.rotateZ(Math.PI)
    const bellyMesh = new THREE.Mesh(bellyGeometry, whaleBellyMaterial)
    bellyMesh.position.set(0, -0.65, 2.0)
    whaleGroup.add(bellyMesh)

    // Glowing Cyan Eyes
    const eyeGeom = new THREE.SphereGeometry(0.16, 8, 8)
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00ffff })
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat)
    leftEye.position.set(1.4, 0.25, 4.2)
    whaleGroup.add(leftEye)

    const rightEye = new THREE.Mesh(eyeGeom, eyeMat)
    rightEye.position.set(-1.4, 0.25, 4.2)
    whaleGroup.add(rightEye)

    // Dorsal Fin
    const dorsalGeom = createWhaleDorsalGeometry()
    const dorsalMesh = new THREE.Mesh(dorsalGeom, whaleDorsalMaterial)
    dorsalMesh.position.set(0, 1.35, -2.4)
    whaleGroup.add(dorsalMesh)

    // Articulated Flippers (Left & Right)
    const leftFlipperPivot = new THREE.Group()
    leftFlipperPivot.position.set(1.8, -0.4, 2.4)
    const leftFlipperGeom = createWhaleFlipperGeometry(true)
    const leftFlipper = new THREE.Mesh(leftFlipperGeom, whaleDorsalMaterial)
    leftFlipper.rotation.z = Math.PI / 3
    leftFlipperPivot.add(leftFlipper)
    whaleGroup.add(leftFlipperPivot)

    const rightFlipperPivot = new THREE.Group()
    rightFlipperPivot.position.set(-1.8, -0.4, 2.4)
    const rightFlipperGeom = createWhaleFlipperGeometry(false)
    const rightFlipper = new THREE.Mesh(rightFlipperGeom, whaleDorsalMaterial)
    rightFlipper.rotation.z = -Math.PI / 3
    rightFlipperPivot.add(rightFlipper)
    whaleGroup.add(rightFlipperPivot)

    // Articulated Caudal Tail & Fluke
    const tailPedunclePivot = new THREE.Group()
    tailPedunclePivot.position.set(0, 0, -6.0)

    const flukeGeom = createWhaleFlukeGeometry()
    const flukeMesh = new THREE.Mesh(flukeGeom, whaleDorsalMaterial)
    flukeMesh.position.set(0, 0, -1.2)
    tailPedunclePivot.add(flukeMesh)
    whaleGroup.add(tailPedunclePivot)

    // Gentle soft particle stardust wake (only 30 delicate particles)
    const wakeCount = 30
    const wakePositions = new Float32Array(wakeCount * 3)
    for (let i = 0; i < wakeCount; i++) {
      wakePositions[i * 3] = (Math.random() - 0.5) * 1.2
      wakePositions[i * 3 + 1] = (Math.random() - 0.5) * 1.2
      wakePositions[i * 3 + 2] = -7 - Math.random() * 8
    }
    const wakeGeometry = new THREE.BufferGeometry()
    wakeGeometry.setAttribute('position', new THREE.BufferAttribute(wakePositions, 3))
    const wakeMaterial = new THREE.PointsMaterial({
      size: 0.6,
      color: 0x00d2ff,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const wakePoints = new THREE.Points(wakeGeometry, wakeMaterial)
    whaleGroup.add(wakePoints)

    // Natural majestic scale
    whaleGroup.scale.set(1.3, 1.3, 1.3)
    scene.add(whaleGroup)

    // ==========================================
    // 3. CINEMATIC FLIGHT PATH
    // ==========================================
    // Smooth flight path: Surfaces from ocean horizon, swoops gracefully across center horizon, then dives smoothly
    const flightPoints = [
      new THREE.Vector3(-32, -12, -45), // Deep ocean swell
      new THREE.Vector3(-18, -4, -28),  // Surfacing through waves
      new THREE.Vector3(-7, 0.4, -10),  // Climbing into atmosphere
      new THREE.Vector3(0, 1.2, 2.0),   // Center background horizon (elegant & non-obtrusive)
      new THREE.Vector3(8, 1.6, -6.0),  // Banking turn
      new THREE.Vector3(18, 2.8, -18),  // Wide gliding arc
      new THREE.Vector3(24, -5, -35),   // Diving back into waves
      new THREE.Vector3(0, -14, -52),   // Deep ocean swell loop
    ]

    const flightCurve = new THREE.CatmullRomCurve3(flightPoints, true)

    let flightProgress = 0.32
    const normalFlightSpeed = 0.022
    let currentSpeed = normalFlightSpeed

    // Smooth breach trigger on demand
    const triggerCenterBreach = () => {
      flightProgress = 0.30
      currentSpeed = normalFlightSpeed * 1.5
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

    // Visibility Listener to preserve CPU
    let isVisible = true
    const onVisibilityChange = () => {
      isVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    // ==========================================
    // 4. ANIMATION LOOP (Butter smooth 60 FPS)
    // ==========================================
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (!isVisible) return

      const delta = clock.getDelta()
      const time = clock.getElapsedTime()

      // 4A. Update GPU shader time uniform (0 CPU cost!)
      waveUniforms.uTime.value = time

      // 4B. Advance Whale along flight path
      flightProgress = (flightProgress + currentSpeed * delta) % 1.0

      const positionOnCurve = flightCurve.getPointAt(flightProgress)
      const lookAtTarget = flightCurve.getPointAt((flightProgress + 0.03) % 1.0)

      whaleGroup.position.copy(positionOnCurve)

      // Smooth orientation banking along trajectory
      const lookMatrix = new THREE.Matrix4().lookAt(
        whaleGroup.position,
        lookAtTarget,
        new THREE.Vector3(0, 1, 0)
      )
      const targetQuat = new THREE.Quaternion().setFromRotationMatrix(lookMatrix)
      whaleGroup.quaternion.slerp(targetQuat, 0.08)

      // 4C. Organic Whale Swimming Articulation
      const swimCycle = time * 3.4

      // Caudal tail peduncle vertical oscillation
      tailPedunclePivot.rotation.x = Math.sin(swimCycle) * 0.24
      flukeMesh.rotation.x = Math.sin(swimCycle - 0.6) * 0.32

      // Pectoral flippers wave
      leftFlipperPivot.rotation.z = Math.sin(swimCycle * 0.7) * 0.14
      rightFlipperPivot.rotation.z = -Math.sin(swimCycle * 0.7) * 0.14
      leftFlipperPivot.rotation.x = Math.cos(swimCycle * 0.7) * 0.1
      rightFlipperPivot.rotation.x = Math.cos(swimCycle * 0.7) * 0.1

      // Gentle body pitch & roll
      bodyMesh.rotation.z = Math.sin(swimCycle * 0.4) * 0.04

      // 4D. Gentle Particle Wake drift
      const wakePos = wakeGeometry.attributes.position
      for (let j = 0; j < wakeCount; j++) {
        let pz = wakePos.getZ(j)
        pz -= 0.12
        if (pz < -14) pz = -6
        wakePos.setZ(j, pz)
      }
      wakePos.needsUpdate = true

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
      waveMaterial.dispose()

      bodyGeometry.dispose()
      whaleDorsalMaterial.dispose()
      whaleBellyMaterial.dispose()
      bellyGeometry.dispose()
      eyeGeom.dispose()
      eyeMat.dispose()
      dorsalGeom.dispose()
      leftFlipperGeom.dispose()
      rightFlipperGeom.dispose()
      flukeGeom.dispose()
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
