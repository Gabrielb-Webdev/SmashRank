import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: HTTPServer & {
      io?: SocketIOServer;
    };
  };
};

export const initSocketServer = (server: HTTPServer) => {
  if (!(server as any).io) {
    console.log('Inicializando Socket.IO...');
    
    const io = new SocketIOServer(server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      console.log('Cliente conectado:', socket.id);

      // Join tournament room
      socket.on('join-tournament', (tournamentId: string) => {
        socket.join(`tournament-${tournamentId}`);
        console.log(`Cliente ${socket.id} se unió a tournament-${tournamentId}`);
      });

      // Leave tournament room
      socket.on('leave-tournament', (tournamentId: string) => {
        socket.leave(`tournament-${tournamentId}`);
        console.log(`Cliente ${socket.id} salió de tournament-${tournamentId}`);
      });

      socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
      });
    });

    (server as any).io = io;
  }
  
  return (server as any).io;
};

export const getSocketServer = (res: NextApiResponseWithSocket): SocketIOServer => {
  if (!res.socket.server.io) {
    throw new Error('Socket.IO no está inicializado');
  }
  return res.socket.server.io;
};

// Eventos que puede emitir el servidor
export const SocketEvents = {
  // Tournament events
  TOURNAMENT_UPDATED: 'tournament:updated',
  TOURNAMENT_STARTED: 'tournament:started',
  TOURNAMENT_FINISHED: 'tournament:finished',
  
  // Participant events
  PARTICIPANT_REGISTERED: 'participant:registered',
  PARTICIPANT_UNREGISTERED: 'participant:unregistered',
  PARTICIPANT_CHECKED_IN: 'participant:checked-in',
  
  // Match events
  MATCH_UPDATED: 'match:updated',
  MATCH_COMPLETED: 'match:completed',
  
  // Bracket events
  BRACKET_GENERATED: 'bracket:generated',
  BRACKET_UPDATED: 'bracket:updated'
} as const;
