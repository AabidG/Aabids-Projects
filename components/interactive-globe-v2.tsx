"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Canvas, type ThreeEvent } from "@react-three/fiber"
import { OrbitControls, Sphere, Stars } from "@react-three/drei"
import * as THREE from "three"
import type { LocationData } from "@/types/news"
import { mockLocations } from "@/data/mockNews"

interface GlobeProps {
  onLocationClick: (location: LocationData) => void
}

// Function to get local time for a location
function getLocalTime(coordinates: [number, number]): string {
  const [lat, lng] = coordinates
  // Approximate timezone offset based on longitude
  const timezoneOffset = Math.round(lng / 15) // 15 degrees per hour
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const localTime = new Date(utc + timezoneOffset * 3600000)

  return localTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

// Hover info component that renders outside the Canvas
function HoverInfo({
  location,
  currentTime,
  visible,
  position,
}: {
  location: LocationData | null
  currentTime: string
  visible: boolean
  position: { x: number; y: number }
}) {
  if (!visible || !location) return null

  return (
    <div
      className="fixed z-50 bg-black/95 text-white p-4 rounded-lg border border-yellow-500 pointer-events-none shadow-2xl"
      style={{
        left: position.x + 15,
        top: position.y - 100,
        minWidth: "200px",
      }}
    >
      <div className="text-lg font-bold text-white mb-1">
        {location.name}, {location.country}
      </div>
      <div className="text-sm text-yellow-400 mb-1">🕒 Local Time: {currentTime}</div>
      <div className="text-sm text-gray-300">📰 {location.topSources.length} News Sources Available</div>
    </div>
  )
}

function LocationMarker({
  location,
  onLocationClick,
  onHover,
  onLeave,
}: {
  location: LocationData
  onLocationClick: (location: LocationData) => void
  onHover: (location: LocationData) => void
  onLeave: () => void
}) {
  const [lat, lng] = location.coordinates
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  // Fixed position on the globe surface
  const x = -(2.02 * Math.sin(phi) * Math.cos(theta))
  const y = 2.02 * Math.cos(phi)
  const z = 2.02 * Math.sin(phi) * Math.sin(theta)

  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      position={[x, y, z]}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        onLocationClick(location)
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        setHovered(true)
        onHover(location)
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        setHovered(false)
        onLeave()
        document.body.style.cursor = "auto"
      }}
    >
      <sphereGeometry args={[0.04, 16, 16]} />
      <meshBasicMaterial color={hovered ? "#fbbf24" : "#f59e0b"} />
    </mesh>
  )
}

function StaticEarth({
  onLocationClick,
  onMarkerHover,
  onMarkerLeave,
}: {
  onLocationClick: (location: LocationData) => void
  onMarkerHover: (location: LocationData) => void
  onMarkerLeave: () => void
}) {
  // Create a simple, solid Earth texture
  const earthTexture = new THREE.CanvasTexture(createSimpleEarthTexture())

  return (
    <>
      {/* Space background with stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Single Earth sphere with everything together */}
      <group>
        {/* Main Earth sphere */}
        <Sphere args={[2, 64, 32]}>
          <meshPhongMaterial map={earthTexture} shininess={50} specular="#333333" />
        </Sphere>

        {/* Location markers */}
        {mockLocations.map((location) => (
          <LocationMarker
            key={location.id}
            location={location}
            onLocationClick={onLocationClick}
            onHover={onMarkerHover}
            onLeave={onMarkerLeave}
          />
        ))}
      </group>

      {/* Simple atmosphere glow */}
      <Sphere args={[2.05, 32, 16]}>
        <meshBasicMaterial color="#87ceeb" transparent opacity={0.1} side={THREE.BackSide} />
      </Sphere>

      {/* Simple lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={1} color="#ffffff" />
    </>
  )
}

// Create a simple, solid Earth texture
function createSimpleEarthTexture(): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext("2d")!

  // Ocean background
  ctx.fillStyle = "#1e40af"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Simple continent shapes
  const landColor = "#22c55e"
  ctx.fillStyle = landColor

  // North America
  ctx.beginPath()
  ctx.ellipse(200, 150, 80, 60, 0, 0, 2 * Math.PI)
  ctx.fill()

  // South America
  ctx.beginPath()
  ctx.ellipse(250, 300, 40, 80, 0, 0, 2 * Math.PI)
  ctx.fill()

  // Europe
  ctx.beginPath()
  ctx.ellipse(500, 140, 50, 40, 0, 0, 2 * Math.PI)
  ctx.fill()

  // Africa
  ctx.beginPath()
  ctx.ellipse(520, 250, 60, 100, 0, 0, 2 * Math.PI)
  ctx.fill()

  // Asia
  ctx.beginPath()
  ctx.ellipse(700, 160, 100, 70, 0, 0, 2 * Math.PI)
  ctx.fill()

  // Australia
  ctx.beginPath()
  ctx.ellipse(800, 350, 50, 30, 0, 0, 2 * Math.PI)
  ctx.fill()

  // Ice caps
  ctx.fillStyle = "#ffffff"
  ctx.beginPath()
  ctx.ellipse(canvas.width / 2, 30, 200, 20, 0, 0, 2 * Math.PI)
  ctx.fill()

  ctx.beginPath()
  ctx.ellipse(canvas.width / 2, canvas.height - 30, 250, 25, 0, 0, 2 * Math.PI)
  ctx.fill()

  return canvas
}

export default function InteractiveGlobe({ onLocationClick }: GlobeProps) {
  const [hoveredLocation, setHoveredLocation] = useState<LocationData | null>(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    if (hoveredLocation) {
      setCurrentTime(getLocalTime(hoveredLocation.coordinates))
      const interval = setInterval(() => {
        setCurrentTime(getLocalTime(hoveredLocation.coordinates))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [hoveredLocation])

  const handleMarkerHover = (location: LocationData) => {
    setHoveredLocation(location)
  }

  const handleMarkerLeave = () => {
    setHoveredLocation(null)
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    setHoverPosition({ x: event.clientX, y: event.clientY })
  }

  return (
    <div className="w-full h-full relative" onMouseMove={handleMouseMove}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <StaticEarth
          onLocationClick={onLocationClick}
          onMarkerHover={handleMarkerHover}
          onMarkerLeave={handleMarkerLeave}
        />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={2.5}
          maxDistance={8}
          enableDamping={true}
          dampingFactor={0.1}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: null,
          }}
        />
      </Canvas>

      {/* Hover info overlay */}
      <HoverInfo
        location={hoveredLocation}
        currentTime={currentTime}
        visible={!!hoveredLocation}
        position={hoverPosition}
      />
    </div>
  )
}
