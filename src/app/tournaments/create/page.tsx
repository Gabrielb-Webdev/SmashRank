'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function CreateTournamentPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    format: 'double',
    maxPlayers: 32,
    starterStages: ['Battlefield', 'Final Destination', 'Pokemon Stadium 2', 'Smashville', 'Town & City'],
    cpStages: ['Kalos Pokemon League', 'Hollow Bastion', 'Small Battlefield'],
    bannedStages: [],
    pointsConfig: {
      '1': 100,
      '2': 75,
      '3': 50,
      '4': 35,
      '5': 25,
      '7': 15,
      '9': 10
    }
  })

  if (session?.user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="card p-12 text-center max-w-md mx-auto">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-2xl font-bold font-poppins mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-400">
            Solo los administradores pueden crear torneos.
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al crear torneo')
      }

      router.push(`/tournaments/${data.id}`)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-poppins gradient-text mb-4">
          Crear Torneo
        </h1>
        <p className="text-gray-400 text-lg">
          Configura un nuevo torneo de Super Smash Bros Ultimate
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="card">
          <h2 className="text-xl font-bold font-poppins mb-6 gradient-text">
            Información Básica
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Nombre del Torneo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="TRUE COMBO WEEKLIES #45"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Fecha de Inicio *
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Máximo de Jugadores *
                </label>
                <select
                  value={formData.maxPlayers}
                  onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })}
                  className="input"
                >
                  <option value={8}>8 jugadores</option>
                  <option value={16}>16 jugadores</option>
                  <option value={32}>32 jugadores</option>
                  <option value={64}>64 jugadores</option>
                  <option value={128}>128 jugadores</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Formato *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, format: 'single' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.format === 'single'
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-gray-700 hover:border-gray-600 text-gray-400'
                  }`}
                >
                  <div className="font-bold mb-1">Single Elimination</div>
                  <div className="text-xs">Una oportunidad</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, format: 'double' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.format === 'double'
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-gray-700 hover:border-gray-600 text-gray-400'
                  }`}
                >
                  <div className="font-bold mb-1">Double Elimination</div>
                  <div className="text-xs">Winner's + Loser's bracket</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stage Selection */}
        <div className="card">
          <h2 className="text-xl font-bold font-poppins mb-6 gradient-text">
            Stages Permitidos
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Starter Stages (para Game 1)
              </label>
              <div className="text-sm text-gray-400 mb-2">
                Stages seleccionados: {formData.starterStages.join(', ')}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Counterpick Stages
              </label>
              <div className="text-sm text-gray-400 mb-2">
                Stages seleccionados: {formData.cpStages.join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Points Distribution */}
        <div className="card">
          <h2 className="text-xl font-bold font-poppins mb-6 gradient-text">
            Distribución de Puntos
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(formData.pointsConfig).map(([place, points]) => (
              <div key={place}>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  {place === '1' ? '🥇' : place === '2' ? '🥈' : place === '3' ? '🥉' : `#${place}`} Lugar
                </label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setFormData({
                    ...formData,
                    pointsConfig: {
                      ...formData.pointsConfig,
                      [place]: parseInt(e.target.value) || 0
                    }
                  })}
                  className="input"
                  min="0"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary flex-1"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary flex-1"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Torneo'}
          </button>
        </div>
      </form>
    </div>
  )
}
