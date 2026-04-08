"use client"

import { API_URL } from "@/config/api"
import { useEffect, useState } from "react"
import { 
  ClipboardCheck, 
  Plus, 
  MapPin, 
  FileText, 
  Loader2, 
  X,
  Filter
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AuditoriasPage() {
  const [loading, setLoading] = useState(false)
  const [loadingArea, setLoadingArea] = useState(false)
  const [loadingTipo, setLoadingTipo] = useState(false)
  const [auditorias, setAuditorias] = useState([])
  const [areas, setAreas] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showModalTipo, setShowModalTipo] = useState(false)
  const [selectedArea, setSelectedArea] = useState("")
  const [tipoSeleccionado, setTipoSeleccionado] = useState("")

  // 🔹 Obtener auditorías
  const fetchAuditorias = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_URL}/auditorias/list/`, {
        headers: { Authorization: `Token ${token}` },
      })
      if (!res.ok) return
      const data = await res.json()
      setAuditorias(data)
    } catch (error) { console.error(error) }
  }

  // 🔹 Descargar PDF
  const handleDescargarPDF = async (id: number) => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_URL}/auditoria/${id}/pdf/`, {
        headers: { Authorization: `Token ${token}` },
      })
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url; a.download = `auditoria_${id}.pdf`
      document.body.appendChild(a); a.click(); a.remove()
    } catch (error) { console.error(error) }
  }

  // 🔹 Obtener áreas
  const fetchAreas = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_URL}/areas/list/?activas=true`, {
        headers: { Authorization: `Token ${token}` },
      })
      const data = await res.json()
      setAreas(data)
    } catch (error) {}
  }

  useEffect(() => {
    fetchAuditorias()
    fetchAreas()
  }, [])

  // 🔹 Crear Auditoría General
  const handleCrearAuditoria = async () => {
    const token = localStorage.getItem("token")
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auditoria/iniciar/`, {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
      })
      const data = await res.json()
      window.location.href = `/auditorias/${data.auditoria_id}`
    } finally { setLoading(false) }
  }

  // 🔹 Crear Auditoría por Área (CORREGIDO: token definido)
  const handleCrearAuditoriaArea = async () => {
    const token = localStorage.getItem("token")
    if (!selectedArea) return
    setLoadingArea(true)
    try {
      const res = await fetch(`${API_URL}/auditoria/iniciar/area/`, {
        method: "POST",
        headers: { 
          Authorization: `Token ${token}`, 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ area_id: selectedArea })
      })
      const data = await res.json()
      window.location.href = `/auditorias/${data.auditoria_id}`
    } finally { setLoadingArea(false) }
  }

  // 🔹 Crear Auditoría por Tipo (CORREGIDO: token definido)
  const handleCrearAuditoriaTipo = async () => {
    const token = localStorage.getItem("token")
    if (!tipoSeleccionado) return
    setLoadingTipo(true)
    try {
      const res = await fetch(`${API_URL}/auditoria/iniciar/tipo/`, {
        method: "POST",
        headers: { 
          Authorization: `Token ${token}`, 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ tipo: tipoSeleccionado })
      })
      const data = await res.json()
      window.location.href = `/auditorias/${data.auditoria_id}`
    } finally { setLoadingTipo(false) }
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      
      {/* Header Estilo Mantenimientos */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ClipboardCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground">Auditorías</h1>
            <p className="text-sm text-muted-foreground">Control y validación de activos físicos</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Por Área
          </button>

          <button
            onClick={() => setShowModalTipo(true)}
            className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Filter className="h-4 w-4 text-muted-foreground" />
            Por Tipo
          </button>

          <button
            onClick={handleCrearAuditoria}
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity shadow-sm"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Nueva Auditoría
          </button>
        </div>
      </header>

      {/* Tabla Estilo Mantenimientos */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm mt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Nombre de Auditoría</th>
                <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Fecha de Inicio</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {auditorias.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-muted-foreground italic">
                    No se registran procesos de auditoría.
                  </td>
                </tr>
              ) : (
                auditorias.map((auditoria: any) => (
                  <tr 
                    key={auditoria.id} 
                    className="group hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/auditorias/${auditoria.id}`}
                  >
                    <td className="px-6 py-4 font-medium text-foreground">{auditoria.nombre}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-tight",
                        auditoria.estado === "finalizada" 
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" 
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                      )}>
                        {auditoria.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(auditoria.fecha_inicio).toLocaleDateString('es-MX', { day:'2-digit', month:'short', year:'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {auditoria.estado === "finalizada" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDescargarPDF(auditoria.id) }}
                          className="inline-flex items-center gap-2 text-xs bg-slate-800 text-white px-3 py-1.5 rounded-md hover:bg-slate-700 transition-colors"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          PDF
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      {(showModal || showModalTipo) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-sm p-6 rounded-xl border shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold tracking-tight">
                {showModal ? "Auditar por Área" : "Auditar por Tipo"}
              </h2>
              <button onClick={() => { setShowModal(false); setShowModalTipo(false) }} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {showModal ? (
              <select
                className="w-full border border-input rounded-lg p-2.5 bg-background text-sm focus:ring-2 focus:ring-primary outline-none mb-6"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <option value="">Selecciona ubicación...</option>
                {areas.map((area: any) => <option key={area.id} value={area.id}>{area.nombre}</option>)}
              </select>
            ) : (
              <select
                className="w-full border border-input rounded-lg p-2.5 bg-background text-sm focus:ring-2 focus:ring-primary outline-none mb-6"
                value={tipoSeleccionado}
                onChange={(e) => setTipoSeleccionado(e.target.value)}
              >
                <option value="">Selecciona estado...</option>
                <option value="mantenimiento">En mantenimiento</option>
                <option value="prestamo">En préstamo</option>
                <option value="disponible">Disponible</option>
              </select>
            )}

            <button
              onClick={showModal ? handleCrearAuditoriaArea : handleCrearAuditoriaTipo}
              disabled={showModal ? (loadingArea || !selectedArea) : (loadingTipo || !tipoSeleccionado)}
              className="w-full py-2.5 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loadingArea || loadingTipo ? "Iniciando..." : "Iniciar Auditoría"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}