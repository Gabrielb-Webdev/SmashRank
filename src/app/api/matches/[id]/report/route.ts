import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { getNextMatch } from '@/lib/bracket'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { winnerId, player1Score, player2Score } = await req.json()

    const match = await prisma.match.findUnique({
      where: { id: params.id },
      include: {
        tournament: true,
        player1: true,
        player2: true
      }
    })

    if (!match) {
      return NextResponse.json(
        { error: 'Match no encontrado' },
        { status: 404 }
      )
    }

    // Verificar permisos (admin o uno de los jugadores)
    const isAdmin = (session.user as any).role === 'admin'
    const isPlayer = match.player1Id === session.user.id || match.player2Id === session.user.id
    
    if (!isAdmin && !isPlayer) {
      return NextResponse.json(
        { error: 'No autorizado para reportar este match' },
        { status: 403 }
      )
    }

    // Validar scores
    if (!winnerId || player1Score === undefined || player2Score === undefined) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    if (winnerId !== match.player1Id && winnerId !== match.player2Id) {
      return NextResponse.json(
        { error: 'Winner ID inválido' },
        { status: 400 }
      )
    }

    // Actualizar match
    const updatedMatch = await prisma.match.update({
      where: { id: params.id },
      data: {
        winnerId,
        player1Score,
        player2Score,
        status: 'finished'
      }
    })

    // Determinar ganador y perdedor
    const loserId = winnerId === match.player1Id ? match.player2Id : match.player1Id

    // Avanzar ganador al siguiente match
    if (winnerId) {
      const nextMatchInfo = getNextMatch(
        match.round,
        0, // position - simplificado
        true,
        match.tournament.format as 'single' | 'double'
      )

      if (nextMatchInfo) {
        // Buscar el siguiente match en esa ronda
        const nextMatch = await prisma.match.findFirst({
          where: {
            tournamentId: match.tournamentId,
            round: nextMatchInfo.round,
            status: 'waiting'
          },
          orderBy: {
            createdAt: 'asc'
          }
        })

        if (nextMatch) {
          // Asignar ganador al siguiente match
          if (nextMatchInfo.slot === 1 && !nextMatch.player1Id) {
            await prisma.match.update({
              where: { id: nextMatch.id },
              data: {
                player1Id: winnerId,
                status: nextMatch.player2Id ? 'pending' : 'waiting'
              }
            })
          } else if (nextMatchInfo.slot === 2 && !nextMatch.player2Id) {
            await prisma.match.update({
              where: { id: nextMatch.id },
              data: {
                player2Id: winnerId,
                status: nextMatch.player1Id ? 'pending' : 'waiting'
              }
            })
          }
        }
      }
    }

    // En double elimination, mover perdedor a loser's bracket
    if (match.tournament.format === 'double' && match.round.startsWith('W') && loserId) {
      const loserMatchInfo = getNextMatch(
        match.round,
        0,
        false,
        'double'
      )

      if (loserMatchInfo) {
        const loserMatch = await prisma.match.findFirst({
          where: {
            tournamentId: match.tournamentId,
            round: loserMatchInfo.round,
            status: 'waiting'
          },
          orderBy: {
            createdAt: 'asc'
          }
        })

        if (loserMatch) {
          if (loserMatchInfo.slot === 1 && !loserMatch.player1Id) {
            await prisma.match.update({
              where: { id: loserMatch.id },
              data: {
                player1Id: loserId,
                status: loserMatch.player2Id ? 'pending' : 'waiting'
              }
            })
          } else if (loserMatchInfo.slot === 2 && !loserMatch.player2Id) {
            await prisma.match.update({
              where: { id: loserMatch.id },
              data: {
                player2Id: loserId,
                status: loserMatch.player1Id ? 'pending' : 'waiting'
              }
            })
          }
        }
      }
    }

    // Verificar si el torneo terminó
    const remainingMatches = await prisma.match.count({
      where: {
        tournamentId: match.tournamentId,
        status: {
          in: ['pending', 'waiting', 'in_progress']
        }
      }
    })

    if (remainingMatches === 0) {
      // Torneo terminado, calcular posiciones y puntos
      await finalizeTournament(match.tournamentId)
    }

    return NextResponse.json({
      success: true,
      match: updatedMatch
    })
  } catch (error) {
    console.error('Error reporting match:', error)
    return NextResponse.json(
      { error: 'Error al reportar resultado' },
      { status: 500 }
    )
  }
}

async function finalizeTournament(tournamentId: string) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      matches: {
        where: { status: 'finished' },
        include: {
          player1: true,
          player2: true
        }
      },
      participants: true
    }
  })

  if (!tournament) return

  // Encontrar Grand Finals o Finals
  const finalMatch = tournament.matches.find(m => 
    m.round === 'GF' || m.round === 'F'
  )

  if (finalMatch?.winnerId) {
    const pointsConfig = tournament.pointsConfig as Record<string, number>

    // Asignar primer lugar
    await prisma.tournamentParticipant.updateMany({
      where: {
        tournamentId,
        userId: finalMatch.winnerId
      },
      data: {
        placement: 1,
        pointsEarned: pointsConfig['1'] || 100
      }
    })

    // Actualizar puntos del usuario
    await prisma.user.update({
      where: { id: finalMatch.winnerId },
      data: {
        points: {
          increment: pointsConfig['1'] || 100
        }
      }
    })

    // Crear historial de puntos
    await prisma.pointHistory.create({
      data: {
        userId: finalMatch.winnerId,
        tournamentId,
        pointsChange: pointsConfig['1'] || 100,
        reason: `1er lugar en ${tournament.name}`
      }
    })

    // Segundo lugar
    const secondPlaceId = finalMatch.winnerId === finalMatch.player1Id 
      ? finalMatch.player2Id 
      : finalMatch.player1Id

    if (secondPlaceId) {
      await prisma.tournamentParticipant.updateMany({
        where: {
          tournamentId,
          userId: secondPlaceId
        },
        data: {
          placement: 2,
          pointsEarned: pointsConfig['2'] || 75
        }
      })

      await prisma.user.update({
        where: { id: secondPlaceId },
        data: {
          points: {
            increment: pointsConfig['2'] || 75
          }
        }
      })

      await prisma.pointHistory.create({
        data: {
          userId: secondPlaceId,
          tournamentId,
          pointsChange: pointsConfig['2'] || 75,
          reason: `2do lugar en ${tournament.name}`
        }
      })
    }
  }

  // Actualizar estado del torneo
  await prisma.tournament.update({
    where: { id: tournamentId },
    data: { status: 'finished' }
  })
}
