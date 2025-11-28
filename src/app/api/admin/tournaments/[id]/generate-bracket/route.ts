import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { generateSingleEliminationBracket, generateDoubleEliminationBracket } from '@/lib/bracket'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      include: {
        participants: {
          where: {
            checkedIn: true
          },
          orderBy: {
            seed: 'asc'
          }
        }
      }
    })

    if (!tournament) {
      return NextResponse.json(
        { error: 'Torneo no encontrado' },
        { status: 404 }
      )
    }

    if (tournament.status !== 'upcoming') {
      return NextResponse.json(
        { error: 'El torneo ya tiene bracket generado' },
        { status: 400 }
      )
    }

    // Verificar que hay al menos 2 participantes con check-in
    if (tournament.participants.length < 2) {
      return NextResponse.json(
        { error: 'Se necesitan al menos 2 participantes con check-in' },
        { status: 400 }
      )
    }

    // Asignar seeds automáticamente si no están asignados
    const participantsWithSeeds = await Promise.all(
      tournament.participants.map(async (p, index) => {
        if (p.seed === null) {
          await prisma.tournamentParticipant.update({
            where: { id: p.id },
            data: { seed: index + 1 }
          })
          return { ...p, seed: index + 1 }
        }
        return p
      })
    )

    // Generar bracket según el formato
    const bracketMatches = tournament.format === 'double'
      ? generateDoubleEliminationBracket(participantsWithSeeds, tournament.id)
      : generateSingleEliminationBracket(participantsWithSeeds, tournament.id)

    // Crear matches en la base de datos
    const roundConfig = tournament.roundConfig as Record<string, number>
    
    const createdMatches = await Promise.all(
      bracketMatches.map(async (match) => {
        // Determinar best-of según la ronda
        const bestOf = roundConfig[match.round] || 3

        return prisma.match.create({
          data: {
            tournamentId: tournament.id,
            round: match.round,
            bestOf,
            player1Id: match.player1Id,
            player2Id: match.player2Id,
            status: match.player1Id && match.player2Id ? 'pending' : 'waiting',
            p1CheckedIn: false,
            p2CheckedIn: false,
            currentStage: null,
            p1Character: null,
            p2Character: null,
            games: []
          }
        })
      })
    )

    // Actualizar estado del torneo
    await prisma.tournament.update({
      where: { id: params.id },
      data: { status: 'active' }
    })

    return NextResponse.json({
      success: true,
      matchesCreated: createdMatches.length,
      message: 'Bracket generado exitosamente'
    })
  } catch (error) {
    console.error('Error generating bracket:', error)
    return NextResponse.json(
      { error: 'Error al generar bracket' },
      { status: 500 }
    )
  }
}
