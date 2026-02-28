"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useTheme } from "next-themes"
import { useColorTheme } from "@/components/color-theme-provider"

import {
  LayoutDashboard,
  Package,
  ArrowRightLeft,
  Wrench,
  ClipboardCheck,
  FileBarChart,
  Settings,
  User,
  Palette,
  Sun,
  Moon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const mainNav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/activos", label: "Activos", icon: Package },
  { href: "/asignaciones", label: "Asignaciones", icon: ArrowRightLeft },
  { href: "/mantenimientos", label: "Mantenimientos", icon: Wrench },
  { href: "/auditorias", label: "Auditorias", icon: ClipboardCheck },
  { href: "/reportes", label: "Reportes", icon: FileBarChart },
]

const adminNav = [
  { href: "/ajustes", label: "Ajustes", icon: Settings },
]

function NavGroup({ items }: { items: typeof mainNav }) {
  const pathname = usePathname()

  return (
    <>
      {items.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2 font-medium">
              {item.label}
            </TooltipContent>
          </Tooltip>
        )
      })}
    </>
  )
}

export function AppSidebar() {
  const { theme, setTheme } = useTheme()
  const { colorTheme, setColorTheme } = useColorTheme()
  const [openPalette, setOpenPalette] = useState(false)

  const colorThemes = [
    { id: "default", color: "bg-blue-500" },
    { id: "purple", color: "bg-violet-500" },
    { id: "green", color: "bg-emerald-500" },
    { id: "amber", color: "bg-amber-500" },
    { id: "rose", color: "bg-rose-500" },
  ]

  return (
    <aside className="sticky top-0 flex h-screen w-16 flex-col items-center border-r border-border bg-card py-6">

      {/* Perfil */}
      <Link
        href="/login"
        className="mb-8 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
      >
        <User className="h-5 w-5" />
      </Link>

      <nav className="flex flex-1 flex-col items-center gap-2">

        <NavGroup items={mainNav} />

        <div className="my-2 h-px w-8 bg-border" />

        <NavGroup items={adminNav} />

        {/* Apariencia */}
        <div className="relative mt-4 flex flex-col items-center gap-2">

          {/* Palette Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setOpenPalette(!openPalette)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition"
              >
                <Palette className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Color de acento</TooltipContent>
          </Tooltip>

          {/* Dropdown de colores */}
          {openPalette && (
            <div className="absolute bottom-14 left-16 w-44 rounded-xl border border-border bg-card shadow-lg p-3">
              <div className="flex flex-wrap justify-center gap-3">
                {colorThemes.map((ct) => (
                  <button
                    key={ct.id}
                    onClick={() => {
                      setColorTheme(ct.id as any)
                      setOpenPalette(false)
                    }}
                    className="group flex flex-col items-center gap-1"
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full transition-all",
                        ct.color,
                        colorTheme === ct.id
                          ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                          : "hover:scale-105"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dark / Light Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {theme === "dark" ? "Modo claro" : "Modo oscuro"}
            </TooltipContent>
          </Tooltip>

        </div>
      </nav>
    </aside>
  )
}