import type { Server } from 'socket.io';
import { logger } from '../utils/logger.js';
export function registerSocket(io: Server): void {
  io.on('connection', (socket) => { logger.info('Socket.IO client connected', socket.id); socket.on('disconnect', () => logger.info('Socket.IO client disconnected', socket.id)); });
}
