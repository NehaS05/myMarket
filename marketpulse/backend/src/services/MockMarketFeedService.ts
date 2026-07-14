import type { StockConfig, Tick } from '../models/types.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

interface MockState {
  price: number;
  volume: number;
  step: number;
}

export class MockMarketFeedService {
  private timer: NodeJS.Timeout | null = null;
  private readonly state = new Map<string, MockState>();

  constructor(
    private readonly onTick: (tick: Tick) => void,
    private stocks: StockConfig[]
  ) {}

  start(): void {
    if (this.timer) return;

    logger.warn('Starting mock market feed because Angel One credentials are not configured');
    this.timer = setInterval(() => this.emitTicks(), env.mockTickIntervalMs);
  }

  stop(): void {
    if (!this.timer) return;

    clearInterval(this.timer);
    this.timer = null;
  }

  setStocks(stocks: StockConfig[]): void {
    this.stocks = stocks;
  }

  isRunning(): boolean {
    return Boolean(this.timer);
  }

  private emitTicks(): void {
    for (const stock of this.stocks) {
      const state = this.getState(stock);
      state.step += 1;

      const trend = Math.sin(state.step / 9) * 3 + Math.cos(state.step / 17) * 1.5;
      const impulse = state.step % 45 === 0 ? 18 : 0;
      state.price = Math.max(1, state.price + trend + impulse - 1.2);
      state.volume = Math.max(100, state.volume + 50 + Math.round(Math.abs(trend) * 100));

      this.onTick({
        token: stock.token,
        symbol: stock.symbol,
        ltp: Number(state.price.toFixed(2)),
        volume: state.volume,
        timestamp: Date.now()
      });
    }
  }

  private getState(stock: StockConfig): MockState {
    const existing = this.state.get(stock.token);
    if (existing) return existing;

    const seed = Number(stock.token.slice(-3)) || 100;
    const initialState = {
      price: 1000 + seed,
      volume: 1000,
      step: 0
    };

    this.state.set(stock.token, initialState);
    return initialState;
  }
}
