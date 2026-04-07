"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

import { createIridescentShaderMaterial } from "@/lib/three/iridescent-shaders"

export function IridescentOrb() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth || 500
    const height = container.clientHeight || 500

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
    camera.position.set(0, 0.2, 4.2)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 1)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    container.appendChild(renderer.domElement)

    const material = createIridescentShaderMaterial()

    const geometry = new THREE.SphereGeometry(1.4, 256, 256)
    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)

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

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.03
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.03

      sphere.rotation.y = time * 0.08 + mouseRef.current.x * 0.4
      sphere.rotation.x = Math.sin(time * 0.06) * 0.1 + mouseRef.current.y * 0.2
      sphere.position.y = Math.sin(time * 0.3) * 0.05

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
      className="absolute inset-0 h-full w-full"
      style={{ zIndex: 1 }}
    />
  )
}
