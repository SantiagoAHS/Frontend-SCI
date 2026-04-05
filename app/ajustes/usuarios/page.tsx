"use client"

import { API_URL } from "@/config/api"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Users, 
  UserPlus, 
  ArrowLeft, 
  ShieldAlert, 
  Loader2, 
  Edit2, 
  Trash2, 
  Briefcase, 
  Search,
  X,
  AlertCircle
} from "lucide-react"

interface User {
  id: number
  username: string
  numero_empleado: string
  rol: string
  cargo?: string | null 
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  // Estados para el Modal de Eliminación
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      setAuthorized(false)
      return
    }
    const parsedUser = JSON.parse(user)
    setAuthorized(parsedUser.rol === "admin")
  }, [])

  const fetchUsers = async () => {
    const token = localStorage.getItem("token")
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/users/`, {
        headers: { Authorization: `Token ${token}` },
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

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase()
    return (
      user.username.toLowerCase().includes(search) ||
      user.numero_empleado.toLowerCase().includes(search) ||
      (user.cargo && user.cargo.toLowerCase().includes(search))
    )
  })

  // Abrir modal
  const openDeleteModal = (user: User) => {
    setUserToDelete(user)
    setIsModalOpen(true)
  }

  // Ejecutar eliminación real
  const confirmDelete = async () => {
    if (!userToDelete) return
    const token = localStorage.getItem("token")
    setIsDeleting(true)

    try {
      const response = await fetch(`${API_URL}/users/${userToDelete.id}/delete/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al eliminar")
      }
      
      setUsers(users.filter((user) => user.id !== userToDelete.id))
      setIsModalOpen(false)
      setUserToDelete(null)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  if (authorized === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-6 text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-4 text-destructive shadow-inner">
          <ShieldAlert className="h-12 w-12" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Acceso Denegado</h1>
        <p className="mt-2 text-muted-foreground max-w-xs italic">No tienes permisos de administrador para esta sección.</p>
        <button onClick={() => router.push("/ajustes")} className="mt-6 text-sm font-medium hover:text-primary transition-colors flex items-center gap-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver a Ajustes
        </button>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col gap-8 p-6 lg:p-8 max-w-7xl mx-auto bg-background min-h-screen text-foreground font-sans">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => router.push("/ajustes")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a Ajustes
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h1>
              <p className="text-sm text-muted-foreground">Administra las cuentas y permisos del personal.</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push("/ajustes/usuarios/create")}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 w-full sm:w-auto"
        >
          <UserPlus className="h-4 w-4" />
          Agregar Usuario
        </button>
      </div>

      {/* Buscador */}
      <div className="relative group max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Buscar por nombre, empleado o cargo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-input bg-card pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Tabla */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
            <p className="text-sm font-medium">Cargando usuarios...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 font-semibold text-muted-foreground w-20">ID</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Usuario</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">N° Empleado</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Rol</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Cargo</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">#{user.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-foreground">{user.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-medium">{user.numero_empleado}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.rol === 'admin' 
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" 
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        }`}>
                          {user.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-3.5 w-3.5 opacity-50 shrink-0" />
                          <span className="truncate max-w-[150px]" title={user.cargo || ""}>
                            {user.cargo || "No asignado"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => router.push(`/ajustes/usuarios/edit/${user.id}`)}
                            className="p-2 rounded-lg border border-input bg-background hover:bg-accent hover:text-primary transition-all shadow-sm"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="p-2 rounded-lg border border-input bg-background hover:bg-destructive/10 hover:text-destructive transition-all shadow-sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">No hay resultados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODAL DE CONFIRMACIÓN ESTILIZADO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
            onClick={() => !isDeleting && setIsModalOpen(false)} 
          />
          
          <div className="relative w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive shadow-inner">
                <AlertCircle size={30} />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight">¿Eliminar usuario?</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Estás a punto de eliminar a <span className="font-bold text-foreground">"{userToDelete?.username}"</span>. 
                  Esta acción revocará todos sus accesos de forma permanente.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isDeleting}
                  className="h-11 rounded-xl border border-input bg-background font-medium hover:bg-accent transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="h-11 rounded-xl bg-destructive text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm shadow-destructive/20"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                  {isDeleting ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}