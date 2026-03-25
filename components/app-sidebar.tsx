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
            <TooltipContent side="right">{item.label}</TooltipContent>
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

  const [user, setUser] = useState<any>(null)
  const [openProfile, setOpenProfile] = useState(false)
  const [openEditProfile, setOpenEditProfile] = useState(false)

  const [formData, setFormData] = useState({
    telefono: "",
    password: "",
  })

  // 🔹 Detectar sesión
  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      fetch(`${API_URL}/perfil/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          setUser(data)
          setFormData({
            telefono: data.telefono || "",
            password: "",
          })
        })
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
      <aside className="sticky top-0 flex h-screen w-16 flex-col items-center border-r bg-card py-6">

        {/* PERFIL */}
        <button
          onClick={() => {
            if (user) setOpenProfile(true)
            else window.location.href = "/login"
          }}
          className="mb-8 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white"
        >
          <User className="h-5 w-5" />
        </button>

        <nav className="flex flex-1 flex-col items-center gap-2">
          <NavGroup items={mainNav} />
          <div className="my-2 h-px w-8 bg-border" />
          <NavGroup items={adminNav} />

          {/* Tema */}
          <div className="mt-4 flex flex-col items-center gap-2">

            <button onClick={() => setOpenPalette(!openPalette)}>
              <Palette />
            </button>

            {openPalette && (
              <div className="absolute bottom-14 left-16 p-3 bg-card border rounded-xl">
                <div className="flex gap-2">
                  {colorThemes.map(ct => (
                    <button
                      key={ct.id}
                      onClick={() => {
                        setColorTheme(ct.id as any)
                        setOpenPalette(false)
                      }}
                      className={cn("h-6 w-6 rounded-full", ct.color)}
                    />
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun /> : <Moon />}
            </button>

          </div>
        </nav>
      </aside>

      {/* 🔹 MODAL PERFIL */}
      {openProfile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-card p-6 rounded-xl w-80">

            <h2 className="font-semibold mb-3">Perfil</h2>

            <p><strong>Nombre:</strong> {user?.nombre}</p>
            <p><strong>Apellido:</strong> {user?.apellido}</p>
            <p><strong>No. Empleado:</strong> {user?.numero_empleado}</p>
            <p><strong>Rol:</strong> {user?.rol}</p>

            <div className="flex gap-2 mt-4">

              {/* CONFIG */}
              <button
                onClick={() => {
                  setOpenProfile(false)
                  setOpenEditProfile(true)
                }}
                className="w-full bg-blue-500 text-white py-2 rounded-lg"
              >
                Configuración
              </button>

              {/* LOGOUT */}
              <button
                onClick={() => {
                  localStorage.removeItem("token")
                  window.location.reload()
                }}
                className="w-full bg-red-500 text-white py-2 rounded-lg"
              >
                Cerrar sesión
              </button>

            </div>

            <button
              onClick={() => setOpenProfile(false)}
              className="mt-2 w-full border py-2 rounded-lg"
            >
              Cerrar
            </button>

          </div>
        </div>
      )}

      {/* 🔹 MODAL EDITAR */}
      {openEditProfile && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-card p-6 rounded-xl w-80">

            <h2 className="font-semibold mb-3">Configuración</h2>

            <input
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={(e) =>
                setFormData({ ...formData, telefono: e.target.value })
              }
              className="w-full border p-2 mb-2 rounded"
            />

            <input
              type="password"
              placeholder="Nueva contraseña"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            <div className="flex gap-2">

              <button
                onClick={async () => {
                  const token = localStorage.getItem("token")

                  const body: any = {
                    telefono: formData.telefono,
                  }

                  if (formData.password) {
                    body.password = formData.password
                  }

                  const res = await fetch(`${API_URL}/users/me/`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Token ${token}`,
                    },
                    body: JSON.stringify(body),
                  })

                  if (res.ok) {
                    setUser({
                      ...user,
                      telefono: formData.telefono,
                    })
                    setOpenEditProfile(false)
                  } else {
                    alert("Error al actualizar")
                  }
                }}
                className="w-full bg-green-500 text-white py-2 rounded"
              >
                Guardar
              </button>

              <button
                onClick={() => setOpenEditProfile(false)}
                className="w-full border py-2 rounded"
              >
                Cancelar
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  )
}