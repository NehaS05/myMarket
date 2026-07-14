import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';
import { env } from './config/env.js';
import type { StockConfig, Tick } from './models/types.js';
import { AngelOneService } from './services/AngelOneService.js';
import { CandleBuilder } from './services/CandleBuilder.js';
import { IndicatorService } from './services/IndicatorService.js';
import { MockMarketFeedService } from './services/MockMarketFeedService.js';
import { NotificationService } from './services/NotificationService.js';
import { StrategyEngine } from './services/StrategyEngine.js';
import { WebSocketService } from './services/WebSocketService.js';
import { createRoutes } from './routes/index.js';
import { registerSocket } from './socket/index.js';
import { logger } from './utils/logger.js';

let stocks: StockConfig[] = [];
let latestSignalAt: string | undefined;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: env.corsOrigin } });

const angel = new AngelOneService();
const candles = new CandleBuilder();
const indicators = new IndicatorService();
const strategy = new StrategyEngine();
const notifications = new NotificationService(io);

let wsService: WebSocketService | null = null;
let mockFeed: MockMarketFeedService | null = null;

async function loadStocks(): Promise<StockConfig[]> {
  const file = path.resolve(process.cwd(), env.stocksFile);
  const content = await fs.readFile(file, 'utf8');

  stocks = JSON.parse(content) as StockConfig[];
  wsService?.setStocks(stocks);
  mockFeed?.setStocks(stocks);

  return stocks;
}

function onTick(tick: Tick): void {
  const closed = candles.addTick(tick);
  if (!closed) return;

  const snapshot = indicators.calculate(candles.getCandles(closed.token));
  if (!snapshot) return;

  const signal = strategy.evaluate(closed, snapshot);
  if (!signal) return;

  latestSignalAt = signal.createdAt;
  notifications.publish(signal);
}

function hasAngelCredentials(): boolean {
  return Boolean(env.angel.apiKey && env.angel.clientCode && env.angel.password);
}

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
registerSocket(io);
app.use(
  createRoutes({
    notifications,
    stocks: () => stocks,
    reloadStocks: loadStocks,
    status: () => ({
      angelLoggedIn: Boolean(angel.getSession()),
      websocketConnected: wsService?.isConnected() ?? mockFeed?.isRunning() ?? false,
      subscribedStocks: stocks.length,
      latestSignalAt
    })
  })
);
app.use(
  (error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error('Request failed', error);
    res.status(500).json({ error: error.message });
  }
);

async function bootstrap(): Promise<void> {
  logger.info('Application Started');
  await loadStocks();

  if (hasAngelCredentials()) {
    wsService = new WebSocketService(onTick, async () => angel.getSession() ?? (await angel.login()), stocks);
    await wsService.connect();
  } else if (env.enableMockFeed) {
    mockFeed = new MockMarketFeedService(onTick, stocks);
    mockFeed.start();
  } else {
    logger.warn('Angel One credentials are missing and mock feed is disabled');
  }

  server.listen(env.port, () => logger.info(`Backend listening on ${env.port}`));
}

void bootstrap().catch((error) => {
  logger.error('Startup failed', error);
  process.exitCode = 1;
});
