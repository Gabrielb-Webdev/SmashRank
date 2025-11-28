import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

async function getUserProfile(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        tournaments: {
          include: {
            tournament: {
              select: {
                id: true,
                name: true,
                startDate: true,
                status: true,
                format: true
              }
            }
          },
          orderBy: {
            tournament: {
              startDate: 'desc'
            }
          }
        }
      }
    })
    return user
  } catch (error) {
    return null
  }
}

export default async function PlayerProfilePage({ params }: { params: { id: string } }) {
  const user = await getUserProfile(params.id)

  if (!user) {
    notFound()
  }

  // Calcular estadísticas
  const totalTournaments = user.participations.length
  const finishedTournaments = user.participations.filter(p => p.tournament.status === 'finished')
  const wins = finishedTournaments.filter(p => p.placement === 1).length
  const podiums = finishedTournaments.filter(p => p.placement && p.placement <= 3).length
  const avgPlacement = finishedTournaments.length > 0
    ? (finishedTournaments.reduce((acc, p) => acc + (p.placement || 0), 0) / finishedTournaments.length).toFixed(1)
    : 'N/A'

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/ranking" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
          ← Volver al Ranking
        </Link>

        <div className="card">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
              {user.gamertag.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold font-poppins gradient-text mb-2">
                {user.gamertag}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-400 mb-4">
                {user.region && (
                  <span className="flex items-center gap-2">
                    📍 {user.region}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  🏆 {user.points} puntos
                </span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {user.mainCharacter && (
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                    Main: {user.mainCharacter}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold gradient-text mb-2">{totalTournaments}</div>
          <div className="text-gray-400">Torneos</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">{wins}</div>
          <div className="text-gray-400">Victorias</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">{podiums}</div>
          <div className="text-gray-400">Podios</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-pink-400 mb-2">{avgPlacement}</div>
          <div className="text-gray-400">Lugar Promedio</div>
        </div>
      </div>

      {/* Tournament History */}
      <div className="card">
        <h2 className="text-2xl font-bold font-poppins mb-6 gradient-text">
          Historial de Torneos
        </h2>

        {user.participations.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            Aún no ha participado en ningún torneo
          </p>
        ) : (
          <div className="space-y-3">
            {user.participations.map((participation) => (
              <Link
                key={participation.id}
                href={`/tournaments/${participation.tournament.id}`}
                className="block p-4 bg-[#1A0B2E]/50 rounded-lg border border-purple-500/10 hover:border-purple-500/30 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{participation.tournament.name}</h3>
                    <p className="text-sm text-gray-400">
                      {new Intl.DateTimeFormat('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }).format(new Date(participation.tournament.startDate))}
                    </p>
                  </div>
                  <div className="text-right">
                    {participation.placement ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {participation.placement === 1 ? '🥇' : 
                           participation.placement === 2 ? '🥈' : 
                           participation.placement === 3 ? '🥉' : 
                           `#${participation.placement}`}
                        </span>
                        <div>
                          <div className="text-sm text-gray-400">Lugar</div>
                          {participation.pointsEarned > 0 && (
                            <div className="text-sm font-bold gradient-text">
                              +{participation.pointsEarned} pts
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">
                        {participation.tournament.status === 'upcoming' ? 'Próximo' : 
                         participation.tournament.status === 'ongoing' ? 'En Curso' : 
                         'Participó'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                    {participation.tournament.format === 'single' ? 'Single Elimination' : 'Double Elimination'}
                  </span>
                  {participation.checkedIn && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
                      ✓ Check-in
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
