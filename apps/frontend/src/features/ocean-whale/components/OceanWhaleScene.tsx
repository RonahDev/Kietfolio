import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { usePerformance } from '@/hooks'

// =============================================================================
// 1. PROCEDURAL ANATOMICAL HUMPBACK / BLUE WHALE GEOMETRY
// =============================================================================

/**
 * Creates an organic, streamlined spindle body for a majestic whale.
 * Designed with realistic anatomical profiles:
 * - Rostrum apex & upper jaw ridge
 * - Ventral pouch (throat groove region)
 * - Tapered caudal peduncle
 */
function createWhaleBodyGeometry(): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry()
  const radialSegments = 24

  // Longitudinal spine cross-sections: [z, yCenter, radiusX, radiusY, ventralSquash]
  const spineProfiles = [
    [7.2, -0.25, 0.35, 0.22, 1.0],  // 0: Snout tip / rostrum apex
    [6.2, -0.15, 1.15, 0.75, 1.1],  // 1: Anterior rostrum
    [4.8, 0.12, 1.85, 1.35, 1.25],  // 2: Upper jaw & eye ridges
    [3.2, 0.25, 2.35, 1.85, 1.35],  // 3: Blowhole depression & throat pouch
    [1.4, 0.15, 2.55, 2.15, 1.3],   // 4: Thorax / deepest chest
    [-0.6, 0.05, 2.35, 2.05, 1.15], // 5: Midbody
    [-2.2, 0.0, 1.95, 1.75, 1.05],  // 6: Posterior abdomen
    [-3.6, 0.05, 1.55, 1.35, 1.0],  // 7: Trunk
    [-4.8, 0.12, 1.12, 1.05, 1.0],  // 8: Dorsal fin base
    [-5.8, 0.1, 0.75, 0.85, 0.95],  // 9: Anterior peduncle
    [-6.7, 0.05, 0.45, 0.65, 0.9],  // 10: Caudal peduncle (laterally compressed)
    [-7.3, 0.0, 0.28, 0.38, 0.9],   // 11: Fluke articulation mount
  ]

  const ringCount = spineProfiles.length
  const vertices: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  for (let i = 0; i < ringCount; i++) {
    const [z, yc, rx, ry, vSquash] = spineProfiles[i]
    const vCoord = i / (ringCount - 1)

    for (let j = 0; j < radialSegments; j++) {
      const angle = (j / radialSegments) * Math.PI * 2
      const uCoord = j / radialSegments
      const sinA = Math.sin(angle)
      const cosA = Math.cos(angle)

      const x = sinA * rx
      // Organic ventral droop: lower half expands into the characteristic expandable throat pouch
      const yMultiplier = cosA < 0 ? vSquash : 0.95
      const y = yc + cosA * ry * yMultiplier

      vertices.push(x, y, z)
      uvs.push(uCoord, vCoord)
    }
  }

  // Connect rings
  for (let i = 0; i < ringCount - 1; i++) {
    const rStart = i * radialSegments
    const nextStart = (i + 1) * radialSegments
    for (let j = 0; j < radialSegments; j++) {
      const c = rStart + j
      const n = rStart + ((j + 1) % radialSegments)
      const cNext = nextStart + j
      const nNext = nextStart + ((j + 1) % radialSegments)

      indices.push(c, n, cNext)
      indices.push(n, nNext, cNext)
    }
  }

  // Front apex cap (snout)
  const snoutIdx = vertices.length / 3
  vertices.push(0, spineProfiles[0][1], spineProfiles[0][0] + 0.35)
  uvs.push(0.5, 0)
  for (let j = 0; j < radialSegments; j++) {
    const c = j
    const n = (j + 1) % radialSegments
    indices.push(snoutIdx, c, n)
  }

  // Rear cap (tail mount)
  const tailIdx = vertices.length / 3
  const lastRStart = (ringCount - 1) * radialSegments
  vertices.push(0, spineProfiles[ringCount - 1][1], spineProfiles[ringCount - 1][0] - 0.25)
  uvs.push(0.5, 1)
  for (let j = 0; j < radialSegments; j++) {
    const c = lastRStart + j
    const n = lastRStart + ((j + 1) % radialSegments)
    indices.push(tailIdx, n, c)
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geom.setIndex(indices)
  geom.computeVertexNormals()
  return geom
}

