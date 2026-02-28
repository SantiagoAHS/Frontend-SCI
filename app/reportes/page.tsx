import {
  FileBarChart,
  Package,
  Building2,
  History,
  Trash2,
  Wrench,
  Timer,
  Download,
  FileText,
  Clock,
} from "lucide-react"

const reportTypes = [
  {
    icon: Package,
    title: "Inventario General",
    description: "Reporte completo de todos los activos registrados con estado actual, ubicacion y responsable asignado.",
  },
  {
    icon: Building2,
    title: "Activos por Area",
    description: "Distribucion de activos agrupados por departamento o area organizacional con valores totales.",
  },
  {
    icon: History,
    title: "Historial de Movimientos",
    description: "Registro detallado de todos los movimientos: asignaciones, reasignaciones, mantenimientos y bajas.",
  },
  {
    icon: Trash2,
    title: "Activos dados de Baja",
    description: "Listado de activos retirados del inventario activo con motivo de baja, fecha y autorizacion.",
  },
  {
    icon: Wrench,
    title: "Mantenimientos Realizados",
    description: "Historial de mantenimientos preventivos y correctivos con costos, tecnicos y resultados.",
  },
  {
    icon: Timer,
    title: "Activos por Vida Util",
    description: "Analisis de activos segun su vida util restante para planificacion de reemplazo y presupuesto.",
  },
]

const recentReports = [
  { name: "Inventario General - Feb 2026", date: "2026-02-12", format: "PDF", size: "2.4 MB" },
  { name: "Activos por Area - Ene 2026", date: "2026-01-30", format: "Excel", size: "1.8 MB" },
  { name: "Historial de Movimientos Q4 2025", date: "2025-12-31", format: "PDF", size: "5.1 MB" },
  { name: "Bajas del ejercicio 2025", date: "2025-12-28", format: "PDF", size: "890 KB" },
]

export default function ReportesPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <FileBarChart className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-balance">
            Reportes
          </h1>
          <p className="text-sm text-muted-foreground">
            Genera y descarga reportes del sistema de activos
          </p>
        </div>
      </header>

      {/* Report Type Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reportTypes.map((report) => {
          const Icon = report.icon
          return (
            <div
              key={report.title}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-accent/50"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-card-foreground">{report.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{report.description}</p>
                </div>
              </div>
              <button className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                <Download className="h-4 w-4" />
                Generar Reporte
              </button>
            </div>
          )
        })}
      </section>

      {/* Recent Reports */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-6 pb-4">
          <h3 className="text-sm font-semibold text-card-foreground">
            Reportes Recientes
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Ultimos reportes generados disponibles para descarga
          </p>
        </div>
        <div className="flex flex-col">
          {recentReports.map((report, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-border px-6 py-4 last:border-0 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-card-foreground">{report.name}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {report.date}
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold">{report.format}</span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>
              <button className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent">
                <Download className="h-3.5 w-3.5" />
                Descargar
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
