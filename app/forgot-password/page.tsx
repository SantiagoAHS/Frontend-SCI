"use client"

import { useState } from "react"
import { API_URL } from "@/config/api"

export default function ForgotPasswordPage() {

  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setError("")
    setMessage("")

    const res = await fetch(`${API_URL}/send-reset-password-email/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()

    if (res.ok) {
      setMessage("📩 Revisa tu correo para recuperar tu contraseña")
    } else {
      setError(data.error || "Error")
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">

        <h1 className="text-2xl font-bold mb-6">
          Recuperar contraseña
        </h1>

        <input
          type="email"
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        />

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <button className="w-full bg-black text-white py-2 rounded">
          Enviar
        </button>

      </form>
    </div>
  )
}