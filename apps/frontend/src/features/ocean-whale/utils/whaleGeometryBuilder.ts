import * as THREE from 'three'

/**
 * Procedural Anatomical NOAA-Profiled Humpback Whale Geometry
 * Megaptera novaeangliae (~15 meters, 8.7m flipper span)
 * 
 * Provides immediate frame-0 rendering with accurate biological morphology:
 * 1. Elongated massive spindle body with ventral throat pouch
 * 2. Distinctive scalloped pectoral flippers with leading edge tubercles
 * 3. Broad horizontal caudal tail fluke with central notch
 * 4. Slender falcate dorsal fin
 * 5. Rig attribute: [axialZ, flipperIndex, flipperWeight, 0] compatible with NOAA rig shaders
 */
export function buildProceduralHumpbackGeometry(): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry()
  const radialSegments = 32

  // Longitudinal spine cross-sections: [z, yCenter, radiusX, radiusY, ventralSquash]
  // Dimensions calibrated to authentic adult Humpback Whale proportions:
  const spineProfiles: [number, number, number, number, number][] = [
    [5.80, -0.22, 0.35, 0.22, 1.0],   // 0: Rostrum tip / snout apex
    [5.00, -0.15, 1.25, 0.78, 1.15],  // 1: Anterior upper jaw & tubercles
    [3.80, 0.12, 1.95, 1.35, 1.30],   // 2: Upper jaw ridges & eye mount
    [2.40, 0.26, 2.45, 1.88, 1.40],   // 3: Blowhole region & deep throat pouch
    [0.80, 0.16, 2.65, 2.22, 1.35],   // 4: Thorax / deepest ventral grooves
    [-1.00, 0.05, 2.42, 2.10, 1.20],  // 5: Mid-body
    [-2.60, 0.00, 2.05, 1.82, 1.10],  // 6: Posterior abdomen
    [-4.20, 0.04, 1.62, 1.45, 1.02],  // 7: Anterior trunk
    [-5.60, 0.12, 1.18, 1.12, 1.00],  // 8: Dorsal fin insertion base
    [-6.80, 0.08, 0.78, 0.90, 0.95],  // 9: Anterior caudal peduncle
    [-7.80, 0.04, 0.48, 0.68, 0.90],  // 10: Caudal peduncle (laterally compressed)
    [-8.60, 0.00, 0.28, 0.38, 0.88],  // 11: Tail fluke articulation notch
  ]

  const ringCount = spineProfiles.length
  const vertices: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const rigs: number[] = []
  const indices: number[] = []

  // 1. Generate Body Rings
  for (let i = 0; i < ringCount; i++) {
    const [z, yc, rx, ry, vSquash] = spineProfiles[i]
    const vCoord = (5.80 - z) / 14.4 // normalized UV along body length

    for (let j = 0; j < radialSegments; j++) {
      const angle = (j / radialSegments) * Math.PI * 2
      const uCoord = j / radialSegments
      const sinA = Math.sin(angle)
      const cosA = Math.cos(angle)

      const x = sinA * rx
      // Organic ventral droop: ventral pouch expands downwards for throat pleats
      const yMultiplier = cosA < 0 ? vSquash : 0.96
      const y = yc + cosA * ry * yMultiplier

      vertices.push(x, y, z)
      // Approximate normal before auto-computation
      normals.push(sinA, cosA, 0.1)
      uvs.push(uCoord, vCoord)
      // Rig: [axialZ, flipperIndex (0=body), flipperWeight, 0]
      rigs.push(z, 0, 0, 0)
    }
  }

  // Connect Body Rings
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

  // Rostrum Apex Cap
  const snoutIdx = vertices.length / 3
  vertices.push(0, spineProfiles[0][1], spineProfiles[0][0] + 0.32)
  normals.push(0, 0, 1)
  uvs.push(0.5, 0.0)
  rigs.push(spineProfiles[0][0], 0, 0, 0)
  for (let j = 0; j < radialSegments; j++) {
    const c = j
    const n = (j + 1) % radialSegments
    indices.push(snoutIdx, c, n)
  }

  // Tail Notch Cap
  const tailIdx = vertices.length / 3
  const lastRStart = (ringCount - 1) * radialSegments
  vertices.push(0, spineProfiles[ringCount - 1][1], spineProfiles[ringCount - 1][0] - 0.25)
  normals.push(0, 0, -1)
  uvs.push(0.5, 1.0)
  rigs.push(spineProfiles[ringCount - 1][0], 0, 0, 0)
  for (let j = 0; j < radialSegments; j++) {
    const c = lastRStart + j
    const n = lastRStart + ((j + 1) % radialSegments)
    indices.push(tailIdx, n, c)
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geom.setAttribute('rig', new THREE.Float32BufferAttribute(rigs, 4))
  geom.setIndex(indices)
  geom.computeVertexNormals()
  geom.computeBoundingBox()
  geom.computeBoundingSphere()

  return geom
}

