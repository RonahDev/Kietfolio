import * as THREE from 'three'

/**
 * Procedural Theater Curtain Buffer Geometry
 * Generates subdivided mesh with realistic vertical drapery folds and catenary weight.
 *
 * @param side 'left' | 'right'
 * @param width Width of one curtain half in world units
 * @param height Height of curtain in world units
 * @param segmentsX Horizontal resolution for smooth fold curves
 * @param segmentsY Vertical resolution for natural fabric gravity
 */
export function createTheaterCurtainGeometry(
  side: 'left' | 'right',
  width = 11,
  height = 13,
  segmentsX = 96,
  segmentsY = 32
): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry()
  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  const xOffset = side === 'left' ? -width : 0

  for (let yIndex = 0; yIndex <= segmentsY; yIndex++) {
    const v = yIndex / segmentsY
    const y = (1 - v) * height - height / 2

    // Upper valence gathering tension: folds are slightly deeper at mid-height and gathered at top
    const drapeWeight = 0.85 + 0.15 * Math.sin(v * Math.PI)

    for (let xIndex = 0; xIndex <= segmentsX; xIndex++) {
      const u = xIndex / segmentsX
      const x = xOffset + u * width

      // Dual harmonic sinusoidal equation modeling natural velvet drapery folds
      const foldFreq1 = 18.0
      const foldFreq2 = 36.0
      const primaryFold = Math.sin(u * Math.PI * foldFreq1) * 0.42
      const secondaryFold = Math.sin(u * Math.PI * foldFreq2 + 0.8) * 0.14
      const bottomHemFlare = v > 0.8 ? (v - 0.8) * 0.2 * Math.sin(u * Math.PI * 8.0) : 0

      const z = (primaryFold + secondaryFold + bottomHemFlare) * drapeWeight

      positions.push(x, y, z)
      uvs.push(side === 'left' ? u : 1 - u, v)

      // Initial temporary upward normal, recomputed precisely below
      normals.push(0, 0, 1)
    }
  }

  // Construct triangular faces (2 triangles per quad grid cell)
  const rowSize = segmentsX + 1
  for (let y = 0; y < segmentsY; y++) {
    for (let x = 0; x < segmentsX; x++) {
      const a = y * rowSize + x
      const b = y * rowSize + (x + 1)
      const c = (y + 1) * rowSize + x
      const d = (y + 1) * rowSize + (x + 1)

      indices.push(a, b, c)
      indices.push(b, d, c)
    }
  }

  geom.setIndex(indices)
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))

  geom.computeVertexNormals()

  return geom
}
