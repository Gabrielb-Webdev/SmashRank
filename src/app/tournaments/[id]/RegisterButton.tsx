'use client'

import { useState } from 'react'

export default function RegisterButton({ tournamentId }: { tournamentId: string }) {
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)

  async function handleRegister() {
    setLoading(true)
    try {
      const res = await fetch('/api/tournaments/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId })
      })

      if (res.ok) {
        setRegistered(true)
        window.location.reload()
      } else {
        const data = await res.json()
        alert(data.error || 'Error al registrarse')
      }
    } catch (error) {
      alert('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (registered) {
    return (
      <div className="text-center">
        <div className="text-4xl mb-3">✅</div>
        <p className="text-green-400 font-semibold">¡Registrado exitosamente!</p>
      </div>
    )
  }

  return (
    <button
      onClick={handleRegister}
      disabled={loading}
      className="btn-primary w-full"
    >
      {loading ? 'Registrando...' : 'Inscribirme'}
    </button>
  )
}
