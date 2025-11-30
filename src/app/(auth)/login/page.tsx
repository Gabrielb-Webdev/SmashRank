'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Credenciales incorrectas')
        setLoading(false)
        return
      }

      router.push('/')
      router.refresh()
    } catch (err) {
      setError('Ocurrió un error. Intenta nuevamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-6 relative">
            <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse-glow"></div>
            <Image 
              src="/logo.svg" 
              alt="SmashRank" 
              width={100} 
              height={100}
              priority
              className="relative z-10 animate-float"
            />
          </div>
          <h1 className="text-5xl font-extrabold font-poppins gradient-text mb-3">
            Iniciar Sesión
          </h1>
          <p className="text-gray-300 text-base font-semibold">
            Accede a tu cuenta de SmashRank
          </p>
        </div>

        {/* Form Card */}
        <div className="card p-8 shadow-2xl shadow-purple-500/30 animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-2 text-gray-200">
                📧 Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full font-semibold"
                placeholder="tu@email.com"
                required
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold mb-2 text-gray-200">
                🔒 Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full font-semibold"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full transform hover:scale-105 transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          {/* Register Link */}
          <div className="mt-6 text-center text-sm text-gray-300">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-purple-400 hover:text-purple-300 font-bold transition-all duration-200 hover:underline">
              Regístrate aquí
            </Link>
          </div>

          {/* Test Accounts */}
          <div className="mt-8 pt-6 border-t border-purple-500/30">
            <p className="text-xs text-gray-300 text-center mb-3 font-bold">🎮 Cuentas de prueba:</p>
            <div className="space-y-2 text-xs text-gray-400">
              <p className="font-semibold"><strong className="text-purple-400">Admin:</strong> admin@smashrank.com / admin123</p>
              <p className="font-semibold"><strong className="text-pink-400">Jugador:</strong> player1@test.com / player123</p>
            </div>
          </div>nk>
          </div>

          {/* Test Accounts */}
          <div className="mt-8 pt-6 border-t border-purple-500/20">
            <p className="text-xs text-gray-500 text-center mb-3">Cuentas de prueba:</p>
            <div className="space-y-2 text-xs text-gray-600">
              <p><strong>Admin:</strong> admin@smashrank.com / admin123</p>
              <p><strong>Jugador:</strong> player1@test.com / player123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
