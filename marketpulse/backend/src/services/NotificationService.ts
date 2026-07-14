import type { Server } from 'socket.io';
import type { Signal } from '../models/types.js';
import { logger } from '../utils/logger.js';
export class NotificationService {
  private readonly latest: Signal[] = [];
  constructor(private readonly io: Server) {}
  publish(signal: Signal): void {
    this.latest.unshift(signal); this.latest.splice(100);
    logger.info('Signal Generated', signal);
    this.io.emit('signal-generated', signal);
  }
  getLatest(): Signal[] { return [...this.latest]; }
}
