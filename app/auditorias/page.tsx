"use client"

import { useEffect, useState } from "react"
import { ClipboardCheck, Plus, MapPin } from "lucide-react"

export default function AuditoriasPage() {

  const [loading, setLoading] = useState(false)
  const [loadingArea, setLoadingArea] = useState(false)
  const [auditorias, setAuditorias] = useState([])
  const [areas, setAreas] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedArea, setSelectedArea] = useState("")

  // 🔹 Obtener auditorías
  const fetchAuditorias = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch("http://localhost:8000/api/auditorias/list/", {
        headers: { Authorization: `Token ${token}` },
      })
      if (!res.ok) {
        console.log("Error al obtener auditorías:", res.status)
        return
      }
      const data = await res.json()
      setAuditorias(data)
    } catch (error) {
      console.error("Error fetch auditorías:", error)
    }
  }

  // 🔹 Obtener áreas para auditoría por área
  const fetchAreas = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch("http://localhost:8000/api/areas/list/?activas=true", {
        headers: { Authorization: `Token ${token}` },
      })
      if (!res.ok) return
      const data = await res.json()
      setAreas(data)
    } catch (error) {
      console.error("Error fetch áreas:", error)
    }
  }

  useEffect(() => {
    fetchAuditorias()
    fetchAreas()
  }, [])

  // 🔹 Crear auditoría general
  const handleCrearAuditoria = async () => {
    const token = localStorage.getItem("token")
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8000/api/auditoria/iniciar/", {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
      })
      if (!res.ok) { setLoading(false); return }
      const data = await res.json()
      fetchAuditorias()
      window.location.href = `/auditorias/${data.auditoria_id}`
    } catch (error) {
      console.error("Error crear auditoría:", error)
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Crear auditoría por área
  const handleCrearAuditoriaArea = async () => {
    if (!selectedArea) return alert("Selecciona un área primero")
    const token = localStorage.getItem("token")
    setLoadingArea(true)
    try {
      const res = await fetch("http://localhost:8000/api/auditoria/iniciar/area/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ area_id: selectedArea })
      })
      if (!res.ok) { setLoadingArea(false); return }
      const data = await res.json()
      fetchAuditorias()
      setShowModal(false)
      setSelectedArea("")
      window.location.href = `/auditorias/${data.auditoria_id}`
    } catch (error) {
      console.error("Error crear auditoría por área:", error)
    } finally {
      setLoadingArea(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">

      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ClipboardCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Auditorías</h1>
            <p className="text-sm text-muted-foreground">Historial de auditorías</p>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Auditoría general */}
          <button
            onClick={handleCrearAuditoria}
            disabled={loading}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {loading ? "Creando..." : "Nueva Auditoría"}
          </button>

          {/* Auditoría por área */}
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-medium text-white hover:bg-green-700"
          >
            <MapPin className="h-4 w-4" />
            Auditoría por Área
          </button>
        </div>
      </header>

      {/* Lista de auditorías */}
      <div className="flex flex-col gap-3">
        {auditorias.length === 0 ? (
          <p className="text-gray-500">No hay auditorías aún</p>
        ) : (
          auditorias.map((auditoria) => (
            <div
              key={auditoria.id}
              onClick={() => window.location.href = `/auditorias/${auditoria.id}`}
              className="cursor-pointer rounded-lg border p-4 hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold">{auditoria.nombre}</h3>
              <p className="text-sm text-gray-500">Estado: {auditoria.estado}</p>
              <p className="text-xs text-gray-400">
                {new Date(auditoria.fecha_inicio).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Modal para auditoría por área */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Selecciona un área</h2>
            <select
              className="w-full border p-2 rounded mb-4"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              <option value="">-- Selecciona --</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>{area.nombre}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearAuditoriaArea}
                disabled={loadingArea}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                {loadingArea ? "Creando..." : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}