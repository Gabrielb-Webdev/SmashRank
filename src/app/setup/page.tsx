'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSetup = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      // Paso 1: Crear las tablas
      const createTablesRes = await fetch('/api/setup/create-tables', {
        method: 'POST',
      })

      const createTablesData = await createTablesRes.json()

      if (!createTablesRes.ok) {
        setError('Error al crear tablas: ' + (createTablesData.error || createTablesData.details || 'Error desconocido'))
        console.error('Create tables error:', createTablesData)
        return
      }

      // Paso 2: Insertar datos iniciales
      const res = await fetch('/api/setup', {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al configurar la base de datos')
        console.error('Setup error:', data)
        return
      }

      setResult(data)
    } catch (err: any) {
      setError('Error de conexión: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6 relative">
            <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            <Image 
              src="/logo.svg" 
              alt="SmashRank" 
              width={120} 
              height={120}
              priority
              className="relative z-10"
            />
          </div>
          <h1 className="text-5xl font-extrabold font-poppins gradient-text mb-3">
            Setup Base de Datos
          </h1>
          <p className="text-gray-400 text-sm">
            Configura tu base de datos con un solo clic
          </p>
        </div>

        {/* Setup Card */}
        <div className="card p-8 shadow-2xl shadow-purple-500/20">
          {!result && !error && (
            <div className="text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🗄️</div>
                <h2 className="text-2xl font-bold mb-3">¿Listo para comenzar?</h2>
                <p className="text-gray-400 mb-6">
                  Este botón creará todas las tablas necesarias y datos iniciales en tu base de datos Neon.
                </p>
              </div>

              <button
                onClick={handleSetup}
                disabled={loading}
                className="btn-primary w-full text-lg py-4"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Configurando base de datos...
                  </span>
                ) : (
                  '🚀 Configurar Base de Datos'
                )}
              </button>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-left">
                <p className="font-semibold mb-2 text-blue-400">ℹ️ Esto creará:</p>
                <ul className="space-y-1 text-gray-400">
                  <li>✅ Usuario administrador</li>
                  <li>✅ 3 jugadores de prueba</li>
                  <li>✅ Un torneo de ejemplo</li>
                  <li>✅ Todas las tablas necesarias</li>
                </ul>
              </div>
            </div>
          )}

          {/* Success Result */}
          {result && (
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-3xl font-bold gradient-text mb-4">
                ¡Configuración Exitosa!
              </h2>
              <p className="text-gray-400 mb-6">
                {result.message}
              </p>

              {result.data && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-6 text-left">
                  <h3 className="font-bold mb-3 text-green-400">📊 Datos Creados:</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>👥 Usuarios creados: <span className="font-bold">{result.data.usersCreated}</span></p>
                    <p>🏆 Torneos creados: <span className="font-bold">{result.data.tournamentsCreated}</span></p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-green-500/30">
                    <h4 className="font-semibold mb-2 text-green-400">🔑 Credenciales de Acceso:</h4>
                    <div className="space-y-3 bg-black/30 p-3 rounded">
                      <div>
                        <p className="text-xs text-gray-500">Administrador:</p>
                        <p className="font-mono text-sm">📧 {result.data.adminEmail}</p>
                        <p className="font-mono text-sm">🔒 {result.data.adminPassword}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Jugador de Prueba:</p>
                        <p className="font-mono text-sm">📧 {result.data.testPlayerEmail}</p>
                        <p className="font-mono text-sm">🔒 {result.data.testPlayerPassword}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <a
                  href="/login"
                  className="btn-primary flex-1"
                >
                  Ir a Iniciar Sesión
                </a>
                <a
                  href="/"
                  className="btn-secondary flex-1"
                >
                  Ir a Inicio
                </a>
              </div>
            </div>
          )}

          {/* Error Result */}
          {error && (
            <div className="text-center">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-red-400 mb-4">
                Error en la Configuración
              </h2>
              
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-6 text-left">
                <p className="text-red-400 font-mono text-sm">{error}</p>
              </div>

              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-left">
                <p className="font-semibold mb-2 text-yellow-400">💡 Posibles soluciones:</p>
                <ul className="space-y-2 text-gray-400">
                  <li>1. Verifica que la base de datos Neon esté conectada en Vercel</li>
                  <li>2. Ve a Settings → Environment Variables y verifica que DATABASE_URL exista</li>
                  <li>3. Si no existe DATABASE_URL, reconecta la base de datos Neon</li>
                  <li>4. Haz Redeploy del proyecto después de agregar las variables</li>
                </ul>
              </div>

              <button
                onClick={handleSetup}
                disabled={loading}
                className="btn-primary w-full"
              >
                🔄 Reintentar
              </button>
            </div>
          )}
        </div>

        {/* Info adicional */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Esta página solo debe usarse una vez durante la configuración inicial</p>
        </div>
      </div>
    </div>
  )
}
