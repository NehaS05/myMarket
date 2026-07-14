import type { Candle } from '../models/types.js';
export class VWAP {
  static calculate(candles: Candle[]): number | null {
    let pv = 0; let volume = 0;
    for (const candle of candles) {
      const typical = (candle.high + candle.low + candle.close) / 3;
      pv += typical * candle.volume; volume += candle.volume;
    }
    return volume === 0 ? null : pv / volume;
  }
}
