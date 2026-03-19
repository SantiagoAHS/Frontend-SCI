"use client"

import { API_URL } from "@/config/api"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
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

  // NUEVO: estado de usuario
  const [user, setUser] = useState<any>(null)
  const [openProfile, setOpenProfile] = useState(false)

  // Detectar sesión
  useEffect(() => {

    const token = localStorage.getItem("token")

    if (token) {
      fetch(`${API_URL}/perfil/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(() => {
          localStorage.removeItem("token")
        })
    }

  }, [])

  const colorThemes = [
    { id: "default", color: "bg-blue-500" },
    { id: "purple", color: "bg-violet-500" },
    { id: "green", color: "bg-emerald-500" },
    { id: "amber", color: "bg-amber-500" },
    { id: "rose", color: "bg-rose-500" },
  ]

  return (
    <>
      <aside className="sticky top-0 flex h-screen w-16 flex-col items-center border-r border-border bg-card py-6">

        {/* BOTÓN PERFIL */}
        <button
          onClick={() => {
            if (user) {
              setOpenProfile(true)
            } else {
              window.location.href = "/login"
            }
          }}
          className="mb-8 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          <User className="h-5 w-5" />
        </button>

        <nav className="flex flex-1 flex-col items-center gap-2">

          <NavGroup items={mainNav} />

          <div className="my-2 h-px w-8 bg-border" />

          <NavGroup items={adminNav} />

          {/* Apariencia */}
          <div className="relative mt-4 flex flex-col items-center gap-2">

            {/* Palette */}
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

            {/* Dark mode */}
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

      {/* MODAL PERFIL */}
      {openProfile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-card rounded-xl p-6 w-80 shadow-lg flex flex-col gap-4">

            <h2 className="text-lg font-semibold">Perfil</h2>

            <div className="text-sm space-y-1">
              <p><strong>Nombre:</strong> {user?.nombre}</p>
              <p><strong>Apellido:</strong> {user?.apellido}</p>
              <p><strong>No. Empleado:</strong> {user?.numero_empleado}</p>
              <p><strong>Rol:</strong> {user?.rol}</p>
            </div>

            <div className="flex gap-2 mt-2">

              {/* Logout */}
              <button
                onClick={() => {
                  localStorage.removeItem("token")
                  window.location.reload()
                }}
                className="w-full rounded-lg bg-red-500 text-white py-2 text-sm hover:bg-red-600"
              >
                Cerrar sesión
              </button>

              {/* Close */}
              <button
                onClick={() => setOpenProfile(false)}
                className="w-full rounded-lg border py-2 text-sm hover:bg-accent"
              >
                Cerrar
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  )
}