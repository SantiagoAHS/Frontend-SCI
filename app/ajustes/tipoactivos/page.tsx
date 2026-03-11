"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface OpcionCaracteristica {
  id: number;
  nombre: string;
}

interface Caracteristica {
  id: number;
  nombre: string;
  tipo_dato: string;
  obligatorio: boolean;
  opciones?: OpcionCaracteristica[];
}

interface TipoActivo {
  id: number;
  nombre: string;
  caracteristicas: Caracteristica[];
}

interface User {
  rol: string;
}

export default function TiposActivoPage() {
  const router = useRouter();

  const [tipos, setTipos] = useState<TipoActivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  // 🔐 Verificar rol admin
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      setAuthorized(false);
      return;
    }

    const parsed: User = JSON.parse(user);
    setAuthorized(parsed.rol === "admin");
  }, []);

  // 📥 Cargar tipos de activos
  const fetchTipos = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/tipos-activo/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar tipos de activo");
      }

      const data = await response.json();
      setTipos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) fetchTipos();
  }, [authorized]);

  // 🗑 Desactivar tipo de activo
  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas desactivar este tipo de activo?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/tipos-activo/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al desactivar tipo de activo");
      }

      setTipos((prev) => prev.filter((tipo) => tipo.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (authorized === null)
    return <div className="p-6">Verificando permisos...</div>;

  if (!authorized)
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
        <p className="mt-2 text-muted-foreground">
          No tienes permisos para ver los tipos de activos.
        </p>
      </div>
    );

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tipos de Activos</h1>

        <button
          onClick={() => router.push("/ajustes/tipoactivos/create")}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          + Agregar Tipo de Activo
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p>Cargando tipos de activos...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-left text-sm">

            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Características</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {tipos.map((tipo) => (
                <tr key={tipo.id} className="border-t hover:bg-gray-50">

                  <td className="px-4 py-2">{tipo.id}</td>

                  <td className="px-4 py-2">{tipo.nombre}</td>

                  <td className="px-4 py-2">
                    {tipo.caracteristicas?.length || 0}
                  </td>

                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(tipo.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Desactivar
                    </button>
                  </td>

                </tr>
              ))}

              {tipos.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                    No hay tipos de activos registrados.
                  </td>
                </tr>
              )}

            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}