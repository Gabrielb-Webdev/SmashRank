'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Inicializar socket solo una vez
    if (!socket) {
      socket = io({
        path: '/api/socket',
        addTrailingSlash: false
      });

      socket.on('connect', () => {
        console.log('Socket conectado');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('Socket desconectado');
        setIsConnected(false);
      });
    }

    return () => {
      // No desconectar aquí para mantener la conexión activa
    };
  }, []);

  return { socket, isConnected };
};

export const joinTournament = (tournamentId: string) => {
  if (socket?.connected) {
    socket.emit('join-tournament', tournamentId);
  }
};

export const leaveTournament = (tournamentId: string) => {
  if (socket?.connected) {
    socket.emit('leave-tournament', tournamentId);
  }
};
