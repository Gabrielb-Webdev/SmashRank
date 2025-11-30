import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from '@/lib/session'
import RegisterButton from './RegisterButton'
import BracketView from '@/components/BracketView'
import CheckInButton from '@/components/CheckInButton'
import TournamentCountdown from '@/components/TournamentCountdown'

export const dynamic = 'force-dynamic'

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

  // Calcular el status real basado en las fechas (todas en UTC para comparar correctamente)
  const now = new Date()
  const startDate = new Date(tournament.startDate)
  const checkInTime = new Date(tournament.checkInTime)
  const thirtyMinutesBefore = new Date(checkInTime.getTime() - 30 * 60 * 1000)
  
  // Log para debug (puedes eliminar después)
  console.log('Fechas para debug:', {
    ahora: now.toISOString(),
    inicio: startDate.toISOString(),
    checkIn: checkInTime.toISOString(),
    ahoraMilisec: now.getTime(),
    inicioMilisec: startDate.getTime()
  })
  
  let actualStatus = tournament.status
  
  // Determinar el status real basándose en las fechas
  if (tournament.status === 'finished') {
    actualStatus = 'finished'
  } else if (now >= startDate) {
    // Si ya pasó la fecha de inicio, debería estar 'ongoing' o 'finished'
    actualStatus = tournament.matches.length > 0 ? 'ongoing' : 'checkin'
  } else if (now >= thirtyMinutesBefore && now < startDate) {
    // Si estamos en la ventana de check-in
    actualStatus = 'checkin'
  } else {
    // Si aún no llega la fecha de check-in
    actualStatus = 'upcoming'
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
    return new Intl.DateTimeFormat('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Argentina/Buenos_Aires'
    }).format(new Date(date))
  }

  const isUserRegistered = tournament.participants.some(p => p.user.id === session?.user?.id)
  const canRegister = tournament.participants.length < tournament.maxPlayers && actualStatus === 'upcoming'
  
  // Check-in logic
  const userParticipation = tournament.participants.find(p => p.user.id === session?.user?.id)
  
  const canCheckIn = isUserRegistered && 
                     actualStatus === 'checkin' && 
                     now >= thirtyMinutesBefore && 
                     now <= startDate
  
  const isCheckedIn = userParticipation?.checkedIn || false
  
  let checkInMessage = ''
  if (actualStatus === 'ongoing' || actualStatus === 'finished') {
    checkInMessage = 'El torneo ya ha comenzado'
  } else if (now < thirtyMinutesBefore) {
    const minutesLeft = Math.floor((thirtyMinutesBefore.getTime() - now.getTime()) / (1000 * 60))
    const hoursLeft = Math.floor(minutesLeft / 60)
    const daysLeft = Math.floor(hoursLeft / 24)
    
    if (daysLeft > 0) {
      checkInMessage = `Check-in disponible en ${daysLeft} día${daysLeft > 1 ? 's' : ''} y ${hoursLeft % 24} hora${hoursLeft % 24 !== 1 ? 's' : ''}`
    } else if (hoursLeft > 0) {
      checkInMessage = `Check-in disponible en ${hoursLeft} hora${hoursLeft > 1 ? 's' : ''} y ${minutesLeft % 60} minuto${minutesLeft % 60 !== 1 ? 's' : ''}`
    } else {
      checkInMessage = `Check-in disponible en ${minutesLeft} minuto${minutesLeft > 1 ? 's' : ''}`
    }
  } else if (now > startDate) {
    checkInMessage = 'El tiempo de check-in ha finalizado'
  }

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
          <div className="flex items-center gap-4">
            {session?.user?.role === 'admin' && (actualStatus === 'checkin' || actualStatus === 'upcoming') && (
              <form action={`/api/tournaments/${params.id}/start`} method="POST">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all"
                >
                  Iniciar Torneo
                </button>
              </form>
            )}
            {(actualStatus === 'ongoing' || actualStatus === 'finished') && (
              <Link 
                href={`/tournaments/${params.id}/bracket`}
                className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all"
              >
                Ver Bracket
              </Link>
            )}
            {getStatusBadge(actualStatus)}
          </div>
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

          {/* Bracket */}
          {tournament.matches && tournament.matches.length > 0 && (
            <div className="card">
              <BracketView 
                matches={tournament.matches.map((m: any) => ({
                  id: m.id,
                  round: m.round,
                  player1Id: m.player1Id,
                  player2Id: m.player2Id,
                  player1: m.player1 ? { id: m.player1.id || '', gamertag: m.player1.gamertag } : undefined,
                  player2: m.player2 ? { id: m.player2.id || '', gamertag: m.player2.gamertag } : undefined,
                  winnerId: m.winnerId,
                  player1Score: m.player1Score || 0,
                  player2Score: m.player2Score || 0,
                  status: m.status,
                  position: 0,
                  bestOf: m.bestOf || 3
                }))}
                format={tournament.format as 'single' | 'double'}
              />
            </div>
          )}

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
          {/* Countdown */}
          {actualStatus === 'upcoming' && (
            <TournamentCountdown 
              startDate={tournament.startDate.toISOString()} 
              status={actualStatus} 
            />
          )}

          {/* Check-in */}
          {isUserRegistered && (actualStatus === 'upcoming' || actualStatus === 'checkin') && (
            <div className="card">
              <h2 className="text-xl font-bold font-poppins mb-4 gradient-text">
                Check-in
              </h2>
              <CheckInButton
                tournamentId={params.id}
                isCheckedIn={isCheckedIn}
                canCheckIn={canCheckIn}
                checkInMessage={checkInMessage}
              />
              <p className="text-xs text-gray-400 mt-2 text-center">
                Disponible 30 min antes del check-in
              </p>
            </div>
          )}

          {/* Current Match / Bracket Access */}
          {actualStatus === 'ongoing' && isUserRegistered && (
            <div className="card">
              <h2 className="text-xl font-bold font-poppins mb-4 gradient-text">
                Tu Match
              </h2>
              <Link
                href={`#bracket`}
                className="block w-full text-center px-4 py-3 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-semibold rounded-lg hover:opacity-90 transition-all"
              >
                Ver Mi Match
              </Link>
            </div>
          )}

          {/* Registration */}
          <div className="card">
            <h2 className="text-xl font-bold font-poppins mb-4 gradient-text">
              Registro
            </h2>
            
            {session?.user ? (
              isUserRegistered ? (
                <div className="text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="text-green-400 font-semibold mb-2">¡Estás registrado!</p>
                  <p className="text-sm text-gray-400">Te esperamos en el torneo</p>
                </div>
              ) : canRegister ? (
                <div>
                  <p className="text-gray-400 text-sm mb-4">
                    Regístrate para participar en este torneo
                  </p>
                  <RegisterButton tournamentId={params.id} />
                </div>
              ) : actualStatus === 'finished' ? (
                <div className="text-center text-gray-400">
                  <p className="mb-2">Torneo finalizado</p>
                </div>
              ) : tournament.participants.length >= tournament.maxPlayers ? (
                <div className="text-center text-gray-400">
                  <p className="mb-2">Torneo completo</p>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <p className="mb-2">Registro no disponible</p>
                </div>
              )
            ) : (
              <div className="text-center">
                <p className="text-gray-400 mb-4 text-sm">Inicia sesión para registrarte</p>
                <Link href="/login" className="btn-primary w-full block">
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>

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
