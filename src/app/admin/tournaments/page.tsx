import { getServerSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminTournamentsPage() {
  const session = await getServerSession()
  
  if (!session || (session.user as any).role !== 'admin') {
    redirect('/')
  }

  const tournaments = await prisma.tournament.findMany({
    where: {},
    // Mostrar torneos de todas las provincias de Argentina
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      _count: {
        select: {
          participants: true,
          matches: true
        }
      }
    }
  })

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold font-poppins gradient-text mb-2">
              🏆 Gestión de Torneos
            </h1>
            <p className="text-gray-400">Administra todos los torneos de Argentina</p>
          </div>
          <Link href="/admin/tournaments/create" className="btn-primary">
            + Crear Torneo
          </Link>
        </div>

        {/* Tournaments List */}
        <div className="space-y-4">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{tournament.name}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      tournament.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      tournament.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {tournament.status === 'active' ? '⚡ Activo' : 
                       tournament.status === 'upcoming' ? '📅 Próximo' : '✅ Finalizado'}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 mb-3">{tournament.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-gray-400">
                      👥 <span className="font-semibold text-white">{tournament._count.participants}</span> participantes
                    </span>
                    <span className="text-gray-400">
                      ⚔️ <span className="font-semibold text-white">{tournament._count.matches}</span> matches
                    </span>
                    <span className="text-gray-400">
                      📍 <span className="font-semibold text-white">{tournament.region}</span>
                    </span>
                    <span className="text-gray-400">
                      🎮 <span className="font-semibold text-white">{tournament.game}</span>
                    </span>
                  </div>

                  <div className="mt-3 text-sm text-gray-500">
                    Inicio: {new Date(tournament.startDate).toLocaleDateString('es-AR')}
                    {tournament.endDate && (
                      <> • Fin: {new Date(tournament.endDate).toLocaleDateString('es-AR')}</>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link 
                    href={`/admin/tournaments/${tournament.id}`}
                    className="btn-primary py-2 px-4 text-sm whitespace-nowrap"
                  >
                    Gestionar
                  </Link>
                  <Link 
                    href={`/tournaments/${tournament.id}`}
                    className="btn-secondary py-2 px-4 text-sm whitespace-nowrap"
                  >
                    Ver Público
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {tournaments.length === 0 && (
            <div className="card p-12 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-2">No hay torneos creados</h3>
              <p className="text-gray-400 mb-6">Crea el primer torneo para comenzar</p>
              <Link href="/admin/tournaments/create" className="btn-primary inline-block">
                Crear Primer Torneo
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
