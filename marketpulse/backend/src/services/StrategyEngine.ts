import type { Candle, Signal, SignalType } from '../models/types.js';
import type { IndicatorSnapshot } from './IndicatorService.js';

export class StrategyEngine {
  private readonly lastSignal = new Map<string, SignalType>();

  evaluate(candle: Candle, indicators: IndicatorSnapshot): Signal | null {
    const reasons: string[] = [];
    const crossUp = indicators.previousEma9 <= indicators.previousEma21 && indicators.ema9 > indicators.ema21;
    const crossDown = indicators.previousEma9 >= indicators.previousEma21 && indicators.ema9 < indicators.ema21;
    const macdBullish = indicators.macd.macd > indicators.macd.signal && indicators.macd.histogram > 0;
    const macdBearish = indicators.macd.macd < indicators.macd.signal && indicators.macd.histogram < 0;
    const volumeBreakout = candle.volume > indicators.averageVolume;
    const aboveVwap = candle.close >= indicators.vwap;

    let type: SignalType | null = null;
    if (crossUp && indicators.rsi > 55 && macdBullish && volumeBreakout) {
      type = 'BUY'; reasons.push('EMA Cross', 'MACD Bullish', 'RSI Strong', 'Volume Breakout');
    }
    if (crossDown && indicators.rsi < 45 && macdBearish) {
      type = 'SELL'; reasons.push('EMA Cross Down', 'MACD Bearish', 'RSI Weak');
    }
    if (!type || this.lastSignal.get(candle.symbol) === type) return null;
    this.lastSignal.set(candle.symbol, type);
    const confidence = this.confidence(type, indicators, volumeBreakout, aboveVwap);
    const risk = type === 'BUY' ? { target: candle.close * 1.0125, stopLoss: candle.close * 0.9935 } : { target: candle.close * 0.9875, stopLoss: candle.close * 1.0065 };
    return { symbol: candle.symbol, signal: type, entry: Math.round(candle.close * 100) / 100, target: Math.round(risk.target * 100) / 100, stopLoss: Math.round(risk.stopLoss * 100) / 100, confidence, reason: reasons, createdAt: new Date().toISOString() };
  }

  private confidence(type: SignalType, indicators: IndicatorSnapshot, volumeBreakout: boolean, aboveVwap: boolean): number {
    const emaOk = type === 'BUY' ? indicators.ema9 > indicators.ema21 : indicators.ema9 < indicators.ema21;
    const macdOk = type === 'BUY' ? indicators.macd.macd > indicators.macd.signal : indicators.macd.macd < indicators.macd.signal;
    const rsiOk = type === 'BUY' ? indicators.rsi > 55 : indicators.rsi < 45;
    return (emaOk ? 30 : 0) + (macdOk ? 20 : 0) + (rsiOk ? 20 : 0) + (aboveVwap ? 10 : 0) + (volumeBreakout ? 20 : 0);
  }
}
