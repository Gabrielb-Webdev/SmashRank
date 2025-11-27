import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/session';

export async function POST(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const session = await requireAuth();
    const matchId = parseInt(params.matchId);
    const body = await request.json();
    const { player1Score, player2Score, winnerId } = body;

    if (isNaN(matchId)) {
      return NextResponse.json(
        { error: 'ID de match inválido' },
        { status: 400 }
      );
    }

    // Validar scores
    if (typeof player1Score !== 'number' || typeof player2Score !== 'number') {
      return NextResponse.json(
        { error: 'Scores inválidos' },
        { status: 400 }
      );
    }

    // Buscar el match
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        tournament: {
          select: {
            id: true,
            status: true,
            creatorId: true
          }
        },
        player1: {
          select: { id: true }
        },
        player2: {
          select: { id: true }
        }
      }
    });

    if (!match) {
      return NextResponse.json(
        { error: 'Match no encontrado' },
        { status: 404 }
      );
    }

    // Verificar permisos (admin o jugadores del match)
    const isAdmin = session.user.role === 'admin';
    const isPlayer = match.player1?.id === session.user.id || match.player2?.id === session.user.id;

    if (!isAdmin && !isPlayer) {
      return NextResponse.json(
        { error: 'No tienes permiso para reportar este match' },
        { status: 403 }
      );
    }

    // Verificar que el torneo esté en curso
    if (match.tournament.status !== 'ongoing') {
      return NextResponse.json(
        { error: 'El torneo no está en curso' },
        { status: 400 }
      );
    }

    // Actualizar match
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        player1Score,
        player2Score,
        winnerId: winnerId || null
      },
      include: {
        player1: {
          select: {
            id: true,
            gamertag: true
          }
        },
        player2: {
          select: {
            id: true,
            gamertag: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Resultado reportado exitosamente',
      match: updatedMatch
    });

  } catch (error) {
    console.error('Error al reportar resultado:', error);
    return NextResponse.json(
      { error: 'Error al reportar el resultado' },
      { status: 500 }
    );
  }
}