/**
 * Creates curved, aerodynamic pectoral flippers with leading edge tubercles.
 */
function createWhaleFlipperGeometry(isLeft: boolean): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  // Leading edge with gentle scalloped curves (tubercles)
  shape.bezierCurveTo(0.7, -1.1, 1.25, -2.8, 1.05, -4.5)
  shape.bezierCurveTo(0.9, -5.2, 0.45, -5.5, 0.05, -5.1) // Wing tip
  shape.bezierCurveTo(-0.45, -4.3, -0.65, -2.5, -0.5, -1.2) // Trailing edge
  shape.lineTo(0, 0)

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.04,
  })

  if (!isLeft) {
    geom.scale(-1, 1, 1)
  }
  geom.computeVertexNormals()
  return geom
}

/**
 * Creates the bifurcated horizontal caudal tail fluke with central notch.
 */
function createWhaleFlukeGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  // Right wing
  shape.bezierCurveTo(1.5, 0.5, 3.2, 0.85, 3.8, 0.15) // Right wingtip
  shape.bezierCurveTo(3.2, -0.55, 1.7, -1.0, 0.3, -0.75) // Trailing edge
  shape.lineTo(0, -0.5) // Central notch
  // Left wing
  shape.lineTo(-0.3, -0.75)
  shape.bezierCurveTo(-1.7, -1.0, -3.2, -0.55, -3.8, 0.15) // Left wingtip
  shape.bezierCurveTo(-3.2, 0.85, -1.5, 0.5, 0, 0) // Leading edge

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.04,
  })

  geom.rotateX(Math.PI / 2) // Orient horizontally
  geom.center()
  geom.computeVertexNormals()
  return geom
}

/**
 * Creates the sleek falcate dorsal fin.
 */
function createWhaleDorsalGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.bezierCurveTo(0.12, 0.6, 0.4, 1.25, 0.8, 1.5) // Curved apex
  shape.bezierCurveTo(0.5, 0.95, 0.2, 0.45, -0.5, 0)  // Trailing scoop
  shape.lineTo(0, 0)

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.09,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.025,
    bevelThickness: 0.025,
  })
  geom.computeVertexNormals()
  return geom
}

// =============================================================================
// 2. ADVANCED GPU SHADERS: WET ORGANIC WHALE SKIN & GERSTNER OCEAN WAVES
// =============================================================================

/**
 * Whale Wet Skin Vertex Shader
 * Deforms the spine with an authentic travelling kinematic wave (S-curve undulating swim)
 * entirely on GPU with 0 CPU overhead.
 */
const whaleVertexShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  varying float vSpineWeight;

  void main() {
    vUv = uv;
    vec3 transformed = position;

    // Head remains stable (z > 2.0) while torso and tail undulate with increasing amplitude
    float tailWeight = clamp((-position.z + 2.5) / 9.5, 0.0, 1.0);
    vSpineWeight = tailWeight;

    // Travelling cetacean locomotion wave
    float wavePhase = uTime * 3.4 + position.z * 0.42;
    float verticalFlex = sin(wavePhase) * (0.55 * tailWeight * tailWeight);
    float lateralFlex = cos(wavePhase * 0.5) * (0.16 * tailWeight);

    transformed.y += verticalFlex;
    transformed.x += lateralFlex;

    // Dynamic normal distortion matching spinal bend
    vec3 normalDistort = normal;
    normalDistort.y += cos(wavePhase) * 0.22 * tailWeight;
    normalDistort.x -= sin(wavePhase * 0.5) * 0.08 * tailWeight;
    vNormal = normalize(normalMatrix * normalDistort);

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    vViewPosition = -mvPosition.xyz;
    vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;

    gl_Position = projectionMatrix * mvPosition;
  }
