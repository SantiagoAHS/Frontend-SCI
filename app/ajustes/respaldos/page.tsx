"use client"

import { useEffect, useState } from "react"

export default function BackupsPage() {

  const [backups, setBackups] = useState([])
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(null)

  const API_URL = "http://localhost:8000/api"

  // 🔹 Verificar rol
  const checkUser = async () => {
    const token = localStorage.getItem("token")

    try {
      const res = await fetch(`${API_URL}/perfil/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!res.ok) {
        setIsAdmin(false)
        return
      }

      const data = await res.json()
      setIsAdmin(data.rol === "admin")

    } catch (error) {
      console.error(error)
      setIsAdmin(false)
    }
  }

  // 🔹 Obtener historial
  const fetchBackups = async () => {
    const token = localStorage.getItem("token")

    try {
      const res = await fetch(`${API_URL}/backup/historial/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!res.ok) {
        const text = await res.text()
        console.error("Error historial:", text)
        return
      }

      const data = await res.json()
      setBackups(data)

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (isAdmin) {
      fetchBackups()
    }
  }, [isAdmin])

  // 🔹 Generar backup
  const generarBackup = async () => {
    const token = localStorage.getItem("token")

    if (!password) {
      alert("Debes ingresar tu contraseña")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/backup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ password }),
      })

      const text = await res.text()

      if (!res.ok) {
        console.error(text)
        alert("❌ Error al generar backup")
        setLoading(false)
        return
      }

      alert("✅ Backup generado")
      setPassword("")
      fetchBackups()

    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  // 🔹 Descargar (NUEVO - seguro)
  const descargarBackup = async (id, nombre) => {
    const token = localStorage.getItem("token")

    try {
      const res = await fetch(`${API_URL}/backup/descargar/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!res.ok) {
        const data = await res.json()
        alert("❌ " + (data.error || "No se pudo descargar"))
        return
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = nombre
      document.body.appendChild(a)
      a.click()
      a.remove()

      // 🔄 Refrescar lista (para bloquear botón)
      fetchBackups()

    } catch (error) {
      console.error(error)
    }
  }

  // 🔒 Si no es admin
  if (isAdmin === false) {
    return (
      <div style={{ padding: 20 }}>
        <h1>⛔ Acceso denegado</h1>
        <p>No tienes permisos para acceder a esta sección.</p>
      </div>
    )
  }

  // ⏳ Cargando rol
  if (isAdmin === null) {
    return <p style={{ padding: 20 }}>Cargando...</p>
  }

  return (
    <div style={{ padding: 20 }}>

      <h1>💾 Gestión de Backups</h1>

      {/* 🔐 Generar backup */}
      <div style={{
        border: "1px solid #ccc",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20
      }}>
        <h3>Generar Backup</h3>

        <input
          type="password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 8, marginRight: 10 }}
        />

        <button onClick={generarBackup} disabled={loading}>
          {loading ? "Generando..." : "Generar"}
        </button>
      </div>

      {/* 📄 Lista */}
      <div>
        <h3>Historial</h3>

        {backups.length === 0 && <p>No hay backups</p>}

        {backups.map((b) => (
          <div key={b.id} style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 15,
            marginBottom: 10
          }}>
            <p><b>Nombre:</b> {b.nombre}</p>
            <p><b>Usuario:</b> {b.usuario}</p>
            <p><b>Fecha:</b> {b.fecha}</p>

            {b.descargado ? (
              <p style={{ color: "red" }}>🔒 Ya descargado</p>
            ) : (
              <button onClick={() => descargarBackup(b.id, b.nombre)}>
                📥 Descargar
              </button>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}