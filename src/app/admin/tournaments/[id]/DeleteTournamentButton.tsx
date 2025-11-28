'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteTournamentButton({ tournamentId }: { tournamentId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('⚠️ ¿ELIMINAR TORNEO? Esta acción NO se puede deshacer. Se eliminarán todos los matches y participantes.')) {
      return
    }

    if (!confirm('¿Estás COMPLETAMENTE seguro? Escribe "ELIMINAR" para confirmar')) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/admin/tournaments/${tournamentId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        alert('✅ Torneo eliminado')
        router.push('/admin/tournaments')
      } else {
        const data = await res.json()
        alert(data.error || 'Error al eliminar torneo')
      }
    } catch (error) {
      alert('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors disabled:opacity-50"
    >
      {loading ? 'Eliminando...' : '🗑️ Eliminar Torneo'}
    </button>
  )
}
