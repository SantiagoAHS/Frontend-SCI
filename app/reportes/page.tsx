"use client"

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
} from "lucide-react"

import { useEffect, useState } from "react"

const reportTypes = [
  {
    icon: Package,
    title: "Inventario General",
    description:
      "Reporte completo de todos los activos registrados con estado actual, ubicacion y responsable asignado.",
  },
  {
    icon: Building2,
    title: "Activos por Area",
    description:
      "Distribucion de activos agrupados por departamento o area organizacional con valores totales.",
  },
  {
    icon: History,
    title: "Historial de Movimientos",
    description:
      "Registro detallado de todos los movimientos: asignaciones, reasignaciones, mantenimientos y bajas.",
  },
  {
    icon: Trash2,
    title: "Activos dados de Baja",
    description:
      "Listado de activos retirados del inventario activo con motivo de baja, fecha y autorizacion.",
  },
  {
    icon: Wrench,
    title: "Mantenimientos Realizados",
    description:
      "Historial de mantenimientos preventivos y correctivos con costos, tecnicos y resultados.",
  },
  {
    icon: Timer,
    title: "Activos por Vida Util",
    description:
      "Analisis de activos segun su vida util restante para planificacion de reemplazo y presupuesto.",
  },
]

export default function ReportesPage() {

  const [areas, setAreas] = useState<any[]>([])
  const [areaSeleccionada, setAreaSeleccionada] = useState("")

  // 🔹 Cargar áreas
  useEffect(() => {

    const fetchAreas = async () => {

      const token = localStorage.getItem("token")

      const res = await fetch("http://127.0.0.1:8000/api/areas/list/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      const data = await res.json()
      setAreas(data)
    }

    fetchAreas()

  }, [])

  // 🔹 PDF por área
  const descargarReporteActivosPorAreaPDF = async () => {

    if (!areaSeleccionada) {
      alert("Selecciona un área")
      return
    }

    const token = localStorage.getItem("token")

    const response = await fetch(
      `http://127.0.0.1:8000/api/reporte/activos/area/${areaSeleccionada}/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )

    if (!response.ok) {
      alert("Error generando el reporte")
      return
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "reporte_activos_area.pdf"

    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  // 🔹 Otros reportes
  const descargarReportePDF = async () => {
    const token = localStorage.getItem("token")

    const response = await fetch(
      "http://127.0.0.1:8000/api/reportes/mantenimientos/pdf/",
      { headers: { Authorization: `Token ${token}` } }
    )

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "reporte_mantenimientos.pdf"
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const descargarReporteMantenimientos = async () => {
    const token = localStorage.getItem("token")

    const response = await fetch(
      "http://127.0.0.1:8000/api/reportes/mantenimientos/excel/",
      { headers: { Authorization: `Token ${token}` } }
    )

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "reporte_mantenimientos.xlsx"
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const descargarReporteActivosPDF = async () => {
    const token = localStorage.getItem("token")

    const response = await fetch(
      "http://127.0.0.1:8000/api/reportes/activos/pdf/",
      { headers: { Authorization: `Token ${token}` } }
    )

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "reporte_activos.pdf"
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const descargarReporteActivosExcel = async () => {
    const token = localStorage.getItem("token")

    const response = await fetch(
      "http://127.0.0.1:8000/api/reportes/activos/excel/",
      { headers: { Authorization: `Token ${token}` } }
    )

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "reporte_activos.xlsx"
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const descargarReportePrestamosPDF = async () => {
    const token = localStorage.getItem("token")

    const response = await fetch(
      "http://127.0.0.1:8000/api/reportes/prestamos/pdf/",
      { headers: { Authorization: `Token ${token}` } }
    )

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "reporte_prestamos.pdf"
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">

      <header className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <FileBarChart className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Reportes</h1>
          <p className="text-sm text-muted-foreground">
            Genera y descarga reportes del sistema de activos
          </p>
        </div>
      </header>

      {/* 🔥 GRID DE 2 COLUMNAS */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {reportTypes.map((report) => {

          const Icon = report.icon

          return (
            <div
              key={report.title}
              className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm hover:bg-accent/50 transition"
            >

              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">{report.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {report.description}
                  </p>
                </div>
              </div>

              {/* 🔥 LÓGICA POR ÁREA */}
              {report.title === "Activos por Area" ? (

                <div className="flex flex-col gap-2">

                  <select
                    value={areaSeleccionada}
                    onChange={(e) => setAreaSeleccionada(e.target.value)}
                    className="h-9 rounded-lg border px-2 text-sm"
                  >
                    <option value="">Selecciona un área</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.nombre}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={descargarReporteActivosPorAreaPDF}
                    className="h-9 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                  >
                    Generar PDF
                  </button>

                </div>

              ) : (

                <div className="flex gap-2">

                  <button
                    onClick={() => {
                      if (report.title === "Mantenimientos Realizados") descargarReportePDF()
                      if (report.title === "Inventario General") descargarReporteActivosPDF()
                      if (report.title === "Historial de Movimientos") descargarReportePrestamosPDF()
                    }}
                    className="h-9 w-full rounded-lg border text-sm hover:bg-accent flex items-center justify-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    PDF
                  </button>

                  <button
                    onClick={() => {
                      if (report.title === "Mantenimientos Realizados") descargarReporteMantenimientos()
                      if (report.title === "Inventario General") descargarReporteActivosExcel()
                    }}
                    className="h-9 w-full rounded-lg border text-sm hover:bg-accent flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Excel
                  </button>

                </div>

              )}

            </div>
          )
        })}

      </section>
    </div>
  )
}