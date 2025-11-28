import { getServerSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function UserStatsPage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      matchesAsP1: {
        where: {
          status: 'finished'
        }
      },
      matchesAsP2: {
        where: {
          status: 'finished'
        }
      },
      tournaments: {
        include: {
          tournament: true
        }
      },
      pointHistory: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 20
      }
    }
  })

  if (!user) {
    redirect('/login')
  }

  // Calcular estadísticas
  const totalMatches = user.matchesAsP1.length + user.matchesAsP2.length
  const matchesAsP1Won = user.matchesAsP1.filter(m => (m as any).winnerId === user.id).length
  const matchesAsP2Won = user.matchesAsP2.filter(m => (m as any).winnerId === user.id).length
  const totalWins = matchesAsP1Won + matchesAsP2Won
  const winRate = totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(1) : '0'
  
  const tournamentsCompleted = user.tournaments.filter(t => t.tournament.status === 'finished').length
  const bestPlacement = Math.min(...user.tournaments.map(t => t.placement || 999))
  
  const totalPointsEarned = user.pointHistory
    .filter(p => p.pointsChange > 0)
    .reduce((sum, p) => sum + p.pointsChange, 0)

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold font-poppins gradient-text mb-2">
            📊 Mis Estadísticas
          </h1>
          <p className="text-gray-400">Rendimiento competitivo de {user.gamertag}</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 border-purple-500/30">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-gray-400 text-sm">Puntos Totales</p>
            <p className="text-4xl font-bold gradient-text">{user.points}</p>
          </div>

          <div className="card p-6 border-green-500/30">
            <div className="text-3xl mb-2">⚔️</div>
            <p className="text-gray-400 text-sm">Win Rate</p>
            <p className="text-4xl font-bold text-green-400">{winRate}%</p>
            <p className="text-xs text-gray-500 mt-1">{totalWins}W - {totalMatches - totalWins}L</p>
          </div>

          <div className="card p-6 border-blue-500/30">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-gray-400 text-sm">Mejor Puesto</p>
            <p className="text-4xl font-bold text-blue-400">
              {bestPlacement === 999 ? '-' : `#${bestPlacement}`}
            </p>
          </div>

          <div className="card p-6 border-pink-500/30">
            <div className="text-3xl mb-2">📈</div>
            <p className="text-gray-400 text-sm">Puntos Ganados</p>
            <p className="text-4xl font-bold text-pink-400">+{totalPointsEarned}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Tournament Stats */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-4">🏆 Torneos</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                <span className="text-gray-400">Total Participaciones</span>
                <span className="text-2xl font-bold">{user.tournaments.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                <span className="text-gray-400">Torneos Completados</span>
                <span className="text-2xl font-bold text-green-400">{tournamentsCompleted}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <span className="text-gray-400">En Curso</span>
                <span className="text-2xl font-bold text-blue-400">
                  {user.tournaments.filter(t => t.tournament.status === 'active').length}
                </span>
              </div>
            </div>
          </div>

          {/* Match Stats */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-4">⚔️ Matches</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                <span className="text-gray-400">Matches Totales</span>
                <span className="text-2xl font-bold">{totalMatches}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                <span className="text-gray-400">Victorias</span>
                <span className="text-2xl font-bold text-green-400">{totalWins}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                <span className="text-gray-400">Derrotas</span>
                <span className="text-2xl font-bold text-red-400">{totalMatches - totalWins}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Point History */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">📈 Historial de Puntos</h2>
          {user.pointHistory.length > 0 ? (
            <div className="space-y-2">
              {user.pointHistory.map((entry) => (
                <div 
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-purple-500/5 border border-purple-500/10 rounded-lg hover:border-purple-500/30 transition-colors"
                >
                  <div>
                    <p className="font-medium">{entry.reason}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(entry.createdAt).toLocaleDateString('es-AR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`text-xl font-bold ${
                    entry.pointsChange > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {entry.pointsChange > 0 ? '+' : ''}{entry.pointsChange}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No hay historial de puntos todavía</p>
              <p className="text-sm text-gray-500 mt-2">Participa en torneos para ganar puntos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
