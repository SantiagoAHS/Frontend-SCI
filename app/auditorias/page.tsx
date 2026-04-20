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
  const [error, setError] = useState("")
  const [loadingInitial, setLoadingInitial] = useState(true)

  // 🔹 Obtener auditorías
  const fetchAuditorias = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("No autenticado")
      setLoadingInitial(false)
      return
    }

    try {
      const res = await fetch(`${API_URL}/auditorias/list/`, {
        headers: { Authorization: `Token ${token}` },
      })
      if (!res.ok) throw new Error("Error cargando auditorías")
      const data = await res.json()
      setAuditorias(data)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoadingInitial(false)
    }
  }

  // 🔹 Descargar PDF
  const handleDescargarPDF = async (id: number) => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const res = await fetch(`${API_URL}/auditoria/${id}/pdf/`, {
        headers: { Authorization: `Token ${token}` },
      })
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `auditoria_${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      console.error(error)
    }
  }

  // 🔹 Obtener áreas
  const fetchAreas = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

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
    if (!token) return

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auditoria/iniciar/`, {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
      })
      const data = await res.json()
      window.location.href = `/auditorias/${data.auditoria_id}`
    } finally {
      setLoading(false)
    }
  }

  const handleCrearAuditoriaArea = async () => {
    const token = localStorage.getItem("token")
    if (!selectedArea || !token) return

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
    } finally {
      setLoadingArea(false)
    }
  }

  const handleCrearAuditoriaTipo = async () => {
    const token = localStorage.getItem("token")
    if (!tipoSeleccionado || !token) return

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
    } finally {
      setLoadingTipo(false)
    }
  }

  // ⏳ Loading inicial
  if (loadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Cargando auditorías...
        </p>
      </div>
    )
  }

  // ❌ No autenticado / error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <ClipboardCheck className="h-12 w-12 text-muted-foreground/40" />
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Acceso restringido
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Debes iniciar sesión para acceder a las auditorías.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ClipboardCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Auditorías</h1>
            <p className="text-sm text-muted-foreground">Control y validación de activos físicos</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:bg-accent">
            <MapPin className="h-4 w-4" /> Por Área
          </button>

          <button onClick={() => setShowModalTipo(true)} className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:bg-accent">
            <Filter className="h-4 w-4" /> Por Tipo
          </button>

          <button onClick={handleCrearAuditoria} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Nueva Auditoría
          </button>
        </div>
      </header>

      {/* TABLA */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {auditorias.length === 0 ? (
                <tr>
                  <td className="p-10 text-center text-muted-foreground">
                    No hay auditorías registradas.
                  </td>
                </tr>
              ) : (
                auditorias.map((a: any) => (
                  <tr key={a.id} onClick={() => window.location.href = `/auditorias/${a.id}`} className="cursor-pointer hover:bg-muted/50">
                    <td className="p-4">{a.nombre}</td>
                    <td className="p-4">{a.estado}</td>
                    <td className="p-4">
                      {new Date(a.fecha_inicio).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      {a.estado === "finalizada" && (
                        <button onClick={(e) => { e.stopPropagation(); handleDescargarPDF(a.id) }}>
                          <FileText className="h-4 w-4" />
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
    </div>
  )
}