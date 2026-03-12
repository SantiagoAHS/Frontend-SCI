"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  rol: string;
}

interface Opcion {
  nombre: string;
}

interface Caracteristica {
  nombre: string
  tipo_dato: string
  obligatorio: boolean
  tamano?: number
  opciones?: Opcion[]
}

export default function CreateTipoActivoPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");

  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([
    {
      nombre: "",
      tipo_dato: "texto",
      obligatorio: false,
      tamano: undefined,
      opciones: [],
    },
  ])

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      setAuthorized(false);
      return;
    }

    const parsed = JSON.parse(user) as User;
    setAuthorized(parsed.rol === "admin");
  }, []);

  const handleCaracteristicaChange = (
    index: number,
    field: keyof Caracteristica,
    value: any
  ) => {
    const updated = [...caracteristicas];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setCaracteristicas(updated);
  };

  const addCaracteristica = () => {
    setCaracteristicas([
      ...caracteristicas,
      {
        nombre: "",
        tipo_dato: "texto",
        obligatorio: false,
        tamano: undefined,
        opciones: [],
      },
    ])
  }

  const removeCaracteristica = (index: number) => {
    const updated = [...caracteristicas];
    updated.splice(index, 1);
    setCaracteristicas(updated);
  };

  // OPCIONES
  const addOpcion = (index: number) => {
    const updated = [...caracteristicas];
    updated[index].opciones = [...(updated[index].opciones || []), { nombre: "" }];
    setCaracteristicas(updated);
  };

  const removeOpcion = (index: number, opcionIndex: number) => {
    const updated = [...caracteristicas];
    updated[index].opciones?.splice(opcionIndex, 1);
    setCaracteristicas(updated);
  };

  const handleOpcionChange = (
    index: number,
    opcionIndex: number,
    value: string
  ) => {
    const updated = [...caracteristicas];
    if (!updated[index].opciones) return;

    updated[index].opciones![opcionIndex].nombre = value;
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
          caracteristicas: caracteristicas
            .filter((c) => c.nombre.trim() !== "")
            .map((c) => ({
              ...c,
              opciones:
                c.tipo_dato === "select"
                  ? c.opciones?.filter((o) => o.nombre.trim() !== "")
                  : [],
            })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || data.error || "Error al crear tipo de activo");
        setLoading(false);
        return;
      }

      router.push("/ajustes/tipoactivos");
    } catch (e) {
      setError("Error de conexión");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (authorized === null)
    return <div className="p-6">Verificando permisos...</div>;

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

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Nombre */}
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

        {/* Características */}
        <div>
          <label className="block mb-3 font-medium">Características *</label>

          {caracteristicas.map((c, i) => (
            <div key={i} className="border p-3 rounded mb-3 space-y-3 bg-gray-50">

              {/* Nombre */}
              <input
                type="text"
                placeholder="Nombre de la característica"
                value={c.nombre}
                onChange={(e) =>
                  handleCaracteristicaChange(i, "nombre", e.target.value)
                }
                required
                className="w-full border px-3 py-2 rounded"
              />

              {/* Tipo de dato */}
              <select
                value={c.tipo_dato}
                onChange={(e) => {
                  const value = e.target.value

                  const updated = [...caracteristicas]

                  updated[i] = {
                    ...updated[i],
                    tipo_dato: value,

                    // limpiar datos que no corresponden
                    tamano:
                      value === "text" || value === "int" || value === "float"
                        ? updated[i].tamano
                        : undefined,

                    opciones: value === "select" ? updated[i].opciones || [] : [],
                  }

                  setCaracteristicas(updated)
                }}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="text">Texto</option>
                <option value="int">Número entero</option>
                <option value="float">Número decimal</option>
                <option value="date">Fecha</option>
                <option value="boolean">Booleano</option>
                <option value="select">Selección</option>
              </select>

              {/* Tamaño solo para texto y números */}
              {(c.tipo_dato === "text" ||
                c.tipo_dato === "int" ||
                c.tipo_dato === "float") && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tamaño máximo
                  </label>

                  <input
                    type="number"
                    placeholder="Ej: 50"
                    value={c.tamano || ""}
                    onChange={(e) =>
                      handleCaracteristicaChange(
                        i,
                        "tamano",
                        Number(e.target.value)
                      )
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              )}

              {/* Obligatorio */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={c.obligatorio}
                  onChange={(e) =>
                    handleCaracteristicaChange(
                      i,
                      "obligatorio",
                      e.target.checked
                    )
                  }
                />
                Obligatoria
              </label>

              {/* OPCIONES SI ES SELECT */}
              {c.tipo_dato === "select" && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Opciones</p>

                  {c.opciones?.map((op, opIndex) => (
                    <div key={opIndex} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nombre de opción"
                        value={op.nombre}
                        onChange={(e) =>
                          handleOpcionChange(i, opIndex, e.target.value)
                        }
                        className="flex-1 border px-3 py-2 rounded"
                      />

                      <button
                        type="button"
                        onClick={() => removeOpcion(i, opIndex)}
                        className="px-3 bg-red-600 text-white rounded"
                      >
                        X
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addOpcion(i)}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    + Agregar opción
                  </button>
                </div>
              )}

              {/* Eliminar característica */}
              {caracteristicas.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCaracteristica(i)}
                  className="px-3 py-2 bg-red-600 text-white rounded"
                >
                  Eliminar característica
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addCaracteristica}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Agregar Característica
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
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