"use client"

import { useEffect, useState } from "react"

export default function UsuariosPage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token")

      try {
        const response = await fetch("http://127.0.0.1:8000/api/dashboard/stats/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Error ${response.status}`)
        }

        const result = await response.json()
        setData(result)

      } catch (err: any) {
        setError(err.message)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Prueba API Dashboard</h1>

      {error && (
        <p className="text-red-500 mt-4">
          Error: {error}
        </p>
      )}

      {data && (
        <pre className="mt-4 bg-gray-100 p-4 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  )
}