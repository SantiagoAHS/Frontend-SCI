"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"

export default function EditarMantenimientoPage() {

  const router = useRouter()
  const params = useParams()
  const id = params.id

  const [responsable, setResponsable] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [costo, setCosto] = useState("")
  const [comprobante, setComprobante] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMantenimiento = async () => {

      const token = localStorage.getItem("token")

      const res = await fetch(`http://localhost:8000/api/mantenimientos/list/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      const data = await res.json()

      const mantenimiento = data.find((m:any) => m.id == id)

      if (mantenimiento) {
        setResponsable(mantenimiento.responsable || "")
        setDescripcion(mantenimiento.descripcion_problema || "")
        setCosto(mantenimiento.costo || "")
      }

      setLoading(false)
    }

    fetchMantenimiento()
  }, [id])

  const handleSubmit = async (e:any) => {

    e.preventDefault()

    const token = localStorage.getItem("token")

    const formData = new FormData()
    formData.append("responsable", responsable)
    formData.append("descripcion_problema", descripcion)

    if (costo) formData.append("costo", costo)
    if (comprobante) formData.append("comprobante", comprobante)

    const res = await fetch(`http://localhost:8000/api/mantenimientos/${id}/editar/`, {
      method: "PATCH",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    })

    if (res.ok) {
      alert("Mantenimiento actualizado")
      router.push("/mantenimientos")
    } else {
      alert("Error actualizando mantenimiento")
    }

  }

  if (loading) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-8 max-w-xl">

      <h1 className="text-xl font-bold mb-6">
        Editar mantenimiento
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div>
          <label className="text-sm">Responsable</label>
          <input
            type="text"
            value={responsable}
            onChange={(e) => setResponsable(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm">Descripción del problema</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm">Costo</label>
          <input
            type="number"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm">Comprobante (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setComprobante(e.target.files?.[0] || null)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Guardar cambios
        </button>

      </form>

    </div>
  )
}