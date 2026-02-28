"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface ResponsableDetalle {
  id: number
  username: string
  numero_empleado: string
  telefono: string
}

interface Area {
  id: number
  nombre: string
  descripcion: string | null
  responsable: number | null
  responsable_detalle: ResponsableDetalle | null
  activo: boolean
}

interface User {
  rol: string
}

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")

    if (user) {
      const parsed = JSON.parse(user)
      if (parsed.rol === "admin") {
        setIsAdmin(true)
      }
    }
  }, [])

  const fetchAreas = async () => {
    const token = localStorage.getItem("token")

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/areas/list/?activas=false",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al obtener áreas")
        return
      }

      setAreas(data)
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAreas()
  }, [])

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token")

    if (!confirm("¿Seguro que deseas desactivar esta área?")) return

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/areas/${id}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Error al desactivar")
        return
      }

      fetchAreas()
    } catch {
      alert("Error de conexión")
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Áreas</h1>

        {isAdmin && (
          <button
            onClick={() => router.push("/ajustes/areas/create")}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            + Crear Área
          </button>
        )}
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Descripción</th>
                <th className="px-4 py-2">Responsable</th>
                <th className="px-4 py-2">Estado</th>
                {isAdmin && (
                  <th className="px-4 py-2">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <tr key={area.id} className="border-t">
                  <td className="px-4 py-2">{area.id}</td>
                  <td className="px-4 py-2">{area.nombre}</td>
                  <td className="px-4 py-2">{area.descripcion || "-"}</td>
                  <td className="px-4 py-2">
                    {area.responsable_detalle
                      ? area.responsable_detalle.username
                      : "Sin responsable"}
                  </td>
                  <td className="px-4 py-2">
                    {area.activo ? (
                      <span className="text-green-600 font-semibold">
                        Activa
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Inactiva
                      </span>
                    )}
                  </td>

                  {isAdmin && (
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() =>
                          router.push(`/ajustes/areas/edit/${area.id}`)
                        }
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Editar
                      </button>

                      {area.activo && (
                        <button
                          onClick={() => handleDelete(area.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Desactivar
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}