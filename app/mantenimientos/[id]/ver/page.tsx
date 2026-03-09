"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function VerMantenimiento() {

  const { id } = useParams()
  const [data, setData] = useState<any>(null)

  useEffect(() => {

    const fetchData = async () => {

      const token = localStorage.getItem("token")

      const res = await fetch("http://localhost:8000/api/mantenimientos/list/", {
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
    <div className="p-8 max-w-xl space-y-4">

      <h1 className="text-xl font-bold">
        Detalle de mantenimiento
      </h1>

      <div><b>Activo:</b> {data.activo}</div>
      <div><b>Tipo:</b> {data.tipo}</div>
      <div><b>Estado:</b> {data.estado}</div>
      <div><b>Fecha ingreso:</b> {data.fecha_ingreso}</div>
      <div><b>Fecha finalización:</b> {data.fecha_finalizacion || "-"}</div>
      <div><b>Responsable:</b> {data.responsable}</div>
      <div><b>Costo:</b> {data.costo || "-"}</div>

      <div>
        <b>Descripción:</b>
        <p className="mt-1 text-sm text-muted-foreground">
          {data.descripcion_problema || "Sin descripción"}
        </p>
      </div>

    </div>
  )
}