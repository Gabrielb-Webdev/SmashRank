// Tipos para el sistema de brackets
export type BracketMatch = {
  id: string
  round: string
  player1Id: string | null
  player2Id: string | null
  player1?: { id: string; gamertag: string }
  player2?: { id: string; gamertag: string }
  winnerId: string | null
  player1Score: number
  player2Score: number
  status: string
  position: number
}

export type BracketRound = {
  name: string
  matches: BracketMatch[]
}

// Generar bracket de eliminación simple
export function generateSingleEliminationBracket(
  participants: Array<{ id: string; userId: string; seed: number | null }>,
  tournamentId: string
): BracketMatch[] {
  const matches: BracketMatch[] = []
  const playerCount = participants.length
  
  // Calcular número de rondas necesarias
  const rounds = Math.ceil(Math.log2(playerCount))
  
  // Ordenar participantes por seed
  const seededParticipants = [...participants].sort((a, b) => 
    (a.seed || 999) - (b.seed || 999)
  )

  // Calcular byes necesarios
  const totalSlots = Math.pow(2, rounds)
  const byes = totalSlots - playerCount

  // Generar primera ronda
  let matchPosition = 0
  const firstRoundMatches: BracketMatch[] = []
  
  for (let i = 0; i < totalSlots / 2; i++) {
    const player1Index = i
    const player2Index = totalSlots - 1 - i
    
    const player1 = seededParticipants[player1Index]
    const player2 = seededParticipants[player2Index]
    
    // Si alguno no existe, es un bye
    if (!player1 || !player2) {
      if (player1) {
        // Player 1 tiene bye, avanza automáticamente
        continue
      } else if (player2) {
        // Player 2 tiene bye, avanza automáticamente
        continue
      }
    }
    
    firstRoundMatches.push({
      id: `temp-${matchPosition}`,
      round: 'R1',
      player1Id: player1?.userId || null,
      player2Id: player2?.userId || null,
      winnerId: null,
      player1Score: 0,
      player2Score: 0,
      status: 'pending',
      position: matchPosition++
    })
  }

  matches.push(...firstRoundMatches)

  // Generar rondas subsecuentes (vacías inicialmente)
  let currentRound = 2
  let matchesInRound = firstRoundMatches.length / 2
  
  while (matchesInRound >= 1) {
    const roundName = matchesInRound === 1 ? 'F' : `R${currentRound}`
    
    for (let i = 0; i < matchesInRound; i++) {
      matches.push({
        id: `temp-${matchPosition}`,
        round: roundName,
        player1Id: null,
        player2Id: null,
        winnerId: null,
        player1Score: 0,
        player2Score: 0,
        status: 'pending',
        position: matchPosition++
      })
    }
    
    currentRound++
    matchesInRound = Math.floor(matchesInRound / 2)
  }

  return matches
}

// Generar bracket de doble eliminación
export function generateDoubleEliminationBracket(
  participants: Array<{ id: string; userId: string; seed: number | null }>,
  tournamentId: string
): BracketMatch[] {
  const matches: BracketMatch[] = []
  const playerCount = participants.length
  
  // Winner's bracket (igual que single elimination)
  const winnersMatches = generateSingleEliminationBracket(participants, tournamentId)
  
  // Modificar rounds para indicar Winner's bracket
  winnersMatches.forEach(match => {
    if (match.round === 'F') {
      match.round = 'WF' // Winner's Finals
    } else if (match.round.startsWith('R')) {
      const roundNum = match.round.substring(1)
      match.round = `WR${roundNum}` // Winner's Round
    }
  })
  
  matches.push(...winnersMatches)

  // Loser's bracket (aproximado - simplificado)
  const losersRounds = Math.ceil(Math.log2(playerCount)) * 2 - 1
  let matchPosition = winnersMatches.length
  
  for (let i = 1; i <= losersRounds; i++) {
    const matchesInRound = Math.max(1, Math.floor(playerCount / Math.pow(2, Math.ceil(i / 2) + 1)))
    const roundName = matchesInRound === 1 ? 'LF' : `LR${i}`
    
    for (let j = 0; j < matchesInRound; j++) {
      matches.push({
        id: `temp-${matchPosition}`,
        round: roundName,
        player1Id: null,
        player2Id: null,
        winnerId: null,
        player1Score: 0,
        player2Score: 0,
        status: 'pending',
        position: matchPosition++
      })
    }
  }

  // Grand Finals
  matches.push({
    id: `temp-${matchPosition}`,
    round: 'GF',
    player1Id: null,
    player2Id: null,
    winnerId: null,
    player1Score: 0,
    player2Score: 0,
    status: 'pending',
    position: matchPosition
  })

  return matches
}

