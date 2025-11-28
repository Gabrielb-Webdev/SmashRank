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
    
    // Combinar fecha y hora
    const startDate = formData.get('startDate') as string
    const startTime = formData.get('startTime') as string
    const endDate = formData.get('endDate') as string
    const endTime = formData.get('endTime') as string
    const checkInTime = formData.get('checkInTime') as string
    
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      game: formData.get('game'),
      format: formData.get('format'),
      maxPlayers: parseInt(formData.get('maxPlayers') as string),
      startDate: startTime ? `${startDate}T${startTime}:00` : startDate,
      endDate: endTime ? `${endDate}T${endTime}:00` : endDate,
      checkInTime: checkInTime ? `${startDate}T${checkInTime}:00` : startDate,
      region: formData.get('region'),
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

            {/* Formato de Bracket */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Formato de Bracket *
              </label>
              <select
                name="format"
                required
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="single">Single Elimination</option>
                <option value="double">Double Elimination</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Single: eliminación directa | Double: bracket de ganadores y perdedores
              </p>
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
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    name="startDate"
                    required
                    className="px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="time"
                    name="startTime"
                    required
                    className="px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Fecha de Fin
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    name="endDate"
                    className="px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="time"
                    name="endTime"
                    className="px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Check-in Time */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Hora de Check-in *
              </label>
              <input
                type="time"
                name="checkInTime"
                required
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Los jugadores deben hacer check-in a esta hora el día del torneo
              </p>
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

            {/* Provincia */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Provincia *
              </label>
              <select
                name="region"
                required
                defaultValue="Buenos Aires"
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="Buenos Aires">Buenos Aires</option>
                <option value="Ciudad Autónoma de Buenos Aires">Ciudad Autónoma de Buenos Aires (CABA)</option>
                <option value="Catamarca">Catamarca</option>
                <option value="Chaco">Chaco</option>
                <option value="Chubut">Chubut</option>
                <option value="Córdoba">Córdoba</option>
                <option value="Corrientes">Corrientes</option>
                <option value="Entre Ríos">Entre Ríos</option>
                <option value="Formosa">Formosa</option>
                <option value="Jujuy">Jujuy</option>
                <option value="La Pampa">La Pampa</option>
                <option value="La Rioja">La Rioja</option>
                <option value="Mendoza">Mendoza</option>
                <option value="Misiones">Misiones</option>
                <option value="Neuquén">Neuquén</option>
                <option value="Río Negro">Río Negro</option>
                <option value="Salta">Salta</option>
                <option value="San Juan">San Juan</option>
                <option value="San Luis">San Luis</option>
                <option value="Santa Cruz">Santa Cruz</option>
                <option value="Santa Fe">Santa Fe</option>
                <option value="Santiago del Estero">Santiago del Estero</option>
                <option value="Tierra del Fuego">Tierra del Fuego</option>
                <option value="Tucumán">Tucumán</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Selecciona la provincia donde se realizará el torneo
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
