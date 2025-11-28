import { getServerSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function UserTournamentsPage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      tournaments: {
        include: {
          tournament: true
        },
        orderBy: {
          tournament: {
            startDate: 'desc'
          }
        }
      }
    }
  })

  if (!user) {
    redirect('/login')
  }

  const activeTournaments = user.tournaments.filter(t => t.tournament.status === 'active')
  const pastTournaments = user.tournaments.filter(t => t.tournament.status === 'finished')
  const upcomingTournaments = user.tournaments.filter(t => t.tournament.status === 'upcoming')

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold font-poppins gradient-text mb-2">
            🏆 Mis Torneos
          </h1>
          <p className="text-gray-400">Historial completo de participaciones</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="text-3xl mb-2">⚡</div>
            <p className="text-gray-400 text-sm">Torneos Activos</p>
            <p className="text-3xl font-bold text-green-400">{activeTournaments.length}</p>
          </div>
          <div className="card p-6">
            <div className="text-3xl mb-2">📅</div>
            <p className="text-gray-400 text-sm">Próximos</p>
            <p className="text-3xl font-bold text-blue-400">{upcomingTournaments.length}</p>
          </div>
          <div className="card p-6">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-gray-400 text-sm">Completados</p>
            <p className="text-3xl font-bold text-purple-400">{pastTournaments.length}</p>
          </div>
        </div>

        {/* Active Tournaments */}
        {activeTournaments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">⚡ Torneos Activos</h2>
            <div className="space-y-4">
              {activeTournaments.map((participation) => (
                <div key={participation.id} className="card p-6 border-green-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{participation.tournament.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">{participation.tournament.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-400">⚡ En progreso</span>
                        <span className="text-gray-400">🎮 {participation.tournament.game}</span>
                        <span className="text-purple-400 font-semibold">
                          {participation.pointsEarned} puntos ganados
                        </span>
                      </div>
                    </div>
                    <Link 
                      href={`/tournaments/${participation.tournament.id}`}
                      className="btn-primary"
                    >
                      Ver Brackets
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Tournaments */}
        {upcomingTournaments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">📅 Próximos Torneos</h2>
            <div className="space-y-4">
              {upcomingTournaments.map((participation) => (
                <div key={participation.id} className="card p-6 border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{participation.tournament.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">{participation.tournament.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-blue-400">📅 Comienza {new Date(participation.tournament.startDate).toLocaleDateString('es-AR')}</span>
                        <span className="text-gray-400">🎮 {participation.tournament.game}</span>
                      </div>
                    </div>
                    <Link 
                      href={`/tournaments/${participation.tournament.id}`}
                      className="btn-secondary"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Tournaments */}
        {pastTournaments.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">✅ Torneos Completados</h2>
            <div className="space-y-4">
              {pastTournaments.map((participation) => (
                <div key={participation.id} className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{participation.tournament.name}</h3>
                      <div className="flex items-center gap-4 text-sm">
                        {participation.placement && (
                          <span className={`font-bold ${
                            participation.placement === 1 ? 'text-yellow-400' :
                            participation.placement === 2 ? 'text-gray-300' :
                            participation.placement === 3 ? 'text-orange-400' :
                            'text-purple-400'
                          }`}>
                            {participation.placement === 1 ? '🥇' :
                             participation.placement === 2 ? '🥈' :
                             participation.placement === 3 ? '🥉' : `#${participation.placement}`}
                            {' '}Puesto {participation.placement}°
                          </span>
                        )}
                        <span className="text-purple-400 font-semibold">
                          +{participation.pointsEarned} puntos
                        </span>
                        <span className="text-gray-500">
                          {participation.tournament.endDate 
                            ? new Date(participation.tournament.endDate).toLocaleDateString('es-AR')
                            : 'Sin fecha'}
                        </span>
                      </div>
                    </div>
                    <Link 
                      href={`/tournaments/${participation.tournament.id}`}
                      className="btn-secondary"
                    >
                      Ver Resultados
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {user.tournaments.length === 0 && (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold mb-2">No has participado en torneos</h3>
            <p className="text-gray-400 mb-6">¡Únete a un torneo y comienza tu carrera competitiva!</p>
            <Link href="/tournaments" className="btn-primary inline-block">
              Ver Torneos Disponibles
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
