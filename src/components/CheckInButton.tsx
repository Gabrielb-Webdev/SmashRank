'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CheckInButtonProps {
  tournamentId: string
  isCheckedIn: boolean
  canCheckIn: boolean
  checkInMessage?: string
}

export default function CheckInButton({
  tournamentId,
  isCheckedIn,
  canCheckIn,
  checkInMessage
}: CheckInButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleCheckIn = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/checkin`, {
        method: 'POST'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al hacer check-in')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  if (isCheckedIn) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500 rounded-lg">
        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-green-400 font-medium">¡Estás registrado!</span>
      </div>
    )
  }

  if (!canCheckIn) {
    return (
      <div className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400 text-sm">
        {checkInMessage || 'Check-in no disponible'}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleCheckIn}
        disabled={loading}
        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
      >
        {loading ? 'Procesando...' : 'Hacer Check-in'}
      </button>
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  )
}
