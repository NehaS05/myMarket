import type { MarketStatus, Signal, StockConfig } from '@/types/market';
export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000';
async function getJson<T>(path: string): Promise<T> { const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' }); if (!res.ok) throw new Error(`Request failed: ${path}`); return res.json() as Promise<T>; }
export const api = { status: () => getJson<MarketStatus>('/market/status'), signals: () => getJson<Signal[]>('/signals/latest'), stocks: () => getJson<StockConfig[]>('/stocks') };
