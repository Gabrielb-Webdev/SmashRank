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
                  <div className="absolute right-0 mt-4 w-72 bg-gradient-to-br from-[#1a1a28] to-[#12121c] border-4 border-[#FF0046] rounded-2xl shadow-2xl overflow-hidden z-50 animate-scale-in backdrop-blur-2xl" style={{ boxShadow: '0 0 40px rgba(255, 0, 70, 0.6), 0 0 80px rgba(0, 217, 255, 0.3), 0 30px 60px rgba(0, 0, 0, 0.8)' }}>
                    {/* Header */}
                    <div className="p-5 border-b-4 border-[#00D9FF] bg-gradient-to-r from-[#FF0046]/20 to-[#00D9FF]/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                      <p className="text-xs text-[#FFD700] font-black uppercase tracking-[0.2em] mb-2 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">⚡ Conectado</p>
                      <p className="text-lg font-black text-white truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{session.user?.email}</p>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="p-3 space-y-1">
                      {(session.user as any)?.role === 'admin' && (
                        <>
                          <Link 
                            href="/admin"
                            className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-black uppercase text-sm tracking-wide text-white transition-all duration-300 relative overflow-hidden group"
                            style={{ 
                              background: 'linear-gradient(135deg, rgba(255, 0, 70, 0.2) 0%, rgba(255, 0, 70, 0.1) 100%)',
                              border: '2px solid rgba(255, 0, 70, 0.3)',
                              boxShadow: '0 0 15px rgba(255, 0, 70, 0.3)'
                            }}
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF0046] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="text-2xl relative z-10 drop-shadow-[0_0_10px_rgba(255,0,70,1)]">🛡️</span>
                            <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Panel Admin</span>
                          </Link>
                        </>
                      )}
                      
                      <Link 
                        href="/dashboard"
                        className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-black uppercase text-sm tracking-wide text-white transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                        style={{ 
                          background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.15) 0%, rgba(0, 150, 255, 0.1) 100%)',
                          border: '2px solid rgba(0, 217, 255, 0.3)'
                        }}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF] to-[#FFD700] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <span className="text-2xl relative z-10 drop-shadow-[0_0_10px_rgba(0,217,255,1)]">👤</span>
                        <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Mi Perfil</span>
                      </Link>
                      
                      <Link 
                        href="/dashboard/tournaments"
                        className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-black uppercase text-sm tracking-wide text-white transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                        style={{ 
                          background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.15) 0%, rgba(0, 150, 255, 0.1) 100%)',
                          border: '2px solid rgba(0, 217, 255, 0.3)'
                        }}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF] to-[#FFD700] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <span className="text-2xl relative z-10 drop-shadow-[0_0_10px_rgba(255,215,0,1)]">🏆</span>
                        <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Mis Torneos</span>
                      </Link>
                      
                      <Link 
                        href="/dashboard/stats"
                        className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-black uppercase text-sm tracking-wide text-white transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                        style={{ 
                          background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.15) 0%, rgba(0, 150, 255, 0.1) 100%)',
                          border: '2px solid rgba(0, 217, 255, 0.3)'
                        }}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF] to-[#32FF96] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <span className="text-2xl relative z-10 drop-shadow-[0_0_10px_rgba(50,255,150,1)]">📊</span>
                        <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Estadísticas</span>
                      </Link>
                    </div>
                    
                    {/* Footer - Logout */}
                    <div className="border-t-4 border-red-500/50">
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center gap-4 px-6 py-4 font-black uppercase text-sm tracking-wide text-red-400 hover:text-white transition-all duration-300 relative overflow-hidden group"
                        style={{ 
                          background: 'linear-gradient(135deg, rgba(200, 0, 0, 0.2) 0%, rgba(150, 0, 0, 0.1) 100%)'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="text-2xl relative z-10 drop-shadow-[0_0_10px_rgba(255,0,0,1)] group-hover:animate-pulse">🚪</span>
                        <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
            )}
          </div>

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
