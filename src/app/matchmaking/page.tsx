'use client'

export default function MatchmakingPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-poppins gradient-text mb-4">
          Matchmaking
        </h1>
        <p className="text-gray-400 text-lg">
          Encuentra oponentes y juega partidas clasificatorias
        </p>
      </div>

      {/* Coming Soon */}
      <div className="card p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-6">⚔️</div>
          <h2 className="text-2xl font-bold font-poppins mb-4">
            Próximamente
          </h2>
          <p className="text-gray-400">
            El sistema de matchmaking estará disponible pronto. Aquí podrás encontrar oponentes 
            de nivel similar para jugar partidas clasificatorias.
          </p>
        </div>
      </div>
    </div>
  )
}