`

/**
 * Whale Wet Skin Fragment Shader
 * Solves the "plastic" look with:
 * - Natural marine countershading (slate charcoal dorsal vs pleated ivory ventral)
 * - Procedural longitudinal throat pleats (ventral grooves)
 * - Glancing wet water sheen (Fresnel clearcoat)
 * - Subsurface scattering (bioluminescent oceanic cyan rim glow)
 */
const whaleFragmentShader = `
  uniform vec3 uSunDirection;
  uniform vec3 uDorsalColor;
  uniform vec3 uBellyColor;
  uniform vec3 uWetSheenColor;
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  varying float vSpineWeight;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    vec3 sunDir = normalize(uSunDirection);

    // Natural marine countershading: back faces upward into dark slate, belly faces down into cream
    float dorsalBellyMix = smoothstep(-0.35, 0.55, normal.y);
    vec3 skinBaseColor = mix(uBellyColor, uDorsalColor, dorsalBellyMix);

    // Procedural Ventral Grooves (throat pleats): fine longitudinal folds under the chest
    if (vUv.y < 0.65 && normal.y < 0.2) {
      float pleatWave = sin(vUv.x * 48.0 * 3.14159) * 0.5 + 0.5;
      float pleatDepth = smoothstep(0.0, 0.4, -normal.y);
      skinBaseColor = mix(skinBaseColor, skinBaseColor * 0.65, pleatWave * pleatDepth * 0.6);
    }

    // Natural skin mottling texture
    float mottle = sin(vWorldPosition.x * 4.0) * sin(vWorldPosition.z * 3.0) * 0.04;
    skinBaseColor += mottle;

    // Diffuse directional sunlight
    float NdotL = max(dot(normal, sunDir), 0.0);
    vec3 diffuse = skinBaseColor * (0.35 + 0.65 * NdotL);

    // Dual-Layer Wet Sheen: Ocean water coating the whale's skin reflects sharp sunlight
    vec3 halfVector = normalize(sunDir + viewDir);
    float specAngle = max(dot(normal, halfVector), 0.0);
    float wetSpecular = pow(specAngle, 64.0) * 1.4; // Sharp wet glint
    float broadSpecular = pow(specAngle, 16.0) * 0.35; // Soft skin sheen

    // Fresnel Effect (Subsurface Scattering & Water Rim Sheen)
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.2);
    vec3 rimGlow = uWetSheenColor * (fresnel * 0.75);

    vec3 finalColor = diffuse + (wetSpecular + broadSpecular) * vec3(0.85, 0.95, 1.0) + rimGlow;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

/**
 * Gerstner Physical Ocean Wave Vertex Shader
 * Implements 4-harmonic Gerstner (Trochoidal) wave math on GPU:
 * sharp peaked crests and broad rounded troughs with exact analytical surface normals.
 */
const oceanVertexShader = `
  uniform float uTime;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vElevation;
  varying float vWavePeak;

  // Gerstner Wave generator function
  vec3 calcGerstnerWave(vec4 waveParams, vec3 p, inout vec3 tangent, inout vec3 binormal) {
    float steepness = waveParams.z;
    float wavelength = waveParams.w;
    float k = 6.2831853 / wavelength;
    float c = sqrt(9.81 / k);
    vec2 d = normalize(waveParams.xy);
    float f = k * (dot(d, p.xz) - c * uTime * 0.55);
    float a = steepness / k;

    tangent += vec3(
      -d.x * d.x * (steepness * sin(f)),
      d.x * (steepness * cos(f)),
      -d.x * d.y * (steepness * sin(f))
    );
    binormal += vec3(
      -d.x * d.y * (steepness * sin(f)),
      d.y * (steepness * cos(f)),
      -d.y * d.y * (steepness * sin(f))
    );

    return vec3(
      d.x * (a * cos(f)),
      a * sin(f),
      d.y * (a * cos(f))
    );
  }

  void main() {
    vec3 gridPos = position;
    vec3 tangent = vec3(1.0, 0.0, 0.0);
    vec3 binormal = vec3(0.0, 0.0, 1.0);
    vec3 waveDisplacement = vec3(0.0);

    // 4 Harmonic Gerstner Ocean Swells [dirX, dirZ, steepness, wavelength]
    waveDisplacement += calcGerstnerWave(vec4(0.707, 0.707, 0.32, 42.0), gridPos, tangent, binormal);
    waveDisplacement += calcGerstnerWave(vec4(-0.35, 0.93, 0.26, 25.0), gridPos, tangent, binormal);
    waveDisplacement += calcGerstnerWave(vec4(0.85, -0.52, 0.22, 13.0), gridPos, tangent, binormal);
    waveDisplacement += calcGerstnerWave(vec4(-0.62, -0.78, 0.16, 6.5), gridPos, tangent, binormal);

    gridPos += waveDisplacement;
    vElevation = gridPos.y;

    // Sharp crest peak indicator for dynamic whitecap foam
    vWavePeak = clamp((waveDisplacement.y + 1.2) / 3.0, 0.0, 1.0);

    // Exact analytical wave normal
    vec3 computedNormal = normalize(cross(binormal, tangent));
    vNormal = normalize(normalMatrix * computedNormal);

    vec4 mvPos = modelViewMatrix * vec4(gridPos, 1.0);
    vViewPosition = -mvPos.xyz;
    vWorldPosition = (modelMatrix * vec4(gridPos, 1.0)).xyz;

    gl_Position = projectionMatrix * mvPos;
  }
`

