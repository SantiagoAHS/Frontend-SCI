"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Opcion {
  id: number;
  nombre: string;
}

interface Caracteristica {
  id: number;
  nombre: string;
  tipo_dato: string;
  obligatorio: boolean;
  opciones?: Opcion[];
}

interface TipoActivo {
  id: number;
  nombre: string;
  caracteristicas: Caracteristica[];
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
  const [imagen, setImagen] = useState<File | null>(null);

  const [tipos, setTipos] = useState<TipoActivo[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const [valores, setValores] = useState<{ [key: number]: any }>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Cargar tipos y áreas
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchTipos = async () => {
      const res = await fetch("http://127.0.0.1:8000/api/tipos-activo/", {
        headers: { Authorization: `Token ${token}` },
      });

      const data = await res.json();
      setTipos(data);
    };

    const fetchAreas = async () => {
      const res = await fetch(
        "http://127.0.0.1:8000/api/areas/list/?activas=true",
        { headers: { Authorization: `Token ${token}` } }
      );

      const data = await res.json();
      setAreas(data);
    };

    fetchTipos();
    fetchAreas();
  }, []);

  // 🔹 Inicializar valores
  useEffect(() => {
    if (!tipoActivo) {
      setValores({});
      return;
    }

    const selected = tipos.find((t) => t.id === tipoActivo);
    if (!selected) return;

    const initial: any = {};

    selected.caracteristicas.forEach((c) => {
      initial[c.id] = "";
    });

    setValores(initial);
  }, [tipoActivo, tipos]);

  const handleValorChange = (id: number, value: any) => {
    setValores({ ...valores, [id]: value });
  };

  // 🔹 Crear activo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No autenticado");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();

    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("tipo_activo", String(tipoActivo));
    formData.append("area", String(area));
    formData.append("estado", estado);

    if (imagen) {
      formData.append("imagen", imagen);
    }

    const valoresArray = Object.entries(valores)
      .map(([id, valor]) => {

        const caracteristica = selectedTipo?.caracteristicas.find(
          (c) => c.id === Number(id)
        );

        if (!caracteristica) return null;

        // ❗ ignorar valores vacíos
        if (valor === "" || valor === null || valor === undefined) {
          return null;
        }

        // SELECT
        if (caracteristica.tipo_dato === "select") {
          return {
            caracteristica: Number(id),
            opcion: Number(valor),
          };
        }

        // BOOLEAN
        if (caracteristica.tipo_dato === "boolean") {
          return {
            caracteristica: Number(id),
            valor_texto: valor ? "true" : "false",
          };
        }

        // OTROS
        return {
          caracteristica: Number(id),
          valor_texto: String(valor),
        };

      })
      .filter(Boolean);

        formData.set("valores", JSON.stringify(valoresArray));

        try {
          const res = await fetch("http://127.0.0.1:8000/api/activos/", {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
            },
            body: formData,
          });

          if (!res.ok) {
            const data = await res.json();
            setError(data.error || "Error al crear activo");
            setLoading(false);
            return;
          }

          router.push("/activos");
        } catch (err) {
          setError("Error de conexión");
        } finally {
          setLoading(false);
        }
      };

  const selectedTipo = tipos.find((t) => t.id === tipoActivo);

  return (
    <div className="p-6 max-w-2xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Registrar Activo</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">
          {error}
        </div>
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

        {/* Imagen */}
        <div>
          <label className="block mb-1 font-medium">Imagen *</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImagen(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block mb-1 font-medium">Descripción</label>
          <textarea
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="block mb-1 font-medium">Tipo de Activo *</label>
          <select
            value={tipoActivo}
            required
            onChange={(e) =>
              setTipoActivo(e.target.value ? Number(e.target.value) : "")
            }
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Seleccionar</option>

            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Características dinámicas */}
        {selectedTipo?.caracteristicas.map((c) => {

          if (c.tipo_dato === "numero") {
            return (
              <div key={c.id}>
                <label className="block mb-1 font-medium">
                  {c.nombre} {c.obligatorio && "*"}
                </label>

                <input
                  type="number"
                  required={c.obligatorio}
                  value={valores[c.id] || ""}
                  onChange={(e) => handleValorChange(c.id, e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            );
          }

          if (c.tipo_dato === "boolean") {
            return (
              <div key={c.id} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={valores[c.id] || false}
                  onChange={(e) => handleValorChange(c.id, e.target.checked)}
                />
                <label>{c.nombre}</label>
              </div>
            );
          }

          if (c.tipo_dato === "fecha") {
            return (
              <div key={c.id}>
                <label>{c.nombre}</label>
                <input
                  type="date"
                  value={valores[c.id] || ""}
                  required={c.obligatorio}
                  onChange={(e) => handleValorChange(c.id, e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            );
          }

          if (c.tipo_dato === "select") {
            return (
              <div key={c.id}>
                <label>{c.nombre}</label>
                <select
                  value={valores[c.id] || ""}
                  required={c.obligatorio}
                  onChange={(e) => handleValorChange(c.id, e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Seleccionar</option>

                  {c.opciones?.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.nombre}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          return (
            <div key={c.id}>
              <label>{c.nombre}</label>
              <input
                type="text"
                required={c.obligatorio}
                value={valores[c.id] || ""}
                onChange={(e) => handleValorChange(c.id, e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          );
        })}

        {/* Área */}
        <div>
          <label className="block mb-1 font-medium">Área *</label>

          <select
            value={area}
            required
            onChange={(e) =>
              setArea(e.target.value ? Number(e.target.value) : "")
            }
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Seleccionar</option>

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
            <option value="mantenimiento">Mantenimiento</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex gap-2 pt-4">

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
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