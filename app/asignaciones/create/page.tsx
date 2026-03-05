"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface Activo {
  id: number
  nombre: string
}

interface Area {
  id: number
  nombre: string
}

export default function CrearPrestamoPage() {

  const router = useRouter()

  const [activos, setActivos] = useState<Activo[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    activo: "",
    responsable_nombre: "",
    responsable_telefono: "",
    area: "",
    tipo_prestamo: "interno",
    fecha_inicio: "",
    fecha_fin: "",
    observaciones: ""
  })

  useEffect(() => {

    const fetchData = async () => {

      const token = localStorage.getItem("token")

      if (!token) {
        alert("No autenticado")
        router.push("/login")
        return
      }

      try {

        const activosRes = await fetch("http://127.0.0.1:8000/api/activos/list/", {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json"
          }
        })

        const areasRes = await fetch("http://127.0.0.1:8000/api/areas/list/", {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json"
          }
        })

        const activosData = await activosRes.json()
        const areasData = await areasRes.json()

        setActivos(activosData.results || activosData)
        setAreas(areasData.results || areasData)

      } catch (error) {

        console.error("Error cargando datos", error)

      }

    }

    fetchData()

  }, [router])

  const handleChange = (e: any) => {

    const { name, value } = e.target

    setForm({
      ...form,
      [name]: value
    })

  }

  const handleSubmit = async (e: any) => {

    e.preventDefault()

    const token = localStorage.getItem("token")

    if (!token) {
      alert("No autenticado")
      return
    }

    setLoading(true)

    try {

      const payload = {
        activo: Number(form.activo),
        responsable_nombre: form.responsable_nombre,
        responsable_telefono: form.responsable_telefono,
        area: form.area ? Number(form.area) : null,
        tipo_prestamo: form.tipo_prestamo,
        fecha_inicio: form.fecha_inicio || null,
        fecha_fin: form.fecha_fin || null,
        observaciones: form.observaciones
      }

      const res = await fetch("http://127.0.0.1:8000/api/prestamo/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {

        console.error(data)
        alert("Error: " + JSON.stringify(data))
        return

      }

      alert("Préstamo creado correctamente")

      router.push("/asignaciones")

    } catch (error) {

      console.error(error)
      alert("Error conectando con el servidor")

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="max-w-xl mx-auto p-8">

      <h1 className="text-2xl font-bold mb-6">
        Crear préstamo
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <select
          name="activo"
          value={form.activo}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >

          <option value="">Seleccionar activo</option>

          {activos.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}

        </select>

        <input
          type="text"
          name="responsable_nombre"
          placeholder="Nombre del responsable"
          value={form.responsable_nombre}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="responsable_telefono"
          placeholder="Teléfono"
          value={form.responsable_telefono}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <select
          name="area"
          value={form.area}
          onChange={handleChange}
          className="border p-2 rounded"
        >

          <option value="">Seleccionar área</option>

          {areas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}

        </select>

        <select
          name="tipo_prestamo"
          value={form.tipo_prestamo}
          onChange={handleChange}
          className="border p-2 rounded"
        >

          <option value="interno">Interno</option>
          <option value="externo">Externo</option>
          <option value="temporal">Temporal</option>

        </select>

        <input
          type="date"
          name="fecha_inicio"
          value={form.fecha_inicio}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="date"
          name="fecha_fin"
          value={form.fecha_fin}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <textarea
          name="observaciones"
          placeholder="Observaciones"
          value={form.observaciones}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >

          {loading ? "Guardando..." : "Crear préstamo"}

        </button>

      </form>

    </div>

  )

}