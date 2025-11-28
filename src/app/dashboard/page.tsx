import { getServerSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
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
        take: 5,
        orderBy: {
          tournament: {
            startDate: 'desc'
          }
        }
      },
      pointHistory: {
        take: 10,
        orderBy: {
          createdAt: 'desc'
        }
      },
      _count: {
        select: {
          tournaments: true,
          matchesAsP1: true,
          matchesAsP2: true
        }
      }
    }
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold font-poppins gradient-text mb-2">
            Mi Dashboard
          </h1>
          <p className="text-gray-400">Bienvenido, <span className="text-purple-400 font-semibold">{user.gamertag}</span></p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl">
                ⭐
              </div>
              <div>
                <p className="text-gray-400 text-sm">Puntos Totales</p>
                <p className="text-3xl font-bold gradient-text">{user.points}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl">
                🏆
              </div>
              <div>
                <p className="text-gray-400 text-sm">Torneos Jugados</p>
                <p className="text-3xl font-bold text-blue-400">{user._count.tournaments}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-2xl">
                ⚔️
              </div>
              <div>
                <p className="text-gray-400 text-sm">Matches Totales</p>
                <p className="text-3xl font-bold text-green-400">
                  {user._count.matchesAsP1 + user._count.matchesAsP2}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-2xl">
                🎮
              </div>
              <div>
                <p className="text-gray-400 text-sm">Main</p>
                <p className="text-lg font-bold text-pink-400">
                  {user.mainCharacter?.split(',')[0] || 'Sin definir'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/tournaments" className="card p-6 hover:scale-105 transition-transform cursor-pointer">
            <h3 className="text-xl font-bold mb-2 gradient-text">🎯 Unirse a Torneo</h3>
            <p className="text-gray-400 text-sm">Participa en los torneos activos de Argentina</p>
          </Link>

          <Link href="/dashboard/tournaments" className="card p-6 hover:scale-105 transition-transform cursor-pointer">
            <h3 className="text-xl font-bold mb-2 gradient-text">📋 Mis Torneos</h3>
            <p className="text-gray-400 text-sm">Ve el historial de tus participaciones</p>
          </Link>
        </div>

        {/* Recent Tournaments */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">Torneos Recientes</h2>
          {user.tournaments.length > 0 ? (
            <div className="space-y-3">
              {user.tournaments.map((participation) => (
                <div 
                  key={participation.id}
                  className="flex items-center justify-between p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{participation.tournament.name}</h3>
                    <p className="text-sm text-gray-400">
                      {participation.placement ? `Puesto ${participation.placement}° ` : 'En progreso'}
                      • {participation.pointsEarned} puntos
                    </p>
                  </div>
                  <Link 
                    href={`/tournaments/${participation.tournament.id}`}
                    className="btn-secondary py-2 px-4 text-sm"
                  >
                    Ver Detalles
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No has participado en ningún torneo aún</p>
              <Link href="/tournaments" className="btn-primary">
                Ver Torneos Disponibles
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
