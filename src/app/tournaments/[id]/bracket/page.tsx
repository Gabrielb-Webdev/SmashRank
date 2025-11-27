'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Match = {
  id: number;
  round: number;
  matchNumber: number;
  player1: {
    id: number;
    gamertag: string;
  } | null;
  player2: {
    id: number;
    gamertag: string;
  } | null;
  winnerId: number | null;
  player1Score: number;
  player2Score: number;
};

type Tournament = {
  id: string;
  title: string;
  format: string;
  status: string;
  matches: Match[];
};

export default function BracketPage({ params }: { params: { id: string } }) {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tournaments/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setTournament(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0118] via-purple-950 to-[#0A0118] flex items-center justify-center">
        <div className="text-white text-xl">Cargando bracket...</div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0118] via-purple-950 to-[#0A0118] flex items-center justify-center">
        <div className="text-white text-xl">Torneo no encontrado</div>
      </div>
    );
  }

  // Agrupar matches por ronda
  const rounds: Record<number, Match[]> = {};
  tournament.matches.forEach(match => {
    if (!rounds[match.round]) {
      rounds[match.round] = [];
    }
    rounds[match.round].push(match);
  });

  const sortedRounds = Object.keys(rounds)
    .map(Number)
    .sort((a, b) => a - b);

  const getRoundName = (roundNum: number, totalRounds: number) => {
    const roundsFromEnd = totalRounds - roundNum;
    if (roundsFromEnd === 0) return 'Gran Final';
    if (roundsFromEnd === 1) return 'Final';
    if (roundsFromEnd === 2) return 'Semifinal';
    if (roundsFromEnd === 3) return 'Cuartos';
    return `Ronda ${roundNum}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0118] via-purple-950 to-[#0A0118] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-[#EC4899]">Inicio</Link>
          <span className="mx-2">/</span>
          <Link href="/tournaments" className="hover:text-[#EC4899]">Torneos</Link>
          <span className="mx-2">/</span>
          <Link href={`/tournaments/${params.id}`} className="hover:text-[#EC4899]">{tournament.title}</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Bracket</span>
        </div>

        {/* Header */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent mb-2">
            {tournament.title} - Bracket
          </h1>
          <p className="text-gray-300">Formato: {tournament.format === 'single' ? 'Eliminación Simple' : 'Doble Eliminación'}</p>
        </div>

        {tournament.matches.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold text-white mb-2">Bracket aún no generado</h2>
            <p className="text-gray-400">El bracket se generará cuando comience el torneo</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Winners Bracket */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-3xl">🏆</span>
                Winners Bracket
              </h2>
              
              <div className="overflow-x-auto">
                <div className="flex gap-8 min-w-max pb-4">
                  {sortedRounds.map(roundNum => (
                    <div key={roundNum} className="flex-shrink-0">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold text-[#7C3AED]">
                          {getRoundName(roundNum, sortedRounds.length)}
                        </h3>
                        <p className="text-sm text-gray-400">Ronda {roundNum}</p>
                      </div>
                      
                      <div className="space-y-4">
                        {rounds[roundNum]
                          .sort((a, b) => a.matchNumber - b.matchNumber)
                          .map(match => (
                            <div
                              key={match.id}
                              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 w-64"
                            >
                              <div className="text-xs text-gray-400 mb-2">
                                Match #{match.matchNumber}
                              </div>
                              
                              {/* Player 1 */}
                              <div className={`flex justify-between items-center p-2 rounded mb-1 ${
                                match.winnerId === match.player1?.id ? 'bg-green-500/20 border border-green-500/50' : 'bg-white/5'
                              }`}>
                                <span className="text-white font-medium">
                                  {match.player1?.gamertag || 'TBD'}
                                </span>
                                {match.player1 && (
                                  <span className="text-lg font-bold text-[#7C3AED]">
                                    {match.player1Score}
                                  </span>
                                )}
                              </div>

                              {/* Player 2 */}
                              <div className={`flex justify-between items-center p-2 rounded ${
                                match.winnerId === match.player2?.id ? 'bg-green-500/20 border border-green-500/50' : 'bg-white/5'
                              }`}>
                                <span className="text-white font-medium">
                                  {match.player2?.gamertag || 'TBD'}
                                </span>
                                {match.player2 && (
                                  <span className="text-lg font-bold text-[#EC4899]">
                                    {match.player2Score}
                                  </span>
                                )}
                              </div>

                              {match.winnerId && (
                                <div className="mt-2 text-center text-xs text-green-400">
                                  ✓ Completado
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Losers Bracket (solo para doble eliminación) */}
            {tournament.format === 'double' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-3xl">⚡</span>
                  Losers Bracket
                </h2>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
                  <p className="text-gray-400">Losers bracket se mostrará aquí</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Leyenda</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500/20 border border-green-500/50 rounded"></div>
              <span className="text-sm text-gray-300">Ganador del match</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white/5 rounded"></div>
              <span className="text-sm text-gray-300">Match pendiente</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#7C3AED] font-bold">●</span>
              <span className="text-sm text-gray-300">Jugador 1</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#EC4899] font-bold">●</span>
              <span className="text-sm text-gray-300">Jugador 2</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-sm text-gray-300">Match completado</span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href={`/tournaments/${params.id}`}
            className="inline-block bg-white/5 border border-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-all"
          >
            ← Volver al Torneo
          </Link>
        </div>
      </div>
    </div>
  );
}
