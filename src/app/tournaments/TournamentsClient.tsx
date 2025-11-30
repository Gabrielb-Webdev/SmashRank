'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tournament = {
  id: string
  name: string
  status: string
  format: string
  startDate: Date
  maxPlayers: number
  _count: {
    participants: number
  }
  creator: {
    gamertag: string
  }
}

type Props = {
  tournaments: Tournament[]
  isAdmin: boolean
}

export default function TournamentsClient({ tournaments, isAdmin }: Props) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'active' | 'finished'>('all')

  const filteredTournaments = tournaments.filter((t) => {
    if (filter === 'all') return true
    return t.status === filter
  })

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; class: string }> = {
      upcoming: { text: '⏳ Próximo', class: 'badge badge-blue' },
      active: { text: '⚡ En Curso', class: 'badge badge-green' },
      finished: { text: '✅ Finalizado', class: 'badge badge-gray' }
    }
    const badge = badges[status] || badges.upcoming
    return (
      <span className={badge.class}>
        {badge.text}
      </span>
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12 flex justify-between items-center flex-wrap gap-4 animate-fade-in">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold font-poppins gradient-text mb-4">
            🏆 Torneos
          </h1>
          <p className="text-gray-300 text-lg font-semibold">
            Encuentra y únete a torneos de Super Smash Bros Ultimate
          </p>
        </div>
        
        {isAdmin && (
          <Link href="/admin/tournaments/create" className="btn-primary transform hover:scale-110 transition-all duration-300">
            + Crear Torneo
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-8 flex gap-4 flex-wrap animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
        <button 
          onClick={() => setFilter('all')}
          className={`px-5 py-2.5 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 ${
            filter === 'all' 
              ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-500/50 shadow-lg shadow-purple-500/20' 
              : 'bg-[#1A0B2E]/50 text-gray-300 hover:text-white hover:border-purple-500/30 border border-purple-500/10'
          }`}
        >
          🌎 Todos
        </button>
        <button 
          onClick={() => setFilter('upcoming')}
          className={`px-5 py-2.5 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 ${
            filter === 'upcoming' 
              ? 'bg-blue-500/30 text-white border border-blue-500/50 shadow-lg shadow-blue-500/20' 
              : 'bg-[#1A0B2E]/50 text-gray-300 hover:text-white hover:border-blue-500/30 border border-purple-500/10'
          }`}
        >
          ⏳ Próximos
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={`px-5 py-2.5 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 ${
            filter === 'active' 
              ? 'bg-green-500/30 text-white border border-green-500/50 shadow-lg shadow-green-500/20' 
              : 'bg-[#1A0B2E]/50 text-gray-300 hover:text-white hover:border-green-500/30 border border-purple-500/10'
          }`}
        >
          ⚡ En Curso
        </button>
        <button 
          onClick={() => setFilter('finished')}
          className={`px-5 py-2.5 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 ${
            filter === 'finished' 
              ? 'bg-gray-500/30 text-white border border-gray-500/50 shadow-lg shadow-gray-500/20' 
              : 'bg-[#1A0B2E]/50 text-gray-300 hover:text-white hover:border-gray-500/30 border border-purple-500/10'
          }`}
        >
          ✅ Finalizados
        </button>
      </div>

      {/* Tournament List */}
      {filteredTournaments.length === 0 ? (
        <div className="card p-12 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-6 animate-float">🏆</div>
            <h2 className="text-2xl font-bold font-poppins mb-4 gradient-text">
              No hay torneos {filter !== 'all' && `${filter === 'upcoming' ? 'próximos' : filter === 'active' ? 'activos' : 'finalizados'}`}
            </h2>
            <p className="text-gray-300 mb-6">
              {filter === 'all' 
                ? 'Aún no se han creado torneos.' 
                : 'No hay torneos en esta categoría.'}
            </p>
            {isAdmin && filter === 'all' && (
              <Link href="/admin/tournaments/create" className="btn-primary inline-block transform hover:scale-110 transition-all duration-300">
                Crear Primer Torneo
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament, index) => (
            <Link 
              key={tournament.id} 
              href={`/tournaments/${tournament.id}`}
              className="card-interactive animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Status Badge */}
              <div className="mb-4 flex justify-between items-start">
                {getStatusBadge(tournament.status)}
                <span className="text-xs text-gray-300 font-bold px-2 py-1 bg-purple-500/10 rounded">
                  {tournament.format === 'single' ? '🎯 Single' : '🔄 Double'} Elimination
                </span>
              </div>

              {/* Tournament Name */}
              <h3 className="text-2xl font-bold font-poppins mb-3 text-white group-hover:gradient-text transition-all duration-300">
                {tournament.name}
              </h3>

              {/* Date */}
              <div className="flex items-center gap-2 text-gray-300 text-sm mb-4 font-semibold">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(tournament.startDate)}</span>
              </div>

              {/* Participants */}
              <div className="flex items-center gap-2 text-gray-300 text-sm mb-4 font-semibold">
                <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{tournament._count.participants} / {tournament.maxPlayers}</span>
              </div>

              {/* Creator */}
              <div className="text-xs text-gray-400 border-t border-purple-500/20 pt-3 font-semibold">
                Organizado por: <span className="text-purple-300 font-bold">{tournament.creator.gamertag}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
