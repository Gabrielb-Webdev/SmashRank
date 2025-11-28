import { getServerSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function AdminUsersPage() {
  const session = await getServerSession()
  
  if (!session || (session.user as any).role !== 'admin') {
    redirect('/')
  }

  const users = await prisma.user.findMany({
    where: {
      region: 'Argentina' // Solo usuarios de Argentina
    },
    orderBy: {
      points: 'desc' // Ordenar por puntos
    },
    include: {
      _count: {
        select: {
          tournaments: true,
          matchesAsP1: true,
          matchesAsP2: true
        }
      }
    }
  })

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold font-poppins gradient-text mb-2">
            👥 Gestión de Usuarios
          </h1>
          <p className="text-gray-400">Todos los jugadores registrados en Argentina</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="text-3xl mb-2">👤</div>
            <p className="text-gray-400 text-sm">Total Jugadores</p>
            <p className="text-3xl font-bold gradient-text">{users.length}</p>
          </div>
          <div className="card p-6">
            <div className="text-3xl mb-2">🛡️</div>
            <p className="text-gray-400 text-sm">Administradores</p>
            <p className="text-3xl font-bold text-purple-400">
              {users.filter(u => (u as any).role === 'admin').length}
            </p>
          </div>
          <div className="card p-6">
            <div className="text-3xl mb-2">🎮</div>
            <p className="text-gray-400 text-sm">Jugadores Activos</p>
            <p className="text-3xl font-bold text-blue-400">
              {users.filter(u => u._count.tournaments > 0).length}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-500/10 border-b border-purple-500/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Jugador</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Puntos</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Main</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Torneos</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Matches</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-purple-500/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{user.gamertag}</p>
                          <p className="text-xs text-gray-500">{user.region}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-purple-400">{user.points}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {user.mainCharacter?.split(',')[0] || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      {user._count.tournaments}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      {user._count.matchesAsP1 + user._count.matchesAsP2}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        (user as any).role === 'admin' 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {(user as any).role === 'admin' ? '🛡️ Admin' : '🎮 Jugador'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
