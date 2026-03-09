"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Wrench, Plus, Search } from "lucide-react"
import { cn } from "@/lib/utils"

type Estado = "programado" | "en_proceso" | "completado" | "cancelado"
type Tipo = "preventivo" | "correctivo"

interface Maintenance {
  id: number
  activo: string
  tipo: Tipo
  estado: Estado
  fecha_ingreso: string
  fecha_finalizacion?: string | null
  responsable: string
  costo?: string | null
  descripcion_problema?: string | null
}

const estadoLabels: Record<Estado, string> = {
  programado: "Programado",
  en_proceso: "En Proceso",
  completado: "Completado",
  cancelado: "Cancelado",
}

const tipoStyles: Record<Tipo, string> = {
  preventivo: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  correctivo: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
}

const estadoStyles: Record<Estado, string> = {
  programado: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  en_proceso: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  completado: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  cancelado: "bg-red-500/15 text-red-700 dark:text-red-400",
}

const statusFilters: (Estado | "Todos")[] = ["Todos", "programado", "en_proceso", "completado", "cancelado"]

export default function MantenimientosPage() {
  const router = useRouter()

  const [maintenances, setMaintenances] = useState<Maintenance[]>([])
  const [activeFilter, setActiveFilter] = useState<Estado | "Todos">("Todos")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchMaintenances = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No autenticado")
        setLoading(false)
        return
      }

      try {
        const res = await fetch("http://localhost:8000/api/mantenimientos/list/", {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error("Error cargando mantenimientos: " + text)
        }

        const data = await res.json()
        const lista = Array.isArray(data) ? data : data.results || []
        setMaintenances(lista)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMaintenances()
  }, [])

  const actualizarMantenimientos = async () => {
  const token = localStorage.getItem("token")

    if (!token) {
      alert("No autenticado")
      return
    }

    try {
      const res = await fetch("http://localhost:8000/api/generar-preventivos/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text)
      }

      const data = await res.json()

      alert(data.mensaje)

      // volver a cargar mantenimientos
      window.location.reload()

    } catch (err) {
      console.error(err)
      alert("Error actualizando mantenimientos")
    }
  }

  const cambiarEstado = async (id: number, nuevoEstado: Estado) => {
  const token = localStorage.getItem("token")

    try {
      const res = await fetch(`http://localhost:8000/api/mantenimientos/${id}/estado/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: nuevoEstado,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text)
      }

      // refrescar lista
      setMaintenances((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, estado: nuevoEstado } : m
        )
      )
    } catch (err) {
      console.error("Error cambiando estado", err)
    }
  }

  const filtered = maintenances.filter((m) => {
    const matchStatus = activeFilter === "Todos" || m.estado === activeFilter
    const matchSearch =
      search === "" ||
      m.activo.toLowerCase().includes(search.toLowerCase()) ||
      m.responsable.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  if (loading) return <div className="p-8 text-sm text-muted-foreground">Cargando mantenimientos...</div>
  if (error) return <div className="p-8 text-sm text-red-500">{error}</div>

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Wrench className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-balance">Mantenimientos</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} registros de mantenimiento</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/mantenimientos/create")}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Programar mantenimiento
          </button>

          <button
            onClick={actualizarMantenimientos}
            className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm hover:bg-accent"
          >
            Actualizar mantenimientos
          </button>
        </div>
      </header>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
              activeFilter === f
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {f === "Todos" ? "Todos" : estadoLabels[f as Estado]}
          </button>
        ))}
      </div>

      {/* Buscador */}
      <div className="relative mt-2">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por activo o responsable..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Activo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Fecha ingreso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Fecha finalización</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Responsable</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Costo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-6 py-3">{m.activo}</td>
                  <td className="px-6 py-3">
                    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", tipoStyles[m.tipo])}>
                      {m.tipo.charAt(0).toUpperCase() + m.tipo.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", estadoStyles[m.estado])}>
                      {estadoLabels[m.estado]}
                    </span>
                  </td>
                  <td className="px-6 py-3">{m.fecha_ingreso}</td>
                  <td className="px-6 py-3">{m.fecha_finalizacion || "-"}</td>
                  <td className="px-6 py-3">{m.responsable}</td>
                  <td className="px-6 py-3">{m.costo ? `$${m.costo}` : "-"}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">

                      {m.estado === "programado" && (
                        <>
                          <button
                            onClick={() => router.push(`/mantenimientos/${m.id}/editar`)}
                            className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:opacity-90"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => cambiarEstado(m.id, "en_proceso")}
                            className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:opacity-90"
                          >
                            Iniciar
                          </button>
                        </>
                      )}

                      {m.estado === "en_proceso" && (
                        <>
                          <button
                            onClick={() => router.push(`/mantenimientos/${m.id}/ver`)}
                            className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:opacity-90"
                          >
                            Ver
                          </button>

                          <button
                            onClick={() => cambiarEstado(m.id, "completado")}
                            className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:opacity-90"
                          >
                            Finalizar
                          </button>
                        </>
                      )}

                      {(m.estado === "completado" || m.estado === "cancelado") && (
                        <button
                          onClick={() => router.push(`/mantenimientos/${m.id}/ver`)}
                          className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:opacity-90"
                        >
                          Ver
                        </button>
                      )}

                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-sm text-muted-foreground">
                    No se encontraron mantenimientos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}