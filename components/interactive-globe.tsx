"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Sphere } from "@react-three/drei"
import * as THREE from "three"
import type { LocationData } from "@/types/news"
import { mockLocations } from "@/data/mockNews"

interface GlobeProps {
  onLocationClick: (location: LocationData) => void
}

function Globe({ onLocationClick }: GlobeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera, raycaster, mouse, scene } = useThree()
  const [markers, setMarkers] = useState<THREE.Mesh[]>([])

  useEffect(() => {
    // Create markers for each location
    const newMarkers: THREE.Mesh[] = []

    mockLocations.forEach((location) => {
      const [lat, lng] = location.coordinates
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lng + 180) * (Math.PI / 180)

      const x = -(2.02 * Math.sin(phi) * Math.cos(theta))
      const y = 2.02 * Math.cos(phi)
      const z = 2.02 * Math.sin(phi) * Math.sin(theta)

      const markerGeometry = new THREE.SphereGeometry(0.02, 8, 8)
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: "#ef4444",
        transparent: true,
        opacity: 0.8,
      })
      const marker = new THREE.Mesh(markerGeometry, markerMaterial)
      marker.position.set(x, y, z)
      marker.userData = { location }

      scene.add(marker)
      newMarkers.push(marker)
    })

    setMarkers(newMarkers)

    return () => {
      newMarkers.forEach((marker) => scene.remove(marker))
    }
  }, [scene])

  const handleClick = (event: any) => {
    event.stopPropagation()

    // Get the canvas element from the Three.js context
    const canvas = event.target
    if (!canvas || !canvas.getBoundingClientRect) {
      return
    }

    const rect = canvas.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    mouse.x = x
    mouse.y = y

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(markers)

    if (intersects.length > 0) {
      const clickedMarker = intersects[0].object
      const location = clickedMarker.userData.location
      if (location) {
        onLocationClick(location)
      }
    }
  }

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
    }
  })

  return (
    <>
      <Sphere ref={meshRef} args={[2, 64, 64]} onClick={handleClick}>
        <meshStandardMaterial map={undefined} color="#1e40af" transparent opacity={0.8} wireframe={false} />
      </Sphere>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
    </>
  )
}

export default function InteractiveGlobe({ onLocationClick }: GlobeProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Globe onLocationClick={onLocationClick} />
        <OrbitControls enableZoom={true} enablePan={false} minDistance={3} maxDistance={8} />
      </Canvas>
    </div>
  )
}
