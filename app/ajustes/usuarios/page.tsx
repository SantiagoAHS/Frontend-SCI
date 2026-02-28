"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  username: string
  numero_empleado: string
  rol: string
  cargo?: string | null 
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  const router = useRouter()

  // 🔐 Verificar rol antes de mostrar nada
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

  const fetchUsers = async () => {
    const token = localStorage.getItem("token")

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al obtener usuarios")
        return
      }

      setUsers(data)
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authorized) {
      fetchUsers()
    } else if (authorized === false) {
      setLoading(false)
    }
  }, [authorized])

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token")

    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${id}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Error al eliminar")
        return
      }

      setUsers(users.filter((user) => user.id !== id))
    } catch {
      alert("Error de conexión")
    }
  }

  // ⏳ Mientras verifica permisos
  if (authorized === null) {
    return <div className="p-6">Verificando permisos...</div>
  }

  // ❌ Si no es admin
  if (!authorized) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">
          Acceso Denegado
        </h1>
        <p className="mt-2 text-muted-foreground">
          No tienes permisos para acceder a la gestión de usuarios.
        </p>
      </div>
    )
  }

  // ✅ Si es admin
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>

        <button
          onClick={() => router.push("/ajustes/usuarios/create")}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          + Agregar Usuario
        </button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Usuario</th>
                <th className="px-4 py-2">Número Empleado</th>
                <th className="px-4 py-2">Rol</th>
                <th className="px-4 py-2">Cargo</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.numero_empleado}</td>
                  <td className="px-4 py-2">{user.rol}</td>
                  <td className="px-4 py-2">{user.cargo || "-"}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() =>
                        router.push(`/ajustes/usuarios/edit/${user.id}`)
                      }
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}