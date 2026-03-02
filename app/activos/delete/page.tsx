"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Asset {
  id: number;
  nombre: string;
  tipo_activo: string;
  area: string;
  estado: string;
}

export default function DeleteActivosPage() {
  const router = useRouter();
  const [activos, setActivos] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivos = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No autenticado");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/activos/list/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al cargar activos");

        const data = await res.json();
        setActivos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivos();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const confirmDelete = confirm("¿Seguro que deseas eliminar este activo?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/activos/${id}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Error al eliminar");

      // eliminar del estado sin recargar
      setActivos(prev => prev.filter(a => a.id !== id));

    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p className="p-6">Cargando...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Eliminar Activos</h1>

      <div className="space-y-3">
        {activos.map((activo) => (
          <div
            key={activo.id}
            className="flex justify-between items-center border p-4 rounded-lg"
          >
            <div>
              <p className="font-semibold">{activo.nombre}</p>
              <p className="text-sm text-gray-500">
                {activo.tipo_activo} - {activo.area}
              </p>
            </div>

            <button
              onClick={() => handleDelete(activo.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Eliminar
            </button>
          </div>
        ))}

        {activos.length === 0 && (
          <p className="text-gray-500">No hay activos disponibles.</p>
        )}
      </div>

      <button
        onClick={() => router.push("/activos")}
        className="mt-6 text-sm text-blue-600 hover:underline"
      >
        ← Volver al catálogo
      </button>
    </div>
  );
}