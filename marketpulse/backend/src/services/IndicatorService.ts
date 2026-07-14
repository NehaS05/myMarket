import { EMA } from '../indicators/EMA.js';
import { MACD } from '../indicators/MACD.js';
import { RSI } from '../indicators/RSI.js';
import { VWAP } from '../indicators/VWAP.js';
import type { Candle } from '../models/types.js';

export interface IndicatorSnapshot { ema9: number; ema21: number; previousEma9: number; previousEma21: number; rsi: number; macd: { macd: number; signal: number; histogram: number }; vwap: number; averageVolume: number }
export class IndicatorService {
  calculate(candles: Candle[]): IndicatorSnapshot | null {
    if (candles.length < 35) return null;
    const closes = candles.map((c) => c.close);
    const ema9 = EMA.calculate(closes, 9); const ema21 = EMA.calculate(closes, 21);
    const rsi = RSI.calculate(closes, 14); const macd = MACD.calculate(closes); const vwap = VWAP.calculate(candles);
    if (rsi === null || macd === null || vwap === null) return null;
    const recent = candles.slice(-20);
    const averageVolume = recent.reduce((sum, candle) => sum + candle.volume, 0) / recent.length;
    return { ema9: ema9.at(-1)!, ema21: ema21.at(-1)!, previousEma9: ema9.at(-2)!, previousEma21: ema21.at(-2)!, rsi, macd, vwap, averageVolume };
  }
}