// Organizar matches en rondas para visualización
export function organizeBracketByRounds(matches: BracketMatch[]): BracketRound[] {
  const roundsMap = new Map<string, BracketMatch[]>()
  
  matches.forEach(match => {
    if (!roundsMap.has(match.round)) {
      roundsMap.set(match.round, [])
    }
    roundsMap.get(match.round)!.push(match)
  })

  // Ordenar rondas
  const roundOrder = [
    'WR1', 'WR2', 'WR3', 'WR4', 'WSF', 'WF',
    'LR1', 'LR2', 'LR3', 'LR4', 'LR5', 'LR6', 'LSF', 'LF',
    'GF',
    'R1', 'R2', 'R3', 'R4', 'SF', 'F'
  ]

  const rounds: BracketRound[] = []
  
  roundOrder.forEach(roundName => {
    if (roundsMap.has(roundName)) {
      rounds.push({
        name: getRoundDisplayName(roundName),
        matches: roundsMap.get(roundName)!.sort((a, b) => a.position - b.position)
      })
    }
  })

  return rounds
}

// Obtener nombre legible de la ronda
export function getRoundDisplayName(round: string): string {
  const names: Record<string, string> = {
    'WR1': "Winner's Round 1",
    'WR2': "Winner's Round 2",
    'WR3': "Winner's Round 3",
    'WR4': "Winner's Round 4",
    'WSF': "Winner's Semifinals",
    'WF': "Winner's Finals",
    'LR1': "Loser's Round 1",
    'LR2': "Loser's Round 2",
    'LR3': "Loser's Round 3",
    'LR4': "Loser's Round 4",
    'LR5': "Loser's Round 5",
    'LR6': "Loser's Round 6",
    'LSF': "Loser's Semifinals",
    'LF': "Loser's Finals",
    'GF': "Grand Finals",
    'R1': 'Round 1',
    'R2': 'Round 2',
    'R3': 'Round 3',
    'R4': 'Round 4',
    'SF': 'Semifinals',
    'F': 'Finals'
  }
  return names[round] || round
}

// Calcular siguiente match al ganar
export function getNextMatch(
  currentRound: string,
  position: number,
  isWinner: boolean,
  format: 'single' | 'double'
): { round: string; position: number; slot: 1 | 2 } | null {
  if (format === 'single') {
    // En single elimination, el ganador siempre avanza
    if (currentRound === 'F') return null // Finals no tiene siguiente
    
    const nextRound = getNextRoundName(currentRound, isWinner, format)
    const nextPosition = Math.floor(position / 2)
    const slot = position % 2 === 0 ? 1 : 2
    
    return { round: nextRound, position: nextPosition, slot }
  } else {
    // Double elimination es más complejo
    if (currentRound === 'GF') return null
    
    if (currentRound.startsWith('W')) {
      if (isWinner) {
        // Ganador de Winner's avanza en Winner's
        const nextRound = getNextRoundName(currentRound, true, format)
        const nextPosition = Math.floor(position / 2)
        const slot = position % 2 === 0 ? 1 : 2
        return { round: nextRound, position: nextPosition, slot }
      } else {
        // Perdedor de Winner's va a Loser's
        const loserRound = getLosersBracketRound(currentRound)
        return { round: loserRound, position, slot: 1 }
      }
    } else if (currentRound.startsWith('L')) {
      if (isWinner) {
        // Ganador de Loser's avanza en Loser's
        if (currentRound === 'LF') {
          return { round: 'GF', position: 0, slot: 2 }
        }
        const nextRound = getNextRoundName(currentRound, true, format)
        const nextPosition = Math.floor(position / 2)
        const slot = position % 2 === 0 ? 1 : 2
        return { round: nextRound, position: nextPosition, slot }
      } else {
        // Perdedor de Loser's es eliminado
        return null
      }
    }
  }
  
  return null
}

function getNextRoundName(currentRound: string, isWinner: boolean, format: string): string {
  if (format === 'single') {
    if (currentRound === 'R1') return 'R2'
    if (currentRound === 'R2') return 'R3'
    if (currentRound === 'R3') return 'R4'
    if (currentRound === 'R4') return 'SF'
    if (currentRound === 'SF') return 'F'
    return 'F'
  } else {
    // Double elimination
    if (currentRound.startsWith('W')) {
      if (currentRound === 'WR1') return 'WR2'
      if (currentRound === 'WR2') return 'WR3'
      if (currentRound === 'WR3') return 'WR4'
      if (currentRound === 'WR4') return 'WSF'
      if (currentRound === 'WSF') return 'WF'
      if (currentRound === 'WF') return 'GF'
    } else if (currentRound.startsWith('L')) {
      if (currentRound === 'LR1') return 'LR2'
      if (currentRound === 'LR2') return 'LR3'
      if (currentRound === 'LR3') return 'LR4'
      if (currentRound === 'LR4') return 'LR5'
      if (currentRound === 'LR5') return 'LR6'
      if (currentRound === 'LR6') return 'LSF'
      if (currentRound === 'LSF') return 'LF'
      if (currentRound === 'LF') return 'GF'
    }
  }
  return 'GF'
}

function getLosersBracketRound(winnersRound: string): string {
  const mapping: Record<string, string> = {
    'WR1': 'LR1',
    'WR2': 'LR2',
    'WR3': 'LR3',
    'WR4': 'LR4',
    'WSF': 'LSF',
    'WF': 'LF'
  }
  return mapping[winnersRound] || 'LR1'
}
