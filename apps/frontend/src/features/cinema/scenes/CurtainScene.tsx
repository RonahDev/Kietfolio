import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createTheaterCurtainGeometry } from './CurtainGeometry'
import { createCurtainMaterial } from './curtainShader'

interface CurtainSceneProps {
  openProgress: number
  lightIntensity: number
  onWebGLUnsupported?: () => void
}

export const CurtainScene: React.FC<CurtainSceneProps> = ({
  openProgress,
  lightIntensity,
  onWebGLUnsupported,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const animFrameIdRef = useRef<number | null>(null)
  const leftMatRef = useRef<THREE.ShaderMaterial | null>(null)
  const rightMatRef = useRef<THREE.ShaderMaterial | null>(null)
  const clockRef = useRef(new THREE.Clock())

  // Keep latest props in refs for animation loop
  const openProgressRef = useRef(openProgress)
  const lightIntensityRef = useRef(lightIntensity)

  useEffect(() => {
    openProgressRef.current = openProgress
    lightIntensityRef.current = lightIntensity
  }, [openProgress, lightIntensity])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // WebGL capability probe
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
    scene.background = null // Transparent so it reveals content behind as it opens
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 15)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    rendererRef.current = renderer

    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffddaa, 0.4)
    scene.add(ambientLight)

    const spotLight = new THREE.SpotLight(0xfff5ea, 1.8, 30, Math.PI / 4, 0.4, 1)
    spotLight.position.set(0, 9, 6)
    spotLight.target.position.set(0, 0, 0)
    scene.add(spotLight)
    scene.add(spotLight.target)

    // Top Golden Proscenium Valence Bar & Rings
    const barGeom = new THREE.CylinderGeometry(0.18, 0.18, 24, 32)
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

    // Render loop
    const render = () => {
      const elapsedTime = clockRef.current.getElapsedTime()

      if (leftMatRef.current && rightMatRef.current) {
        leftMatRef.current.uniforms.uTime.value = elapsedTime
        leftMatRef.current.uniforms.uOpenProgress.value = openProgressRef.current
        leftMatRef.current.uniforms.uLightIntensity.value = lightIntensityRef.current

        rightMatRef.current.uniforms.uTime.value = elapsedTime
        rightMatRef.current.uniforms.uOpenProgress.value = openProgressRef.current
        rightMatRef.current.uniforms.uLightIntensity.value = lightIntensityRef.current
      }

      renderer.render(scene, camera)
      animFrameIdRef.current = requestAnimationFrame(render)
    }

    render()

    // Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current) return
      const w = container.clientWidth || window.innerWidth
      const h = container.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      rendererRef.current.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

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

      // Dispose resources
      barGeom.dispose()
      goldMat.dispose()
      leftGeom.dispose()
      rightGeom.dispose()
      leftMat.dispose()
      rightMat.dispose()
      renderer.dispose()
    }
  }, [onWebGLUnsupported])

  return <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}
