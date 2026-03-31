"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { API_URL } from "@/config/api"

export default function ResetPasswordPage() {

  const { token } = useParams()
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const res = await fetch(`${API_URL}/reset-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      setMessage("✅ Contraseña actualizada correctamente")
    } else {
      setError(data.error || "Error")
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">

      <form onSubmit={handleSubmit} className="w-full max-w-sm">

        <h1 className="text-2xl font-bold mb-6">
          Nueva contraseña
        </h1>

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        />

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <button className="w-full bg-black text-white py-2 rounded">
          Cambiar contraseña
        </button>

      </form>

    </div>
  )
}