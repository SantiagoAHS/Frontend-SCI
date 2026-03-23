"use client"

import { useEffect, useState } from "react"

export default function AuditoriaPage() {

  const [auditoria, setAuditoria] = useState(null)

  useEffect(() => {

    const fetchAuditoria = async () => {
      const token = localStorage.getItem("token")

      try {
        const res = await fetch("http://localhost:8000/api/auditoria/3/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (!res.ok) {
          console.log("Error:", res.status)
          return
        }

        const data = await res.json()
        console.log("DATA:", data) // DEBUG
        setAuditoria(data)

      } catch (error) {
        console.error(error)
      }
    }

    fetchAuditoria()

  }, [])

  if (!auditoria) return <p>Cargando...</p>

  // 🔹 Función para mostrar estado visual
  const getEstadoVisual = (item) => {
    if (!item.estado_real) return { text: "🟡 Pendiente", color: "orange" }
    if (item.resultado === "correcto") return { text: "🟢 Correcto", color: "green" }
    return { text: "🔴 Incorrecto", color: "red" }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{auditoria.nombre}</h1>

      {auditoria.detalles?.map((item) => {
        const estado = getEstadoVisual(item)

        return (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 10,
              padding: 15,
              marginBottom: 10
            }}
          >
            <h3>{item.activo_nombre}</h3>

            <p><b>Estado sistema:</b> {item.estado_sistema || "Sin dato"}</p>
            <p><b>Área sistema:</b> {item.area_sistema || "Sin dato"}</p>

            <p style={{ color: estado.color }}>
              <b>Resultado:</b> {estado.text}
            </p>

            {item.observaciones && (
              <p><b>Observaciones:</b> {item.observaciones}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}