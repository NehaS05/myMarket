'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { socket } from '@/lib/socket';
import type { MarketStatus, Signal, StockConfig } from '@/types/market';
import { SignalCard } from './SignalCard';

export function DashboardClient() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [status, setStatus] = useState<MarketStatus | null>(null);
  const [stocks, setStocks] = useState<StockConfig[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    void refreshDashboard();

    socket.connect();
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('signal-generated', (signal: Signal) => {
      setSignals((items) => [signal, ...items].slice(0, 50));
    });

    const interval = window.setInterval(() => {
      void api.status().then(setStatus).catch(() => undefined);
    }, 5000);

    return () => {
      window.clearInterval(interval);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('signal-generated');
      socket.disconnect();
    };
  }, []);

  async function refreshDashboard(): Promise<void> {
    const [marketStatus, latestSignals, watchlist] = await Promise.all([
      api.status(),
      api.signals(),
      api.stocks()
    ]);

    setStatus(marketStatus);
    setSignals(latestSignals);
    setStocks(watchlist);
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="Socket" value={connected ? 'Connected' : 'Disconnected'} />
        <Metric label="Feed" value={status?.websocketConnected ? 'Live' : 'Offline'} />
        <Metric label="Watchlist" value={`${status?.subscribedStocks ?? stocks.length}`} />
        <Metric
          label="Latest Signal"
          value={status?.latestSignalAt ? new Date(status.latestSignalAt).toLocaleTimeString() : '—'}
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Live Signals</h2>
          <div className="grid gap-4">
            {signals.length ? (
              signals.map((signal, index) => (
                <SignalCard signal={signal} key={`${signal.symbol}-${signal.createdAt}-${index}`} />
              ))
            ) : (
              <Empty text="Waiting for signal-generated notifications" />
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <h2 className="text-xl font-semibold">Watchlist</h2>
          {stocks.map((stock) => (
            <div className="rounded-xl bg-slate-900 p-4" key={stock.token}>
              {stock.symbol}
              <span className="float-right text-slate-500">{stock.token}</span>
            </div>
          ))}

          <h2 className="pt-4 text-xl font-semibold">Notification Center</h2>
          <Empty text="Socket.IO pushes BUY/SELL cards instantly without manual refresh." />
        </aside>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-700 p-6 text-slate-400">{text}</div>;
}
