"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface LeaderboardEntry {
  name: string
  score: number
}

const leaderboardData: LeaderboardEntry[] = [
  { name: "Alice", score: 12500 },
  { name: "Bob", score: 11200 },
  { name: "Charlie", score: 9800 },
  { name: "David", score: 8500 },
  { name: "Eve", score: 7200 },
  { name: "Jean", score: 6800 },
  { name: "Pierre", score: 5400 },
  { name: "Marie", score: 4100 },
  { name: "Sophie", score: 3800 },
  { name: "Lucas", score: 2500 },
]

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState(leaderboardData)

  useEffect(() => {
    // Sort the leaderboard data by score in descending order
    const sortedLeaderboard = [...leaderboardData].sort((a, b) => b.score - a.score)
    setLeaderboard(sortedLeaderboard)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <main className="flex-1 overflow-auto p-6 md:p-8">
        <motion.div className="space-y-8" initial="hidden" animate="visible" variants={containerVariants}>
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Classement</h1>
              <p className="text-muted-foreground">Les meilleurs joueurs</p>
            </div>
          </motion.div>

          {/* Leaderboard Table */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Top 10</CardTitle>
                <CardDescription>Les meilleurs joueurs</CardDescription>
              </CardHeader>
              <CardContent className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Position</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{entry.name}</TableCell>
                        <TableCell>{entry.score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
