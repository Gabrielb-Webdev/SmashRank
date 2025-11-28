import { getServerSession } from '@/lib/session'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import BracketView from '@/components/BracketView'
import ReportResultModal from '@/components/ReportResultModal'
import GenerateBracketButton from './GenerateBracketButton'
import DeleteTournamentButton from './DeleteTournamentButton'

export const dynamic = 'force-dynamic'

export default async function AdminTournamentDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession()
  
  if (!session || (session.user as any).role !== 'admin') {
    redirect('/')
  }

  const tournament = await prisma.tournament.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      description: true,
      game: true,
      region: true,
      status: true,
      format: true,
      maxPlayers: true,
      startDate: true,
      endDate: true,
      checkInTime: true,
      creatorId: true,
      roundConfig: true,
      pointsConfig: true,
      creator: {
        select: {
          id: true,
          gamertag: true
        }
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              gamertag: true,
              email: true,
              mainCharacter: true,
              points: true
            }
          }
        },
        orderBy: {
          user: {
            gamertag: 'asc'
          }
        }
      },
      matches: {
        select: {
          id: true,
          round: true,
          bestOf: true,
          player1Id: true,
          player2Id: true,
          winnerId: true,
          player1Score: true,
          player2Score: true,
          status: true,
          createdAt: true,
          player1: {
            select: {
              id: true,
              gamertag: true
            }
          },
          player2: {
            select: {
              id: true,
              gamertag: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  })

  if (!tournament) {
    notFound()
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
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <Link href="/admin/tournaments" className="text-purple-400 hover:text-purple-300 mb-6 inline-block">
          ← Volver a Gestión de Torneos
        </Link>

        {/* Header */}
        <div className="card p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">{tournament.name}</h1>
              <p className="text-gray-400">ID: {tournament.id}</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href={`/tournaments/${tournament.id}`}
                className="btn-secondary py-2 px-4"
              >
                👁️ Vista Pública
              </Link>
              {tournament.status !== 'finished' && (
                <Link 
                  href={`/admin/tournaments/${tournament.id}/edit`}
                  className="btn-primary py-2 px-4"
                >
                  ✏️ Editar
                </Link>
              )}
            </div>
          </div>

          {tournament.description && (
            <p className="text-gray-300 mb-4">{tournament.description}</p>
          )}

          <div className="flex gap-3 flex-wrap">
            <span className={`px-4 py-2 rounded-full border font-medium ${
              tournament.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
              tournament.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
              'bg-gray-500/20 text-gray-400 border-gray-500/30'
            }`}>
              {tournament.status === 'active' ? '⚡ Activo' :
               tournament.status === 'upcoming' ? '📅 Próximo' : '✅ Finalizado'}
            </span>
            <span className="px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-medium">
              {tournament.format === 'double' ? 'Double Elimination' : 'Single Elimination'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Participants */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">Participantes ({tournament.participants.length}/{tournament.maxPlayers})</h2>
              
              {tournament.participants.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-purple-500/10 border-b border-purple-500/20">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Jugador</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Main</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Puntos</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Check-in</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-500/10">
                      {tournament.participants.map((participant) => (
                        <tr key={participant.id} className="hover:bg-purple-500/5">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm">
                                {participant.user.gamertag.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold">{participant.user.gamertag}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-400">{participant.user.email}</td>
                          <td className="px-4 py-3 text-sm">
                            {participant.user.mainCharacter?.split(',')[0] || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-purple-400">
                            {participant.user.points} pts
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              participant.checkedIn 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {participant.checkedIn ? '✓' : '✗'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No hay participantes registrados</p>
              )}
            </div>

            {/* Bracket */}
            {tournament.matches.length > 0 && (
              <div className="card p-6">
                <BracketView 
                  matches={tournament.matches.map(m => ({
                    id: m.id,
                    round: m.round,
                    player1Id: m.player1Id,
                    player2Id: m.player2Id,
                    player1: m.player1 ? { id: m.player1.id, gamertag: m.player1.gamertag } : undefined,
                    player2: m.player2 ? { id: m.player2.id, gamertag: m.player2.gamertag } : undefined,
                    winnerId: m.winnerId,
                    player1Score: m.player1Score,
                    player2Score: m.player2Score,
                    status: m.status,
                    position: 0,
                    bestOf: m.bestOf
                  }))}
                  format={tournament.format as 'single' | 'double'}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info */}
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4">Información</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-400">Inicio</p>
                  <p className="font-semibold">{formatDate(tournament.startDate)}</p>
                </div>
                {tournament.endDate && (
                  <div>
                    <p className="text-gray-400">Fin</p>
                    <p className="font-semibold">{formatDate(tournament.endDate)}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400">Check-in</p>
                  <p className="font-semibold">{formatDate(tournament.checkInTime)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Juego</p>
                  <p className="font-semibold">{tournament.game}</p>
                </div>
                <div>
                  <p className="text-gray-400">Región</p>
                  <p className="font-semibold">🇦🇷 {tournament.region}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4">Acciones</h3>
              <div className="space-y-2">
                {tournament.status === 'upcoming' && tournament.matches.length === 0 && (
                  <GenerateBracketButton tournamentId={tournament.id} />
                )}
                <DeleteTournamentButton tournamentId={tournament.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
