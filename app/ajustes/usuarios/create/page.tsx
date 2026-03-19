"use client"

import { API_URL } from "@/config/api"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateUserPage() {
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [numeroEmpleado, setNumeroEmpleado] = useState("")
  const [password, setPassword] = useState("")
  const [rol, setRol] = useState("operador")
  const [cargo, setCargo] = useState("")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  // Verificación de acceso
  useEffect(() => {
    const user = localStorage.getItem("user")

    if (!user) {
      setAuthorized(false)
      return
    }

    const parsedUser = JSON.parse(user)

    if (parsedUser.rol === "admin") {
      setAuthorized(true)
    } else {
      setAuthorized(false)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const token = localStorage.getItem("token")

    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({
          username,
          numero_empleado: numeroEmpleado,
          password,
          rol,
          cargo,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(
          typeof data === "object"
            ? JSON.stringify(data)
            : "Error al crear usuario"
        )
        setLoading(false)
        return
      }

      router.push("/ajustes/usuarios")

    } catch {
      setError("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  // Mientras verifica
  if (authorized === null) {
    return <div className="p-6">Verificando permisos...</div>
  }

  // Si no es admin
  if (!authorized) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
        <p className="mt-2 text-muted-foreground">
          No tienes permisos para acceder a esta sección.
        </p>
      </div>
    )
  }

  // Si es admin
  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Crear Usuario</h1>

      {error && (
        <p className="text-red-600 mb-4 text-sm">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div>
          <label className="block text-sm mb-1">Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Número de Empleado</label>
          <input
            type="text"
            value={numeroEmpleado}
            onChange={(e) => setNumeroEmpleado(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Rol</label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="admin">Admin</option>
            <option value="operativo">Operador</option>
            <option value="auditor">Auditor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Cargo</label>
          <input
            type="text"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Ej: Jefe de Área"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear Usuario"}
        </button>
      </form>
    </div>
  )
}