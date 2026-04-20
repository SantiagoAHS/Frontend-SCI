"use client"

import { API_URL } from "@/config/api"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useColorTheme } from "@/components/color-theme-provider"
import { UserCircle, X, CheckCircle2, AlertCircle } from "lucide-react"

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

  const router = useRouter()

  const [openPalette, setOpenPalette] = useState(false)

  const [user, setUser] = useState<any>(null)
  const [openProfile, setOpenProfile] = useState(false)
  const [openEditProfile, setOpenEditProfile] = useState(false)

  const [formData, setFormData] = useState({
    telefono: "",
    email: "",   
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
            email: data.email || "",   // nuevo
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

            {/* BACKDROP */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setOpenProfile(false)}
            />

            {/* MODAL */}
            <div className="relative bg-card border border-border p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 text-foreground">

              {/* HEADER */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">

                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <UserCircle className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold leading-tight">
                      {user?.nombre} {user?.apellido}
                    </h2>
                    <p className="text-[11px] text-primary font-bold uppercase tracking-widest mt-0.5">
                      @{user?.username}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setOpenProfile(false)}
                  className="text-muted-foreground hover:text-foreground p-1 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* INFO */}
              <div className="space-y-3 text-sm py-4 border-y border-border">

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">ID Empleado</span>
                  <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">
                    {user?.numero_empleado}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Rol</span>
                  <span className="capitalize font-medium">{user?.rol}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Teléfono</span>
                  <span className="font-medium">
                    {user?.telefono || "No registrado"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Correo</span>
                  <span className="truncate max-w-[150px]">
                    {user?.email || "No registrado"}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-muted-foreground font-medium">Estado</span>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      user?.email_verified
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }`}
                  >
                    {user?.email_verified ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}

                    {user?.email_verified ? "Verificado" : "No Verificado"}
                  </span>
                </div>

              </div>

              {/* BOTONES */}
              <div className="flex gap-2 mt-5">

                {/* CONFIG */}
                <button
                  onClick={() => {
                    setOpenProfile(false)
                    setOpenEditProfile(true)
                  }}
                  className="w-full bg-primary hover:opacity-90 text-white py-2 rounded-xl transition font-medium"
                >
                  Configuración
                </button>

                  {/* LOGOUT */}
                  <button
                    onClick={() => {

                      // borrar storage
                      localStorage.removeItem("token")
                      localStorage.removeItem("user")

                      // borrar cookie (CLAVE)
                      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"

                      // cerrar UI
                      setOpenProfile(false)
                      setUser(null)

                      // redirigir
                      router.replace("/login")
                      router.refresh() // importante para que middleware reevalúe

                    }}
                    className="w-full bg-destructive hover:opacity-90 text-white py-2 rounded-xl transition font-medium"
                  >
                    Cerrar sesión
                  </button>

              </div>

            </div>
          </div>
        )}

      {/* 🔹 MODAL EDITAR */}
        {openEditProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

            {/* BACKDROP */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setOpenEditProfile(false)}
            />

            {/* MODAL */}
            <div className="relative bg-card border border-border p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 text-foreground">

              {/* HEADER */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold">Configuración</h2>

                <button
                  onClick={() => setOpenEditProfile(false)}
                  className="text-muted-foreground hover:text-foreground p-1 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* FORM */}
              <div className="space-y-3">

                {/* EMAIL */}
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />

                {/* VERIFICAR CORREO */}
                {user?.email && !user?.email_verified && (
                  <button
                    onClick={async () => {
                      const token = localStorage.getItem("token")

                      const res = await fetch(`${API_URL}/send-verification-email/`, {
                        method: "POST",
                        headers: {
                          Authorization: `Token ${token}`,
                        },
                      })

                      if (res.ok) {
                        alert("Correo de verificación enviado 📩")
                      } else {
                        alert("Error al enviar correo")
                      }
                    }}
                    className="w-full bg-amber-500/90 hover:bg-amber-500 text-white py-2 rounded-xl text-sm transition"
                  >
                    Verificar correo
                  </button>
                )}

                {/* TELEFONO */}
                <input
                  placeholder="Teléfono"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />

                {/* PASSWORD */}
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />

              </div>

              {/* BOTONES */}
              <div className="flex gap-2 mt-6">

                {/* GUARDAR */}
                <button
                  onClick={async () => {
                    const token = localStorage.getItem("token")

                    const body: any = {
                      telefono: formData.telefono,
                      email: formData.email,
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
                        email: formData.email,
                      })
                      setOpenEditProfile(false)
                    } else {
                      alert("Error al actualizar")
                    }
                  }}
                  className="w-full bg-primary hover:opacity-90 text-white py-2 rounded-xl transition font-medium"
                >
                  Guardar
                </button>

                {/* CANCELAR */}
                <button
                  onClick={() => setOpenEditProfile(false)}
                  className="w-full border border-border hover:bg-muted py-2 rounded-xl transition font-medium"
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