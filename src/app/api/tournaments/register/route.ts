import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { tournamentId } = await req.json()

    // Verificar que el torneo existe
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        _count: {
          select: {
            participants: true
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

    // Verificar que el torneo está abierto
    if (tournament.status !== 'upcoming') {
      return NextResponse.json(
        { error: 'El torneo no está abierto para registros' },
        { status: 400 }
      )
    }

    // Verificar que hay espacio
    if (tournament._count.participants >= tournament.maxPlayers) {
      return NextResponse.json(
        { error: 'El torneo está completo' },
        { status: 400 }
      )
    }

    // Verificar que no está ya registrado
    const existing = await prisma.tournamentParticipant.findUnique({
      where: {
        userId_tournamentId: {
          userId: session.user.id,
          tournamentId
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Ya estás registrado en este torneo' },
        { status: 400 }
      )
    }

    // Registrar al participante
    const participant = await prisma.tournamentParticipant.create({
      data: {
        userId: session.user.id,
        tournamentId,
        checkedIn: false
      }
    })

    return NextResponse.json(participant)
  } catch (error) {
    console.error('Error registering participant:', error)
    return NextResponse.json(
      { error: 'Error al registrarse' },
      { status: 500 }
    )
  }
}