/**
 * Physical Ocean Wave Fragment Shader
 * Computes deep abyss water absorption, sun specular reflections, and crest seafoam.
 */
const oceanFragmentShader = `
  uniform vec3 uSunDirection;
  uniform vec3 uAbyssColor;
  uniform vec3 uShallowColor;
  uniform vec3 uCrestCyan;
  uniform vec3 uFoamColor;

  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vElevation;
  varying float vWavePeak;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    vec3 sunDir = normalize(uSunDirection);

    // Elevation depth blending
    float depthMix = clamp((vElevation + 2.8) / 5.2, 0.0, 1.0);
    vec3 waterColor = mix(uAbyssColor, uShallowColor, depthMix);

    // Subsurface Scattering at sunlit crests
    float sss = pow(max(dot(viewDir, -sunDir), 0.0), 3.0) * depthMix;
    waterColor = mix(waterColor, uCrestCyan, sss * 0.65);

    // Fresnel Water Reflectance (Schlick's approximation)
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 4.5);
    vec3 skyReflection = mix(vec3(0.04, 0.18, 0.35), vec3(0.4, 0.85, 1.0), fresnel);
    waterColor = mix(waterColor, skyReflection, fresnel * 0.7);

    // Sun Specular Glistening
    vec3 halfVec = normalize(sunDir + viewDir);
    float sunGlint = pow(max(dot(normal, halfVec), 0.0), 120.0) * 2.2;
    waterColor += vec3(0.95, 0.98, 1.0) * sunGlint;

    // Dynamic Whitecap Seafoam on steep wave crests
    float foamThreshold = 0.72;
    float foamStrength = smoothstep(foamThreshold, 1.0, vWavePeak);
    // Micro procedural foam turbulence noise
    float foamNoise = sin(vWorldPosition.x * 6.0) * cos(vWorldPosition.z * 6.0) * 0.5 + 0.5;
    foamStrength *= (0.7 + 0.3 * foamNoise);
    waterColor = mix(waterColor, uFoamColor, foamStrength * 0.85);

    // Smooth atmospheric horizon falloff
    float dist = length(vWorldPosition.xz);
    float fogAlpha = 1.0 - smoothstep(60.0, 120.0, dist);

    gl_FragColor = vec4(waterColor, fogAlpha * 0.88);
  }
`

// =============================================================================
// 3. REACT THREE.JS LIFELIKE OCEAN WHALE COMPONENT
// =============================================================================

