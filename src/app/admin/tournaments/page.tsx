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
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="animate-fade-in">
            <h1 className="text-5xl font-extrabold font-poppins gradient-text mb-3">
              🏆 Gestión de Torneos
            </h1>
            <p className="text-gray-300 text-lg">Administra todos los torneos de Argentina</p>
          </div>
          <Link href="/admin/tournaments/create" className="btn-primary whitespace-nowrap">
            ✨ Crear Torneo
          </Link>
        </div>

        {/* Tournaments List */}
        <div className="space-y-6">
          {tournaments.map((tournament, index) => (
            <div 
              key={tournament.id} 
              className="card-interactive p-6 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-white">{tournament.name}</h3>
                    <span className={`badge ${
                      tournament.status === 'active' ? 'badge-green' :
                      tournament.status === 'upcoming' ? 'badge-blue' :
                      'badge-gray'
                    }`}>
                      {tournament.status === 'active' ? '⚡ Activo' : 
                       tournament.status === 'upcoming' ? '📅 Próximo' : '✅ Finalizado'}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">{tournament.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-2 text-gray-300">
                      <span className="text-2xl">👥</span>
                      <span className="font-bold text-white">{tournament._count.participants}</span>
                      <span>participantes</span>
                    </span>
                    <span className="flex items-center gap-2 text-gray-300">
                      <span className="text-2xl">⚔️</span>
                      <span className="font-bold text-white">{tournament._count.matches}</span>
                      <span>matches</span>
                    </span>
                    <span className="flex items-center gap-2 text-gray-300">
                      <span className="text-2xl">📍</span>
                      <span className="font-bold text-white">{tournament.region}</span>
                    </span>
                    <span className="flex items-center gap-2 text-gray-300">
                      <span className="text-2xl">🎮</span>
                      <span className="font-bold text-white">{tournament.game}</span>
                    </span>
                  </div>

                  <div className="mt-4 text-sm font-medium text-gray-400">
                    📅 Inicio: <span className="text-white">{new Date(tournament.startDate).toLocaleDateString('es-AR')}</span>
                    {tournament.endDate && (
                      <> • Fin: <span className="text-white">{new Date(tournament.endDate).toLocaleDateString('es-AR')}</span></>
                    )}
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-auto">
                  <Link 
                    href={`/admin/tournaments/${tournament.id}`}
                    className="btn-primary py-2.5 px-5 text-sm whitespace-nowrap flex-1 lg:flex-none text-center"
                  >
                    ⚙️ Gestionar
                  </Link>
                  <Link 
                    href={`/tournaments/${tournament.id}`}
                    className="btn-secondary py-2.5 px-5 text-sm whitespace-nowrap flex-1 lg:flex-none text-center"
                  >
                    👁️ Ver Público
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {tournaments.length === 0 && (
            <div className="card p-16 text-center animate-fade-in">
              <div className="text-8xl mb-6 animate-bounce">🏆</div>
              <h3 className="text-3xl font-bold mb-3 gradient-text">No hay torneos creados</h3>
              <p className="text-gray-300 text-lg mb-8">Crea el primer torneo para comenzar</p>
              <Link href="/admin/tournaments/create" className="btn-primary inline-block text-lg">
                ✨ Crear Primer Torneo
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
