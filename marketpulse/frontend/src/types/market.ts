export interface Signal { symbol: string; signal: 'BUY' | 'SELL'; entry: number; target: number; stopLoss: number; confidence: number; reason: string[]; createdAt: string }
export interface StockConfig { symbol: string; token: string }
export interface MarketStatus { angelLoggedIn: boolean; websocketConnected: boolean; subscribedStocks: number; latestSignalAt?: string }
