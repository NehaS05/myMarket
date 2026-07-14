import { Router } from 'express';
import type { NotificationService } from '../services/NotificationService.js';
import type { MarketStatus, StockConfig } from '../models/types.js';
export function createRoutes(deps: { notifications: NotificationService; status: () => MarketStatus; stocks: () => StockConfig[]; reloadStocks: () => Promise<StockConfig[]> }): Router {
  const router = Router();
  router.get('/health', (_req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));
  router.get('/market/status', (_req, res) => res.json(deps.status()));
  router.get('/signals/latest', (_req, res) => res.json(deps.notifications.getLatest()));
  router.get('/stocks', (_req, res) => res.json(deps.stocks()));
  router.post('/stocks/reload', async (_req, res, next) => { try { res.json(await deps.reloadStocks()); } catch (error) { next(error); } });
  return router;
}
