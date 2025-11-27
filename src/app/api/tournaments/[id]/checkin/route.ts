import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/session';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const tournamentId = parseInt(params.id);

    if (isNaN(tournamentId)) {
      return NextResponse.json(
        { error: 'ID de torneo inválido' },
        { status: 400 }
      );
    }

    // Verificar que el torneo existe y está en check-in
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId }
    });

    if (!tournament) {
      return NextResponse.json(
        { error: 'Torneo no encontrado' },
        { status: 404 }
      );
    }

    if (tournament.status !== 'checkin') {
      return NextResponse.json(
        { error: 'El check-in no está disponible aún' },
        { status: 400 }
      );
    }

    // Buscar la inscripción
    const participant = await prisma.tournamentParticipant.findFirst({
      where: {
        tournamentId,
        userId: session.user.id
      }
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'No estás inscrito en este torneo' },
        { status: 404 }
      );
    }

    if (participant.checkedIn) {
      return NextResponse.json(
        { error: 'Ya hiciste check-in' },
        { status: 400 }
      );
    }

    // Hacer check-in
    const updatedParticipant = await prisma.tournamentParticipant.update({
      where: { id: participant.id },
      data: { checkedIn: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            gamertag: true,
            mainCharacter: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Check-in exitoso',
      participant: updatedParticipant
    });

  } catch (error) {
    console.error('Error en check-in:', error);
    return NextResponse.json(
      { error: 'Error al procesar el check-in' },
      { status: 500 }
    );
  }
}
