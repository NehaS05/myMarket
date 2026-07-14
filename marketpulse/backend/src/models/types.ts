export type SignalType = 'BUY' | 'SELL';
export interface StockConfig { symbol: string; token: string; exchangeType?: number }
export interface Tick { token: string; symbol: string; ltp: number; volume: number; timestamp: number }
export interface Candle { symbol: string; token: string; startTime: number; open: number; high: number; low: number; close: number; volume: number }
export interface Signal { symbol: string; signal: SignalType; entry: number; target: number; stopLoss: number; confidence: number; reason: string[]; createdAt: string }
export interface MarketStatus { angelLoggedIn: boolean; websocketConnected: boolean; subscribedStocks: number; latestSignalAt?: string }
