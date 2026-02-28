"use client"

import { useState } from "react"
import { ArrowRightLeft, Search, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

type AssignmentStatus = "Activa" | "Pendiente devolucion" | "Vencida"
type AssignmentType = "Area" | "Persona" | "Ambos"

interface Assignment {
  id: string
  asset: string
  assetCode: string
  type: AssignmentType
  responsible: string
  area?: string
  date: string
  status: AssignmentStatus
}

const assignments: Assignment[] = [
  { id: "ASG-001", asset: "Laptop Dell XPS 15", assetCode: "COMP-001", type: "Persona", responsible: "Juan Perez", area: "Depto. TI", date: "2026-01-15", status: "Activa" },
  { id: "ASG-002", asset: 'Monitor LG 34"', assetCode: "COMP-002", type: "Ambos", responsible: "Ana Garcia", area: "Depto. Diseno", date: "2026-01-10", status: "Activa" },
  { id: "ASG-003", asset: "Ford Ranger 2024", assetCode: "VEH-001", type: "Persona", responsible: "Carlos Martinez", date: "2025-11-20", status: "Activa" },
  { id: "ASG-004", asset: "iPad Pro 12.9\"", assetCode: "COMP-003", type: "Persona", responsible: "Maria Lopez", area: "Depto. Ventas", date: "2025-12-01", status: "Pendiente devolucion" },
  { id: "ASG-005", asset: "Escritorio Ejecutivo", assetCode: "MOB-001", type: "Area", responsible: "Director General", area: "Depto. Direccion", date: "2025-08-15", status: "Activa" },
  { id: "ASG-006", asset: "Impresora HP LaserJet", assetCode: "IMP-001", type: "Area", responsible: "Piso 3", area: "Depto. Finanzas", date: "2025-06-01", status: "Vencida" },
  { id: "ASG-007", asset: "Taladro Bosch Industrial", assetCode: "HER-001", type: "Persona", responsible: "Roberto Diaz", area: "Mantenimiento", date: "2026-02-01", status: "Activa" },
  { id: "ASG-008", asset: "Toyota Hilux 2023", assetCode: "VEH-002", type: "Ambos", responsible: "Pedro Sanchez", area: "Logistica", date: "2025-09-10", status: "Pendiente devolucion" },
]

const statusStyles: Record<AssignmentStatus, string> = {
  Activa: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  "Pendiente devolucion": "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Vencida: "bg-red-500/15 text-red-700 dark:text-red-400",
}

const typeStyles: Record<AssignmentType, string> = {
  Persona: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  Area: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  Ambos: "bg-teal-500/15 text-teal-700 dark:text-teal-400",
}

const statusFilters: (AssignmentStatus | "Todos")[] = ["Todos", "Activa", "Pendiente devolucion", "Vencida"]

export default function AsignacionesPage() {
  const [activeFilter, setActiveFilter] = useState<AssignmentStatus | "Todos">("Todos")
  const [search, setSearch] = useState("")

  const filtered = assignments.filter((a) => {
    const matchStatus = activeFilter === "Todos" || a.status === activeFilter
    const matchSearch =
      search === "" ||
      a.asset.toLowerCase().includes(search.toLowerCase()) ||
      a.responsible.toLowerCase().includes(search.toLowerCase()) ||
      a.assetCode.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-balance">
              Asignaciones
            </h1>
            <p className="text-sm text-muted-foreground">
              {filtered.length} asignaciones registradas
            </p>
          </div>
        </div>
        <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Nueva Asignacion
        </button>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por activo, codigo o responsable..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Responsable</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Area</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-card-foreground">{a.asset}</span>
                      <span className="text-xs font-mono text-muted-foreground">{a.assetCode}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", typeStyles[a.type])}>
                      {a.type}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-card-foreground">{a.responsible}</td>
                  <td className="px-6 py-3 text-muted-foreground">{a.area || "-"}</td>
                  <td className="px-6 py-3 text-muted-foreground">{a.date}</td>
                  <td className="px-6 py-3">
                    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", statusStyles[a.status])}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-muted-foreground">
                    No se encontraron asignaciones con esos criterios.
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
