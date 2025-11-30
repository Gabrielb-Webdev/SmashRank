import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getStats() {
  try {
    const [tournamentsCount, playersCount, matchesCount] = await Promise.all([
      prisma.tournament.count(),
      prisma.user.count({ where: { role: 'player' } }),
      prisma.match.count({ where: { status: 'finished' } })
    ])
    return { tournamentsCount, playersCount, matchesCount }
  } catch (error) {
    return { tournamentsCount: 0, playersCount: 0, matchesCount: 0 }
  }
}

export default async function Home() {
  const stats = await getStats()

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-bg-darker">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-bold font-poppins mb-6 animate-fade-in">
            <span className="gradient-text">SmashRank</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 animate-fade-in font-bold" style={{ animationDelay: '0.2s' }}>
            Plataforma de torneos y ranking
          </p>
          <p className="text-lg text-gray-400 mb-12 animate-fade-in font-semibold" style={{ animationDelay: '0.4s' }}>
            Super Smash Bros Ultimate
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Link href="/tournaments" className="btn-primary transform hover:scale-110 transition-all duration-300">
              Ver Torneos 🎮
            </Link>
            <Link href="/ranking" className="btn-secondary transform hover:scale-110 transition-all duration-300">
              Ver Ranking 🏆
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
            <div className="card-interactive animate-scale-in" style={{ animationDelay: '0.8s' }}>
              <div className="text-4xl font-bold gradient-text mb-2">{stats.tournamentsCount}</div>
              <div className="text-gray-300 font-semibold">Torneos Activos</div>
            </div>
            <div className="card-interactive animate-scale-in" style={{ animationDelay: '1s' }}>
              <div className="text-4xl font-bold gradient-text mb-2">{stats.playersCount}</div>
              <div className="text-gray-300 font-semibold">Jugadores Registrados</div>
            </div>
            <div className="card-interactive animate-scale-in" style={{ animationDelay: '1.2s' }}>
              <div className="text-4xl font-bold gradient-text mb-2">{stats.matchesCount}</div>
              <div className="text-gray-300 font-semibold">Matches Jugados</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold font-poppins text-center mb-16 animate-fade-in">
            <span className="gradient-text">Características</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-interactive animate-slide-up" style={{ animationDelay: '0s' }}>
              <div className="text-5xl mb-4 animate-float">🏆</div>
              <h3 className="text-2xl font-bold font-poppins mb-3 text-white">Torneos Competitivos</h3>
              <p className="text-gray-300">
                Sistema de brackets single y double elimination con configuración personalizada por ronda
              </p>
            </div>

            <div className="card-interactive animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl mb-4 animate-float" style={{ animationDelay: '0.5s' }}>🎮</div>
              <h3 className="text-2xl font-bold font-poppins mb-3 text-white">Matchmaking</h3>
              <p className="text-gray-300">
                Encuentra oponentes de tu nivel para partidas amistosas con emparejamiento automático
              </p>
            </div>

            <div className="card-interactive animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl mb-4 animate-float" style={{ animationDelay: '1s' }}>📊</div>
              <h3 className="text-2xl font-bold font-poppins mb-3 text-white">Sistema de Ranking</h3>
              <p className="text-gray-300">
                Sube en el ranking global con puntos personalizados y estadísticas detalladas
              </p>
            </div>

            <div className="card-interactive animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-5xl mb-4 animate-float" style={{ animationDelay: '1.5s' }}>🎯</div>
              <h3 className="text-2xl font-bold font-poppins mb-3 text-white">Stage/Character Select</h3>
              <p className="text-gray-300">
                Sistema interactivo por turnos con DSR (Dave's Stupid Rule) para competencia justa
              </p>
            </div>

            <div className="card-interactive animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-5xl mb-4 animate-float" style={{ animationDelay: '2s' }}>✅</div>
              <h3 className="text-2xl font-bold font-poppins mb-3 text-white">Verificación de Resultados</h3>
              <p className="text-gray-300">
                Confirmación mutua entre jugadores para garantizar la integridad de los resultados
              </p>
            </div>

            <div className="card-interactive animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="text-5xl mb-4 animate-float" style={{ animationDelay: '2.5s' }}>🔗</div>
              <h3 className="text-2xl font-bold font-poppins mb-3 text-white">Integración start.gg</h3>
              <p className="text-gray-300">
                Sincroniza tus resultados con start.gg y valida tu participación en torneos oficiales
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-darker py-12 px-6 border-t border-purple-500/10">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 mb-2">
            Desarrollado por <span className="gradient-text font-semibold">Brodev Lab</span>
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 SmashRank. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  )
}
