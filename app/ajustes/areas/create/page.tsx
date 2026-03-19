"use client"

import { API_URL } from "@/config/api"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  username: string
  rol: string
}

export default function CreateAreaPage() {
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [responsable, setResponsable] = useState<number | "">("")
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  const router = useRouter()

  // Verificar que sea admin
  useEffect(() => {
    const user = localStorage.getItem("user")

    if (!user) {
      setAuthorized(false)
      return
    }

    const parsed = JSON.parse(user)

    if (parsed.rol === "admin") {
      setAuthorized(true)
    } else {
      setAuthorized(false)
    }
  }, [])

  // Cargar usuarios para select responsable
  const fetchUsers = async () => {
    const token = localStorage.getItem("token")

    try {
      const response = await fetch(`${API_URL}/users/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )

      const data = await response.json()

      if (response.ok) {
        setUsuarios(data)
      }
    } catch {
      console.log("Error cargando usuarios")
    }
  }

  useEffect(() => {
    if (authorized) {
      fetchUsers()
    }
  }, [authorized])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem("token")
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_URL}/areas/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            nombre,
            descripcion,
            responsable: responsable || null,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al crear área")
        setLoading(false)
        return
      }

      router.push("/ajustes/areas")
    } catch {
      setError("Error de conexión")
      setLoading(false)
    }
  }

  if (authorized === null) {
    return <div className="p-6">Verificando permisos...</div>
  }

  if (!authorized) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">
          Acceso Denegado
        </h1>
        <p className="mt-2 text-muted-foreground">
          No tienes permisos para crear áreas.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">
        Crear Nueva Área
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre *
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Responsable
          </label>
          <select
            value={responsable}
            onChange={(e) =>
              setResponsable(
                e.target.value ? Number(e.target.value) : ""
              )
            }
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Sin responsable --</option>
            {usuarios.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/ajustes/areas")}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}