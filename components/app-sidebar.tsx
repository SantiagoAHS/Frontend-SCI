"use client"

import { API_URL } from "@/config/api"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
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
  LogOut,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Phone,
  Mail,
  Lock,
  UserCircle
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
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
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
  const pathname = usePathname()

  const [isAuthenticated, setIsAuthenticated] = useState(false) // 👈 Estado de autenticación
  const [openPalette, setOpenPalette] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [openProfile, setOpenProfile] = useState(false)
  const [openEditProfile, setOpenEditProfile] = useState(false)
  
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    telefono: "",
    email: "",
    password: "",
  })

  const fetchUserProfile = useCallback(async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/perfil/`, {
        headers: { Authorization: `Token ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data)
        setFormData({
          telefono: data.telefono || "",
          email: data.email || "",
          password: "",
        })
        setIsAuthenticated(true)
        return true
      }
      setIsAuthenticated(false)
      return false
    } catch (error) {
      setIsAuthenticated(false)
      return false
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetchUserProfile(token)
    } else {
      setIsAuthenticated(false)
    }
  }, [fetchUserProfile, pathname]) // Re-comprobar cuando cambie la ruta

  // 🔹 SI NO ESTÁ AUTENTICADO O ESTÁ EN LOGIN, NO RENDERIZAR NADA
  if (!isAuthenticated || pathname === "/login") {
    return null
  }

  const handleProfileClick = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    if (!user) {
      const loaded = await fetchUserProfile(token)
      if (loaded) setOpenProfile(true)
    } else {
      setOpenProfile(true)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setFormData({ ...formData, telefono: value });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsAuthenticated(false)
    window.location.href = "/login"
  }

  const colorThemes = [
    { id: "default", color: "bg-blue-500" },
    { id: "purple", color: "bg-violet-500" },
    { id: "green", color: "bg-emerald-500" },
    { id: "amber", color: "bg-amber-500" },
    { id: "rose", color: "bg-rose-500" },
  ]

  return (
    <>
      <aside className="sticky top-0 z-40 flex h-screen w-16 flex-col items-center border-r bg-card py-6 shadow-sm">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleProfileClick}
              className="mb-8 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md hover:opacity-90 transition-all"
            >
              <User className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Perfil</TooltipContent>
        </Tooltip>

        <nav className="flex flex-1 flex-col items-center gap-2">
          <NavGroup items={mainNav} />
          <div className="my-2 h-px w-8 bg-border" />
          <NavGroup items={adminNav} />

          <div className="mt-auto flex flex-col items-center gap-4 pb-2">
            <div className="relative">
              <button onClick={() => setOpenPalette(!openPalette)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Palette className="h-5 w-5" />
              </button>
              {openPalette && (
                <div className="absolute bottom-0 left-12 p-3 bg-card border rounded-xl shadow-xl z-50 flex gap-2 animate-in slide-in-from-left-2 duration-200">
                  {colorThemes.map(ct => (
                    <button
                      key={ct.id}
                      onClick={() => { setColorTheme(ct.id as any); setOpenPalette(false); }}
                      className={cn("h-6 w-6 rounded-full border-2 border-transparent hover:scale-110 transition-transform", ct.color, colorTheme === ct.id && "border-foreground/20 ring-2 ring-primary/20")}
                    />
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </aside>

      {/* MODAL PERFIL */}
      {openProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setOpenProfile(false)} />
          <div className="relative bg-card border border-border p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 text-foreground">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <UserCircle className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-tight">{user?.nombre} {user?.apellido}</h2>
                  <p className="text-[11px] text-primary font-bold uppercase tracking-widest mt-0.5">@{user?.username}</p>
                </div>
              </div>
              <button onClick={() => setOpenProfile(false)} className="text-muted-foreground hover:text-foreground p-1"><X className="h-5 w-5" /></button>
            </div>

            <div className="space-y-3 text-sm py-4 border-y border-border">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">ID Empleado</span>
                <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">{user?.numero_empleado}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Rol</span>
                <span className="capitalize font-medium">{user?.rol}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Teléfono</span>
                <span className="font-medium">{user?.telefono || "No registrado"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Correo</span>
                <span className="truncate max-w-[150px]">{user?.email || "No registrado"}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-muted-foreground font-medium">Estado</span>
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  user?.email_verified ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                )}>
                  {user?.email_verified ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                  {user?.email_verified ? "Verificado" : "No Verificado"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => { setOpenProfile(false); setOpenEditProfile(true); }} className="flex items-center justify-center gap-2 h-10 rounded-xl bg-secondary hover:bg-secondary/80 text-sm font-semibold transition-colors border border-border">
                <Settings className="h-4 w-4" /> Ajustes
              </button>
              <button onClick={handleLogout} className="flex items-center justify-center gap-2 h-10 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm font-semibold transition-colors shadow-sm">
                <LogOut className="h-4 w-4" /> Salir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIGURACIÓN */}
      {openEditProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setOpenEditProfile(false)} />
          <div className="relative bg-card border border-border p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 text-foreground">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
               <Settings className="h-5 w-5 text-primary" /> Editar Perfil
            </h2>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const token = localStorage.getItem("token");
              const body: any = { telefono: formData.telefono, email: formData.email };
              if (formData.password) body.password = formData.password;

              const res = await fetch(`${API_URL}/users/me/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
                body: JSON.stringify(body),
              });

              if (res.ok) {
                setUser({ ...user, telefono: formData.telefono, email: formData.email });
                setOpenEditProfile(false);
              } else {
                alert("Error al actualizar: Revisa los datos ingresados.");
              }
            }} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5 ml-1">
                  <Mail className="h-3 w-3" /> Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-background border border-input p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="ejemplo@correo.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5 ml-1">
                  <Phone className="h-3 w-3" /> Teléfono (10 dígitos)
                </label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={handlePhoneChange}
                  className="w-full bg-background border border-input p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono"
                  placeholder="Número a 10 dígitos"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5 ml-1">
                  <Lock className="h-3 w-3" /> Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-background border border-input p-2.5 pr-10 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground ml-1 italic">Vacío para mantener actual.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-8 pt-2">
                <button type="submit" className="h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold transition-all shadow-lg shadow-primary/20">
                  Guardar
                </button>
                <button type="button" onClick={() => setOpenEditProfile(false)} className="h-11 rounded-xl border border-input bg-background hover:bg-accent text-sm font-bold transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}