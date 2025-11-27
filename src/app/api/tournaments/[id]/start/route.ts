import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/session';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const tournamentId = params.id;

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                gamertag: true,
                mainCharacter: true
              }
            }
          },
          where: {
            checkedIn: true
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

    if (tournament.status !== 'checkin' && tournament.status !== 'upcoming') {
      return NextResponse.json(
        { error: 'El torneo ya comenzó o finalizó' },
        { status: 400 }
      );
    }

    const checkedInParticipants = tournament.participants.filter(p => p.checkedIn);

    if (checkedInParticipants.length < 2) {
      return NextResponse.json(
        { error: 'Se necesitan al menos 2 participantes con check-in' },
        { status: 400 }
      );
    }

    // Generar bracket
    const matches = generateBracket(checkedInParticipants, tournament.format);

    // Crear matches en la base de datos
    await prisma.match.createMany({
      data: matches.map(match => ({
        tournamentId,
        round: `R${match.round}`,
        bestOf: 3,
        player1Id: match.player1Id,
        player2Id: match.player2Id || ''
      }))
    });

    // Actualizar estado del torneo
    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { status: 'ongoing' }
    });

    return NextResponse.json({
      message: 'Bracket generado exitosamente',
      matchCount: matches.length
    });

  } catch (error) {
    console.error('Error al generar bracket:', error);
    return NextResponse.json(
      { error: 'Error al generar el bracket' },
      { status: 500 }
    );
  }
}

function generateBracket(
  participants: Array<{ id: string; seed: number | null; user: { gamertag: string } }>,
  format: string
) {
  const matches: Array<{
    round: number;
    matchNumber: number;
    player1Id: string;
    player2Id: string | null;
  }> = [];

  // Single Elimination Bracket
  if (format === 'single') {
    // Calcular número de rondas (log2 del siguiente power of 2)
    const numParticipants = participants.length;
    const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(numParticipants)));
    const totalRounds = Math.log2(nextPowerOf2);

    // Primera ronda
    let matchNumber = 1;
    for (let i = 0; i < numParticipants; i += 2) {
      if (i + 1 < numParticipants) {
        matches.push({
          round: 1,
          matchNumber: matchNumber++,
          player1Id: participants[i].id,
          player2Id: participants[i + 1].id
        });
      } else {
        // Bye - jugador pasa directo a siguiente ronda
        matches.push({
          round: 1,
          matchNumber: matchNumber++,
          player1Id: participants[i].id,
          player2Id: null
        });
      }
    }

    // Generar matches vacíos para rondas siguientes
    for (let round = 2; round <= totalRounds; round++) {
      const matchesInRound = Math.pow(2, totalRounds - round);
      for (let i = 0; i < matchesInRound; i++) {
        matches.push({
          round,
          matchNumber: matchNumber++,
          player1Id: '', // TBD
          player2Id: ''  // TBD
        });
      }
    }
  }

  // Double Elimination - implementación básica
  if (format === 'double') {
    // Por ahora, solo winners bracket
    // Implementación completa requiere winners + losers bracket
    const numParticipants = participants.length;
    let matchNumber = 1;

    for (let i = 0; i < numParticipants; i += 2) {
      if (i + 1 < numParticipants) {
        matches.push({
          round: 1,
          matchNumber: matchNumber++,
          player1Id: participants[i].id,
          player2Id: participants[i + 1].id
        });
      }
    }
  }

  return matches;
}
