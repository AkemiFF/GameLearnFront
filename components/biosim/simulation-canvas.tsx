"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface SimulationCanvasProps {
  simulationRunning: boolean
  showResults: boolean
  simulationSpeed: number
  selectedExperiment: string
  highQuality: boolean
  variables: {
    light: number
    co2: number
    water: number
    temperature: number
  }
}

export function SimulationCanvas({
  simulationRunning,
  showResults,
  simulationSpeed,
  selectedExperiment,
  highQuality,
  variables,
}: SimulationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Canvas animation
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Observer les changements de thème
    const observer = new MutationObserver(() => {
      // Recréer les particules avec les nouvelles couleurs
      particleGroups.forEach((group) => {
        group.particles.forEach((particle, index) => {
          group.particles[index].color = getParticleColor(group.type)
        })
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    // Définir les types de particules pour chaque variable
    const particleTypes = ["light", "co2", "water", "temperature"]

    // Créer des groupes de particules pour chaque type
    const particleGroups = particleTypes.map((type) => ({
      type,
      particles: [] as {
        x: number
        y: number
        radius: number
        color: string
        vx: number
        vy: number
        life: number
        opacity: number
      }[],
    }))

    // Initialiser les particules pour chaque groupe
    particleGroups.forEach((group) => {
      const baseCount = highQuality ? 30 : 15
      const count = Math.floor(baseCount * (variables[group.type as keyof typeof variables] / 100))

      for (let i = 0; i < baseCount; i++) {
        group.particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          color: getParticleColor(group.type),
          vx: Math.random() * 1 - 0.5,
          vy: Math.random() * 1 - 0.5,
          life: Math.random() * 100,
          opacity: i < count ? 1 : 0.1, // Opacité basée sur la valeur de la variable
        })
      }
    })

    function getParticleColor(type: string) {
      const isDarkMode = document.documentElement.classList.contains("dark")

      // Couleurs spécifiques pour chaque variable
      const colors = {
        light: isDarkMode
          ? "rgba(250, 204, 21, 0.7)" // yellow-400 avec opacité (mode sombre)
          : "rgba(234, 179, 8, 0.7)", // yellow-500 avec opacité (mode clair)
        co2: isDarkMode
          ? "rgba(74, 222, 128, 0.7)" // green-400 avec opacité (mode sombre)
          : "rgba(22, 163, 74, 0.7)", // green-600 avec opacité (mode clair)
        water: isDarkMode
          ? "rgba(96, 165, 250, 0.7)" // blue-400 avec opacité (mode sombre)
          : "rgba(37, 99, 235, 0.7)", // blue-600 avec opacité (mode clair)
        temperature: isDarkMode
          ? "rgba(248, 113, 113, 0.7)" // red-400 avec opacité (mode sombre)
          : "rgba(220, 38, 38, 0.7)", // red-600 avec opacité (mode clair)
      }

      return colors[type as keyof typeof colors] || colors.light
    }

    let animationFrameId: number

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Only animate if simulation is running or we're showing results
      if (simulationRunning || showResults) {
        // Ajouter un effet de flou pour rendre les particules plus visibles
        ctx.shadowBlur = 5

        // Mettre à jour et dessiner les particules pour chaque groupe
        particleGroups.forEach((group) => {
          // Définir la couleur de l'ombre en fonction du type de particule
          ctx.shadowColor = group.particles[0]?.color || "rgba(139, 92, 246, 0.3)"

          // Calculer le nombre de particules actives en fonction de la valeur de la variable
          const baseCount = highQuality ? 30 : 15
          const activeCount = Math.floor(baseCount * (variables[group.type as keyof typeof variables] / 100))

          // Mettre à jour et dessiner les particules
          group.particles.forEach((particle, index) => {
            // Mettre à jour l'opacité en fonction de si la particule est active
            particle.opacity =
              index < activeCount ? 0.3 + (variables[group.type as keyof typeof variables] / 100) * 0.7 : 0.1

            // Mettre à jour la position
            particle.x += particle.vx * (simulationRunning ? simulationSpeed : 0.5)
            particle.y += particle.vy * (simulationRunning ? simulationSpeed : 0.5)
            particle.life -= 0.1

            // Reset particle if it goes off screen or dies
            if (
              particle.x < 0 ||
              particle.x > canvas.width ||
              particle.y < 0 ||
              particle.y > canvas.height ||
              particle.life <= 0
            ) {
              group.particles[index] = {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                color: getParticleColor(group.type),
                vx: Math.random() * 1 - 0.5,
                vy: Math.random() * 1 - 0.5,
                life: Math.random() * 100,
                opacity: particle.opacity,
              }
            }

            // Draw particle with glow effect
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)

            // Utiliser l'opacité calculée
            const color = particle.color.replace(/[\d.]+\)$/, `${particle.opacity})`)
            ctx.fillStyle = color
            ctx.fill()

            // Add connecting lines between nearby particles of the same type
            if (highQuality && index < activeCount) {
              group.particles.forEach((otherParticle, otherIndex) => {
                if (otherIndex < activeCount && otherIndex !== index) {
                  const dx = particle.x - otherParticle.x
                  const dy = particle.y - otherParticle.y
                  const distance = Math.sqrt(dx * dx + dy * dy)

                  if (distance < 50) {
                    ctx.beginPath()
                    ctx.moveTo(particle.x, particle.y)
                    ctx.lineTo(otherParticle.x, otherParticle.y)

                    // Ligne avec la même couleur que les particules mais plus transparente
                    const lineColor = particle.color.replace(/[\d.]+\)$/, `${0.1 * (1 - distance / 50)})`)
                    ctx.strokeStyle = lineColor
                    ctx.lineWidth = 0.5
                    ctx.stroke()
                  }
                }
              })
            }
          })
        })

        // Reset shadow for performance
        ctx.shadowBlur = 0
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
      observer.disconnect()
    }
  }, [canvasRef, simulationRunning, simulationSpeed, selectedExperiment, highQuality, showResults, variables])

  // Modifier le canvas pour ajouter un fond subtil qui s'adapte au thème
  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Fond subtil qui s'adapte au thème */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 opacity-30"></div> */}

      {/* Légende des couleurs */}
      {/* <div className="absolute bottom-2 right-2 z-20 bg-background/80 backdrop-blur-sm rounded-lg p-2 text-xs flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500 dark:bg-yellow-400"></div>
          <span>Lumière: {variables.light}%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-600 dark:bg-green-400"></div>
          <span>CO₂: {variables.co2}%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400"></div>
          <span>Eau: {variables.water}%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-600 dark:bg-red-400"></div>
          <span>Temp: {variables.temperature}°C</span>
        </div>
      </div> */}

      <canvas
        ref={canvasRef}
        className={cn("absolute inset-0 w-full h-full z-10", !simulationRunning && !showResults && "opacity-30")}
      />
    </div>
  )
}

