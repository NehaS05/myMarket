import WebSocket from 'ws';
import type { StockConfig, Tick } from '../models/types.js';
import type { AngelSession } from './AngelOneService.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private connected = false;
  constructor(private readonly onTick: (tick: Tick) => void, private readonly getSession: () => Promise<AngelSession>, private stocks: StockConfig[]) {}
  async connect(): Promise<void> {
    const session = await this.getSession();
    this.ws = new WebSocket(env.angel.wsUrl, { headers: { Authorization: `Bearer ${session.jwtToken}`, 'x-api-key': session.apiKey, 'x-client-code': session.clientCode, 'x-feed-token': session.feedToken } });
    this.ws.on('open', () => { this.connected = true; logger.info('WebSocket Connected'); this.subscribe(); });
    this.ws.on('message', (raw) => this.handleMessage(raw));
    this.ws.on('close', () => this.scheduleReconnect());
    this.ws.on('error', (error) => { logger.error('WebSocket error', error); this.scheduleReconnect(); });
  }
  isConnected(): boolean { return this.connected; }
  setStocks(stocks: StockConfig[]): void { this.stocks = stocks; if (this.connected) this.subscribe(); }
  private subscribe(): void {
    const tokenList = [{ exchangeType: 1, tokens: this.stocks.map((stock) => stock.token) }];
    this.ws?.send(JSON.stringify({ correlationID: `marketpulse-${Date.now()}`, action: 1, params: { mode: 1, tokenList } }));
    logger.info('Subscribed Stocks', this.stocks.map((stock) => stock.symbol));
  }
  private handleMessage(raw: WebSocket.RawData): void {
    const text = raw.toString();
    try {
      const parsed = JSON.parse(text) as { token?: string; last_traded_price?: number; volume_trade_for_the_day?: number };
      const stock = this.stocks.find((item) => item.token === parsed.token);
      if (!stock || parsed.last_traded_price === undefined) return;
      logger.info('Tick Received', { symbol: stock.symbol });
      this.onTick({ token: stock.token, symbol: stock.symbol, ltp: parsed.last_traded_price / 100, volume: parsed.volume_trade_for_the_day ?? 0, timestamp: Date.now() });
    } catch { /* Angel One may send binary heartbeat packets; ignore unparsed frames. */ }
  }
  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.connected = false;
    logger.warn('Reconnect scheduled in 5 seconds');
    this.reconnectTimer = setTimeout(() => { this.reconnectTimer = null; void this.connect(); }, 5000);
  }
}
