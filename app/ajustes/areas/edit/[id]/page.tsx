"use client"

import { API_URL } from "@/config/api"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  MapPin, 
  ArrowLeft, 
  Save, 
  X, 
  UserPlus, 
  AlignLeft, 
  Edit3, 
  ShieldAlert, 
  Loader2,
  ChevronDown 
} from "lucide-react"

interface User {
  id: number
  username: string
  rol: string
}

export default function EditAreaPage() {
  const router = useRouter()
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [responsable, setResponsable] = useState<number | "">("")
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true) // Carga inicial de datos
  const [saving, setSaving] = useState(false) // Estado al guardar
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  // 1. Verificar rol admin
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      setAuthorized(false)
      return
    }
    const parsed = JSON.parse(user)
    setAuthorized(parsed.rol === "admin")
  }, [])

  // 2. Cargar datos del área y lista de usuarios
  useEffect(() => {
    if (!authorized || !id) return

    const fetchData = async () => {
      const token = localStorage.getItem("token")
      setLoading(true)
      try {
        // Obtener datos del área
        const areaRes = await fetch(`${API_URL}/areas/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        })
        if (!areaRes.ok) throw new Error("No se pudo cargar la información del área")
        const areaData = await areaRes.json()
        
        setNombre(areaData.nombre)
        setDescripcion(areaData.descripcion || "")
        setResponsable(areaData.responsable || "")

        // Obtener lista de usuarios para el responsable
        const usersRes = await fetch(`${API_URL}/users/`, {
          headers: { Authorization: `Token ${token}` },
        })
        const usersData = await usersRes.json()
        if (usersRes.ok) setUsuarios(usersData)

      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [authorized, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    setSaving(true)
    setError("")

    try {
      const response = await fetch(`${API_URL}/areas/${id}/`, {
        method: "PUT",
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

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Error al actualizar el área")
        setSaving(false)
        return
      }
      router.push("/ajustes/areas")
    } catch {
      setError("Error de conexión con el servidor")
      setSaving(false)
    }
  }

  if (authorized === null || (loading && !error)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">Cargando información...</p>
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
          No tienes permisos para editar esta área.
        </p>
        <button 
          onClick={() => router.push("/ajustes/areas")}
          className="mt-6 text-sm font-medium hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a la lista
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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/20">
            <Edit3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Editar Área</h1>
            <p className="text-sm text-muted-foreground">Actualiza los datos del departamento o ubicación física.</p>
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
                placeholder="Ej. Soporte Técnico..."
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
              />
            </div>

            {/* Campo: Descripción */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <AlignLeft className="h-4 w-4 text-muted-foreground" />
                Descripción
              </label>
              <textarea
                placeholder="Detalles sobre el área..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none transition-all"
              />
            </div>

            {/* Campo: Responsable (Personalizado) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-muted-foreground" />
                Responsable Asignado
              </label>
              <div className="relative group">
                <select
                  value={responsable}
                  onChange={(e) => setResponsable(e.target.value ? Number(e.target.value) : "")}
                  className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer pr-10 transition-all"
                >
                  <option value="">-- Sin responsable asignado --</option>
                  {usuarios.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
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
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}