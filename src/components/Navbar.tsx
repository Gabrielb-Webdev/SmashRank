'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <nav className="fixed top-0 w-full bg-[#0A0118]/80 backdrop-blur-xl border-b border-purple-500/10 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 transition-transform duration-[0.4s] group-hover:scale-110 group-hover:rotate-12">
              <Image 
                src="/logo.svg" 
                alt="SmashRank" 
                width={48} 
                height={48}
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold font-poppins leading-none">
                <span className="gradient-text">SmashRank</span>
              </span>
              <span className="text-[9px] text-gray-500 tracking-wider uppercase font-medium mt-0.5">
                By Brodev Lab
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-8 items-center">
            <li>
              <Link 
                href="/" 
                className="text-gray-200 hover:text-white transition-all duration-300 font-bold relative group"
              >
                Inicio
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li>
              <Link 
                href="/tournaments" 
                className="text-gray-200 hover:text-white transition-all duration-300 font-bold relative group"
              >
                Torneos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li>
              <Link 
                href="/ranking" 
                className="text-gray-200 hover:text-white transition-all duration-300 font-bold relative group"
              >
                Ranking
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li>
              <Link 
                href="/matchmaking" 
                className="text-gray-200 hover:text-white transition-all duration-300 font-bold relative group"
              >
                Matchmaking
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
          </ul>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex gap-4 items-center">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 font-bold"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm shadow-lg">
                    {session.user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-white">{session.user?.email}</span>
                  <svg className={`w-4 h-4 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-[#1a0b2e] border border-purple-500/40 rounded-lg shadow-2xl shadow-purple-500/20 overflow-hidden z-50 animate-scale-in">
                    <div className="p-4 border-b border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                      <p className="text-xs text-gray-300 font-semibold">Conectado como</p>
                      <p className="text-sm font-bold text-white truncate">{session.user?.email}</p>
                    </div>
                    
                    {(session.user as any)?.role === 'admin' && (
                      <>
                        <Link 
                          href="/admin"
                          className="block px-4 py-3 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-200 text-sm font-bold border-b border-purple-500/10"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          🛡️ Panel de Administrador
                        </Link>
                      </>
                    )}
                    
                    <Link 
                      href="/dashboard"
                      className="block px-4 py-3 hover:bg-purple-500/20 transition-all duration-200 text-sm font-semibold"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      👤 Mi Perfil
                    </Link>
                    <Link 
                      href="/dashboard/tournaments"
                      className="block px-4 py-3 hover:bg-purple-500/20 transition-all duration-200 text-sm font-semibold"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      🏆 Mis Torneos
                    </Link>
                    <Link 
                      href="/dashboard/stats"
                      className="block px-4 py-3 hover:bg-purple-500/20 transition-all duration-200 text-sm font-semibold"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      📊 Estadísticas
                    </Link>
                    
                    <div className="border-t border-purple-500/30"></div>
                    
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full px-4 py-3 hover:bg-red-500/20 transition-all duration-200 text-sm text-left text-red-400 font-bold"
                    >
                      🚪 Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-200 hover:text-white transition-all duration-300 font-bold hover:scale-110"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  href="/register" 
                  className="btn-primary transform hover:scale-110 transition-all duration-300"
                >
                  Registrarse
                </Link>
              </>
            )}v>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-6 pb-4">
            <ul className="flex flex-col gap-4">
              <li>
                <Link 
                  href="/" 
                  className="block text-gray-300 hover:text-white transition-colors duration-300 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  href="/tournaments" 
                  className="block text-gray-300 hover:text-white transition-colors duration-300 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Torneos
                </Link>
              </li>
              <li>
                <Link 
                  href="/ranking" 
                  className="block text-gray-300 hover:text-white transition-colors duration-300 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ranking
                </Link>
              </li>
              <li>
                <Link 
                  href="/matchmaking" 
                  className="block text-gray-300 hover:text-white transition-colors duration-300 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Matchmaking
                </Link>
              </li>
              <li className="pt-4 border-t border-purple-500/20">
                <Link 
                  href="/login" 
                  className="block text-gray-300 hover:text-white transition-colors duration-300 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link 
                  href="/register" 
                  className="block btn-primary text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}
