"use client"

import { API_URL } from "@/config/api"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { 
  ArrowRightLeft, 
  Search, 
  Plus, 
  Bell, 
  User, 
  Package, 
  CheckCircle2 
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Prestamo {
  id: number
  activo: number
  activo_nombre: string
  responsable_nombre: string
  tipo_prestamo: string
  estado: string
  estado_calculado: string
  fecha_inicio: string
  fecha_fin: string
}

const statusStyles: Record<string, string> = {
  activo: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  finalizado: "bg-slate-500/15 text-slate-700 dark:text-slate-400",
  vencido: "bg-red-500/15 text-red-700 dark:text-red-400",
  cancelado: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
}

const statusFilters = ["Todos", "activo", "finalizado", "vencido", "cancelado"]

export default function AsignacionesPage() {
  const router = useRouter()

  // Definición de todos los estados 
  const [prestamos, setPrestamos] = useState<Prestamo[]>([])
  const [notificaciones, setNotificaciones] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>("Todos")
  const [search, setSearch] = useState("")

  // Carga de datos inicial
  useEffect(() => {
    const fetchPrestamos = async () => {
      const token = localStorage.getItem("token")
      if (!token) { setError("No autenticado"); setLoading(false); return }
      try {
        const res = await fetch(`${API_URL}/prestamos/list/`, {
          headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
        })
        if (!res.ok) throw new Error("Error cargando préstamos")
        const data = await res.json()
        setPrestamos(data.results || data)
      } catch (err: any) { setError(err.message) } finally { setLoading(false) }
    }

    const fetchNotificaciones = async () => {
      const token = localStorage.getItem("token")
      if (!token) return
      try {
        const res = await fetch(`${API_URL}/prestamos/notificaciones/`, {
          headers: { Authorization: `Token ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        setNotificaciones((data.prestamos_por_vencer?.length || 0) + (data.prestamos_vencidos?.length || 0))
      } catch (err) { console.error(err) }
    }

    fetchPrestamos()
    fetchNotificaciones()
  }, [])

  const finalizarPrestamo = async (id: number) => {
    const token = localStorage.getItem("token")
    if (!token) return
    if (!confirm("¿Deseas finalizar este préstamo?")) return
    try {
      const res = await fetch(`${API_URL}/prestamos/${id}/finalizar/`, {
        method: "PATCH",
        headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error("No se pudo finalizar")
      setPrestamos((prev) => prev.map((p) => p.id === id ? { ...p, estado: "finalizado", estado_calculado: "finalizado" } : p))
    } catch (err: any) { alert(err.message) }
  }

  const filtered = prestamos.filter((a) => {
    const matchStatus = activeFilter === "Todos" || a.estado_calculado === activeFilter
    const matchSearch = search === "" || 
      a.activo_nombre?.toLowerCase().includes(search.toLowerCase()) || 
      a.responsable_nombre?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  if (loading) return <div className="p-10 text-center text-muted-foreground animate-pulse">Cargando préstamos...</div>
  if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Préstamos</h1>
            <p className="text-sm text-muted-foreground">Gestión de asignaciones de activos</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/asignaciones/notificaciones")}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card hover:bg-accent transition-colors"
          >
            <Bell className="h-4 w-4 text-muted-foreground" />
            {notificaciones > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-red-600 text-[10px] font-bold text-white rounded-full">
                {notificaciones}
              </span>
            )}
          </button>

          <button
            onClick={() => router.push("/asignaciones/create")}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Nuevo Préstamo
          </button>
        </div>
      </header>

      {/* Buscador y Filtros */}
      <div className="flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar activo o responsable..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {statusFilters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all",
                activeFilter === f
                  ? "bg-primary border-primary text-white shadow-sm"
                  : "bg-card border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center w-16">ID</th>
                <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Nombre del Activo</th>
                <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Responsable</th>
                <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Estado</th>
                <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Fecha de inicio</th>
                <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Fecha de vencimiento</th>
                <th className="px-6 py-3 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-muted-foreground italic text-xs">
                    No se encontraron préstamos.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 text-center font-mono text-[11px] text-muted-foreground/70 border-r border-border/50">
                      #{p.id}
                    </td>

                    <td className="px-6 py-4 font-bold text-foreground uppercase tracking-tight">
                      <div className="flex items-center gap-2">
                        <Package className="h-3.5 w-3.5 text-primary/60" />
                        {p.activo_nombre}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-3.5 w-3.5 opacity-50" />
                        <span className="font-medium text-foreground/80">{p.responsable_nombre}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-tight",
                        statusStyles[p.estado_calculado] || "bg-gray-500/15"
                      )}>
                        {p.estado_calculado}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-muted-foreground font-medium text-center">
                      {new Date(p.fecha_inicio).toLocaleDateString('es-MX', {day: '2-digit', month: '2-digit', year: '2-digit'})}
                    </td>

                    <td className={cn(
                      "px-6 py-4 text-xs font-bold text-center",
                      p.estado_calculado === 'vencido' ? "text-red-500" : "text-muted-foreground"
                    )}>
                      {new Date(p.fecha_fin).toLocaleDateString('es-MX', {day: '2-digit', month: '2-digit', year: '2-digit'})}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {(p.estado_calculado === "activo" || p.estado_calculado === "vencido") ? (
                        <button
                          onClick={() => finalizarPrestamo(p.id)}
                          className="inline-flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-md text-[10px] font-bold hover:opacity-90 transition-opacity uppercase tracking-tighter"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Finalizar
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground/30 font-mono tracking-widest">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}