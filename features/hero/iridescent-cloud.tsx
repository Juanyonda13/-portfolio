"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js"

import { createIridescentShaderMaterial } from "@/lib/three/iridescent-shaders"

/** Esferas solapadas → una sola malla (mismo material iridiscente, mejor rendimiento). */
function buildCloudGeometry(): THREE.BufferGeometry {
  const puffs: { x: number; y: number; z: number; r: number }[] = [
    { x: 0, y: 0, z: 0, r: 1.05 },
    { x: -1.0, y: 0.08, z: 0.05, r: 0.62 },
    { x: 0.95, y: -0.12, z: 0.08, r: 0.58 },
    { x: 0.12, y: 0.75, z: -0.08, r: 0.52 },
    { x: 0.2, y: -0.58, z: 0.12, r: 0.48 },
    { x: -0.4, y: -0.38, z: 0.28, r: 0.38 },
    { x: 0.55, y: 0.35, z: -0.35, r: 0.32 },
  ]

  const segments = 48
  const parts: THREE.BufferGeometry[] = []

  for (const p of puffs) {
    const g = new THREE.SphereGeometry(p.r, segments, segments)
    g.translate(p.x, p.y, p.z)
    parts.push(g)
  }

  const merged = mergeGeometries(parts, false)
  parts.forEach((g) => g.dispose())
  if (!merged) {
    return new THREE.SphereGeometry(1, 32, 32)
  }
  merged.computeVertexNormals()
  return merged
}

export function IridescentCloud() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth || 500
    const height = container.clientHeight || 500

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100)
    camera.position.set(0, 0.15, 5.2)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    container.appendChild(renderer.domElement)

    const material = createIridescentShaderMaterial()
    const geometry = buildCloudGeometry()
    const cloud = new THREE.Mesh(geometry, material)
    scene.add(cloud)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseRef.current.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouseRef.current.targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    window.addEventListener("mousemove", handleMouseMove)

    let animationId: number
    let time = 0

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      time += 0.016

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.035
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.035

      cloud.rotation.y = time * 0.06 + mouseRef.current.x * 0.35
      cloud.rotation.x = Math.sin(time * 0.05) * 0.08 + mouseRef.current.y * 0.18
      cloud.rotation.z = Math.sin(time * 0.04) * 0.04
      cloud.position.y = Math.sin(time * 0.25) * 0.06

      material.uniforms.uTime.value = time

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      const newWidth = container.clientWidth || 500
      const newHeight = container.clientHeight || 500
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full min-h-[280px] w-full"
      style={{ zIndex: 1 }}
      aria-hidden
    />
  )
}
