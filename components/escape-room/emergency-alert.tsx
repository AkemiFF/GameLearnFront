"use client"

import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"

interface EmergencyAlertProps {
  timeLeft: number
  formatTime: (seconds: number) => string
}

export function EmergencyAlert({ timeLeft, formatTime }: EmergencyAlertProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-red-500/30 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0, 1, 0, 1] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3 }}
    >
      <motion.div
        className="bg-black/80 backdrop-blur-md p-6 rounded-lg border-2 border-red-500 max-w-md text-center"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.5, repeat: 5 }}
      >
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-500 mb-2">ALERTE</h2>
        <p className="text-white mb-4">Système de confinement critique. Temps restant limité.</p>
        <div className="text-3xl font-mono font-bold text-red-500">{formatTime(timeLeft)}</div>
      </motion.div>
    </motion.div>
  )
}

