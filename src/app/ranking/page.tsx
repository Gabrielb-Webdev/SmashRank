import { prisma } from '@/lib/prisma'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

async function getPlayers() {
  try {
    const players = await prisma.user.findMany({
      where: {
        role: 'player'
      },
      select: {
        id: true,
        gamertag: true,
        points: true,
        mainCharacter: true,
        region: true,
        avatar: true,
        tournaments: {
          select: {
            placement: true
          }
        }
      },
      orderBy: {
        points: 'desc'
      }
    })
    return players
  } catch (error) {
    console.error('Error fetching players:', error)
    return []
  }
}

export default async function RankingPage() {
  const players = await getPlayers()

  const getRankIcon = (position: number) => {
    if (position === 1) return '🥇'
    if (position === 2) return '🥈'
    if (position === 3) return '🥉'
    return `#${position}`
  }

  const getRankColor = (position: number) => {
    if (position === 1) return 'text-yellow-400'
    if (position === 2) return 'text-gray-300'
    if (position === 3) return 'text-orange-400'
    return 'text-gray-500'
  }

  const getWinRate = (tournaments: any[]) => {
    if (tournaments.length === 0) return 0
    const topThree = tournaments.filter(t => t.placement && t.placement <= 3).length
    return Math.round((topThree / tournaments.length) * 100)
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold font-poppins gradient-text mb-4">
          🏆 Ranking
        </h1>
        <p className="text-gray-300 text-lg font-semibold">
          Tabla de clasificación de jugadores de SmashRank
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-interactive animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-sm text-gray-300 mb-2 font-semibold">Total Jugadores</h3>
          <p className="text-3xl font-bold gradient-text">{players.length}</p>
        </div>
        <div className="card-interactive animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-sm text-gray-300 mb-2 font-semibold">Puntos Promedio</h3>
          <p className="text-3xl font-bold gradient-text">
            {Math.round(players.reduce((sum, p) => sum + p.points, 0) / (players.length || 1))}
          </p>
        </div>
        <div className="card-interactive animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-sm text-gray-300 mb-2 font-semibold">Líder Actual</h3>
          <p className="text-3xl font-bold gradient-text">
            {players[0]?.gamertag || 'N/A'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4 flex-wrap items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <select className="select-fancy w-auto">
          <option>📍 Todas las provincias</option>
          <option>Buenos Aires</option>
          <option>Ciudad Autónoma de Buenos Aires</option>
          <option>Córdoba</option>
          <option>Santa Fe</option>
          <option>Mendoza</option>
          <option>Tucumán</option>
          <option>Entre Ríos</option>
          <option>Salta</option>
          <option>Misiones</option>
          <option>Chaco</option>
          <option>Corrientes</option>
          <option>Santiago del Estero</option>
          <option>San Juan</option>
          <option>Jujuy</option>
          <option>Río Negro</option>
          <option>Neuquén</option>
          <option>Formosa</option>
          <option>Chubut</option>
          <option>San Luis</option>
          <option>Catamarca</option>
          <option>La Rioja</option>
          <option>La Pampa</option>
          <option>Santa Cruz</option>
          <option>Tierra del Fuego</option>
        </select>
        <input 
          type="text" 
          placeholder="🔍 Buscar jugador..." 
          className="input flex-1 max-w-md font-semibold"
        />
      </div>

      {/* Ranking Table */}
      {players.length === 0 ? (
        <div className="card p-12 text-center animate-fade-in">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-6 animate-float">📊</div>
            <h2 className="text-2xl font-bold font-poppins mb-4 gradient-text">
              No hay jugadores registrados
            </h2>
            <p className="text-gray-300">
              El ranking aparecerá cuando los jugadores se registren y participen en torneos.
            </p>
          </div>
        </div>
      ) : (
        <div className="card overflow-hidden animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/30 bg-purple-500/5">
                  <th className="text-left p-4 text-gray-200 font-bold">Posición</th>
                  <th className="text-left p-4 text-gray-200 font-bold">Jugador</th>
                  <th className="text-left p-4 text-gray-200 font-bold">Personaje(s)</th>
                  <th className="text-center p-4 text-gray-200 font-bold">Región</th>
                  <th className="text-center p-4 text-gray-200 font-bold">Torneos</th>
                  <th className="text-center p-4 text-gray-200 font-bold">Top 3</th>
                  <th className="text-right p-4 text-gray-200 font-bold">Puntos</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => {
                  const position = index + 1
                  const winRate = getWinRate(player.tournaments)
                  const characters = player.mainCharacter?.split(',') || []
                  
                  return (
                    <tr 
                      key={player.id}
                      className="border-b border-purple-500/10 hover:bg-purple-500/10 transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                    >
                      {/* Position */}
                      <td className="p-4">
                        <div className={`text-2xl font-bold ${getRankColor(position)}`}>
                          {getRankIcon(position)}
                        </div>
                      </td>

                      {/* Player */}
                      <td className="p-4">
                        <a href={`/players/${player.id}`} className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-purple-500/50 transition-shadow duration-300">
                            {player.gamertag[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors">{player.gamertag}</div>
                            {position <= 3 && (
                              <div className="text-xs text-yellow-400 font-semibold">⭐ Top Player</div>
                            )}
                          </div>
                        </a>
                      </td>

                      {/* Characters */}
                      <td className="p-4">
                        <div className="flex gap-2 flex-wrap">
                          {characters.length > 0 ? (
                            characters.map((char, i) => (
                              <span 
                                key={i}
                                className="px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 rounded-full text-xs font-bold border border-purple-500/20 hover:scale-110 transition-transform duration-200"
                              >
                                {char.trim()}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm font-semibold">-</span>
                          )}
                        </div>
                      </td>

                      {/* Region */}
                      <td className="p-4 text-center">
                        <span className="text-sm text-gray-200 font-semibold">
                          {player.region || '-'}
                        </span>
                      </td>

                      {/* Tournaments */}
                      <td className="p-4 text-center">
                        <span className="font-bold text-white text-lg">{player.tournaments.length}</span>
                      </td>

                      {/* Win Rate */}
                      <td className="p-4 text-center">
                        <span className={`font-bold text-lg ${winRate > 50 ? 'text-green-400' : winRate > 30 ? 'text-blue-400' : 'text-gray-300'}`}>
                          {winRate}%
                        </span>
                      </td>

                      {/* Points */}
                      <td className="p-4 text-right">
                        <div className="font-bold text-xl gradient-text">
                          {player.points.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
