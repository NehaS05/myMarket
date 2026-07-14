# MarketPulse AI

MarketPulse AI is an in-memory real-time Indian stock market BUY/SELL signal MVP. The backend logs in to Angel One SmartAPI, connects to the feed WebSocket, builds 1-minute candles, calculates EMA, RSI, MACD, VWAP and volume signals, and broadcasts `signal-generated` events to the Next.js dashboard.

## Structure

- `backend/` Node.js 22, TypeScript, Express, Socket.IO, ws, Axios.
- `frontend/` Next.js 15, React 19, TypeScript, Tailwind CSS, Socket.IO Client.
- `shared/` placeholder for shared contracts.

## Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Set Angel One credentials in `backend/.env` for live market data. If credentials are omitted, the backend starts a mock in-memory feed by default so the dashboard can still be run locally. Stocks are loaded from `backend/src/config/stocks.json` and can be reloaded with `POST /stocks/reload`.

### REST APIs

- `GET /health`
- `GET /market/status`
- `GET /signals/latest`
- `GET /stocks`
- `POST /stocks/reload`

## Frontend setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deployment

### Backend on Render Free

1. Create a new Web Service.
2. Root directory: `marketpulse/backend`.
3. Build command: `npm install && npm run build`.
4. Start command: `npm start`.
5. Add the variables from `.env.example`, including Angel One credentials and `CORS_ORIGIN` pointing to the Vercel URL.

### Frontend on Vercel

1. Import the repository in Vercel.
2. Root directory: `marketpulse/frontend`.
3. Set `NEXT_PUBLIC_BACKEND_URL` to the Render service URL.
4. Deploy.

## Notes

No database, Redis, Docker, or authentication is used. Recent candles, latest signals, mock-feed state, and duplicate-prevention state are stored only in memory.
