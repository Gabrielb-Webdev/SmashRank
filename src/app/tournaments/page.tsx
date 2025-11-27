'use client'

export default function TournamentsPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-poppins gradient-text mb-4">
          Torneos
        </h1>
        <p className="text-gray-400 text-lg">
          Encuentra y únete a torneos de Super Smash Bros Ultimate
        </p>
      </div>

      {/* Coming Soon */}
      <div className="card p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-6">🏆</div>
          <h2 className="text-2xl font-bold font-poppins mb-4">
            Próximamente
          </h2>
          <p className="text-gray-400">
            La lista de torneos estará disponible pronto. Aquí podrás ver todos los torneos activos, 
            próximos y completados.
          </p>
        </div>
      </div>
    </div>
  )
}
