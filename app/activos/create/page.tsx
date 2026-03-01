"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface TipoActivo {
  id: number;
  nombre: string;
  caracteristicas: { id: number; nombre: string }[];
}

interface Area {
  id: number;
  nombre: string;
}

export default function CrearActivoPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoActivo, setTipoActivo] = useState<number | "">("");
  const [area, setArea] = useState<number | "">("");
  const [estado, setEstado] = useState("disponible");
  const [tipos, setTipos] = useState<TipoActivo[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [valores, setValores] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Cargar tipos de activos y áreas
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchTipos = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/tipos-activo/", {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await res.json();
        setTipos(data);
      } catch (err) {
        console.error("Error cargando tipos de activos", err);
      }
    };

    const fetchAreas = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/areas/list/?activas=true",
          { headers: { Authorization: `Token ${token}` } }
        );
        const data = await res.json();
        setAreas(data);
      } catch (err) {
        console.error("Error cargando áreas", err);
      }
    };

    fetchTipos();
    fetchAreas();
  }, []);

  // 🔹 Inicializar valores para las características cuando se selecciona un tipo
  useEffect(() => {
    if (!tipoActivo) {
      setValores({});
      return;
    }
    const selected = tipos.find((t) => t.id === tipoActivo);
    if (!selected) return;

    const initialValores: { [key: number]: string } = {};
    selected.caracteristicas.forEach((c) => {
      initialValores[c.id] = ""; // Siempre string
    });
    setValores(initialValores);
  }, [tipoActivo, tipos]);

  const handleValorChange = (id: number, value: string) => {
    setValores({ ...valores, [id]: value });
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

    const body = {
      nombre,
      descripcion,
      tipo_activo: tipoActivo,
      area,
      estado,
      valores: Object.entries(valores).map(([caracteristica, valor]) => ({
        caracteristica: Number(caracteristica),
        valor,
      })),
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/activos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al crear activo");
        setLoading(false);
        return;
      }

      router.push("/activos"); // Regresar al listado
    } catch (err) {
      setError("Error de conexión");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Registrar Nuevo Activo</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block mb-1 font-medium">Nombre *</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block mb-1 font-medium">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Tipo de Activo */}
        <div>
          <label className="block mb-1 font-medium">Tipo de Activo *</label>
          <select
            value={tipoActivo}
            onChange={(e) =>
              setTipoActivo(e.target.value ? Number(e.target.value) : "")
            }
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Seleccionar tipo --</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Características */}
        {tipoActivo &&
          tipos
            .find((t) => t.id === tipoActivo)
            ?.caracteristicas.map((c) => (
              <div key={c.id}>
                <label className="block mb-1 font-medium">{c.nombre} *</label>
                <input
                  type="text"
                  value={valores[c.id] || ""} // 🔹 corregido
                  onChange={(e) => handleValorChange(c.id, e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            ))}

        {/* Área */}
        <div>
          <label className="block mb-1 font-medium">Área *</label>
          <select
            value={area}
            onChange={(e) =>
              setArea(e.target.value ? Number(e.target.value) : "")
            }
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Seleccionar área --</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="block mb-1 font-medium">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="disponible">Disponible</option>
            <option value="asignado">Asignado</option>
            <option value="mantenimiento">En mantenimiento</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Guardando..." : "Guardar Activo"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/activos")}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}