"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Biohazard, Book, BookOpen, Calendar, Gamepad2, Globe, LayoutDashboard, LogOut, Moon, Settings, Sun, Users } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useEffect, useState } from "react"

interface SidebarProps {
  activePage?: "dashboard" | "games" | "progress" | "calendar" | "settings" | "admin" | "content" | "world" | "students" | "biosim" | "historical"
  userType?: "student" | "admin"
  userName?: string
  userLevel?: number
  userAvatar?: string
}

export function Sidebar({
  activePage = "dashboard",
  userType = "student",
  userName = "Jean Dupont",
  userLevel = 8,
  userAvatar = "/placeholder.svg",
}: SidebarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Nécessaire car le thème est déterminé côté client
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <aside className="hidden w-64 flex-col border-r bg-background p-6 md:flex">
      <div className="flex items-center gap-2 pb-6">
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">EduPlay Studio</span>
      </div>

      <nav className="flex-1 space-y-2">
        {userType === "student" && (
          <>
            <Button
              variant={activePage === "dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/dashboard">
                <LayoutDashboard className="h-5 w-5" />
                Tableau de bord
              </Link>
            </Button>
            <Button
              variant={activePage === "games" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/games">
                <Gamepad2 className="h-5 w-5" />
                Jeux
              </Link>
            </Button>
            <Button
              variant={activePage === "world" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/games/world-explorer">
                <Globe className="h-5 w-5" />
                World Explorer
              </Link>
            </Button>
            <Button
              variant={activePage === "biosim" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/games/biosim">
                <Biohazard className="h-5 w-5" />
                BioSim
              </Link>
            </Button>
            <Button
              variant={activePage === "historical" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/games/historical-dialogues">
                <Book className="h-5 w-5" />
                Historical
              </Link>
            </Button>
            <Button
              variant={activePage === "settings" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/settings">
                <Settings className="h-5 w-5" />
                Paramètres
              </Link>
            </Button>
          </>
        )}

        {userType === "admin" && (
          <>
            <Button
              variant={activePage === "admin" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/admin">
                <LayoutDashboard className="h-5 w-5" />
                Tableau de bord
              </Link>
            </Button>
            <Button
              variant={activePage === "content" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/admin/content">
                <FileText className="h-5 w-5" />
                Contenus
              </Link>
            </Button>
            <Button
              variant={activePage === "games" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/admin/games">
                <Gamepad2 className="h-5 w-5" />
                Jeux
              </Link>
            </Button>
            <Button
              variant={activePage === "students" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/admin/students">
                <Users className="h-5 w-5" />
                Apprenants
              </Link>
            </Button>
            <Button
              variant={activePage === "calendar" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/admin/calendar">
                <Calendar className="h-5 w-5" />
                Calendrier
              </Link>
            </Button>
            <Button
              variant={activePage === "settings" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/admin/settings">
                <Settings className="h-5 w-5" />
                Paramètres
              </Link>
            </Button>
          </>
        )}
      </nav>

      <div className="border-t pt-6">
        <div className="flex items-center gap-4 pb-4">
          <Avatar>
            <AvatarImage src={userAvatar} alt="Avatar" />
            <AvatarFallback>
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">
              {userType === "student" ? `Niveau ${userLevel}` : "Administrateur"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {/* Bouton de thème */}
          <Button variant="outline" className="w-full justify-start gap-2" onClick={toggleTheme}>
            {mounted && theme === "dark" ? (
              <>
                <Sun className="h-5 w-5" />
                Mode clair
              </>
            ) : (
              <>
                <Moon className="h-5 w-5" />
                Mode sombre
              </>
            )}
          </Button>

          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-5 w-5" />
            Déconnexion
          </Button>
        </div>
      </div>
    </aside>
  )
}

function FileText(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  )
}


