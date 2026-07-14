import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  port: toNumber(process.env.PORT, 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  stocksFile: process.env.STOCKS_FILE ?? 'src/config/stocks.json',
  maxCandles: toNumber(process.env.MAX_CANDLES, 240),
  enableMockFeed: process.env.ENABLE_MOCK_FEED !== 'false',
  mockTickIntervalMs: toNumber(process.env.MOCK_TICK_INTERVAL_MS, 1000),
  angel: {
    apiKey: process.env.ANGEL_ONE_API_KEY ?? '',
    clientCode: process.env.ANGEL_ONE_CLIENT_CODE ?? '',
    password: process.env.ANGEL_ONE_PASSWORD ?? '',
    totp: process.env.ANGEL_ONE_TOTP ?? '',
    loginUrl:
      process.env.ANGEL_ONE_LOGIN_URL ??
      'https://apiconnect.angelbroking.com/rest/auth/angelbroking/user/v1/loginByPassword',
    wsUrl: process.env.ANGEL_ONE_WS_URL ?? 'wss://smartapisocket.angelone.in/smart-stream'
  }
};
