'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import CharacterSelector from '@/components/CharacterSelector'

export default function EditProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [characters, setCharacters] = useState<string[]>([])
  const [gamertag, setGamertag] = useState('')
  const [region, setRegion] = useState('Argentina')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    async function loadUserData() {
      try {
        const res = await fetch('/api/user/profile')
        if (res.ok) {
          const data = await res.json()
          setGamertag(data.gamertag || '')
          setRegion(data.region || 'Argentina')
          if (data.mainCharacter) {
            setCharacters(data.mainCharacter.split(',').filter((c: string) => c.trim()))
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoadingData(false)
      }
    }

    if (status === 'authenticated') {
      loadUserData()
    }
  }, [status])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const data = {
      gamertag,
      mainCharacter: characters.join(','),
      region
    }

    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        alert('✅ Perfil actualizado exitosamente')
        router.push('/dashboard')
        router.refresh()
      } else {
        const error = await res.json()
        alert(error.error || 'Error al actualizar perfil')
      }
    } catch (error) {
      alert('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold font-poppins gradient-text mb-2">
            Editar Perfil
          </h1>
          <p className="text-gray-400">Actualiza tu información de jugador</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8">
          <div className="space-y-6">
            {/* Gamertag */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Gamertag *
              </label>
              <input
                type="text"
                value={gamertag}
                onChange={(e) => setGamertag(e.target.value)}
                required
                placeholder="Tu nombre de jugador"
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Character Selector */}
            <CharacterSelector
              value={characters}
              onChange={setCharacters}
              maxSelections={3}
              label="Mains / Secundarios"
            />

            {/* Region */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Región
              </label>
              <input
                type="text"
                value={region}
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
              {loading ? 'Guardando...' : '💾 Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
