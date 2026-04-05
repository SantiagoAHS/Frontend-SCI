"use client"

import { API_URL } from "@/config/api"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  MapPin, 
  Plus, 
  Search, 
  Trash2, 
  User, 
  Edit2, 
  ArrowLeft, 
  Loader2, 
  X,
  AlignLeft,
  AlertCircle
} from "lucide-react"

interface ResponsableDetalle {
  id: number
  username: string
  numero_empleado: string
  telefono: string
}

interface Area {
  id: number
  nombre: string
  descripcion: string | null
  responsable: number | null
  responsable_detalle: ResponsableDetalle | null
  activo: boolean
}

export default function AreasPage() {
  const router = useRouter()
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  // Estados para el Modal de Eliminación
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [areaToDelete, setAreaToDelete] = useState<Area | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      setAuthorized(false)
      return
    }
    const parsed = JSON.parse(user)
    setAuthorized(parsed.rol === "admin")
  }, [])

  const fetchAreas = async () => {
    const token = localStorage.getItem("token")
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/areas/list/?activas=false`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) throw new Error("Error al cargar las áreas")
      const data = await response.json()
      setAreas(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authorized) fetchAreas()
  }, [authorized])

  const filteredAreas = areas.filter((a) =>
    a.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (a.responsable_detalle?.username.toLowerCase().includes(search.toLowerCase()) ?? false)
  )

  // Abrir modal
  const openDeleteModal = (area: Area) => {
    setAreaToDelete(area)
    setIsModalOpen(true)
  }

  // Ejecutar eliminación/desactivación real
  const confirmDelete = async () => {
    if (!areaToDelete) return
    const token = localStorage.getItem("token")
    setIsDeleting(true)

    try {
      const response = await fetch(`${API_URL}/areas/${areaToDelete.id}/delete/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      })
      if (!response.ok) throw new Error("Error al desactivar")
      
      setAreas((prev) => prev.map(a => a.id === areaToDelete.id ? { ...a, activo: false } : a))
      setIsModalOpen(false)
      setAreaToDelete(null)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  if (authorized === null) return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="relative flex flex-col gap-8 p-6 lg:p-8 max-w-7xl mx-auto bg-background min-h-screen text-foreground font-sans">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between tracking-tight">
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => router.push("/ajustes")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a Ajustes
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Gestión de Áreas</h1>
              <p className="text-sm text-muted-foreground">Ubicaciones y departamentos de la institución.</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push("/ajustes/areas/create")}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Nueva Área
        </button>
      </div>

      {/* Buscador */}
      <div className="relative group max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Buscar áreas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-input bg-card pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
            <p className="text-sm font-medium">Cargando áreas...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 font-semibold text-muted-foreground w-20">ID</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Nombre</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Descripción</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Responsable</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Estado</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAreas.length > 0 ? (
                  filteredAreas.map((area) => (
                    <tr key={area.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">#{area.id}</td>
                      <td className="px-6 py-4 font-semibold text-foreground">{area.nombre}</td>
                      <td className="px-6 py-4 text-muted-foreground max-w-[250px]">
                        <div className="flex items-center gap-2">
                          <AlignLeft className="h-3.5 w-3.5 opacity-50 shrink-0" />
                          <span className="truncate" title={area.descripcion || ""}>
                            {area.descripcion || "Sin descripción"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                          <span>{area.responsable_detalle?.username || "No asignado"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          area.activo 
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                            : "bg-destructive/10 text-destructive"
                        }`}>
                          {area.activo ? "Activa" : "Inactiva"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => router.push(`/ajustes/areas/edit/${area.id}`)} className="p-2 rounded-lg border border-input bg-background hover:bg-accent hover:text-primary transition-all shadow-sm">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          {area.activo && (
                            <button onClick={() => openDeleteModal(area)} className="p-2 rounded-lg border border-input bg-background hover:bg-destructive/10 hover:text-destructive transition-all shadow-sm">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">No hay resultados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODAL DE CONFIRMACIÓN ESTILIZADO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
            onClick={() => !isDeleting && setIsModalOpen(false)} 
          />
          
          <div className="relative w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive shadow-inner">
                <AlertCircle size={30} />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight">¿Desactivar esta área?</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Estás a punto de marcar <span className="font-bold text-foreground">"{areaToDelete?.nombre}"</span> como inactiva. 
                  Los activos asociados podrían verse afectados.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isDeleting}
                  className="h-11 rounded-xl border border-input bg-background font-medium hover:bg-accent transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="h-11 rounded-xl bg-destructive text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm shadow-destructive/20"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                  {isDeleting ? "Desactivando..." : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}