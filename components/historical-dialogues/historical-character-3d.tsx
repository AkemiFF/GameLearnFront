"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useAnimations, useGLTF, Environment, Html } from "@react-three/drei"
import { Vector3 } from "three"
import type { HistoricalCharacter } from "@/data/historical-characters"
import type * as THREE from "three"

// Generic human model path
const HUMAN_MODEL_PATH = "/assets/3d/generic-human.glb"

interface HistoricalCharacter3DProps {
  character: HistoricalCharacter
  mood: "neutral" | "happy" | "thinking" | "surprised"
  onLoaded?: () => void
}

function CharacterModel({ mood, onLoaded }: { mood: string; onLoaded?: () => void }) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(HUMAN_MODEL_PATH)
  const { actions, names } = useAnimations(animations, group)
  const { camera } = useThree()

  // Set initial camera position
  useEffect(() => {
    camera.position.set(0, 1.5, 2.5)
    camera.lookAt(new Vector3(0, 1, 0))
  }, [camera])

  // Play animation based on mood
  useEffect(() => {
    // Reset all animations
    Object.values(actions).forEach((action) => action?.stop())

    // Map mood to animation
    let animationName = "Idle" // default

    if (mood === "happy") animationName = "Greeting"
    if (mood === "thinking") animationName = "Thinking"
    if (mood === "surprised") animationName = "Surprised"

    // Find the closest matching animation
    const closestAnimation = names.find((name) => name.toLowerCase().includes(animationName.toLowerCase())) || names[0]

    // Play the animation
    const action = actions[closestAnimation]
    if (action) {
      action.reset().fadeIn(0.5).play()
    }

    // Notify parent component that model is loaded
    if (onLoaded) {
      onLoaded()
    }

    return () => {
      action?.fadeOut(0.5)
    }
  }, [mood, actions, names, onLoaded])

  // Subtle idle animation
  useFrame(({ clock }) => {
    if (group.current) {
      // Subtle breathing motion
      group.current.position.y = Math.sin(clock.getElapsedTime()) * 0.01
      // Subtle swaying
      group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.05
    }
  })

  return (
    <group ref={group}>
      <primitive object={scene} scale={1} position={[0, 0, 0]} />
    </group>
  )
}

export function HistoricalCharacter3D({ character, mood, onLoaded }: HistoricalCharacter3DProps) {
  const [error, setError] = useState<string | null>(null)

  // Handle WebGL errors
  useEffect(() => {
    const canvas = document.createElement("canvas")
    const hasWebGL = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    )

    if (!hasWebGL) {
      setError("Votre navigateur ne supporte pas WebGL, nécessaire pour afficher le personnage 3D.")
    }
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/30 p-4 text-center">
        <div>
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-sm text-muted-foreground">
            Essayez d'utiliser un navigateur plus récent ou d'activer l'accélération matérielle.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Canvas shadows>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <Suspense
        fallback={
          <Html center>
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p>Chargement du modèle 3D...</p>
            </div>
          </Html>
        }
      >
        <CharacterModel mood={mood} onLoaded={onLoaded} />
        <Environment preset="studio" />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minDistance={1.5}
        maxDistance={4}
      />
    </Canvas>
  )
}

