"use client"

import { API_URL } from "@/config/api"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function VerMantenimiento() {

  const { id } = useParams()
  const [data, setData] = useState<any>(null)

  useEffect(() => {

    const fetchData = async () => {

      const token = localStorage.getItem("token")

      const res = await fetch(`${API_URL}/mantenimientos/list/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      const lista = await res.json()
      const mantenimiento = lista.find((m:any) => m.id == id)

      setData(mantenimiento)
    }

    fetchData()

  }, [id])

  if (!data) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-8 flex justify-center">

      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 space-y-6">

        <h1 className="text-2xl font-bold text-gray-800">
          Detalle de mantenimiento
        </h1>

        {/* INFO GRID */}
        <div className="grid grid-cols-2 gap-4 text-sm">

          <div>
            <p className="text-gray-500">Activo</p>
            <p className="font-medium">{data.activo}</p>
          </div>

          <div>
            <p className="text-gray-500">Tipo</p>
            <p className="font-medium capitalize">{data.tipo}</p>
          </div>

          <div>
            <p className="text-gray-500">Estado</p>
            <span className={`px-2 py-1 rounded text-xs font-semibold
              ${data.estado === "completado" ? "bg-green-100 text-green-700" :
                data.estado === "en_proceso" ? "bg-yellow-100 text-yellow-700" :
                data.estado === "cancelado" ? "bg-red-100 text-red-700" :
                "bg-blue-100 text-blue-700"}
            `}>
              {data.estado}
            </span>
          </div>

          <div>
            <p className="text-gray-500">Costo</p>
            <p className="font-medium">
              {data.costo ? `$${data.costo}` : "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Fecha ingreso</p>
            <p className="font-medium">{data.fecha_ingreso}</p>
          </div>

          <div>
            <p className="text-gray-500">Fecha finalización</p>
            <p className="font-medium">
              {data.fecha_finalizacion || "-"}
            </p>
          </div>

          <div className="col-span-2">
            <p className="text-gray-500">Responsable</p>
            <p className="font-medium">{data.responsable}</p>
          </div>

        </div>

        {/* DESCRIPCIÓN */}
        <div>
          <p className="text-gray-500 text-sm mb-1">Descripción</p>
          <div className="bg-gray-50 border rounded-lg p-3 text-sm text-gray-700">
            {data.descripcion_problema || "Sin descripción"}
          </div>
        </div>

        {/* COMPROBANTE */}
        <div>
          <p className="text-gray-500 text-sm mb-2">Comprobante</p>

          {data.comprobante ? (
            <div className="flex items-center justify-between bg-gray-50 border rounded-lg p-3">

              <div className="flex items-center gap-2">
                📄
                <span className="text-sm text-gray-700">
                  Archivo disponible
                </span>
              </div>

              <div className="flex gap-2">
                <a
                  href={data.comprobante}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition"
                >
                  Ver
                </a>

                <a
                  href={data.comprobante}
                  download
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition"
                >
                  Descargar
                </a>
              </div>

            </div>
          ) : (
            <div className="bg-gray-50 border rounded-lg p-3 text-sm text-gray-500">
              No hay comprobante disponible
            </div>
          )}

        </div>

      </div>

    </div>
  )
}