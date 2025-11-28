import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const data = await req.json()

    // Validaciones básicas
    if (!data.name || !data.game || !data.startDate || !data.endDate) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Crear torneo
    const tournament = await prisma.tournament.create({
      data: {
        name: data.name,
        description: data.description || '',
        game: data.game,
        maxPlayers: data.maxPlayers || 32,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        region: 'Argentina', // Siempre Argentina
        status: 'upcoming',
        entryFee: data.entryFee || 0,
        prizePool: data.prizePool || null,
        rules: data.rules || null
      }
    })

    return NextResponse.json(tournament)
  } catch (error) {
    console.error('Error creating tournament:', error)
    return NextResponse.json(
      { error: 'Error al crear torneo' },
      { status: 500 }
    )
  }
}
