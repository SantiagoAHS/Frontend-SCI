"use client"

import { API_URL } from "@/config/api"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  MapPin, 
  ArrowLeft, 
  Save, 
  X, 
  UserPlus, 
  AlignLeft, 
  Building2, 
  ShieldAlert, 
  Loader2 
} from "lucide-react"

interface User {
  id: number
  username: string
  rol: string
}

export default function CreateAreaPage() {
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [responsable, setResponsable] = useState<number | "">("")
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      setAuthorized(false)
      return
    }
    const parsed = JSON.parse(user)
    setAuthorized(parsed.rol === "admin")
  }, [])

  const fetchUsers = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`${API_URL}/users/`, {
        headers: { Authorization: `Token ${token}` },
      })
      const data = await response.json()
      if (response.ok) setUsuarios(data)
    } catch {
      console.log("Error cargando usuarios")
    }
  }

  useEffect(() => {
    if (authorized) fetchUsers()
  }, [authorized])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_URL}/areas/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          responsable: responsable || null,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || "Error al crear área")
        setLoading(false)
        return
      }
      router.push("/ajustes/areas")
    } catch {
      setError("Error de conexión")
      setLoading(false)
    }
  }

  if (authorized === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">Verificando permisos...</p>
        </div>
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
        <p className="mt-2 text-muted-foreground max-w-xs">
          No tienes permisos para crear nuevas áreas en el sistema.
        </p>
        <button 
          onClick={() => router.back()}
          className="mt-6 text-sm font-medium hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 p-6 lg:p-8 max-w-3xl mx-auto bg-background min-h-screen">
      
      {/* Header con botón volver */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => router.push("/ajustes/areas")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a la lista
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Crear Nueva Área</h1>
            <p className="text-sm text-muted-foreground">Registra un nuevo departamento o ubicación física.</p>
          </div>
        </div>
      </div>

      {/* Formulario Estilo Card */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="grid gap-6">
            {/* Campo: Nombre */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Nombre del Área <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej. Soporte Técnico, Recursos Humanos..."
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Campo: Descripción */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <AlignLeft className="h-4 w-4 text-muted-foreground" />
                Descripción
              </label>
              <textarea
                placeholder="Breve detalle sobre la función de esta área..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            {/* Campo: Responsable */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-muted-foreground" />
                Responsable Asignado
              </label>
              <select
                value={responsable}
                onChange={(e) => setResponsable(e.target.value ? Number(e.target.value) : "")}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none cursor-pointer"
              >
                <option value="">-- Sin responsable asignado --</option>
                {usuarios.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          {/* Footer de Acciones */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => router.push("/ajustes/areas")}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              <X className="h-4 w-4" /> Cancelar
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar Área
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}