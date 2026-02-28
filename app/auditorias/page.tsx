"use client"

import { ClipboardCheck, QrCode, CheckCircle2, Clock, XCircle, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

type VerificationStatus = "Verificado" | "Pendiente" | "No encontrado"

interface AuditItem {
  asset: string
  code: string
  area: string
  status: VerificationStatus
}

interface Audit {
  id: string
  name: string
  date: string
  auditor: string
  totalAssets: number
  verified: number
  pending: number
  notFound: number
  status: "En Curso" | "Completada" | "Programada"
  items: AuditItem[]
}

const audits: Audit[] = [
  {
    id: "AUD-001",
    name: "Auditoria General Q1 2026",
    date: "2026-02-10",
    auditor: "Ricardo Gomez",
    totalAssets: 248,
    verified: 198,
    pending: 42,
    notFound: 8,
    status: "En Curso",
    items: [
      { asset: "Laptop Dell XPS 15", code: "COMP-001", area: "Depto. TI", status: "Verificado" },
      { asset: 'Monitor LG 34"', code: "COMP-002", area: "Depto. Diseno", status: "Verificado" },
      { asset: "Ford Ranger 2024", code: "VEH-001", area: "Operaciones", status: "Verificado" },
      { asset: "iPad Pro 12.9\"", code: "COMP-003", area: "Depto. Ventas", status: "Pendiente" },
      { asset: "Switch Cisco 24P", code: "RED-001", area: "Depto. TI", status: "Pendiente" },
      { asset: "Silla Ergonomica #12", code: "MOB-008", area: "Depto. RH", status: "No encontrado" },
      { asset: "Impresora Xerox B210", code: "IMP-003", area: "Almacen", status: "No encontrado" },
    ],
  },
  {
    id: "AUD-002",
    name: "Auditoria Vehicular",
    date: "2026-01-15",
    auditor: "Laura Torres",
    totalAssets: 24,
    verified: 24,
    pending: 0,
    notFound: 0,
    status: "Completada",
    items: [
      { asset: "Ford Ranger 2024", code: "VEH-001", area: "Operaciones", status: "Verificado" },
      { asset: "Toyota Hilux 2023", code: "VEH-002", area: "Logistica", status: "Verificado" },
    ],
  },
  {
    id: "AUD-003",
    name: "Auditoria TI Q2 2026",
    date: "2026-04-01",
    auditor: "Por asignar",
    totalAssets: 148,
    verified: 0,
    pending: 148,
    notFound: 0,
    status: "Programada",
    items: [],
  },
]

const auditStatusStyles: Record<Audit["status"], string> = {
  "En Curso": "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Completada: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Programada: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
}

const verificationStyles: Record<VerificationStatus, { bg: string; icon: typeof CheckCircle2 }> = {
  Verificado: { bg: "text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
  Pendiente: { bg: "text-amber-600 dark:text-amber-400", icon: Clock },
  "No encontrado": { bg: "text-red-600 dark:text-red-400", icon: XCircle },
}

export default function AuditoriasPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ClipboardCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-balance">
              Auditorias
            </h1>
            <p className="text-sm text-muted-foreground">
              Control y verificacion fisica de activos
            </p>
          </div>
        </div>
        <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Nueva Auditoria
        </button>
      </header>

      {/* QR Info Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-primary/5 p-4">
        <QrCode className="h-8 w-8 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-medium text-card-foreground">
            Cada activo cuenta con un codigo QR unico
          </p>
          <p className="text-xs text-muted-foreground">
            Escanea el codigo QR de cada activo durante la auditoria para verificar su ubicacion y estado actual de forma rapida.
          </p>
        </div>
      </div>

      {/* Audit Cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {audits.map((audit) => {
          const progress = audit.totalAssets > 0 ? Math.round((audit.verified / audit.totalAssets) * 100) : 0
          return (
            <div key={audit.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-sm font-semibold text-card-foreground">{audit.name}</h3>
                  <span className="text-xs text-muted-foreground">{audit.date} - {audit.auditor}</span>
                </div>
                <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", auditStatusStyles[audit.status])}>
                  {audit.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progreso de verificacion</span>
                  <span className="font-semibold text-card-foreground">{progress}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      progress === 100 ? "bg-emerald-500" : "bg-primary"
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center rounded-lg bg-emerald-500/10 p-2">
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{audit.verified}</span>
                  <span className="text-[10px] text-muted-foreground">Verificados</span>
                </div>
                <div className="flex flex-col items-center rounded-lg bg-amber-500/10 p-2">
                  <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{audit.pending}</span>
                  <span className="text-[10px] text-muted-foreground">Pendientes</span>
                </div>
                <div className="flex flex-col items-center rounded-lg bg-red-500/10 p-2">
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">{audit.notFound}</span>
                  <span className="text-[10px] text-muted-foreground">No hallados</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detailed Verification Table from most recent audit */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-6 pb-4">
          <h3 className="text-sm font-semibold text-card-foreground">
            Detalle: {audits[0].name}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Lista de activos y estado de verificacion
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Activo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Codigo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Area</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {audits[0].items.map((item, i) => {
                const vs = verificationStyles[item.status]
                const StatusIcon = vs.icon
                return (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-card-foreground">{item.asset}</td>
                    <td className="px-6 py-3 font-mono text-xs text-muted-foreground">{item.code}</td>
                    <td className="px-6 py-3 text-muted-foreground">{item.area}</td>
                    <td className="px-6 py-3">
                      <div className={cn("flex items-center gap-1.5 text-xs font-semibold", vs.bg)}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {item.status}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
