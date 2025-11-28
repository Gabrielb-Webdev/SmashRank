'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateTournamentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      game: formData.get('game'),
      maxPlayers: parseInt(formData.get('maxPlayers') as string),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      region: 'Argentina', // Siempre Argentina
      entryFee: parseFloat(formData.get('entryFee') as string) || 0,
      prizePool: formData.get('prizePool'),
      rules: formData.get('rules')
    }

    try {
      const res = await fetch('/api/admin/tournaments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        router.push('/admin/tournaments')
      } else {
        const error = await res.json()
        setError(error.error || 'Error al crear torneo')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold font-poppins gradient-text mb-2">
            Crear Nuevo Torneo
          </h1>
          <p className="text-gray-400">Configura los detalles del torneo para Argentina</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre del Torneo *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Ej: Torneo Nacional Argentina 2024"
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Descripción *
              </label>
              <textarea
                name="description"
                required
                rows={3}
                placeholder="Describe el torneo, formato, premios, etc."
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Juego */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Juego *
              </label>
              <select
                name="game"
                required
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="Super Smash Bros. Ultimate">Super Smash Bros. Ultimate</option>
                <option value="Super Smash Bros. Melee">Super Smash Bros. Melee</option>
                <option value="Project M">Project M</option>
              </select>
            </div>

            {/* Max Participantes */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Máximo de Participantes *
              </label>
              <input
                type="number"
                name="maxPlayers"
                required
                min="2"
                max="256"
                defaultValue="32"
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  name="startDate"
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Fecha de Fin *
                </label>
                <input
                  type="date"
                  name="endDate"
                  required
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Entry Fee y Prize Pool */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Costo de Entrada (ARS)
                </label>
                <input
                  type="number"
                  name="entryFee"
                  min="0"
                  step="0.01"
                  defaultValue="0"
                  placeholder="0 para gratuito"
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Pozo de Premios
                </label>
                <input
                  type="text"
                  name="prizePool"
                  placeholder="Ej: $50,000 ARS"
                  className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Reglas */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Reglas del Torneo
              </label>
              <textarea
                name="rules"
                rows={5}
                placeholder="Define las reglas del torneo: formato, stocks, tiempo, mapas permitidos, etc."
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Region (readonly) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Región
              </label>
              <input
                type="text"
                value="🇦🇷 Argentina"
                disabled
                className="w-full px-4 py-3 bg-black/50 border border-gray-500/30 rounded-lg text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                SmashRank actualmente solo opera en Argentina
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
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
              {loading ? 'Creando...' : '🏆 Crear Torneo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