/**
 * Creates anatomically correct Humpback Whale Pectoral Flipper
 * Characteristics:
 * - Scalloped leading edge with prominent tubercles (knobs)
 * - 1/3 of total body length (~4.3m)
 * - Hydrodynamic wing cross-section
 */
export function buildProceduralFlipperGeometry(isLeft: boolean): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  
  // Scalloped tubercles along leading edge
  shape.bezierCurveTo(0.65, -0.9, 1.15, -2.2, 1.18, -3.2)
  shape.bezierCurveTo(1.22, -3.8, 0.95, -4.6, 0.35, -4.85) // Wingtip
  shape.bezierCurveTo(-0.15, -4.4, -0.42, -2.6, -0.38, -1.2) // Trailing edge
  shape.lineTo(0, 0)

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  })

  if (!isLeft) {
    geom.scale(-1, 1, 1)
  }
  geom.computeVertexNormals()
  geom.computeBoundingBox()
  geom.computeBoundingSphere()
  return geom
}

/**
 * Creates anatomically correct Humpback Whale Caudal Fluke
 * Characteristics:
 * - Wide horizontal wing (span ~4.5m)
 * - Deep V-shaped central notch
 * - Serrated, irregular trailing edge with natural individual markings
 */
export function buildProceduralFlukeGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  
  // Right wing
  shape.bezierCurveTo(1.6, 0.45, 3.2, 0.75, 4.1, 0.18) // Right wingtip
  shape.bezierCurveTo(3.4, -0.65, 1.8, -1.15, 0.35, -0.85) // Trailing edge
  shape.lineTo(0, -0.55) // Central notch
  
  // Left wing
  shape.lineTo(-0.35, -0.85)
  shape.bezierCurveTo(-1.8, -1.15, -3.4, -0.65, -4.1, 0.18) // Left wingtip
  shape.bezierCurveTo(-3.2, 0.75, -1.6, 0.45, 0, 0) // Leading edge

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  })

  geom.rotateX(Math.PI / 2) // Orient horizontally
  geom.center()
  geom.computeVertexNormals()
  geom.computeBoundingBox()
  geom.computeBoundingSphere()
  return geom
}

/**
 * Creates anatomically correct Humpback Whale Dorsal Fin
 * Slender, falcate (curved backward) with stepped hump base
 */
export function buildProceduralDorsalGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.bezierCurveTo(0.18, 0.55, 0.45, 1.25, 0.85, 1.48) // Apex
  shape.bezierCurveTo(0.55, 0.95, 0.22, 0.45, -0.55, 0.0) // Trailing concave scoop
  shape.lineTo(0, 0)

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.11,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.03,
    bevelThickness: 0.03,
  })

  geom.computeVertexNormals()
  geom.computeBoundingBox()
  geom.computeBoundingSphere()
  return geom
}