export const OceanWhaleScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const { tier } = usePerformance()
  const tierRef = useRef(tier)

  useEffect(() => {
    tierRef.current = tier
    if (rendererRef.current) {
      const targetPixelRatio =
        tier === 'high'
          ? Math.min(window.devicePixelRatio || 1, 1.5)
          : tier === 'medium'
          ? Math.min(window.devicePixelRatio || 1, 1.2)
          : 1.0
      rendererRef.current.setPixelRatio(targetPixelRatio)
    }
  }, [tier])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const container = containerRef.current
    if (!container) return

    // Scene & Camera
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x020714, 0.012)

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      250
    )
    camera.position.set(0, 3.0, 24)
    camera.lookAt(0, 0, 0)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
      rendererRef.current = renderer
      renderer.setClearColor(0x000000, 0)
      renderer.setSize(window.innerWidth, window.innerHeight)
      const targetPixelRatio =
        tierRef.current === 'high'
          ? Math.min(window.devicePixelRatio || 1, 1.5)
          : tierRef.current === 'medium'
          ? Math.min(window.devicePixelRatio || 1, 1.2)
          : 1.0
      renderer.setPixelRatio(targetPixelRatio)
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

    // Directional Sunlight & Sky Environment
    const sunDirection = new THREE.Vector3(14, 26, 18).normalize()

    const ambientLight = new THREE.AmbientLight(0x0a1b2e, 2.4)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xd0f0ff, 3.6)
    sunLight.position.copy(sunDirection).multiplyScalar(40)
    scene.add(sunLight)

    const cyanRimLight = new THREE.DirectionalLight(0x00d2ff, 2.8)
    cyanRimLight.position.set(-20, 10, -20)
    scene.add(cyanRimLight)

    // =========================================================================
    // 3A. GERSTNER OCEAN SURFACE MESH (Horizontal Sea Level)
    // =========================================================================
    const waveSegments =
      tierRef.current === 'high' ? 64 : tierRef.current === 'medium' ? 44 : 28
    const oceanGeometry = new THREE.PlaneGeometry(220, 220, waveSegments, waveSegments)
    oceanGeometry.rotateX(-Math.PI / 2) // Orient perfectly horizontal

    const oceanUniforms = {
      uTime: { value: 0 },
      uSunDirection: { value: sunDirection },
      uAbyssColor: { value: new THREE.Color(0x020a18) },    // Deep abyssal navy
      uShallowColor: { value: new THREE.Color(0x062846) },  // Mid-ocean sapphire
      uCrestCyan: { value: new THREE.Color(0x00c8e6) },     // Bioluminescent translucent crest
      uFoamColor: { value: new THREE.Color(0xf1f9fe) },     // Crisp seafoam white
    }

    const oceanMaterial = new THREE.ShaderMaterial({
      vertexShader: oceanVertexShader,
      fragmentShader: oceanFragmentShader,
      uniforms: oceanUniforms,
      transparent: true,
      depthWrite: false,
    })

    const oceanMesh = new THREE.Mesh(oceanGeometry, oceanMaterial)
    oceanMesh.position.set(0, -5.2, 0)
    scene.add(oceanMesh)

    // =========================================================================
    // 3B. ORGANIC WHALE SHADER MATERIAL & ANATOMICAL RIG
    // =========================================================================
    const whaleGroup = new THREE.Group()

    const whaleUniforms = {
      uTime: { value: 0 },
      uSunDirection: { value: sunDirection },
      uDorsalColor: { value: new THREE.Color(0x0d1e30) },   // Natural dark slate-charcoal
      uBellyColor: { value: new THREE.Color(0x1e364e) },    // Pleated ivory-slate belly
      uWetSheenColor: { value: new THREE.Color(0x00d2ff) }, // Bioluminescent wet clearcoat sheen
    }

    const whaleSkinMaterial = new THREE.ShaderMaterial({
      vertexShader: whaleVertexShader,
      fragmentShader: whaleFragmentShader,
      uniforms: whaleUniforms,
      side: THREE.DoubleSide,
    })

    // Main Organic Body with GPU spinal flexure
    const bodyGeometry = createWhaleBodyGeometry()
    const bodyMesh = new THREE.Mesh(bodyGeometry, whaleSkinMaterial)
    whaleGroup.add(bodyMesh)

    // Dorsal Fin
    const dorsalGeom = createWhaleDorsalGeometry()
    const dorsalMesh = new THREE.Mesh(dorsalGeom, whaleSkinMaterial)
    dorsalMesh.position.set(0, 1.45, -2.8)
    whaleGroup.add(dorsalMesh)

    // Articulated Left & Right Pectoral Flippers
    const leftFlipperPivot = new THREE.Group()
    leftFlipperPivot.position.set(2.0, -0.45, 2.6)
    const leftFlipperGeom = createWhaleFlipperGeometry(true)
    const leftFlipper = new THREE.Mesh(leftFlipperGeom, whaleSkinMaterial)
    leftFlipper.rotation.z = Math.PI / 3.4
    leftFlipperPivot.add(leftFlipper)
    whaleGroup.add(leftFlipperPivot)

    const rightFlipperPivot = new THREE.Group()
    rightFlipperPivot.position.set(-2.0, -0.45, 2.6)
    const rightFlipperGeom = createWhaleFlipperGeometry(false)
    const rightFlipper = new THREE.Mesh(rightFlipperGeom, whaleSkinMaterial)
    rightFlipper.rotation.z = -Math.PI / 3.4
    rightFlipperPivot.add(rightFlipper)
    whaleGroup.add(rightFlipperPivot)

    // Caudal Fluke Mount Pivot
    const tailPedunclePivot = new THREE.Group()
    tailPedunclePivot.position.set(0, 0, -6.6)
    const flukeGeom = createWhaleFlukeGeometry()
    const flukeMesh = new THREE.Mesh(flukeGeom, whaleSkinMaterial)
    flukeMesh.position.set(0, 0, -1.0)
    tailPedunclePivot.add(flukeMesh)
    whaleGroup.add(tailPedunclePivot)

    // Luminous Cybernetic Eye Nodes
    const eyeGeom = new THREE.SphereGeometry(0.14, 12, 12)
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00ffff })
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat)
    leftEye.position.set(1.5, 0.32, 4.4)
    whaleGroup.add(leftEye)

    const rightEye = new THREE.Mesh(eyeGeom, eyeMat)
    rightEye.position.set(-1.5, 0.32, 4.4)
    whaleGroup.add(rightEye)

    // =========================================================================
    // 3C. BLOWHOLE MIST SPOUT & BREACH SPLASH PARTICLES
    // =========================================================================

    // 1. Blowhole Vapor Spout (Exhalation mist when breaching surface)
    const spoutCount = tierRef.current === 'high' ? 48 : 24
    const spoutPositions = new Float32Array(spoutCount * 3)
    const spoutVelocities: { x: number; y: number; z: number; life: number; maxLife: number }[] = []

    for (let i = 0; i < spoutCount; i++) {
      spoutPositions[i * 3] = 0
      spoutPositions[i * 3 + 1] = 2.1
      spoutPositions[i * 3 + 2] = 3.2
      spoutVelocities.push({
        x: (Math.random() - 0.5) * 0.4,
        y: 1.8 + Math.random() * 2.2,
        z: -0.6 - Math.random() * 0.8,
        life: 0,
        maxLife: 1.2 + Math.random() * 0.8,
      })
    }

    const spoutGeometry = new THREE.BufferGeometry()
    spoutGeometry.setAttribute('position', new THREE.BufferAttribute(spoutPositions, 3))
    const spoutMaterial = new THREE.PointsMaterial({
      size: 0.9,
      color: 0xcbf2ff,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const spoutPoints = new THREE.Points(spoutGeometry, spoutMaterial)
    spoutPoints.visible = false
    whaleGroup.add(spoutPoints)

    // 2. Bioluminescent Wake & Sea Spray
    const wakeCount = tierRef.current === 'high' ? 40 : 20
    const wakePositions = new Float32Array(wakeCount * 3)
    for (let i = 0; i < wakeCount; i++) {
      wakePositions[i * 3] = (Math.random() - 0.5) * 1.8
      wakePositions[i * 3 + 1] = (Math.random() - 0.5) * 1.2
      wakePositions[i * 3 + 2] = -7.5 - Math.random() * 10.0
    }
    const wakeGeometry = new THREE.BufferGeometry()
    wakeGeometry.setAttribute('position', new THREE.BufferAttribute(wakePositions, 3))
    const wakeMaterial = new THREE.PointsMaterial({
      size: 0.75,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const wakePoints = new THREE.Points(wakeGeometry, wakeMaterial)
    whaleGroup.add(wakePoints)

    whaleGroup.scale.set(1.25, 1.25, 1.25)
    whaleGroup.visible = false
    scene.add(whaleGroup)

    // =========================================================================
    // 3D. RESPONSIVE BREACH FLIGHT PATH
    // =========================================================================
    const buildFlightPath = (width: number, height: number) => {
      const isPortrait = width < height || width < 768
      const sx = isPortrait ? 0.42 : 1.0
      const sy = isPortrait ? 1.2 : 1.0
      const sz = isPortrait ? 0.75 : 1.0

      const points = [
        new THREE.Vector3(-34 * sx, -12 * sy, -42 * sz), // Deep ocean swell
        new THREE.Vector3(-20 * sx, -4.5 * sy, -22 * sz), // Climbing through sea level
        new THREE.Vector3(-8 * sx, 1.2 * sy, -5 * sz),    // Breaching the waves into atmosphere
        new THREE.Vector3(0, 3.2 * sy, 4.0 * sz),         // Apex foreground in front of viewer
        new THREE.Vector3(9 * sx, 2.6 * sy, 0.5 * sz),    // Banking curve
        new THREE.Vector3(18 * sx, 1.8 * sy, -15 * sz),   // Gliding back
        new THREE.Vector3(24 * sx, -4.8 * sy, -32 * sz),  // Re-entering ocean
        new THREE.Vector3(0, -14 * sy, -48 * sz),         // Deep loop
      ]
      return new THREE.CatmullRomCurve3(points, true)
    }

    let flightCurve = buildFlightPath(window.innerWidth, window.innerHeight)

    const updateCamera = () => {
      if (!camera || !renderer) return
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h

      if (camera.aspect < 1 || w < 768) {
        camera.position.set(0, 4.2, 32)
        camera.fov = 60
        whaleGroup.scale.set(1.05, 1.05, 1.05)
      } else {
        camera.position.set(0, 2.8, 24)
        camera.fov = 50
        whaleGroup.scale.set(1.25, 1.25, 1.25)
      }
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      flightCurve = buildFlightPath(w, h)
    }

    updateCamera()

    let flightProgress = 0.12
    const breachSpeed = 0.13
    let isBreaching = false
    let hasCompletedOneTime = false

    const startBreach = (e?: Event) => {
      const customEvent = e as CustomEvent<{ force?: boolean }> | undefined
      const isForce = customEvent?.detail?.force
      if (hasCompletedOneTime && !isForce) return

      isBreaching = true
      whaleGroup.visible = true
      flightProgress = 0.12
    }

    const endBreach = () => {
      isBreaching = false
      hasCompletedOneTime = true
      whaleGroup.visible = false
      spoutPoints.visible = false
    }

    window.addEventListener('kietfolio:summon-whale', startBreach)
    window.addEventListener('kietfolio:whale-cinematic-start', startBreach)
    window.addEventListener('kietfolio:whale-cinematic-end', endBreach)
    window.addEventListener('kietfolio:skip-whale', endBreach)

    const onResize = () => {
      updateCamera()
      const t = tierRef.current
      renderer.setPixelRatio(
        t === 'high'
          ? Math.min(window.devicePixelRatio || 1, 1.5)
          : t === 'medium'
          ? Math.min(window.devicePixelRatio || 1, 1.2)
          : 1.0
      )
    }
    window.addEventListener('resize', onResize)

    let isVisible = true
    const onVisibilityChange = () => {
      isVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    let isPastHero = false
    const onScroll = () => {
      isPastHero = window.scrollY > window.innerHeight * 1.15
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // =========================================================================
    // 4. ANIMATION TICK (Hyper-Realistic 60 FPS)
    // =========================================================================
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (!isVisible) return
      if (isPastHero && !isBreaching) return

      const delta = Math.min(clock.getDelta(), 0.1)
      const time = clock.getElapsedTime()

      // Update shader time uniforms
      oceanUniforms.uTime.value = time
      whaleUniforms.uTime.value = time

      // Breach locomotion
      if (isBreaching && !hasCompletedOneTime) {
        flightProgress += breachSpeed * delta

        if (flightProgress >= 0.72) {
          endBreach()
        } else {
          const currentPos = flightCurve.getPointAt(flightProgress)
          const nextPos = flightCurve.getPointAt((flightProgress + 0.025) % 1.0)
          whaleGroup.position.copy(currentPos)

          // Smooth orientation banking along flight path
          const lookMat = new THREE.Matrix4().lookAt(
            nextPos,
            whaleGroup.position,
            new THREE.Vector3(0, 1, 0)
          )
          const targetQuat = new THREE.Quaternion().setFromRotationMatrix(lookMat)
          whaleGroup.quaternion.slerp(targetQuat, 0.08)

          // Natural Cetacean Swimming Kinematics
          const swimCycle = time * 3.4

          // Tail fluke vertical power stroke with hydrodynamic lag
          tailPedunclePivot.rotation.x = Math.sin(swimCycle) * 0.32
          flukeMesh.rotation.x = Math.sin(swimCycle - 0.7) * 0.42

          // Pectoral flipper gliding & banking
          const flipperFlap = Math.sin(swimCycle * 0.7) * 0.18
          const flipperPitch = Math.cos(swimCycle * 0.7) * 0.12
          leftFlipperPivot.rotation.z = Math.PI / 3.4 + flipperFlap
          rightFlipperPivot.rotation.z = -Math.PI / 3.4 - flipperFlap
          leftFlipperPivot.rotation.x = flipperPitch
          rightFlipperPivot.rotation.x = flipperPitch

          // Blowhole Vapor Plume: bursts as the whale breaches surface apex
          const isAtSurface = currentPos.y > -0.5
          if (isAtSurface) {
            spoutPoints.visible = true
            const posAttr = spoutGeometry.attributes.position
            for (let i = 0; i < spoutCount; i++) {
              const vel = spoutVelocities[i]
              vel.life += delta
              if (vel.life > vel.maxLife) {
                vel.life = 0
                posAttr.setXYZ(i, 0, 2.1, 3.2)
                vel.y = 2.0 + Math.random() * 2.5
              } else {
                let px = posAttr.getX(i) + vel.x * delta
                let py = posAttr.getY(i) + vel.y * delta
                let pz = posAttr.getZ(i) + vel.z * delta
                vel.y -= 1.8 * delta // Gravity deceleration
                posAttr.setXYZ(i, px, py, pz)
              }
            }
            posAttr.needsUpdate = true
          } else {
            spoutPoints.visible = false
          }

          // Sea Spray & Bioluminescent Wake drift
          const wakePos = wakeGeometry.attributes.position
          for (let j = 0; j < wakeCount; j++) {
            let pz = wakePos.getZ(j) - 0.15
            if (pz < -18.0) pz = -7.5
            wakePos.setZ(j, pz)
          }
          wakePos.needsUpdate = true
        }
      }

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup resources cleanly on unmount
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('kietfolio:summon-whale', startBreach)
      window.removeEventListener('kietfolio:whale-cinematic-start', startBreach)
      window.removeEventListener('kietfolio:whale-cinematic-end', endBreach)
      window.removeEventListener('kietfolio:skip-whale', endBreach)

      scene.clear()

      oceanGeometry.dispose()
      oceanMaterial.dispose()

      bodyGeometry.dispose()
      whaleSkinMaterial.dispose()
      dorsalGeom.dispose()
      leftFlipperGeom.dispose()
      rightFlipperGeom.dispose()
      flukeGeom.dispose()
      eyeGeom.dispose()
      eyeMat.dispose()

      spoutGeometry.dispose()
      spoutMaterial.dispose()
      wakeGeometry.dispose()
      wakeMaterial.dispose()

      renderer.dispose()
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      if (rendererRef.current === renderer) {
        rendererRef.current = null
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
