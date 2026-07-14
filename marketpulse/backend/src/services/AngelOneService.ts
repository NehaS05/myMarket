import axios from 'axios';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
export interface AngelSession { jwtToken: string; feedToken: string; clientCode: string; apiKey: string }
export class AngelOneService {
  private session: AngelSession | null = null;
  async login(): Promise<AngelSession> {
    if (!env.angel.apiKey || !env.angel.clientCode || !env.angel.password) throw new Error('Angel One credentials are missing');
    logger.info('Angel One Login');
    const response = await axios.post(env.angel.loginUrl, { clientcode: env.angel.clientCode, password: env.angel.password, totp: env.angel.totp }, { headers: { 'X-PrivateKey': env.angel.apiKey, 'Content-Type': 'application/json', Accept: 'application/json' } });
    const data = response.data?.data;
    this.session = { jwtToken: data?.jwtToken, feedToken: data?.feedToken, clientCode: env.angel.clientCode, apiKey: env.angel.apiKey };
    if (!this.session.jwtToken || !this.session.feedToken) throw new Error('Angel One login did not return tokens');
    return this.session;
  }
  getSession(): AngelSession | null { return this.session; }
}
