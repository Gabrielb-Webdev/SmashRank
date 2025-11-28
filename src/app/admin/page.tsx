import { getServerSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await getServerSession()
  
  if (!session || (session.user as any).role !== 'admin') {
    redirect('/')
  }

  // Stats generales
  const [totalUsers, totalTournaments, activeTournaments, totalMatches] = await Promise.all([
    prisma.user.count(),
    prisma.tournament.count(),
    prisma.tournament.count({
      where: {
        status: 'active'
      }
    }),
    prisma.match.count()
  ])

  // Torneos recientes
  const recentTournaments = await prisma.tournament.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      _count: {
        select: {
          participants: true
        }
      }
    }
  })

  // Usuarios recientes
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold font-poppins gradient-text mb-2">
              🛡️ Panel de Administrador
            </h1>
            <p className="text-gray-400">Gestión completa de SmashRank Argentina</p>
          </div>
          <Link href="/admin/tournaments/create" className="btn-primary">
            + Crear Torneo
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl">
                👥
              </div>
              <div>
                <p className="text-gray-400 text-sm">Usuarios Registrados</p>
                <p className="text-3xl font-bold text-blue-400">{totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl">
                🏆
              </div>
              <div>
                <p className="text-gray-400 text-sm">Torneos Totales</p>
                <p className="text-3xl font-bold text-purple-400">{totalTournaments}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-2xl">
                ⚡
              </div>
              <div>
                <p className="text-gray-400 text-sm">Torneos Activos</p>
                <p className="text-3xl font-bold text-green-400">{activeTournaments}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-2xl">
                ⚔️
              </div>
              <div>
                <p className="text-gray-400 text-sm">Matches Jugados</p>
                <p className="text-3xl font-bold text-pink-400">{totalMatches}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/tournaments" className="card p-6 hover:scale-105 transition-transform">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-xl font-bold mb-2">Gestionar Torneos</h3>
            <p className="text-gray-400 text-sm">Crear, editar y administrar torneos</p>
          </Link>

          <Link href="/admin/users" className="card p-6 hover:scale-105 transition-transform">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="text-xl font-bold mb-2">Gestionar Usuarios</h3>
            <p className="text-gray-400 text-sm">Ver y administrar jugadores registrados</p>
          </Link>

          <Link href="/admin/matches" className="card p-6 hover:scale-105 transition-transform">
            <div className="text-3xl mb-3">⚔️</div>
            <h3 className="text-xl font-bold mb-2">Gestionar Matches</h3>
            <p className="text-gray-400 text-sm">Reportar resultados y resolver disputas</p>
          </Link>
        </div>

        {/* Recent Tournaments */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Torneos Recientes</h2>
            <Link href="/admin/tournaments" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              Ver Todos →
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentTournaments.map((tournament) => (
              <div 
                key={tournament.id}
                className="flex items-center justify-between p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-colors"
              >
                <div>
                  <h3 className="font-semibold">{tournament.name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tournament.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      tournament.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {tournament.status === 'active' ? 'Activo' : 
                       tournament.status === 'upcoming' ? 'Próximo' : 'Finalizado'}
                    </span>
                    <span className="text-sm text-gray-400">
                      {tournament._count.participants} participantes
                    </span>
                  </div>
                </div>
                <Link 
                  href={`/admin/tournaments/${tournament.id}`}
                  className="btn-secondary py-2 px-4 text-sm"
                >
                  Gestionar
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Usuarios Recientes</h2>
            <Link href="/admin/users" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              Ver Todos →
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div 
                key={user.id}
                className="flex items-center justify-between p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold">
                    {user.gamertag.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.gamertag}</h3>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-purple-400">{user.points} pts</p>
                  <p className="text-xs text-gray-400">{user.region}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
