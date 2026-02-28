"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  const [formData, setFormData] = useState({
    username: "",
    numero_empleado: "",
    rol: "",
    cargo: "",
  })

  // 🔐 VALIDACIÓN CORRECTA DE ADMIN
  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (!storedUser) {
      setAuthorized(false)
      setLoading(false)
      return
    }

    const parsedUser = JSON.parse(storedUser)

    if (parsedUser.rol === "admin") {
      setAuthorized(true)
      fetchUser()
    } else {
      setAuthorized(false)
      setLoading(false)
    }
  }, [])

  // 👉 Obtener datos del usuario
  const fetchUser = async () => {
    const token = localStorage.getItem("token")

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )

      const data = await response.json()
      const user = data.find((u: any) => u.id == id)

      if (!user) {
        setError("Usuario no encontrado")
        return
      }

      setFormData({
        username: user.username,
        numero_empleado: user.numero_empleado,
        rol: user.rol,
        cargo: user.cargo || "",
      })
    } catch {
      setError("Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // ✅ AHORA SÍ usa tu endpoint real
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem("token")

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${id}/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(formData),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al actualizar usuario")
        return
      }

      alert("Usuario actualizado correctamente")
      router.push("/ajustes/usuarios")
    } catch {
      setError("Error de conexión")
    }
  }

  if (loading) return <div className="p-6">Cargando...</div>

  if (!authorized)
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">
          Acceso Denegado
        </h1>
        <p>No tienes permisos para editar usuarios.</p>
      </div>
    )

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar Usuario</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block mb-1">Nombre de usuario</label>
          <input
            type="text"
            name="username"
            className="w-full border px-3 py-2 rounded"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">Número de empleado</label>
          <input
            type="text"
            name="numero_empleado"
            className="w-full border px-3 py-2 rounded"
            value={formData.numero_empleado}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">Cargo</label>
          <input
            type="text"
            name="cargo"
            className="w-full border px-3 py-2 rounded"
            value={formData.cargo}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">Rol</label>
          <select
            name="rol"
            className="w-full border px-3 py-2 rounded"
            value={formData.rol}
            onChange={handleChange}
          >
            <option value="admin">Admin</option>
            <option value="operador">Operador</option>
            <option value="auditor">Auditor</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  )
}