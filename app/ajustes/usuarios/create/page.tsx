"use client"

import { API_URL } from "@/config/api"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  UserPlus, 
  ArrowLeft, 
  ShieldAlert, 
  Loader2, 
  User, 
  Lock, 
  BadgeCheck, 
  Briefcase, 
  Hash,
  AlertCircle,
  Eye,      // Agregado
  EyeOff    // Agregado
} from "lucide-react"

export default function CreateUserPage() {
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [numeroEmpleado, setNumeroEmpleado] = useState("")
  const [password, setPassword] = useState("")
  const [rol, setRol] = useState("operador")
  const [cargo, setCargo] = useState("")
  
  // Estado para la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false)

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      setAuthorized(false)
      return
    }
    const parsedUser = JSON.parse(user)
    setAuthorized(parsedUser.rol === "admin")
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const token = localStorage.getItem("token")

    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({
          username,
          numero_empleado: numeroEmpleado,
          password,
          rol,
          cargo,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Si data es un objeto de errores de Django, los extraemos
        const errorMsg = typeof data === 'object' 
          ? Object.entries(data).map(([field, msgs]) => `${field}: ${msgs}`).join(", ")
          : data.detail || data.error || "Error al crear el usuario";

        setError(errorMsg)
        setLoading(false)
        console.log("Error detallado del backend:", data) // Revisa la consola del navegador (F12)
        return
      }

      router.push("/ajustes/usuarios")
    } catch {
      setError("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  if (authorized === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-6 text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-4 text-destructive">
          <ShieldAlert className="h-12 w-12" />
        </div>
        <h1 className="text-2xl font-bold">Acceso Denegado</h1>
        <p className="mt-2 text-muted-foreground">Solo administradores pueden crear usuarios.</p>
        <button onClick={() => router.push("/ajustes/usuarios")} className="mt-6 text-sm font-medium text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Volver a la lista
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 p-6 lg:p-8 max-w-2xl mx-auto bg-background min-h-screen text-foreground font-sans">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => router.push("/ajustes/usuarios")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a usuarios
        </button>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Nuevo usuario</h1>
            <p className="text-sm text-muted-foreground">Registra un nuevo integrante en el sistema.</p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="rounded-xl border border-border bg-card shadow-sm p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in zoom-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Usuario */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" /> Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Nombre de usuario"
                required
              />
            </div>

            {/* Número de Empleado */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 text-muted-foreground" /> Número de empleado
              </label>
              <input
                type="text"
                value={numeroEmpleado}
                onChange={(e) => setNumeroEmpleado(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Ej: 001"
                required
              />
            </div>
          </div>

          {/* Contraseña con Botón de Ojo */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" /> Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rol */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <BadgeCheck className="h-3.5 w-3.5 text-muted-foreground" /> Rol
              </label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
              >
                <option value="admin">Administrador</option>
                <option value="operador">Operador</option>
                <option value="auditor">Auditor</option>
              </select>
            </div>

            {/* Cargo */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" /> Cargo
              </label>
              <input
                type="text"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Ej: Jefe de inventario"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/ajustes/usuarios")}
              className="flex-1 h-11 rounded-lg border border-input bg-background text-sm font-medium hover:bg-accent transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear usuario"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}