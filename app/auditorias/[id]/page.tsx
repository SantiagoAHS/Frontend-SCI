"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function AuditoriaPage() {

  const params = useParams()
  const id = params.id

  const [auditoria, setAuditoria] = useState(null)
  const [areas, setAreas] = useState([])
  const [loadingFinalizar, setLoadingFinalizar] = useState(false)

  // 🔹 fetch auditoría
  const fetchAuditoria = async () => {
    const token = localStorage.getItem("token")

    const res = await fetch(`http://localhost:8000/api/auditoria/${id}/`, {
      headers: { Authorization: `Token ${token}` },
    })

    const data = await res.json()
    setAuditoria(data)
  }

  // 🔹 fetch áreas
  const fetchAreas = async () => {
    const token = localStorage.getItem("token")

    const res = await fetch("http://localhost:8000/api/areas/list/?activas=true", {
      headers: { Authorization: `Token ${token}` },
    })

    const data = await res.json()
    setAreas(data)
  }

  useEffect(() => {
    fetchAuditoria()
    fetchAreas()
  }, [])

  const getAreaNombre = (id) => {
    const area = areas.find(a => a.id === id)
    return area ? area.nombre : "Sin dato"
  }

  // 🔹 PATCH detalle
  const actualizarDetalle = async (item) => {
    const token = localStorage.getItem("token")

    await fetch(`http://localhost:8000/api/auditoria/detalle/${item.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        estado_real: item.estado_real,
        area_real: item.area_real,
        encontrado: item.encontrado,
      }),
    })

    fetchAuditoria()
  }

  // 🔹 FINALIZAR
  const finalizarAuditoria = async () => {
    const token = localStorage.getItem("token")
    setLoadingFinalizar(true)

    await fetch(`http://localhost:8000/api/auditoria/finalizar/${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Token ${token}`,
      },
    })

    fetchAuditoria()
    setLoadingFinalizar(false)
  }

  // 🔹 manejar cambios locales (IMPORTANTE FIX)
  const handleChange = (index, field, value) => {
    const copia = [...auditoria.detalles]

    copia[index] = {
      ...copia[index],
      [field]: value,
      resultado: "" // 🔥 evita falsos positivos antes de guardar
    }

    setAuditoria({ ...auditoria, detalles: copia })
  }

  const getEstadoVisual = (item) => {
    if (!item.estado_real) return "🟡 Pendiente"
    if (item.resultado === "correcto") return "🟢 Correcto"
    if (item.resultado === "incorrecto") return "🔴 Incorrecto"
    return "🟡 Pendiente"
  }

  // 🔥 RESUMEN CORRECTO
  const resumen = auditoria?.detalles.reduce(
    (acc, item) => {
      if (!item.estado_real || !item.resultado) {
        acc.pendientes++
      } else if (item.resultado === "correcto") {
        acc.correctos++
      } else if (item.resultado === "incorrecto") {
        acc.incorrectos++
      }
      return acc
    },
    { correctos: 0, incorrectos: 0, pendientes: 0 }
  )

  if (!auditoria) return <p>Cargando...</p>

  const bloqueado = auditoria.estado === "finalizada"
  const puedeFinalizar = resumen.pendientes === 0

  return (
    <div style={{ padding: 20 }}>
      <h1>{auditoria.nombre}</h1>

      {/* 🔥 RESUMEN */}
      <div style={{ marginBottom: 20 }}>
        <p>🟢 Correctos: {resumen.correctos}</p>
        <p>🔴 Incorrectos: {resumen.incorrectos}</p>
        <p>🟡 Pendientes: {resumen.pendientes}</p>
      </div>

      {/* 🔥 BOTÓN FINALIZAR (SIEMPRE VISIBLE Y CORRECTO) */}
      <button
        onClick={finalizarAuditoria}
        disabled={bloqueado || loadingFinalizar || !puedeFinalizar}
        style={{
          marginBottom: 20,
          backgroundColor: bloqueado
            ? "#16a34a"
            : !puedeFinalizar
            ? "#ccc"
            : "#16a34a",
          color: "white",
          padding: "10px 15px",
          borderRadius: 6,
          cursor:
            bloqueado || !puedeFinalizar ? "not-allowed" : "pointer"
        }}
      >
        {bloqueado
          ? "✅ Auditoría finalizada"
          : loadingFinalizar
          ? "Finalizando..."
          : !puedeFinalizar
          ? "Completa todos los activos"
          : "Finalizar Auditoría"}
      </button>

      {/* 🔥 LISTA */}
      {auditoria.detalles.map((item, index) => {

        // 🔥 SOLO se considera guardado si backend ya procesó resultado
        const yaGuardado = item.resultado !== ""

        return (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: 15,
              marginTop: 10,
              borderRadius: 8
            }}
          >
            <h3>{item.activo_nombre}</h3>

            <p>
              📊 Sistema: {item.estado_sistema || "Sin dato"} - {getAreaNombre(item.area_sistema)}
            </p>

            <p>
              🧾 Real: {item.estado_real || "Sin dato"} - {getAreaNombre(item.area_real)}
            </p>

            {/* 🔹 INPUTS */}
            {!bloqueado && !yaGuardado && (
              <>
                <select
                  value={item.estado_real || ""}
                  onChange={(e) =>
                    handleChange(index, "estado_real", e.target.value)
                  }
                >
                  <option value="">Estado</option>
                  <option value="disponible">Disponible</option>
                  <option value="asignado">Asignado</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="baja">Baja</option>
                </select>

                <select
                  value={item.area_real || ""}
                  onChange={(e) =>
                    handleChange(index, "area_real", Number(e.target.value))
                  }
                >
                  <option value="">Área</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
                    </option>
                  ))}
                </select>

                <input
                  type="checkbox"
                  checked={item.encontrado}
                  onChange={(e) =>
                    handleChange(index, "encontrado", e.target.checked)
                  }
                />

                <button onClick={() => actualizarDetalle(item)}>
                  Guardar
                </button>
              </>
            )}

            {/* 🔥 YA GUARDADO */}
            {yaGuardado && !bloqueado && (
              <p style={{ color: "green" }}>✔ Guardado</p>
            )}

            <p style={{ marginTop: 10 }}>
              <b>{getEstadoVisual(item)}</b>
            </p>
          </div>
        )
      })}
    </div>
  )
}