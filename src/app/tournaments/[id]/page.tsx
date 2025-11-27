import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from '@/lib/session'

async function getTournament(id: string) {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            gamertag: true
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                gamertag: true,
                points: true,
                mainCharacter: true
              }
            }
          },
          orderBy: {
            seed: 'asc'
          }
        },
        matches: {
          include: {
            player1: {
              select: {
                gamertag: true
              }
            },
            player2: {
              select: {
                gamertag: true
              }
            }
          }
        }
      }
    })
    return tournament
  } catch (error) {
    return null
  }
}

export default async function TournamentDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession()
  const tournament = await getTournament(params.id)

  if (!tournament) {
    notFound()
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; class: string }> = {
      upcoming: { text: 'Próximo', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      checkin: { text: 'Check-in Abierto', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      ongoing: { text: 'En Curso', class: 'bg-green-500/20 text-green-400 border-green-500/30' },
      finished: { text: 'Finalizado', class: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }
    }
    const badge = badges[status] || badges.upcoming
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-medium border ${badge.class}`}>
        {badge.text}
      </span>
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  const isUserRegistered = tournament.participants.some(p => p.user.id === session?.user?.id)
  const canRegister = tournament.participants.length < tournament.maxPlayers && tournament.status === 'upcoming'

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/tournaments" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
          ← Volver a Torneos
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold font-poppins gradient-text mb-2">
              {tournament.name}
            </h1>
            <p className="text-gray-400">
              Organizado por <span className="text-purple-400">{tournament.creator.gamertag}</span>
            </p>
          </div>
          {getStatusBadge(tournament.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="card">
            <h2 className="text-2xl font-bold font-poppins mb-6 gradient-text">
              Información del Torneo
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm text-gray-400 mb-2">Fecha de Inicio</h3>
                <p className="text-lg">{formatDate(tournament.startDate)}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-400 mb-2">Check-in</h3>
                <p className="text-lg">{formatDate(tournament.checkInTime)}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-400 mb-2">Formato</h3>
                <p className="text-lg">
                  {tournament.format === 'single' ? 'Single Elimination' : 'Double Elimination'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-400 mb-2">Participantes</h3>
                <p className="text-lg">
                  {tournament.participants.length} / {tournament.maxPlayers}
                </p>
              </div>
            </div>
          </div>

          {/* Participants List */}
          <div className="card">
            <h2 className="text-2xl font-bold font-poppins mb-6 gradient-text">
              Participantes ({tournament.participants.length})
            </h2>
            
            {tournament.participants.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                Aún no hay participantes registrados
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tournament.participants.map((participant, index) => (
                  <div 
                    key={participant.id}
                    className="flex items-center gap-3 p-3 bg-[#1A0B2E]/50 rounded-lg border border-purple-500/10"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{participant.user.gamertag}</div>
                      <div className="text-xs text-gray-400">
                        {participant.user.points} pts
                        {participant.user.mainCharacter && ` • ${participant.user.mainCharacter}`}
                      </div>
                    </div>
                    {participant.checkedIn && (
                      <span className="text-green-400 text-xs">✓ Check-in</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration */}
          {session?.user && tournament.status === 'upcoming' && (
            <div className="card">
              <h2 className="text-xl font-bold font-poppins mb-4 gradient-text">
                Registro
              </h2>
              
              {isUserRegistered ? (
                <div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400 mb-4">
                    ✓ Estás registrado en este torneo
                  </div>
                  <button className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors">
                    Cancelar Inscripción
                  </button>
                </div>
              ) : canRegister ? (
                <div>
                  <p className="text-gray-400 text-sm mb-4">
                    Regístrate para participar en este torneo
                  </p>
                  <button className="btn-primary w-full">
                    Inscribirme
                  </button>
                </div>
              ) : (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-400">
                  ⚠ Torneo lleno o cerrado
                </div>
              )}
            </div>
          )}

          {!session?.user && tournament.status === 'upcoming' && (
            <div className="card">
              <h2 className="text-xl font-bold font-poppins mb-4 gradient-text">
                Registro
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Inicia sesión para inscribirte
              </p>
              <Link href="/login" className="btn-primary w-full block text-center">
                Iniciar Sesión
              </Link>
            </div>
          )}

          {/* Stages */}
          <div className="card">
            <h2 className="text-xl font-bold font-poppins mb-4 gradient-text">
              Stages Permitidos
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-400 mb-2">Starters</h3>
                <div className="flex flex-wrap gap-2">
                  {(tournament.starterStages as string[]).map((stage, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                      {stage}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-400 mb-2">Counterpicks</h3>
                <div className="flex flex-wrap gap-2">
                  {(tournament.cpStages as string[]).map((stage, i) => (
                    <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                      {stage}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Points Distribution */}
          <div className="card">
            <h2 className="text-xl font-bold font-poppins mb-4 gradient-text">
              Puntos
            </h2>
            
            <div className="space-y-2">
              {Object.entries(tournament.pointsConfig as Record<string, number>)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .slice(0, 4)
                .map(([place, points]) => (
                  <div key={place} className="flex justify-between items-center">
                    <span className="text-gray-400">
                      {place === '1' ? '🥇' : place === '2' ? '🥈' : place === '3' ? '🥉' : `#${place}`} Lugar
                    </span>
                    <span className="font-bold gradient-text">{points} pts</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
