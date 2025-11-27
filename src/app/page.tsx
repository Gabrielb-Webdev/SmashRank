export default function Home() {
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
          <h1 className="text-6xl md:text-8xl font-bold font-poppins mb-6">
            <span className="gradient-text">SmashRank</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Plataforma de torneos y ranking
          </p>
          <p className="text-lg text-gray-400 mb-12">
            Super Smash Bros Ultimate
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-primary">
              Ver Torneos
            </button>
            <button className="btn-secondary">
              Ver Ranking
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
            <div className="card">
              <div className="text-4xl font-bold gradient-text mb-2">0</div>
              <div className="text-gray-400">Torneos Activos</div>
            </div>
            <div className="card">
              <div className="text-4xl font-bold gradient-text mb-2">0</div>
              <div className="text-gray-400">Jugadores Registrados</div>
            </div>
            <div className="card">
              <div className="text-4xl font-bold gradient-text mb-2">0</div>
              <div className="text-gray-400">Matches Jugados</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold font-poppins text-center mb-16">
            <span className="gradient-text">Características</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold font-poppins mb-3">Torneos Competitivos</h3>
              <p className="text-gray-400">
                Sistema de brackets single y double elimination con configuración personalizada por ronda
              </p>
            </div>

            <div className="card">
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold font-poppins mb-3">Matchmaking</h3>
              <p className="text-gray-400">
                Encuentra oponentes de tu nivel para partidas amistosas con emparejamiento automático
              </p>
            </div>

            <div className="card">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold font-poppins mb-3">Sistema de Ranking</h3>
              <p className="text-gray-400">
                Sube en el ranking global con puntos personalizados y estadísticas detalladas
              </p>
            </div>

            <div className="card">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold font-poppins mb-3">Stage/Character Select</h3>
              <p className="text-gray-400">
                Sistema interactivo por turnos con DSR (Dave's Stupid Rule) para competencia justa
              </p>
            </div>

            <div className="card">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-2xl font-bold font-poppins mb-3">Verificación de Resultados</h3>
              <p className="text-gray-400">
                Confirmación mutua entre jugadores para garantizar la integridad de los resultados
              </p>
            </div>

            <div className="card">
              <div className="text-5xl mb-4">🔗</div>
              <h3 className="text-2xl font-bold font-poppins mb-3">Integración start.gg</h3>
              <p className="text-gray-400">
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
