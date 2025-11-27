import { NextResponse } from 'next/server'
import { getServerSession, requireAdmin } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: {
        creator: {
          select: {
            gamertag: true
          }
        },
        _count: {
          select: {
            participants: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    return NextResponse.json(tournaments)
  } catch (error) {
    console.error('Error fetching tournaments:', error)
    return NextResponse.json(
      { error: 'Error al obtener torneos' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin()

    const body = await request.json()
    const { name, startDate, format, maxPlayers, starterStages, cpStages, bannedStages, pointsConfig } = body

    // Validations
    if (!name || !startDate || !format || !maxPlayers) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes' },
        { status: 400 }
      )
    }

    // Check-in time is 15 minutes before start
    const checkInTime = new Date(new Date(startDate).getTime() - 15 * 60 * 1000)

    const tournament = await prisma.tournament.create({
      data: {
        name,
        startDate: new Date(startDate),
        checkInTime,
        format,
        maxPlayers,
        starterStages: starterStages || ['Battlefield', 'Final Destination', 'Pokemon Stadium 2'],
        cpStages: cpStages || ['Smashville', 'Town & City'],
        bannedStages: bannedStages || [],
        roundConfig: {
          'WR1': 1,
          'WQF': 3,
          'WSF': 3,
          'WF': 5,
          'LR1': 1,
          'LQF': 3,
          'LSF': 3,
          'LF': 5,
          'GF': 5
        },
        pointsConfig: pointsConfig || {
          '1': 100,
          '2': 75,
          '3': 50,
          '4': 35
        },
        createdById: session.user.id
      },
      include: {
        creator: {
          select: {
            gamertag: true
          }
        }
      }
    })

    return NextResponse.json(tournament, { status: 201 })
  } catch (error) {
    console.error('Error creating tournament:', error)
    return NextResponse.json(
      { error: 'Error al crear torneo' },
      { status: 500 }
    )
  }
}
