import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createTheaterCurtainGeometry } from './CurtainGeometry'
import { createCurtainMaterial } from './curtainShader'

interface CurtainSceneProps {
  animStateRef: React.MutableRefObject<{ progress: number; light: number }>
  onWebGLUnsupported?: () => void
}

export const CurtainScene: React.FC<CurtainSceneProps> = ({
  animStateRef,
  onWebGLUnsupported,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const animFrameIdRef = useRef<number | null>(null)
  const leftMatRef = useRef<THREE.ShaderMaterial | null>(null)
  const rightMatRef = useRef<THREE.ShaderMaterial | null>(null)
  const clockRef = useRef(new THREE.Clock())

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Fast WebGL capability probe
    try {
      const testCanvas = document.createElement('canvas')
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
      if (!gl) {
        onWebGLUnsupported?.()
        return
      }
    } catch {
      onWebGLUnsupported?.()
      return
    }

    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    const scene = new THREE.Scene()
    scene.background = null // Transparent background reveals streaming backdrop
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 15)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
      depth: true,
      stencil: false,
    })
    renderer.setSize(width, height)
    // Cap pixel ratio to 1.5 to reduce fragment fill rate overhead on high-DPI displays by 45%
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    rendererRef.current = renderer

    container.appendChild(renderer.domElement)

    // Stage Lighting
    const ambientLight = new THREE.AmbientLight(0xffddaa, 0.4)
    scene.add(ambientLight)

    const spotLight = new THREE.SpotLight(0xfff5ea, 1.8, 30, Math.PI / 4, 0.4, 1)
    spotLight.position.set(0, 9, 6)
    spotLight.target.position.set(0, 0, 0)
    scene.add(spotLight)
    scene.add(spotLight.target)

    // Top Golden Proscenium Valence Bar & Rings (Low-poly cylinder)
    const barGeom = new THREE.CylinderGeometry(0.18, 0.18, 24, 16)
    barGeom.rotateZ(Math.PI / 2)
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25,
    })
    const valenceBar = new THREE.Mesh(barGeom, goldMat)
    valenceBar.position.set(0, 6.4, 0.3)
    scene.add(valenceBar)

    // Theater Curtains (Left & Right halves)
    const leftGeom = createTheaterCurtainGeometry('left', 11, 13)
    const rightGeom = createTheaterCurtainGeometry('right', 11, 13)

    const leftMat = createCurtainMaterial('left')
    const rightMat = createCurtainMaterial('right')
    leftMatRef.current = leftMat
    rightMatRef.current = rightMat

    const leftCurtainMesh = new THREE.Mesh(leftGeom, leftMat)
    const rightCurtainMesh = new THREE.Mesh(rightGeom, rightMat)

    scene.add(leftCurtainMesh)
    scene.add(rightCurtainMesh)

    // Direct RAF loop without React state rerender overhead
    const render = () => {
      const currentProgress = animStateRef.current.progress
      const currentLight = animStateRef.current.light

      // Halt loop once curtains are completely open
      if (currentProgress >= 1.0) {
        renderer.render(scene, camera)
        return
      }

      const elapsedTime = clockRef.current.getElapsedTime()

      if (leftMatRef.current && rightMatRef.current) {
        leftMatRef.current.uniforms.uTime.value = elapsedTime
        leftMatRef.current.uniforms.uOpenProgress.value = currentProgress
        leftMatRef.current.uniforms.uLightIntensity.value = currentLight

        rightMatRef.current.uniforms.uTime.value = elapsedTime
        rightMatRef.current.uniforms.uOpenProgress.value = currentProgress
        rightMatRef.current.uniforms.uLightIntensity.value = currentLight
      }

      renderer.render(scene, camera)
      animFrameIdRef.current = requestAnimationFrame(render)
    }

    render()

    // Passive resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current) return
      const w = container.clientWidth || window.innerWidth
      const h = container.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      rendererRef.current.setSize(w, h)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    // Safe Context Loss Handling
    const handleContextLost = (e: Event) => {
      e.preventDefault()
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)
      onWebGLUnsupported?.()
    }
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost)

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)
      window.removeEventListener('resize', handleResize)

      if (renderer.domElement) {
        renderer.domElement.removeEventListener('webglcontextlost', handleContextLost)
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement)
        }
      }

      // Memory cleanup
      barGeom.dispose()
      goldMat.dispose()
      leftGeom.dispose()
      rightGeom.dispose()
      leftMat.dispose()
      rightMat.dispose()
      renderer.dispose()
    }
  }, [animStateRef, onWebGLUnsupported])

  return <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}
