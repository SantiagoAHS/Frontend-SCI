"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

const API_URL = "http://127.0.0.1:8000/api"

export default function VerifyEmailPage() {
  const { token } = useParams()
  const [message, setMessage] = useState("Verificando...")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) return

    fetch(`${API_URL}/verify-email/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setMessage(data.message)
          setSuccess(true)
        } else {
          setMessage(data.error || "Error")
        }
      })
      .catch(() => {
        setMessage("Error del servidor")
      })
  }, [token])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 bg-white rounded-xl shadow text-center">

        <h1 className="text-xl font-bold mb-3">
          {success ? "✅ Éxito" : "❌ Error"}
        </h1>

        <p>{message}</p>

      </div>
    </div>
  )
}