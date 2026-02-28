"use client"

import { useState } from "react"
import { Wrench, Plus, Search } from "lucide-react"
import { cn } from "@/lib/utils"

type MaintStatus = "Programado" | "En Proceso" | "Completado"
type MaintType = "Preventivo" | "Correctivo"
type Priority = "Alta" | "Media" | "Baja"

interface Maintenance {
  id: string
  asset: string
  assetCode: string
  type: MaintType
  scheduledDate: string
  completedDate?: string
  status: MaintStatus
  technician: string
  priority: Priority
  notes: string
}

const maintenances: Maintenance[] = [
  { id: "MNT-001", asset: "Ford Ranger 2024", assetCode: "VEH-001", type: "Preventivo", scheduledDate: "2026-02-20", status: "Programado", technician: "Taller Central", priority: "Media", notes: "Cambio de aceite y filtros cada 10,000 km" },
  { id: "MNT-002", asset: "iPad Pro 12.9\"", assetCode: "COMP-003", type: "Correctivo", scheduledDate: "2026-02-10", status: "En Proceso", technician: "Soporte TI", priority: "Alta", notes: "Pantalla con lineas verticales, posible falla de display" },
  { id: "MNT-003", asset: "Impresora HP LaserJet", assetCode: "IMP-001", type: "Correctivo", scheduledDate: "2026-01-28", completedDate: "2026-02-05", status: "Completado", technician: "HP Service", priority: "Alta", notes: "Reemplazo de fusor y rodillo de transferencia" },
  { id: "MNT-004", asset: "Toyota Hilux 2023", assetCode: "VEH-002", type: "Preventivo", scheduledDate: "2026-03-01", status: "Programado", technician: "Taller Central", priority: "Baja", notes: "Revision de frenos y suspension. Programado para proximo mes" },
  { id: "MNT-005", asset: "Switch Cisco 24P", assetCode: "RED-001", type: "Preventivo", scheduledDate: "2026-02-15", status: "En Proceso", technician: "Equipo de Redes", priority: "Media", notes: "Actualizacion de firmware y revision de puertos" },
  { id: "MNT-006", asset: "Laptop Dell XPS 15", assetCode: "COMP-001", type: "Preventivo", scheduledDate: "2026-01-15", completedDate: "2026-01-16", status: "Completado", technician: "Soporte TI", priority: "Baja", notes: "Limpieza interna, pasta termica y actualizacion de BIOS" },
]

const statusStyles: Record<MaintStatus, string> = {
  Programado: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  "En Proceso": "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Completado: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
}

const priorityStyles: Record<Priority, string> = {
  Alta: "bg-red-500/15 text-red-700 dark:text-red-400",
  Media: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Baja: "bg-muted text-muted-foreground",
}

const statusFilters: (MaintStatus | "Todos")[] = ["Todos", "Programado", "En Proceso", "Completado"]

export default function MantenimientosPage() {
  const [activeFilter, setActiveFilter] = useState<MaintStatus | "Todos">("Todos")
  const [search, setSearch] = useState("")

  const filtered = maintenances.filter((m) => {
    const matchStatus = activeFilter === "Todos" || m.status === activeFilter
    const matchSearch =
      search === "" ||
      m.asset.toLowerCase().includes(search.toLowerCase()) ||
      m.assetCode.toLowerCase().includes(search.toLowerCase()) ||
      m.technician.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Wrench className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-balance">
              Mantenimientos
            </h1>
            <p className="text-sm text-muted-foreground">
              {filtered.length} registros de mantenimiento
            </p>
          </div>
        </div>
        <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Programar Mantenimiento
        </button>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {([
          { label: "Programados", count: maintenances.filter(m => m.status === "Programado").length, style: "text-blue-600 dark:text-blue-400" },
          { label: "En Proceso", count: maintenances.filter(m => m.status === "En Proceso").length, style: "text-amber-600 dark:text-amber-400" },
          { label: "Completados", count: maintenances.filter(m => m.status === "Completado").length, style: "text-emerald-600 dark:text-emerald-400" },
        ] as const).map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              <span className={cn("text-2xl font-bold", s.style)}>{s.count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por activo, codigo o tecnico..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={
              activeFilter === f
                ? "inline-flex items-center rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors"
                : "inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            }
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Activo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Prioridad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Fecha Prog.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Tecnico</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-card-foreground">{m.asset}</span>
                      <span className="text-xs font-mono text-muted-foreground">{m.assetCode}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      m.type === "Preventivo" ? "bg-blue-500/15 text-blue-700 dark:text-blue-400" : "bg-orange-500/15 text-orange-700 dark:text-orange-400"
                    )}>
                      {m.type}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", priorityStyles[m.priority])}>
                      {m.priority}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{m.scheduledDate}</td>
                  <td className="px-6 py-3 text-card-foreground">{m.technician}</td>
                  <td className="px-6 py-3">
                    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", statusStyles[m.status])}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-muted-foreground">
                    No se encontraron mantenimientos con esos criterios.
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
