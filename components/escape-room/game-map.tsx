"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function GameMap({ rooms, unlockedPuzzles, currentPuzzle }) {
  return (
    <div className="relative h-[400px] border border-white/10 rounded-lg bg-indigo-950/50 overflow-hidden">
      {/* Map connections */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {rooms.flatMap((room) =>
          room.connections.map((connId) => {
            const connRoom = rooms.find((r) => r.id === connId)
            return connRoom ? (
              <line
                key={`${room.id}-${connId}`}
                x1={`${room.x}%`}
                y1={`${room.y}%`}
                x2={`${connRoom.x}%`}
                y2={`${connRoom.y}%`}
                stroke={unlockedPuzzles.includes(room.id) && unlockedPuzzles.includes(connId) ? "#a855f7" : "#4b5563"}
                strokeWidth="2"
                strokeDasharray={unlockedPuzzles.includes(room.id) && unlockedPuzzles.includes(connId) ? "none" : "5,5"}
              />
            ) : null
          }),
        )}
      </svg>

      {/* Map rooms */}
      {rooms.map((room) => (
        <motion.div
          key={room.id}
          className={cn(
            "absolute w-16 h-16 rounded-full flex items-center justify-center -ml-8 -mt-8 text-xs font-medium cursor-pointer",
            currentPuzzle === room.id
              ? "bg-purple-900 border-2 border-purple-500 text-white"
              : unlockedPuzzles.includes(room.id)
                ? "bg-purple-900/50 border border-purple-500/50 text-white"
                : "bg-gray-800/50 border border-gray-700/50 text-gray-400",
          )}
          style={{ left: `${room.x}%`, top: `${room.y}%` }}
          whileHover={{ scale: 1.1 }}
          animate={
            currentPuzzle === room.id
              ? {
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(168, 85, 247, 0)",
                    "0 0 0 10px rgba(168, 85, 247, 0.3)",
                    "0 0 0 0 rgba(168, 85, 247, 0)",
                  ],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          {room.name}
        </motion.div>
      ))}

      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-xs">
        <p className="text-white/70">Mode aperçu de la carte</p>
      </div>
    </div>
  )
}

