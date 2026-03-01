"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  rol: string;
}

interface Caracteristica {
  nombre: string;
}

export default function CreateTipoActivoPage() {
  const router = useRouter();

  // Form
  const [nombre, setNombre] = useState("");
  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([
    { nombre: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  // 🔐 Verificar que sea admin
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      setAuthorized(false);
      return;
    }
    const parsed = JSON.parse(user) as User;
    setAuthorized(parsed.rol === "admin");
  }, []);

  const handleCaracteristicaChange = (index: number, value: string) => {
    const updated = [...caracteristicas];
    updated[index].nombre = value;
    setCaracteristicas(updated);
  };

  const addCaracteristica = () => {
    setCaracteristicas([...caracteristicas, { nombre: "" }]);
  };

  const removeCaracteristica = (index: number) => {
    const updated = [...caracteristicas];
    updated.splice(index, 1);
    setCaracteristicas(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No estás autenticado.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/tipos-activo/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          caracteristicas: caracteristicas.filter((c) => c.nombre.trim() !== ""),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || data.error || "Error al crear tipo de activo");
        setLoading(false);
        return;
      }

      router.push("/ajustes/tipoactivos"); // Página de lista
    } catch (e: any) {
      setError("Error de conexión");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (authorized === null) return <div className="p-6">Verificando permisos...</div>;
  if (!authorized)
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
        <p className="mt-2 text-muted-foreground">
          No tienes permisos para crear tipos de activos.
        </p>
      </div>
    );

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Crear Tipo de Activo</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nombre *</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Características *</label>
          {caracteristicas.map((c, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={c.nombre}
                onChange={(e) => handleCaracteristicaChange(i, e.target.value)}
                required
                className="flex-1 border px-3 py-2 rounded"
              />
              {caracteristicas.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCaracteristica(i)}
                  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addCaracteristica}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Agregar Característica
          </button>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/ajustes/tipos-activo")}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}