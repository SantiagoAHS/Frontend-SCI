"use client"

import { API_URL } from "@/config/api"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { 
  UserCog, 
  ArrowLeft, 
  ShieldAlert, 
  Loader2, 
  User, 
  BadgeCheck, 
  Briefcase, 
  Hash,
  AlertCircle,
  Save,
  ChevronDown
} from "lucide-react"

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  const [formData, setFormData] = useState({
    username: "",
    numero_empleado: "",
    rol: "",
    cargo: "",
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (!storedUser) {
      setAuthorized(false)
      setLoading(false)
      return
    }

    const parsedUser = JSON.parse(storedUser)

    if (parsedUser.rol === "admin") {
      setAuthorized(true)
      fetchUser()
    } else {
      setAuthorized(false)
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`${API_URL}/users/`, {
        headers: { Authorization: `Token ${token}` },
      })

      const data = await response.json()
      const user = data.find((u: any) => u.id == id)

      if (!user) {
        setError("Usuario no encontrado")
        return
      }

      setFormData({
        username: user.username,
        numero_empleado: user.numero_empleado,
        rol: user.rol,
        cargo: user.cargo || "",
      })
    } catch {
      setError("Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    const token = localStorage.getItem("token")

    try {
      const response = await fetch(`${API_URL}/users/${id}/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al actualizar usuario")
        setSaving(false)
        return
      }

      router.push("/ajustes/usuarios")
    } catch {
      setError("Error de conexión")
      setSaving(false)
    }
  }

  if (loading) {
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
        <p className="mt-2 text-muted-foreground">No tienes permisos para editar usuarios.</p>
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
          <ArrowLeft className="h-4 w-4" /> Cancelar y volver
        </button>
        <div className="flex items-center gap-3 mt-2 tracking-tight">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
            <UserCog className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Editar usuario</h1>
            <p className="text-sm text-muted-foreground">Modifica la información del usuario #{id}.</p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="rounded-xl border border-border bg-card shadow-sm p-6 lg:p-8 animate-in fade-in duration-300">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Usuario */}
            <div className="space-y-2 group focus-within:text-primary transition-colors">
              <label className="text-sm font-semibold flex items-center gap-2 text-foreground/80 group-focus-within:text-primary">
                <User className="h-3.5 w-3.5" /> Nombre de usuario
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                required
              />
            </div>

            {/* Número de Empleado */}
            <div className="space-y-2 group focus-within:text-primary transition-colors">
              <label className="text-sm font-semibold flex items-center gap-2 text-foreground/80 group-focus-within:text-primary">
                <Hash className="h-3.5 w-3.5" /> Número de empleado
              </label>
              <input
                type="text"
                name="numero_empleado"
                value={formData.numero_empleado}
                onChange={handleChange}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Cargo */}
            <div className="space-y-2 group focus-within:text-primary transition-colors">
              <label className="text-sm font-semibold flex items-center gap-2 text-foreground/80 group-focus-within:text-primary">
                <Briefcase className="h-3.5 w-3.5" /> Cargo
              </label>
              <input
                type="text"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                placeholder="Ej: Gerente de planta"
              />
            </div>

            {/* Rol con flecha custom */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                <BadgeCheck className="h-3.5 w-3.5 text-primary" /> Rol asignado
              </label>
              <div className="relative group">
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-lg border border-input bg-background pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
                >
                  <option value="admin">Administrador</option>
                  <option value="operador">Operador</option>
                  <option value="auditor">Auditor</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground group-focus-within:text-primary">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-3 border-t border-border">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}