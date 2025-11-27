import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            gamertag: true
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                gamertag: true,
                points: true,
                mainCharacter: true
              }
            }
          },
          orderBy: {
            seed: 'asc'
          }
        }
      }
    });

    if (!tournament) {
      return NextResponse.json(
        { error: 'Torneo no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(tournament);
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return NextResponse.json(
      { error: 'Error al obtener el torneo' },
      { status: 500 }
    );
  }
}
