import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// API para crear torneos - Argentina only
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
    const startDate = new Date(data.startDate)
    const checkInTime = new Date(startDate.getTime() - 15 * 60 * 1000) // 15 min antes
    
    const tournament = await prisma.tournament.create({
      data: {
        name: data.name,
        description: data.description || '',
        game: data.game,
        maxPlayers: data.maxPlayers || 32,
        startDate,
        endDate: new Date(data.endDate),
        checkInTime,
        format: 'double', // Double elimination por defecto
        region: 'Argentina', // Siempre Argentina
        status: 'upcoming',
        entryFee: data.entryFee || 0,
        prizePool: data.prizePool || null,
        rules: data.rules || null,
        starterStages: ['Battlefield', 'Final Destination', 'Pokemon Stadium 2', 'Smashville'],
        cpStages: ['Kalos Pokemon League', 'Town & City'],
        bannedStages: ['Temple', 'New Pork City'],
        roundConfig: {
          'WR1': 3,
          'WR2': 3,
          'WSF': 3,
          'WF': 5,
          'LR1': 3,
          'LSF': 3,
          'LF': 5,
          'GF': 5
        },
        pointsConfig: {
          '1': 100,
          '2': 75,
          '3': 50,
          '4': 35,
          '5': 25,
          '7': 15,
          '9': 10
        },
        createdById: session.user.id
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
