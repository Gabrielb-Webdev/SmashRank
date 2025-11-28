'use client'

import { organizeBracketByRounds } from '@/lib/bracket'
import type { BracketMatch } from '@/lib/bracket'
import ReportResultModal from './ReportResultModal'

type Props = {
  matches: BracketMatch[]
  format: 'single' | 'double'
}

export default function BracketView({ matches, format }: Props) {
  const rounds = organizeBracketByRounds(matches)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Bracket</h2>
        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium border border-purple-500/30">
          {format === 'double' ? 'Double Elimination' : 'Single Elimination'}
        </span>
      </div>

      {/* Rounds */}
      <div className="space-y-12">
        {rounds.map((round) => (
          <div key={round.name} className="space-y-4">
            <h3 className="text-xl font-bold text-purple-400">{round.name}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {round.matches.map((match, index) => (
                <MatchCard key={match.id || index} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {rounds.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No hay matches en el bracket todavía</p>
        </div>
      )}
    </div>
  )
}

function MatchCard({ match }: { match: BracketMatch }) {
  const isFinished = match.status === 'finished'
  const isPending = match.status === 'pending'
  const isWaiting = match.status === 'waiting' || !match.player1Id || !match.player2Id

  return (
    <div className={`
      card p-4 border transition-colors
      ${isFinished ? 'border-green-500/30 bg-green-500/5' : 
        isPending ? 'border-yellow-500/30 bg-yellow-500/5' : 
        'border-purple-500/20'}
    `}>
      {/* Status Badge */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs text-gray-500 font-mono">Match #{match.position + 1}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${
          isFinished ? 'bg-green-500/20 text-green-400' :
          isPending ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {isFinished ? 'Finalizado' : isPending ? 'En curso' : 'Esperando'}
        </span>
      </div>

      {/* Players */}
      <div className="space-y-2">
        {/* Player 1 */}
        <div className={`
          flex items-center justify-between p-2 rounded-lg border
          ${match.winnerId === match.player1Id 
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-purple-500/5 border-purple-500/20'}
        `}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
              {match.player1?.gamertag?.charAt(0).toUpperCase() || '?'}
            </div>
            <span className={`text-sm font-medium ${
              match.winnerId === match.player1Id ? 'text-green-400' : ''
            }`}>
              {match.player1?.gamertag || 'TBD'}
            </span>
          </div>
          {isFinished && (
            <span className="font-bold text-lg">{match.player1Score}</span>
          )}
          {match.winnerId === match.player1Id && (
            <span className="text-green-400">👑</span>
          )}
        </div>

        {/* VS */}
        <div className="text-center text-xs text-gray-500">VS</div>

        {/* Player 2 */}
        <div className={`
          flex items-center justify-between p-2 rounded-lg border
          ${match.winnerId === match.player2Id 
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-purple-500/5 border-purple-500/20'}
        `}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center text-xs font-bold">
              {match.player2?.gamertag?.charAt(0).toUpperCase() || '?'}
            </div>
            <span className={`text-sm font-medium ${
              match.winnerId === match.player2Id ? 'text-green-400' : ''
            }`}>
              {match.player2?.gamertag || 'TBD'}
            </span>
          </div>
          {isFinished && (
            <span className="font-bold text-lg">{match.player2Score}</span>
          )}
          {match.winnerId === match.player2Id && (
            <span className="text-green-400">👑</span>
          )}
        </div>
      </div>

      {/* Report Result Button */}
      {isPending && match.player1 && match.player2 && (
        <div className="mt-3">
          <ReportResultModal 
            matchId={match.id}
            player1={{ id: match.player1.id, gamertag: match.player1.gamertag }}
            player2={{ id: match.player2.id, gamertag: match.player2.gamertag }}
            bestOf={match.bestOf || 3}
          />
        </div>
      )}
    </div>
  )
}
