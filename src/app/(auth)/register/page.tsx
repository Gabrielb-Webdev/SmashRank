'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validations
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar usuario')
      }

      // Redirect to login after successful registration
      router.push('/login?registered=true')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6 relative">
            <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            <Image 
              src="/logo.svg" 
              alt="SmashRank" 
              width={100} 
              height={100}
              priority
              className="relative z-10"
            />
          </div>
          <h1 className="text-4xl font-extrabold font-poppins gradient-text mb-3">
            Crear Cuenta
          </h1>
          <p className="text-gray-400 text-sm">
            Únete a la comunidad de SmashRank
          </p>
        </div>

        {/* Form Card */}
        <div className="card p-8 shadow-2xl shadow-purple-500/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
                Nombre de Usuario
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="MiNickname"
                required
                disabled={loading}
                minLength={3}
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="tu@email.com"
                required
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-300">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-gray-300">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
