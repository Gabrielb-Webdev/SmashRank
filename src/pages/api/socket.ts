import { NextApiRequest } from 'next';
import { NextApiResponseWithSocket, initSocketServer } from '@/lib/socket';

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    console.log('Socket.IO ya está corriendo');
  } else {
    console.log('Socket.IO iniciándose...');
    initSocketServer(res.socket.server);
  }
  res.end();
}
