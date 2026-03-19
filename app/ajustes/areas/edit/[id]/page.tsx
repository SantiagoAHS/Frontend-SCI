"use client";

import { API_URL } from "@/config/api"
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
  rol: string;
}

export default function EditAreaPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [responsable, setResponsable] = useState<number | "">("");
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  // Verificar rol admin
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      setAuthorized(false);
      return;
    }
    const parsed = JSON.parse(user);
    setAuthorized(parsed.rol === "admin");
  }, []);

  // Cargar datos del área y usuarios solo si es admin
  useEffect(() => {
    if (!authorized || !id) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Área
        const areaRes = await fetch(`${API_URL}/areas/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!areaRes.ok) throw new Error("Error al cargar el área");
        const areaData = await areaRes.json();
        setNombre(areaData.nombre);
        setDescripcion(areaData.descripcion || "");
        setResponsable(areaData.responsable || "");

        // Usuarios
        const usersRes = await fetch(`${API_URL}/users/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!usersRes.ok) throw new Error("Error al cargar usuarios");
        const usersData = await usersRes.json();
        setUsuarios(usersData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authorized, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No estás autenticado.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/areas/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          responsable: responsable || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al actualizar área");
      }

      router.push("/ajustes/areas");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Verificando permisos
  if (authorized === null) {
    return <div className="p-6">Verificando permisos...</div>;
  }

  // No es admin
  if (!authorized) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
        <p className="mt-2 text-muted-foreground">
          No tienes permisos para editar áreas.
        </p>
      </div>
    );
  }

  // Admin → mostrar formulario
  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Editar Área</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre *</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Responsable</label>
          <select
            value={responsable}
            onChange={(e) =>
              setResponsable(e.target.value ? Number(e.target.value) : "")
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

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            {saving ? "Guardando..." : "Actualizar"}
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
  );
}