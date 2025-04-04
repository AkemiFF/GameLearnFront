"use client"

import { motion } from "framer-motion"
import { Backpack } from "lucide-react"
import type { ReactNode } from "react"

interface InventoryItem {
  id: string
  name: string
  description: string
  icon: ReactNode
}

interface InventoryProps {
  items: InventoryItem[]
}

export function Inventory({ items }: InventoryProps) {
  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      {items.length > 0 ? (
        items.map((item) => (
          <motion.div
            key={item.id}
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400">
              {item.icon}
            </div>
            <div className="text-center">
              <h4 className="font-medium text-white">{item.name}</h4>
              <p className="text-xs text-white/70">{item.description}</p>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="col-span-2 text-center py-8 text-white/50">
          <Backpack className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p>Votre inventaire est vide</p>
        </div>
      )}
    </div>
  )
}

