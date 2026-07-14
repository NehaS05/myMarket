import type { Candle, Tick } from '../models/types.js';
import { env } from '../config/env.js';

export class CandleBuilder {
  private readonly candles = new Map<string, Candle[]>();
  private readonly active = new Map<string, Candle>();

  addTick(tick: Tick): Candle | null {
    const bucket = Math.floor(tick.timestamp / 60000) * 60000;
    const current = this.active.get(tick.token);
    if (!current || current.startTime !== bucket) {
      if (current) this.store(current);
      this.active.set(tick.token, { symbol: tick.symbol, token: tick.token, startTime: bucket, open: tick.ltp, high: tick.ltp, low: tick.ltp, close: tick.ltp, volume: tick.volume });
      return current ?? null;
    }
    current.high = Math.max(current.high, tick.ltp); current.low = Math.min(current.low, tick.ltp); current.close = tick.ltp; current.volume += tick.volume;
    return null;
  }

  getCandles(token: string): Candle[] { return [...(this.candles.get(token) ?? [])]; }
  private store(candle: Candle): void {
    const list = this.candles.get(candle.token) ?? [];
    list.push(candle);
    if (list.length > env.maxCandles) list.shift();
    this.candles.set(candle.token, list);
  }
}
