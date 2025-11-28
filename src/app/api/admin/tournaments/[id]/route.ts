import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function PUT(
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

    const body = await req.json()
    const {
      name,
      description,
      game,
      format,
      maxPlayers,
      startDate,
      endDate,
      checkInTime,
      entryFee,
      prizePool,
      rules
    } = body

    // Verificar que el torneo existe
    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id }
    })

    if (!tournament) {
      return NextResponse.json(
        { error: 'Torneo no encontrado' },
        { status: 404 }
      )
    }

    // No permitir editar torneos finalizados
    if (tournament.status === 'finished') {
      return NextResponse.json(
        { error: 'No se pueden editar torneos finalizados' },
        { status: 400 }
      )
    }

    // Actualizar torneo
    const updated = await prisma.tournament.update({
      where: { id: params.id },
      data: {
        name,
        description,
        game,
        format,
        maxPlayers: parseInt(maxPlayers),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        checkInTime: new Date(checkInTime),
        entryFee: parseFloat(entryFee) || 0,
        prizePool,
        rules
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating tournament:', error)
    return NextResponse.json(
      { error: 'Error al actualizar torneo' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Verificar que el torneo existe
    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      include: {
        participants: true,
        matches: true
      }
    })

    if (!tournament) {
      return NextResponse.json(
        { error: 'Torneo no encontrado' },
        { status: 404 }
      )
    }

    // Eliminar en orden: matches -> participants -> tournament
    await prisma.match.deleteMany({
      where: { tournamentId: params.id }
    })

    await prisma.tournamentParticipant.deleteMany({
      where: { tournamentId: params.id }
    })

    await prisma.tournament.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tournament:', error)
    return NextResponse.json(
      { error: 'Error al eliminar torneo' },
      { status: 500 }
    )
  }
}
