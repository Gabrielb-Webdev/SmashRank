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

            {/* Provincia */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Provincia *
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="">Selecciona tu provincia</option>
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
