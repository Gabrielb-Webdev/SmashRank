'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
      // Enviar con la zona horaria de Argentina explícita
      startDate: startTime ? `${startDate}T${startTime}:00-03:00` : `${startDate}T00:00:00-03:00`,
      endDate: endTime ? `${endDate}T${endTime}:00-03:00` : `${endDate}T23:59:59-03:00`,
      checkInTime: checkInTime ? `${startDate}T${checkInTime}:00-03:00` : `${startDate}T00:00:00-03:00`,
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
        router.refresh()
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

  const maxPlayersOptions = [4, 8, 16, 24, 32, 48, 64, 128, 256]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/tournaments" 
            className="text-purple-400 hover:text-purple-300 mb-4 inline-flex items-center gap-2 transition-all"
          >
            <span>←</span> Volver a Gestión de Torneos
          </Link>
          <h1 className="text-5xl font-extrabold font-poppins gradient-text mb-3 mt-4">
            ✨ Crear Nuevo Torneo
          </h1>
          <p className="text-gray-400 text-lg">Configura todos los detalles para tu torneo de Smash en Argentina</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl text-red-400 font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Información Básica */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-400 flex items-center gap-2">
              <span className="text-3xl">🎮</span> Información Básica
            </h2>
            
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-300">
                Nombre del Torneo *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Ej: TRUE COMBO WEEKLIES #45"
                className="input w-full"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-300">
                Descripción *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Describe el torneo, premios, reglas especiales, etc."
                className="input w-full resize-none"
              />
            </div>

            {/* Juego */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-300">
                🎯 Juego *
              </label>
              <select
                name="game"
                required
                defaultValue="Super Smash Bros. Ultimate"
                className="select-fancy w-full"
              >
                <option value="Super Smash Bros. Ultimate">Super Smash Bros. Ultimate</option>
                <option value="Super Smash Bros. Melee">Super Smash Bros. Melee</option>
                <option value="Project M">Project M</option>
              </select>
            </div>

            {/* Formato y Participantes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-300">
                  🏆 Formato de Bracket *
                </label>
                <select
                  name="format"
                  required
                  defaultValue="double"
                  className="select-fancy w-full"
                >
                  <option value="single">Single Elimination</option>
                  <option value="double">Double Elimination</option>
                </select>
                <p className="text-xs text-gray-500 mt-2 ml-1">
                  💡 Double es recomendado para torneos competitivos
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-300">
                  👥 Máximo de Participantes *
                </label>
                <select
                  name="maxPlayers"
                  required
                  defaultValue="32"
                  className="select-fancy w-full"
                >
                  {maxPlayersOptions.map(num => (
                    <option key={num} value={num}>{num} jugadores</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Fechas y Horarios */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-400 flex items-center gap-2">
              <span className="text-3xl">📅</span> Fechas y Horarios
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fecha de Inicio */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-300">
                  📆 Fecha de Inicio *
                </label>
                <input
                  type="date"
                  name="startDate"
                  required
                  className="date-input w-full"
                />
              </div>

              {/* Hora de Inicio */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-300">
                  🕐 Hora de Inicio *
                </label>
                <input
                  type="time"
                  name="startTime"
                  required
                  className="time-input w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fecha de Fin */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-300">
                  📆 Fecha de Fin (Opcional)
                </label>
                <input
                  type="date"
                  name="endDate"
                  className="date-input w-full"
                />
              </div>

              {/* Hora de Fin */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-300">
                  🕐 Hora de Fin (Opcional)
                </label>
                <input
                  type="time"
                  name="endTime"
                  className="time-input w-full"
                />
              </div>
            </div>

            {/* Check-in Time */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-300">
                ⏰ Hora de Check-in *
              </label>
              <input
                type="time"
                name="checkInTime"
                required
                className="time-input w-full md:w-1/2"
              />
              <p className="text-xs text-gray-500 mt-2 ml-1">
                💡 Los jugadores podrán hacer check-in 30 minutos antes de esta hora
              </p>
            </div>
          </div>

          {/* Ubicación y Costos */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-400 flex items-center gap-2">
              <span className="text-3xl">📍</span> Ubicación y Costos
            </h2>

            {/* Provincia */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-300">
                🗺️ Provincia *
              </label>
              <select
                name="region"
                required
                defaultValue="Buenos Aires"
                className="select-fancy w-full"
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
            </div>

            {/* Entry Fee y Prize Pool */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-300">
                  💵 Costo de Entrada (ARS)
                </label>
                <input
                  type="number"
                  name="entryFee"
                  min="0"
                  step="0.01"
                  defaultValue="0"
                  placeholder="0 = Gratis"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-300">
                  🏅 Pozo de Premios
                </label>
                <input
                  type="text"
                  name="prizePool"
                  placeholder="Ej: $50,000 ARS"
                  className="input w-full"
                />
              </div>
            </div>
          </div>

          {/* Reglas */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-400 flex items-center gap-2">
              <span className="text-3xl">📋</span> Reglas del Torneo
            </h2>
            
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-300">
                Reglas (Opcional)
              </label>
              <textarea
                name="rules"
                rows={6}
                placeholder="Define las reglas: formato (3 stocks, 7 min), stages permitidos, DSR, coaching, etc."
                className="input w-full resize-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-purple-500/20">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              ❌ Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Creando...
                </span>
              ) : (
                '🏆 Crear Torneo'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
