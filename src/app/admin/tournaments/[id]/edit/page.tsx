'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EditTournamentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [tournament, setTournament] = useState<any>(null)

  useEffect(() => {
    async function loadTournament() {
      try {
        const res = await fetch(`/api/tournaments/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setTournament(data)
        } else {
          setError('Torneo no encontrado')
        }
      } catch (err) {
        setError('Error al cargar torneo')
      } finally {
        setLoadingData(false)
      }
    }
    loadTournament()
  }, [params.id])

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
      endDate: endTime && endDate ? `${endDate}T${endTime}:00` : null,
      checkInTime: checkInTime ? `${startDate}T${checkInTime}:00` : startDate,
      entryFee: parseFloat(formData.get('entryFee') as string) || 0,
      prizePool: formData.get('prizePool'),
      rules: formData.get('rules')
    }

    try {
      const res = await fetch(`/api/admin/tournaments/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        alert('✅ Torneo actualizado exitosamente')
        router.push('/admin/tournaments')
      } else {
        const error = await res.json()
        setError(error.error || 'Error al actualizar torneo')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando torneo...</p>
        </div>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'Torneo no encontrado'}</p>
          <Link href="/admin/tournaments" className="btn-primary">
            Volver
          </Link>
        </div>
      </div>
    )
  }

  // Extraer fecha y hora
  const startDateTime = new Date(tournament.startDate)
  const endDateTime = tournament.endDate ? new Date(tournament.endDate) : null
  const checkInDateTime = new Date(tournament.checkInTime)

  const startDateStr = startDateTime.toISOString().split('T')[0]
  const startTimeStr = startDateTime.toTimeString().slice(0, 5)
  const endDateStr = endDateTime ? endDateTime.toISOString().split('T')[0] : ''
  const endTimeStr = endDateTime ? endDateTime.toTimeString().slice(0, 5) : ''
  const checkInTimeStr = checkInDateTime.toTimeString().slice(0, 5)

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <Link href="/admin/tournaments" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
            ← Volver a Gestión de Torneos
          </Link>
          <h1 className="text-4xl font-extrabold font-poppins gradient-text mb-2">
            Editar Torneo
          </h1>
          <p className="text-gray-400">{tournament.name}</p>
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
                defaultValue={tournament.name}
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
                defaultValue={tournament.description}
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
                defaultValue={tournament.game}
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
                defaultValue={tournament.format}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="single">Single Elimination</option>
                <option value="double">Double Elimination</option>
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
                defaultValue={tournament.maxPlayers}
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
                    defaultValue={startDateStr}
                    className="px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="time"
                    name="startTime"
                    required
                    defaultValue={startTimeStr}
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
                    defaultValue={endDateStr}
                    className="px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="time"
                    name="endTime"
                    defaultValue={endTimeStr}
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
                defaultValue={checkInTimeStr}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
              />
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
                  defaultValue={tournament.entryFee}
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
                  defaultValue={tournament.prizePool || ''}
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
                defaultValue={tournament.rules || ''}
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
              />
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
              {loading ? 'Guardando...' : '💾 Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
