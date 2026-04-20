"use client"

import { API_URL } from "@/config/api"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Wrench, Plus, Search, RefreshCw, Eye, Edit3, Play, CheckCircle2 } from "lucide-react"
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
  programado: "bg-slate-500/15 text-slate-700 dark:text-slate-400",
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
      if (!token) { setError("No autenticado"); setLoading(false); return }
      try {
        const res = await fetch(`${API_URL}/mantenimientos/list/`, {
          headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
        })
        if (!res.ok) throw new Error("Error cargando mantenimientos")
        const data = await res.json()
        setMaintenances(Array.isArray(data) ? data : data.results || [])
      } catch (err: any) { setError(err.message) } finally { setLoading(false) }
    }
    fetchMaintenances()
  }, [])

  const actualizarMantenimientos = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/generar-preventivos/`, {
        method: "POST",
        headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
      })
      const data = await res.json()
      alert(data.mensaje)
      window.location.reload()
    } catch (err) { alert("Error actualizando mantenimientos") }
  }

  const cambiarEstado = async (id: number, nuevoEstado: Estado) => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_URL}/mantenimientos/${id}/estado/`, {
        method: "PATCH",
        headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      })
      if (!res.ok) throw new Error()
      setMaintenances((prev) => prev.map((m) => m.id === id ? { ...m, estado: nuevoEstado } : m))
    } catch (err) { console.error("Error cambiando estado") }
  }

  const filtered = maintenances.filter((m) => {
    const matchStatus = activeFilter === "Todos" || m.estado === activeFilter
    const matchSearch = search === "" || 
      m.activo.toLowerCase().includes(search.toLowerCase()) || 
      m.responsable.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p className="text-muted-foreground font-medium animate-pulse uppercase text-[10px] tracking-widest">Cargando mantenimientos...</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* HEADER */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Mantenimientos</h1>
            <p className="text-sm text-muted-foreground">Control de servicios preventivos y correctivos</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={actualizarMantenimientos}
            className="group flex items-center gap-2 border border-border bg-card h-10 px-4 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-accent transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5 group-active:rotate-180 transition-transform duration-500" />
            Sincronizar
          </button>
          <button
            onClick={() => router.push("/mantenimientos/create")}
            className="flex items-center gap-2 bg-primary text-white h-10 px-4 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:opacity-90 shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            Programar
          </button>
        </div>
      </header>

      {/* CONTROLES: BUSCADOR Y FILTROS */}
      <div className="flex flex-col gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por activo o responsable..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {statusFilters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all",
                activeFilter === f
                  ? "bg-primary border-primary text-white shadow-sm"
                  : "bg-card border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              {f === "Todos" ? "Todos" : estadoLabels[f as Estado]}
            </button>
          ))}
        </div>
      </div>

      {/* TABLA DE REGISTROS */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Activo</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Tipo</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Estado</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Fecha de ingreso</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Fecha de finalización</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Responsable</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Costo</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((m) => (
                <tr key={m.id} className="group hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-foreground uppercase tracking-tight">{m.activo}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter", tipoStyles[m.tipo])}>
                      {m.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight", estadoStyles[m.estado])}>
                      {estadoLabels[m.estado]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[11px] text-center font-medium text-foreground/80">
                    {new Date(m.fecha_ingreso).toLocaleDateString('es-MX', {day: '2-digit', month: '2-digit', year: '2-digit'})}
                  </td>
                  <td className="px-6 py-4 text-[11px] text-center text-muted-foreground font-medium">
                    {m.fecha_finalizacion 
                      ? new Date(m.fecha_finalizacion).toLocaleDateString('es-MX', {day: '2-digit', month: '2-digit', year: '2-digit'})
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{m.responsable}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-foreground/80">
                    {m.costo ? `$${m.costo}` : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      {m.estado === "programado" && (
                        <>
                          <button 
                            onClick={() => router.push(`/mantenimientos/${m.id}/editar`)} 
                            className="p-2 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => cambiarEstado(m.id, "en_proceso")} 
                            className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-tighter hover:opacity-90"
                          >
                          Iniciar
                          </button>
                        </>
                      )}

                      {m.estado === "en_proceso" && (
                        <>
                          <button 
                            onClick={() => router.push(`/mantenimientos/${m.id}/ver`)} 
                            className="p-2 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => cambiarEstado(m.id, "completado")} 
                            className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-tighter hover:opacity-90"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Finalizar
                          </button>
                        </>
                      )}

                      {(m.estado === "completado" || m.estado === "cancelado") && (
                        <button 
                          onClick={() => router.push(`/mantenimientos/${m.id}/ver`)} 
                          className="flex items-center gap-1.5 border border-border px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-tighter hover:bg-accent transition-colors"
                        >
                          <Eye className="h-4 w-4" /> Detalles
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center gap-2 opacity-50">
            <Wrench className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-xs uppercase font-bold tracking-[0.2em] text-muted-foreground">
              Sin registros encontrados
            </p>
          </div>
        )}
      </div>
    </div>
  )
}