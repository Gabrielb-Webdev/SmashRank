'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function GenerateBracketButton({ tournamentId }: { tournamentId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    if (!confirm('¿Generar bracket? Solo participantes con check-in serán incluidos.')) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/admin/tournaments/${tournamentId}/generate-bracket`, {
        method: 'POST'
      })

      if (res.ok) {
        const data = await res.json()
        alert(`✅ Bracket generado! ${data.matchesCreated} matches creados.`)
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'Error al generar bracket')
      }
    } catch (error) {
      alert('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleGenerate}
      disabled={loading}
      className="btn-primary w-full"
    >
      {loading ? 'Generando...' : '🏆 Generar Bracket'}
    </button>
  )
}
