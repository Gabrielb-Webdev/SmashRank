import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/session';

// Note: Socket.IO events will be emitted via middleware or separate service

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const tournamentId = params.id;

    // Verificar que el torneo existe y está en estado correcto
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        _count: {
          select: { participants: true }
        }
      }
    });

    if (!tournament) {
      return NextResponse.json(
        { error: 'Torneo no encontrado' },
        { status: 404 }
      );
    }

    if (tournament.status !== 'upcoming' && tournament.status !== 'checkin') {
      return NextResponse.json(
        { error: 'Las inscripciones están cerradas para este torneo' },
        { status: 400 }
      );
    }

    if (tournament._count.participants >= tournament.maxPlayers) {
      return NextResponse.json(
        { error: 'El torneo está lleno' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya está inscrito
    const existingParticipant = await prisma.tournamentParticipant.findFirst({
      where: {
        tournamentId,
        userId: session.user.id
      }
    });

    if (existingParticipant) {
      return NextResponse.json(
        { error: 'Ya estás inscrito en este torneo' },
        { status: 400 }
      );
    }

    // Obtener el siguiente seed number
    const lastParticipant = await prisma.tournamentParticipant.findFirst({
      where: { tournamentId },
      orderBy: { seed: 'desc' }
    });

    const nextSeed = lastParticipant && lastParticipant.seed ? lastParticipant.seed + 1 : 1;

    // Crear la inscripción
    const participant = await prisma.tournamentParticipant.create({
      data: {
        tournamentId,
        userId: session.user.id,
        seed: nextSeed,
        checkedIn: false
      },
      include: {
        user: {
          select: {
            id: true,
            gamertag: true,
            mainCharacter: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Inscripción exitosa',
      participant
    });

  } catch (error) {
    console.error('Error en inscripción:', error);
    return NextResponse.json(
      { error: 'Error al procesar la inscripción' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const tournamentId = params.id;

    // Verificar que el torneo existe
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId }
    });

    if (!tournament) {
      return NextResponse.json(
        { error: 'Torneo no encontrado' },
        { status: 404 }
      );
    }

    // No permitir cancelar inscripción si el torneo ya comenzó
    if (tournament.status === 'ongoing' || tournament.status === 'finished') {
      return NextResponse.json(
        { error: 'No puedes cancelar tu inscripción en un torneo que ya comenzó' },
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

    // Eliminar la inscripción
    await prisma.tournamentParticipant.delete({
      where: { id: participant.id }
    });

    // Reajustar los seeds de los participantes restantes
    await prisma.$executeRaw`
      UPDATE TournamentParticipant
      SET seed = seed - 1
      WHERE tournamentId = ${tournamentId} AND seed > ${participant.seed}
    `;

    return NextResponse.json({
      message: 'Inscripción cancelada exitosamente'
    });

  } catch (error) {
    console.error('Error al cancelar inscripción:', error);
    return NextResponse.json(
      { error: 'Error al cancelar la inscripción' },
      { status: 500 }
    );
  }
}
