import { EMA } from './EMA.js';
export interface MACDValue { macd: number; signal: number; histogram: number }
export class MACD {
  static calculate(values: number[]): MACDValue | null {
    if (values.length < 35) return null;
    const ema12 = EMA.calculate(values, 12);
    const ema26 = EMA.calculate(values, 26);
    const line = values.map((_, i) => ema12[i] - ema26[i]);
    const signalLine = EMA.calculate(line, 9);
    const macd = line[line.length - 1]; const signal = signalLine[signalLine.length - 1];
    return { macd, signal, histogram: macd - signal };
  }
}
