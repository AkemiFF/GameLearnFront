"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface MathBackgroundProps {
  variant?: "simple" | "complex"
  density?: number
}

// Symboles mathématiques et équations
const mathSymbols = [
  "∫",
  "∑",
  "∏",
  "√",
  "∂",
  "∇",
  "∞",
  "∝",
  "∀",
  "∃",
  "∈",
  "∉",
  "∩",
  "∪",
  "⊂",
  "⊃",
  "≠",
  "≈",
  "≡",
  "≤",
  "≥",
  "⊕",
  "⊗",
  "⊥",
]

const equations = [
  "E=mc²",
  "F=ma",
  "a²+b²=c²",
  "∇×E=-∂B/∂t",
  "∇⋅B=0",
  "∫f(x)dx",
  "∑n²",
  "lim x→∞",
  "dy/dx",
  "∂z/∂x",
  "f(x)=0",
]

const fractals = ["z → z² + c", "z → z⁴ + c", "f(z) = z² + c", "M = {c ∈ C}"]

export function MathBackground({ variant = "simple", density = variant === "simple" ? 20 : 30 }: MathBackgroundProps) {
  const [elements, setElements] = useState<any[]>([])

  useEffect(() => {
    // Créer les éléments mathématiques flottants
    const newElements = []
    const count = density

    for (let i = 0; i < count; i++) {
      const isEquation = Math.random() > 0.7
      const isFractal = variant === "complex" && Math.random() > 0.8

      let text
      if (isFractal) {
        text = fractals[Math.floor(Math.random() * fractals.length)]
      } else if (isEquation) {
        text = equations[Math.floor(Math.random() * equations.length)]
      } else {
        text = mathSymbols[Math.floor(Math.random() * mathSymbols.length)]
      }

      newElements.push({
        id: i,
        text,
        x: Math.random() * 100, // position en pourcentage
        y: Math.random() * 100,
        size: isFractal ? 14 : isEquation ? 12 : 16 + Math.random() * 10,
        opacity: 0.05 + Math.random() * 0.15,
        duration: 50 + Math.random() * 100, // durée de l'animation en secondes
        delay: Math.random() * 2,
        xMovement: (Math.random() - 0.5) * 10,
        yMovement: (Math.random() - 0.5) * 10,
        rotation: Math.random() * 360,
        rotationMovement: (Math.random() - 0.5) * 180,
      })
    }

    setElements(newElements)
  }, [variant, density])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10"></div>

      {/* Floating elements */}
      <div className="absolute inset-0 w-full h-full text-primary/30 dark:text-primary/20">
        {elements.map((el) => (
          <motion.div
            key={el.id}
            className="absolute font-mono whitespace-nowrap"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              fontSize: `${el.size}px`,
              opacity: el.opacity,
            }}
            initial={{
              x: 0,
              y: 0,
              rotate: 0,
            }}
            animate={{
              x: [0, el.xMovement, 0],
              y: [0, el.yMovement, 0],
              rotate: [0, el.rotationMovement, 0],
            }}
            transition={{
              duration: el.duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: el.delay,
            }}
          >
            {el.text}
          </motion.div>
        ))}
      </div>

      {/* Animated circles */}
      {variant === "complex" && (
        <>
          <motion.div
            className="absolute -top-[30%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute -bottom-[30%] -right-[10%] h-[600px] w-[600px] rounded-full bg-secondary/5 blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </>
      )}
    </div>
  )
}

