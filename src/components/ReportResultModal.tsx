'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  matchId: string
  player1: { id: string; gamertag: string }
  player2: { id: string; gamertag: string }
  bestOf: number
}

export default function ReportResultModal({ matchId, player1, player2, bestOf }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [p1Score, setP1Score] = useState(0)
  const [p2Score, setP2Score] = useState(0)
  const [winnerId, setWinnerId] = useState('')

  const maxScore = Math.ceil(bestOf / 2)

  async function handleSubmit() {
    if (!winnerId) {
      alert('Selecciona un ganador')
      return
    }

    if (p1Score === 0 && p2Score === 0) {
      alert('Ingresa los scores')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/matches/${matchId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          winnerId,
          player1Score: p1Score,
          player2Score: p2Score
        })
      })

      if (res.ok) {
        alert('✅ Resultado reportado exitosamente')
        setOpen(false)
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'Error al reportar resultado')
      }
    } catch (error) {
      alert('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm font-medium transition-colors border border-purple-500/30"
      >
        Reportar Resultado
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 gradient-text">Reportar Resultado</h3>
            <p className="text-sm text-gray-400 mb-6">Best of {bestOf}</p>

            <div className="space-y-4 mb-6">
              {/* Player 1 */}
              <div className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all
                ${winnerId === player1.id 
                  ? 'bg-green-500/20 border-green-500' 
                  : 'bg-purple-500/5 border-purple-500/20 hover:border-purple-500/50'}
              `}
                onClick={() => setWinnerId(player1.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{player1.gamertag}</span>
                  {winnerId === player1.id && <span className="text-green-400">👑 Ganador</span>}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400">Score:</label>
                  <input
                    type="number"
                    min="0"
                    max={maxScore}
                    value={p1Score}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0
                      setP1Score(Math.min(val, maxScore))
                      if (val >= maxScore) setWinnerId(player1.id)
                    }}
                    className="w-20 px-3 py-1 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Player 2 */}
              <div className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all
                ${winnerId === player2.id 
                  ? 'bg-green-500/20 border-green-500' 
                  : 'bg-purple-500/5 border-purple-500/20 hover:border-purple-500/50'}
              `}
                onClick={() => setWinnerId(player2.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{player2.gamertag}</span>
                  {winnerId === player2.id && <span className="text-green-400">👑 Ganador</span>}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400">Score:</label>
                  <input
                    type="number"
                    min="0"
                    max={maxScore}
                    value={p2Score}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0
                      setP2Score(Math.min(val, maxScore))
                      if (val >= maxScore) setWinnerId(player2.id)
                    }}
                    className="w-20 px-3 py-1 bg-black/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 rounded-lg transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 btn-primary"
                disabled={loading || !winnerId}
              >
                {loading ? 'Guardando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
