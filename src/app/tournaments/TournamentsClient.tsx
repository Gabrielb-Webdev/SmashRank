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
      upcoming: { text: 'Próximo', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      active: { text: 'En Curso', class: 'bg-green-500/20 text-green-400 border-green-500/30' },
      finished: { text: 'Finalizado', class: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }
    }
    const badge = badges[status] || badges.upcoming
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badge.class}`}>
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
      <div className="mb-12 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold font-poppins gradient-text mb-4">
            Torneos
          </h1>
          <p className="text-gray-400 text-lg">
            Encuentra y únete a torneos de Super Smash Bros Ultimate
          </p>
        </div>
        
        {isAdmin && (
          <Link href="/admin/tournaments/create" className="btn-primary">
            + Crear Torneo
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-8 flex gap-4 flex-wrap">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
              : 'bg-[#1A0B2E]/50 text-gray-400 hover:text-white border border-transparent'
          }`}
        >
          Todos
        </button>
        <button 
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'upcoming' 
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
              : 'bg-[#1A0B2E]/50 text-gray-400 hover:text-white border border-transparent'
          }`}
        >
          Próximos
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'active' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-[#1A0B2E]/50 text-gray-400 hover:text-white border border-transparent'
          }`}
        >
          En Curso
        </button>
        <button 
          onClick={() => setFilter('finished')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'finished' 
              ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' 
              : 'bg-[#1A0B2E]/50 text-gray-400 hover:text-white border border-transparent'
          }`}
        >
          Finalizados
        </button>
      </div>

      {/* Tournament List */}
      {filteredTournaments.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-2xl font-bold font-poppins mb-4">
              No hay torneos {filter !== 'all' && `${filter === 'upcoming' ? 'próximos' : filter === 'active' ? 'activos' : 'finalizados'}`}
            </h2>
            <p className="text-gray-400 mb-6">
              {filter === 'all' 
                ? 'Aún no se han creado torneos.' 
                : 'No hay torneos en esta categoría.'}
            </p>
            {isAdmin && filter === 'all' && (
              <Link href="/admin/tournaments/create" className="btn-primary inline-block">
                Crear Primer Torneo
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <Link 
              key={tournament.id} 
              href={`/tournaments/${tournament.id}`}
              className="card transition-all duration-300 group"
            >
              {/* Status Badge */}
              <div className="mb-4 flex justify-between items-start">
                {getStatusBadge(tournament.status)}
                <span className="text-xs text-gray-500">
                  {tournament.format === 'single' ? 'Single' : 'Double'} Elimination
                </span>
              </div>

              {/* Tournament Name */}
              <h3 className="text-xl font-bold font-poppins mb-3 group-hover:text-purple-400 transition-colors">
                {tournament.name}
              </h3>

              {/* Date */}
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(tournament.startDate)}</span>
              </div>

              {/* Participants */}
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{tournament._count.participants} / {tournament.maxPlayers}</span>
              </div>

              {/* Creator */}
              <div className="text-xs text-gray-500 border-t border-purple-500/10 pt-3">
                Organizado por: <span className="text-purple-400">{tournament.creator.gamertag}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
